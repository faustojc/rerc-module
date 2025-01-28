import React, { useCallback, useState } from "react";
import { AppStatus, MessageThread } from "@/types";

export const useMessageHandler = (
    userName: string,
    status: AppStatus,
    setStatuses: React.Dispatch<React.SetStateAction<AppStatus[]>>
) => {
    const [error, setError] = useState<string | null>(null);

    const addMessage = useCallback((messageData: MessageThread) => {
        setStatuses(prev =>
            prev.map(s => s.id === status.id
                ? { ...s, messages: [...s.messages, messageData] }
                : s
            )
        );
    }, [status?.id, setStatuses]);

    const updateMessage = useCallback((updatedMessage: MessageThread) => {
        setStatuses(prev =>
            prev.map(s => s.id === status.id
                ? {
                    ...s,
                    messages: s.messages.map(msg =>
                        msg.id === '' ? updatedMessage : msg
                    )
                }
                : s
            )
        );
    }, [status?.id, setStatuses]);

    const removeMessage = useCallback(() => {
        setStatuses(prev =>
            prev.map(s => s.id === status.id
                ? {
                    ...s,
                    messages: s.messages.filter(msg => msg.id !== '')
                }
                : s
            )
        );
    }, [status?.id, setStatuses]);

    const sendMessage = useCallback(async (messageContent: string) => {
        const trimmedMessage = messageContent.trim();

        if (!trimmedMessage) {
            return false;
        }

        const messageData: MessageThread = {
            id: '',
            app_profile_id: status.app_profile_id,
            app_status_id: status.id,
            remarks: trimmedMessage,
            by: userName,
            read_status: 'sending...'
        };

        setError(null);

        try {
            addMessage(messageData);

            const response = await window.axios.post(
                route('statuses.message-threads.store', {status: status}),
                messageData
            );

            updateMessage(response.data.message_thread);
            return true;
        } catch (error) {
            setError('Failed to send message');
            removeMessage();
            return false;
        }
    }, [status, addMessage, updateMessage, removeMessage]);

    return {
        sendMessage,
        error,
        addMessage,
        updateMessage,
        removeMessage
    };
};
