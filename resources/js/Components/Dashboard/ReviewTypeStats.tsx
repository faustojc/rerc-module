import React from 'react';
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import { Link } from '@inertiajs/react';

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
                    color: 'success',
                };
            case 'expedited':
                return {
                    label: 'Expedited',
                    description: '21 weekdays processing time',
                    color: 'primary',
                };
            case 'fullBoard':
                return {
                    label: 'Full Board',
                    description: '15-21 weekdays processing time',
                    color: 'warning',
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
                        const isPressable = count > 0;
                        
                        const fixType = type === 'fullBoard' ? 'full board' : type;

                        return (
                            <Card
                                key={type}
                                className={`p-4 rounded-lg shadow-none
                                bg-${info.color}-100 text-${info.color}-800
                                ${!isPressable ? 'cursor-default' : `border-2 hover:border-${info.color}`}`}
                                isPressable={isPressable}
                                as={isPressable ? Link : 'div'}
                                // @ts-ignore
                                href={`${route('applications.index')}?reviewType=${fixType}`}
                                fullWidth
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-medium text-start">
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
                                <div className="mt-2 w-full bg-white/50 rounded-full h-2">
                                    <div
                                        className="h-2 rounded-full bg-current opacity-50"
                                        style={{
                                            width: `${(count / Object.values(data).reduce((a, b) => a + b, 0)) * 100}%`
                                        }}
                                    />
                                </div>
                            </Card>
                        );
                    })}
                </div>
            </CardBody>
        </Card>
    );
};

export default ReviewTypeStats;
