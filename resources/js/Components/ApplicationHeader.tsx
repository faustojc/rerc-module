import React from "react";
import { Card, CardBody, Divider } from "@nextui-org/react";
import { StatusBadge } from "@/Components/StatusBadge";
import { ArrowsSwitch, FlowbiteUsersSolid, Key, MdiCalendar } from "@/Components/Icons";
import { Application } from "@/types";
import { parseAbsolute } from "@internationalized/date";
import ResearcherInfo from "@/Components/ResearcherInfo";

const ApplicationHeader: React.FC<{
    application: Omit<Application, 'documents' | 'review_results' | 'ethics_clearance' | 'meeting' | 'decision_letter' | 'requirements'>;
}> = ({
    application
}) => {
    const currentStep = application.statuses[application.statuses.length - 1];

    const formatDate = (dateString: string) => {
        const date = parseAbsolute(dateString, 'UTC').toDate();

        return new Intl.DateTimeFormat(undefined, {
            dateStyle: 'long',
            timeStyle: 'short',
        }).format(date);
    };

    return (
        <Card className="w-full">
            <CardBody className="p-6">
                <div className="space-y-6">
                    {/* Title and Status Section */}
                    <div className="flex flex-col items-start sm:flex-row sm:justify-between sm:gap-0 gap-4">
                        <div className="space-y-2">
                            <h1 className="text-2xl font-bold text-default-900">
                                {application.research_title}
                            </h1>
                            <div className="text-right">
                                <div className="flex items-center text-xs sm:text-sm text-default-500">
                                    <MdiCalendar className="w-4 h-4 mr-2" />
                                    Submitted on {formatDate(application.date_applied)}
                                </div>
                                {application.protocol_date_updated && (
                                    <div className="flex items-center text-xs sm:text-sm text-default-500 mt-1">
                                        <Key className="w-6 h-6" />
                                        Protocol assigned on {formatDate(application.protocol_date_updated)}
                                    </div>
                                )}
                            </div>
                        </div>
                        <StatusBadge
                            type={application.review_type}
                            code={application.protocol_code}
                        />
                    </div>

                    <Divider />

                    {/* Researchers Section */}
                    <div className="flex flex-col items-start sm:flex-row sm:justify-between sm:gap-0 gap-4">
                        <ResearcherInfo
                            mainResearcher={{
                                firstname: application.firstname,
                                lastname: application.lastname,
                            }}
                            members={application.members}
                        />

                        {/* Quick Stats */}
                        <div className="flex items-center space-x-6">
                            <div className="text-center">
                                <div className="flex items-center justify-center text-2xl font-semibold text-default-900">
                                    <FlowbiteUsersSolid className="w-6 h-6 mr-2" />
                                    {application.members.length}
                                </div>
                                <p className="text-sm text-default-500">
                                    Total Researcher{application.members.length > 1 ? 's' : ''}
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="flex items-center justify-center text-2xl font-semibold text-default-900">
                                    <ArrowsSwitch className="w-6 h-6 mr-2" />
                                    {currentStep.sequence}
                                </div>
                                <p className="text-sm text-default-500">
                                    Current Step
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
};

export default React.memo(ApplicationHeader);
