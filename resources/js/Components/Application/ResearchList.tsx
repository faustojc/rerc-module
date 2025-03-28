import React, { ReactNode, useCallback, useMemo } from "react";
import { Application, PaginationProps } from "@/types";
import {
    Button,
    Chip,
    cn,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Pagination,
    Spinner,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
} from "@nextui-org/react";
import { statusColor } from "@/types/helpers";
import { MdiDeleteForever, MdiDotsVertical, MdiFileDocumentArrowRight } from "@/Components/Icons";
import { Link } from "@inertiajs/react";

interface ResearchListProps {
    pagination: PaginationProps<Application>;
    tableRef: React.RefObject<HTMLTableElement>;
    handleDelete: (application: Application) => void;
    handleSetPage: (page: number) => void;
    loading: boolean;
    canDelete: boolean;
}

const ResearchList: React.FC<ResearchListProps> = ({pagination, tableRef, handleDelete, handleSetPage, loading, canDelete}) => {
    const pages = useMemo(() => Math.ceil(pagination.total / pagination.per_page), [pagination.total, pagination.per_page]);

    const items = useMemo(() => {
        return pagination.data.map((application) => {
            application.date_applied = new Date(application.date_applied!).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric'
            });

            return application;
        });
    }, [pages, pagination]);

    const changePage = (page: number) => {
        if (page < 1 || page > pages) return;

        handleSetPage(page);
    }

    const dropdownItems: (application: Application) => {
        key: string;
        label: string;
        className: string;
        content?: ReactNode;
        icon?: ReactNode;
        onPress?: () => void;
    }[] = useCallback((application: Application) => {
        const items = [];

        items.push({
            key: 'view',
            label: 'View',
            className: 'p-0',
            content: (
                <Link href={route('applications.show', {application: application})}
                      className="w-full flex items-center gap-2 px-2 py-1.5 text-default-900"
                >
                    <MdiFileDocumentArrowRight />
                    View
                </Link>
            ),
        });

        if (canDelete) {
            items.push({
                key: 'delete',
                label: 'Delete',
                className: 'text-danger',
                icon: <MdiDeleteForever className={cn("text-danger")} />,
                onPress: () => handleDelete(application),
            });
        }

        return items;
    }, [canDelete]);

    return (
        <>
            <Table removeWrapper aria-label="Example static collection table" ref={tableRef}>
                <TableHeader columns={[
                    { key: 'research_title', label: 'RESEARCH TITLE' },
                    { key: 'main_researcher', label: 'RESEARCHER' },
                    { key: 'current_status', label: 'STATUS' },
                    { key: 'date_applied', label: 'DATE APPLIED' },
                    { key: 'protocol_code', label: 'PROTOCOL CODE' },
                    { key: 'actions', label: '' },
                ]}>
                    {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                </TableHeader>
                <TableBody items={items}
                           loadingContent={<Spinner />}
                           loadingState={loading ? 'loading' : 'idle'}
                           emptyContent={"No applications found."}
                >
                    {(application) => (
                        <TableRow key={application.id}>
                            <TableCell>{application.research_title}</TableCell>
                            <TableCell>
                                {`${application.firstname} ${application.lastname}`}
                                <p className="text-sm text-default-500">
                                    {application.members_count} member{application.members_count > 1 ? 's' : ''}
                                </p>
                            </TableCell>
                            <TableCell className="flex flex-col">
                                <p className="font-semibold">
                                    Step {application.statuses[0].sequence}: {application.statuses[0].name}
                                </p>
                                <Chip variant="dot" size="sm" color={statusColor(application.statuses[0].status)} className="border-none">
                                    {application.statuses[0].status}
                                </Chip>
                            </TableCell>
                            <TableCell>{application.date_applied}</TableCell>
                            <TableCell>
                                <Chip variant="flat" color={application.protocol_code ? 'primary' : 'default'}>
                                    {application.protocol_code ?? "N/A"}
                                </Chip>
                            </TableCell>
                            <TableCell>
                                <div className="relative flex justify-end items-center gap-2">
                                    <Dropdown className="bg-background border-1 border-default-200">
                                        <DropdownTrigger>
                                            <Button isIconOnly radius="full" size="sm" variant="light">
                                                <MdiDotsVertical className="text-default-400" />
                                            </Button>
                                        </DropdownTrigger>
                                        <DropdownMenu items={dropdownItems(application)}>
                                            {item => (
                                                <DropdownItem key={item.key}
                                                              className={cn(item.className)}
                                                              startContent={item.icon}
                                                              onPress={item.onPress}
                                                              isDisabled={loading}
                                                >
                                                    {item.content ?? item.label}
                                                </DropdownItem>
                                            )}
                                        </DropdownMenu>
                                    </Dropdown>
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            {items.length > 0 && (
                <div className="flex justify-between items-center">
                    <div className="flex justify-end">
                        <span className="text-sm text-gray-500">Showing {pagination.data.length} of {pagination.total} entries</span>
                    </div>
                    <Pagination total={pages}
                                initialPage={pagination.current_page}
                                page={pagination.current_page}
                                onChange={changePage}
                                isDisabled={loading}
                                showControls
                                isCompact
                    />
                </div>
            )}
        </>
    );
}

export default ResearchList;
