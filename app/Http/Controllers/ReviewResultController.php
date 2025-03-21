<?php

namespace App\Http\Controllers;

use App\Events\ApplicationUpdated;
use App\Models\AppProfile;
use App\Models\Document;
use App\Models\ReviewResult;
use Exception;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Throwable;

class ReviewResultController extends Controller
{
    /**
     * Store a newly created resource in storage.
     *
     * @throws Throwable
     */
    public function store(Request $request, AppProfile $application): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'file' => 'required|file',
        ]);

        $existingReviewResultFile = Storage::disk('public')->exists("review_results/$application->id/{$validated['file']->getClientOriginalName()}");
        $fileName = $existingReviewResultFile
            ? time() . '-' . $validated['file']->getClientOriginalName()
            : $validated['file']->getClientOriginalName();

        $path = Storage::disk('public')->putFileAs(
            "review_results/{$application->id}",
            $validated['file'],
            $fileName,
        );

        $reviewResult = new ReviewResult([
            'name' => $validated['name'],
            'file_url' => $path,
            'date_uploaded' => now(),
            'version' => $application->reviewResults->count() + 1,
        ]);

        DB::beginTransaction();

        try {
            $application->reviewResults()->save($reviewResult);
            $application->load(['reviewResults' => function (HasMany $query) {
                $query->latest()->take(1);
            }])->refresh();

            DB::commit();

            broadcast(new ApplicationUpdated($application, message: 'New Review Result has been uploaded.'))->toOthers();
        } catch (Exception $e) {
            DB::rollBack();
            Storage::delete($path);
            Log::error($e->getMessage());

            return response()->json([
                'message' => 'An error occurred while saving the review result.',
                'error' => $e->getMessage(),
            ], 500);
        }

        return response()->json([
            'message' => 'Review result uploaded successfully.',
            'review_result' => $reviewResult,
        ], 201);
    }

    /**
     * @throws Throwable
     */
    public function uploadRevision(Request $request, ReviewResult $review_result): JsonResponse
    {
        $validated = $request->validate([
            'file' => 'required|file',
        ]);

        $existingDocumentFile = Storage::disk('public')->exists("documents/$review_result->app_profile_id/{$validated['file']->getClientOriginalName()}");
        $time = time();
        $fileName = $existingDocumentFile
            ? "$time-revised-{$validated['file']->getClientOriginalName()}"
            : $validated['file']->getClientOriginalName();

        $path = Storage::disk('public')->putFileAs(
            "documents/$review_result->app_profile_id",
            $validated['file'],
            $fileName,
        );

        $revisedDocument = new Document([
            'app_profile_id' => $review_result->app_profile_id,
            'review_result_id' => $review_result->id,
            'file_url' => $path,
            'remarks' => 'Revised document',
            'status' => 'Revision',
            'version' => $review_result->appProfile->documents->count() + 1,
        ]);

        DB::beginTransaction();

        try {
            $review_result->documents()->save($revisedDocument);

            $application = $review_result->appProfile->load(['documents' => function (HasMany $query) {
                return $query->latest()->take(1);
            }])->refresh();

            DB::commit();

            broadcast(new ApplicationUpdated($application, message: 'A revised document has been uploaded.'))->toOthers();
        } catch (Exception $e) {
            DB::rollBack();
            Storage::delete($path);
            Log::error($e->getMessage());

            return response()->json([
                'message' => 'An error occurred while saving the revised document.',
                'error' => $e->getMessage(),
            ], 500);
        }

        return response()->json([
            'message' => 'Revised document uploaded successfully.',
            'document' => $revisedDocument,
        ], 201);
    }
}
