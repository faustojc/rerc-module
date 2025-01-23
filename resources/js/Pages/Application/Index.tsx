import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Application, PageProps, PaginationProps } from "@/types";
import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Chip,
    cn,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Input,
    Pagination,
    Spinner,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
} from "@nextui-org/react";
import { MdiDeleteForever, MdiDotsVertical, MdiFileDocumentArrowRight, MdiSearch } from "@/Components/Icons";
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "@inertiajs/react";
import { toast } from "react-toastify";

export interface ApplicationIndexProps extends PageProps {
    applications: PaginationProps<Application>,
    canCreate: boolean,
    canDelete: boolean,
}

const Index = (props: PageProps<ApplicationIndexProps>) => {
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState<PaginationProps<Application>>(props.applications);

    const pages = Math.ceil(pagination.total / pagination.per_page);

    const items = useMemo(() => {
        return pagination.data.map((application) => {
            application.date_applied = new Date(application.date_applied!).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric'
            });

            return application;
        });
    }, [pages, pagination]);

    const columns = [
        { key: 'research_title', label: 'RESEARCH TITLE' },
        { key: 'date_applied', label: 'DATE APPLIED' },
        { key: 'protocol_code', label: 'PROTOCOL CODE' },
        { key: 'actions', label: 'ACTIONS' },
    ];

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

        if (props.canDelete) {
            items.push({
                key: 'delete',
                label: 'Delete',
                className: 'text-danger',
                icon: <MdiDeleteForever className={cn("text-danger")} />,
                onPress: () => handleDelete(application),
            });
        }

        return items;
    }, [props.canDelete]);

    const handleSetPage = (page: number) => {
        setLoading(true);
        setPage(page);

        axios.get(route('applications.index', {page: page}))
              .then((response) => {
                 setPagination(response.data.applications);
            }).finally(() => setLoading(false));
    }

    const handleDelete = (application: Application) => {
        setLoading(true);

        // Perform delete operation
        axios.delete(route('applications.destroy', {application: application, page: page}))
              .then((response) => {
                  setPagination(response.data.applications);
                  toast.success(response.data.message ?? 'Application deleted.');
        }).finally(() => setLoading(false));
    }

    if (props.auth.user.role !== 'researcher') {
        useEffect(() => {
            window.Echo.channel('application-list').listen('.ApplicationCreated', (event: any) => {
                setPagination((prev) => {
                    const updatedData = [event.application, ...prev.data];

                    if (prev.last_page === 1 && (updatedData.length > prev.per_page)) {
                        return {
                            ...prev,
                            data: updatedData.slice(0, prev.per_page),
                            total: prev.total + 1,
                            last_page: prev.last_page + 1,
                            next_page_url: `${prev.path}?page=2`,
                        };
                    }

                    if (updatedData.length > prev.per_page) {
                        updatedData.pop();
                    }

                    // check if the total number of items is divisible by the per_page value
                    // if not, increment the total value by 1 and add items to links
                    if (prev.total % prev.per_page !== 0) {
                        prev.links.push({
                            url: `${prev.path}?page=${prev.last_page + 1}`,
                            label: `${prev.last_page + 1}`,
                            active: false,
                        });
                    }

                    return {
                        ...prev,
                        data: updatedData,
                        total: prev.total + 1,
                    };
                });
                toast.info(`${event.application.research_title} has been created`);
            });

            return () => {
                window.Echo.leaveChannel('applications');
            }
        }, []);
    }

    return (
        <Authenticated header={"List of Applications"}>
            <div className="py-3 mx-auto">
                <Card>
                    {items.length > 0 && (
                        <CardHeader className="flex flex-col items-start gap-5">
                            <div className="flex justify-between items-center w-full">
                                <h3 className="text-2xl font-semibold text-start">Applications</h3>
                                {props.canCreate && (
                                    <Button color="primary" variant="flat" href={route('applications.create')} as={Link}>
                                        Create Application
                                    </Button>
                                )}
                            </div>
                            <Input placeholder="Search applications"
                                   startContent={<MdiSearch />}
                                   className="max-w-md disabled:pointer-events-auto"
                                   variant="flat"
                            />
                        </CardHeader>
                    )}
                    <CardBody>
                        {items.length === 0 ? (
                            <div className="flex flex-col items-center p-4 gap-5">
                                <h3 className="font-medium text-center">
                                    {props.auth.user.role === 'researcher' ? "You have no applications yet." : "No applications found."}
                                </h3>
                                {props.canCreate && (
                                    <Button color="primary" variant="flat" href={route('applications.create')} as={Link}>
                                        Create Application
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <Table removeWrapper aria-label="Example static collection table" selectionMode="single">
                                <TableHeader columns={columns}>
                                    {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                                </TableHeader>
                                <TableBody items={items}
                                           loadingContent={<Spinner />}
                                           loadingState={loading ? 'loading' : 'idle'}
                                >
                                    {(application) => (
                                        <TableRow key={application.id}
                                                  href={route('applications.show', {application: application})}
                                                  as={Link}
                                        >
                                            <TableCell>{application.research_title}</TableCell>
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
                        )}
                    </CardBody>
                    {items.length > 0 && (
                        <CardFooter className="flex justify-between items-center">
                            <div className="flex justify-end">
                                <span className="text-sm text-gray-500">Showing {pagination.data.length} of {pagination.total} entries</span>
                            </div>
                            <Pagination total={pages}
                                        initialPage={pagination.current_page}
                                        page={page}
                                        onChange={handleSetPage}
                                        showControls
                                        isCompact
                            />
                        </CardFooter>
                    )}
                </Card>
            </div>
        </Authenticated>
    );
}

export default Index;
