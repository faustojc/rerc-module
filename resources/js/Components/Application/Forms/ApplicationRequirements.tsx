import React, { ChangeEvent, Fragment, useMemo, useState } from "react";
import { Alert, Button, Card, CardBody, CardFooter, CardHeader, Divider, Link, LinkIcon } from "@nextui-org/react";
import { ApplicationFormProps, AppStatus, Requirement, User } from "@/types";
import { toast } from "react-toastify";
import { MdiDeleteForever } from "@/Components/Icons";
import Feedbacks from "@/Components/Application/Feedbacks";
import NavStatus from "@/Components/NavStatus";

interface AlertType {
    title?: string;
    message: string;
    type: "default" | "primary" | "secondary" | "success" | "warning" | "danger";
}

const ApplicationRequirements = ({user, application, status, handleUpdateApplication, handleMessage}: ApplicationFormProps) => {
    const requirementNames = [
        "Full Research Proposal",
        "Checklist for Proposal",
        "Endorsement Letters",
        "Work Plan/Gantt Chart",
        "Budget Proposal and Requirements",
        "Valid Government ID",
        "CV of Researcher",
    ]

    const [currTab, setCurrTab] = useState<string>('submissions');

    const [selectedFiles, setSelectedFiles] = useState<{ [key: string]: File[] }>({});

    const [loading, setLoading] = useState<boolean>(false);
    const [alert, setAlert] = useState<AlertType>({
        message: '',
        type: 'default'
    });

    const uploadedRequirements = useMemo(() => application.requirements, [application.requirements]);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>, requirementName: string) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedFiles({
                ...selectedFiles,
                [requirementName]: selectedFiles[requirementName]
                    ? [...selectedFiles[requirementName], ...Array.from(e.target.files)]
                    : Array.from(e.target.files)
            });
        }
    };

    const removeSelectedFile = (requirementName: string, fileIndex: number) => {
        setSelectedFiles((prevFiles) => {
            const updatedFiles = prevFiles[requirementName].filter((_, index) => index !== fileIndex);

            return {
                ...prevFiles,
                [requirementName]: updatedFiles,
            };
        });
    };

    const handleUpload = () => {
        const emptyFiles = Object.values(selectedFiles).every((files) => files.length === 0);

        if (emptyFiles) {
            setAlert({
                message: 'No files selected',
                type: 'danger'
            });

            return;
        }

        setLoading(true);
        setAlert({
            message: '',
            type: 'default'
        })

        const formData = new FormData();
        Object.entries(selectedFiles).forEach(([requirement, files]) => {
            files.forEach((file, index) => {
                formData.append(`requirements[${requirement}][${index}][file]`, file);
            });
        });

        window.axios.post(route('applications.requirements.store', {application: application}), formData, {
            headers: {'Content-Type': 'multipart/form-data'}
        }).then((response) => {
            handleUpdateApplication({
                application: {
                    requirements: [...application.requirements, ...response.data.requirements]
                }
            });

            setAlert({
                message: "Requirements uploaded successfully",
                type: 'success'
            });
            setSelectedFiles({});
        }).catch((_) => {
            setAlert({
                message: "An error occurred while uploading requirements",
                type: 'danger'
            });
        }).finally(() => setLoading(false));
    }

    const handleSubmit = () => {
        setLoading(true);

        const newStatus = "Waiting for Approval";

        window.axios.patch(route('applications.requirements.update-statuses', {application: application}), {
            requirement_ids: uploadedRequirements.map((req) => req.id),
            requirement_status: 'Submitted',
            status_id: status.id,
            new_status: newStatus,
            message: `${application.research_title}'s requirements has been submitted`
        }).then((response) => {
            handleUpdateApplication({
                application: {
                    statuses: response.data.application.statuses,
                }
            })

            setAlert({
                title: "Requirements submitted!",
                message: "Waiting for the RERC Staff's approval of the requirements",
                type: 'primary'
            });
        }).finally(() => setLoading(false));
    }

    const handleApprove = () => {
        setLoading(true);

        window.axios.patch(route('applications.requirements.update-statuses', {application: application}), {
            requirement_ids: uploadedRequirements.map((req) => req.id),
            requirement_status: 'Approved',
            status_id: status.id,
            next_status_name: 'Protocol Assignment',
            new_status: 'Approved',
            is_completed: true,
            message: `${application.research_title} has been approved by ${user.name}`
        }).then((response) => {
            handleUpdateApplication({
                application: {
                    requirements: response.data.application.requirements,
                    statuses: response.data.application.statuses
                }
            })

            setAlert({
                message: `Requirements has been approved`,
                type: 'secondary'
            })
        }).finally(() => setLoading(false));
    }

    const handleDeleteRequirement = (r: Requirement) => {
        window.axios.delete(route('requirements.destroy', {requirement: r})).then((_) => {
            toast.success(`${r.file_url.split('\\').pop()?.split('/').pop()} deleted successfully`);

            handleUpdateApplication({
                application: {
                    requirements: application.requirements.filter((req) => req.id !== r.id)
                }
            })
        });
    }

    return (
        <Card className="sticky self-start top-0">
            <CardHeader className="flex-col items-start bg-success-300">
                <h3 className="text-lg font-semibold">Requirements for Application</h3>
                <p className="text-sm text-default-800">
                    The list requirements for the application process are required in the following:
                </p>
            </CardHeader>
            <NavStatus currTab={currTab} setCurrTab={setCurrTab} tabs={[
                {name: 'submissions', label: 'Submissions'},
                {name: 'feedbacks', label: 'Feedbacks'}
            ]} />
            {currTab === 'submissions' ? (
                <div key="submissions">
                    <CardBody className="gap-6">
                        {requirementNames.map((requirement, index) => {
                            const uploaded = uploadedRequirements.filter((req) =>
                                req.name.toLowerCase() === requirement.toLowerCase()
                            );

                            return (
                                <Fragment key={requirement}>
                                    <div className={`sm:grid grid-cols-3${index == requirementNames.length - 1 ? ' mb-2' : ''}`}>
                                        <h3 className="font-bold">{index + 1}. {requirement}</h3>
                                        <div className="sm:mt-0 mt-4 col-span-2">
                                            {user.role === 'researcher' && (
                                                <>
                                                    <label>
                                                        <div className="w-full h-9 rounded-3xl border border-gray-300 justify-between items-center inline-flex">
                                                            <h2 className="text-default-900/50 text-sm font-normal leading-snug pl-4">
                                                                {selectedFiles[requirement] && selectedFiles[requirement].length > 0
                                                                    ? `${selectedFiles[requirement].length} file(s) selected`
                                                                    : 'No file selected'
                                                                }
                                                            </h2>
                                                            <input type="file"
                                                                   onChange={(e) => handleFileChange(e, requirement)}
                                                                   hidden
                                                                   accept=".pdf,.doc,.docx"
                                                            />
                                                            <div className="flex w-28 h-9 px-2 flex-col bg-indigo-500 rounded-r-3xl shadow text-white text-xs font-semibold leading-4 items-center justify-center cursor-pointer focus:outline-none">
                                                                Choose File
                                                            </div>
                                                        </div>
                                                    </label>
                                                    {selectedFiles[requirement] && selectedFiles[requirement].length > 0 && (
                                                        <div className="my-2">
                                                            {selectedFiles[requirement].map((file, index) => (
                                                                <div key={file.name} className="inline-flex flex-nowrap items-center justify-between w-full">
                                                                <span className="text-sm text-nowrap text-ellipsis truncate">
                                                                    {file.name}
                                                                </span>
                                                                    <Button onPress={() => removeSelectedFile(requirement, index)}
                                                                            size="sm"
                                                                            variant="light"
                                                                            color="danger"
                                                                            isIconOnly
                                                                    >
                                                                        <MdiDeleteForever />
                                                                    </Button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                            {/* List of uploaded requirements */}
                                            {(uploaded.length > 0) ? uploaded.map((u) => {
                                                return (
                                                    <div key={u.id} className="relative flex mt-1 min-w-0">
                                                        <Link
                                                            className="inline-flex justify-between w-full cursor-pointer p-1"
                                                            href={route('applications.requirements.download', {application: application, requirement: u})}
                                                            color="foreground"
                                                            underline="hover"
                                                            isExternal
                                                        >
                                                            <p className="text-sm truncate">
                                                                {u.file_url.split('\\').pop()?.split('/').pop()}
                                                            </p>
                                                            <LinkIcon />
                                                        </Link>
                                                        {(user.role === 'researcher' && u.status.toLowerCase() !== 'approved') && (
                                                            <Button isIconOnly variant="light" color="danger" onPress={() => handleDeleteRequirement(u)}>
                                                                <MdiDeleteForever />
                                                            </Button>
                                                        )}
                                                    </div>
                                                );
                                            }) : (
                                                <>
                                                    {(user.role != 'researcher') && <p className="text-sm text-default-500">No files submitted</p>}
                                                </>
                                            )}
                                            {/* End of list of uploaded requirements */}
                                        </div>
                                    </div>
                                    {(index < requirementNames.length - 1 && requirement.length > 1) && <Divider key={index} />}
                                </Fragment>
                            );
                        })}
                    </CardBody>
                    <Footer user={user}
                            status={status}
                            requirements={uploadedRequirements}
                            alert={alert}
                            loading={loading}
                            handleUpload={handleUpload}
                            handleSubmit={handleSubmit}
                            handleApprove={handleApprove}
                    />
                </div>
            ) : (
                <Feedbacks key="feedback-requirements" user={user} status={status} handleMessage={handleMessage} />
            )}
        </Card>
    )
}

const Footer = ({user, status, requirements, alert, loading, handleUpload, handleSubmit, handleApprove}: {
    user: User,
    status: AppStatus,
    requirements: Requirement[],
    alert: AlertType,
    loading: boolean,
    handleUpload: () => void,
    handleSubmit: () => void,
    handleApprove: () => void
}) => {
    const hasSomeSubmitted = requirements.some((req) => req.status.toLowerCase() === 'submitted');

    if (user.role === 'researcher' && status.end == null) {
        const hasSomeUploaded = requirements.some((req) => req.status.toLowerCase() === 'uploaded');

        return (
            <>
                <Divider />
                <CardFooter className="flex-col gap-5">
                    {alert.message && <Alert description={alert.message} title={alert.title} color={alert.type} />}
                    <div className="flex flex-row justify-end w-full gap-3">
                        <Button color="primary" variant="solid" onPress={() => handleUpload()} isLoading={loading}>
                            Upload Requirements
                        </Button>
                        {hasSomeUploaded && (
                            <Button color="secondary" variant="shadow" onPress={() => handleSubmit()} isLoading={loading}>
                                Submit Application
                            </Button>
                        )}
                    </div>
                </CardFooter>
            </>
        )
    }
    else if (user.role === 'staff' && status.status !== 'Approved' && hasSomeSubmitted) {
        return (
            <>
                <Divider />
                <CardFooter className="justify-end">
                    {alert.message && <Alert description={alert.message} title={alert.title} color={alert.type} />}
                    <Button color="primary" variant="shadow" onPress={() => handleApprove()} isLoading={loading}>
                        Approve Requirements
                    </Button>
                </CardFooter>
            </>
        )
    }
    else {
        return null;
    }
}

export default ApplicationRequirements;
