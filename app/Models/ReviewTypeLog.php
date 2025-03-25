<?php

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 *
 *
 * @property int $id
 * @property string $app_profile_id
 * @property string $review_type
 * @property string $assigned_by
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read AppProfile $appProfile
 * @method static Builder<static>|ReviewTypeLog newModelQuery()
 * @method static Builder<static>|ReviewTypeLog newQuery()
 * @method static Builder<static>|ReviewTypeLog query()
 * @method static Builder<static>|ReviewTypeLog whereAppProfileId($value)
 * @method static Builder<static>|ReviewTypeLog whereAssignedBy($value)
 * @method static Builder<static>|ReviewTypeLog whereCreatedAt($value)
 * @method static Builder<static>|ReviewTypeLog whereId($value)
 * @method static Builder<static>|ReviewTypeLog whereReviewType($value)
 * @method static Builder<static>|ReviewTypeLog whereUpdatedAt($value)
 * @mixin Eloquent
 */
class ReviewTypeLog extends Model
{
    use HasUlids;

    protected $table = 'review_type_logs';

    protected $fillable = [
        'app_profile_id',
        'review_type',
        'assigned_by'
    ];

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
