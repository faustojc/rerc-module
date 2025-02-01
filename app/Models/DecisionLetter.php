<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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
