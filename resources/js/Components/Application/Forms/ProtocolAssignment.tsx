import { Button, Card, CardBody, CardFooter, CardHeader, Checkbox, Chip, Divider, Input } from "@nextui-org/react";
import { Application, ApplicationFormProps, AppStatus } from "@/types";
import React, { useState } from "react";
import { ClipboardError, FeDocument, MdiCalendar, QuillInfo } from "@/Components/Icons";
import { parseAbsolute } from "@internationalized/date";
import { toast } from "react-toastify";

const ProtocolAssignment = ({user, application, status, handleUpdateApplication}: ApplicationFormProps) => {
    const [protocolCode, setProtocolCode] = useState<string | null>(null);
    const [isHardcopy, setIsHardcopy] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const handleAssignProtocol = () => {
        if (!protocolCode || protocolCode?.length === 0) {
            setIsError(true);
            return;
        }

        setIsError(false);
        setLoading(true);

        window.axios.patch(route('applications.update', {application: application}), {
            protocol_code: protocolCode,
            is_hardcopy: isHardcopy,
            status_id: status.id,
            can_proceed: application.protocol_code == null,
        }).then(response => {
            handleUpdateApplication({
                application: {
                    protocol_code: response.data.application.protocol_code,
                    protocol_date_updated: response.data.application.protocol_date_updated,
                    is_hardcopy: response.data.application.is_hardcopy,
                    statuses: response.data.application.statuses
                }
            });
        }).catch((error) => {
            toast.error(error.response.data.message ?? 'Ops! Something went wrong. Please try again.');
        }).finally(() => setLoading(false));
    }

    return (
        <Card className="sticky self-start top-0">
            <CardHeader className="flex-col items-start bg-success-300">
                <h3 className="text-xl font-semibold text-start">Protocol Assignment</h3>
                <p className="text-sm">
                    {user.role === 'researcher'
                        ? 'Protocol assignment will be done by the RERC Staff'
                        : 'Assign a protocol to this application'
                    }
                </p>
            </CardHeader>
            <CardBody>
                {application.protocol_code ? (
                    <div className="space-y-6">
                        <ProtocolCodeDisplay application={application} />

                        {user.role === 'staff' && status && (
                            <div className="flex flex-col gap-4 bg-default-50 border-2 border-primary-400 p-4 rounded-lg">
                                <Input
                                    label="Update Protocol Code"
                                    placeholder="ENTER PROTOCOL CODE"
                                    onChange={event => setProtocolCode(event.target.value)}
                                    isInvalid={isError}
                                    errorMessage={'Please enter the protocol code'}
                                    labelPlacement="outside"
                                    variant="bordered"
                                    startContent={
                                        <FeDocument className="text-default-400 pointer-events-none flex-shrink-0" />
                                    }
                                    description="Ensure that the protocol code is unique and should not be used by any other application"
                                    classNames={{input: "uppercase"}}
                                />
                                <Checkbox
                                    isSelected={isHardcopy}
                                    onValueChange={setIsHardcopy}
                                    size="sm"
                                    color="primary"
                                >
                                    This is a hardcopy submission
                                </Checkbox>
                                <div className="text-default-500 text-xs">
                                    <QuillInfo className="inline-block mr-1 w-3 h-3" />
                                    Hardcopy submissions require physical document processing
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        {(status && user.role === 'staff') ? (
                            <div className="flex flex-col gap-4 p-4 rounded-lg">
                                <Input
                                    label="Protocol Code"
                                    placeholder="Enter protocol code"
                                    onChange={event => setProtocolCode(event.target.value)}
                                    isInvalid={isError}
                                    errorMessage={'Please enter the protocol code'}
                                    labelPlacement="outside"
                                    variant="bordered"
                                    startContent={
                                        <FeDocument className="text-default-400 pointer-events-none flex-shrink-0" />
                                    }
                                    description="Protocol code should be unique and should not be used by any other application"
                                    classNames={{input: "uppercase"}}
                                />
                                <Checkbox
                                    isSelected={isHardcopy}
                                    onValueChange={setIsHardcopy}
                                    size="sm"
                                    color="primary"
                                >
                                    This is a hardcopy submission
                                </Checkbox>
                                <div className="text-default-500 text-xs">
                                    <QuillInfo className="inline-block mr-1 w-3 h-3" />
                                    Hardcopy submissions require physical document processing
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <ClipboardError className="w-12 h-12 text-default-400 mx-auto mb-3" />
                                <p className="text-default-500">
                                    {status == null
                                        ? 'Application requirements must be completed before assigning a protocol code'
                                        : 'Protocol code has not been assigned yet.'
                                    }
                                </p>
                            </div>
                        )}
                    </>
                )}
                <div className="mt-6 bg-default-100 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">About Protocol Code</h3>
                    <div className="space-y-2 text-sm text-default-600">
                        <p>
                            • The protocol code is a unique identifier assigned to your research application.
                        </p>
                        <p>
                            • This code will be used in all future correspondence and documentation.
                        </p>
                        <p>
                            • Keep this code for your records and reference.
                        </p>
                    </div>
                </div>
            </CardBody>

            {(user.role === 'staff' && status) && (
                <>
                    <Divider />
                    <CardFooter className="justify-end">
                        <Button variant="shadow" color="secondary" isLoading={loading} onPress={handleAssignProtocol}>
                            Assign Protocol
                        </Button>
                    </CardFooter>
                </>
            )}
        </Card>
    )
}

const ProtocolCodeDisplay: React.FC<{
    application: Application;
    status?: AppStatus;
}> = ({application}) => {
    const formatDate = (dateString?: string | null) => {
        if (!dateString) return '';
        const date = parseAbsolute(dateString, 'UTC').toDate();
        return new Intl.DateTimeFormat(undefined, {
            dateStyle: 'long',
            timeStyle: 'short',
        }).format(date);
    };

    return (
        <div className="bg-default-100 p-4 rounded-lg">
            <div className="space-y-3">
                <div>
                    <div className="flex flex-row justify-between">
                        <label className="text-sm font-medium text-default-700">
                            Protocol Code
                        </label>
                        {application.is_hardcopy && (
                            <Chip color="danger" variant="solid" size="sm">
                                HARDCOPY
                            </Chip>
                        )}
                    </div>
                    <div className="mt-1 flex items-center">
                    <p className="text-lg font-semibold text-default-900">
                        {application.protocol_code.toUpperCase()}
                    </p>
                    </div>
                </div>
                <div>
                    <label className="text-sm font-medium text-default-700">
                        Date Assigned
                    </label>
                    <div className="mt-1 flex items-center text-default-600">
                        <MdiCalendar className="w-4 h-4 mr-2" />
                        {formatDate(application.protocol_date_updated)}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProtocolAssignment;
