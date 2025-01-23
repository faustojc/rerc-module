<?php

namespace App\Models;

use Database\Factories\AppMemberFactory;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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
