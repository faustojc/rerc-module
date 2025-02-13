<?php

namespace App\Models;

use Database\Factories\ReviewResultFactory;
use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * 
 *
 * @property string $id
 * @property int $app_profile_id
 * @property string $name
 * @property string|null $file_url
 * @property Carbon|null $date_uploaded
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read AppProfile $appProfile
 * @property-read Collection<int, Document> $documents
 * @property-read int|null $documents_count
 * @method static ReviewResultFactory factory($count = null, $state = [])
 * @method static Builder<static>|ReviewResult newModelQuery()
 * @method static Builder<static>|ReviewResult newQuery()
 * @method static Builder<static>|ReviewResult query()
 * @method static Builder<static>|ReviewResult whereAppProfileId($value)
 * @method static Builder<static>|ReviewResult whereCreatedAt($value)
 * @method static Builder<static>|ReviewResult whereDateUploaded($value)
 * @method static Builder<static>|ReviewResult whereFileUrl($value)
 * @method static Builder<static>|ReviewResult whereId($value)
 * @method static Builder<static>|ReviewResult whereName($value)
 * @method static Builder<static>|ReviewResult whereUpdatedAt($value)
 * @property int $version
 * @method static Builder<static>|ReviewResult whereVersion($value)
 * @mixin Eloquent
 */
class ReviewResult extends Model
{
    /** @use HasFactory<ReviewResultFactory> */
    use HasFactory, HasUlids;

    protected $table = 'review_results';

    protected $fillable = [
        'app_profile_id',
        'name',
        'file_url',
        'date_uploaded',
        'version'
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
            'version' => 'integer',
            'date_uploaded' => 'datetime:c',
            'updated_at' => 'datetime:c',
        ];
    }
}
