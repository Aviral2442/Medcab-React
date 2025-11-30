import { useState } from "react";
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
  defaultDateFilter = "",
  onFilterChange,
}: UseTableFiltersProps = {}): UseTableFiltersReturn => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize filters from URL - remove filter initialization from URL
  const [dateFilter, setDateFilter] = useState<string | null>(
    defaultDateFilter // Remove: () => searchParams.get("date") || defaultDateFilter
  );
  const [statusFilter, setStatusFilter] = useState<string | null>(
    null // Remove: () => searchParams.get("status") || null
  );
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>(() => {
    // Remove dateRange initialization from URL
    return [null, null];
  });

  const [startDate, endDate] = dateRange;

  // Initialize page from URL
  const [currentPage, setCurrentPage] = useState(() => {
    const page = searchParams.get("page");
    return page ? parseInt(page) - 1 : 0;
  });

  // Update URL with only page value - remove filter updates
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


    setSearchParams(newParams);
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    updateURL({ page: newPage });
  };

  // Handle date filter change - remove URL update
  const handleDateFilterChange = (value: string | null) => {
    setDateFilter(value);
    setCurrentPage(0);
    // Remove: updateURL({ page: 0, date: value, fromDate: null, toDate: null });
    updateURL({ page: 0 });
    onFilterChange?.();
  };

  // Handle status filter change - remove URL update
  const handleStatusFilterChange = (value: string | null) => {
    setStatusFilter(value);
    setCurrentPage(0);
    // Remove: updateURL({ page: 0, status: value });
    updateURL({ page: 0 });
    onFilterChange?.();
  };

  // Handle date range change - remove URL update
  const handleDateRangeChange = (update: [Date | null, Date | null]) => {
    setDateRange(update);
    setCurrentPage(0);

    const [start, end] = update;

    if (start && end) {
      // Remove: updateURL({ page: 0, date: "custom", fromDate, toDate });
      updateURL({ page: 0 });
      if (dateFilter !== "custom") {
        setDateFilter("custom");
      }
    } else if (!start && !end) {
      // Remove: updateURL({ page: 0, fromDate: null, toDate: null });
      updateURL({ page: 0 });
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

  // Remove: Set default filter on mount if no filter in URL
  // useEffect(() => {
  //   if (!searchParams.get("date") && dateFilter === defaultDateFilter) {
  //     updateURL({ date: defaultDateFilter });
  //   }
  // }, []);

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