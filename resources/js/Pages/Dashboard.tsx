import {
    ClockRotateRight,
    DocumentCheckOutline,
    FeDocument,
    IconAssignmentOutline,
    IconDocumentUpload,
    IconLightBalance,
    IconMeetingRoom,
    IconMessagePreview,
    IconPending,
    IconReceipt,
    IconWrite,
    MdiCalendar,
    UserAlt,
} from "@/Components/Icons";
import React from "react";
import StatsCard from "@/Components/Dashboard/StatsCard";
import RecentApplicationsList from "@/Components/Dashboard/RecentApplicationsList";
import ReviewTypeStats from "@/Components/Dashboard/ReviewTypeStats";
import { DashboardPageProps } from "@/types";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

const Dashboard: React.FC<DashboardPageProps> = ({ stats, auth }) => {
    const isStaffOrChairperson = ['staff', 'chairperson'].includes(auth.user.role);

    return (
        <Authenticated header="Dashboard">
            <Head title="Dashboard" />

            <div className="py-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatsCard
                        title="Total Applications"
                        value={stats.totalApplications}
                        icon={<FeDocument className="w-6 h-6" />}
                        color="default"
                    />
                    <StatsCard
                        title="In Progress"
                        value={stats.applicationsByStatus.inProgress}
                        icon={<ClockRotateRight className="w-6 h-6" />}
                    />
                    <StatsCard
                        title="Pending Initial Reviews"
                        value={stats.pending.pendingInitialReviews}
                        icon={<UserAlt className="w-6 h-6" />}
                        color="warning"
                    />
                    <StatsCard
                        title="Upcoming Meetings"
                        value={stats.upcomingMeetings.length}
                        icon={<MdiCalendar className="w-6 h-6" />}
                        color="secondary"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ReviewTypeStats data={stats.applicationsByReviewType} />
                    <RecentApplicationsList applications={stats.recentApplications} />
                </div>

                {isStaffOrChairperson && (
                    <div>
                        <h4 className="text-xl font-medium mb-3">Pending Application Statuses</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 grid-flow-row gap-6">
                            <StatsCard
                                title="Review Application Requirements"
                                value={stats.pending.pendingRequirements}
                                icon={<DocumentCheckOutline className="w-6 h-6" />}
                                as={Link}
                                href={`${route('applications.index')}?selectedStep=1`}
                            />
                            <StatsCard
                                title="Assign Protocol Code"
                                value={stats.pending.pendingProtocols}
                                icon={<IconPending className="w-6 h-6" />}
                                as={Link}
                                href={`${route('applications.index')}?selectedStep=2`}
                            />
                            <StatsCard
                                title="Take Initial Review"
                                value={stats.pending.pendingInitialReviews}
                                icon={<IconMessagePreview className="w-6 h-6" />}
                                as={Link}
                                href={`${route('applications.index')}?selectedStep=3`}
                            />
                            <StatsCard
                                title="Assign Review Type"
                                value={stats.pending.pendingReviewTypes}
                                icon={<IconAssignmentOutline className="w-6 h-6" />}
                                as={Link}
                                href={`${route('applications.index')}?selectedStep=4`}
                            />
                            <StatsCard
                                title="Upload Decision Letter"
                                value={stats.pending.pendingDecisionLetters}
                                icon={<IconDocumentUpload className="w-6 h-6" />}
                                as={Link}
                                href={`${route('applications.index')}?selectedStep=5`}
                            />
                            <StatsCard
                                title="Confirm Uploaded Payments"
                                value={stats.pending.pendingPayments}
                                icon={<IconReceipt className="w-6 h-6" />}
                                as={Link}
                                href={`${route('applications.index')}?selectedStep=6`}
                            />
                            <StatsCard
                                title="Assign Reviewers and Meeting"
                                value={stats.pending.pendingReviewerMeetings}
                                icon={<IconMeetingRoom className="w-6 h-6" />}
                                as={Link}
                                href={`${route('applications.index')}?selectedStep=7`}
                            />
                            <StatsCard
                                title="Review Manuscript Revisions"
                                value={stats.pending.pendingReviewManuscripts}
                                icon={<IconWrite className="w-6 h-6" />}
                                as={Link}
                                href={`${route('applications.index')}?selectedStep=8`}
                            />
                            <StatsCard
                                title="Confirm Additional Requirements"
                                value={stats.pending.pendingAdditionalReqs}
                                icon={<DocumentCheckOutline className="w-6 h-6" />}
                                as={Link}
                                href={`${route('applications.index')}?selectedStep=9`}
                            />
                            <StatsCard
                                title="Ethics Clearance Issuance"
                                value={stats.pending.pendingEthicsClearances}
                                icon={<IconLightBalance className="w-6 h-6" />}
                                as={Link}
                                href={`${route('applications.index')}?selectedStep=10`}
                            />
                        </div>
                    </div>
                )}
            </div>
        </Authenticated>
    );
};

export default Dashboard;
