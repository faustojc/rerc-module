import React, { Suspense, useEffect, useState } from "react";
import { Button, CardBody, CardFooter, Divider, Spinner } from "@nextui-org/react";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import { useThemeSignal } from "@/types/themeSignal";
import { AddRounded, DotsFill, Empty, Slash } from "@/Components/Icons";
import { blockNoteSchema } from "@/types/helpers";
import { MessagePost, User } from "@/types";
import { format } from "date-fns";

interface AdditionalMessageProps {
    user: User;
    messagePost: MessagePost | null;
    onPostMessage: (content: string) => Promise<void>;
}

const AdditionalMessage: React.FC<AdditionalMessageProps> = ({user, messagePost, onPostMessage}) => {
    const { theme } = useThemeSignal();
    const editor = useCreateBlockNote({
        schema: blockNoteSchema(),
        initialContent: messagePost ? JSON.parse(messagePost.content) : undefined,
    });

    const [messageHTML, setMessageHTML] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const handlePostMessage = async () => {
        setLoading(true);

        onPostMessage(JSON.stringify(editor.document, null, 2))
            .then(() => {})
            .finally(() => setLoading(false));

    }

    useEffect(() => {
        if (messagePost) {
            editor.blocksToFullHTML(editor.document)
                .then(r => setMessageHTML(r));
        }
    }, []);

    return (
        <>
            <CardBody className={`max-h-[800px] ${user.role === 'staff' ? 'min-h-[520px]' : ''}`}>
                {user.role === 'staff' ? (
                    <>
                        <div className="inline-flex items-center gap-3 px-2">
                            <h5 className="font-bold text-default-900">Controls:</h5>
                            <div className="flex flex-row gap-1">
                                <div className="p-1 bg-default-100 rounded-lg">
                                    <AddRounded width={18} height={18} />
                                </div>
                                <div className="p-1 bg-default-100 rounded-lg">
                                    <DotsFill width={18} height={18} />
                                </div>
                                <div className="p-1 bg-default-100 rounded-lg">
                                    <Slash width={18} height={18} />
                                </div>
                            </div>
                        </div>
                        <Divider className="my-3" />
                        <BlockNoteView theme={theme === 'light' ? 'light' : 'dark'}
                                       editor={editor}
                                       emojiPicker={false}
                                       filePanel={false}
                        />
                    </>
                ) : (
                    <Suspense fallback={<Spinner size="lg" />}>
                        {messageHTML ? (
                            <div className="px-[54px]">
                                <p className="text-default-500 mb-3">
                                    Posted on {format(new Date(messagePost!.created_at || ''), 'MMMM d, yyyy h:mm a')}
                                </p>
                                <div dangerouslySetInnerHTML={{__html: messageHTML || ''}} />
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <Empty className="w-12 h-12 text-default-400 mx-auto mb-3" />
                                <p className="text-default-500">
                                    No message has been posted
                                </p>
                            </div>
                        )}
                    </Suspense>
                )}
            </CardBody>
            {user.role === 'staff' && (
                <>
                    <Divider />
                    <CardFooter className="justify-end">
                        <Button variant="flat" color="primary" onPress={handlePostMessage} isLoading={loading}>
                            Post Message
                        </Button>
                    </CardFooter>
                </>
            )}
        </>
    )
}

export default AdditionalMessage;
