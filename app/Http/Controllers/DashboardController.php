<?php

namespace App\Http\Controllers;

use App\Models\AppProfile;
use App\Models\AppStatus;
use App\Models\Meeting;
use Illuminate\Database\Eloquent\Builder;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
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

        // Get applications by review type
        $applicationsByReviewType = [
            'exempted' => AppProfile::where('review_type', '=', 'exempted')->count(),
            'expedited' => AppProfile::where('review_type', '=', 'expedited')->count(),
            'fullBoard' => AppProfile::where('review_type', '=', 'full board')->count(),
        ];

        // Get recent applications (last 5)
        $recentApplications = AppProfile::with(['members'])
            ->latest('date_applied')
            ->take(4)
            ->get();

        // Get upcoming meetings
        $upcomingMeetings = Meeting::where('meeting_date', '>', now())
            ->where('status', '=',  'Done')
            ->get();

        // Application statuses count
        $pendingRequirementsCount = AppStatus::query()
            ->where('sequence', '=', 1)
            ->where('end', '=', null)
            ->count();

        $pendingProtocolCount = AppStatus::query()
            ->where('sequence', '=', 2)
            ->where('end', '=',null)
            ->count();

        $pendingInitialReviewCount = AppStatus::query()
            ->where('sequence', '=', 3)
            ->where('end', '=',null)
            ->count();

        $pendingReviewTypeCount = AppStatus::query()
            ->where('sequence', '=', 4)
            ->where('end', '=',null)
            ->count();

        $pendingDecisionLettersCount = AppProfile::whereDoesntHave('decisionLetter')
            ->whereHas('statuses', function(Builder $query) {
                $query->where('sequence', '=', 5)
                    ->where('end', '=', null);
            })
            ->orWhereHas('decisionLetter', function(Builder $query) {
                $query->where('is_signed', false);
            })->count();

        $pendingPaymentCount = AppStatus::query()
            ->where('sequence', '=', 6)
            ->where('end', '=', null)
            ->count();

        $pendingReviewerMeetingCount = AppStatus::query()
            ->where('sequence', '=', 7)
            ->where('end', '=', null)
            ->count();

        $pendingReviewManuscriptsCount = AppStatus::query()
            ->where('sequence', '=', 8)
            ->where('end', '=', null)
            ->count();

        $pendingAdditionalReqCount = AppStatus::query()
            ->where('sequence', '=', 9)
            ->where('end', '=', null)
            ->count();

        $pendingEthicsClearanceCount = AppStatus::query()
            ->where('sequence', '=', 10)
            ->where('end', '=', null)
            ->count();

        return Inertia::render('Dashboard', [
            'stats' => [
                'totalApplications' => $totalApplications,
                'applicationsByStatus' => $applicationsByStatus,
                'applicationsByReviewType' => $applicationsByReviewType,
                'recentApplications' => $recentApplications,
                'upcomingMeetings' => $upcomingMeetings,
                'pending' => [
                    'pendingRequirements' => $pendingRequirementsCount,
                    'pendingProtocols' => $pendingProtocolCount,
                    'pendingInitialReviews' => $pendingInitialReviewCount,
                    'pendingReviewTypes' => $pendingReviewTypeCount,
                    'pendingDecisionLetters' => $pendingDecisionLettersCount,
                    'pendingPayments' => $pendingPaymentCount,
                    'pendingReviewerMeetings' => $pendingReviewerMeetingCount,
                    'pendingReviewManuscripts' => $pendingReviewManuscriptsCount,
                    'pendingAdditionalReqs' => $pendingAdditionalReqCount,
                    'pendingEthicsClearances' => $pendingEthicsClearanceCount
                ]
            ],
        ]);
    }
}
