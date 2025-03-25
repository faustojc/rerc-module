import React, { ChangeEvent, Fragment, useMemo, useState } from "react";
import { Alert, Button, Card, CardBody, CardFooter, CardHeader, Chip, Divider, Link } from "@nextui-org/react";
import { ApplicationFormProps, AppStatus, Requirement, User } from "@/types";
import { toast } from "react-toastify";
import { LightUploadRounded, LinkBold, MdiDeleteForever } from "@/Components/Icons";
import Feedbacks from "@/Components/Application/Feedbacks";
import NavStatus from "@/Components/NavStatus";
import { applicationRequirements } from "@/types/constants";

interface AlertType {
    title?: string;
    message: string;
    type: "default" | "primary" | "secondary" | "success" | "warning" | "danger";
}

const ApplicationRequirements = ({user, application, status, handleUpdateApplication, handleMessage}: ApplicationFormProps) => {
    const requirementNames = [
        "Full Research Proposal Manuscript",
        "Agency Consent Letter",
        "Inform Consent Form (ICF) or Free Prior and Informed Consent (FPIC)",
        "Curriculum Vitae of the Researcher(s)",
        "Asset Form",
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
                    requirements: response.data.application.requirements
                }
            })

            setAlert({
                title: "Requirements submitted!",
                message: "Waiting for the RERC Staff's approval of all the requirements",
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
            });

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
                    <CardBody className="gap-6 sm:max-h-[870px] sm:overflow-y-auto">
                        {applicationRequirements.map((requirement, index) => {
                            const uploaded = uploadedRequirements.filter((req) =>
                                req.name.toLowerCase() === requirement.name.toLowerCase()
                            );

                            return (
                                <Fragment key={requirement.name}>
                                    <div className={`flex flex-col gap-2${index == requirementNames.length - 1 ? ' mb-2' : ''}`}>
                                        <div className="flex flex-row justify-between gap-3 mb-3">
                                            <div className="flex flex-col gap-1">
                                                <h3 className="font-bold">{index + 1}. {requirement.name}</h3>
                                                {requirement.description && (
                                                    <p className="text-sm text-default-400">
                                                        {requirement.description}
                                                    </p>
                                                )}
                                            </div>
                                            {user.role === 'researcher' && (
                                                <label className="block">
                                                    <div className="flex flex-row gap-2 cursor-pointer py-1.5 px-4 rounded-full font-semibold border-2 border-indigo-300 text-primary-700 hover:border-primary-100 hover:bg-primary-100 transition">
                                                        <LightUploadRounded />
                                                        Upload
                                                    </div>
                                                    <input
                                                        type="file"
                                                        name={requirement.name}
                                                        onChange={(e) => handleFileChange(e, requirement.name)}
                                                        className="hidden"
                                                    />
                                                </label>
                                            )}
                                        </div>
                                        <div className="sm:mt-0 mt-4">
                                            {user.role === 'researcher' && (
                                                <>
                                                    {selectedFiles[requirement.name] && selectedFiles[requirement.name].length > 0 && (
                                                        <div className="my-2 px-4 py-1 bg-default-100 shadow-lg rounded-xl">
                                                            <h5 className="text-sm">Selected files:</h5>
                                                            {selectedFiles[requirement.name].map((file, index) => (
                                                                <div key={file.name} className="inline-flex flex-nowrap items-center justify-between w-full">
                                                                <span className="text-sm text-nowrap text-ellipsis truncate">
                                                                    {file.name}
                                                                </span>
                                                                    <Button onPress={() => removeSelectedFile(requirement.name, index)}
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
                                            {(uploaded.length > 0) ? uploaded.map((u) => (
                                                <div key={u.id} className="flex flex-row justify-between mb-2">
                                                    <div className="flex flex-col">
                                                        <Link
                                                            className="inline-flex w-full cursor-pointer p-1"
                                                            href={route('applications.requirements.download', {application: application, requirement: u})}
                                                            color="foreground"
                                                            underline="always"
                                                        >
                                                            <LinkBold className="mr-2" scale={1.1} />
                                                            <p className="text-sm line-clamp-1">
                                                                {u.file_url.split('\\').pop()?.split('/').pop()}
                                                            </p>
                                                        </Link>
                                                        <p className="ml-1 text-xs text-default-500">
                                                            {new Date(u.date_uploaded).toLocaleDateString('en-US', {
                                                                month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                                            })}
                                                        </p>
                                                    </div>
                                                    <div className="flex flex-row justify-center items-center gap-2">
                                                        <Chip size="sm" variant="flat" color={u.status.toLowerCase() === 'uploaded' ? 'primary' : 'success'}>
                                                            {u.status}
                                                        </Chip>
                                                        {(user.role === 'researcher' && u.status.toLowerCase() !== 'approved') && (
                                                            <Button isIconOnly variant="light" color="danger" onPress={() => handleDeleteRequirement(u)}>
                                                                <MdiDeleteForever />
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            )) : (
                                                <>
                                                    {(user.role != 'researcher') && <p className="text-sm text-default-500">No files submitted</p>}
                                                </>
                                            )}
                                            {/* End of list of uploaded requirements */}
                                        </div>
                                    </div>
                                    {(index < applicationRequirements.length - 1 && requirement.name.length > 1) && <Divider key={index} />}
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
    const hasEverySubmitted = requirements.length > 0 && requirements.every((req) => req.status.toLowerCase() === 'submitted');

    if (user.role === 'researcher') {
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
                                Submit Uploaded Requirements
                            </Button>
                        )}
                    </div>
                </CardFooter>
            </>
        )
    }
    else if (user.role === 'staff' && status.status !== 'Approved' && hasEverySubmitted) {
        return (
            <>
                <Divider />
                <CardFooter className="justify-end">
                    {alert.message && <Alert description={alert.message} title={alert.title} color={alert.type} />}
                    <Button color="primary" variant="shadow" onPress={() => handleApprove()} isLoading={loading}>
                        Approve All the Submitted Requirements
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
