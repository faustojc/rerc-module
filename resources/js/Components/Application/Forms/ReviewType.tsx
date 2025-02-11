import { ApplicationFormProps, ReviewTypeInfo } from "@/types";
import { Button, Card, CardBody, CardHeader, Chip, Divider, Tooltip } from "@nextui-org/react";
import React, { useState } from "react";
import { REVIEW_TYPES } from "@/types/constants";

interface ReviewTypeCardProps {
    info: ReviewTypeInfo;
    isSelected: boolean;
    isPressable: boolean;
    onSelect: (value: string) => void;
    isDisabled?: boolean;
}

const ReviewType = ({user, application, status, handleUpdateApplication}: ApplicationFormProps) => {
    const [reviewType, setReviewType] = useState<string>(application.review_type || '');
    const [loading, setLoading] = useState<boolean>(false);

    const canAssign = ['staff', 'chairperson'].includes(user.role);

    const getReviewTypeInfo = (value: string): ReviewTypeInfo =>
        REVIEW_TYPES.find(type => type.value === value) || REVIEW_TYPES[0];

    const handleUpdateReview = () => {
        setLoading(true);

        window.axios.patch(route('applications.update', {application: application}), {
            review_type: reviewType,
            new_status: 'Done',
            status_id: status.id,
            is_completed: true,
            next_status: 'Decision Letter',
            message: `${application.research_title} has been assigned a review type ${reviewType}`
        }).then(response => {
            handleUpdateApplication({
                application: {
                    review_type: response.data.application.review_type,
                    statuses: response.data.application.statuses
                }
            });
        }).finally(() => setLoading(false));
    }

    return (
        <Card className="sticky self-start top-0">
            <CardHeader className="flex-col items-start">
                <div className="flex items-center justify-between w-full">
                    <h2 className="text-xl font-bold">Review Type Assignment</h2>
                    {application.review_type && (
                        <Chip color="primary" variant="flat">
                            {getReviewTypeInfo(application.review_type).label}
                        </Chip>
                    )}
                </div>
                <p className="text-sm">
                    Type of review based on vulnerability of the participants and level of risks.
                </p>
            </CardHeader>
            <Divider />
            <CardBody>
                <div className="grid md:grid-cols-3 gap-4 mb-3">
                    {REVIEW_TYPES.map((type) => (
                        <ReviewTypeCard
                            key={type.value}
                            info={type}
                            isSelected={reviewType == type.value}
                            onSelect={(value) => setReviewType(value.toLowerCase())}
                            isPressable={canAssign && application.review_type == null}
                            isDisabled={application.review_type != null && application.review_type != type.value}
                        />
                    ))}
                </div>

                {reviewType && (
                    <ReviewTypeDetails info={getReviewTypeInfo(reviewType)} />
                )}

                {canAssign && !application.review_type && (
                    <div className="flex justify-end mt-4">
                        <Button
                            color="primary"
                            isLoading={loading}
                            isDisabled={!reviewType || reviewType.length === 0 || status == null}
                            onPress={handleUpdateReview}
                        >
                            Assign Review Type
                        </Button>
                    </div>
                )}

                <div className="mt-4 bg-default-100 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">About Review Types</h3>
                    <div className="space-y-2 text-sm text-default-600">
                        <p>
                            • The review type determines the evaluation process and timeline
                            for your research application.
                        </p>
                        <p>
                            • Selection is based on research complexity, risk level, and
                            participant involvement.
                        </p>
                        <p>
                            • Processing times are estimates and may vary based on
                            application completeness and complexity.
                        </p>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
}

const ReviewTypeCard: React.FC<ReviewTypeCardProps> = ({
    info,
    isSelected,
    isPressable,
    onSelect,
    isDisabled = false,
}) => (
    <Card
        className={`w-full transition-all
        ${isSelected
            ? 'border-2 border-primary-500 bg-primary-50'
            : 'border border-default-200'}
        ${!isPressable ? 'cursor-default' : 'cursor-pointer'}
        ${(isSelected && !isDisabled && !info) && 'hover:border-primary-200'}
        `}
        isPressable={isPressable}
        isDisabled={isDisabled}
        onPress={() => !isDisabled && onSelect(info.value)}
    >
        <CardBody className="p-4">
            <div className="flex items-start gap-4">
                <div className={`p-2 rounded-lg ${
                    isSelected ? 'bg-primary-100' : 'bg-default-100'
                }`}>
                    {info.icon}
                </div>
                <div className="flex-1">
                    <h3 className="text-lg font-semibold">{info.label}</h3>
                    <p className="text-sm text-default-600 mt-1">
                        {info.description}
                    </p>
                    <div className="mt-2">
                        <Tooltip content="Estimated processing time">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-default-100 text-default-800">
                                {info.processingTime}
                            </span>
                        </Tooltip>
                    </div>
                </div>
            </div>
        </CardBody>
    </Card>
);

export const ReviewTypeDetails: React.FC<{info: ReviewTypeInfo}> = ({ info }) => (
    <Card className="w-full bg-default-100">
        <CardBody className="p-4">
            <h4 className="font-medium mb-3">Criteria for {info.label}</h4>
            <ul className="space-y-2">
                {info.criteria.map((criterion, index) => (
                    <li key={index} className="flex items-start">
                        <span className="inline-block w-2 h-2 rounded-full bg-primary-500 mt-2 mr-2" />
                        <span className="text-sm text-default-600">{criterion}</span>
                    </li>
                ))}
            </ul>
        </CardBody>
    </Card>
);

export default ReviewType;
