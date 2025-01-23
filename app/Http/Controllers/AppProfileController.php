<?php

namespace App\Http\Controllers;

use App\Events\ApplicationCreated;
use App\Events\ApplicationUpdated;
use App\Models\AppMember;
use App\Models\AppProfile;
use App\Models\AppStatus;
use App\Models\Document;
use Exception;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
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
        $page = $request->query('page') ?? 1;
        $query = $request->query('query');
        $applications = AppProfile::query();

        if ($query) {
            $applications = $applications->whereLike('research_title', $query);
        }

        if ($user->role == 'researcher') {
            $applications = $applications->where('user_id', $user->id);
        }

        $applications = $applications
            ->orderByDesc('updated_at')
            ->paginate(10, columns: ['id', 'user_id', 'research_title', 'date_applied', 'protocol_code'], page: $page);


        $canCreate = auth()->user()->can('create', AppProfile::class);
        $canDelete = FALSE;

        foreach ($applications->items() as $application) {
            $checkDelete = Gate::inspect('delete', $application);

            if ($checkDelete->allowed()) {
                $canDelete = TRUE;
                break;
            }
        }

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

    public function create(): Response
    {
        return Inertia::render('Application/Create');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @throws AuthorizationException
     * @throws Throwable
     */
    public function store(Request $request): RedirectResponse|JsonResponse
    {
        Gate::authorize('create', AppProfile::class);

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

            $appProfile->statuses()->save(new AppStatus([
                'name' => 'Application Submission',
                'sequence' => 1,
                'status' => 'In Progress',
                'start' => now(),
            ]));
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
     * Display the specified resource.
     */
    public function show(AppProfile $application): Response
    {
        // Eager load the relationships
        $application = $application->load([
            'members' => function ($query) {
                $query->select('id', 'app_profile_id', 'firstname', 'lastname');
            },
            'statuses' => function ($query) {
                $query->select('id', 'app_profile_id', 'name', 'sequence', 'status', 'start', 'end');
            },
            'requirements' => function ($query) {
                $query->select('id', 'app_profile_id', 'name', 'file_url', 'date_uploaded', 'status');
            },
            'meetings' => function ($query) {
                $query->select('id', 'app_profile_id', 'meeting_date', 'status');
            },
            'documents' => function ($query) {
                $query->select('id', 'app_profile_id', 'review_result_id', 'file_url', 'remarks', 'created_at');
            },
            'decisionLetter' => function ($query) {
                $query->select('id', 'app_profile_id', 'file_name', 'file_path', 'date_uploaded', 'is_signed');
            },
            'reviewResults' => function ($query) {
                $query->select('id', 'app_profile_id', 'name', 'file_url', 'date_uploaded', 'status');
            },
            // TODO: add other relationships that need to be loaded
        ]);

        return Inertia::render('Application/Show', [
            'application' => $application,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(AppProfile $application)
    {
        //
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
        $newStatus = NULL;

        if (!empty($protocolCode)) {
            $application->protocol_code = $protocolCode;
            $application->protocol_date_updated = now();
        }

        if (!empty($reviewType)) {
            $application->review_type = $reviewType;
        }

        DB::transaction(function () use (&$application, &$status, &$newStatus, $request, $message) {
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

            broadcast(new ApplicationUpdated($application, $status, $newStatus, $message))->toOthers();
        });

        return response()->json([
            'message' => $message ?? "$application->research_title has been updated.",
            'application' => $application,
            'status' => $status,
            'new_status' => $newStatus,
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
            $application->proof_of_payment_url = $path;
            $application->payment_details = $paymentDetails;
            $application->payment_date = $currentDateTime;

            $application->save();
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
}
