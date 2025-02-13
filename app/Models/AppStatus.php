<?php

namespace App\Models;

use Database\Factories\AppStatusFactory;
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
 * @property string $app_profile_id
 * @property string $name
 * @property int $sequence
 * @property string|null $status
 * @property Carbon|null $start
 * @property Carbon|null $end
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read AppProfile $appProfile
 * @property-read Collection<int, MessageThread> $messages
 * @property-read int|null $messages_count
 * @method static AppStatusFactory factory($count = null, $state = [])
 * @method static Builder<static>|AppStatus newModelQuery()
 * @method static Builder<static>|AppStatus newQuery()
 * @method static Builder<static>|AppStatus query()
 * @method static Builder<static>|AppStatus whereAppProfileId($value)
 * @method static Builder<static>|AppStatus whereCreatedAt($value)
 * @method static Builder<static>|AppStatus whereEnd($value)
 * @method static Builder<static>|AppStatus whereId($value)
 * @method static Builder<static>|AppStatus whereName($value)
 * @method static Builder<static>|AppStatus whereSequence($value)
 * @method static Builder<static>|AppStatus whereStart($value)
 * @method static Builder<static>|AppStatus whereStatus($value)
 * @method static Builder<static>|AppStatus whereUpdatedAt($value)
 * @mixin Eloquent
 */
class AppStatus extends Model
{
    /** @use HasFactory<AppStatusFactory> */
    use HasFactory, HasUlids;

    protected $table = 'app_statuses';

    protected $fillable = [
        'app_profile_id',
        'name',
        'sequence',
        'status',
        'start',
        'end',
    ];

    public function appProfile(): BelongsTo
    {
        return $this->belongsTo(AppProfile::class);
    }

    public function messages(): HasMany
    {
        return $this->hasMany(MessageThread::class);
    }

    protected function casts(): array
    {
        return [
            'start' => 'datetime:c',
            'end' => 'datetime:c',
        ];
    }
}
