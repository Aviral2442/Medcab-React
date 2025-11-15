import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

interface UseTableFiltersProps {
  defaultDateFilter?: string;
  onFilterChange?: () => void;
}

interface UseTableFiltersReturn {
  dateFilter: string | null;
  statusFilter: string | null;
  dateRange: [Date | null, Date | null];
  currentPage: number;
  searchParams: URLSearchParams;
  setSearchParams: (params: URLSearchParams) => void;
  handleDateFilterChange: (value: string | null) => void;
  handleStatusFilterChange: (value: string | null) => void;
  handleDateRangeChange: (update: [Date | null, Date | null]) => void;
  handlePageChange: (newPage: number) => void;
  updateURL: (updates: {
    page?: number;
    date?: string | null;
    status?: string | null;
    fromDate?: string | null;
    toDate?: string | null;
  }) => void;
  getFilterParams: (pageSize: number, additionalParams?: Record<string, any>) => Record<string, any>;
}

export const useTableFilters = ({
  defaultDateFilter = "today",
  onFilterChange,
}: UseTableFiltersProps = {}): UseTableFiltersReturn => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize filters from URL
  const [dateFilter, setDateFilter] = useState<string | null>(
    () => searchParams.get("date") || defaultDateFilter
  );
  const [statusFilter, setStatusFilter] = useState<string | null>(
    () => searchParams.get("status") || null
  );
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>(() => {
    const fromDate = searchParams.get("fromDate");
    const toDate = searchParams.get("toDate");
    if (fromDate && toDate) {
      return [new Date(fromDate), new Date(toDate)];
    }
    return [null, null];
  });

  const [startDate, endDate] = dateRange;

  // Initialize page from URL
  const [currentPage, setCurrentPage] = useState(() => {
    const page = searchParams.get("page");
    return page ? parseInt(page) - 1 : 0;
  });

  // Update URL with all current filter and pagination values
  const updateURL = (updates: {
    page?: number;
    date?: string | null;
    status?: string | null;
    fromDate?: string | null;
    toDate?: string | null;
  }) => {
    const newParams = new URLSearchParams();

    const pageValue = updates.page !== undefined ? updates.page : currentPage;
    if (pageValue > 0) {
      newParams.set("page", (pageValue + 1).toString());
    }

    const dateValue = updates.date !== undefined ? updates.date : dateFilter;
    if (dateValue) {
      newParams.set("date", dateValue);
    }

    const statusValue =
      updates.status !== undefined ? updates.status : statusFilter;
    if (statusValue) {
      newParams.set("status", statusValue);
    }

    const fromDateValue =
      updates.fromDate !== undefined
        ? updates.fromDate
        : startDate
        ? startDate.toISOString().split("T")[0]
        : null;
    const toDateValue =
      updates.toDate !== undefined
        ? updates.toDate
        : endDate
        ? endDate.toISOString().split("T")[0]
        : null;

    if (fromDateValue && toDateValue) {
      newParams.set("fromDate", fromDateValue);
      newParams.set("toDate", toDateValue);
    }

    setSearchParams(newParams);
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    updateURL({ page: newPage });
  };

  // Handle date filter change
  const handleDateFilterChange = (value: string | null) => {
    setDateFilter(value);
    setCurrentPage(0);

    if (value !== "custom") {
      setDateRange([null, null]);
      updateURL({ page: 0, date: value, fromDate: null, toDate: null });
    } else {
      updateURL({ page: 0, date: value });
    }

    onFilterChange?.();
  };

  // Handle status filter change
  const handleStatusFilterChange = (value: string | null) => {
    setStatusFilter(value);
    setCurrentPage(0);
    updateURL({ page: 0, status: value });
    onFilterChange?.();
  };

  // Handle date range change
  const handleDateRangeChange = (update: [Date | null, Date | null]) => {
    setDateRange(update);
    setCurrentPage(0);

    const [start, end] = update;

    if (start && end) {
      const fromDate = start.toISOString().split("T")[0];
      const toDate = end.toISOString().split("T")[0];
      updateURL({
        page: 0,
        date: "custom",
        fromDate,
        toDate,
      });
      if (dateFilter !== "custom") {
        setDateFilter("custom");
      }
    } else if (!start && !end) {
      updateURL({ page: 0, fromDate: null, toDate: null });
      if (dateFilter === "custom") {
        setDateFilter(defaultDateFilter);
      }
    }

    onFilterChange?.();
  };

  // Get filter params for API call
const getFilterParams = (pageSize: number, additionalParams = {}) => {
  const params: any = {
    ...additionalParams,
    page: currentPage + 1,
    limit: pageSize,
  };

  // Normal quick filters
  if (dateFilter && dateFilter !== "custom") {
    params.date = dateFilter;
  }

  // Custom date range filter
  if (startDate && endDate) {
    params.date = "custom"; // 🔥 MUST SEND THIS
    params.fromDate = startDate.toISOString().split("T")[0];
    params.toDate = endDate.toISOString().split("T")[0];
  }

  if (statusFilter) {
    params.status = statusFilter;
  }

  return params;
};


  // Set default filter on mount if no filter in URL
  useEffect(() => {
    if (!searchParams.get("date") && dateFilter === defaultDateFilter) {
      updateURL({ date: defaultDateFilter });
    }
  }, []);

  return {
    dateFilter,
    statusFilter,
    dateRange,
    currentPage,
    searchParams,
    setSearchParams,
    handleDateFilterChange,
    handleStatusFilterChange,
    handleDateRangeChange,
    handlePageChange,
    updateURL,
    getFilterParams,
  };
};