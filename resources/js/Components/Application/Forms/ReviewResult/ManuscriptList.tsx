import { AppDocument, AppReviewResult } from "@/types";
import React, { useCallback, useMemo, useState } from "react";
import { CloudArrowDown, LightUploadRounded } from "@/Components/Icons";
import { Button, CardBody, CardHeader, Link, Select, SelectItem, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { parseAbsolute } from "@internationalized/date";
import { toast } from "react-toastify";
import InputFile from "@/Components/InputFile";

interface ManuscriptListProps {
    reviewResults: AppReviewResult[];
    documents: AppDocument[];
    onUploadRevision: (reviewResult: AppReviewResult, file: File) => Promise<void>;
    canUpload: boolean;
}

const ManuscriptList: React.FC<ManuscriptListProps> = ({reviewResults, documents, onUploadRevision, canUpload}) => {
    const [file, setFile] = useState<File | null>(null);
    const [reviewResult, setReviewResult] = useState<AppReviewResult | null>(null);
    const [isError, setIsError] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const formatDate = useCallback((dateString?: string) => {
        if (!dateString) return '';

        const date = parseAbsolute(dateString, 'UTC').toDate();
        return Intl.DateTimeFormat(undefined, {
            dateStyle: 'medium',
            timeStyle: 'short',
        }).format(date);
    }, []);

    const sortedReviewResults = useMemo(() => {
        if (!reviewResults) return [];

        return reviewResults.sort((a, b) => b.version - a.version)
    },[reviewResults]);

    const handleSetFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
            setIsError(false);
        }
    }

    const handleUpload = async () => {
        if (!file || !reviewResult) {
            setIsError(true);
            return;
        }

        setLoading(true);

        try {
            await onUploadRevision(reviewResult, file);
            setFile(null);
        } catch (error) {
            toast.error('There was an error uploading the file. Please try again.');
            console.error('Upload failed:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <CardHeader className="flex-col items-start">
                <h3 className="text-xl font-semibold text-start">Manuscript Revisions</h3>
                <p className="text-sm">
                    List of all the manuscript revisions submitted by the researchers.
                </p>
            </CardHeader>
            <CardBody>
                {canUpload && (
                    <div className="mb-5 p-4 bg-default-50 rounded-lg border-1 border-primary-500">
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold">Upload Revision</h3>
                            <p className="text-sm">
                                Download the latest review result document to make changes and upload a new revision based on it.
                            </p>
                        </div>
                        <div className="flex flex-col gap-7">
                            <div className="flex flex-col sm:flex-row sm:gap-7 gap-5 justify-between">
                                <Select items={sortedReviewResults}
                                        className="sm:max-w-[250px]"
                                        placeholder="Select Review Result"
                                        aria-labelledby="Select Review Result"
                                        color="primary"
                                        variant="bordered"
                                        value={reviewResult?.id}
                                        onSelectionChange={(id) => setReviewResult(sortedReviewResults.find(rr => rr.id === id.currentKey) ?? null)}
                                        onClick={(e) => e.preventDefault()}
                                >
                                    {(rr) => (
                                        <SelectItem aria-labelledby="Select Review Result" key={rr.id} value={rr.id}>
                                            {`RR ${rr.version}`}
                                        </SelectItem>
                                    )}
                                </Select>
                                <InputFile file={file}
                                           handleSelectFile={handleSetFile}
                                           type="file"
                                           accept=".pdf,.doc,.docx"
                                           className="flex-grow"
                                />
                            </div>
                            <Button color="success"
                                    variant="flat"
                                    className="self-end"
                                    size="lg"
                                    startContent={<LightUploadRounded />}
                                    isLoading={loading}
                                    onPress={handleUpload}
                                    fullWidth
                            >
                                Upload Revision
                            </Button>
                        </div>
                        {isError && (
                            <p className="text-danger-500 text-sm mt-2">
                                Please select a review result and a file to upload.
                            </p>
                        )}
                    </div>
                )}
                <Table classNames={{base: "max-h-[320px] overflow-y-auto"}}
                       removeWrapper
                >
                    <TableHeader>
                        <TableColumn>VERSION</TableColumn>
                        <TableColumn>FILE</TableColumn>
                        <TableColumn>REVISION FOR</TableColumn>
                        <TableColumn>DATE UPLOADED</TableColumn>
                        <TableColumn>ACTION</TableColumn>
                    </TableHeader>
                    <TableBody items={documents} emptyContent={"No documents has been uploaded yet."}>
                        {(doc) => {
                            const rr = reviewResults?.find(rr => rr.id === doc.review_result_id);

                            return (
                                <TableRow key={doc.id}>
                                    <TableCell>V{doc.version}</TableCell>
                                    <TableCell className="text-wrap">
                                        {doc.file_url.split('\\').pop()?.split('/').pop()}
                                    </TableCell>
                                    <TableCell>
                                        {rr ? `RR ${rr.version}` : 'N/A'}
                                    </TableCell>
                                    <TableCell  className="text-wrap">
                                        {formatDate(doc.created_at!)}
                                    </TableCell>
                                    <TableCell>
                                        <Link href={route('applications.documents.download', {document: doc})} isBlock>
                                            <CloudArrowDown />
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            );
                        }}
                    </TableBody>
                </Table>
            </CardBody>
        </>
    );
};

export default ManuscriptList;
