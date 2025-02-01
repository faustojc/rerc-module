import { ApplicationFormProps } from "@/types";
import { Alert, Button, Card, CardBody, CardFooter, CardHeader, Divider, Input, Link, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import InputFile from "@/Components/InputFile";
import React, { useCallback, useMemo, useState } from "react";
import NavStatus from "@/Components/NavStatus";
import Feedbacks from "@/Components/Application/Feedbacks";
import { CloudArrowDown, LightUploadRounded } from "@/Components/Icons";

interface AlertType {
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
                    {additionalRequirements.length > 0 && (
                        <>
                            <Divider />
                            <CardFooter className="flex-col items-end gap-3">
                                {(alert.message && !loading) && <Alert variant="flat" color={alert.type} title={alert.message}  />}
                                {(user.role === 'staff' && !hasApproved) && (
                                    <Button color="primary" variant="shadow" isLoading={loading} onPress={handleApproveRequirement}>
                                        Approve Requirement
                                    </Button>
                                )}
                            </CardFooter>
                        </>
                    )}
                </>
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

const RequirementForm = ({onUploadRequirement}: {onUploadRequirement: (name: string, file: File) => Promise<void>}) => {
    const [name, setName] = useState<string>('');
    const [file, setFile] = useState<File | null>(null);

    const [isError, setIsError] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [alert, setAlert] = useState<AlertType>({
        message: '',
        type: 'default'
    });

    const handleSelectFile = (e:  React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files;

        if (selectedFile != null && selectedFile.length > 0) {
            setFile(selectedFile[0]);
            setIsError(false);
        } else {
            setIsError(true);
        }
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!file) {
            setIsError(true);
            return;
        }

        setLoading(true);
        setIsError(false);

        onUploadRequirement(name, file).then(() => {
            setName('');
            setFile(null);
            setLoading(false);
            setAlert({
                message: "Requirements uploaded successfully",
                type: 'success'
            });
        });
    }

    return (
        <form onSubmit={handleSubmit}>
            <CardBody className="px-4 gap-4">
                <div className="flex flex-col gap-3 mb-4">
                    <h5 className="text-medium font-medium text-start">Requirement Name</h5>
                    <Input placeholder="Enter requirement name"
                           value={name}
                           onChange={(e) => setName(e.target.value)}
                           className="max-w-sm"
                           required
                    />
                </div>

                <div className="flex flex-col gap-3">
                    <h3 className="text-medium font-medium text-start">Upload Additional Requirement</h3>
                    <InputFile file={file}
                               isError={isError}
                               handleSelectFile={handleSelectFile}
                               type="file"
                               accept=".pdf,.doc,.docx"
                               className="flex-1 max-w-sm"
                               required
                               reverseButton
                    />
                </div>
            </CardBody>
            <Divider />
            <CardFooter className="flex-col items-end gap-3">
                {alert.message && <Alert variant="flat" color="success" title={alert.message}  />}
                <Button color="primary" variant="shadow" type="submit" isLoading={loading}>
                    <LightUploadRounded />
                    Upload Requirement
                </Button>
            </CardFooter>
        </form>
    );
}

export default AdditionalRequirements;
