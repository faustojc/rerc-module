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
 * @property string $content
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read AppProfile $appProfile
 * @method static Builder<static>|MessagePost newModelQuery()
 * @method static Builder<static>|MessagePost newQuery()
 * @method static Builder<static>|MessagePost query()
 * @method static Builder<static>|MessagePost whereAppProfileId($value)
 * @method static Builder<static>|MessagePost whereContent($value)
 * @method static Builder<static>|MessagePost whereCreatedAt($value)
 * @method static Builder<static>|MessagePost whereId($value)
 * @method static Builder<static>|MessagePost whereUpdatedAt($value)
 * @mixin Eloquent
 */
class MessagePost extends Model {
    use HasUlids;

    protected $table = 'message_posts';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'app_profile_id',
        'content',
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
