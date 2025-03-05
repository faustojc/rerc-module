<?php

namespace App\Models;

use Database\Factories\AppProfileFactory;
use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;

/**
 * 
 *
 * @property string $id
 * @property string $user_id
 * @property string $firstname
 * @property string $lastname
 * @property string $research_title
 * @property Carbon $date_applied
 * @property string|null $protocol_code
 * @property Carbon|null $protocol_date_updated
 * @property string|null $review_type
 * @property string|null $proof_of_payment_url
 * @property Carbon|null $payment_date
 * @property string|null $payment_details
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read DecisionLetter|null $decisionLetter
 * @property-read Collection<int, Document> $documents
 * @property-read int|null $documents_count
 * @property-read EthicsClearance|null $ethicsClearance
 * @property-read Meeting|null $meeting
 * @property-read Collection<int, AppMember> $members
 * @property-read int|null $members_count
 * @property-read Collection<int, MessageThread> $messageThreads
 * @property-read int|null $message_threads_count
 * @property-read Collection<int, PanelMember> $panels
 * @property-read int|null $panels_count
 * @property-read Collection<int, Requirement> $requirements
 * @property-read int|null $requirements_count
 * @property-read Collection<int, ReviewResult> $reviewResults
 * @property-read int|null $review_results_count
 * @property-read Collection<int, AppStatus> $statuses
 * @property-read int|null $statuses_count
 * @property-read User $user
 * @method static AppProfileFactory factory($count = null, $state = [])
 * @method static Builder<static>|AppProfile newModelQuery()
 * @method static Builder<static>|AppProfile newQuery()
 * @method static Builder<static>|AppProfile query()
 * @method static Builder<static>|AppProfile whereCreatedAt($value)
 * @method static Builder<static>|AppProfile whereDateApplied($value)
 * @method static Builder<static>|AppProfile whereFirstname($value)
 * @method static Builder<static>|AppProfile whereId($value)
 * @method static Builder<static>|AppProfile whereLastname($value)
 * @method static Builder<static>|AppProfile wherePaymentDate($value)
 * @method static Builder<static>|AppProfile wherePaymentDetails($value)
 * @method static Builder<static>|AppProfile whereProofOfPaymentUrl($value)
 * @method static Builder<static>|AppProfile whereProtocolCode($value)
 * @method static Builder<static>|AppProfile whereProtocolDateUpdated($value)
 * @method static Builder<static>|AppProfile whereResearchTitle($value)
 * @method static Builder<static>|AppProfile whereReviewType($value)
 * @method static Builder<static>|AppProfile whereUpdatedAt($value)
 * @method static Builder<static>|AppProfile whereUserId($value)
 * @property string $research_type
 * @property-read Collection<int, \App\Models\ReviewerReport> $reviewerReports
 * @property-read int|null $reviewer_reports_count
 * @method static Builder<static>|AppProfile whereResearchType($value)
 * @mixin Eloquent
 */
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
        'research_type',
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
                Storage::disk('public')->delete($requirement->file_url);
                $requirement->delete();
            });
            $application->documents()->each(function (Document $document) {
                Storage::disk('public')->delete($document->file_url);
                $document->delete();
            });
            $application->messageThreads()->each(function (MessageThread $thread) {
                $thread->delete();
            });
            $application->reviewResults()->each(function (ReviewResult $result) {
                $result->delete();
            });
            $application->meeting()->each(function (Meeting $meeting) {
                $meeting->delete();
            });
            $application->panels()->each(function (PanelMember $panel) {
                $panel->delete();
            });
            $application->decisionLetter()->each(function (DecisionLetter $letter) {
                Storage::disk('public')->delete($letter->file_path);
                $letter->delete();
            });
            $application->ethicsClearance()->each(function (EthicsClearance $clearance) {
                Storage::disk('public')->delete($clearance->file_url);
                $clearance->delete();
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

    public function meeting(): HasOne
    {
        return $this->hasOne(Meeting::class);
    }

    public function panels(): HasMany
    {
        return $this->hasMany(PanelMember::class);
    }

    public function decisionLetter(): HasOne
    {
        return $this->hasOne(DecisionLetter::class);
    }

    public function ethicsClearance(): HasOne
    {
        return $this->hasOne(EthicsClearance::class);
    }

    public function reviewerReports(): HasMany
    {
        return $this->hasMany(ReviewerReport::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    protected function casts(): array
    {
        return [
            'date_applied' => 'datetime:c',
            'protocol_date_updated' => 'datetime:c',
            'payment_date' => 'datetime:c',
        ];
    }
}
