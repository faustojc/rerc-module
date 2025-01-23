import { ApplicationFormProps } from "@/types";
import { Button, Card, CardBody, CardFooter, CardHeader, Divider, Link, Textarea } from "@nextui-org/react";
import React, { ChangeEvent, useState } from "react";
import InputFile from "@/Components/InputFile";
import { toast } from "react-toastify";

const PaymentMade = ({user, application, status, setApplication, setStatuses}: ApplicationFormProps) => {
    const [file, setFile] = useState<File | null>(null);
    const [details, setDetails] = useState("");
    const [isError, setIsError] = useState(false);
    const [loading, setLoading] = useState(false);

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
            setApplication({
                ...application,
                proof_of_payment_url: response.data.proof_of_payment_url,
                payment_date: response.data.payment_date,
                payment_details: response.data.payment_details
            });
            setStatuses(response.data.statuses);
        }).catch(error => {
            toast.error("Failed to upload payment receipt. Please try again.");
            console.error(error);
        }).finally(() => setLoading(false));
    }

    const isDecisionLetterSigned = application.decision_letter != null && application.decision_letter.is_signed == 1;
    const hasPayment = application.proof_of_payment_url != null;

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
                            <div className="flex flex-col items-start p-3">
                                <h3 className="font-semibold text-start">Payment Receipt</h3>
                                <Link
                                    showAnchorIcon
                                    underline="hover"
                                    color="primary"
                                    href={route('applications.payment-download', {application: application})}
                                    className="text-ellipsis px-0 py-2"
                                >
                                    {application.proof_of_payment_url.split('\\').pop()?.split('/').pop()}
                                </Link>
                                <h3 className="font-semibold mt-4">
                                    Date Uploaded:
                                </h3>
                                <p>
                                    <>
                                        {Intl.DateTimeFormat('en-US', {
                                            year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric"
                                        }).format(new Date(application.payment_date))}
                                    </>
                                </p>
                                <h3 className="font-semibold mt-4 mb-2">Payment Details:</h3>
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
                        ) : (
                            <>
                                {user.role === "researcher" ? (
                                    <>
                                        <InputFile
                                            label="Upload Payment Receipt"
                                            type="file"
                                            acceptedTypes="image/*"
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
                                            value={details}
                                            onValueChange={setDetails}
                                        />
                                    </>
                                ) : (
                                    <p className="text-center text-medium p-5">
                                        Please wait for the researcher to upload their proof of payment receipt.
                                    </p>
                                )}
                            </>
                        )}
                    </>
                ) : (
                    <p className="text-center text-medium p-5">
                        {user.role === "researcher"
                            ? "Please wait for the decision letter to be signed before uploading the payment receipt."
                            : "Decision letter must be signed before the researcher can upload the payment receipt."
                        }
                    </p>
                )}
            </CardBody>
            {(user.role === "researcher" && !hasPayment) && (
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

export default PaymentMade;
