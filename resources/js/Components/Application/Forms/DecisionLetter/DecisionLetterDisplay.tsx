import { DecisionLetter } from "@/types";
import React from "react";
import { parseAbsolute } from "@internationalized/date";
import { Button, Chip, Link } from "@nextui-org/react";
import { CloudArrowDown } from "@/Components/Icons";

export const DecisionLetterDisplay: React.FC<{decisionLetter: DecisionLetter}> = ({decisionLetter}) => {

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
                <div className="flex flex-col gap-2 sm:flex-row sm:justify-between items-start sm:gap-3">
                    <div className="flex items-center gap-2">
                        <h4 className="font-medium">{decisionLetter.file_name}</h4>
                        {decisionLetter.is_signed && (
                            <Chip color="success" variant="flat" size="sm">Signed</Chip>
                        )}
                    </div>
                    <Button
                        as={Link}
                        href={route('decision-letter.download', {decision_letter: decisionLetter})}
                        color="primary"
                        variant="flat"
                        startContent={<CloudArrowDown className="w-4 h-4" />}
                    >
                        Download
                    </Button>
                </div>
                <p className="text-sm text-default-600">
                    Uploaded on {formatDate(decisionLetter.date_uploaded)}
                </p>
            </div>
        </div>
    );
};
