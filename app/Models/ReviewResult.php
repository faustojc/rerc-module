<?php

namespace App\Models;

use Database\Factories\ReviewResultFactory;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReviewResult extends Model
{
    /** @use HasFactory<ReviewResultFactory> */
    use HasFactory, HasUlids;

    protected $table = 'review_results';

    protected static function boot()
    {
        parent::boot();
        static::deleting(function (ReviewResult $reviewResult) {
            $reviewResult->document->delete();
        });
    }

    public function appProfile(): BelongsTo
    {
        return $this->belongsTo(AppProfile::class);
    }

    public function document(): BelongsTo
    {
        return $this->belongsTo(Document::class);
    }
}
