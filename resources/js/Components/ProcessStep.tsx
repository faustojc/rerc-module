import React from "react";
import { Card, CardBody } from "@nextui-org/react";

interface ProcessStepProps {
    number: number;
    title: string;
    description: string;
}

export const ProcessStep: React.FC<ProcessStepProps> = ({ number, title, description }) => {
    return (
        <Card className="p-4">
            <CardBody className="gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-500 text-white font-bold">
                    {number}
                </div>
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="text-default-500">{description}</p>
            </CardBody>
        </Card>
    );
};
