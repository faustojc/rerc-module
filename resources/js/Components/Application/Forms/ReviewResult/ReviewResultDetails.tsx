import { AppReviewResult, User } from "@/types";
import { Button, CardBody, CardHeader, Divider, Link } from "@nextui-org/react";
import React, { useCallback, useState } from "react";
import { FeDocument, LightUploadRounded } from "@/Components/Icons";

interface ReviewResultDetailsProps {
    user: User;
    reviewResults: AppReviewResult[];
    onUploadRevision: (reviewResult: AppReviewResult, file: File) => Promise<void>;
}

const ReviewResultDetails = ({user, reviewResults, onUploadRevision}: ReviewResultDetailsProps) => {
    const [selectedFiles, setSelectedFiles] = useState<Record<string, File | null>>({});
    const [uploadingStates, setUploadingStates] = useState<Record<string, boolean>>({});

    const formatDate = useCallback((dateString?: string) => {
        if (!dateString) return '';

        const date = new Date(dateString);
        return Intl.DateTimeFormat(undefined, {
            dateStyle: 'medium',
            timeStyle: 'short',
        }).format(date);
    }, []);

    const handleFileChange = (reviewResultId: string, file: File | null) => {
        setSelectedFiles(prev => ({
            ...prev,
            [reviewResultId]: file,
        }));
    };

    const handleUpload = async (reviewResult: AppReviewResult) => {
        const file = selectedFiles[reviewResult.id];

        if (!file) return;

        try {
            setUploadingStates(prev => ({ ...prev, [reviewResult.id]: true }));
            await onUploadRevision(reviewResult, file);

            setSelectedFiles(prev => ({ ...prev, [reviewResult.id]: null }));

            const fileInput = document.getElementById(`file-${reviewResult.id}`) as HTMLInputElement;
            if (fileInput) fileInput.value = '';
        } catch (error) {
            console.error('Upload failed:', error);
        } finally {
            setUploadingStates(prev => ({ ...prev, [reviewResult.id]: false }));
        }
    };

    return (
        <>
            <CardHeader className="flex-col items-start">
                <h3 className="text-xl font-semibold text-start">Review Result</h3>
                <p className="text-sm">
                    List of review results submitted by the staff.
                </p>
            </CardHeader>
            <CardBody>
                {(reviewResults && reviewResults.length === 0) ? (
                    <p className="text-center text-default-500">No review results found.</p>
                ) : (
                    <div>
                        {reviewResults.map((reviewResult) => (
                            <div key={reviewResult.id}>
                                <div className="mb-6 p-4 border-1 border-default-300 rounded-lg">
                                    <div className="mb-3">
                                        <h4 className="font-medium">
                                            {reviewResult.name}
                                        </h4>
                                        <p className="text-sm text-default-500">
                                            {formatDate(reviewResult.created_at!)}
                                        </p>
                                    </div>
                                    <div className="mb-3">
                                        <h4 className="font-medium">
                                            Feedback
                                        </h4>
                                        {reviewResult.feedback ? (
                                            <p className="text-sm text-default-500">
                                                {reviewResult.feedback}
                                            </p>
                                        ) : (
                                            <p className="text-sm italic text-default-500">
                                                No feedback provided.
                                            </p>
                                        )}
                                    </div>
                                    <div className={user.role === 'researcher' ? 'mb-3' : ''}>
                                        <p className="font-medium mb-1">
                                            Review Result file
                                        </p>
                                        <Link href={route('review-results.download', {review_result: reviewResult})}>
                                            <FeDocument className="mr-2"/>
                                            Download Review Result
                                        </Link>
                                    </div>

                                    {user.role === 'researcher' && (
                                        <>
                                            <Divider />
                                            <div className="flex items-center mt-3 p-2 gap-4">
                                                <div className="flex-1">
                                                    <input
                                                        id={`file-${reviewResult.id}`}
                                                        type="file"
                                                        onChange={(e) => handleFileChange(
                                                            reviewResult.id,
                                                            e.target.files?.[0] || null
                                                        )}
                                                        className="block w-full text-sm text-default-500 cursor-pointer file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-100 file:text-primary-700 hover:file:bg-primary-200"
                                                        accept=".pdf,.doc,.docx"
                                                    />
                                                </div>
                                                <Button
                                                    color="primary"
                                                    size="sm"
                                                    isLoading={uploadingStates[reviewResult.id]}
                                                    isDisabled={!selectedFiles[reviewResult.id]}
                                                    onPress={() => handleUpload(reviewResult)}
                                                >
                                                    <LightUploadRounded />
                                                    Upload Revision
                                                </Button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardBody>
        </>
    );
}

export default ReviewResultDetails;
