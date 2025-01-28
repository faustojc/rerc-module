<?php

namespace App\Models;

use Database\Factories\AppStatusFactory;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

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
