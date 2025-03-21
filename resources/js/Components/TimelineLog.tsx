import React from 'react';
import { Avatar } from '@nextui-org/react';

export interface TimelineLogProps<T> {
    items: T[];
    children: (item: T) => React.ReactNode;
    avatar?: (item: T) => string | undefined;
    actions?: (item: T) => React.ReactNode;
}

export interface TimelineLogMessageProps {
    children: React.ReactNode;
    className?: string;
}

export interface TimelineLogAvatarProps {
    url?: string;
    className?: string;
}

export interface TimelineLogActionProps {
    children: React.ReactNode;
    className?: string;
    createdAt?: Date;
}

export const TimelineLogAvatar: React.FC<TimelineLogAvatarProps> = ({
    url,
    className = "w-6 h-6 p-4"
}) => (
    <span className="absolute flex items-center justify-center w-6 h-6 rounded-full -start-3">
    <Avatar
        src={url || undefined}
        className={`${className}`}
    />
  </span>
);

export const TimelineLogMessage: React.FC<TimelineLogMessageProps> = ({
    children,
    className = "text-sm font-normal text-default-500"
}) => (
    <div className={className}>
        {children}
    </div>
);

export const TimelineLogAction: React.FC<TimelineLogActionProps> = ({
    children,
    className = "flex flex-col gap-2 mt-2",
    createdAt
}) => {
    const dateFormat = createdAt?.toLocaleString('en-US', {
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
    });

    return (
        <div className={className}>
            {dateFormat && (
                <time className="text-xs font-normal text-default-500">
                    {`Uploaded on ${dateFormat}`}
                </time>
            )}
            <div className="flex gap-2">
                {children}
            </div>
        </div>
    );
};

export const TimelineLog = <T extends { created_at?: Date | string | undefined }>({
    items,
    children,
    avatar,
    actions
}: TimelineLogProps<T>) => {
    return (
        <ol className="relative border-s border-default-200">
            {items.map((item, index) => {
                const createdAt = item.created_at ? new Date(item.created_at) : undefined;

                return (
                    <li key={index} className="mb-10 ms-6">
                        <TimelineLogAvatar url={avatar ? avatar(item) : ''} />
                        <div className="flex flex-col gap-3 p-4 border border-default-200 rounded-lg shadow-xs">
                            <div className="items-start justify-between sm:flex gap-7">
                                {children(item)}
                                {createdAt && (
                                    <time className="mb-1 text-xs font-normal text-default-400 sm:order-last sm:mb-0">
                                        {createdAt.toLocaleDateString()}
                                    </time>
                                )}
                            </div>
                            {actions && (
                                <TimelineLogAction createdAt={createdAt}>
                                    {actions(item)}
                                </TimelineLogAction>
                            )}
                        </div>
                    </li>
                );
            })}
        </ol>
    );
};
