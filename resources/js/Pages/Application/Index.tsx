import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Application, PageProps, PaginationProps } from "@/types";
import { Button, Card, CardBody, CardHeader, DateRangePicker, Input, Select, SelectItem } from "@nextui-org/react";
import { ClearRound, MdiSearch } from "@/Components/Icons";
import React, { useCallback, useState } from "react";
import { Head, Link } from "@inertiajs/react";
import { REVIEW_TYPES, STEPS } from "@/types/constants";
import ResearchList from "@/Components/Application/ResearchList";
import { useApplicationFilters } from "@/Hooks/useApplicationFilters";
import EmptyCard from "@/Components/EmptyCard";

export interface ApplicationIndexProps extends PageProps {
    applications: PaginationProps<Application>,
    canCreate: boolean,
    canDelete: boolean,
}

const Index = (props: ApplicationIndexProps) => {
    const {
        filters,
        pagination,
        loading,
        updateFilters,
        handleSetPage,
        handleDelete,
    } = useApplicationFilters(props.applications);

    const [search, setSearch] = useState<string>('');

    const DateRangePickerDisplay = useCallback(
        React.forwardRef<HTMLElement, any>((_, ref) => (
            <DateRangePicker
                ref={ref}
                showMonthAndYearPickers
                className="w-auto"
                label="Date Range (From - To)"
                labelPlacement="outside"
                size="sm"
                variant="flat"
                value={filters.dateRange}
                onChange={(value) => {
                    updateFilters({ ...filters, dateRange: value }, pagination.current_page);
                }}
                startContent={(
                    <Button
                        isIconOnly
                        variant="light"
                        color="primary"
                        size="sm"
                        onPress={() => {
                            if (!filters.dateRange) return;

                            updateFilters({ ...filters, dateRange: undefined }, pagination.current_page);
                        }}
                    >
                        <ClearRound />
                    </Button>
                )}
            />
        )),
        [filters.dateRange]
    );

    return (
        <Authenticated header={"List of Applications"}>
            <Head title="Applications" />

            <div className="py-3 mx-auto">
                {Object.values(pagination).length == 0 ? (
                    <EmptyCard canCreate={props.canCreate} />
                ) : (
                    <>
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
                                           <Button onPress={() => {
                                               if (search !== filters.query) {
                                                   updateFilters({...filters, query: search}, pagination.current_page);
                                               }
                                           }}
                                                   variant="light"
                                                   color="primary"
                                                   isIconOnly
                                           >
                                               <MdiSearch />
                                           </Button>
                                       )}
                                       className="max-w-md disabled:pointer-events-auto"
                                       variant="flat"
                                       value={search}
                                       onChange={(e) => setSearch(e.target.value)}
                                       onKeyDown={(e) =>
                                           e.key === 'Enter'
                                           && search !== filters.query
                                           && updateFilters({...filters, query: search}, pagination.current_page)
                                       }
                                />
                                <div className="flex flex-wrap gap-4 w-full">
                                    {/* Up to Step */}
                                    <Select
                                        className="w-full sm:w-52"
                                        label="Up to Step"
                                        labelPlacement="outside"
                                        size="sm"
                                        items={STEPS}
                                        value={filters.step}
                                        selectedKeys={filters.step ? [filters.step] : []}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            updateFilters({ ...filters, step: value }, pagination.current_page);
                                        }}
                                    >
                                        {(step) => (
                                            <SelectItem key={step.sequence} value={step.sequence} startContent={`${step.sequence}: `}>
                                                {step.name}
                                            </SelectItem>
                                        )}
                                    </Select>

                                    {/* Review Type */}
                                    <Select
                                        className="w-full sm:w-52"
                                        label="Review Type"
                                        labelPlacement="outside"
                                        size="sm"
                                        value={filters.reviewType}
                                        selectedKeys={filters.reviewType ? [filters.reviewType] : []}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            updateFilters({ ...filters, reviewType: value }, pagination.current_page);
                                        }}
                                    >
                                        {REVIEW_TYPES.map((type) => (
                                            <SelectItem key={type.value} value={type.value}>
                                                {type.label}
                                            </SelectItem>
                                        ))}
                                    </Select>

                                    {/* Status */}
                                    <Select
                                        className="w-full sm:w-52"
                                        label="Status"
                                        labelPlacement="outside"
                                        size="sm"
                                        selectionMode="single"
                                        value={filters.status}
                                        selectedKeys={filters.status ? [filters.status] : []}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            updateFilters({ ...filters, status: value }, pagination.current_page);
                                        }}
                                    >
                                        <SelectItem key="Pending" value="Pending">Pending</SelectItem>
                                        <SelectItem key="In Progress" value="In Progress">In Progress</SelectItem>
                                        <SelectItem key="Completed" value="Completed">Completed</SelectItem>
                                    </Select>

                                    <DateRangePickerDisplay />
                                </div>

                            </CardHeader>
                            <CardBody>
                                <ResearchList pagination={pagination} handleDelete={handleDelete} handleSetPage={handleSetPage} loading={loading} canDelete={props.canDelete} />
                            </CardBody>
                        </Card>
                    </>
                )}
            </div>
        </Authenticated>
    );
}


export default Index;
