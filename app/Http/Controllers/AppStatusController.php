<?php

namespace App\Http\Controllers;

use App\Events\ApplicationUpdated;
use App\Models\AppProfile;
use App\Models\AppStatus;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AppStatusController extends Controller
{
    public function store(Request $request, AppProfile $appProfile)
    {
        $validated = $request->validate([
            'status' => 'required|string',
            'name' => 'required|string',
        ]);

        $status = new AppStatus([
            'app_profile_id' => $appProfile->id,
            'name' => $validated['status'],
            'sequence' => $appProfile->statuses()->count() + 1,
            'status' => $validated['status'],
            'start' => now(),
        ]);

        DB::transaction(function () use (&$appProfile, $status) {
            $appProfile->statuses()->save($status);
        });

        broadcast(new ApplicationUpdated($appProfile, $status))->toOthers();

        return response()->json([
            'status' => $status,
        ]);
    }

    public function update(Request $request, AppProfile $application, AppStatus $status): JsonResponse
    {
        $validated = $request->validate([
            'new_status' => 'string',
            'is_completed' => 'boolean|nullable',
            'next_status' => 'string|nullable',
            'message' => 'string|nullable',
        ]);
        
        $message = $validated['message'];
        $isComplete = $validated['is_completed'] ?? FALSE;
        $newStatus = NULL;

        $status->status = $validated['new_status'];

        if ($isComplete) {
            $status->end = now();
        }

        if ($isComplete && !empty($validated['next_status'])) {
            $newStatus = new AppStatus([
                'app_profile_id' => $application->id,
                'name' => $validated['next_status'],
                'sequence' => $status->sequence == 10 ? 10 : $status->sequence + 1,
                'status' => 'In Progress',
                'start' => now(),
            ]);
        }

        DB::transaction(function () use ($application, &$status, $newStatus, $message) {
            if (!empty($newStatus)) {
                $application->statuses()->save($newStatus);
            }

            $application->statuses()->save($status);

            $application->load('statuses')->refresh();
            $status->refresh();

            broadcast(new ApplicationUpdated($application, message: $message))->toOthers();
        });

        return response()->json([
            'status' => $status,
            'next_status' => $newStatus,
            'message' => $message ?? "$application->research_title has been updated.",
        ]);
    }
}
