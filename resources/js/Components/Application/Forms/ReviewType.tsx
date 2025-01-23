import { ApplicationFormProps } from "@/types";
import { Button, Card, CardBody, CardFooter, CardHeader, Divider, Select, SelectItem } from "@nextui-org/react";
import { ChangeEvent, useState } from "react";

const ReviewType = ({user, application, status, setApplication, setStatuses}: ApplicationFormProps) => {
    const [reviewType, setReviewType] = useState<string>(application.review_type ?? 'NOT SET');
    const [loading, setLoading] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);

    const handleSelectionChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setReviewType(e.target.value);

        if (reviewType.length > 0) {
            setIsError(false);
        }
        else {
            setIsError(true);
        }
    }

    const handleUpdateReview = () => {
        if (reviewType === 'NOT SET') {
            setIsError(true);
            return;
        }

        setLoading(true);

        window.axios.patch(route('applications.update', {application: application}), {
            review_type: reviewType,
            new_status: 'Done',
            status_id: status.id,
            is_completed: true,
            next_status: 'Decision Letter',
            message: `${application.research_title} has been assigned a review type ${reviewType}`
        }).then(response => {
            setApplication((prev) => ({
                ...prev,
                review_type: reviewType
            }));
            setStatuses(response.data.application.statuses);
        }).finally(() => setLoading(false));
    }

    return (
        <Card className="sticky self-start top-0">
            <CardHeader className="flex-col items-start bg-success-300">
                <h3 className="text-xl font-semibold text-start">Review Type</h3>
                <p className="text-sm">
                    Type of review based on vulnerability of the participants and level of risks.
                </p>
            </CardHeader>
            <CardBody>
                <div className="grid grid-cols-3 items-center w-full">
                    <h3>Review Type:</h3>
                    {(user.role !== 'researcher') ? (
                        <>
                            {(status && !status?.end) ? (
                                <Select
                                    className="col-span-2 max-w-xs"
                                    placeholder="Select review type"
                                    selectedKeys={[reviewType]}
                                    variant="bordered"
                                    onChange={handleSelectionChange}
                                    isInvalid={isError}
                                    isRequired
                                >
                                    <SelectItem key="exempted">EXEMPTED</SelectItem>
                                    <SelectItem key="expedited">EXPEDITED</SelectItem>
                                    <SelectItem key="full board">FULL BOARD</SelectItem>
                                </Select>
                            ) : (
                                <p className="font-bold">
                                    {application.review_type?.toUpperCase() ?? 'NOT SET'}
                                </p>
                            )}
                        </>
                    ) : (
                        <p className="font-bold">
                            {application.review_type?.toUpperCase() ?? 'NOT SET'}
                        </p>
                    )}
                </div>
            </CardBody>
            {(user.role !== 'researcher' && status && !status?.end) && (
                <>
                    <Divider />
                    <CardFooter className="justify-end">
                        <Button color="secondary"
                                variant="shadow"
                                isLoading={loading}
                                onPress={() => handleUpdateReview()}
                        >
                            Update Review
                        </Button>
                    </CardFooter>
                </>
            )}
        </Card>
    );
}

export default ReviewType;
