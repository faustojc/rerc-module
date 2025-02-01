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
    public function store(Request $request, AppProfile $application): JsonResponse
    {
        $validated = $request->validate([
            'requirements' => 'required|array',
            'requirements.*.*.file' => 'required|file|mimes:pdf,doc,docx|max:10240',
            'is_additional' => 'nullable|string',
        ]);

        $isAdditional = boolval($validated['is_additional'] ?? FALSE);
        $requirements = $validated['requirements'];
        $newlyRequirements = [];

        DB::transaction(function () use ($application, $requirements, $validated, $isAdditional, &$newlyRequirements) {
            foreach ($requirements as $index => $requirement) {
                $files = array_map(fn($requirement) => $requirement['file'], $requirement);

                $builder = Requirement::where('app_profile_id', $application->id)
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
                        'requirements/' . $application->id,
                        $file,
                        $file->getClientOriginalName(),
                    );

                    $newlyRequirements[] = new Requirement([
                        'app_profile_id' => $application->id,
                        'name' => $index,
                        'file_url' => $path,
                        'date_uploaded' => now(),
                        'status' => 'Uploaded',
                        'is_additional' => $isAdditional,
                    ]);
                }
            }

            $application->requirements()->saveMany($newlyRequirements);
            $application->load('requirements')->refresh();

            broadcast(new ApplicationUpdated($application, message: "Researcher has uploaded $application->requirements_count requirement(s)"))->toOthers();
        }, 3);


        return response()->json([
            'requirements' => $newlyRequirements,
        ], 201);
    }

    public function updateStatus(Request $request, AppProfile $application)
    {
        $validated = $request->validate([
            'status_id' => 'required|string',
            'new_status' => 'required|string',
            'is_completed' => 'nullable|boolean',
            'next_status_name' => 'nullable|string',
            'requirement_ids' => 'nullable|array',
            'requirement_ids.*' => 'required|string',
            'requirement_status' => 'required|string',
            'message' => 'nullable|string',
        ]);

        $isCompleted = boolval($validated['is_completed'] ?? false);
        $requirementIds = $validated['requirement_ids'];
        $message = $validated['message'];
        $requirements = [];

        if (!empty($requirementIds)) {
            $requirements = $application->requirements()->findMany($requirementIds);

            $requirements->each(function (Requirement $requirement) use ($validated) {
                $requirement->status = $validated['requirement_status'];
            });
        }

        $status = $application->statuses()->find($validated['status_id']);
        $status->status = $validated['new_status'];

        $newStatus = NULL;

        if ($isCompleted && !empty($validated['next_status_name'])) {
            $status->end = now();

            $newStatus = new AppStatus([
                'name' => $validated['next_status_name'],
                'sequence' => $status->sequence + 1,
                'status' => 'In Progress',
                'start' => now(),
            ]);
        }

        DB::transaction(function () use ($requirements, &$application, &$status, &$newStatus, $message) {
            if (!empty($requirements)) {
                $application->requirements()->saveMany($requirements);
            }

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
