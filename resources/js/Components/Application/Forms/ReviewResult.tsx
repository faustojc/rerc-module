import { ApplicationFormProps, AppReviewResult } from "@/types";
import { Alert, Button, Card, CardFooter, Divider } from "@nextui-org/react";
import React, { useMemo, useState } from "react";
import NavStatus from "@/Components/NavStatus";
import Feedbacks from "@/Components/Application/Feedbacks";
import CreateReviewResult from "@/Components/Application/Forms/ReviewResult/CreateReviewResult";
import ManuscriptList from "@/Components/Application/Forms/ReviewResult/ManuscriptList";
import { AxiosError } from "axios";
import ReviewResultDetails from "@/Components/Application/Forms/ReviewResult/ReviewResultDetails";
import { toast } from "react-toastify";

const ReviewResult = ({user, application, status, handleUpdateApplication, handleMessage}: ApplicationFormProps) => {
    const [currTab, setCurrTab] = useState<string>('manuscripts');
    const [loading, setLoading] = useState<boolean>(false);
    const [hasApproved, setHasApproved] = useState<boolean>(status != null && status.end != null);

    const hasRevisions = useMemo(() => {
        return application.review_results.length > 0
               && application.documents.some(doc => doc.status === 'Revision');
    }, [application.review_results, application.documents]);

    const staffCanApprove = useMemo(() => {
        return user.role === 'staff'
               && !hasApproved
               && hasRevisions;
    }, [hasRevisions, hasApproved, user.role]);

    const alertMessage = useMemo(() => {
        if (user.role === 'staff') {
            return "Approving the revisions will mark the application as 'Approved' and will proceed to the next status. Please make sure that all revisions are reviewed and approved.";
        }

        return "Waiting for the staff to approve the revisions.";
    }, [user.role]);

    const handleSubmit = async (data: Partial<AppReviewResult>, file: File) => {
        const formData = new FormData();
        formData.append('name', data.name!);
        formData.append('file', file);

        if (data.feedback) {
            formData.append('feedback', data.feedback);
        }
        if (data.reviewed_document_ids) {
            formData.append('reviewed_document_ids', JSON.stringify(data.reviewed_document_ids));
        }

        try {
            const response = await window.axios.post(
                route('applications.review-results.store', {application: application}),
                formData,
                {headers: { 'Content-Type': 'multipart/form-data' }}
            );

            toast.success('Review result uploaded successfully.');

            handleUpdateApplication({
                application: {
                    review_results: [response.data.review_result],
                    documents: [
                        ...response.data.documents
                    ]
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

            setHasApproved(true);
        }).finally(() => setLoading(false));
    }

    return (
        <Card className="sticky self-start top-0">
            <NavStatus currTab={currTab} setCurrTab={setCurrTab} tabs={[
                {label: 'Manuscripts', name: 'manuscripts'},
                {label: 'Review Result', name: 'review-result'},
                {label: 'Upload Review', name: 'upload-review', notFor: () => user.role !== 'staff' || hasApproved || status == null},
                {label: 'Feedbacks', name: 'feedbacks', notFor: () => status == null},
            ]} />
            {currTab === 'manuscripts' && (
                <>
                    <ManuscriptList reviewResults={application.review_results} documents={application.documents} />
                    {hasRevisions && (
                        <>
                            <Divider />
                            <CardFooter className="flex-col items-end gap-3">
                                {(!hasApproved && !loading) && <Alert color="warning" description={alertMessage} /> }
                                {(hasApproved && !loading) && <Alert color="success" title="Revisions of Manuscripts has been approved" />}
                                {staffCanApprove && (
                                    <Button color="primary" variant="shadow" isLoading={loading} onPress={handleApproveRevisions}>
                                        Approve Revisions
                                    </Button>
                                )}
                            </CardFooter>
                        </>
                    )}
                </>
            )}
            {(currTab === 'review-result') && (
                <ReviewResultDetails user={user} isApproved={status.end != null} reviewResults={application.review_results} onUploadRevision={handleUploadRevision} />
            )}
            {(currTab === 'upload-review') && (
                <CreateReviewResult reviewResults={application.review_results} documents={application.documents} onSubmit={handleSubmit} />
            )}
            {currTab === 'feedbacks' && (
                <Feedbacks user={user} status={status} handleMessage={handleMessage} />
            )}
        </Card>
    );
}

export default ReviewResult;
