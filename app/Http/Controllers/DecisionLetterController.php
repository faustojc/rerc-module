<?php

namespace App\Http\Controllers;

use App\Events\ApplicationUpdated;
use App\Models\AppProfile;
use App\Models\AppStatus;
use App\Models\DecisionLetter;
use Exception;
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
            'new_status' => 'nullable|string',
        ]);
        $isSigned = boolval($data['is_signed'] ?? FALSE);

        $status = $application->statuses()->find($data['status_id']);
        $status->status = $isSigned ? 'Signed' : $data['new_status'];
        $status->end = $isSigned ? now() : NULL;

        $newStatus = NULL;
        $oldPath = NULL;

        $decisionLetter = $application->decisionLetter;

        $fileExist = Storage::disk('public')->exists("decision_letters/$application->id/{$data['file']->getClientOriginalName()}");
        $fileName = $data['file']->getClientOriginalName();

        if ($fileExist) {
            $fileName = now()->format('Y-m-d h:i:s') . "-{$data['file']->getClientOriginalName()}";
        }

        $fileName = $isSigned ? "signed-$fileName" : $fileName;
        $path = Storage::disk('public')->putFileAs("decision_letters/$application->id", $data['file'], $fileName);

        if (!empty($decisionLetter)) {
            $oldPath = $decisionLetter->file_path;

            $newStatus = new AppStatus([
                'name' => 'Payment Made',
                'sequence' => $status->sequence + 1,
                'status' => 'In Progress',
                'start' => now(),
            ]);

            $decisionLetter->file_name = $fileName;
            $decisionLetter->file_path = $path;
            $decisionLetter->is_signed = TRUE;
            $decisionLetter->date_uploaded = now();
        } else {
            $decisionLetter = new DecisionLetter([
                'app_profile_id' => $application->id,
                'file_name' => $fileName,
                'file_path' => $path,
                'date_uploaded' => now(),
            ]);
        }

        DB::beginTransaction();

        try {
            if (!empty($newStatus)) {
                $application->statuses()->save($newStatus);
            }

            $application->statuses()->save($status);
            $application->decisionLetter()->save($decisionLetter);

            DB::commit();

            if (!empty($oldPath)) {
                Storage::disk('public')->delete($oldPath);
            }

            $application->load('decisionLetter', 'statuses')->refresh();
            $decisionLetter->refresh();

            broadcast(new ApplicationUpdated($application, message: $data['message']))->toOthers();
        } catch (Exception $e) {
            DB::rollBack();
            Storage::disk('public')->delete($path);

            return response()->json([
                'message' => $e->getMessage(),
            ], 500);
        }

        $responseData = [
            'message' => $data['message'],
            'decision_letter' => $decisionLetter,
            'status' => $status,
        ];

        if (!empty($newStatus)) {
            $responseData['new_status'] = $newStatus;
        }

        return response()->json($responseData);
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
