<?php

namespace App\Models;

use Database\Factories\PanelMemberFactory;
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
 * @property string $firstname
 * @property string $lastname
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read PanelMember|null $panel
 * @method static PanelMemberFactory factory($count = null, $state = [])
 * @method static Builder<static>|PanelMember newModelQuery()
 * @method static Builder<static>|PanelMember newQuery()
 * @method static Builder<static>|PanelMember query()
 * @method static Builder<static>|PanelMember whereAppProfileId($value)
 * @method static Builder<static>|PanelMember whereCreatedAt($value)
 * @method static Builder<static>|PanelMember whereFirstname($value)
 * @method static Builder<static>|PanelMember whereId($value)
 * @method static Builder<static>|PanelMember whereLastname($value)
 * @method static Builder<static>|PanelMember whereUpdatedAt($value)
 * @mixin Eloquent
 */
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
