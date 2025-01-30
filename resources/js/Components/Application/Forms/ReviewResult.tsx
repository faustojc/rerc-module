import { ApplicationFormProps, AppReviewResult } from "@/types";
import { Card } from "@nextui-org/react";
import React, { useState } from "react";
import NavStatus from "@/Components/NavStatus";
import Feedbacks from "@/Components/Application/Feedbacks";
import CreateReviewResult from "@/Components/Application/Forms/ReviewResult/CreateReviewResult";
import ManuscriptList from "@/Components/Application/Forms/ReviewResult/ManuscriptList";
import { AxiosError } from "axios";
import ReviewResultDetails from "@/Components/Application/Forms/ReviewResult/ReviewResultDetails";
import { toast } from "react-toastify";

const ReviewResult = ({user, application, status, handleUpdateApplication, handleMessage}: ApplicationFormProps) => {
    const [currTab, setCurrTab] = useState<string>('manuscripts');

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
            })
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

    return (
        <Card className="sticky self-start top-0">
            <NavStatus currTab={currTab} setCurrTab={setCurrTab} tabs={[
                {label: 'Manuscripts', name: 'manuscripts'},
                {label: 'Review Result', name: 'review-result'},
                {label: 'Upload Review', name: 'upload-review', notFor: () => user.role !== 'staff'},
                {label: 'Feedbacks', name: 'feedbacks'},
            ]} />
            {currTab === 'manuscripts' && (
                <ManuscriptList reviewResults={application.review_results} documents={application.documents} />
            )}
            {(currTab === 'review-result') && (
                <ReviewResultDetails user={user} reviewResults={application.review_results} onUploadRevision={handleUploadRevision} />
            )}
            {currTab === 'upload-review' && (
                <CreateReviewResult reviewResults={application.review_results} documents={application.documents} onSubmit={handleSubmit} />
            )}
            {currTab === 'feedbacks' && (
                <Feedbacks user={user} status={status} handleMessage={handleMessage} />
            )}
        </Card>
    );
}

export default ReviewResult;
