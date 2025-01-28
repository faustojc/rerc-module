<?php

namespace App\Models;

use Database\Factories\PanelMemberFactory;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PanelMember extends Model
{
    /** @use HasFactory<PanelMemberFactory> */
    use HasFactory, HasUlids;

    protected $table = 'panel_members';

    protected $fillable = [
        'firstname',
        'lastname',
    ];

    public function panel(): BelongsTo
    {
        return $this->belongsTo(PanelMember::class);
    }
}
