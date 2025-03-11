<?php

namespace App\Http\Controllers;

use App\Events\ApplicationUpdated;
use App\Models\AppProfile;
use App\Models\MessagePost;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Throwable;

class MessagePostController extends Controller
{
    /**
     * @throws Throwable
     */
    public function store(Request $request, AppProfile $application): JsonResponse
    {
        $validate = $request->validate(['content' => 'required|string']);

        DB::beginTransaction();

        try {
            $application->messagePost()->create(['content' => $validate['content']]);

            DB::commit();

            $application->load('messagePost')->refresh();

            broadcast(new ApplicationUpdated($application, message: 'New post message in additional requirements'))->toOthers();

            return response()->json([
                'message_post' => $application->messagePost
            ], 201);
        } catch (Throwable $e) {
            DB::rollBack();
            Log::error($e->getMessage());

            return response()->json(['message' => 'Failed to create message post'], 500);
        }
    }

    /**
     * @throws Throwable
     */
    public function update(Request $request, AppProfile $application, MessagePost $message_post): JsonResponse
    {
        $validate = $request->validate(['content' => 'required|string']);

        DB::beginTransaction();

        try {
            $message_post->content = $validate['content'];
            $application->messagePost()->save($message_post);
            $application->load('messagePost')->refresh();

            DB::commit();

            broadcast(new ApplicationUpdated($application))->toOthers();

            return response()->json([
                'message_post' => $message_post
            ]);
        } catch (Throwable $e) {
            DB::rollBack();
            Log::error($e->getMessage());

            return response()->json(['message' => 'Failed to update message post'], 500);
        }
    }
}
