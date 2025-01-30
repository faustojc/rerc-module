import { Application, ApplicationUpdatedEvent, AppStatus, MessageThread } from "@/types";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

type RelationType = any[] | object | null;

export const useApplication = (initialApplication: Application) => {
    const [application, setApplication] = useState<Application>(initialApplication);

    const isRelationship = (value: any): value is RelationType => {
        return value !== null &&
               (Array.isArray(value)
                || (typeof value === 'object' && !('getTime' in value)));
    };

    const hasArrayRelationshipChanged = (
        prevArray: any[],
        nextArray: any[]
    ): boolean => {
        if (prevArray.length !== nextArray.length) return true;

        return prevArray.some((prev, index) => {
            const next = nextArray[index];

            if ('id' in prev && 'id' in next) {
                if (prev.id !== next.id) return true;
                return 'updated_at' in prev &&
                       'updated_at' in next &&
                       prev.updated_at !== next.updated_at;
            }

            return JSON.stringify(prev) !== JSON.stringify(next);
        });
    };

    const hasObjectRelationshipChanged = (
        prevObj: object | null,
        nextObj: object | null
    ): boolean => {
        if (!prevObj && !nextObj) return false;
        if (!prevObj || !nextObj) return true;

        if ('id' in prevObj && 'id' in nextObj) {
            const prev = prevObj as { id: string; updated_at?: string };
            const next = nextObj as { id: string; updated_at?: string };

            if (prev.id !== next.id) return true;
            return prev.updated_at != null &&
                   next.updated_at != null &&
                   prev.updated_at !== next.updated_at;
        }

        return JSON.stringify(prevObj) !== JSON.stringify(nextObj);
    };

    const hasModelChanges = <T extends object>(
        prevModel: T,
        newData: Partial<T>
    ): boolean => {
        return Object.keys(newData).some(key => {
            const field = key as keyof T;
            const prevValue = prevModel[field];
            const nextValue = newData[field];

            if (nextValue === undefined) return false;

            if (isRelationship(prevValue)) {
                if (Array.isArray(prevValue) && Array.isArray(nextValue)) {
                    return hasArrayRelationshipChanged(prevValue, nextValue);
                }
                return hasObjectRelationshipChanged(prevValue, nextValue as object);
            }

            return prevValue !== nextValue;
        });
    };

    const mergeModelData = <T extends object>(
        prevModel: T,
        newData: Partial<T>
    ): T => {
        const merged = { ...prevModel };

        Object.keys(newData).forEach(key => {
            const field = key as keyof T;
            const prevValue = prevModel[field];
            const nextValue = newData[field];

            if (nextValue === undefined) return;

            if (Array.isArray(prevValue) && Array.isArray(nextValue)) {
                if (prevValue[0] && 'id' in prevValue[0]) {
                    const updatedArray = [...prevValue];

                    nextValue.forEach(newItem => {
                        const existingIndex = updatedArray.findIndex(
                            existing => existing.id === newItem.id
                        );

                        if (existingIndex !== -1) {
                            updatedArray[existingIndex] = {
                                ...updatedArray[existingIndex],
                                ...newItem
                            };
                        } else {
                            updatedArray.push(newItem);
                        }
                    });

                    merged[field] = updatedArray as T[keyof T];
                } else {
                    merged[field] = nextValue as T[keyof T];
                }
            } else if (isRelationship(prevValue) && isRelationship(nextValue)) {
                merged[field] = { ...prevValue, ...nextValue } as T[keyof T];
            } else {
                merged[field] = nextValue as T[keyof T];
            }
        });

        return merged;
    };

    const handleUpdateApplication = useCallback((data: ApplicationUpdatedEvent) => {
        setApplication(prevApplication => {
            const hasChanges = hasModelChanges(prevApplication, data.application);

            if (!hasChanges) {
                return prevApplication;
            }

            return mergeModelData(prevApplication, data.application);
        });
    }, []);

    const addStatus = useCallback((status: AppStatus) => {
        setApplication(prev => ({
            ...prev,
            statuses: [...prev.statuses, status]
        }));
    }, []);

    const addMessage = useCallback((statusId: string, messageData: MessageThread) => {
        setApplication(prev => ({
            ...prev,
            statuses: prev.statuses.map(status =>
                status.id === statusId
                    ? { ...status, messages: [...status.messages, messageData] }
                    : status
            )
        }));
    }, []);

    const updateMessage = useCallback((statusId: string, updatedMessage: MessageThread) => {
        setApplication(prev => ({
            ...prev,
            statuses: prev.statuses.map(status =>
                status.id === statusId
                    ? {
                        ...status,
                        messages: status.messages.map(msg =>
                            msg.id === '' ? updatedMessage : msg
                        )
                    }
                    : status
            )
        }));
    }, []);

    const removeMessage = useCallback((statusId: string) => {
        setApplication(prev => ({
            ...prev,
            statuses: prev.statuses.map(status =>
                status.id === statusId
                    ? {
                        ...status,
                        messages: status.messages.filter(msg => msg.id !== '')
                    }
                    : status
            )
        }));
    }, []);

    const handleMessage = useCallback(async (
        status: AppStatus,
        messageContent: string,
        userName: string
    ) => {
        const trimmedMessage = messageContent.trim();

        if (!trimmedMessage) return;

        const messageData: MessageThread = {
            id: '',
            app_profile_id: application.id,
            app_status_id: status.id,
            remarks: trimmedMessage,
            by: userName,
            read_status: 'sending...'
        };

        try {
            addMessage(status.id, messageData);

            const response = await window.axios.post(
                route('statuses.message-threads.store', { status: status }),
                messageData
            );

            updateMessage(status.id, response.data.message_thread);
        } catch (error) {
            console.error('Error sending message:', error);

            removeMessage(status.id);

            toast.error('Failed to send message');
        }
    }, [application.id, addMessage, updateMessage, removeMessage]);

    useEffect(() => {
        console.log(application);

        const channel = window.Echo.channel(`application.${application.id}`);

        channel.listen('.ApplicationUpdated', (data: any) => {
            toast.info(data.message ?? `${data.application.research_title}'s has a new update`);

            handleUpdateApplication(data);
        }).listen('.SendAndUpdateFeedback', (data: {message_thread: MessageThread, message: string | null}) => {
            addMessage(data.message_thread.app_status_id, data.message_thread);
        });

        return () => {
            window.Echo.leaveChannel(`application.${application.id}`);
        };
    }, [application.id]);

    return {
        application,
        handleUpdateApplication,
        handleMessage,
        addStatus,
        addMessage,
        updateMessage,
    };
};
