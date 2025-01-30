import { AppDocument, AppReviewResult } from "@/types";
import React, { useCallback } from "react";
import { CloudArrowDown } from "@/Components/Icons";
import { CardBody, CardHeader, Link, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { parseAbsolute } from "@internationalized/date";

interface ManuscriptListProps {
    reviewResults: AppReviewResult[];
    documents: AppDocument[];
}

const ManuscriptList: React.FC<ManuscriptListProps> = ({reviewResults, documents}) => {
    const formatDate = useCallback((dateString?: string) => {
        if (!dateString) return '';

        const date = parseAbsolute(dateString, 'UTC').toDate();
        return Intl.DateTimeFormat(undefined, {
            dateStyle: 'medium',
            timeStyle: 'short',
        }).format(date);
    }, []);

    return (
        <>
            <CardHeader className="flex-col items-start">
                <h3 className="text-xl font-semibold text-start">Manuscript Revisions</h3>
                <p className="text-sm">
                    List of all the manuscript revisions submitted by the researchers.
                </p>
            </CardHeader>
            <CardBody>
                {(reviewResults && reviewResults.length === 0) ? (
                    <p className="text-center text-default-500">No review results found.</p>
                ) : (
                    <div>
                        {/* Documents Table Section */}
                        <div className="mt-4">
                            <Table classNames={{base: "max-h-[320px] overflow-y-auto"}}
                                   removeWrapper
                            >
                                <TableHeader>
                                    <TableColumn>VERSION</TableColumn>
                                    <TableColumn>FILE</TableColumn>
                                    <TableColumn>DATE UPLOADED</TableColumn>
                                    <TableColumn>ACTION</TableColumn>
                                </TableHeader>
                                <TableBody items={documents}>
                                    {(doc) => (
                                        <TableRow key={doc.id}>
                                            <TableCell>V{doc.version}</TableCell>
                                            <TableCell>
                                                {doc.file_url.split('\\').pop()?.split('/').pop()}
                                            </TableCell>
                                            <TableCell>
                                                {formatDate(doc.created_at!)}
                                            </TableCell>
                                            <TableCell>
                                                <Link href={route('applications.documents.download', {document: doc})} isBlock>
                                                    <CloudArrowDown />
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                            {documents.length === 0 && (
                                <p className="text-center text-default-500">No documents </p>
                            )}
                        </div>
                    </div>
                )}
            </CardBody>
        </>
    );
};

export default ManuscriptList;
