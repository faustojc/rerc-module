import { Application, ApplicationFilters, PaginationProps, User } from "@/types";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getLocalTimeZone, parseDate } from "@internationalized/date";
import { toast } from "react-toastify";

export const useApplicationFilters = (user: User, initialPagination: PaginationProps<Application>) => {
    const [pagination, setPagination] = useState(initialPagination);

    const changeDateStringFormat = (date: string) => {
        const dates = date.split('/');
        return `${dates[2]}-${dates[0]}-${dates[1]}`;
    }

    // initial filters from URL
    const initialFilters: ApplicationFilters = useMemo(() => {
        const searchParams = new URLSearchParams(window.location.search);
        let pageParam = searchParams.get('page');

        if (pageParam != null && parseInt(pageParam) > pagination.last_page) {
            setPagination({
                ...pagination,
                current_page: 1,
            })
        }

        const startDate = searchParams.get('dateRange[start]');
        const endDate = searchParams.get('dateRange[end]');

        const dateRange = startDate && endDate ? {
            start: parseDate(changeDateStringFormat(startDate)),
            end: parseDate(changeDateStringFormat(endDate)),
        } : undefined;

        return {
            query: searchParams.get('query') ?? undefined,
            reviewType: searchParams.get('reviewType') ?? undefined,
            step: searchParams.get('step') ?? undefined,
            dateRange: dateRange,
            status: searchParams.get('status') ?? undefined,
        };
    }, []);

    const [filters, setFilters] = useState<ApplicationFilters>(initialFilters);
    const [loading, setLoading] = useState(false);

    const updateFilters = useCallback((newFilters: ApplicationFilters, pageNumber: number) => {
        if (Object.values(pagination).length === 0) return;

        setLoading(true);

        const params = new URLSearchParams(window.location.search);
        const page = Math.min(pageNumber, pagination.last_page);
        params.set('page', page.toString());

        if (newFilters.query) params.set('query', newFilters.query.trim());
        if (newFilters.reviewType) params.set('reviewType', newFilters.reviewType);
        if (newFilters.step) params.set('step', newFilters.step);
        if (newFilters.status) params.set('status', newFilters.status);
        if (newFilters.dateRange) {
            params.set('dateRange[start]', newFilters.dateRange.start.toDate(getLocalTimeZone()).toLocaleDateString("default", {year: 'numeric', month: '2-digit', day: '2-digit'}));
            params.set('dateRange[end]', newFilters.dateRange.end.toDate(getLocalTimeZone()).toLocaleDateString("default", {year: 'numeric', month: '2-digit', day: '2-digit'}));
        }

        // get all the other params that are not part of the filters
        const otherParams = Array.from(params).filter(([key]) => !Object.keys(newFilters).includes(key));

        window.history.pushState({}, '', `${window.location.pathname}?${params.toString()}`);
        setFilters(newFilters);

        window.axios.get(
            route('applications.index', {
                ...newFilters,
                ...Object.fromEntries(otherParams),
                page: pageNumber,
                dateRange: newFilters.dateRange ? {
                    start: newFilters.dateRange.start.toDate(getLocalTimeZone()).toISOString(),
                    end: newFilters.dateRange.end.toDate(getLocalTimeZone()).toISOString(),
                } : undefined,
            }),
            {headers: {'X-Requested-With': 'XMLHttpRequest'}}
        ).then((response) => {
            setPagination(response.data.applications);
        }).catch((error: any) => {
            console.error(error.message ?? 'An error occurred while searching applications.')
        }).finally(() => setLoading(false));
    }, [pagination.last_page]);

    const handleSetPage = useCallback(async (page: number) => {
        setPagination(prev => ({
            ...prev,
            current_page: page,
        }));
        updateFilters(filters, page);
    }, [filters]);

    const handleDelete = useCallback(async (application: Application) => {
        setLoading(true);
        try {
            const response = await window.axios.delete(
                route('applications.destroy', {
                    application: application,
                    page: pagination.current_page
                })
            );
            setPagination(response.data.applications);
            toast.success(response.data.message ?? 'Application deleted.');
        } catch (error) {
            toast.error('Failed to delete application.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [pagination.current_page]);

    useEffect(() => {
        if (user.role === 'researcher') return;

        const channel = window.Echo.channel('application-list');

        channel.listen('.ApplicationCreated', (event: any) => {
            setPagination((prev) => {
                const updatedData = [event.application, ...prev.data];

                // single page with overflow
                if (prev.last_page === 1 && updatedData.length > prev.per_page) {
                    return {
                        ...prev,
                        data: updatedData.slice(0, prev.per_page),
                        total: prev.total + 1,
                        last_page: prev.last_page + 1,
                        next_page_url: `${prev.path}?page=2`,
                    };
                }

                // multiple pages with overflow
                if (updatedData.length > prev.per_page) {
                    updatedData.pop();
                }

                // update links if needed
                const newLinks = [...prev.links];
                if (prev.total % prev.per_page !== 0) {
                    newLinks.push({
                        url: `${prev.path}?page=${prev.last_page + 1}`,
                        label: `${prev.last_page + 1}`,
                        active: false,
                    });
                }

                return {
                    ...prev,
                    data: updatedData,
                    total: prev.total + 1,
                    links: newLinks,
                };
            });

            toast.info(`${event.application.research_title} has been created`);
        });

        return () => {
            channel.stopListening('.ApplicationCreated');
            window.Echo.leaveChannel('application-list');
        };
    }, []);

    return {
        filters,
        pagination,
        loading,
        updateFilters,
        handleSetPage,
        handleDelete,
    };
};
