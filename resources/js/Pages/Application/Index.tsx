import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Application, ApplicationFilters, PageProps, PaginationProps } from "@/types";
import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Chip,
    cn,
    DateRangePicker,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Input,
    Pagination,
    Select,
    SelectItem,
    Spinner,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
} from "@nextui-org/react";
import { ArrowsSwitch, MdiDeleteForever, MdiDotsVertical, MdiFileDocumentArrowRight, MdiSearch } from "@/Components/Icons";
import React, { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Head, Link } from "@inertiajs/react";
import { useDateFormatter } from "@react-aria/i18n";
import { toast } from "react-toastify";
import { getLocalTimeZone, parseDate } from "@internationalized/date";
import { statusColor } from "@/types/helpers";
import { REVIEW_TYPES, STEPS } from "@/types/constants";

export interface ApplicationIndexProps extends PageProps {
    applications: PaginationProps<Application>,
    canCreate: boolean,
    canDelete: boolean,
}

const Index = (props: ApplicationIndexProps) => {
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState<PaginationProps<Application>>(props.applications);

    const formatter = useDateFormatter({dateStyle: "long"});
    const pages = Math.ceil(pagination.total / pagination.per_page);

    const items = useMemo(() => {
        return pagination.data.map((application) => {
            application.date_applied = new Date(application.date_applied!).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric'
            });

            return application;
        });
    }, [pages, pagination]);

    const changeDateStringFormat = (date: string) => {
        const dates = date.split('/');

        return `${dates[2]}-${dates[0]}-${dates[1]}`;
    }

    const initialFilters: ApplicationFilters = useMemo(() => {
        console.log(pagination);

        const searchParams = new URLSearchParams(window.location.search);

        let page = searchParams.get('page');
        if (page != null && (props.applications.data.length <= 10 && parseInt(page) > 1)) {
            page = '1';

            searchParams.set('page', page);
            window.history.pushState({}, '', `${window.location.pathname}?${searchParams.toString()}`);
        }

        const startDate = searchParams.get('dateRange[start]');
        const endDate = searchParams.get('dateRange[end]');

        const dateRange = startDate && endDate ? {
            start: parseDate(changeDateStringFormat(startDate)),
            end: parseDate(changeDateStringFormat(endDate)),
        } : undefined;

        return {
            query: searchParams.get('query') || '',
            reviewType: searchParams.get('reviewType') || '',
            step: searchParams.get('step') ? parseInt(searchParams.get('step')!) : undefined,
            dateRange: dateRange,
            status: searchParams.get('status') || '',
        };
    }, []);

    const [filters, setFilters] = useState<ApplicationFilters>(initialFilters);

    const handleSearchApplications = (filters: ApplicationFilters, pageNumber: number) => {
        setLoading(true);

        const params = new URLSearchParams();
        const page = (pagination.data.length <= 10 && pageNumber > 1) ? 1 : pageNumber;

        params.set('page', page.toString());
        if (filters.query) params.set('query', filters.query.trim());
        if (filters.reviewType) params.set('reviewType', filters.reviewType);
        if (filters.step) params.set('step', filters.step.toString());
        if (filters.status) params.set('status', filters.status);
        if (filters.dateRange) {
            params.set('dateRange[start]', filters.dateRange.start.toDate(getLocalTimeZone()).toLocaleDateString("default", {year: 'numeric', month: '2-digit', day: '2-digit'}));
            params.set('dateRange[end]', filters.dateRange.end.toDate(getLocalTimeZone()).toLocaleDateString("default", {year: 'numeric', month: '2-digit', day: '2-digit'}));
        }

        window.history.pushState({}, '', `${window.location.pathname}?${params.toString()}`);

        const data = {
            ...filters,
            page: pageNumber,
            dateRange: filters.dateRange ? {
                start: filters.dateRange.start.toDate(getLocalTimeZone()).toISOString(),
                end: filters.dateRange.end.toDate(getLocalTimeZone()).toISOString(),
            } : undefined,
        };

        window.axios.get(
            route('applications.index', data),
            {headers: {'X-Requested-With': 'XMLHttpRequest'}}
        ).then(response => {
            setPage(response.data.applications.current_page);
            setPagination(response.data.applications);
        }).catch((error) => {
            console.error(error.message ?? 'An error occurred while searching applications.');
        }).finally(() => setLoading(false));
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
        setPage(page);
        handleSearchApplications(filters, page);
    }

    const handleResetFilters = () => {
        setFilters({
            query: '',
            reviewType: '',
            step: undefined,
            dateRange: undefined,
            status: '',
        });
    };

    const handleDelete = (application: Application) => {
        setLoading(true);

        // Perform delete operation
        axios.delete(route('applications.destroy', {application: application, page: page}))
              .then((response) => {
                  setPagination(response.data.applications);
                  toast.success(response.data.message ?? 'Application deleted.');
        }).finally(() => setLoading(false));
    }

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

    return (
        <Authenticated header={"List of Applications"}>
            <Head title="Applications" />

            <div className="py-3 mx-auto">
                <Card>
                    <CardHeader className="flex flex-col items-start gap-5">
                        <div className="flex justify-between items-center w-full">
                            <h3 className="text-2xl font-semibold text-start">Applications</h3>
                            {props.canCreate && (
                                <Button color="primary" variant="flat" href={route('applications.create')} as={Link}>
                                    Create Application
                                </Button>
                            )}
                        </div>
                        <Input placeholder="Search by research title or researcher..."
                               endContent={(
                                   <Button onPress={() => handleSearchApplications(filters, 1)}
                                           variant="light"
                                           color="primary"
                                           isIconOnly
                                   >
                                       <MdiSearch />
                                   </Button>
                               )}
                               className="max-w-md disabled:pointer-events-auto"
                               variant="flat"
                               value={filters.query}
                               onChange={(e) => setFilters(prev => ({...prev, query: e.target.value}))}
                               onKeyDown={(e) =>
                                   e.key === 'Enter'
                                   && filters.query
                                   && handleSearchApplications(filters, 1)
                               }
                        />
                        <div className="flex flex-wrap gap-4 w-full">
                            <Select
                                className="w-full sm:w-48"
                                placeholder="Review Type"
                                value={filters.reviewType}
                                onChange={(e) => {
                                    const value = e.target.value;

                                    setFilters(prev => ({ ...prev, reviewType: value }));
                                    handleSearchApplications({ ...filters, reviewType: value }, page);
                                }}
                                size="sm"
                            >
                                {REVIEW_TYPES.map((type) => (
                                    <SelectItem key={type.value} value={type.value}>
                                        {type.label}
                                    </SelectItem>
                                ))}
                            </Select>

                            <Select
                                className="w-full sm:w-48"
                                placeholder="Up to Step"
                                size="sm"
                                value={filters.step?.toString() || ''}
                                onChange={(e) => {
                                    const value = e.target.value;

                                    setFilters(prev => ({ ...prev, step: value ? parseInt(value) : undefined }));
                                    handleSearchApplications({ ...filters, step: value ? parseInt(value) : undefined }, 1);
                                }}
                            >
                                {STEPS.map((step) => (
                                    <SelectItem key={step.sequence} value={step.sequence.toString()}>
                                        {step.name}
                                    </SelectItem>
                                ))}
                            </Select>

                            <Select
                                className="w-full sm:w-40"
                                placeholder="Status"
                                value={filters.status}
                                onChange={(e) => {
                                    const value = e.target.value;

                                    setFilters(prev => ({ ...prev, status: value }));
                                    handleSearchApplications({ ...filters, status: value }, page);
                                }}
                                size="sm"
                            >
                                <SelectItem key="" value="">All Status</SelectItem>
                                <SelectItem key="pending" value="Pending">Pending</SelectItem>
                                <SelectItem key="in_progress" value="In Progress">In Progress</SelectItem>
                                <SelectItem key="completed" value="Completed">Completed</SelectItem>
                            </Select>

                            <DateRangePicker
                                showMonthAndYearPickers
                                className="w-auto"
                                size="sm"
                                variant="flat"
                                visibleMonths={2}
                                value={filters.dateRange}
                                onChange={(value) => {
                                    setFilters(prev => ({ ...prev, dateRange: value }));
                                    handleSearchApplications({ ...filters, dateRange: value }, page);
                                }}
                                startContent={(
                                    <Button
                                        isIconOnly
                                        variant="light"
                                        color="primary"
                                        size="sm"
                                        onPress={() => {
                                            if (!filters.dateRange) return;

                                            setFilters(prev => ({ ...prev, dateRange: undefined }));
                                            handleSearchApplications({ ...filters, dateRange: undefined }, page);
                                        }}
                                    >
                                        <ArrowsSwitch />
                                    </Button>
                                )}
                            />
                        </div>

                    </CardHeader>
                    <CardBody>
                        <Table removeWrapper aria-label="Example static collection table">
                            <TableHeader columns={[
                                { key: 'research_title', label: 'RESEARCH TITLE' },
                                { key: 'main_researcher', label: 'RESEARCHER' },
                                { key: 'current_status', label: 'STATUS' },
                                { key: 'date_applied', label: 'DATE APPLIED' },
                                { key: 'protocol_code', label: 'PROTOCOL CODE' },
                                { key: 'actions', label: 'ACTIONS' },
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
                                        <TableCell>{`${application.firstname} ${application.lastname}`}</TableCell>
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
                                        isDisabled={loading}
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
