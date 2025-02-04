<?php

use App\Http\Controllers\ApplicationRequirementController;
use App\Http\Controllers\AppProfileController;
use App\Http\Controllers\AppStatusController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DecisionLetterController;
use App\Http\Controllers\MessageThreadsController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReviewResultController;
use App\Models\AppProfile;
use App\Models\Document;
use App\Models\EthicsClearance;
use App\Models\ReviewResult;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::post('/applications/{application}/upload-payment', [AppProfileController::class, 'uploadPayment'])
        ->name('applications.upload-payment');
    Route::post('/applications/{application}/assign-panel-meeting', [AppProfileController::class, 'assignPanelMeeting'])
        ->name('applications.assign-panel-meeting');
    Route::post('/applications/{application}/upload-ethics-clearance', [AppProfileController::class, 'uploadEthicsClearance'])
        ->name('applications.upload-ethics-clearance');
    Route::resource('applications', AppProfileController::class)
        ->except(['edit'])
        ->missing(fn() => route('applications.index'));

    Route::patch('/applications/{application}/requirements/update-statuses', [ApplicationRequirementController::class, 'updateStatus'])
        ->name('applications.requirements.update-statuses');
    Route::apiResource('applications.requirements', ApplicationRequirementController::class)
        ->only(['store', 'destroy'])
        ->shallow();

    Route::apiResource('applications.statuses', AppStatusController::class)
        ->only(['store', 'update']);

    Route::apiResource('applications.decision-letter', DecisionLetterController::class)
        ->only(['store', 'update', 'destroy']);

    Route::apiResource('statuses.message-threads', MessageThreadsController::class)
        ->only(['store', 'update']);

    Route::apiResource('applications.review-results', ReviewResultController::class)
        ->only(['store'])
        ->shallow();
    Route::post('review-results/{review_result}/upload-revision', [ReviewResultController::class, 'uploadRevision'])
        ->name('review-results.upload-revision');

    // Download routes
    Route::get('/documents/{document}/download', function (Document $document) {
        return Storage::disk('public')->download($document->file_url);
    })->name('applications.documents.download');
    Route::get('/requirements/{requirement}/download', [ApplicationRequirementController::class, 'download'])
        ->name('applications.requirements.download');
    Route::get('/applications/{application}/payment-download', function (AppProfile $application) {
        return Storage::disk('public')->download($application->proof_of_payment_url);
    })->name('applications.payment-download');
    Route::get('/decision-letter/{decision_letter}/download', [DecisionLetterController::class, 'download'])
        ->name('decision-letter.download');
    Route::get('/review-results/{review_result}/download', function (ReviewResult $review_result) {
        return Storage::disk('public')->download($review_result->file_url);
    })->name('review-results.download');
    Route::get('ethics-clearances/{ethics_clearance}/download', function (EthicsClearance $ethics_clearance) {
        return Storage::disk('public')->download($ethics_clearance->file_url);
    })->name('ethics-clearances.download');
});

require __DIR__ . '/auth.php';
