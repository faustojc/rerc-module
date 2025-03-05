import React, { useRef } from "react";
import { ReviewerReport } from "@/types";
import { Alert, Avatar, Button, CardBody, CardFooter, CardHeader, Divider, Input, Tooltip } from "@nextui-org/react";
import { CloudArrowDown, FeDocument, MdiFileDocumentArrowRight, SendFill } from "@/Components/Icons";
import { toast } from "react-toastify";
import DateReadable from "@/Components/DateReadable";

interface ReviewReportsListProps {
    reviewerReports: ReviewerReport[];
    isStaff: boolean;
    onUpload: (file: File, message: string) => Promise<void>;
}

const ReviewReportsList: React.FC<ReviewReportsListProps> = ({reviewerReports, isStaff, onUpload}) => {
    const [file, setFile] = React.useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [message, setMessage] = React.useState<string>('');
    const [loading, setLoading] = React.useState<boolean>(false);

    const [error, setError] = React.useState<string | null>(null);

    const handleFileUpload = (e:  React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];

        if (selectedFile && (selectedFile.size > 10 * 1024 * 1024)) {
            setError('File is too large. Maximum size is 10MB.');
            e.target.value = '';
        } else {
            setFile(selectedFile!);
            setError(null);
        }
    }

    const handleUpload = async () => {
        if (!file) {
            setError('Please select a file');
            return;
        }

        try {
            setLoading(true);
            await onUpload(file, message);

            setFile(null);
            setMessage('');
            fileInputRef.current!.value = '';
        } catch (error) {
            toast.error('Oops, something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    const sizeDisplay = (size: number) => {
        if (size > 1024 * 1024) {
            return `${(size / (1024 * 1024)).toFixed(2)} MB`;
        }

        return `${(size / 1024).toFixed(2)} KB`;
    }

    return (
        <>
            <CardHeader className="flex-col items-start shadow-sm">
                <h3 className="text-xl font-semibold text-start">Reviewer Reports</h3>
                <p className="text-sm">
                  List of review reports logged by the staff.
                </p>
            </CardHeader>
            <CardBody className="px-5 max-h-[1093px] overflow-y-auto">
                {(reviewerReports && reviewerReports.length > 0) ? (
                    <ol className="relative border-s border-default-200 dark:border-default-700">
                        {reviewerReports.map((report) => {
                            const dateFormat = new Date(report.created_at!).toLocaleString('en-US', {
                                    month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'
                                });

                            return (
                                <li key={report.id} className="mb-10 ms-6">
                                    <span className="absolute flex items-center justify-center w-6 h-6 rounded-full -start-3">
                                        <Avatar className="w-6 h-6" />
                                    </span>
                                    <div className="flex flex-col gap-3 p-4 border border-default-200 rounded-lg shadow-xs">
                                        <div className="items-start justify-between sm:flex gap-7">
                                            <DateReadable date={new Date(report.created_at!)} className="mb-1 text-xs font-normal text-default-400 sm:order-last sm:mb-0" />
                                            <div className="text-sm font-normal text-default-500">
                                                {report.message} 
                                            </div>
                                        </div>
                                        <time className="text-xs font-normal text-default-500">
                                            {`Uploaded on ${dateFormat}`}
                                        </time>
                                        <div>
                                            <Button startContent={<CloudArrowDown />} color="primary" variant="flat" size="sm">
                                                Download File
                                            </Button>
                                        </div>
                                    </div>
                                </li>
                            )
                        })}
                    </ol>
                ) : (
                    <Alert color="default" variant="flat" description="The Staff has not uploaded any review reports yet." />
                )}
            </CardBody>
            {isStaff && (
                <>
                    <Divider />
                    <CardFooter className="flex-col items-start gap-3">
                        {file && (
                            <div className="flex flex-row items-center gap-2 max-w-xs bg-default-100 rounded-lg p-2">
                                <FeDocument width={30} />
                                <div>
                                    <p className="line-clamp-1">{file.name}</p>
                                    <p className="text-sm text-default-500">
                                        {sizeDisplay(file.size)}
                                    </p>
                                </div>
                            </div>
                        )}
                        <div className="flex flex-row items-center gap-3 w-full">
                            <Tooltip content="Attach a file up to 10MB">
                                <label className="block">
                                    <div className="flex flex-row gap-2 cursor-pointer py-1.5 px-4 rounded-lg font-semibold text-primary-700 bg-default-200 hover:border-primary-100 hover:bg-primary-100 transition">
                                        <MdiFileDocumentArrowRight />
                                    </div>
                                    <input
                                        type="file"
                                        className="hidden"
                                        ref={fileInputRef}
                                        onChange={handleFileUpload}
                                    />
                                </label>
                            </Tooltip>
                            <Input placeholder="Type a message or upload a file only"
                                   aria-labelledby="Report Message"
                                   endContent={(
                                       <Button onPress={handleUpload}
                                               variant="light"
                                               color="primary"
                                               isLoading={loading}
                                               isIconOnly
                                       >
                                           <SendFill />
                                       </Button>
                                   )}
                                   className="disabled:pointer-events-auto"
                                   variant="flat"
                                   value={message}
                                   isDisabled={loading}
                                   onChange={(e) => setMessage(e.target.value)}
                                   onKeyDown={(e) =>
                                        e.key === 'Enter' && handleUpload()
                                   }
                            />
                        </div>
                        {error && <p className="text-sm text-danger-500">{error}</p>}
                    </CardFooter>
                </>
            )}
        </>
    );
}

export default ReviewReportsList;
