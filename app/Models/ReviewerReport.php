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
 * @property string $id
 * @property string $app_profile_id
 * @property string $message
 * @property string $status
 * @property string $file_url
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read AppProfile $appProfile
 * @method static Builder<static>|ReviewerReport newModelQuery()
 * @method static Builder<static>|ReviewerReport newQuery()
 * @method static Builder<static>|ReviewerReport query()
 * @method static Builder<static>|ReviewerReport whereAppProfileId($value)
 * @method static Builder<static>|ReviewerReport whereCreatedAt($value)
 * @method static Builder<static>|ReviewerReport whereFileUrl($value)
 * @method static Builder<static>|ReviewerReport whereId($value)
 * @method static Builder<static>|ReviewerReport whereMessage($value)
 * @method static Builder<static>|ReviewerReport whereStatus($value)
 * @method static Builder<static>|ReviewerReport whereUpdatedAt($value)
 * @mixin Eloquent
 */
class ReviewerReport extends Model
{
    use HasUlids;

    protected $table = 'reviewer_reports';

    protected $fillable = [
        'app_profile_id',
        'message',
        'status',
        'file_url',
    ];

    public function appProfile(): BelongsTo
    {
        return $this->belongsTo(AppProfile::class);
    }

    protected function casts(): array
    {
        return [
            'created_at' => 'datetime:c',
            'updated_at' => 'datetime:c',
        ];
    }
}
