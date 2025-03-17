import { Button, Card, CardBody, Link } from "@nextui-org/react";
import React from "react";
import { AddRounded, DocumentAdd } from "@/Components/Icons";

const EmptyCard: React.FC<{ canCreate: boolean }> = ({canCreate}) => {
    return (
        <Card className="w-full max-w-md mx-auto">
            <CardBody className="flex flex-col items-center gap-4 py-12 px-8 text-center">
                <div className="rounded-full bg-default-100 p-7">
                    <DocumentAdd className="w-8 h-8 text-default-500" />
                </div>
                <div className="flex flex-col gap-1">
                    <h3 className="text-xl font-medium">No Research Applications Yet</h3>
                    <p className="text-default-500">
                        {canCreate ? 'Get started by creating your first application.' : 'The researchers has not created any applications yet.'}
                    </p>
                </div>
                {canCreate && (
                    <Button
                        color="primary"
                        startContent={<AddRounded />}
                        className="mt-2"
                        as={Link}
                        href={route('applications.create')}
                    >
                        Create an application
                    </Button>
                )}
            </CardBody>
        </Card>
    )
}

export default EmptyCard;
