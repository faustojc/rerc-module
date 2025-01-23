<?php

namespace App\Http\Controllers;

use App\Events\ApplicationUpdated;
use App\Models\AppProfile;
use App\Models\AppStatus;
use App\Models\Requirement;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Throwable;

class ApplicationRequirementController extends Controller
{
    /**
     * @throws Throwable
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'app_profile_id' => 'required|string',
            'status_id' => 'required|string',
            'requirements' => 'required|array',
            'requirements.*.*.file' => 'required|file|mimes:pdf,doc,docx|max:10240',
        ]);

        $requirements = $validated['requirements'];
        $newlyRequirements = [];

        $application = AppProfile::find($validated['app_profile_id']);

        DB::transaction(function () use ($application, $requirements, $validated, &$newlyRequirements) {
            foreach ($requirements as $index => $requirement) {
                $files = array_map(fn($requirement) => $requirement['file'], $requirement);

                $builder = Requirement::where('app_profile_id', $validated['app_profile_id'])
                    ->where('name', $index);

                foreach ($files as $file) {
                    $builder->whereLike('file_url', $file->getClientOriginalName(), boolean: 'or');
                }

                $existingRequirement = $builder->get(['id']);

                if ($existingRequirement->count() > 0) {
                    continue;
                }

                foreach ($files as $file) {
                    $path = Storage::disk('public')->putFileAs(
                        'requirements/' . $validated['app_profile_id'],
                        $file,
                        $file->getClientOriginalName(),
                    );

                    $newlyRequirements[] = new Requirement([
                        'app_profile_id' => $validated['app_profile_id'],
                        'name' => $index,
                        'file_url' => $path,
                        'date_uploaded' => now(),
                        'status' => 'Uploaded',
                    ]);
                }
            }

            $application->requirements()->saveMany($newlyRequirements);
        }, 3);


        return response()->json([
            'requirements' => $newlyRequirements,
        ], 201);
    }

    public function updateStatus(Request $request, AppProfile $application)
    {
        $isCompleted = $request->is_completed;
        $requirementIds = $request->requirement_ids;
        $message = $request->message;
        $requirements = [];

        if (!empty($requirementIds)) {
            $requirements = Requirement::findMany($requirementIds);

            $requirements->each(function (Requirement $requirement) use ($request) {
                $requirement->status = $request->requirement_status;
            });
        }

        $status = $application->statuses()->find($request->status_id);
        $status->status = $request->new_status;

        $newStatus = NULL;

        if ($isCompleted) {
            $status->end = now();

            $newStatus = new AppStatus([
                'name' => 'Protocol Assignment',
                'sequence' => $status->sequence + 1,
                'status' => 'In Progress',
                'start' => now(),
            ]);
        }

        DB::transaction(function () use ($requirements, &$application, &$status, &$newStatus, $message) {
            if (!empty($requirements)) {
                $application->requirements()->saveMany($requirements);
            }

            // if the requirements has been approved, set the current status and move to the next status
            if (!empty($newStatus)) {
                $application->statuses()->save($newStatus);
            }

            $application->statuses()->save($status);
            $application->load('requirements', 'statuses')->refresh();

            broadcast(new ApplicationUpdated($application, $status, message: $message))->toOthers();
        });

        return response()->json([
            'message' => 'Requirements approved successfully',
            'application' => $application,
        ]);
    }

    public function update(Request $request, Requirement $requirement)
    {
        //
    }

    public function destroy(Requirement $requirement): JsonResponse
    {
        DB::beginTransaction();

        try {
            $application = $requirement->appProfile;
            $status = $requirement->status;

            $requirement->delete();

            DB::commit();
            Storage::disk('public')->delete($requirement->file_url);

            $application->load('requirements')->refresh();

            if ($status == "Submitted") {
                broadcast(new ApplicationUpdated($application))->toOthers();
            }
        } catch (Throwable $e) {
            DB::rollBack();

            Log::error($e->getMessage());

            response()->json([
                'message' => 'Failed to delete requirement',
            ], 500);
        }

        return response()->json([
            'message' => 'Requirement deleted successfully',
        ]);
    }

    public function download(Requirement $requirement): StreamedResponse
    {
        return Storage::disk('public')->download($requirement->file_url);
    }
}
