import { Button, Card, CardBody, CardFooter, CardHeader, Divider, Input } from "@nextui-org/react";
import { Application, ApplicationFormProps, AppStatus } from "@/types";
import React, { ChangeEvent, useState } from "react";
import { ClipboardError, MdiCalendar } from "@/Components/Icons";
import { parseAbsolute } from "@internationalized/date";

const ProtocolAssignment = ({user, application, status, handleUpdateApplication}: ApplicationFormProps) => {
    const [protocolCode, setProtocolCode] = useState<string | null>(application.protocol_code);
    const [isError, setIsError] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const handleSetProtocol = (e: ChangeEvent<HTMLInputElement>) => {
        setProtocolCode(e.target.value);
    }

    const handleAssignProtocol = () => {
        if (!protocolCode || protocolCode?.length === 0) {
            setIsError(true);
            return;
        }

        setIsError(false);
        setLoading(true);

        window.axios.patch(route('applications.update', {application: application}), {
            protocol_code: protocolCode,
            new_status: 'Assigned',
            status_id: status.id,
            is_completed: true,
            next_status: 'Initial Review',
            message: `${application.research_title} has been assigned a protocol code ${protocolCode}`
        }).then(response => {
            handleUpdateApplication({
                application: {
                    protocol_code: response.data.application.protocol_code,
                    protocol_date_updated: response.data.application.protocol_date_updated,
                    statuses: response.data.application.statuses
                }
            });
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
                {(status && !status?.end) ? (
                    <>
                        {(user.role === 'staff') ? (
                            <div className="sm:grid grid-cols-3 items-center">
                                <h3 className="font-bold">Protocol Code</h3>
                                <Input className="sm:mt-0 mt-4 col-span-2" isInvalid={isError} errorMessage={'Please enter the protocol code'} onChange={handleSetProtocol} />
                            </div>
                        ) : (
                            <ProtocolCodeDisplay application={application} status={status} />
                        )}
                    </>
                ) : (
                    <ProtocolCodeDisplay application={application} status={status} />
                )}
            </CardBody>

            {(user.role === 'staff' && status && !status?.end) && (
                <>
                    <Divider />
                    <CardFooter className="justify-end">
                        <Button variant="shadow" color="secondary" isLoading={loading} onPress={() => handleAssignProtocol()}>
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
}> = ({application, status}) => {
    const formatDate = (dateString?: string | null) => {
        if (!dateString) return '';
        const date = parseAbsolute(dateString, 'UTC').toDate();
        return new Intl.DateTimeFormat(undefined, {
            dateStyle: 'long',
            timeStyle: 'short',
        }).format(date);
    };

    if (application.protocol_code == null) {
        return (
            <div className="text-center py-8">
                <ClipboardError className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">
                    {status == null
                        ? 'Application requirements must be completed before assigning a protocol code'
                        : 'Protocol code has not been assigned yet.'
                    }
                </p>
            </div>
        )
    }

    return (
        <div className="bg-gray-50 p-4 rounded-lg">
            <div className="space-y-3">
                <div>
                    <label className="text-sm font-medium text-default-700">
                        Protocol Code
                    </label>
                    <div className="mt-1 flex items-center">
                    <p className="text-lg font-semibold text-default-900">
                        {application.protocol_code}
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
