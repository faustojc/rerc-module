import { ApplicationFormProps } from "@/types";
import { Alert, Button, Card, CardBody, CardFooter, CardHeader, Divider, Link, Textarea } from "@nextui-org/react";
import React, { ChangeEvent, useMemo, useState } from "react";
import InputFile from "@/Components/InputFile";
import { toast } from "react-toastify";
import { getLocalTimeZone } from "@internationalized/date";
import { ClipboardError } from "@/Components/Icons";

const PaymentMade = ({user, application, status, handleUpdateApplication}: ApplicationFormProps) => {
    const [file, setFile] = useState<File | null>(null);
    const [details, setDetails] = useState("");
    const [isError, setIsError] = useState(false);
    const [loading, setLoading] = useState(false);

    const isDecisionLetterSigned = application.decision_letter != null && application.decision_letter.is_signed && status != null;
    const hasPayment = application.proof_of_payment_url != null;
    const confirmedStatus: {
        color: "success" | "danger" | "primary" | "default" | "secondary" | "warning" | undefined
        description: string
    } = useMemo(() => {
        if (status != null) {
            if (status.status === "Confirmed") {
                return {
                    color: "success",
                    description: "Payment has been confirmed."
                }
            }

            if (status.status === "Rejected") {
                return {
                    color: "danger",
                    description: user.role === 'researcher'
                        ? "Payment has been rejected. Please submit a new payment receipt."
                        : "Payment rejected. Please wait for the Researcher to upload a new payment receipt."
                }
            }
        }

        return {
            color: "primary",
            description: user.role === 'researcher'
                ? "Awaiting for the Review Committee to confirm the uploaded payment."
                : "Double check the uploaded payment receipt before confirming."
        }
    }, [user.role, status]);

    const handleSelectFile = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;

        if (files && files.length > 0) {
            setFile(files[0]);
            setIsError(false);
        }
    }

    const handleUploadPayment = () => {
        if (!file) {
            setIsError(true);
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("payment_details", details);
        formData.append("message", `${application.research_title}'s payment receipt uploaded.`);

        window.axios.post(route('applications.upload-payment', {application: application}), formData, {
            headers: {'Content-Type': 'multipart/form-data'}
        }).then(response => {
            handleUpdateApplication({
                application: {
                    proof_of_payment_url: response.data.proof_of_payment_url,
                    payment_date: response.data.payment_date,
                    payment_details: response.data.payment_details,
                    statuses: response.data.statuses
                }
            });
        }).catch(error => {
            toast.error("Failed to upload payment receipt. Please try again.");
            console.error(error);
        }).finally(() => setLoading(false));
    }

    const handleConfirmPayment = (canConfirm: boolean) => {
        setLoading(true);

        window.axios.post(route('applications.confirm-payment', {application: application}), {
            can_confirm: canConfirm,
            name: user.name
        }).then((r) => {
            const confirmStatus = canConfirm ? "Confirmed" : "Rejected";

            toast.success(`Payment status successfully set to ${confirmStatus}.`);
            handleUpdateApplication({application: {statuses: r.data.statuses}});
        }).catch((error) => {
            toast.error("Failed to confirm payment. Please try again.");
            console.error(error);
        }).finally(() => setLoading(false));
    }

    return (
        <Card className="sticky self-start top-0">
            <CardHeader className="flex-col items-start bg-success-300">
                <h3 className="text-xl font-semibold text-start">Payment Made</h3>
                <p className="text-sm">
                    {user.role === "researcher"
                        ? "Upload your payment receipt for the application."
                        : "Researcher's payment receipt for the application."
                    }
                </p>
            </CardHeader>
            <CardBody className="p-3">
                {isDecisionLetterSigned ? (
                    <>
                        {hasPayment ? (
                            <div className="flex flex-col items-start space-y-5 p-3">
                                <div>
                                    <h3 className="font-semibold text-start">Payment Receipt</h3>
                                    <Link
                                        showAnchorIcon
                                        underline="hover"
                                        color="primary"
                                        href={route('applications.payment-download', {application: application})}
                                        className="px-0 py-2"
                                        style={{ overflowWrap: 'anywhere' }}
                                    >
                                        {application.proof_of_payment_url.split('\\').pop()?.split('/').pop()}
                                    </Link>
                                </div>
                                <div>
                                    <h3 className="font-semibold">Date Uploaded:</h3>
                                    <p>
                                        {Intl.DateTimeFormat('en-US', {
                                            year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric", timeZone: getLocalTimeZone()
                                        }).format(new Date(application.payment_date))}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-2">Payment Details:</h3>
                                    <Textarea
                                        isReadOnly
                                        defaultValue={application.payment_details ?? "No details provided."}
                                        minRows={1}
                                        classNames={{
                                            inputWrapper: "!cursor-default !file:cursor-default",
                                            input: "!cursor-default !file:cursor-default"
                                        }}
                                    />
                                </div>

                                {user.role === "researcher" && status?.status === "Rejected" && (
                                    <div className="border-1 border-primary-500 rounded-md w-full p-3">
                                        <InputPayment file={file} details={details} isError={isError} setDetails={setDetails} handleSelectFile={handleSelectFile} />
                                    </div>
                                )}

                                <Alert color={confirmedStatus.color} description={confirmedStatus.description} />
                            </div>
                        ) : (
                            <>
                                {user.role === "researcher" ? (
                                    <InputPayment file={file} details={details} isError={isError} setDetails={setDetails} handleSelectFile={handleSelectFile} />
                                ) : (
                                    <div className="text-center py-8">
                                        <ClipboardError className="w-12 h-12 text-default-400 mx-auto mb-3" />
                                        <p className="text-default-500">
                                            Please wait for the researcher to upload their proof of payment receipt.
                                        </p>
                                    </div>
                                )}
                            </>
                        )}
                    </>
                ) : (
                    <p className="text-center text-medium p-5">
                        <ClipboardError className="w-12 h-12 text-default-400 mx-auto mb-3" />
                        <p className="text-default-500">
                            {user.role === "researcher"
                                ? "Please wait for the decision letter to be signed before uploading the payment receipt."
                                : "Decision letter must be signed before the researcher can upload the payment receipt."
                            }
                        </p>
                    </p>
                )}
            </CardBody>
            {(user.role === "staff" && hasPayment && status != null && status?.end == null && status?.status === "Awaiting Confirmation") && (
                <>
                    <Divider />
                    <CardFooter className="justify-end gap-4">
                        <Button color="primary" variant="shadow" onPress={() => handleConfirmPayment(true)} isLoading={loading}>
                            Confirm Payment
                        </Button>
                        <Button color="danger" variant="bordered" onPress={() => handleConfirmPayment(false)} isLoading={loading}>
                            Reject Payment
                        </Button>
                    </CardFooter>
                </>
            )}
            {(user.role === "researcher" && status != null && ['Rejected', 'In Progress'].includes(status?.status ?? '')) && (
                <>
                    <Divider />
                    <CardFooter className="justify-end">
                        <Button color="primary" variant="shadow" onPress={handleUploadPayment} isLoading={loading}>
                            Upload Payment
                        </Button>
                    </CardFooter>
                </>
            )}
        </Card>
    );
}

const InputPayment: React.FC<{
    file: File | null,
    details: string,
    isError: boolean,
    setDetails: (value: string) => void,
    handleSelectFile: (e: ChangeEvent<HTMLInputElement>) => void
}> = ({ file, details, isError, setDetails, handleSelectFile }) => {
    return (
        <>
            <InputFile
                label="Upload Payment Receipt"
                type="file"
                accept="image/*"
                file={file}
                handleSelectFile={handleSelectFile}
                isError={isError}
            />
            <h3 className="text-start my-4">
                Payment Details
                <span className="ml-2 text-default-900/50">
                    (optional)
                </span>
            </h3>
            <Textarea
                name="details"
                placeholder="Enter details of the payment."
                maxRows={2}
                value={details}
                onValueChange={setDetails}
            />
        </>
    )
}

export default PaymentMade;
