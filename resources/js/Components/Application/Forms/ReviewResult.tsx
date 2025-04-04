import { ApplicationFormProps, AppReviewResult } from "@/types";
import { Alert, Button, Card, CardFooter, Divider, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react";
import React, { useMemo, useState } from "react";
import NavStatus from "@/Components/NavStatus";
import Feedbacks from "@/Components/Application/Feedbacks";
import CreateReviewResult from "@/Components/Application/Forms/ReviewResult/CreateReviewResult";
import ManuscriptList from "@/Components/Application/Forms/ReviewResult/ManuscriptList";
import { AxiosError } from "axios";
import ReviewResultDetails from "@/Components/Application/Forms/ReviewResult/ReviewResultDetails";
import { toast } from "react-toastify";
import ReviewReportsList from "@/Components/Application/Forms/ReviewResult/ReviewReportsList";

const ReviewResult = ({user, application, status, handleUpdateApplication, handleMessage}: ApplicationFormProps) => {
    const [currTab, setCurrTab] = useState<string>('manuscripts');
    const [loading, setLoading] = useState<boolean>(false);

    const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();

    const hasApproved = useMemo(() => status != null && status.end != null, [status]);

    const hasRevisions = useMemo(() => {
        return application.review_results
               && application.review_results.length > 0
               && application.documents.some(doc => doc.status === 'Revision');
    }, [application.review_results, application.documents]);

    const canApprove = useMemo(() => {
        return user.role === 'chairperson'
               && !hasApproved
               && hasRevisions;
    }, [hasRevisions, hasApproved, user.role]);

    const handleSubmit = async (data: Partial<AppReviewResult>, file: File) => {
        const formData = new FormData();
        formData.append('name', data.name!);
        formData.append('file', file);

        try {
            const response = await window.axios.post(
                route('applications.review-results.store', {application: application}),
                formData,
                {headers: { 'Content-Type': 'multipart/form-data' }}
            );

            toast.success('Review result uploaded successfully.');

            handleUpdateApplication({
                application: {
                    review_results: [response.data.review_result]
                }
            })
        } catch (error: any) {
            if (error instanceof AxiosError) {
                console.error(error.response?.data.message ?? error.message);

                if (error.response?.data.message) {
                    console.log(error.response?.data.message);
                }
            }
            else {
                console.error(error);
            }
        }
    }

    const handleUploadRevision = async (reviewResult: AppReviewResult, file: File) => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await window.axios.post(
                route('review-results.upload-revision', {review_result: reviewResult}),
                formData,
                {headers: { 'Content-Type': 'multipart/form-data' }}
            );

            toast.success('Revision uploaded successfully.');

            handleUpdateApplication({
                application: {
                    documents: [
                        { ...response.data.document },
                    ],
                }
            });
        } catch (error: any) {
            if (error instanceof AxiosError) {
                console.error(error.response?.data.message ?? error.message);

                if (error.response?.data.message) {
                    console.log(error.response?.data.message);
                }
            } else {
                console.error(error);
            }
        }
    }

    const handleApproveRevisions = () => {
        setLoading(true);

        window.axios.patch(route('applications.statuses.update', {application: application, status: status}), {
            new_status: 'Approved',
            is_completed: true,
            next_status: 'Additional Requirements',
            message: `Manuscript revisions has been approved by ${user.name}`
        }).then((response) => {
            handleUpdateApplication({
                application: {
                    statuses: [
                        { ...response.data.status },
                        { ...response.data.next_status },
                    ]
                }
            });
        }).finally(() => {
            setLoading(false);
            onClose();
        });
    }

    const handleUploadReport = async (file: File, message: string) => {
        const formData = new FormData();
        message = message || `${user.name} has uploaded a reviewer report file.`;

        formData.append('file', file);
        formData.append('message', message);

        try {
            const response = await window.axios.post(
                route('applications.upload-reviewer-report', {application: application}),
                formData,
                {headers: { 'Content-Type': 'multipart/form-data' }}
            );

            handleUpdateApplication({
                application: {
                    reviewer_reports: [ {...response.data.reviewer_report} ]
                }
            });
        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    return (
        <Card className="sticky self-start top-0">
            <>
                <NavStatus currTab={currTab} setCurrTab={setCurrTab} tabs={[
                    {label: 'Manuscripts', name: 'manuscripts'},
                    {label: 'Reviewer Reports', name: 'review-reports', notFor: () => status == null},
                    {label: 'Review Result', name: 'review-result'},
                    {label: 'Upload Review', name: 'upload-review', notFor: () => user.role !== 'staff' || hasApproved || status == null},
                    {label: 'Feedbacks', name: 'feedbacks', notFor: () => status == null},
                ]} />
                {currTab === 'manuscripts' && (
                    <>
                        <ManuscriptList
                            reviewResults={application.review_results}
                            documents={application.documents}
                            onUploadRevision={handleUploadRevision}
                            canUpload={user.role === 'researcher' && !hasApproved && status != null}
                        />
                        {hasRevisions && (
                            <>
                                <Divider />
                                <CardFooter className="flex-col items-end gap-3">
                                    {(!hasApproved && user.role !== 'chairperson' && !loading) && <Alert color="warning" description={"Waiting for the chairperson to approve the revisions."} /> }
                                    {(hasApproved && !loading) && <Alert color="success" title="Revisions of Manuscripts has been approved" />}
                                    {canApprove && (
                                        <Button color="primary" variant="shadow" onPress={onOpen}>
                                            Approve All Revisions
                                        </Button>
                                    )}
                                </CardFooter>
                            </>
                        )}
                    </>
                )}
                {(currTab === 'review-reports') && (
                    <ReviewReportsList reviewerReports={application.reviewer_reports} isStaff={user.role === 'staff'} onUpload={handleUploadReport}  />
                )}
                {(currTab === 'review-result') && (
                    <ReviewResultDetails reviewResults={application.review_results} />
                )}
                {(currTab === 'upload-review') && (
                    <CreateReviewResult onSubmit={handleSubmit} />
                )}
                {currTab === 'feedbacks' && (
                    <Feedbacks user={user} status={status} handleMessage={handleMessage} />
                )}

                {/* Confirm Assign Modal */}
                <Modal backdrop="blur" size="lg" isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={!loading}>
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1">Confirm Accomplish Revisions</ModalHeader>
                                <ModalBody>
                                    <p className="text-default-600">
                                        Are you sure you want to confirm that all revisions has been accomplished?
                                    </p>
                                    {(!hasApproved && !loading) && <Alert
                                         color="danger"
                                         variant="flat"
                                         description={<p>Approving the revisions will mark the application as <strong>Approved</strong> and will proceed to the next step.</p>}
                                    />}
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="danger" variant="light" onPress={onClose} isDisabled={loading}>
                                        Close
                                    </Button>
                                    <Button color="secondary" variant="shadow" isLoading={loading} onPress={handleApproveRevisions}>
                                        Confirm Accomplishments of Revisions
                                    </Button>
                                </ModalFooter>
                            </>
                        )}
                    </ModalContent>
                </Modal>
            </>
        </Card>
    );
}

export default ReviewResult;
