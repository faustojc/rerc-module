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
 * @property string $file_url
 * @property Carbon $date_clearance
 * @property Carbon $date_uploaded
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read AppProfile $appProfile
 * @method static Builder<static>|EthicsClearance newModelQuery()
 * @method static Builder<static>|EthicsClearance newQuery()
 * @method static Builder<static>|EthicsClearance query()
 * @method static Builder<static>|EthicsClearance whereAppProfileId($value)
 * @method static Builder<static>|EthicsClearance whereCreatedAt($value)
 * @method static Builder<static>|EthicsClearance whereDateClearance($value)
 * @method static Builder<static>|EthicsClearance whereDateUploaded($value)
 * @method static Builder<static>|EthicsClearance whereFileUrl($value)
 * @method static Builder<static>|EthicsClearance whereId($value)
 * @method static Builder<static>|EthicsClearance whereUpdatedAt($value)
 * @mixin Eloquent
 */
class EthicsClearance extends Model
{
    use HasUlids;

    protected $table = 'ethics_clearances';

    protected $fillable = [
        'app_profile_id',
        'file_url',
        'date_clearance',
        'date_uploaded',
    ];

    public function appProfile(): BelongsTo
    {
        return $this->belongsTo(AppProfile::class);
    }

    protected function casts(): array
    {
        return [
            'date_clearance' => 'datetime:c',
            'date_uploaded' => 'datetime:c',
        ];
    }
}
