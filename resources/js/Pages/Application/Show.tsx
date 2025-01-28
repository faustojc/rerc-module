import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Application, AppStatus, PageProps } from "@/types";
import { Card, CardBody, Chip, Spinner } from "@nextui-org/react";
import { MdiCalendar, MdiCodeTags, MdiPeople } from "@/Components/Icons";
import React, { lazy, Suspense, useEffect, useMemo, useState } from "react";
import Statuses from "@/Components/Application/Statuses";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";

interface ApplicationShowProps extends PageProps {
    application: Application;
}

const Show = (props: ApplicationShowProps) => {
    const statusList = [
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
    ];

    const [application, setApplication] = useState<Application>(props.application);
    const [statuses, setStatuses] = useState<AppStatus[]>(props.application.statuses);

    const [selectedStatus, setSelectedStatus] = useState<AppStatus>(
        props.application.statuses.slice(-1)[0] ?? props.application.statuses[0]
    );

    const componentForms = [
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
    ];

    const StatusComponent = useMemo(() => {
        return componentForms[selectedStatus.sequence - 1];
    }, [componentForms, selectedStatus]);

    const updateMessage = (data: any) => {
        setStatuses((prev) => {
            return prev.map((status) => {
                if (status.id !== data.message_thread.app_status_id) {
                    return status;
                }

                let updatedMessages;
                const messageExists = status.messages.some(
                    (msg) => msg.id === data.message_thread.id
                );

                if (messageExists) {
                    updatedMessages = status.messages.map((msg) =>
                        msg.id === data.message_thread.id
                            ? data.message_thread
                            : msg
                    );
                } else {
                    updatedMessages = [...status.messages, data.message_thread];
                }

                return {
                    ...status,
                    messages: updatedMessages
                };
            });
        });
    }

    useEffect(() => {
        console.log(props);

        window.Echo.channel('application.' + application.id)
            .listen('.ApplicationUpdated', (data: any) => {
                toast.info(data.message ?? `${data.application.research_name}'s status has been updated`)
                setApplication({
                    ...application,
                    ...data.application
                });

                if (data.application.statuses) {
                    setStatuses((prevStatuses) => {
                        return prevStatuses.map((status) => {
                            const updatedStatus = data.application.statuses.find((s: AppStatus) => s.id === status.id);
                            const messages = status.messages;

                            return updatedStatus ? {
                                ...status,
                                ...updatedStatus,
                                messages: messages
                            } : status;
                        });
                    });
                }
            }).listen('.SendAndUpdateFeedback', (data: any) => {
                updateMessage(data);
            });


        return () => {
            window.Echo.leaveChannel(`application.${props.application.id}`);
        }
    }, []);

    return (
        <Authenticated header={"Research Information"}>
            <div className="py-3 mx-auto">
                <Card>
                    <CardBody className="flex-col items-start sm:px-7 p-4">
                        <h3 className="text-xl font-semibold text-start">{application.research_title}</h3>
                        <div className="flex items-center mt-3">
                            <MdiCodeTags className="mr-2" />
                            <p className="text-sm">
                                Protocol Code:
                            </p>
                            <Chip className="ml-1 border-none" size="sm" variant={application.protocol_code ? 'shadow' : 'dot'} color={application.protocol_code ? 'primary' : 'default'}>
                                {application.protocol_code ?? "N/A"}
                            </Chip>
                        </div>
                        <div className="flex items-center mt-1">
                            <MdiPeople className="mr-2" />
                            <p className="text-sm">
                                Members: {application.members.map((member) => member.firstname + " " + member.lastname).join(', ')}
                            </p>
                        </div>
                        <div className="flex items-center mt-1">
                            <MdiCalendar className="mr-2" />
                            <p className="text-sm">
                                {new Date(application.date_applied).toLocaleDateString('en-US', {
                                    month: 'short', day: 'numeric', year: 'numeric'
                                })}
                            </p>
                        </div>
                    </CardBody>
                </Card>
                <div className="lg:grid grid-cols-3 gap-4 mt-4">
                    {/* Application Statuses */}
                    <Statuses statusList={statusList}
                              appStatuses={statuses}
                              selectedStatus={selectedStatus}
                              setSelectedStatus={setSelectedStatus}
                    />
                    {/* Steps Info */}
                    <AnimatePresence>
                        <motion.div key={selectedStatus.sequence} className="col-span-2" initial={{ opacity: 0, scale: 0.99 }} animate={{ opacity: 1, scale: 1.0 }}>
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
                                            user={props.auth.user}
                                            application={application}
                                            status={statuses[selectedStatus.sequence - 1]}
                                            setApplication={setApplication}
                                            setStatuses={setStatuses}
                                        />
                                    </Suspense>
                                </>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </Authenticated>
    );
}

export default Show;
