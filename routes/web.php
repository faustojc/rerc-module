<?php

use App\Http\Controllers\ApplicationRequirementController;
use App\Http\Controllers\AppProfileController;
use App\Http\Controllers\AppStatusController;
use App\Http\Controllers\DecisionLetterController;
use App\Http\Controllers\ProfileController;
use App\Models\AppProfile;
use App\Models\Document;
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
    Route::get('/dashboard', fn() => Inertia::render('Dashboard'))->name('dashboard');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::post('/applications/{application}/uploadPayment', [AppProfileController::class, 'uploadPayment'])
        ->name('applications.upload-payment');
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

    Route::get('/decision-letter/{decision_letter}/download', [DecisionLetterController::class, 'download'])
        ->name('decision-letter.download');
    Route::apiResource('applications.decision-letter', DecisionLetterController::class)
        ->only(['store', 'update', 'destroy']);

    Route::get('/requirements/{requirement}/download', [ApplicationRequirementController::class, 'download'])
        ->name('applications.requirements.download');

    Route::get('/documents/{document}/download', function (Document $document) {
        return Storage::disk('public')->download($document->file_url);
    })->name('applications.documents.download');
    Route::get('/applications/{application}/payment-download', function (AppProfile $application) {
        return Storage::disk('public')->download($application->proof_of_payment_url);
    })->name('applications.payment-download');

});

require __DIR__ . '/auth.php';
