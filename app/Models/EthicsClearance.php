<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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
