import { InputPicker, DateRangePicker } from "rsuite";
import type { DateRange } from "rsuite/esm/DateRangePicker";
import "react-datepicker/dist/react-datepicker.css";
import "rsuite/dist/rsuite.min.css";

interface TableFiltersProps {
  dateFilter: string | null;
  statusFilter: string | null;
  dateRange: [Date | null, Date | null];
  onDateFilterChange: (value: string | null) => void;
  onStatusFilterChange: (value: string | null) => void;
  onDateRangeChange: (update: [Date | null, Date | null]) => void;
  statusOptions: Array<{ label: any; value: any }>;
  showDateRange?: boolean;
  showDateFilter?: boolean;
  showStatusFilter?: boolean;
  dateFilterPlaceholder?: string;
  statusFilterPlaceholder?: string;
  dateRangePlaceholder?: string;
  className?: string;
}

const TableFilters = ({
  dateFilter,
  statusFilter,
  dateRange,
  onDateFilterChange,
  onStatusFilterChange,
  onDateRangeChange,
  statusOptions,
  showDateRange = true,
  showDateFilter = true,
  showStatusFilter = true,
  dateFilterPlaceholder = "Quick filter",
  statusFilterPlaceholder = "Status",
  dateRangePlaceholder = "Custom date range",
  className = "",
}: TableFiltersProps) => {
  const [startDate, endDate] = dateRange;

  // const predefinedRanges = [
  //   {
  //     label: 'Today',
  //     value: [new Date(), new Date()] as DateRange,
  //     placement: 'left' as const
  //   },
  //   {
  //     label: 'Yesterday',
  //     value: [addDays(new Date(), -1), addDays(new Date(), -1)] as DateRange,
  //     placement: 'left' as const
  //   },
  //   {
  //     label: 'This week',
  //     value: [startOfWeek(new Date(), { weekStartsOn: 0 }), endOfWeek(new Date(), { weekStartsOn: 0 })] as DateRange,
  //     placement: 'left' as const
  //   },
  //   {
  //     label: 'Last 7 days',
  //     value: [subDays(new Date(), 6), new Date()] as DateRange,
  //     placement: 'left' as const
  //   },
  //   {
  //     label: 'Last 30 days',
  //     value: [subDays(new Date(), 29), new Date()] as DateRange,
  //     placement: 'left' as const
  //   },
  //   {
  //     label: 'This month',
  //     value: [startOfMonth(new Date()), new Date()] as DateRange,
  //     placement: 'left' as const
  //   },
  //   {
  //     label: 'Last month',
  //     value: [startOfMonth(addMonths(new Date(), -1)), endOfMonth(addMonths(new Date(), -1))] as DateRange,
  //     placement: 'left' as const
  //   },
  //   {
  //     label: 'This year',
  //     value: [new Date(new Date().getFullYear(), 0, 1), new Date()] as DateRange,
  //     placement: 'left' as const
  //   },
  //   {
  //     label: 'Last year',
  //     value: [new Date(new Date().getFullYear() - 1, 0, 1), new Date(new Date().getFullYear() - 1, 11, 31)] as DateRange,
  //     placement: 'left' as const
  //   },
  // ];

  const handleDateRangeChange = (value: DateRange | null) => {
    if (value && value[0] && value[1]) {
      onDateRangeChange([value[0], value[1]]);
    } else {
      onDateRangeChange([null, null]);
    }
  };

  const handleDateFilterChange = (value: string | null) => {
    onDateFilterChange(value);
    // Clear date range when switching away from custom
    if (value !== "custom") {
      onDateRangeChange([null, null]);
    }
  };

  // Check if custom is selected
  const isCustomSelected = dateFilter === "custom";

  return (
    <div
      className={`d-flex align-items-center gap-2 flex-wrap ${className}`}
      style={{ minWidth: 0 }}
    >
      {/* {showDateRange && (
        <div style={{ width: "280px", flexShrink: 0 }}>
          <DateRangePicker
            // ranges={predefinedRanges}
            showOneCalendar
            placeholder={dateRangePlaceholder}
            style={{ width: "100%" }}
            value={startDate && endDate ? [startDate, endDate] : null}
            onChange={handleDateRangeChange}
            cleanable
            size="sm"
            disabled={!isCustomSelected}
          />
        </div>
      )} */}

      {showDateRange && (
        <DateRangePicker 
          placeholder={dateRangePlaceholder}
          style={{ width: 280 }}
          value={startDate && endDate ? [startDate, endDate] : null}
          onChange={handleDateRangeChange}
          cleanable
          size="sm"
          disabled={!isCustomSelected}
        />
      )}

      {showDateFilter && (
        <div style={{ width: "150px", flexShrink: 0 }}>
          <InputPicker
            data={[
              { label: "Today", value: "today" },
              { label: "Yesterday", value: "yesterday" },
              { label: "This Week", value: "thisWeek" },
              { label: "This Month", value: "thisMonth" },
              { label: "Custom", value: "custom" },
            ]}
            value={dateFilter}
            onChange={handleDateFilterChange}
            placeholder={dateFilterPlaceholder}
            style={{ width: "100%" }}
            cleanable
            size="sm"
          />
        </div>
      )}

      {showStatusFilter && (
        <div style={{ width: "120px", flexShrink: 0 }}>
          <InputPicker
            data={statusOptions}
            value={statusFilter}
            onChange={onStatusFilterChange}
            placeholder={statusFilterPlaceholder}
            style={{ width: "100%" }}
            cleanable
            size="sm"
          />
        </div>
      )}
    </div>
  );
};

export default TableFilters;
