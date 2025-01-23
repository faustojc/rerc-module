<?php

namespace App\Models;

use Database\Factories\AppProfileFactory;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class AppProfile extends Model
{
    /** @use HasFactory<AppProfileFactory> */
    use HasFactory, HasUlids;

    protected $table = 'app_profiles';

    protected $fillable = [
        'user_id',
        'firstname',
        'lastname',
        'research_title',
        'date_applied',
        'protocol_code',
        'protocol_date',
        'review_type',
        'proof_of_payment_url',
        'payment_date',
        'payment_details',
    ];

    protected static function boot(): void
    {
        parent::boot();
        self::deleting(function (AppProfile $application) {
            $application->members()->each(function (AppMember $member) {
                $member->delete();
            });
            $application->statuses()->each(function (AppStatus $status) {
                $status->delete();
            });
            $application->requirements()->each(function (Requirement $requirement) {
                $requirement->delete();
            });
            $application->documents()->each(function (Document $document) {
                $document->delete();
            });
            $application->messageThreads()->each(function (MessageThread $thread) {
                $thread->delete();
            });
            $application->reviewResults()->each(function (ReviewResult $result) {
                $result->delete();
            });
            $application->meetings()->each(function (Meeting $meeting) {
                $meeting->delete();
            });
            $application->panels()->each(function (PanelMember $panel) {
                $panel->delete();
            });
        });
    }

    public function members(): HasMany
    {
        return $this->hasMany(AppMember::class);
    }

    public function statuses(): HasMany
    {
        return $this->hasMany(AppStatus::class);
    }

    public function requirements(): HasMany
    {
        return $this->hasMany(Requirement::class);
    }

    public function documents(): HasMany
    {
        return $this->hasMany(Document::class);
    }

    public function messageThreads(): HasMany
    {
        return $this->hasMany(MessageThread::class);
    }

    public function reviewResults(): HasMany
    {
        return $this->hasMany(ReviewResult::class);
    }

    public function meetings(): HasMany
    {
        return $this->hasMany(Meeting::class);
    }

    public function panels(): HasMany
    {
        return $this->hasMany(PanelMember::class);
    }

    public function decisionLetter(): HasOne
    {
        return $this->hasOne(DecisionLetter::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
