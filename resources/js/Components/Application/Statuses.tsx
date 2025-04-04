import { AppStatus } from "@/types";
import { Accordion, AccordionItem, Card, CardBody, CardHeader, Chip, Divider } from "@nextui-org/react";
import React, { Fragment, useMemo } from "react";
import { ArrowsSwitch, Check, ClockRotateRight } from "@/Components/Icons";
import { getLocalTimeZone } from "@internationalized/date";
import { STEPS } from "@/types/constants";
import { statusColor } from "@/types/helpers";
import useIsMobile from "@/Hooks/useIsMobile";
import { Variants } from "framer-motion";
import { differenceInBusinessDays } from "date-fns";

interface StatusesProps {
    appStatuses: AppStatus[];
    selectedStatus: AppStatus;
    setSelectedStatus: (status: AppStatus) => void;
}

const Statuses = ({appStatuses, selectedStatus, setSelectedStatus }: StatusesProps) => {
    const isMobile = useIsMobile();
    const motionVariants: Variants = {
        enter: {
            y: 0,
            opacity: 1,
            height: "auto",
            overflowY: "unset",
            transition: {
                height: {
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                    duration: 0.6,
                },
                opacity: {
                    easings: "ease",
                    duration: 0.5,
                },
            },
        },
        exit: {
            y: -10,
            opacity: 0,
            height: 0,
            overflowY: "hidden",
            transition: {
                height: {
                    easings: "ease",
                    duration: 0.25,
                },
                opacity: {
                    easings: "ease",
                    duration: 0.2,
                },
            },
        }
    };

    if (isMobile) {
        return (
            <Accordion variant="splitted" motionProps={{variants: motionVariants}}>
                <AccordionItem key={1}
                               aria-label="steps list"
                               title="Application Process"
                               subtitle={`Step ${selectedStatus.sequence}: ${selectedStatus.name}`}
                >
                    <div className="relative flex w-full pl-2 sm:px-3 py-3 flex-auto flex-col place-content-inherit align-items-inherit h-auto break-words text-left overflow-y-auto subpixel-antialiased items-start gap-4">
                        <StepsList appStatuses={appStatuses} selectedStatus={selectedStatus} setSelectedStatus={setSelectedStatus} />
                    </div>
                </AccordionItem>
            </Accordion>
        );
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
                <StepsList appStatuses={appStatuses} selectedStatus={selectedStatus} setSelectedStatus={setSelectedStatus} />
            </CardBody>
        </Card>
    );
}

const StepsList: React.FC<StatusesProps> = ({appStatuses, selectedStatus, setSelectedStatus}) => {
    const steps: AppStatus[] = useMemo(() => {
        const statuses = appStatuses.sort((a, b) => a.sequence - b.sequence);

        return STEPS.map((step, index) => {
            const dateTime = Intl.DateTimeFormat('en-US', {
                month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', timeZone: getLocalTimeZone()
            });

            const startDate = statuses[index]?.start
                ? dateTime.format(new Date(statuses[index].start))
                : "N/A";

            const endDate = statuses[index]?.end
                ? dateTime.format(new Date(statuses[index].end))
                : "N/A";

            return {
                id: statuses[index]?.id ?? '',
                app_profile_id: statuses[index]?.app_profile_id ?? appStatuses[0].app_profile_id,
                name: step.name,
                status: statuses[index]?.status ?? "Pending",
                sequence: statuses[index]?.sequence ?? index + 1,
                start: startDate,
                end: endDate,
                messages: statuses[index]?.messages ?? [],
            }
        });
    }, [appStatuses]);

    const stepsColor = (status: AppStatus) => {
        if (selectedStatus.sequence === status.sequence) {
            return 'primary';
        }
        if (status.end != 'N/A') {
            return 'success';
        }

        return 'default';
    }

    const getDuration = (start: string, end: string) => {
        if (end != 'N/A') {
            const diff = differenceInBusinessDays(new Date(end), new Date(start));
            return diff > 1 ? `${diff} days` : `${diff} day`;
        }

        return '';
    }

    return steps.map((status, index) => (
            <Fragment key={`${status.id}-${index}`}>
                <div className="grid grid-cols-3 gap-5 items-center px-4 w-full hover:bg-default-100 rounded-lg cursor-pointer" onClick={() => setSelectedStatus(status) }>
                    <div className="flex flex-row flex-nowrap items-center justify-end gap-3">
                        <Chip size="md" variant="shadow" color={stepsColor(status)} classNames={{
                            content: status.end != 'N/A' ? 'px-0' : 'p-1.5'
                        }}>
                            {statusColor(status.status) == 'primary' ?
                                <ArrowsSwitch width={18} />
                                : status.end != 'N/A' ? <Check /> : <ClockRotateRight width={16} height={16} />
                            }
                        </Chip>
                        <p className="text-nowrap">
                            Step {status.sequence}
                        </p>
                    </div>
                    <div className="col-span-2">
                        <p className="font-bold text-wrap">{status.name}</p>
                        <Chip variant="dot" color={statusColor(status.status)} size="sm" className="my-1 border-none">
                            {status.status}
                        </Chip>
                        <div className="w-full">
                            <p className="text-sm">
                                Start:
                                <span className="ml-1">
                                    {status.start}
                                </span>
                            </p>
                            <p className="text-sm">
                                End:
                                <span className="ml-1">
                                    {status.end}
                                </span>
                            </p>
                            {/* difference in days between start and end */}
                            <p className="text-sm text-primary-500">
                                Duration:
                                <span className="ml-1">
                                    {status.end != 'N/A' && status.start != 'N/A' && getDuration(status.start, status.end)}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
                {(index < 9) && <Divider key={status.sequence} />}
            </Fragment>
        ));
}

export default Statuses;
