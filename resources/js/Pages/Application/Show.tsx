import React, { lazy, memo, Suspense, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Authenticated from '@/Layouts/AuthenticatedLayout';
import { Card, CardBody, Chip, Spinner } from '@nextui-org/react';
import { Application, ApplicationFormProps, ApplicationUpdatedEvent, AppStatus, PageProps, User } from "@/types";
import { useApplication } from '@/Hooks/useApplication';
import Statuses from "@/Components/Application/Statuses";
import { MdiCalendar, MdiCodeTags, MdiPeople } from "@/Components/Icons";

interface ApplicationShowProps extends PageProps {
    application: Application;
}

const Show = memo((props: ApplicationShowProps) => {
    const statusList = useMemo(() => [
        "Application Submission",
        "Protocol Assignment",
        "Initial Review",
        "Review Type",
        "Decision Letter",
        "Payment Made",
        "Assignment of Panel & Meeting Schedule",
        "Review Result",
        "Additional Requirements",
        "Ethics Clearance"
    ], []);

    const { application, handleUpdateApplication, handleMessage } = useApplication(props.application);

    const [selectedStatus, setSelectedStatus] = useState<AppStatus>(() =>
        props.application.statuses.slice(-1)[0] ?? props.application.statuses[0]
    );

    const componentForms = useMemo(() => [
        lazy(() => import("@/Components/Application/Forms/ApplicationRequirements")),
        lazy(() => import("@/Components/Application/Forms/ProtocolAssignment")),
        lazy(() => import("@/Components/Application/Forms/InitialReview")),
        lazy(() => import("@/Components/Application/Forms/ReviewType")),
        lazy(() => import("@/Components/Application/Forms/DecisionLetter")),
        lazy(() => import("@/Components/Application/Forms/PaymentMade")),
        lazy(() => import("@/Components/Application/Forms/PanelMeeting")),
        lazy(() => import("@/Components/Application/Forms/ReviewResult")),
        lazy(() => import("@/Components/Application/Forms/AdditionalRequirements")),
        lazy(() => import("@/Components/Application/Forms/EthicsClearance"))
    ], []);

    const StatusComponent = useMemo(() =>
            componentForms[selectedStatus.sequence - 1],
        [componentForms, selectedStatus.sequence]
    );

    const formattedDate = useMemo(() =>
            new Date(application.date_applied).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            }),
        [application.date_applied]
    );

    const membersString = useMemo(() =>
            application.members.map(member => `${member.firstname} ${member.lastname}`).join(', '),
        [application.members]
    );

    return (
        <Authenticated header="Research Information">
            <div className="py-3">
                <ApplicationHeader
                    title={application.research_title}
                    protocolCode={application.protocol_code}
                    members={membersString}
                    date={formattedDate}
                />

                <div className="lg:grid grid-cols-3 gap-4 mt-4">
                    <Statuses
                        statusList={statusList}
                        appStatuses={application.statuses}
                        selectedStatus={selectedStatus}
                        setSelectedStatus={setSelectedStatus}
                    />
                    <StatusSection
                        StatusComponent={StatusComponent}
                        selectedStatus={selectedStatus}
                        application={application}
                        status={application.statuses[selectedStatus.sequence - 1]}
                        user={props.auth.user}
                        handleUpdateApplication={handleUpdateApplication}
                        handleMessage={handleMessage}
                    />
                </div>
            </div>
        </Authenticated>
    );
});

const ApplicationHeader = memo(({
    title,
    protocolCode,
    members,
    date
}: {
    title: string;
    protocolCode: string | null;
    members: string;
    date: string;
}) => (
    <Card>
        <CardBody className="flex-col items-start sm:px-7 p-4">
            <h3 className="text-xl font-semibold text-start">{title}</h3>
            <div className="flex items-center mt-3">
                <MdiCodeTags className="mr-2" />
                <p className="text-sm">Protocol Code:</p>
                <Chip
                    className="ml-1 border-none"
                    size="sm"
                    variant={protocolCode ? 'shadow' : 'dot'}
                    color={protocolCode ? 'primary' : 'default'}
                >
                    {protocolCode ?? "N/A"}
                </Chip>
            </div>
            <div className="flex items-center mt-1">
                <MdiPeople className="mr-2" />
                <p className="text-sm">Members: {members}</p>
            </div>
            <div className="flex items-center mt-1">
                <MdiCalendar className="mr-2" />
                <p className="text-sm">{date}</p>
            </div>
        </CardBody>
    </Card>
));

const StatusSection = memo(({
    StatusComponent,
    selectedStatus,
    application,
    status,
    user,
    handleUpdateApplication,
    handleMessage
}: {
    StatusComponent: React.FunctionComponent<ApplicationFormProps>;
    selectedStatus: AppStatus;
    application: Application;
    status: AppStatus;
    user: User;
    handleUpdateApplication:  (data: ApplicationUpdatedEvent) => void
    handleMessage: (status: AppStatus, messageContent: string, userName: string) => Promise<void>
}) => (
    <AnimatePresence>
        <motion.div
            key={selectedStatus.sequence}
            className="col-span-2"
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1.0 }}
        >
            {StatusComponent && (
                <>
                    <Suspense fallback={
                        <Card>
                            <CardBody className="p-5 items-center justify-center">
                                <Spinner size="lg" />
                            </CardBody>
                        </Card>
                    }>
                        <StatusComponent
                            key={selectedStatus.sequence}
                            user={user}
                            application={application}
                            status={status}
                            handleUpdateApplication={handleUpdateApplication}
                            handleMessage={handleMessage}
                        />
                    </Suspense>
                </>
            )}
        </motion.div>
    </AnimatePresence>
));

ApplicationHeader.displayName = 'ApplicationHeader';
StatusSection.displayName = 'StatusSection';
Show.displayName = 'Show';

export default Show;
