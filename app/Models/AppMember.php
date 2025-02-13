<?php

namespace App\Models;

use Database\Factories\AppMemberFactory;
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
 * @property string|null $firstname
 * @property string|null $lastname
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read AppProfile $appProfile
 * @method static AppMemberFactory factory($count = null, $state = [])
 * @method static Builder<static>|AppMember newModelQuery()
 * @method static Builder<static>|AppMember newQuery()
 * @method static Builder<static>|AppMember query()
 * @method static Builder<static>|AppMember whereAppProfileId($value)
 * @method static Builder<static>|AppMember whereCreatedAt($value)
 * @method static Builder<static>|AppMember whereFirstname($value)
 * @method static Builder<static>|AppMember whereId($value)
 * @method static Builder<static>|AppMember whereLastname($value)
 * @method static Builder<static>|AppMember whereUpdatedAt($value)
 * @mixin Eloquent
 */
class AppMember extends Model
{
    /** @use HasFactory<AppMemberFactory> */
    use HasFactory, HasUlids;

    protected $table = 'app_members';

    protected $fillable = [
        'firstname',
        'lastname',
    ];

    public function appProfile(): BelongsTo
    {
        return $this->belongsTo(AppProfile::class);
    }
}
