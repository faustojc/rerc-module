<?php

namespace App\Models;

use Database\Factories\RequirementFactory;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

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
