import { Button, Card, CardBody, CardFooter, CardHeader, Divider, Link, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import React from "react";
import { ApplicationFormProps } from "@/types";
import NavStatus from "@/Components/NavStatus";
import { CloudArrowDown } from "@/Components/Icons";
import Feedbacks from "@/Components/Application/Feedbacks";

const InitialReview = ({user, application, status, setStatuses}: ApplicationFormProps) => {
    const documentHeaders = [
        {key: 1, label: 'FILE'},
        {key: 2, label: 'DATE UPLOADED'},
        {key: 3, label: 'ACTION'},
    ]

    const requirementsHeaders = [
        {key: 1, label: 'FILE'},
        {key: 2, label: 'REQUIREMENT'},
        {key: 3, label: 'DATE UPLOADED'},
        {key: 4, label: 'ACTION'},
    ]

    const [currTab, setCurrTab] = React.useState('files');
    const [loading, setLoading] = React.useState(false);

    const handleApprove = () => {
        setLoading(true);

        window.axios.patch(route('applications.statuses.update', {application: application, status: status}), {
            new_status: 'Done',
            is_completed: true,
            next_status: 'Review Type',
            message: `${application.research_title} initial review has been approved`
        }).then((response) => {
            setStatuses((prev) => {
                const statuses = [...prev];

                statuses[2] = response.data.status;
                statuses.push(response.data.next_status);

                return statuses;
            });
        }).finally(() => setLoading(false));
    }

    return (
        <Card className="sticky self-start top-0">
            <CardHeader className="flex-col items-start bg-success-300">
                <h3 className="text-xl font-semibold text-start">Initial Review</h3>
                <p className="text-sm">
                    List of the uploaded documents bellow for initial review.
                </p>
            </CardHeader>
            <NavStatus currTab={currTab} setCurrTab={setCurrTab} tabs={[
                {name: 'files', label: 'Files'},
                {name: 'feedbacks', label: 'Feedbacks'}
            ]} />
            {currTab === 'files' ? (
                <>
                    <CardBody className="w-full">
                        <h3 className="mb-4">Research Documents</h3>
                        <Table
                            removeWrapper
                            fullWidth
                            aria-label="Research Documents"
                            classNames={{
                                base: 'overflow-x-auto'
                            }}
                        >
                            <TableHeader columns={documentHeaders}>
                                {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                            </TableHeader>
                            <TableBody items={application.documents}>
                                {(document) => (
                                    <TableRow key={document.id}>
                                        <TableCell className="text-nowrap">
                                            {document.file_url.split('\\').pop()?.split('/').pop()}
                                        </TableCell>
                                        <TableCell className="text-nowrap">
                                            {new Date(document.created_at!).toLocaleDateString('en-US', {
                                                month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                            })}
                                        </TableCell>
                                        <TableCell>
                                            <Link isBlock
                                                  color="primary"
                                                  href={route('applications.documents.download', {document: document})}
                                                  className="p-2"
                                            >
                                                <CloudArrowDown />
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                        <Divider className="my-4" />
                        <h3 className="mb-4">Uploaded Requirements</h3>
                        <Table removeWrapper
                               fullWidth
                               aria-label="Research Requirements"
                               classNames={{
                                   base: 'overflow-x-auto'
                               }}
                        >
                            <TableHeader columns={requirementsHeaders}>
                                {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                            </TableHeader>
                            <TableBody items={application.requirements}>
                                {(requirement) => (
                                    <TableRow key={requirement.id}>
                                        <TableCell className="text-nowrap">
                                            {requirement.file_url.split('\\').pop()?.split('/').pop()}
                                        </TableCell>
                                        <TableCell className="text-nowrap">
                                            {requirement.name}
                                        </TableCell>
                                        <TableCell className="text-nowrap">
                                            {new Date(requirement.date_uploaded).toLocaleDateString('en-US', {
                                                month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                            })}
                                        </TableCell>
                                        <TableCell>
                                            <Link isBlock
                                                  color="primary"
                                                  href={route('applications.requirements.download', {application: application, requirement: requirement})}
                                                  className="p-2"
                                            >
                                                <CloudArrowDown />
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardBody>
                    {(user.role === 'chairperson' && !status.end) && (
                        <>
                            <Divider />
                            <CardFooter className="justify-end">
                                <Button color="secondary" variant="shadow" isLoading={loading} onPress={() => handleApprove()}>
                                    Approve
                                </Button>
                            </CardFooter>
                        </>
                    )}
                </>
            ) : (
                <Feedbacks user={user} status={status} setStatuses={setStatuses} />
            )}
        </Card>
    )
}

export default InitialReview;
