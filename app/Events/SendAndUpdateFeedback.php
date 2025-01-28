<?php

namespace App\Events;

use App\Models\MessageThread;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class SendAndUpdateFeedback implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public MessageThread $message_thread;
    public ?string $message;

    /**
     * Create a new event instance.
     */
    public function __construct(MessageThread $message_thread, string $message = null)
    {
        $this->message_thread = $message_thread;
        $this->message = $message;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new Channel("application.{$this->message_thread->app_profile_id}"),
        ];
    }

    public function broadcastAs(): string
    {
        return 'SendAndUpdateFeedback';
    }
}
