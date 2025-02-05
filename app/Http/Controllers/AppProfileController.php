<?php

namespace App\Http\Controllers;

use App\Events\ApplicationCreated;
use App\Events\ApplicationUpdated;
use App\Models\AppMember;
use App\Models\AppProfile;
use App\Models\AppStatus;
use App\Models\Document;
use App\Models\EthicsClearance;
use App\Models\PanelMember;
use Exception;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;
use function auth;

class AppProfileController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response|JsonResponse
    {
        $user = auth()->user();
        $page = $request->input('page', 1);

        $filters = $request->only(['query', 'reviewType', 'step', 'dateRange', 'status']);

        $countApplications = AppProfile::count();
        if ($countApplications === 0) {
            return Inertia::render('Application/Index', [
                'canCreate' => auth()->user()->can('create', AppProfile::class),
                'canDelete' => FALSE,
                'applications' => [],
            ]);
        }

        if (isset($page) && $countApplications <= 10 && intval($page) > 1) {
            $page = 1;
        }

        $applications = AppProfile::query()
            ->select(['id', 'user_id', 'firstname', 'lastname', 'research_title', 'date_applied', 'protocol_code', 'review_type'])
            ->withCount('members')
            ->with(['statuses' => function ($query) {
                $query->select('id', 'app_profile_id', 'name', 'sequence', 'status')
                    ->orderBy('sequence', 'desc')
                    ->take(1);
            }])->when($filters['query'] ?? null, function (Builder $query, $search) {
                return $query->whereRaw('LOWER(research_title) LIKE ?', [strtolower("%$search%")])
                    ->orWhereRaw('LOWER(firstname) LIKE ?', [strtolower("%$search%")])
                    ->orWhereRaw('LOWER(lastname) LIKE ?', [strtolower("%$search%")]);
            })->when($filters['reviewType'] ?? null, function (Builder $query, $reviewType) {
                return $query->where('review_type', $reviewType);
            })->when($filters['step'] ?? null, function ($query, $step) {
                return $query->whereHas('statuses', function ($q) use ($step) {
                    $q->where('sequence', '>=', intval($step));
                });
            })->when($filters['dateRange'] ?? null, function (Builder $query) use ($filters) {
                $start = Carbon::parse($filters['dateRange']['start'])->startOfDay();
                $end = Carbon::parse($filters['dateRange']['end'])->endOfDay();

                return $query->whereBetween('date_applied', [$start, $end]);
            })->when($filters['status'] ?? null, function ($query, $status) {
                return $query->whereHas('statuses', function (Builder $q) use ($status) {
                    $commonStatus = ['Approved', 'Assigned', 'Done', 'Signed', 'Completed', 'In Progress'];

                    if (!in_array($status, $commonStatus)) {
                        $q->whereNotIn('status', $commonStatus);
                    }
                    else {
                        $q->where('status', $status);
                    }

                    return $q->orderBy('sequence', 'desc')->limit(1);
                });
            })->when($user->role === 'researcher', function (Builder $query) use ($user) {
                return $query->where('user_id', $user->id);
            })->orderByDesc('updated_at')
            ->paginate(10, page: $page);

        $canCreate = auth()->user()->can('create', AppProfile::class);
        $canDelete = $applications->contains(function ($application) {
            return Gate::inspect('delete', $application)->allowed();
        });

        if ($request->wantsJson()) {
            return response()->json([
                'canCreate' => $canCreate,
                'canDelete' => $canDelete,
                'applications' => $applications,
            ]);
        }

        return Inertia::render('Application/Index', [
            'canCreate' => $canCreate,
            'canDelete' => $canDelete,
            'applications' => $applications,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @throws AuthorizationException
     * @throws Throwable
     */
    public function store(Request $request): RedirectResponse|JsonResponse
    {
        try {
            Gate::authorize('create', AppProfile::class);
        } catch (AuthorizationException) {
            return to_route('applications.index');
        }

        // decode the members array
        $request->merge([
            'members' => json_decode($request->members, TRUE),
            'documents' => $request->file('documents'),
        ]);

        $validated = $request->validate([
            'research_title' => 'required|string',
            'firstname' => 'required|string',
            'lastname' => 'required|string',
            'members' => 'array',
            'documents' => 'required|array',
            'documents.*' => 'required|file|mimes:pdf,doc,docx',
        ]);

        $appProfile = new AppProfile();

        DB::beginTransaction();

        try {
            $appProfile->user_id = auth()->id();
            $appProfile->firstname = $validated['firstname'];
            $appProfile->lastname = $validated['lastname'];
            $appProfile->research_title = $validated['research_title'];
            $appProfile->date_applied = now();
            $appProfile->save();

            $documents = [];
            $members = [
                new AppMember([
                    'firstname' => $validated['firstname'],
                    'lastname' => $validated['lastname'],
                ]),
            ];

            if (count($validated['members']) != 0) {
                foreach ($validated['members'] as $member) {
                    $members[] = new AppMember([
                        'firstname' => $member['firstname'],
                        'lastname' => $member['lastname'],
                    ]);
                }
            }

            foreach ($request->file('documents') as $file) {
                $path = Storage::disk('public')->putFileAs(
                    'documents/' . $appProfile->id,
                    $file,
                    $file->getClientOriginalName(),
                );

                $documents[] = new Document([
                    'file_url' => $path,
                ]);
            }

            $appProfile->statuses()->create([
                'name' => 'Application Submission',
                'sequence' => 1,
                'status' => 'In Progress',
                'start' => now(),
            ]);
            $appProfile->members()->saveMany($members);
            $appProfile->documents()->saveMany($documents);

            broadcast(new ApplicationCreated($appProfile))->toOthers();

            DB::commit();
        } catch (Exception) {
            DB::rollBack();

            return response(status: 500)->json([
                'message' => 'An error occurred while creating the application profile.',
                'error' => TRUE,
            ]);
        }

        return to_route('applications.show', ['application' => $appProfile]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return Response|RedirectResponse
     */
    public function create(): Response|RedirectResponse
    {
        try{
            Gate::authorize('create', AppProfile::class);
        } catch (AuthorizationException) {
            return to_route('applications.index');
        }

        return Inertia::render('Application/Create');
    }

    /**
     * Display the specified resource.
     */
    public function show(AppProfile $application): Response|RedirectResponse
    {
        try {
            Gate::authorize('view', $application);
        } catch (AuthorizationException) {
            return to_route('applications.index');
        }

        // Eager load the relationships
        $application->load([
            'members:id,app_profile_id,firstname,lastname',
            'statuses' => function (HasMany $query) {
                $query->select('id', 'app_profile_id', 'name', 'sequence', 'status', 'start', 'end')
                    ->with('messages', function (HasMany $query) {
                        $monthsAgo = Carbon::now()->subMonths(3);

                        $query->select('id', 'app_status_id', 'remarks', 'by', 'created_at', 'read_status')
                            ->where('created_at', '>=', $monthsAgo);
                    });
            },
            'requirements:id,app_profile_id,name,file_url,date_uploaded,status,is_additional',
            'meeting:id,app_profile_id,meeting_date,status',
            'documents:id,app_profile_id,review_result_id,file_url,version,original_document_id,status,created_at',
            'decisionLetter:id,app_profile_id,file_name,file_path,date_uploaded,is_signed',
            'reviewResults:id,app_profile_id,name,file_url,date_uploaded,status,reviewed_document_ids,feedback,created_at',
            'panels:id,app_profile_id,firstname,lastname',
            'ethicsClearance:id,app_profile_id,file_url,date_clearance,date_uploaded',
        ]);

        return Inertia::render('Application/Show', [
            'application' => $application,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(AppProfile $application)
    {
        $application->delete();

        $page = request()->query('page') ?? 1;
        $applications = AppProfile::orderByDesc('updated_at')
            ->paginate(10, columns: ['id', 'user_id', 'research_title', 'date_applied', 'protocol_code'], page: $page);

        return response()->json([
            'message' => "$application->research_title has been deleted.",
            'applications' => $applications,
        ]);
    }

    public function uploadPayment(Request $request, AppProfile $application)
    {
        $paymentFile = $request->file('file');
        $paymentDetails = $request->payment_details;
        $message = $request->message;
        $currentDateTime = Carbon::now();

        $application->load('statuses');

        $status = $application->statuses()->latest()->first();
        $status->status = 'Done';
        $status->end = $currentDateTime;

        $newStatus = new AppStatus([
            'name' => 'Assignment of Panel & Meeting Schedule',
            'sequence' => $status->sequence + 1,
            'status' => 'In Progress',
            'start' => $currentDateTime,
        ]);

        $path = Storage::disk('public')->putFile("payments/$application->id", $paymentFile);

        DB::beginTransaction();

        try {
            $application->update([
                'payment_details' => $paymentDetails,
                'payment_date' => $currentDateTime,
                'proof_of_payment_url' => $path,
            ]);
            $application->statuses()->saveMany([$status, $newStatus]);

            DB::commit();

            $application->load('statuses')->refresh();

            broadcast(new ApplicationUpdated($application, message: $message))->toOthers();
        } catch (Exception) {
            DB::rollBack();
            Storage::disk('public')->delete($path);

            return response()->json([
                'message' => 'An error occurred while uploading the payment receipt.',
                'error' => TRUE,
            ]);
        }

        return response()->json([
            'message' => $message ?? 'Payment receipt has been uploaded.',
            'proof_of_payment_url' => $path,
            'payment_details' => $paymentDetails,
            'payment_date' => $application->payment_date,
            'statuses' => $application->statuses,
        ]);
    }

    /**
     * Updating the application also updates the status of the application.
     */
    public function update(Request $request, AppProfile $application)
    {
        $protocolCode = $request->protocol_code;
        $reviewType = $request->review_type;

        $message = $request->message;

        $status = $application->statuses()->find($request->status_id);

        if (!empty($protocolCode)) {
            $application->protocol_code = $protocolCode;
            $application->protocol_date_updated = now();
        }

        if (!empty($reviewType)) {
            $application->review_type = $reviewType;
        }

        DB::transaction(function () use (&$application, &$status, $request, $message) {
            if ($application->isDirty()) {
                $application->save();
            }

            if (!empty($status)) {
                $status->status = $request->new_status;
                $status->end = $request->is_completed ? now() : NULL;

                $application->statuses()->save($status);
            }

            if (!empty($request->is_completed) && !empty($request->next_status)) {
                $newStatus = new AppStatus([
                    'name' => $request->next_status,
                    'sequence' => $status->sequence == 10 ? 10 : $status->sequence + 1,
                    'status' => 'In Progress',
                    'start' => now(),
                ]);

                $application->statuses()->save($newStatus);
            }

            $application->load('statuses')->refresh();
            $status->refresh();

            broadcast(new ApplicationUpdated($application, message: $message))->toOthers();
        });

        return response()->json([
            'message' => $message ?? "$application->research_title has been updated.",
            'application' => $application,
        ]);
    }

    public function assignPanelMeeting(Request $request, AppProfile $application)
    {
        $validated = $request->validate([
            'panel_members' => 'required|json',
            'meeting_date' => 'required|string',
        ]);
        $validated['panel_members'] = json_decode($validated['panel_members'], true);
        $validated['meeting_date'] = Carbon::parse($validated['meeting_date']);

        $message = "Panel members and meeting schedule have been assigned.";
        $currentDateTime = now();

        $application->load('statuses');

        $latestStatus = $application->statuses()->latest()->first();
        $latestStatus->status = 'Done';
        $latestStatus->end = $currentDateTime;

        $newStatus = new AppStatus([
            'name' => 'Review Result',
            'sequence' => $latestStatus->sequence + 1,
            'status' => 'In Progress',
            'start' => $currentDateTime,
        ]);

        $meeting = [
            'meeting_date' => $validated['meeting_date'],
            'status' => 'Scheduled',
        ];

        try {
            DB::transaction(function () use (&$application, $latestStatus, $newStatus, $meeting, $validated) {
                $application->statuses()->saveMany([$latestStatus, $newStatus]);
                $application->meeting()->create($meeting);

                $panelData = collect($validated['panel_members'])->map(function ($member) {
                    return new PanelMember([
                        'firstname' => $member['firstname'],
                        'lastname' => $member['lastname'],
                    ]);
                })->all();

                $application->panels()->saveMany($panelData);
            });

            $application->load(['statuses' => function ($query) {
                $query->latest();
            }, 'panels', 'meeting']);

            broadcast(new ApplicationUpdated($application, message: $message))->toOthers();

            return response()->json([
                'message' => $message,
                'meeting' => $application->meeting,
                'panels' => $application->panels,
                'updated_status' => $latestStatus,
                'new_status' => $newStatus,
            ]);
        } catch (Exception $e) {
            Log::error('Panel meeting assignment failed', [
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'message' => 'An error occurred while assigning the panel members and meeting schedule.',
                'error' => true,
            ], 422);
        }
    }

    public function uploadEthicsClearance(Request $request, AppProfile $application)
    {
        $validated = $request->validate([
            'file' => 'required|file|mimes:pdf,doc,docx',
            'date_clearance' => 'required|string',
            'message' => 'required|string',
        ]);
        $validated['date_clearance'] = Carbon::parse($validated['date_clearance']);

        $path = Storage::disk('public')->putFileAs(
            "ethics-clearance/$application->id",
            $validated['file'],
            $validated['file']->getClientOriginalName(),
        );

        $status = $application->statuses()->latest()->first();
        $status->status = 'Completed';
        $status->end = now();

        $ethicsClearance = new EthicsClearance([
            'file_url' => $path,
            'date_clearance' => $validated['date_clearance'],
            'date_uploaded' => now(),
        ]);

        DB::beginTransaction();

        try {
            $application->ethicsClearance()->save($ethicsClearance);
            $application->statuses()->save($status);
            DB::commit();

            $application->load([
                'ethicsClearance',
                'statuses' => function ($query) {
                    $query->latest()->first();
                },
            ]);

            broadcast(new ApplicationUpdated($application, message: $validated['message']))->toOthers();
        } catch (Exception $e) {
            DB::rollBack();
            Log::error($e->getMessage());
            Storage::disk('public')->delete($path);

            return response()->json([
                'message' => 'Something went wrong while uploading the ethics clearance document.',
                'error' => true,
            ], 422);
        }

        return response()->json([
            'message' => $validated['message'],
            'ethics_clearance' => $application->ethicsClearance,
        ]);
    }
}
