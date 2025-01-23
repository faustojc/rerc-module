import { ApplicationFormProps } from "@/types";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import React from "react";

const PanelMeeting = ({user, application, status, setApplication, setStatuses}: ApplicationFormProps) => {
    const hasPayment = application.proof_of_payment_url != null;
    

    return (
        <Card className="sticky self-start top-0">
            <CardHeader className="flex-col items-start bg-success-300">
                <h3 className="text-xl font-semibold text-start">Panel and Meeting Schedule</h3>
                <p className="text-sm">
                    {user.role !== "staff"
                        ? "List of panel members and schedule of the meeting."
                        : "Assign panel members and schedule the meeting."
                    }
                </p>
            </CardHeader>
            <CardBody>
                {hasPayment ? (
                    <>
                    </>
                ) : (
                    <p className="text-center text-medium p-5">
                        {user.role == 'researcher'
                            ? "Please upload the proof of payment first."
                            : "Please wait for the researchers to upload their proof of payment receipt before assigning panel members and scheduling the meeting."
                        }
                    </p>
                )}
            </CardBody> </Card>
    );
}

export default PanelMeeting;
