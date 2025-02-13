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
 * @property string $file_name
 * @property string $file_path
 * @property bool $is_signed
 * @property Carbon $date_uploaded
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read AppProfile $appProfile
 * @method static Builder<static>|DecisionLetter newModelQuery()
 * @method static Builder<static>|DecisionLetter newQuery()
 * @method static Builder<static>|DecisionLetter query()
 * @method static Builder<static>|DecisionLetter whereAppProfileId($value)
 * @method static Builder<static>|DecisionLetter whereCreatedAt($value)
 * @method static Builder<static>|DecisionLetter whereDateUploaded($value)
 * @method static Builder<static>|DecisionLetter whereFileName($value)
 * @method static Builder<static>|DecisionLetter whereFilePath($value)
 * @method static Builder<static>|DecisionLetter whereId($value)
 * @method static Builder<static>|DecisionLetter whereIsSigned($value)
 * @method static Builder<static>|DecisionLetter whereUpdatedAt($value)
 * @mixin Eloquent
 */
class DecisionLetter extends Model
{
    use HasUlids;

    protected $table = 'decision_letters';

    protected $fillable = [
        'app_profile_id',
        'file_name',
        'file_path',
        'is_signed',
        'date_uploaded',
    ];

    public function appProfile(): BelongsTo
    {
        return $this->belongsTo(AppProfile::class);
    }

    protected function casts(): array
    {
        return [
            'date_uploaded' => 'datetime:c',
            'is_signed' => 'boolean',
        ];
    }
}
