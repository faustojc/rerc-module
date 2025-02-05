<?php

namespace App\Http\Controllers;

use App\Models\AppProfile;
use App\Models\Meeting;
use App\Models\ReviewResult;
use Illuminate\Database\Eloquent\Builder;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // Get total applications
        $totalApplications = AppProfile::count();

        $applicationsByStatus = [
            'pending' => AppProfile::whereHas('statuses', function(Builder $query) {
                $query->whereNotIn('status', ['Approved', 'Assigned', 'Done', 'Signed', 'Completed', 'In Progress']);
            })->count(),
            'inProgress' => AppProfile::whereHas('statuses', function(Builder $query) {
                $query->where('status', '=', 'In Progress');
            })->count(),
            'completed' => AppProfile::whereHas('statuses', function(Builder $query) {
                $query->where('status', '=', 'Completed');
            })->count(),
        ];

        // Get recent applications with pagination
        // Get applications by review type
        $applicationsByReviewType = [
            'exempted' => AppProfile::where('review_type', '=', 'exempted')->count(),
            'expedited' => AppProfile::where('review_type', '=', 'expedited')->count(),
            'fullBoard' => AppProfile::where('review_type', '=', 'full board')->count(),
        ];

        // Get recent applications (last 5)
        $recentApplications = AppProfile::with(['members'])
            ->latest('date_applied')
            ->take(5)
            ->get();

        // Get upcoming meetings
        $upcomingMeetings = Meeting::where('meeting_date', '>', now())
            ->where('status', '=',  'Done')
            ->get();

        // Get pending reviews
        $pendingReviews = ReviewResult::whereDoesntHave('documents')->get();

        // Get applications pending decision letters
        $pendingDecisionLetters = AppProfile::whereDoesntHave('decisionLetter')
            ->orWhereHas('decisionLetter', function(Builder $query) {
                $query->where('is_signed', false);
            })->get();

        return Inertia::render('Dashboard', [
            'stats' => [
                'totalApplications' => $totalApplications,
                'applicationsByStatus' => $applicationsByStatus,
                'applicationsByReviewType' => $applicationsByReviewType,
                'recentApplications' => $recentApplications,
                'upcomingMeetings' => $upcomingMeetings,
                'pendingReviews' => $pendingReviews,
                'pendingDecisionLetters' => $pendingDecisionLetters,
            ],
        ]);
    }
}
