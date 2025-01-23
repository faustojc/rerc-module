<?php

namespace App\Models;

use Database\Factories\MessageThreadFactory;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MessageThread extends Model
{
    /** @use HasFactory<MessageThreadFactory> */
    use HasFactory, HasUlids;

    protected $table = 'message_threads';

    public function appProfile(): BelongsTo
    {
        return $this->belongsTo(AppProfile::class);
    }
}
