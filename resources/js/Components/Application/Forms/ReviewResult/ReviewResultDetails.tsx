import { AppReviewResult } from "@/types";
import { Button, CardBody, CardHeader, Link, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import React, { useCallback } from "react";
import { CloudArrowDown } from "@/Components/Icons";

const ReviewResultDetails: React.FC<{reviewResults: AppReviewResult[]}> = ({reviewResults}) => {
    const formatDate = useCallback((dateString?: string) => {
        if (!dateString) return '';

        const date = new Date(dateString);
        return Intl.DateTimeFormat(undefined, {
            dateStyle: 'medium',
            timeStyle: 'short',
        }).format(date);
    }, []);

    return (
        <>
            <CardHeader className="flex-col items-start">
                <h3 className="text-xl font-semibold text-start">Review Result</h3>
                <p className="text-sm">
                    List of review results submitted by the staff.
                </p>
            </CardHeader>
            <CardBody>
                <Table classNames={{base: "max-h-[320px] overflow-y-auto"}} removeWrapper>
                    <TableHeader>
                        <TableColumn>#</TableColumn>
                        <TableColumn>NAME</TableColumn>
                        <TableColumn>DATE UPLOADED</TableColumn>
                        <TableColumn>ACTION</TableColumn>
                    </TableHeader>
                    <TableBody items={reviewResults ?? []} emptyContent={"No review results has been uploaded yet."}>
                        {(reviewResult) => {
                            return (
                                <TableRow key={reviewResult.id}>
                                    <TableCell>RR {reviewResult.version}</TableCell>
                                    <TableCell>{reviewResult.name}</TableCell>
                                    <TableCell>{formatDate(reviewResult.date_uploaded)}</TableCell>
                                    <TableCell>
                                        <Button isIconOnly
                                                color="primary"
                                                variant="light"
                                                as={Link}
                                                href={route('review-results.download', {review_result: reviewResult})}
                                                download
                                        >
                                            <CloudArrowDown />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            );
                        }}
                    </TableBody>
                </Table>
            </CardBody>
        </>
    );
}

export default ReviewResultDetails;
