import { InputPicker, DateRangePicker } from "rsuite";
import type { DateRange } from "rsuite/esm/DateRangePicker";
import "react-datepicker/dist/react-datepicker.css";
import "rsuite/dist/rsuite.min.css";

interface TableFiltersProps {
  dateFilter: string | null;
  dateRange: [Date | null, Date | null];
  onDateFilterChange: (value: string | null) => void;
  onDateRangeChange: (update: [Date | null, Date | null]) => void;
  onCityFilterChange?: (value: string | null) => void;
  onStateFilterChange?: (value: string | null) => void;
  cityOptions: Array<{ label: any; value: any }>;
  stateOptions: Array<{ label: any; value: any }>;
  showDateRange?: boolean;
  showDateFilter?: boolean;
  showCityFilter?: boolean;
  showStateFilter?: boolean;
  dateFilterPlaceholder?: string;
  cityFilterPlaceholder?: string;
  stateFilterPlaceholder?: string;
  dateRangePlaceholder?: string;
  className?: string;
}

const TableFilters = ({
  dateFilter,
  dateRange,
  onDateFilterChange,
  onDateRangeChange,
  showDateRange = true,
  showDateFilter = true,
  dateFilterPlaceholder = "Quick filter",
  dateRangePlaceholder = "Custom date range",
  className = "",
  cityOptions,
  cityFilterPlaceholder = "City Filter",
  showCityFilter = true,
  showStateFilter = true,
  stateFilterPlaceholder = "State Filter",
}: TableFiltersProps) => {
  const [startDate, endDate] = dateRange;

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
      className={`d-flex justify-content-between align-items-center gap-2 flex-wrap ${className}`}
      style={{ minWidth: 0 }}
    >
      {showDateFilter && (
        <div style={{ width: "250px", flexShrink: 0 }}>
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
            className=""
          />
        </div>
      )}

      {showDateRange && (
        <DateRangePicker
          placeholder={dateRangePlaceholder}
          style={{ width: 250 }}
          value={startDate && endDate ? [startDate, endDate] : null}
          onChange={handleDateRangeChange}
          cleanable
          size="sm"
          disabled={!isCustomSelected}
          className=""
        />
      )}

      {showStateFilter && (
        <div style={{ width: "250px", flexShrink: 0 }}>
          <InputPicker
            data={[]}
            placeholder={stateFilterPlaceholder}
            style={{ width: "100%" }}
            cleanable
            size="sm"
          />
        </div>
      )}
      {showCityFilter && (
        <div style={{ width: "250px", flexShrink: 0 }}>
          <InputPicker
            data={cityOptions}
            placeholder={cityFilterPlaceholder}
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
