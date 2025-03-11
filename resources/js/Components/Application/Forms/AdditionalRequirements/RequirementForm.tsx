import React, { useState } from "react";
import { Alert, Button, CardBody, CardFooter, Divider, Input } from "@nextui-org/react";
import InputFile from "@/Components/InputFile";
import { LightUploadRounded } from "@/Components/Icons";
import { AlertType } from "@/Components/Application/Forms/AdditionalRequirements";

const RequirementForm = ({onUploadRequirement}: {onUploadRequirement: (name: string, file: File) => Promise<void>}) => {
    const [name, setName] = useState<string>('');
    const [file, setFile] = useState<File | null>(null);

    const [isError, setIsError] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [alert, setAlert] = useState<AlertType>({
        message: '',
        type: 'default'
    });

    const handleSelectFile = (e:  React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files;

        if (selectedFile != null && selectedFile.length > 0) {
            setFile(selectedFile[0]);
            setIsError(false);
        } else {
            setIsError(true);
        }
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!file) {
            setIsError(true);
            return;
        }

        setLoading(true);
        setIsError(false);

        onUploadRequirement(name, file).then(() => {
            setName('');
            setFile(null);
            setLoading(false);
            setAlert({
                message: "Requirements uploaded successfully",
                type: 'success'
            });
        });
    }

    return (
        <form onSubmit={handleSubmit}>
            <CardBody className="px-4 gap-4">
                <div className="flex flex-col gap-3 mb-4">
                    <h5 className="text-medium font-medium text-start">Requirement Name</h5>
                    <Input placeholder="Enter requirement name"
                           value={name}
                           onChange={(e) => setName(e.target.value)}
                           className="max-w-sm"
                           required
                    />
                </div>

                <div className="flex flex-col gap-3">
                    <h3 className="text-medium font-medium text-start">Upload Additional Requirement</h3>
                    <InputFile file={file}
                               isError={isError}
                               handleSelectFile={handleSelectFile}
                               type="file"
                               accept=".pdf,.doc,.docx"
                               className="flex-1 max-w-sm"
                               required
                               reverseButton
                    />
                </div>
            </CardBody>
            <Divider />
            <CardFooter className="flex-col items-end gap-3">
                {alert.message && <Alert variant="flat" color="success" title={alert.message}  />}
                <Button color="primary" variant="shadow" type="submit" isLoading={loading}>
                    <LightUploadRounded />
                    Upload Requirement
                </Button>
            </CardFooter>
        </form>
    );
}

export default RequirementForm;
