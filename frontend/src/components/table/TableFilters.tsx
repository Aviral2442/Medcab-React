import { InputPicker } from "rsuite";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "rsuite/dist/rsuite.min.css";

interface TableFiltersProps {
  dateFilter: string | null;
  statusFilter: string | null;
  dateRange: [Date | null, Date | null];
  onDateFilterChange: (value: string | null) => void;
  onStatusFilterChange: (value: string | null) => void;
  onDateRangeChange: (update: [Date | null, Date | null]) => void;
  statusOptions: Array<{ label: string; value: string }>;
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
  dateFilterPlaceholder = "Date filter",
  statusFilterPlaceholder = "Status",
  dateRangePlaceholder = "Select date range",
  className = "",
}: TableFiltersProps) => {
  const [startDate, endDate] = dateRange;

  const DateFilterOptions = [
    "today",
    "yesterday",
    "thisWeek",
    "thisMonth",
    "custom",
  ].map((item) => ({
    label:
      item.charAt(0).toUpperCase() + item.slice(1).replace(/([A-Z])/g, " $1"),
    value: item,
  }));

  return (
    <div className={`d-flex align-items-center gap-2 flex-nowrap ${className}`} style={{ minWidth: 0 }}>
      {showDateRange && (
        <div style={{ width: '200px', flexShrink: 0, marginRight: '20px' }}>
          <DatePicker
            selectsRange={true}
            startDate={startDate}
            endDate={endDate}
            onChange={onDateRangeChange}
            dateFormat="MM/dd/yyyy"
            placeholderText={dateRangePlaceholder}
            className="form-control form-control-sm"
            disabled={dateFilter !== "custom"}
            isClearable
            maxDate={new Date()}
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
          />
        </div>
      )}
      
      {showDateFilter && (
        <div style={{ width: '130px', flexShrink: 0 }}>
          <InputPicker
            data={DateFilterOptions}
            value={dateFilter}
            onChange={onDateFilterChange}
            placeholder={dateFilterPlaceholder}
            style={{ width: '100%' }}
            cleanable
            size="sm"
          />
        </div>
      )}
      
      {showStatusFilter && (
        <div style={{ width: '120px', flexShrink: 0 }}>
          <InputPicker
            data={statusOptions}
            value={statusFilter}
            onChange={onStatusFilterChange}
            placeholder={statusFilterPlaceholder}
            style={{ width: '100%' }}
            cleanable
            size="sm"
          />
        </div>
      )}
    </div>
  );
};

export default TableFilters;