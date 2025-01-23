<?php

namespace App\Models;

use Database\Factories\DocumentFactory;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;

class Document extends Model
{
    /** @use HasFactory<DocumentFactory> */
    use HasFactory, HasUlids;

    protected $table = 'documents';

    protected $fillable = [
        'app_profile_id',
        'file_url',
        'remarks',
    ];

    protected static function boot(): void
    {
        parent::boot();

        static::deleting(function (Document $document) {
            Storage::disk('public')->deleteDirectory('documents/' . $document->app_profile_id);
        });
    }

    public function reviewResults(): HasMany
    {
        return $this->hasMany(ReviewResult::class);
    }

    public function appProfile(): BelongsTo
    {
        return $this->belongsTo(AppProfile::class);
    }
}
