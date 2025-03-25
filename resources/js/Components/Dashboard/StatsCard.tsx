import React from 'react';
import { Card, CardBody } from "@nextui-org/react";
import { motion } from 'framer-motion';
import { IconArrowRight } from "@/Components/Icons";

interface StatsCardProps {
    title: string;
    value: number;
    color?: "primary" | "secondary" | "default" | "warning";
    icon: React.ReactNode;
    description?: string;
    as?: React.ElementType;
    href?: string;
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
    as,
    href,
    description,
    trend,
}) => {
    const [isHovered, setIsHovered] = React.useState<boolean>(false);

    const isPressable = href != undefined && value != 0;

    return (
        <Card
            isPressable={isPressable}
            className={isPressable ? 'border-2 border-secondary-200 hover:border-primary-500' : ''}
            as={isPressable ? as : 'div'}
            href={href}
            onMouseEnter={() => {
                if (isPressable) setIsHovered(true)
            }}
            onMouseLeave={() => {
                if (isPressable) setIsHovered(false)
            }}
        >
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
                    <div className={`p-3 bg-${color ?? 'primary'}-100 rounded-lg`}>
                        {isPressable ? (
                            <>
                                <motion.div
                                    initial={{ x: 0, opacity: 1 }}
                                    animate={isHovered ? { x: -20, opacity: 0 } : { x: 0, opacity: 1 }}
                                >
                                    {!isHovered && icon}
                                </motion.div>

                                {isHovered && (
                                    <motion.div
                                        initial={{ x: 20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <IconArrowRight />
                                    </motion.div>
                                )}
                            </>
                        ) : icon}
                    </div>
                </div>
            </CardBody>
        </Card>
    );
};

export default StatsCard;
