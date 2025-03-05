<?php

namespace App\Models;

use Database\Factories\RequirementFactory;
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
 * @property string $name
 * @property string $file_url
 * @property Carbon $date_uploaded
 * @property string|null $status
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property bool $is_additional
 * @property-read AppProfile $appProfile
 * @method static RequirementFactory factory($count = null, $state = [])
 * @method static Builder<static>|Requirement newModelQuery()
 * @method static Builder<static>|Requirement newQuery()
 * @method static Builder<static>|Requirement query()
 * @method static Builder<static>|Requirement whereAppProfileId($value)
 * @method static Builder<static>|Requirement whereCreatedAt($value)
 * @method static Builder<static>|Requirement whereDateUploaded($value)
 * @method static Builder<static>|Requirement whereFileUrl($value)
 * @method static Builder<static>|Requirement whereId($value)
 * @method static Builder<static>|Requirement whereIsAdditional($value)
 * @method static Builder<static>|Requirement whereName($value)
 * @method static Builder<static>|Requirement whereStatus($value)
 * @method static Builder<static>|Requirement whereUpdatedAt($value)
 * @mixin Eloquent
 */
class Requirement extends Model
{
    /** @use HasFactory<RequirementFactory> */
    use HasFactory, HasUlids;

    protected $table = 'requirements';

    protected $fillable = [
        'app_profile_id',
        'name',
        'file_url',
        'date_uploaded',
        'status',
        'is_additional'
    ];

    protected static function boot(): void
    {
        parent::boot();

        static::deleting(function (Requirement $requirement) {
            Storage::disk('public')->deleteDirectory('requirements/' . $requirement->app_profile_id);
        });
    }

    public function appProfile(): BelongsTo
    {
        return $this->belongsTo(AppProfile::class);
    }

    protected function casts(): array
    {
        return [
            'date_uploaded' => 'datetime:c',
            'is_additional' => 'boolean',
        ];
    }
}
