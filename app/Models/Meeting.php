<?php

namespace App\Models;

use Database\Factories\MeetingFactory;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Meeting extends Model
{
    /** @use HasFactory<MeetingFactory> */
    use HasFactory, HasUlids;

    protected $table = 'meetings';

    public function appProfile(): BelongsTo
    {
        return $this->belongsTo(AppProfile::class);
    }
}
