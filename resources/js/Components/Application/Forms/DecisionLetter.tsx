import { ApplicationFormProps } from "@/types";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import React, { useState } from "react";
import { toast } from "react-toastify";
import NavStatus from "@/Components/NavStatus";
import Feedbacks from "@/Components/Application/Feedbacks";
import { DecisionLetterDisplay } from "@/Components/Application/Forms/DecisionLetter/DecisionLetterDisplay";
import { DecisionLetterUpload } from "@/Components/Application/Forms/DecisionLetter/DecisionLetterUpload";
import { ClipboardError } from "@/Components/Icons";

const DecisionLetter = ({user, application, status, handleUpdateApplication, handleMessage}: ApplicationFormProps) => {
    const [currTab, setCurrTab] = useState<string>('decision-letter');

    const canUpload = user.role === 'staff' && (!application.decision_letter || !application.decision_letter.is_signed);
    const canUploadSigned = user.role === 'chairperson' && application.decision_letter != null  && application.decision_letter.is_signed;
    const canDelete = user.role === 'staff' && application.decision_letter != null && !application.decision_letter.is_signed;

    const handleUpdateData = async (data: FormData) => {
        try {
            const response = await window.axios.post(route('applications.decision-letter.store', {application: application}), data, {
                headers: {'Content-Type': 'multipart/form-data'}
            });

            handleUpdateApplication({
                application: {
                    decision_letter: response.data.decision_letter,
                    statuses: [
                        { ...response.data.status },
                        { ...response.data.next_status }
                    ]
                }
            });
        } catch (error: any) {
            toast.error(error.message ?? 'An error occurred. Please try again.');
            console.error(error);
        }
    }

    const handleDelete = async () => {
        if (!application.decision_letter) {
            return;
        }

        try {
            await window.axios.delete(route('applications.decision-letter.destroy', {
                application: application,
                decision_letter: application.decision_letter,
                status_id: status.id
            }));

            const updatedStatus = {
                ...status,
                status: "Removed"
            }

            handleUpdateApplication({
                application: {
                    decision_letter: null,
                    statuses: [
                        { ...updatedStatus },
                        { ...status.next_status }
                    ]
                }
            });
        } catch (e: any) {
            toast.error(e.message ?? 'An error occurred. Please try again.');
            console.error(e);
        }
    }

    const handleUpload = async (file: File) => {
        const formData = new FormData();

        formData.append('file', file!);
        formData.append('status_id', status.id);
        formData.append('message', `${application.research_title}'s decision letter has been uploaded`);
        formData.append('new_status', 'Uploaded');

        await handleUpdateData(formData);
    }

    const handleUpdateSigned = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file!);
        formData.append('status_id', status.id);
        formData.append('is_signed', 'true');
        formData.append('message', `${application.research_title}'s decision letter has been signed`);

        await handleUpdateData(formData);
    }

    return (
        <Card className="sticky self-start top-0">
            <CardHeader className="flex-col items-start bg-success-300">
                <h3 className="text-xl font-bold">Decision Letter</h3>
                <p className="text-sm mt-2">
                    {user.role === 'staff'
                        ? "Upload and manage the decision letter for this application."
                        : user.role === 'chairperson'
                            ? "Review and sign the decision letter."
                            : "View the decision letter for your application."}
                </p>
            </CardHeader>
            {status == null ? (
                <div className="text-center py-8">
                    <ClipboardError className="w-12 h-12 text-default-400 mx-auto mb-3" />
                    <p className="text-default-500">
                        Review type must be assigned before moving to this section.
                    </p>
                </div>
            ) : (
                <>
                    <NavStatus currTab={currTab} setCurrTab={setCurrTab} tabs={[
                        {label: "Decision Letter", name: "decision-letter"},
                        {label: "Feedbacks", name: "feedbacks", notFor: () => status == null},
                    ]} />
                    {currTab === 'decision-letter' ? (
                        <CardBody className="p-4">
                            {application.decision_letter && (
                                <div className="mb-6">
                                    <h3 className="text-lg font-medium mb-3">
                                        Current Decision Letter
                                    </h3>
                                    <DecisionLetterDisplay
                                        decisionLetter={application.decision_letter}
                                        onDelete={handleDelete}
                                        canDelete={canDelete}
                                    />
                                </div>
                            )}

                            {/* Upload Section for Staff */}
                            {canUpload && !canDelete && (
                                <div className="mb-6">
                                    <h3 className="text-lg font-medium mb-3">
                                        Upload Decision Letter
                                    </h3>
                                    <DecisionLetterUpload
                                        onUpload={handleUpload}
                                        buttonText="Upload Decision Letter"
                                    />
                                </div>
                            )}

                            {/* Upload Signed Version for Chairperson */}
                            {canUploadSigned && (
                                <div className="mb-6">
                                    <h3 className="text-lg font-medium mb-3">
                                        Upload Signed Version
                                    </h3>
                                    <DecisionLetterUpload
                                        onUpload={handleUpdateSigned}
                                        buttonText="Upload Signed Version"
                                    />
                                </div>
                            )}

                            <div className="mt-3 bg-default-100 p-4 rounded-lg">
                                <h3 className="font-medium mb-2">Notice:</h3>
                                <div className="space-y-2 text-sm text-default-600">
                                    {user.role === 'staff' ? (
                                        <>
                                            <p>• Upload the initial decision letter for review.</p>
                                            <p>• You can delete and re-upload until it's signed.</p>
                                            <p>• Once signed by the Chairperson, it cannot be modified.</p>
                                        </>
                                    ) : user.role === 'chairperson' ? (
                                        <>
                                            <p>• Review the decision letter carefully before signing.</p>
                                            <p>• Upload the signed version when ready.</p>
                                            <p>• Signed letters are final and cannot be modified.</p>
                                        </>
                                    ) : (
                                        <>
                                            <p>• The decision letter contains the final decision on your application.</p>
                                            <p>• You will be notified when the signed version is available.</p>
                                            <p>• Keep this document for your records.</p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </CardBody>
                    ) : (
                        <Feedbacks user={user} status={status} handleMessage={handleMessage} />
                    )}
                </>
            )}
        </Card>
    );
}

export default DecisionLetter;
