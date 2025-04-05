import React, { useRef } from "react";
import { ReviewerReport } from "@/types";
import { Alert, Button, CardBody, CardFooter, CardHeader, Divider, Input, Link, Tooltip } from "@nextui-org/react";
import { CloudArrowDown, FeDocument, MdiDeleteForever, MdiFileDocumentArrowRight, SendFill } from "@/Components/Icons";
import { toast } from "react-toastify";
import { TimelineLog, TimelineLogMessage } from "@/Components/TimelineLog";

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
                    <TimelineLog
                        items={reviewerReports}
                        actions={(report) => (
                            <Button
                                as={Link}
                                href={route('reviewer-report.download', {reviewer_report: report})}
                                variant="flat"
                                color="primary"
                                startContent={<CloudArrowDown className="w-4 h-4" />}
                                download
                            >
                                Download
                            </Button>
                        )}
                    >
                        {(report) => (
                            <TimelineLogMessage>
                                {report.message}
                            </TimelineLogMessage>
                        )}
                    </TimelineLog>
                ) : (
                    <Alert color="default" variant="flat" description="The Staff has not uploaded any review reports yet." />
                )}
            </CardBody>
            {isStaff && (
                <>
                    <Divider />
                    <CardFooter className="flex-col items-start gap-3">
                        {file && (
                            <div className="relative flex flex-row items-center gap-2 max-w-xs bg-default-100 rounded-lg p-2">
                                <FeDocument width={30} />
                                <div>
                                    <p className="line-clamp-1">{file.name}</p>
                                    <p className="text-sm text-default-500">
                                        {sizeDisplay(file.size)}
                                    </p>
                                </div>
                                <Button
                                    variant="light"
                                    color="danger"
                                    size="sm"
                                    isIconOnly
                                    onPress={() => {
                                        setFile(null);
                                        fileInputRef.current!.value = '';
                                    }}
                                >
                                    <MdiDeleteForever />
                                </Button>
                            </div>
                        )}
                        <div className="flex flex-row items-center gap-3 w-full">
                            <Tooltip content="Attach a file up to 10MB">
                                <label className="block">
                                    <div className="flex flex-row gap-2 cursor-pointer py-1.5 px-4 rounded-lg font-semibold bg-default-200 hover:border-primary-100 hover:bg-primary-100 transition">
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
