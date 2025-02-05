<?php

namespace App\Http\Controllers;

use App\Events\ApplicationUpdated;
use App\Models\AppProfile;
use App\Models\Document;
use App\Models\ReviewResult;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ReviewResultController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, AppProfile $application)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'file' => 'required|file',
            'feedback' => 'nullable|string',
            'reviewed_document_ids' => 'nullable|string',
        ]);

        $file = $validated['file'];
        $documentIds = [];
        $documents = [];

        if (!empty($validated['reviewed_document_ids'])) {
            $documentIds = json_decode($validated['reviewed_document_ids']);

            $documents = $application->documents()->findMany($documentIds);
        }

        $existingReviewResultFile = Storage::disk('public')->exists("review_results/$application->id/{$file->getClientOriginalName()}");
        $fileName = $existingReviewResultFile
            ? time() . '-' . $file->getClientOriginalName()
            : $file->getClientOriginalName();

        $path = Storage::disk('public')->putFileAs(
            "review_results/{$application->id}",
            $file,
            $fileName,
        );

        $reviewResult = new ReviewResult([
            'name' => $validated['name'],
            'file_url' => $path,
            'feedback' => $validated['feedback'],
            'date_uploaded' => now(),
            'reviewed_document_ids' => $documentIds,
        ]);

        DB::beginTransaction();

        try {
            $application->reviewResults()->save($reviewResult);
            $documents->each(function (Document $document) use ($reviewResult) {
                return $document->review_result_id = $reviewResult->id;
            });

            $application->documents()->saveMany($documents);
            $application->load('reviewResults', 'documents')->refresh();

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
            'documents' => $documents,
        ], 201);
    }

    public function uploadRevision(Request $request, ReviewResult $review_result)
    {
        $validated = $request->validate([
            'file' => 'nullable|file',
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
            'version' => $review_result->documents->count() + 1,
        ]);

        DB::beginTransaction();

        try {
            $review_result->documents()->save($revisedDocument);
            $review_result->reviewed_document_ids = array_merge($review_result->reviewed_document_ids, [$revisedDocument->id]);
            $review_result->save();

            $application = $review_result->appProfile->load('documents')->refresh();
            $revisedDocument->refresh();

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
