<?php

namespace App\Http\Controllers;

use App\Events\ApplicationUpdated;
use App\Models\AppProfile;
use App\Models\AppStatus;
use App\Models\DecisionLetter;
use Exception;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class DecisionLetterController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, AppProfile $application): JsonResponse
    {
        $data = $request->validate([
            'file' => 'required|file|mimes:pdf,doc,docx',
            'message' => 'nullable|string',
            'is_signed' => 'nullable|string',
            'status_id' => 'required|string',
        ]);
        $isSigned = boolval($data['is_signed'] ?? FALSE);

        $fileName = "signed-{$data['file']->getClientOriginalName()}";
        $path = Storage::disk('public')->putFileAs("decision_letters/$application->id", $data['file'], $fileName);

        $status = $application->statuses()->find($data['status_id']);
        $status->status = 'Signed';
        $status->end = $isSigned ? now() : NULL;

        $newStatus = new AppStatus([
            'name' => 'Payment Made',
            'sequence' => $status->sequence + 1,
            'status' => 'In Progress',
            'start' => now(),
        ]);

        $decisionLetter = new DecisionLetter([
            'app_profile_id' => $application->id,
            'file_name' => $fileName,
            'file_path' => $path,
            'is_signed' => true,
            'date_uploaded' => now(),
        ]);

        DB::beginTransaction();

        try {
            $application->statuses()->saveMany([$status, $newStatus]);
            $application->decisionLetter()->save($decisionLetter);

            DB::commit();

            $application->load(['statuses' => function (HasMany $query) {
                $query->latest()->take(2);
            }, 'decisionLetter'])->refresh();
            $decisionLetter->refresh();

            broadcast(new ApplicationUpdated($application, message: $data['message']))->toOthers();
        } catch (Exception $e) {
            DB::rollBack();
            Storage::disk('public')->delete($path);

            return response()->json([
                'message' => $e->getMessage(),
            ], 500);
        }

        return response()->json([
            'message' => $data['message'],
            'decision_letter' => $decisionLetter,
            'status' => $status,
            'new_status' => $newStatus,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, AppProfile $application, DecisionLetter $decision_letter)
    {
        $data = $request->validate([
            'file' => 'required|file|mimes:pdf,doc,docx',
            'message' => 'nullable|string',
            'status_id' => 'required|string',
        ]);

        $status = $application->statuses()->find($data['status_id']);
        $status->status = "Signed";
        $status->end = now();

        $newStatus = new AppStatus([
            'name' => 'Payment Made',
            'sequence' => $status->sequence + 1,
            'status' => 'In Progress',
            'start' => now(),
        ]);

        $oldPath = $decision_letter->file_path;
        $path = Storage::disk('public')->putFileAs(
            "decision_letters/$application->id",
            $data['file'],
            "signed-{$data['file']->getClientOriginalName()}",
        );

        DB::beginTransaction();

        try {
            $decision_letter->file_name = "signed-{$data['file']->getClientOriginalName()}";
            $decision_letter->file_path = $path;
            $decision_letter->is_signed = TRUE;
            $decision_letter->date_uploaded = now();

            $application->decisionLetter()->save($decision_letter);
            $application->statuses()->saveMany([$status, $newStatus]);

            DB::commit();

            Storage::disk('public')->delete($oldPath);

            $application->load('decisionLetter', 'statuses')->refresh();

            broadcast(new ApplicationUpdated($application, message: $data['message']))->toOthers();
        } catch (Exception $e) {
            DB::rollBack();
            Storage::disk('public')->delete($path);

            return response()->json([
                'message' => $e->getMessage(),
            ], 500);
        }

        return response()->json([
            'decision_letter' => $decision_letter,
            'status' => $status,
            'new_status' => $newStatus,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, AppProfile $application, DecisionLetter $decision_letter)
    {
        $data = $request->validate([
            'status_id' => 'required|string',
        ]);

        $status = $application->statuses()->find($data['status_id']);
        $status->status = "Removed";
        $status->end = NULL;

        $message = "The $application->research_title's decision letter has been deleted.";

        DB::beginTransaction();

        try {
            $application->statuses()->save($status);
            $application->decisionLetter->delete();

            DB::commit();

            Storage::disk('public')->delete($decision_letter->file_path);
            $application->load('decisionLetter', 'statuses')->refresh();

            broadcast(new ApplicationUpdated($application, message: $message))->toOthers();
        } catch (Exception $e) {
            DB::rollBack();

            return response()->json([
                'message' => $e->getMessage(),
            ], 500);
        }

        return response()->json([
            'message' => $message,
        ]);
    }

    public function download(DecisionLetter $decision_letter): StreamedResponse
    {
        return Storage::disk('public')->download($decision_letter->file_path);
    }
}
