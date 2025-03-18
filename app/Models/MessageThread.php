<?php

namespace App\Models;

use Database\Factories\MessageThreadFactory;
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
 * @property string $app_status_id
 * @property string $remarks
 * @property string $by
 * @property string|null $read_status
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read AppProfile $appProfile
 * @property-read AppStatus|null $status
 * @method static MessageThreadFactory factory($count = null, $state = [])
 * @method static Builder<static>|MessageThread newModelQuery()
 * @method static Builder<static>|MessageThread newQuery()
 * @method static Builder<static>|MessageThread query()
 * @method static Builder<static>|MessageThread whereAppProfileId($value)
 * @method static Builder<static>|MessageThread whereAppStatusId($value)
 * @method static Builder<static>|MessageThread whereBy($value)
 * @method static Builder<static>|MessageThread whereCreatedAt($value)
 * @method static Builder<static>|MessageThread whereId($value)
 * @method static Builder<static>|MessageThread whereReadStatus($value)
 * @method static Builder<static>|MessageThread whereRemarks($value)
 * @method static Builder<static>|MessageThread whereUpdatedAt($value)
 * @property-read \App\Models\TFactory|null $use_factory
 * @mixin Eloquent
 */
class MessageThread extends Model
{
    /** @use HasFactory<MessageThreadFactory> */
    use HasFactory, HasUlids;

    protected $table = 'message_threads';

    protected $fillable = [
        'app_profile_id',
        'remarks',
        'by',
        'read_status',
    ];

    public function appProfile(): BelongsTo
    {
        return $this->belongsTo(AppProfile::class);
    }

    public function status(): BelongsTo
    {
        return $this->belongsTo(AppStatus::class, );
    }

    protected function casts(): array
    {
        return [
            'created_at' => 'datetime:c',
        ];
    }
}
