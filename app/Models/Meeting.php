<?php

namespace App\Models;

use Database\Factories\MeetingFactory;
use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * 
 *
 * @property string $id
 * @property string $app_profile_id
 * @property Carbon $meeting_date
 * @property string|null $status
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read AppProfile $appProfile
 * @method static MeetingFactory factory($count = null, $state = [])
 * @method static Builder<static>|Meeting newModelQuery()
 * @method static Builder<static>|Meeting newQuery()
 * @method static Builder<static>|Meeting query()
 * @method static Builder<static>|Meeting whereAppProfileId($value)
 * @method static Builder<static>|Meeting whereCreatedAt($value)
 * @method static Builder<static>|Meeting whereId($value)
 * @method static Builder<static>|Meeting whereMeetingDate($value)
 * @method static Builder<static>|Meeting whereStatus($value)
 * @method static Builder<static>|Meeting whereUpdatedAt($value)
 * @property-read \App\Models\TFactory|null $use_factory
 * @mixin Eloquent
 */
class Meeting extends Model
{
    /** @use HasFactory<MeetingFactory> */
    use HasFactory, HasUlids;

    protected $table = 'meetings';

    protected $fillable = [
        'meeting_date',
        'status',
    ];

    public function appProfile(): BelongsTo
    {
        return $this->belongsTo(AppProfile::class);
    }

    protected function casts(): array
    {
        return [
            'meeting_date' => 'datetime:c',
        ];
    }
}
