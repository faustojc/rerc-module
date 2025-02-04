import React from 'react';
import { Card, CardBody } from "@nextui-org/react";

interface StatsCardProps {
    title: string;
    value: number;
    color: "primary" | "secondary" | "default" | "warning";
    icon: React.ReactNode;
    description?: string;
    trend?: {
        value: number;
        isPositive: boolean;
    };
}

const StatsCard: React.FC<StatsCardProps> = ({
    title,
    value,
    color,
    icon,
    description,
    trend,
}) => (
    <Card>
        <CardBody className="p-6">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-default-500">{title}</p>
                    <h3 className="text-2xl font-bold mt-1">{value}</h3>
                    {description && (
                        <p className="text-sm text-default-600 mt-1">{description}</p>
                    )}
                    {trend && (
                        <div className={`flex items-center mt-2 text-sm ${
                            trend.isPositive ? 'text-success-600' : 'text-danger-600'
                        }`}>
                            {trend.isPositive ? '↑' : '↓'} {trend.value}%
                        </div>
                    )}
                </div>
                <div className={`p-3 bg-${color}-100 rounded-lg`}>
                    {icon}
                </div>
            </div>
        </CardBody>
    </Card>
);

export default StatsCard;
