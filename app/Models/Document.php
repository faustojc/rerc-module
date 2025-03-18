<?php

namespace App\Models;

use Database\Factories\DocumentFactory;
use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;

/**
 * 
 *
 * @property string $id
 * @property string $app_profile_id
 * @property string|null $review_result_id
 * @property string $file_url
 * @property string|null $remarks
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property int $version
 * @property string $status
 * @property-read AppProfile $appProfile
 * @property-read ReviewResult|null $reviewResult
 * @method static DocumentFactory factory($count = null, $state = [])
 * @method static Builder<static>|Document newModelQuery()
 * @method static Builder<static>|Document newQuery()
 * @method static Builder<static>|Document query()
 * @method static Builder<static>|Document whereAppProfileId($value)
 * @method static Builder<static>|Document whereCreatedAt($value)
 * @method static Builder<static>|Document whereFileUrl($value)
 * @method static Builder<static>|Document whereId($value)
 * @method static Builder<static>|Document whereRemarks($value)
 * @method static Builder<static>|Document whereReviewResultId($value)
 * @method static Builder<static>|Document whereStatus($value)
 * @method static Builder<static>|Document whereUpdatedAt($value)
 * @method static Builder<static>|Document whereVersion($value)
 * @property-read \App\Models\TFactory|null $use_factory
 * @mixin Eloquent
 */
class Document extends Model
{
    /** @use HasFactory<DocumentFactory> */
    use HasFactory, HasUlids;

    protected $table = 'documents';

    protected $fillable = [
        'app_profile_id',
        'file_url',
        'remarks',
        'version',
        'status',
    ];

    protected static function boot(): void
    {
        parent::boot();

        static::deleting(function (Document $document) {
            Storage::disk('public')->deleteDirectory('documents/' . $document->app_profile_id);
        });
    }

    public function reviewResult(): BelongsTo
    {
        return $this->belongsTo(ReviewResult::class);
    }

    public function appProfile(): BelongsTo
    {
        return $this->belongsTo(AppProfile::class);
    }

    protected function casts(): array
    {
        return [
            'created_at' => 'datetime:c',
        ];
    }
}
