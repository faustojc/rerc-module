import { ApplicationFormProps } from "@/types";
import { Alert, Button, Card, CardBody, CardFooter, CardHeader, Divider, Link, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import React, { useCallback, useMemo, useState } from "react";
import NavStatus from "@/Components/NavStatus";
import Feedbacks from "@/Components/Application/Feedbacks";
import { CloudArrowDown } from "@/Components/Icons";
import AdditionalMessage from "@/Components/Application/Forms/AdditionalRequirements/AdditionalMessage";
import RequirementForm from "@/Components/Application/Forms/AdditionalRequirements/RequirementForm";
import { toast } from "react-toastify";

export interface AlertType {
    title?: string;
    message: string;
    type: "default" | "primary" | "secondary" | "success" | "warning" | "danger";
}

const AdditionalRequirements = ({user, application, status, handleUpdateApplication, handleMessage}: ApplicationFormProps) => {
    const [currTab, setCurrTab] = useState<string>('requirements');
    const [loading, setLoading] = useState<boolean>(false);
    const [hasApproved, setHasApproved] = useState<boolean>(status != null && status.end != null);

    const alert: AlertType = useMemo(() => {
        if (hasApproved) {
            return {
                message: "Additional requirements has been approved",
                type: 'success'
            }
        }

        if (user.role === 'staff') {
            return {
                message: "Double check the additional requirements before approving.",
                type: 'warning'
            };
        }

        return {
            message: "Waiting for the staff to approve the additional requirements.",
            type: 'warning'
        }
    }, [user.role, hasApproved]);

    const additionalRequirements = useMemo(() => {
        return application.requirements.filter(r => r.is_additional);
    }, [application.requirements]);

    const formatDate = useCallback((dateString?: string) => {
        if (!dateString) return '';

        const date = new Date(dateString);
        return Intl.DateTimeFormat(undefined, {
            dateStyle: 'medium',
            timeStyle: 'short',
        }).format(date);
    }, []);

    const handleApproveRequirement = () => {
        setLoading(true);

        window.axios.patch(route('applications.requirements.update-statuses', {application: application}), {
            requirement_ids: additionalRequirements.map((req) => req.id),
            requirement_status: 'Approved',
            status_id: status.id,
            next_status_name: 'Ethics Clearance',
            new_status: 'Approved',
            is_completed: true,
            message: `Additional requirements has been approved by ${user.name}`
        }).then((response) => {
            handleUpdateApplication({
                application: {
                    requirements: response.data.application.requirements,
                    statuses: response.data.application.statuses
                }
            });

            setHasApproved(true);
        }).finally(() => setLoading(false));
    }

    const onUploadRequirement = async (name: string, file: File) => {
        const formData = new FormData();
        formData.append('is_additional', 'true');
        formData.append(`requirements[${name}][${0}][file]`, file);

        try {
            const response = await window.axios.post(
                route('applications.requirements.store', {application: application}),
                formData, {headers: {'Content-Type': 'multipart/form-data'}}
            );

            handleUpdateApplication({
                application: {
                    requirements: [
                        ...response.data.requirements,
                    ]
                }
            });
        } catch (e: any) {
            console.log(e.message ?? 'An error occurred while uploading the requirement.');
        }
    }

    const onPostMessage = async (content: string) => {
        const routeUrl = application.message_post
            ? route('applications.message-posts.update', {application: application, message_post:  application.message_post})
            : route('applications.message-posts.store', {application: application});

        try {
            const response = application.message_post
                ? await window.axios.patch(routeUrl, {content: content})
                : await window.axios.post(routeUrl, {content: content});

            handleUpdateApplication({
                application: { message_post: response.data.message_post }
            })
        } catch (e: any) {
            console.error(e);
            toast.error('Something went wrong while posting the message. Pleas try again');
        }
    }

    return (
        <Card className="sticky self-start top-0">
            <CardHeader className="flex-col items-start bg-success-300">
                <h3 className="text-xl font-semibold text-start">Additional Requirements</h3>
                <p className="text-sm">
                    {user.role === 'researcher'
                        ? 'Upload additional requirements for the staff to review.'
                        : 'List of additional requirements submitted by the researchers.'
                    }
                </p>
            </CardHeader>
            <NavStatus currTab={currTab} setCurrTab={setCurrTab} tabs={[
                {label: 'Requirements', name: 'requirements'},
                {label: 'Message', name: 'message'},
                {label: 'Upload Requirement', name: 'upload', notFor: () => user.role !== 'researcher' || hasApproved},
                {label: 'Feedbacks', name: 'feedbacks', notFor: () => status == null},
            ]} />
            {currTab === 'requirements' && (
                <>
                    <CardBody>
                        <Table removeWrapper>
                            <TableHeader>
                                <TableColumn>NAME</TableColumn>
                                <TableColumn>DATE UPLOADED</TableColumn>
                                <TableColumn>ACTIONS</TableColumn>
                            </TableHeader>
                            <TableBody items={additionalRequirements}>
                                {(r) => (
                                    <TableRow>
                                        <TableCell>{r.name}</TableCell>
                                        <TableCell>{formatDate(r.date_uploaded)}</TableCell>
                                        <TableCell>
                                            <Link href={route('applications.requirements.download', {requirement: r})} download>
                                                <CloudArrowDown />
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                        {additionalRequirements.length === 0 && (
                            <p className="text-center text-sm text-default-500">No additional requirements uploaded.</p>
                        )}
                    </CardBody>
                    <Divider />
                    <CardFooter className="flex-col items-end gap-3">
                        {(alert.message && !loading) && <Alert variant="flat" color={alert.type} title={alert.message}  />}
                        {(user.role === 'staff' && !hasApproved) && (
                            <Button color="primary" variant="shadow" isLoading={loading} onPress={handleApproveRequirement}>
                                {additionalRequirements.length > 0 ? 'Approve All Requirements' : 'Proceed to Next Step'}
                            </Button>
                        )}
                    </CardFooter>
                </>
            )}
            {currTab === 'message' && (
                <AdditionalMessage user={user} messagePost={application.message_post} onPostMessage={onPostMessage} />
            )}
            {currTab === 'upload' && (
                <RequirementForm onUploadRequirement={onUploadRequirement} />
            )}
            {currTab === 'feedbacks' && (
                <Feedbacks user={user} status={status} handleMessage={handleMessage} />
            )}
        </Card>
    );
}

export default AdditionalRequirements;
