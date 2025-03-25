<?php

namespace App\Http\Controllers;

use App\Events\ApplicationUpdated;
use App\Models\AppProfile;
use App\Models\AppStatus;
use App\Models\ReviewTypeLog;
use Exception;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Throwable;

class ReviewTypeLogController extends Controller
{

    /**
     * Set the review type of application then log it.
     *
     * Set the current status if the application can proceed to next step.
     *
     * @throws Throwable
     */
    public function setReviewType(Request $request, AppProfile $application): JsonResponse
    {
        $validated = $request->validate([
            'review_type' => 'required|string',
            'assigned_by' => 'required|string',
            'status_id' => 'required|string',
            'can_proceed' => 'required|boolean'
        ]);

        $status = $application->statuses()->find($validated['status_id']);

        DB::beginTransaction();

        try {
            $application->review_type = $validated['review_type'];
            $application->save();

            $application->reviewTypeLogs()->save(new ReviewTypeLog([
                'app_profile_id' => $application->id,
                'review_type' => $validated['review_type'],
                'assigned_by' => $validated['assigned_by'],
            ]));

            if ($validated['can_proceed']) {
                $status->status = 'Assigned';
                $status->end = now();

                $nextStatus = new AppStatus([
                    'name' => 'Decision Letter',
                    'sequence' => 5,
                    'status' => 'In Progress',
                    'start' => now(),
                ]);

                $application->statuses()->saveMany([$status, $nextStatus]);
            }

            DB::commit();

            $application->load([
                'reviewTypeLogs' => fn (HasMany $query) => $query->latest()->take(1)
            ]);

            if ($validated['can_proceed']) {
                $application->load([
                    'statuses' => fn (HasMany $query) => $query->latest()->take(2)
                ]);
            }

            $application->refresh();

            $message = "{$validated['assigned_by']} has assigned {$validated['review_type']}";

            broadcast(new ApplicationUpdated($application, $message))->toOthers();

            return response()->json([
                'message' => 'Review type assigned successfully',
                'application' => $application
            ]);
        } catch (Exception $e) {
            DB::rollBack();
            Log::error($e->getMessage());

            return response()->json(['message' => 'Failed to assign review type'], 500);
        }
    }
}
