import React from "react";
import { Chip } from "@nextui-org/react";

interface StatusBadgeProps {
    type: string | null;
    code: string | null;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ type, code }) => {
    const getReviewTypeColor = (type: string | null) => {
        switch (type?.toUpperCase()) {
            case 'EXEMPTED':
                return 'success';
            case 'EXPEDITED':
                return 'primary';
            case 'FULL BOARD':
                return 'warning';
            default:
                return 'default';
        }
    };

    return (
        <div className="flex items-center space-x-2">
            {type && (
                <Chip color={getReviewTypeColor(type)} variant="flat" size="sm">
                    {type.toUpperCase()}
                </Chip>
            )}
            {code && (
                <Chip color="secondary" variant="flat" size="sm">
                    {code.toUpperCase()}
                </Chip>
            )}
        </div>
    );
};
