import React, { useState } from 'react';
import { AppReviewResult } from '@/types';
import { Alert, Button, CardBody, CardFooter, CardHeader, Divider, Input } from "@nextui-org/react";
import InputFile from "@/Components/InputFile";

interface CreateReviewResultProps {
    onSubmit: (data: Partial<AppReviewResult>, file: File) => Promise<void>;
}

const CreateReviewResult: React.FC<CreateReviewResultProps> = ({onSubmit}) => {
    const [name, setName] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [isError, setIsError] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [displayAlert, setDisplayAlert] = useState<boolean>(false);

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

        await onSubmit({
            name: name,
            status: 'Uploaded',
        }, file).finally(() => {
            setLoading(false);
            setFile(null);
            setName('');

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
                    Upload the review results document for revisions.
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
