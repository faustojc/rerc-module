import { AppStatus, MessageThread, User } from "@/types";
import { Button, Card, CardBody, CardFooter, Spacer, Textarea } from "@nextui-org/react";
import { getLocalTimeZone, parseAbsolute } from "@internationalized/date";
import React, { useCallback, useMemo } from "react";
import { SendFill } from "@/Components/Icons";
import { useVirtualizer } from "@tanstack/react-virtual";

interface FeedbackProps {
    user: User;
    status: AppStatus;
    setStatuses?: React.Dispatch<React.SetStateAction<AppStatus[]>>;
    handleMessage: (status: AppStatus, message: string, userName: string) => Promise<void>;
}

const Feedbacks = ({user, status, handleMessage}: FeedbackProps) => {
    const [message, setMessage] = React.useState('');
    const parentRef = React.useRef<HTMLDivElement>(null);

    const groupedMessages = useMemo(() => {
        let previousDate = '';

        if (!status?.messages) {
            return {};
        }

        return status.messages.reduce((groups: {[key: string]: MessageThread[]}, message) => {
            const dateKey = message.created_at
                ? Intl.DateTimeFormat('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                }).format(parseAbsolute(message.created_at, getLocalTimeZone()).toDate())
                : previousDate || Intl.DateTimeFormat('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            }).format(new Date());

            previousDate = dateKey;

            if (!groups[dateKey]) {
                groups[dateKey] = [];
            }

            groups[dateKey].push(message);

            return groups;
        }, {} as {[key: string]: MessageThread[]});
    }, [status?.messages]);

    const formatTimestamp = useCallback((timestamp: string) => {
        const dateTime = parseAbsolute(timestamp, getLocalTimeZone()).toDate();
        return new Intl.DateTimeFormat(undefined, {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
        }).format(dateTime);
    }, []);

    const flattenedData = useMemo(() => {
        return Object.entries(groupedMessages).flatMap(([date, messages]) => [
            { type: 'date', content: date },
            ...messages.map(msg => ({ type: 'message', content: msg }))
        ]);
    }, [groupedMessages]);

    // Virtual list setup
    const virtualizer = useVirtualizer({
        count: flattenedData.length,
        getScrollElement: () => parentRef.current,
        estimateSize: useCallback(() => 80, []),
        overscan: 3
    });

    const handleSendMessage = async () => {
        setMessage('');

        await handleMessage(status, message, user.name);
    };

    const renderItem = useCallback(({ item }: { item: any, index: number }) => {
        if (item.type === 'date') {
            return (
                <div className="flex flex-row justify-center my-2">
                    {item.content}
                </div>
            );
        }

        const message = item.content as MessageThread;
        const isSender = message.by.toLowerCase() === user.name.toLowerCase();
        const isMostRecentMessage = status.messages.filter(
            (msg) => msg.by.toLowerCase() === message.by.toLowerCase()
        ).pop()?.id === message.id;

        return (
            <div className={`flex gap-3 ${isSender ? 'justify-end' : 'justify-start'}`}>
                <div>
                    <Card className={`max-w-xs shadow-md ${
                        isSender ? 'bg-primary-100 rounded-br-none' : 'bg-default-100/60 rounded-bl-none'
                    }`}>
                        <CardBody>
                            {(!isSender) && (
                                <div className="flex justify-between items-center gap-3">
                                    <p className="text-sm font-semibold">
                                        {message.by}
                                    </p>
                                    {isMostRecentMessage && (
                                        <p className="text-xs text-default-500 ml-1">
                                            {formatTimestamp(message.created_at!)}
                                        </p>
                                    )}
                                </div>
                            )}
                            {message.remarks}
                        </CardBody>
                    </Card>
                    {(isSender && isMostRecentMessage) && (
                        <div className="text-sm text-end text-default-500 mt-1.5">
                            {message.read_status} {message.created_at && (
                            <>at {formatTimestamp(message.created_at!)}</>
                        )}
                        </div>
                    )}
                </div>
            </div>
        );
    }, [status?.messages, formatTimestamp]);

    return (
        <>
            <CardBody className="sm:max-h-[42rem] max-h-[32rem] overflow-y-auto gap-2">
                {(status?.messages != null && status.messages.length !== 0 ) && (
                    <div ref={parentRef}
                         style={{
                            height: `${virtualizer.getTotalSize()}px`,
                            width: '100%',
                            position: 'relative',
                        }}
                         className=""
                    >
                        {virtualizer.getVirtualItems().map((virtualRow) => (
                            <div
                                key={virtualRow.key}
                                data-index={virtualRow.index}
                                ref={virtualizer.measureElement}
                                className="mb-2"
                            >
                                {renderItem({
                                    item: flattenedData[virtualRow.index],
                                    index: virtualRow.index
                                })}
                                {/* put space at the end of list */}
                                {virtualRow.index === flattenedData.length - 1 && (
                                    <Spacer y={2} />
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </CardBody>
            <CardFooter>
                <Textarea
                    minRows={1}
                    endContent={(
                        <Button isIconOnly variant="light" color="primary" onPress={handleSendMessage}> <SendFill /> </Button>
                    )}
                    classNames={{
                        inputWrapper: "py-1",
                        innerWrapper: "flex items-center gap-3",
                    }}
                    value={message}
                    onValueChange={setMessage}
                />
            </CardFooter>
        </>
    )
}

export default Feedbacks;
