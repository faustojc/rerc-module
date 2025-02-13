import { ApplicationFormProps } from "@/types";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import React, { useState } from "react";
import { toast } from "react-toastify";
import NavStatus from "@/Components/NavStatus";
import Feedbacks from "@/Components/Application/Feedbacks";
import { DecisionLetterDisplay } from "@/Components/Application/Forms/DecisionLetter/DecisionLetterDisplay";
import { DecisionLetterUpload } from "@/Components/Application/Forms/DecisionLetter/DecisionLetterUpload";
import { ClipboardError, FeDocument } from "@/Components/Icons";

const DecisionLetter = ({user, application, status, handleUpdateApplication, handleMessage}: ApplicationFormProps) => {
    const [currTab, setCurrTab] = useState<string>('decision-letter');

    const canUpload = user.role !== 'researcher' && (!application.decision_letter || !application.decision_letter.is_signed);

    const handleUpdateData = async (data: FormData) => {
        try {
            const response = await window.axios.post(route('applications.decision-letter.store', {application: application}), data, {
                headers: {'Content-Type': 'multipart/form-data'}
            });

            const statuses = [
                response.data.status,
            ]

            if (response.data.new_status) {
                statuses.push(response.data.new_status);
            }

            handleUpdateApplication({
                application: {
                    decision_letter: response.data.decision_letter,
                    statuses: statuses
                }
            });
        } catch (error: any) {
            toast.error(error.message ?? 'An error occurred. Please try again.');
            console.error(error);
        }
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
                    {user.role !== 'researcher'
                        ? "Upload the signed decision letter for this application."
                        : "View the decision letter for your application."
                    }
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
                                        Signed Decision Letter
                                    </h3>
                                    <DecisionLetterDisplay decisionLetter={application.decision_letter} />
                                </div>
                            )}

                            {(application.decision_letter == null && user.role === 'researcher') && (
                                <div className="mb-6">
                                    <h3 className="text-lg font-medium mb-3">
                                        Decision Letter
                                    </h3>
                                    <div className="bg-default-100 p-4 rounded-lg">
                                        <p className="flex flex-row gap-3 items-center text-default-600">
                                            <FeDocument />
                                            Waiting for the staff or chairperson to upload the signed decision letter.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Upload Signed Decision Letter */}
                            {canUpload && (
                                <div className="mb-6">
                                    <h3 className="text-lg font-medium mb-3">
                                        Upload the Signed Decision Letter
                                    </h3>
                                    <DecisionLetterUpload
                                        onUpload={handleUpdateSigned}
                                        buttonText="Upload Signed Letter"
                                    />
                                </div>
                            )}

                            <div className="mt-3 bg-default-100 p-4 rounded-lg">
                                <h3 className="font-medium mb-2">Notice:</h3>
                                <div className="space-y-2 text-sm text-default-600">
                                    {user.role !== 'researcher' ? (
                                        <>
                                            <p>• Review the decision letter carefully before uploading.</p>
                                            <p>• Upload the <strong>signed</strong> decision letter when ready.</p>
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
