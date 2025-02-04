import { Card, CardBody, CardHeader, Link } from "@nextui-org/react";
import { ClockRotateRight, FeDocument, MdiCalendar, UserAlt } from "@/Components/Icons";
import React from "react";
import StatsCard from "@/Components/Dashboard/StatsCard";
import RecentApplicationsList from "@/Components/Dashboard/RecentApplicationsList";
import ReviewTypeStats from "@/Components/Dashboard/ReviewTypeStats";
import { DashboardPageProps } from "@/types";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

const Dashboard: React.FC<DashboardPageProps> = ({ stats, auth }) => {
    const isStaffOrChairperson = ['staff', 'chairperson'].includes(auth.user.role);

    return (
        <Authenticated header="Dashboard">
            <Head title="Dashboard" />

            <div className="py-6 space-y-6">
                {/* Stats Overview */}
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
                        color="primary"
                    />
                    <StatsCard
                        title="Pending Reviews"
                        value={stats.pendingReviews.length}
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

                {/* Charts and Lists Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ReviewTypeStats data={stats.applicationsByReviewType} />
                    <RecentApplicationsList applications={stats.recentApplications} />
                </div>

                {/* Staff/Chairperson Specific Section */}
                {isStaffOrChairperson && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Pending Decision Letters */}
                        <Card>
                            <CardHeader className="px-6 py-4">
                                <h3 className="text-lg font-semibold">
                                    Pending Decision Letters
                                </h3>
                            </CardHeader>
                            <CardBody className="px-4">
                                <div className="divide-y gap-3">
                                    {stats.pendingDecisionLetters.map((app) => (
                                        <div key={app.id} >
                                            <Link
                                                href={route('applications.show', {application: app})}
                                                className="font-medium"
                                            >
                                                {app.research_title}
                                            </Link>
                                            <p className="text-sm text-default-500">
                                                Awaiting {auth.user.role === 'staff'
                                                ? 'upload'
                                                : 'signature'}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </CardBody>
                        </Card>

                    </div>
                )}
            </div>
        </Authenticated>
    );
};

export default Dashboard;
