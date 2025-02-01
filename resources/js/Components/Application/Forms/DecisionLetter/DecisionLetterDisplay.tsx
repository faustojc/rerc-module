import { DecisionLetter } from "@/types";
import React, { useState } from "react";
import { parseAbsolute } from "@internationalized/date";
import { Button, Chip, Link } from "@nextui-org/react";
import { CloudArrowDown, MdiDeleteForever } from "@/Components/Icons";

interface DecisionLetterDisplayProps {
    decisionLetter: DecisionLetter;
    canDelete: boolean;
    onDelete?: () => Promise<void>;
}

export const DecisionLetterDisplay: React.FC<DecisionLetterDisplayProps> = ({
    decisionLetter,
    canDelete,
    onDelete,
}) => {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        setLoading(true);

        await onDelete!();

        setLoading(false);
    }

    const formatDate = (dateString: string) => {
        const date = parseAbsolute(dateString, 'UTC').toDate();
        return new Intl.DateTimeFormat(undefined, {
            dateStyle: 'long',
            timeStyle: 'short',
        }).format(date);
    };

    return (
        <div className="bg-default-100 p-4 rounded-lg">
            <div className="flex flex-col sm:gap-0 gap-5">
                <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:gap-0">
                    <div className="flex items-center gap-2">
                        <h4 className="font-medium">{decisionLetter.file_name}</h4>
                        {decisionLetter.is_signed && (
                            <Chip color="success" size="sm">Signed</Chip>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <Button
                            as={Link}
                            href={route('decision-letter.download', {decision_letter: decisionLetter})}
                            color="primary"
                            variant="flat"
                            startContent={<CloudArrowDown className="w-4 h-4" />}
                            isDisabled={loading}
                        >
                            Download
                        </Button>
                        {canDelete && onDelete && (
                            <Button
                                color="danger"
                                variant="flat"
                                startContent={<MdiDeleteForever className="w-4 h-4" />}
                                isLoading={loading}
                                onPress={handleDelete}
                            >
                                Delete
                            </Button>
                        )}
                    </div>
                </div>
                <p className="text-sm text-default-600">
                    Uploaded on {formatDate(decisionLetter.date_uploaded)}
                </p>
            </div>
        </div>
    );
};
