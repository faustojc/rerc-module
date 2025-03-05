import React, { lazy, memo, Suspense, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Authenticated from '@/Layouts/AuthenticatedLayout';
import { Card, CardBody, Spinner } from '@nextui-org/react';
import { Application, ApplicationFormProps, ApplicationUpdatedEvent, AppStatus, PageProps, User } from "@/types";
import { useApplication } from '@/Hooks/useApplication';
import Statuses from "@/Components/Application/Statuses";
import { Head } from "@inertiajs/react";
import ApplicationHeader from "@/Components/ApplicationHeader";

interface ApplicationShowProps extends PageProps {
    application: Application;
}

const Show = memo((props: ApplicationShowProps) => {
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

    return (
        <Authenticated header="Research Information">
            <Head title={application.research_title} />
            <div className="py-3">
                <ApplicationHeader application={application} />

                <div className="lg:grid grid-cols-3 space-y-4 sm:space-y-0 gap-4 mt-4">
                    <Statuses
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
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
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

export default Show;
