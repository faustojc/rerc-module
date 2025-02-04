import React from 'react';
import { Card, CardBody, CardHeader } from "@nextui-org/react";

interface ReviewTypeStatsProps {
    data: {
        exempted: number;
        expedited: number;
        fullBoard: number;
    };
}

const ReviewTypeStats: React.FC<ReviewTypeStatsProps> = ({ data }) => {
    const getReviewTypeInfo = (type: string) => {
        switch (type) {
            case 'exempted':
                return {
                    label: 'Exempted',
                    description: '14 weekdays processing time',
                    color: 'bg-green-100 text-green-800',
                };
            case 'expedited':
                return {
                    label: 'Expedited',
                    description: '21 weekdays processing time',
                    color: 'bg-blue-100 text-blue-800',
                };
            case 'fullBoard':
                return {
                    label: 'Full Board',
                    description: '15-21 weekdays processing time',
                    color: 'bg-orange-100 text-orange-800',
                };
            default:
                return {
                    label: '',
                    description: '',
                    color: '',
                };
        }
    };

    return (
        <Card>
            <CardHeader className="px-6">
                <h3 className="text-lg font-semibold">Applications by Review Type</h3>
            </CardHeader>
            <CardBody className="px-6">
                <div className="space-y-4">
                    {Object.entries(data).map(([type, count]) => {
                        const info = getReviewTypeInfo(type);
                        return (
                            <div
                                key={type}
                                className={`p-4 rounded-lg ${info.color}`}
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-medium">
                                            {info.label}
                                        </h4>
                                        <p className="text-sm mt-1">
                                            {info.description}
                                        </p>
                                    </div>
                                    <div className="text-2xl font-bold">
                                        {count}
                                    </div>
                                </div>
                                {/* Optional: Add a progress bar */}
                                <div className="mt-2 w-full bg-white/50 rounded-full h-2">
                                    <div
                                        className="h-2 rounded-full bg-current opacity-50"
                                        style={{
                                            width: `${(count / Object.values(data).reduce((a, b) => a + b, 0)) * 100}%`
                                        }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardBody>
        </Card>
    );
};

export default ReviewTypeStats;
