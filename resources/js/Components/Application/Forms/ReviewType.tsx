import { ApplicationFormProps, ReviewTypeInfo } from "@/types";
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Chip,
    Divider,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Tooltip,
    useDisclosure,
} from "@nextui-org/react";
import React, { useState } from "react";
import { REVIEW_TYPES } from "@/types/constants";
import NavStatus from "@/Components/NavStatus";
import { UserAlt } from "@/Components/Icons";
import { toast } from "react-toastify";
import { TimelineLog, TimelineLogMessage } from "@/Components/TimelineLog";

interface ReviewTypeCardProps {
    info: ReviewTypeInfo;
    isSelected: boolean;
    isCurrent: boolean;
    isPressable: boolean;
    onSelect: (value: string) => void;
    isDisabled?: boolean;
}

const ReviewType = ({user, application, status, handleUpdateApplication}: ApplicationFormProps) => {
    const [currTab, setCurrTab] = useState<string>('review-type');

    const [reviewType, setReviewType] = useState<string>(application.review_type || '');
    const [assignedBy, setAssignedBy] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();

    const canAssign = ['staff', 'chairperson'].includes(user.role);

    const getReviewTypeInfo = (value: string): ReviewTypeInfo =>
        REVIEW_TYPES.find(type => type.value === value) || REVIEW_TYPES[0];

    const handleUpdateReview = () => {
        setLoading(true);

        window.axios.post(route('applications.set-review-type', {application: application}), {
            review_type: reviewType,
            assigned_by: assignedBy,
            status_id: status.id,
            can_proceed: application.review_type == null,
        }).then(response => {
            handleUpdateApplication({
                application: {
                    review_type: response.data.application.review_type,
                    review_type_logs: response.data.application.review_type_logs,
                    statuses: response.data.application.statuses
                }
            });

            toast.success("Review type successfully assigned.");
        }).catch((error) => {
            console.error(error.message ?? "Unexpected error.");
            toast.error("Ops! Something went wrong. Please try again.");
        }).finally(() => {
            setLoading(false);
            onClose();
        });
    }

    return (
        <>
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
                <NavStatus currTab={currTab} setCurrTab={setCurrTab} tabs={[
                    {name: 'review-type', label: 'Review Type'},
                    {name: 'log', label: 'Assign Logs'}
                ]} />
                {currTab === 'log' && (
                    <CardBody className="px-5 max-h-[1093px] overflow-y-auto">
                        {application.review_type_logs.length > 0 && (
                            <TimelineLog items={application.review_type_logs}>
                                {(log) => (
                                    <TimelineLogMessage>
                                        {log.assigned_by} has assigned a review type to
                                        <span className="ml-1 font-bold">
                                            {log.review_type.toUpperCase()}
                                        </span>
                                    </TimelineLogMessage>
                                )}
                            </TimelineLog>
                        )}
                    </CardBody>
                )}
                {currTab === 'review-type' && (
                    <CardBody>
                        <div className="grid md:grid-cols-3 gap-4 mb-3">
                            {REVIEW_TYPES.map((type) => (
                                <ReviewTypeCard
                                    key={type.value}
                                    info={type}
                                    isCurrent={application.review_type != null && application.review_type == type.value}
                                    isSelected={reviewType == type.value}
                                    onSelect={(value) => setReviewType(value.toLowerCase())}
                                    isPressable={canAssign}
                                    isDisabled={!canAssign && (application.review_type != null && application.review_type !== type.value)}
                                />
                            ))}
                        </div>

                        {reviewType && <ReviewTypeDetails info={getReviewTypeInfo(reviewType)} />}

                        {canAssign && (
                            <div className="flex flex-wrap items-start justify-between gap-5 mt-4">
                                <Input
                                    description="Enter the name of the person who assigned the review type."
                                    placeholder="Assigned by"
                                    color={reviewType.length === 0 || status == null ? 'default' : 'secondary'}
                                    className="max-w-xs"
                                    isDisabled={!reviewType || reviewType.length === 0 || status == null}
                                    startContent={<UserAlt />}
                                    value={assignedBy}
                                    onValueChange={setAssignedBy}
                                    errorMessage="Please enter the name of the person who assigned the review type."
                                />
                                <Button
                                    color="primary"
                                    isDisabled={!reviewType
                                                || reviewType.length === 0
                                                || (reviewType && application.review_type && reviewType.length > 0 && reviewType == application.review_type)
                                                || assignedBy.length === 0
                                                || status == null
                                                || loading}
                                    onPress={onOpen}
                                >
                                    {application.review_type ? 'Update Review Type' : 'Assign Review Type'}
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
                )}
            </Card>

            {/* Confirm Assign Modal */}
            <Modal backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={!loading}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Confirm Assign Review Type</ModalHeader>
                            <ModalBody>
                                <p className="text-default-600">
                                    Are you sure you want to assign the review type of
                                    <strong className="ml-1">{getReviewTypeInfo(reviewType).label}</strong> to this application?
                                </p>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose} isDisabled={loading}>
                                    Close
                                </Button>
                                <Button color="secondary" variant="shadow" isLoading={loading} onPress={handleUpdateReview}>
                                    Confirm Assign
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}

const ReviewTypeCard: React.FC<ReviewTypeCardProps> = ({
    info,
    isSelected,
    isCurrent,
    isPressable,
    onSelect,
    isDisabled = false,
}) => (
    <Card
        className={`w-full transition-all
        ${isSelected
            ? 'border-2 border-primary-500'
            : 'border border-default-200'}
        ${isCurrent ? 'bg-primary-50' : 'bg-default-50'}
        ${!isPressable ? 'cursor-default' : 'cursor-pointer hover:border-primary-500'}
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
    <Card className="w-full">
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
