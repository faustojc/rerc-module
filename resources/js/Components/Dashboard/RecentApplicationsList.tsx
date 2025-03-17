import React from 'react';
import { Card, CardBody, CardHeader, Link } from "@nextui-org/react";
import { parseAbsolute } from '@internationalized/date';
import { Application } from "@/types";

interface RecentApplicationsListProps {
    applications: Application[];
}

const RecentApplicationsList: React.FC<RecentApplicationsListProps> = ({
    applications
}) => {
    const formatDate = (dateString: string) => {
        const date = parseAbsolute(dateString, 'UTC').toDate();
        return new Intl.DateTimeFormat(undefined, {
            dateStyle: 'medium',
        }).format(date);
    };

    return (
        <Card>
            <CardHeader className="px-6">
                <h3 className="text-lg font-semibold">Recent Applications</h3>
            </CardHeader>
            <CardBody>
                <div className="divide-y">
                    {applications.map((app) => (
                        <div key={app.id} className="py-3">
                            <div className="flex justify-between items-start gap-3">
                                <div>
                                    <Link href={route('applications.show', {application: app})} className="font-medium">
                                        {app.research_title}
                                    </Link>
                                    <p className="text-sm text-gray-500">
                                        {app.firstname} {app.lastname}
                                    </p>
                                    {app.members.length > 1 && (
                                        <p className="text-sm text-gray-500">
                                            {app.members.length - 1} other {app.members.length > 2 ? 'members' : 'member'}
                                        </p>
                                    )}
                                </div>
                                <div className="text-right text-nowrap">
                                    <p className="text-sm">{formatDate(app.date_applied)}</p>
                                    <p className="text-sm text-gray-500">{app.review_type?.toUpperCase()}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardBody>
        </Card>
    );
};

export default RecentApplicationsList;
