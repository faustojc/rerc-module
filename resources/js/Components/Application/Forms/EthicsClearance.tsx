import { ApplicationFormProps } from "@/types";
import React, { useCallback, useState } from "react";
import { Button, Card, CardBody, CardHeader, Chip, DatePicker, DateRangePicker, Input, Link } from "@nextui-org/react";
import { CloudArrowDown, DocumentCheckOutline, LightUploadRounded } from "@/Components/Icons";
import { DateValue, getLocalTimeZone } from "@internationalized/date";
import { toast } from "react-toastify";
import { RangeValue } from "@react-types/shared";

const EthicsClearance: React.FC<ApplicationFormProps> = ({user, application, status, handleUpdateApplication}) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [clearanceDate, setClearanceDate] = useState<DateValue | null>(null);
    const [dateRange, setDateRange] = useState<RangeValue<DateValue> | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const formatDate = useCallback((dateString: string) => {
        if (!dateString) return '';

        const date = new Date(dateString);

        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
        }).format(date);
    }, []);

    const dateToLocaleString = useCallback((date: DateValue | null) => {
        if (!date) return '';

        return date.toDate(getLocalTimeZone()).toLocaleDateString();
    }, []);

    const handleUpload = async () => {
        if (!selectedFile) return;

        try {
            setIsUploading(true);

            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('date_clearance', dateToLocaleString(clearanceDate));
            formData.append('effective_start_date', dateToLocaleString(dateRange!.start));
            formData.append('effective_end_date', dateToLocaleString(dateRange!.end));
            formData.append('message', `Ethics Clearance has been uploaded by ${user.name}`);

            const response = await window.axios.post(
                route('applications.upload-ethics-clearance', {application: application}),
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );

            handleUpdateApplication({
                application: {
                    ethics_clearance: response.data.ethics_clearance,
                    statuses: [response.data.status]
                }
            });
            setSelectedFile(null);
            setClearanceDate(null);
        } catch (error: any) {
            console.error('Upload failed:', error.message);
            toast.error('Failed to upload Ethics Clearance. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <Card className="sticky self-start top-0">
            <CardHeader className="flex flex-col items-start px-6 pt-6 pb-0">
                <div className="flex items-center justify-between w-full">
                    <h2 className="text-xl font-bold">Ethics Clearance</h2>
                    {application.ethics_clearance && (
                        <Chip
                            color="success"
                            variant="flat"
                            startContent={<DocumentCheckOutline className="w-4 h-4" />}
                            className="px-3"
                        >
                            Signed
                        </Chip>
                    )}
                </div>
                <p className="text-sm text-default-500 mt-2">
                    The Ethics Clearance is the final document that confirms the ethical approval of your research.
                </p>
            </CardHeader>

            <CardBody className="px-6">
                {/* Status and Current Document Section */}
                {application.ethics_clearance ? (
                    <div className="space-y-4">
                        <div className="bg-primary-50/50 p-4 rounded-lg">
                            <h3 className="font-medium mb-2">Signed Ethics Clearance</h3>
                            <div className="space-y-2">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-sm font-medium">
                                                {application.ethics_clearance.file_url.split('\\').pop()?.split('/').pop()}
                                            </p>
                                            <p className="text-xs text-default-600">
                                                Uploaded on {formatDate(application.ethics_clearance.date_uploaded)}
                                            </p>
                                        </div>
                                        <Button
                                            as={Link}
                                            href={route('ethics-clearances.download', {ethics_clearance: application.ethics_clearance})}
                                            variant="flat"
                                            color="primary"
                                            startContent={<CloudArrowDown className="w-4 h-4" />}
                                            download
                                        >
                                            Download
                                        </Button>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">
                                            Clearance Date
                                        </p>
                                        <p className="text-xs text-default-600">
                                            {formatDate(application.ethics_clearance.date_clearance)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">
                                            Effective Date
                                        </p>
                                        <p className="text-xs text-default-600">
                                            {formatDate(application.ethics_clearance.effective_start_date)} - {formatDate(application.ethics_clearance.effective_end_date)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    // staff upload section
                    user.role === 'staff' ? (
                        <div className="space-y-4">
                            <div className="bg-primary-50/50 space-y-3 p-4 rounded-lg">
                                <div>
                                    <h3 className="text-primary-800 font-medium">
                                        Upload Ethics Clearance
                                    </h3>
                                    <p className="text-sm text-primary-600 mb-4">
                                        Please upload the signed Ethics Clearance document for this research application.
                                    </p>
                                    <Input
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        variant="bordered"
                                        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                        className="w-full"
                                        description="Upload signed Ethics Clearance (PDF, DOC, DOCX)"
                                    />
                                </div>
                                <div>
                                    <h3 className="text-primary-800 font-medium">
                                        Date of Clearance
                                    </h3>
                                    <p className="text-sm text-primary-600 mb-4">
                                        The date the Ethics Clearance was signed.
                                    </p>
                                    <DatePicker
                                        className="sm:max-w-[284px]"
                                        variant="bordered"
                                        value={clearanceDate}
                                        onChange={setClearanceDate}
                                        description={clearanceDate ? formatDate(dateToLocaleString(clearanceDate)) : 'Select date'}
                                    />
                                </div>
                                <div>
                                    <h3 className="text-primary-800 font-medium">
                                        Effective Date
                                    </h3>
                                    <p className="text-sm text-primary-600 mb-4">
                                        The date the Ethics Clearance becomes effective.
                                    </p>
                                    <DateRangePicker
                                        showMonthAndYearPickers
                                        className="sm:max-w-[284px]"
                                        label="Date Range (From - To)"
                                        labelPlacement="outside"
                                        size="sm"
                                        variant="bordered"
                                        value={dateRange}
                                        onChange={setDateRange}
                                    />
                                </div>
                                {status != null && (
                                    <div className="flex justify-end">
                                        <Button
                                            color="primary"
                                            isLoading={isUploading}
                                            isDisabled={selectedFile == null || clearanceDate == null || !dateRange}
                                            onPress={handleUpload}
                                            startContent={<LightUploadRounded className="w-4 h-4" />}
                                        >
                                            Upload Ethics Clearance
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <DocumentCheckOutline className="w-12 h-12 text-default-400 mx-auto mb-3" />
                            <p className="text-default-500">
                                Ethics Clearance has not been uploaded yet.
                            </p>
                        </div>
                    )
                )}

                {/* Information Panel */}
                <div className="mt-6 bg-default-100 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">About Ethics Clearance</h3>
                    <div className="space-y-2 text-sm text-default-600">
                        <p>
                            • The Ethics Clearance is an official document that confirms your research
                            has met all ethical requirements.
                        </p>
                        <p>
                            • Only signed Ethics Clearance documents are considered valid.
                        </p>
                        <p>
                            • Once uploaded, the Ethics Clearance will be available to all relevant
                            parties involved in the research.
                        </p>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
}

export default EthicsClearance;
