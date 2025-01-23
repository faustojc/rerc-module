<?php

namespace App\Events;

use App\Models\AppProfile;
use App\Models\AppStatus;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Contracts\Queue\ShouldQueueAfterCommit;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ApplicationUpdated implements ShouldQueue, ShouldBroadcast, ShouldQueueAfterCommit
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public AppProfile $application;
    public ?AppStatus $status;
    public ?AppStatus $newStatus;
    public string $message = "";

    /**
     * Create a new event instance.
     *
     * @param AppProfile $application
     * @param AppStatus|null $status
     * @param AppStatus|null $newStatus
     * @param string $message
     */
    public function __construct(AppProfile $application, AppStatus $status = NULL, ?AppStatus $newStatus = NULL, string $message = "")
    {
        $this->application = $application;
        $this->status = $status;
        $this->newStatus = $newStatus;
        $this->message = !empty($message) ? $message : "$application->research_title has a new update.";
    }

    /**
     * Get the channels the event should broadcast on.
     *
     */
    public function broadcastOn(): array
    {
        // Assuming you have a channel for the application or users
        return [
            new Channel('application.' . $this->application->id),
        ];
    }

    /**
     * Specify the event's broadcast name.
     *
     * @return string
     */
    public function broadcastAs(): string
    {
        return 'ApplicationUpdated';
    }
}
