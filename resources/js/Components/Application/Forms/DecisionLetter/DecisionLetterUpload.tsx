import React, { ChangeEvent, useState } from "react";
import { Button, Input } from "@nextui-org/react";
import { LightUploadRounded } from "@/Components/Icons";

interface DecisionLetterUploadProps {
    onUpload: (file: File) => Promise<void>;
    buttonText: string;
}

export const DecisionLetterUpload: React.FC<DecisionLetterUploadProps> = ({onUpload, buttonText}) => {
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];

        if (selectedFile) {
            const validTypes = ['.pdf', '.doc', '.docx'];
            const fileExtension = selectedFile.name.toLowerCase().slice(selectedFile.name.lastIndexOf('.'));

            if (!validTypes.includes(fileExtension)) {
                setError('Please select a PDF or Word document');
                return;
            }

            setFile(selectedFile);
            setError(null);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setError('Please select a file');
            return;
        }

        try {
            setIsUploading(true);
            await onUpload(file);
            setFile(null);
        } catch (error) {
            setError('Failed to upload file. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="p-4 bg-default-100 rounded-lg">
            <Input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                errorMessage={error}
                description="Accepted formats: PDF, DOC, DOCX"
                className="w-full"
                variant="bordered"
            />
            <div className="flex justify-end">
                <Button
                    color="primary"
                    startContent={<LightUploadRounded className="w-4 h-4" />}
                    isLoading={isUploading}
                    isDisabled={!file}
                    onPress={handleUpload}
                >
                    {buttonText}
                </Button>
            </div>
        </div>
    );
};
