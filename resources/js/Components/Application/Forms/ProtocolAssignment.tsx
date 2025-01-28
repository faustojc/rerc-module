import { Button, Card, CardBody, CardFooter, CardHeader, Chip, Divider, Input } from "@nextui-org/react";
import { Application, ApplicationFormProps } from "@/types";
import { ChangeEvent, useState } from "react";

const ProtocolAssignment = ({user, application, status, setApplication, setStatuses}: ApplicationFormProps) => {
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
            setApplication({
                ...application,
                protocol_code: response.data.application.protocol_code,
                protocol_date_updated: response.data.application.protocol_date_updated,
            });
            setStatuses(response.data.application.statuses);
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
                            <ProtocolCodeDisplay application={application} />
                        )}
                    </>
                ) : (
                    <ProtocolCodeDisplay application={application} />
                )}
            </CardBody>

            {(user.role === 'staff' && status && !status?.end) && (
                <>
                    <Divider /> <CardFooter className="justify-end">
                    <Button variant="shadow" color="secondary" isLoading={loading} onPress={() => handleAssignProtocol()}> Assign Protocol </Button> </CardFooter>
                </>
            )}
        </Card>
    )
}

const ProtocolCodeDisplay = ({application}: {application: Application}) => {
    return (
        <div className="grid grid-cols-2 gap-y-3 px-3 py-2">
            <h3 className="font-bold">
                Protocol Code:
            </h3>
            <Chip className="ml-1 border-none" variant={application.protocol_code ? 'shadow' : 'dot'} color={application.protocol_code ? 'primary' : 'default'}>
                {application.protocol_code ?? "Not Assigned"}
            </Chip>
            <h3 className="font-bold">
                Date Assigned:
            </h3>
            <p>
                {application.protocol_date_updated ? new Date(application.protocol_date_updated).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
                }) : "N/A"}
            </p>
        </div>
    )
}

export default ProtocolAssignment;
