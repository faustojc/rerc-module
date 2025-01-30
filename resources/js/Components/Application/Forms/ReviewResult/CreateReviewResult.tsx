import React, { useMemo, useState } from 'react';
import { AppDocument, AppReviewResult } from '@/types';
import {
    Alert,
    Button,
    CardBody,
    CardFooter,
    CardHeader,
    Divider,
    Input,
    Link,
    Selection,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    Textarea,
} from "@nextui-org/react";
import { CloudArrowDown } from "@/Components/Icons";
import InputFile from "@/Components/InputFile";

interface CreateReviewResultProps {
    documents: AppDocument[];
    reviewResults: AppReviewResult[];
    onSubmit: (data: Partial<AppReviewResult>, file: File) => Promise<void>;
}

const CreateReviewResult: React.FC<CreateReviewResultProps> = ({documents, reviewResults, onSubmit}) => {
    const [selectedDocuments, setSelectedDocuments] = useState<Selection>(new Set([]));
    const [name, setName] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [feedback, setFeedback] = useState('');
    const [isError, setIsError] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [displayAlert, setDisplayAlert] = useState<boolean>(false);

    const originalDocs = useMemo(() => {
        const documentIds = reviewResults.flatMap((result) => result.reviewed_document_ids);

        return documents.filter((doc) => !documentIds.includes(doc.id));
    }, [documents, reviewResults]);

    const bottomContent = useMemo(() => {
        return (
            <p className="w-[30%] text-small text-default-400">
                {selectedDocuments === "all"
                    ? "All items selected"
                    : `${selectedDocuments.size} of ${documents.length} selected`}
            </p>
        );
    }, [documents, selectedDocuments]);

    const handleSetFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files;

        if (selectedFile && selectedFile.length > 0) {
            setFile(selectedFile[0]);
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!file || !name) {
            setIsError(true);

            return;
        }

        setLoading(true);

        let document_ids: string[] = [];
        if (selectedDocuments == 'all') {
            document_ids = originalDocs.map((doc) => doc.id);
        }
        else if (selectedDocuments.size > 0) {
            document_ids = originalDocs.filter((doc) => selectedDocuments.has(doc.id)).map((doc) => doc.id);
        }

        await onSubmit({
            name: name,
            reviewed_document_ids: document_ids,
            feedback: feedback,
            status: 'Uploaded',
        }, file).finally(() => {
            setLoading(false);
            setFile(null);
            setName('');
            setFeedback('');
            setSelectedDocuments(new Set([]));

            const timeout = setTimeout(() => {
                setDisplayAlert(false);
                clearTimeout(timeout);
            }, 3000);
        });
    };

    return (
        <>
            <CardHeader className="flex-col items-start">
                <h3 className="text-xl font-semibold text-start">Review Result</h3>
                <p className="text-sm">
                    Select the researchers' documents and upload the review results document for revisions.
                </p>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardBody className="gap-6 sm:px-4">
                    <div className="flex flex-col gap-3">
                        <label htmlFor="name" className="block font-medium text-default-700">
                            Review Name
                        </label>
                        <Input value={name}
                               onChange={(e) => setName(e.target.value)}
                               id="name"
                               required
                        />
                    </div>

                    <InputFile label="Review Result File"
                               type="file"
                               accept=".pdf,.doc,.docx"
                               file={file}
                               isError={isError}
                               handleSelectFile={handleSetFile}
                               reverseButton
                    />

                    <div>
                        <label className="block font-medium text-default-700">
                            Feedback
                            <span className="italic text-sm text-default-400 ml-1">
                            (optional)
                        </span>
                        </label>
                        <Textarea value={feedback}
                                  onValueChange={setFeedback}
                                  minRows={1}
                        />
                    </div>

                    <div>
                        <p className="block font-medium text-default-700">
                            Select Documents for Review
                            <span className="italic text-sm text-default-400 ml-1">
                            (optional)
                        </span>
                        </p>
                        <div className="mt-2 space-y-2">
                            <Table aria-label="Document list"
                                   color="primary"
                                   selectionMode="single"
                                   selectedKeys={selectedDocuments}
                                   onSelectionChange={selected => setSelectedDocuments(selected)}
                                   bottomContent={originalDocs.length > 0 && bottomContent}
                                   classNames={{
                                       base: "max-h-[420px] overflow-y-auto",
                                   }}
                                   removeWrapper
                            >
                                <TableHeader>
                                    <TableColumn>FILE</TableColumn>
                                    <TableColumn>DATE UPLOADED</TableColumn>
                                    <TableColumn>ACTION</TableColumn>
                                </TableHeader>
                                <TableBody items={originalDocs}>
                                    {(doc) => (
                                        <TableRow key={doc.id}>
                                            <TableCell className="truncate">{doc.file_url.split('\\').pop()?.split('/').pop()}</TableCell>
                                            <TableCell>
                                                {new Date(doc.created_at!).toLocaleDateString('en-US', {
                                                    month: '2-digit', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                                })}
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
                            {originalDocs.length === 0 && (
                                <p className="text-center text-default-500">
                                    All documents have been assigned for revisions.
                                </p>
                            )}
                        </div>
                    </div>
                </CardBody>
                <Divider />
                <CardFooter className="flex-col gap-4">
                    {displayAlert && <Alert color="success" title="Uploaded Successfully" />}
                    <Button color="primary" type="submit" isLoading={loading} fullWidth>
                        Upload Review Result
                    </Button>
                </CardFooter>
            </form>
        </>
    );
};

export default CreateReviewResult;
