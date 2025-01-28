<?php

namespace App\Http\Controllers;

use App\Events\SendAndUpdateFeedback;
use App\Models\AppStatus;
use App\Models\MessageThread;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Throwable;

class MessageThreadsController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, AppStatus $status)
    {
        $validated = $request->validate([
            'remarks' => 'required|string',
            'by' => 'required|string',
        ]);

        $message = new MessageThread([
            'app_profile_id' => $status->app_profile_id,
            'remarks' => $validated['remarks'],
            'by' => $validated['by'],
            'read_status' => 'sent',
        ]);

        DB::beginTransaction();

        try {
            $status->messages()->save($message);

            DB::commit();

            $status->load('messages')->refresh();
            $message->refresh();

            broadcast(new SendAndUpdateFeedback($message, "New message from {$validated['by']} in $status->name"))->toOthers();
        } catch (Throwable $e) {
            DB::rollBack();
            Log::error($e->getMessage());

            return response()->json([
                'message' => 'Something went wrong. Please try again sending a feedback.',
            ], 500);
        }

        return response()->json([
            'message_thread' => $message,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, MessageThread $messageThread)
    {
        // only update the read status
        $validated = $request->validate([
            'read_status' => 'required|string',
        ]);

        $messageThread->read_status = $validated['read_status'];

        DB::transaction(function () use ($messageThread) {
            $messageThread->save();

            broadcast(new SendAndUpdateFeedback($messageThread))->toOthers();
        });

        return response()->json([
            'message' => 'Message read status updated successfully',
        ]);
    }
}
