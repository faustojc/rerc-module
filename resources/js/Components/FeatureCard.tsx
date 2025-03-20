import React, { ReactNode } from "react";
import { Card, CardBody } from "@nextui-org/react";

interface FeatureCardProps {
    title: string;
    description: string;
    icon: ReactNode;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon }) => {
    return (
        <Card className="p-4">
            <CardBody className="gap-3">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary-100">
                    {icon}
                </div>
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="text-default-500">{description}</p>
            </CardBody>
        </Card>
    );
};
