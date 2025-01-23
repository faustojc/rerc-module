import { AppStatus } from "@/types";
import { Card, CardBody, CardHeader, Chip, Divider } from "@nextui-org/react";
import React, { Fragment, useMemo } from "react";
import { Check } from "@/Components/Icons";

interface StatusesProps {
    statusList: string[];
    appStatuses: AppStatus[];
    selectedStatus: AppStatus;
    setSelectedStatus: (status: AppStatus) => void;
}

const Statuses = ({statusList, appStatuses, selectedStatus, setSelectedStatus }: StatusesProps) => {
    const steps: AppStatus[] = useMemo(() => {
        return statusList.map((name, index) => {
            const dateTime = Intl.DateTimeFormat('en-us', {
                month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit'
            });

            const startDate = appStatuses[index]?.start
                ? dateTime.format(new Date(appStatuses[index].start))
                : "N/A";

            const endDate = appStatuses[index]?.end
                ? dateTime.format(new Date(appStatuses[index].end))
                : "N/A";

            return {
                id: appStatuses[index]?.id ?? '',
                app_profile_id: appStatuses[index]?.app_profile_id ?? appStatuses[0].app_profile_id,
                name: name,
                status: appStatuses[index]?.status ?? "Pending",
                sequence: appStatuses[index]?.sequence ?? index + 1,
                start: startDate,
                end: endDate,
            }
        });
    }, [appStatuses]);

    const statusColor = (status: string) => {
        if ('pending'.includes(status.toLowerCase())) {
            return "warning";
        } else if ('approved,completed,submitted,done,assigned,signed'.includes(status.toLowerCase())) {
            return "success";
        } else if ('sent,received,reviewed,reviewing,uploaded'.includes(status.toLowerCase())) {
            return "secondary";
        } else if ('rejected,removed'.includes(status.toLowerCase())) {
            return "danger";
        } else {
            return "primary";
        }
    };

    const stepsColor = (status: AppStatus) => {
        if (selectedStatus.sequence === status.sequence) {
            return 'primary';
        }
        if (status.end != 'N/A') {
            return 'success';
        }

        return 'default';
    }


    return (
        <Card className="mb-4 sm:mb-0">
            <CardHeader className="flex-col items-start bg-success-300">
                <h3 className="text-lg font-semibold">Application Process</h3>
                <p className="text-sm">
                    Statuses of the application process.
                </p>
            </CardHeader>
            <CardBody className="items-start gap-4">
                {steps.map((status, index) => (
                    <Fragment key={`${status.id}-${index}`}>
                        <div className="flex flex-row gap-8 items-center px-4 w-full hover:bg-default-100 rounded-lg cursor-pointer" onClick={() => setSelectedStatus(status) }>
                            <Chip size="md" variant="shadow" color={stepsColor(status)} classNames={{
                                content: status.end != 'N/A' ? 'px-0' : 'p-1.5'
                            }}>
                                {status.end != 'N/A' ? <Check /> : status.sequence}
                            </Chip>
                            <div className="w-full">
                                <p className="font-bold text-wrap">{status.name}</p>
                                <Chip variant="dot" color={statusColor(status.status)} size="sm" className="my-1 border-none">
                                    {status.status}
                                </Chip>
                                <div className="w-full">
                                    <p className="grid grid-cols-5 gap-x-1.5 text-sm">
                                        Start:
                                        <span className="col-span-4">
                                            {status.start}
                                        </span>
                                    </p>
                                    <p className="grid grid-cols-5 text-sm">
                                        End:
                                        <span className="col-span-4">
                                            {status.end}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        {(index < 9) && <Divider key={status.sequence} />}
                    </Fragment>
                ))}
            </CardBody>
        </Card>
    );
}

export default Statuses;
