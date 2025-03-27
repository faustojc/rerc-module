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
use App\Models\ReviewerReport;
use Exception;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Cache;
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
        $data = $request->validate([
            'page' => 'nullable|numeric',
            'query' => 'nullable|string',
            'reviewType' => 'nullable|string',
            'step' => 'nullable|string',
            'dateRange' => 'nullable|array',
            'status' => 'nullable|string',
            'selectedStep' => 'nullable|integer',
        ]);

        $page = $data['page'] ?? 1;

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

        // create a cache key using hash
        $cacheKey = md5(json_encode($data));

        $applications = Cache::flexible($cacheKey, [50, 90], function () use ($data, $user, $page) {
            return AppProfile::query()
                ->select(['id', 'user_id', 'firstname', 'lastname', 'research_title', 'date_applied', 'protocol_code', 'protocol_date_updated', 'is_hardcopy', 'review_type'])
                ->withCount('members')
                ->with(['statuses' => function (HasMany $query) {
                    $query->select('id', 'app_profile_id', 'name', 'sequence', 'status')
                        ->orderBy('sequence', 'desc')
                        ->take(1);
                }])->when($data['selectedStep'] ?? null, function (Builder $query, $step) {
                    return $query->whereHas('statuses', function (Builder $q) use ($step) {
                        return $q->where('sequence', $step)
                            ->where('end', null);
                    });
                })->when($data['query'] ?? null, function (Builder $query, $search) {
                    return $query->whereRaw('LOWER(research_title) LIKE ?', [strtolower("%$search%")])
                        ->orWhereRaw('LOWER(firstname) LIKE ?', [strtolower("%$search%")])
                        ->orWhereRaw('LOWER(lastname) LIKE ?', [strtolower("%$search%")]);
                })->when($data['reviewType'] ?? null, function (Builder $query, $reviewType) {
                    return $query->where('review_type', $reviewType);
                })->when($data['step'] ?? null, function (Builder $query, $step) {
                    return $query->has('statuses', '<=', intval($step));
                })->when($data['dateRange'] ?? null, function (Builder $query) use ($data) {
                    $start = Carbon::parse($data['dateRange']['start'])->startOfDay();
                    $end = Carbon::parse($data['dateRange']['end'])->endOfDay();

                    return $query->whereBetween('date_applied', [$start, $end]);
                })->when($data['status'] ?? null, function ($query, $status) {
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
        });

        $canCreate = $user->can('create', AppProfile::class);
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
            'research_type' => 'required|string',
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
            $appProfile->research_type = $validated['research_type'];
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

        $veryLongTTL = now()->addWeeks(2); // for rarely to no change and always read
        $shortTTL = now()->addMinutes(5);

        $latestSequence = $application->statuses->max('sequence') ?? 1;

        $members = Cache::remember(
            "application.{$application->id}.members",
            $veryLongTTL,
            function () use ($application) {
                return $application->members()->select('id', 'app_profile_id', 'firstname', 'lastname')->get();
            },
        );
        $application->setRelation('members', $members);

        if ($latestSequence >= 4) {
            $reviewTypeLogs = Cache::remember(
                "application.{$application->id}.reviewTypeLogs",
                $shortTTL,
                function () use ($application) {
                    return $application->reviewTypeLogs()->select('id', 'app_profile_id', 'review_type', 'assigned_by', 'created_at')->get();
                },
            );

            $application->setRelation('reviewTypeLogs', $reviewTypeLogs);
        }

        if ($latestSequence >= 5) {
            $decisionLetter = Cache::remember(
                "application.{$application->id}.decisionLetter",
                now()->addMinutes(60),
                function () use ($application) {
                    return $application->decisionLetter()->first();
                },
            );
            $application->setRelation('decisionLetter', $decisionLetter);
        }

        if ($latestSequence >= 7) {
            $meeting = Cache::remember(
                "application.{$application->id}.meeting",
                $veryLongTTL,
                function () use ($application) {
                    return $application->meeting()->select('id', 'app_profile_id', 'meeting_date', 'status')->first();
                },
            );
            $panels = Cache::remember(
                "application.{$application->id}.panels",
                $veryLongTTL,
                function () use ($application) {
                    return $application->panels()->select('id', 'app_profile_id', 'firstname', 'lastname')->get();
                },
            );

            $application->setRelation('panels', $panels);
            $application->setRelation('meeting', $meeting);
        }

        if ($latestSequence >= 8) {
            $reviewResults = Cache::remember(
                "application.{$application->id}.reviewResults",
                now()->addMinutes(10),
                function () use ($application) {
                    return $application->reviewResults()
                        ->select(['id', 'app_profile_id', 'name', 'file_url', 'date_uploaded', 'status', 'version'])
                        ->orderByDesc('date_uploaded')
                        ->get();
                },
            );
            $application->setRelation('reviewResults', $reviewResults);
        }

        if ($latestSequence == 10) {
            $ethicsClearance = Cache::remember(
                "application.{$application->id}.ethicsClearance",
                $veryLongTTL,
                function () use ($application) {
                    return $application->ethicsClearance()->first();
                },
            );
            $application->setRelation('ethicsClearance', $ethicsClearance);
        }

        $requirements = Cache::remember(
            "application.{$application->id}.requirements",
            $shortTTL,
            function () use ($application) {
                return $application->requirements()->select('id', 'app_profile_id', 'name', 'file_url', 'date_uploaded', 'status', 'is_additional')->get();
            },
        );
        $application->setRelation('requirements', $requirements);

        // Cache 'documents': dynamic – short TTL (5 minutes)
        $documents = Cache::remember(
            "application.{$application->id}.documents",
            $shortTTL,
            function () use ($application) {
                return $application->documents()->get();
            },
        );
        $application->setRelation('documents', $documents);

        // Cache 'reviewerReports': moderate TTL (10 minutes)
        $reviewerReports = Cache::remember(
            "application.{$application->id}.reviewerReports",
            now()->addMinutes(10),
            function () use ($application) {
                return $application->reviewerReports()->get();
            },
        );
        $application->setRelation('reviewerReports', $reviewerReports);

        // Cache 'messagePost': dynamic – short TTL (5 minutes)
        $messagePost = Cache::flexible(
            "application.{$application->id}.messagePost",
            [now()->addMinutes(5), now()->addMinutes(10)],
            function () use ($application) {
                return $application->messagePost()->get();
            },
        );
        $application->setRelation('messagePost', $messagePost);

        $statuses = Cache::remember(
            "application.{$application->id}.statuses",
            $shortTTL,
            function () use ($application) {
                return $application->statuses()
                    ->select('id', 'app_profile_id', 'name', 'sequence', 'status', 'start', 'end')
                    ->orderBy('sequence')
                    ->with(['messages' => function ($query) {
                        $monthsAgo = Carbon::now()->subMonths(3);
                        return $query->where('created_at', '>=', $monthsAgo)->get();
                    }])
                    ->get();
            },
        );
        $application->setRelation('statuses', $statuses);

        return Inertia::render('Application/Show', [
            'application' => $application,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(AppProfile $application): JsonResponse
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

    /**
     * @throws Throwable
     */
    public function uploadPayment(Request $request, AppProfile $application): JsonResponse
    {
        $data = $request->validate([
            'file' => 'required|file',
            'payment_details' => 'nullable|string',
            'message' => 'nullable|string',
        ]);
        $currentDateTime = Carbon::now();

        $application->load('statuses');

        $status = $application->statuses()->where('sequence', '=', 6)->first();
        $status->status = 'Awaiting Confirmation';

        $path = Storage::disk('public')->putFile("payments/$application->id", $data['file']);

        DB::beginTransaction();

        try {
            $application->update([
                'payment_details' => $data['payment_details'] ?? NULL,
                'payment_date' => $currentDateTime,
                'proof_of_payment_url' => $path,
            ]);
            $application->statuses()->save($status);

            DB::commit();

            $application->load([
                'statuses' => fn (HasMany $query) => $query->where('sequence', '=', 6)->first(),
            ])->refresh();

            broadcast(new ApplicationUpdated($application, message: $data['message']))->toOthers();
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
            'payment_details' => $data['payment_details'],
            'payment_date' => $application->payment_date,
            'statuses' => $application->statuses,
        ]);
    }

    /**
     * Updating the application also updates the status of the application.
     *
     * @throws Throwable
     */
    public function update(Request $request, AppProfile $application): JsonResponse
    {
        $data = $request->validate([
            'protocol_code' => 'required|string',
            'is_hardcopy' => 'required|boolean',
            'message' => 'nullable|string',
            'status_id' => 'required|string',
            'can_proceed' => 'nullable|boolean',
        ]);

        if ($application->where('protocol_code', '=', $data['protocol_code'])->exists()) {
            return response()->json([
                'message' => 'Protocol code already exists.',
                'error' => true,
            ], 422);
        }

        $status = $application->statuses()->find($data['status_id']);

        DB::transaction(function () use (&$application, &$status, $data) {
            $application->protocol_code = $data['protocol_code'];
            $application->protocol_date_updated = now();
            $application->is_hardcopy = $data['is_hardcopy'];
            $application->save();

            if ($data['can_proceed']) {
                $status->status = "Assigned";
                $status->end = now();

                $nextStatus = new AppStatus([
                    'name' => "Initial Review",
                    'sequence' => 3,
                    'status' => 'In Progress',
                    'start' => now(),
                ]);

                $application->statuses()->saveMany([$status, $nextStatus]);
            }

            $application->load('statuses')->refresh();
            $status->refresh();

            $message = $data['message'] ?? "Protocol code has been assigned to $application->protocol_code.";

            broadcast(new ApplicationUpdated($application, message: $message))->toOthers();
        });

        return response()->json([
            'message' => $data['message'] ?? "$application->research_title has been updated.",
            'application' => $application,
        ]);
    }

    /**
     * @throws Throwable
     */
    public function confirmPayment(Request $request, AppProfile $application): JsonResponse
    {
        $validated = $request->validate([
            'can_confirm' => 'required|boolean',
            'name' => 'required|string',
        ]);

        DB::transaction(function () use (&$application, $validated) {
            $confirmStatus = $validated['can_confirm'] ? 'Confirmed' : 'Rejected';

            $status = $application->statuses->where('sequence', '=', 6)->first();
            $status->status = $confirmStatus;

            if ($validated['can_confirm']) {
                $status->end = now();

                $application->statuses()->save(new AppStatus([
                    'app_profile_id' => $application->id,
                    'name' => 'Assignment of Panel & Meeting Schedule',
                    'sequence' => 7,
                    'status' => 'In Progress',
                    'start' => now(),
                ]));
            }

            $application->statuses()->save($status);
            $application->load([
                'statuses' => fn (HasMany $query) => $query->where('sequence', '>=', 6)->first(),
            ])->refresh();

            broadcast(new ApplicationUpdated($application, "{$validated['name']} has $confirmStatus the uploaded payment."))->toOthers();
        });

        return response()->json([
            'message' => "Payment status successfully updated.",
            'statuses' => $application->statuses
        ]);
    }

    /**
     * @throws Throwable
     */
    public function assignPanelMeeting(Request $request, AppProfile $application): JsonResponse
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
            'sequence' => 8,
            'status' => 'In Progress',
            'start' => $currentDateTime,
        ]);

        $meeting = [
            'meeting_date' => $validated['meeting_date'],
            'status' => 'Scheduled',
        ];

        DB::beginTransaction();

        try {
            $application->statuses()->saveMany([$latestStatus, $newStatus]);
            $application->meeting()->create($meeting);

            $panelData = collect($validated['panel_members'])->map(function ($member) {
                return new PanelMember([
                    'firstname' => $member['firstname'],
                    'lastname' => $member['lastname'],
                ]);
            })->all();

            $application->panels()->saveMany($panelData);

            DB::commit();

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
            DB::rollBack();
            Log::error('Panel meeting assignment failed', [
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'message' => 'An error occurred while assigning the panel members and meeting schedule.',
                'error' => true,
            ], 422);
        }
    }

    /**
     * @throws Throwable
     */
    public function uploadEthicsClearance(Request $request, AppProfile $application): JsonResponse
    {
        $validated = $request->validate([
            'file' => 'required|file|mimes:pdf,doc,docx',
            'date_clearance' => 'required|string',
            'effective_start_date' => 'required|string',
            'effective_end_date' => 'required|string',
            'message' => 'required|string',
        ]);
        $validated['date_clearance'] = Carbon::parse($validated['date_clearance']);
        $validated['effective_start_date'] = Carbon::parse($validated['effective_start_date']);
        $validated['effective_end_date'] = Carbon::parse($validated['effective_end_date']);

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
            'effective_start_date' => $validated['effective_start_date'],
            'effective_end_date' => $validated['effective_end_date'],
        ]);

        DB::beginTransaction();

        try {
            $application->ethicsClearance()->save($ethicsClearance);
            $application->statuses()->save($status);
            DB::commit();

            $application->load([
                'ethicsClearance',
                'statuses' => fn($query) => $query->latest()->first(),
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
            'ethics_clearance' => $ethicsClearance,
            'status' => $status,
        ]);
    }

    /**
     * @throws Throwable
     */
    public function uploadReport(Request $request, AppProfile $application): JsonResponse
    {
        $validated = $request->validate([
            'message' => 'required|string',
            'file' => 'required|file',
        ]);

        $path = Storage::disk('public')->putFile(
            "reviewer_reports/$application->id",
            $validated['file'],
        );

        $reviewerReport = new ReviewerReport([
            'app_profile_id' => $application->id,
            'message' => $validated['message'],
            'file_url' => $path,
            'status' => 'Draft',
        ]);

        DB::beginTransaction();

        try {
            $application->reviewerReports()->save($reviewerReport);

            DB::commit();
            $application->load(['reviewerReports' => function (HasMany $query) {
                $query->latest()->take(1);
            }])->refresh();

            broadcast(new ApplicationUpdated($application, message: 'New updates on Reviewer Report'))->toOthers();

            return response()->json([
                'message' => 'Report uploaded successfully.',
                'reviewer_report' => $reviewerReport,
            ], 201);
        } catch (Exception $e) {
            DB::rollBack();
            Storage::delete($path);
            Log::error($e->getMessage());

            return response()->json([
                'message' => 'Something went wrong while uploading the report. Please try again.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
