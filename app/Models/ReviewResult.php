<?php

namespace App\Models;

use Database\Factories\ReviewResultFactory;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ReviewResult extends Model
{
    /** @use HasFactory<ReviewResultFactory> */
    use HasFactory, HasUlids;

    protected $table = 'review_results';

    protected $fillable = [
        'app_profile_id',
        'name',
        'file_url',
        'status',
        'reviewed_document_ids',
        'feedback',
    ];

    protected static function boot(): void
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

    public function documents(): HasMany
    {
        return $this->hasMany(Document::class);
    }

    protected function casts(): array
    {
        return [
            'date_uploaded' => 'datetime:c',
            'updated_at' => 'datetime:c',
            'reviewed_document_ids' => 'array',
        ];
    }
}
