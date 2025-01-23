import { ApplicationFormProps, AppStatus, DecisionLetter as AppDecisionLetter, User } from "@/types";
import { Button, Card, CardBody, CardFooter, CardHeader, Chip, Divider, Link } from "@nextui-org/react";
import React, { ChangeEvent, useState } from "react";
import { toast } from "react-toastify";
import { MdiDeleteForever } from "@/Components/Icons";
import InputFile from "@/Components/InputFile";

const DecisionLetter = ({user, application, status, setApplication, setStatuses}: ApplicationFormProps) => {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);

    const handleSelectFile = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;

        if (files && files.length > 0) {
            setFile(files[0]);
            setIsError(false);
        }
    }

    const handleDelete = () => {
        if (!application.decision_letter) {
            return;
        }

        setLoading(true);
        window.axios.delete(route('applications.decision-letter.destroy', {
            application: application,
            decision_letter: application.decision_letter,
            status_id: status.id
        })).then((_) => {
            setFile(null);

            setApplication({
                ...application,
                decision_letter: null
            });
            setStatuses((prev) => {
                const statuses = [...prev];

                statuses[4] = {
                    ...statuses[4],
                    status: "Removed",
                }

                return statuses;
            });
        }).catch((error) => {
            toast.error(error.message ?? 'An error occurred. Please try again.');
            console.error(error);
        }).finally(() => setLoading(false));
    }

    const handleUpload = () => {
        if (file === null) {
            setIsError(true);
            return;
        }

        const formData = new FormData();

        formData.append('file', file!);
        formData.append('status_id', status.id);
        formData.append('message', `${application.research_title}'s decision letter has been uploaded`);
        formData.append('new_status', 'Uploaded');

        setLoading(true);
        window.axios.post(route('applications.decision-letter.store', {application: application}), formData, {
            headers: {'Content-Type': 'multipart/form-data'}
        }).then((response) => {
            setFile(null);

            setApplication({
                ...application,
                decision_letter: response.data.decision_letter
            });
            setStatuses((prev) => {
                const statuses = [...prev];
                statuses[4] = response.data.status;

                return statuses;
            })
        }).catch((error) => {
            toast.error(error.message ?? 'An error occurred. Please try again.');
            console.error(error);
        }).finally(() => setLoading(false));
    }

    const handleUpdateSigned = () => {
        if (file === null) {
            setIsError(true);
            return;
        }

        const formData = new FormData();
        formData.append('file', file!);
        formData.append('status_id', status.id);
        formData.append('is_signed', '1');
        formData.append('message', `${application.research_title}'s decision letter has been signed`);

        setLoading(true);
        window.axios.post(route('applications.decision-letter.store', {application: application}), formData, {
            headers: {'Content-Type': 'multipart/form-data'}
        }).then((response) => {
            setFile(null);

            setApplication({
                ...application,
                decision_letter: response.data.decision_letter
            });
            setStatuses((prev) => {
                const statuses = [...prev];

                statuses[4] = response.data.status;
                statuses.push(response.data.next_status);

                return statuses;
            })
        }).catch((error) => {
            toast.error(error.message ?? 'An error occurred. Please try again.');
            console.error(error);
        }).finally(() => setLoading(false));
    }

    return (
        <Card className="sticky self-start top-0">
            <CardHeader className="flex-col items-start bg-success-300">
                <h3 className="text-xl font-semibold text-start">Decision Letter</h3>
                <p className="text-sm">
                    {user.role !== "staff"
                        ? "Decision letter from the RERC Staff."
                        : "Upload the final decision letter for the application."
                    }
                </p>
            </CardHeader>
            <CardBody className="p-4">
                {(application.decision_letter !== null) ? (
                    <>
                        <FileLink user={user} decision_letter={application.decision_letter} loading={loading} handleDelete={handleDelete} />
                        {(user.role === 'chairperson' && status !== null && status.status === "Uploaded") && (
                            <>
                                <Divider className="my-4" />
                                <InputFile label="Upload the Signed Decision Letter"
                                           type="file"
                                           acceptedTypes=".pdf,.doc,.docx"
                                           file={file}
                                           isError={isError}
                                           handleSelectFile={handleSelectFile}
                                />
                            </>
                        )}
                    </>
                ) : (
                    <>
                        {user.role !== "staff" ? (
                            <div className="text-center italic p-5">
                                {status && status?.status === "Pending"
                                    ? "RERC Staff has not uploaded the decision letter yet."
                                    : "Waiting for RERC Staff to upload the decision letter."
                                }
                            </div>
                        ) : (
                            <InputFile label="Upload Decision Letter"
                                       file={file}
                                       type="file"
                                       acceptedTypes=".pdf,.doc,.docx"
                                       isError={isError}
                                       handleSelectFile={handleSelectFile}
                            />
                        )}
                    </>
                )}
            </CardBody>
            {(user.role !== "researcher" && status !== null)
                && <Footer user={user}
                           status={status}
                           decision_letter={application.decision_letter}
                           loading={loading}
                           handleUpload={handleUpload}
                           handleUpdate={handleUpdateSigned}
                    />
            }
        </Card>
    );
}

const FileLink = ({user, decision_letter, loading, handleDelete}: {
    user: User,
    decision_letter: AppDecisionLetter,
    loading: boolean,
    handleDelete: () => void,
}) => {
    const displayDeleteBtn = user.role === "staff" && !decision_letter.is_signed;
    const isSigned = decision_letter.is_signed === 1;

    return (
        <div className="flex flex-col">
            <div className="flex flex-nowrap items-center">
                <Link showAnchorIcon
                      underline="hover"
                      color="primary"
                      href={route('decision-letter.download', {decision_letter: decision_letter})}
                      className="text-ellipsis px-0 py-2"
                >
                    {decision_letter.file_name}
                </Link>
                {displayDeleteBtn && (
                    <Button isIconOnly isLoading={loading} variant="light" color="danger" onPress={handleDelete}>
                        <MdiDeleteForever />
                    </Button>
                )}
                {isSigned && (
                    <Chip className="ml-2 border-none" variant="shadow" color="success">
                        Signed
                    </Chip>
                )}
            </div>
            <p className="text-medium">
                Date Uploaded: {new Date(decision_letter.date_uploaded).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit',
                })}
            </p>
        </div>
    );
}

const Footer = ({user, status, decision_letter, loading, handleUpload, handleUpdate}: {
    user: User,
    status: AppStatus,
    decision_letter: AppDecisionLetter | null,
    loading: boolean,
    handleUpload: () => void,
    handleUpdate: () => void,
}) => {
    if (user.role === "staff" && status.status !== "Uploaded" && decision_letter === null) {
        return (
            <>
                <Divider />
                <CardFooter className="justify-end">
                    <Button color="secondary" variant="shadow" isLoading={loading} onPress={handleUpload}>
                        Upload
                    </Button>
                </CardFooter>
            </>
        )
    }
    else if (user.role === 'chairperson' && decision_letter !== null && status.status !== "Signed") {
        return (
            <>
                <Divider />
                <CardFooter className="justify-end">
                    <Button color="secondary" variant="shadow" isLoading={loading} onPress={handleUpdate}>
                        Upload Signed
                    </Button>
                </CardFooter>
            </>
        )
    }

    return null;
}

export default DecisionLetter;
