import { useEffect, useState } from "react";
import ComponentCard from "@/components/ComponentCard";
import {
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
} from "react-bootstrap";

import DT from "datatables.net-bs5";
import DataTable from "datatables.net-react";
import "datatables.net-buttons-bs5";
import "datatables.net-buttons/js/buttons.html5";
import AddRemark from "@/components/AddRemark";

import {
  TbDotsVertical,
  TbEye,
  TbReceipt,
} from "react-icons/tb";

import jszip from "jszip";
import pdfmake from "pdfmake";
import { bookingColumns } from "@/views/tables/data-tables/booking-data/booking/bookings.ts";
import { DateRangePicker, InputPicker } from "rsuite";
import { createRoot } from "react-dom/client";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import "rsuite/dist/rsuite.min.css";
import TablePagination from "@/components/table/TablePagination";

const tableConfig: Record<
  number,
  {
    endpoint: string;
    columns: any[];
    headers: string[];
  }
> = {
  1: {
    endpoint: "/booking/get_bookings",
    columns: bookingColumns,
    headers: [
      "S.No.",
      "order id",
      "name",
      "mobile_no",
      "address_id",
      "Price",
      "payment_mode",
      "order_date",
      "status",
    ],
  },
};

type ExportDataWithButtonsProps = {
  tabKey: number;
  refreshFlag: number;
  filterParams?: Record<string, any>;
  onDataChanged: () => void;
};

DataTable.use(DT);
DT.Buttons.jszip(jszip);
DT.Buttons.pdfMake(pdfmake);

const ExportDataWithButtons = ({
  tabKey,
  refreshFlag,
  filterParams = {},
  onDataChanged,
}: ExportDataWithButtonsProps) => {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isRemarkOpen, setIsRemarkOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(
    null
  );
  
  // URL search params - MOVE THIS BEFORE using it
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Initialize filters from URL - default to 'today' if no date filter
  const [dateFilter, setDateFilter] = useState<string | null>(() => 
    searchParams.get('date') || 'today'
  );
  const [statusFilter, setStatusFilter] = useState<string | null>(() => 
    searchParams.get('status') || null
  );
  const [dateRange, setDateRange] = useState<[Date, Date] | null>(() => {
    const fromDate = searchParams.get('fromDate');
    const toDate = searchParams.get('toDate');
    if (fromDate && toDate) {
      return [new Date(fromDate), new Date(toDate)];
    }
    return null;
  });
  
  // Pagination states - initialize from URL
  const [currentPage, setCurrentPage] = useState(() => {
    const page = searchParams.get('page');
    return page ? parseInt(page) - 1 : 0; // Convert to 0-based index
  });
  const [pageSize, _setPageSize] = useState(10);
  const [_total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  const baseURL = (import.meta as any).env?.VITE_PATH ?? "";

  const navigate = useNavigate();

  const { endpoint, columns, headers } = tableConfig[tabKey];

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

  const StatusFilterOption = [
    { label: "New", value: "1" },
    { label: "Ongoing", value: "2" },
    { label: "Canceled", value: "3" },
    { label: "Completed", value: "4" },
  ];

  // Update URL when page changes
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', (newPage + 1).toString());
    
    // Preserve existing filters
    if (dateFilter) newParams.set('date', dateFilter);
    if (statusFilter) newParams.set('status', statusFilter);
    if (dateRange) {
      newParams.set('fromDate', dateRange[0].toISOString().split('T')[0]);
      newParams.set('toDate', dateRange[1].toISOString().split('T')[0]);
    }
    
    setSearchParams(newParams);
  };

  // Handle date filter change
  const handleDateFilterChange = (value: string | null) => {
    setDateFilter(value);
    setCurrentPage(0);
    
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', '1');
    
    if (value !== 'custom') {
      // Clear date range if not custom
      setDateRange(null);
      if (value) {
        newParams.set('date', value);
      } else {
        newParams.delete('date');
      }
      newParams.delete('fromDate');
      newParams.delete('toDate');
    } else {
      newParams.set('date', 'custom');
    }
    
    // Preserve status filter
    if (statusFilter) newParams.set('status', statusFilter);
    
    setSearchParams(newParams);
  };

  // Handle status filter change
  const handleStatusFilterChange = (value: string | null) => {
    setStatusFilter(value);
    setCurrentPage(0);
    
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', '1');
    
    if (value) {
      newParams.set('status', value);
    } else {
      newParams.delete('status');
    }
    
    // Preserve date filter
    if (dateFilter) newParams.set('date', dateFilter);
    if (dateRange) {
      newParams.set('fromDate', dateRange[0].toISOString().split('T')[0]);
      newParams.set('toDate', dateRange[1].toISOString().split('T')[0]);
    }
    
    setSearchParams(newParams);
  };

  // Handle date range change
  const handleDateRangeChange = (value: [Date, Date] | null) => {
    setDateRange(value);
    setCurrentPage(0);
    
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', '1');
    
    if (value) {
      const fromDate = value[0].toISOString().split('T')[0];
      const toDate = value[1].toISOString().split('T')[0];
      newParams.set('date', 'custom');
      newParams.set('fromDate', fromDate);
      newParams.set('toDate', toDate);
      
      // Automatically set date filter to custom
      if (dateFilter !== 'custom') {
        setDateFilter('custom');
      }
    } else {
      newParams.delete('fromDate');
      newParams.delete('toDate');
      
      // Reset to today if date range is cleared
      if (dateFilter === 'custom') {
        setDateFilter('today');
        newParams.set('date', 'today');
      }
    }
    
    // Preserve status filter
    if (statusFilter) newParams.set('status', statusFilter);
    
    setSearchParams(newParams);
  };

  const getFilterParams = () => {
    const params: any = {
      ...filterParams,
      page: currentPage + 1, // API expects 1-based page
      limit: pageSize,
    };
    
    // Add date filter (only if not custom)
    if (dateFilter && dateFilter !== 'custom') {
      params.date = dateFilter;
    }
    
    // Add status filter
    if (statusFilter) {
      params.status = statusFilter;
    }
    
    // Add date range
    if (dateRange) {
      params.fromDate = dateRange[0].toISOString().split("T")[0];
      params.toDate = dateRange[1].toISOString().split("T")[0];
    }
    
    return params;
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseURL}${endpoint}`, { params: getFilterParams() });
      console.log("Fetched data:", res.data);
      switch (tabKey) {
        case 1:
          setRows(res.data?.jsonData?.bookingsLists || []);
          setTotal(res.data?.pagination?.total || 0);
          setTotalPages(res.data?.pagination?.totalPages || 0);
          break;
        default:
          setRows(res.data.remark || []);
          setTotal(res.data?.total || 0);
          setTotalPages(res.data?.totalPages || 0);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setRows([]);
      setTotal(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  // Set default filter on mount if no filter in URL
  useEffect(() => {
    if (!searchParams.get('date') && dateFilter === 'today') {
      const newParams = new URLSearchParams(searchParams);
      newParams.set('date', 'today');
      setSearchParams(newParams);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [tabKey, refreshFlag, currentPage, pageSize, dateFilter, statusFilter, dateRange]);

  const handleView = (rowData: any) => {
    const id =
      rowData?.manpower_order_id ?? rowData?.mpo_order_id ?? rowData?.id;
    if (id !== undefined && id !== null) {
      navigate(`/booking-details/${id}`);
    } else {
      console.warn("No id found for row", rowData);
    }
  };

  const handleRemark = (rowData: any) => {
    const id =
      rowData?.manpower_order_id ?? rowData?.mpo_order_id ?? rowData?.id;
    console.log("Selected Booking ID for Remark:", id);
    setSelectedBookingId(id);
    setIsRemarkOpen(true);
  };
  
  const handleSaveRemark = async (remark: string) => {
    try {
      await axios.post(`${baseURL}/add_remarks/${selectedBookingId}`, {
        remarkType: "BOOKING",
        remarks: remark,
      });
      console.log("Remark saved successfully");
      fetchData();
      onDataChanged();
    } catch (error) {
      console.error("Error saving remark:", error);
    }
  };

  const columnsWithActions = [
    {
      title: "S.No.",
      data: null,
      orderable: false,
      searchable: false,
      render: (_data: any, _type: any, _row: any, meta: any) => {
        return currentPage * pageSize + meta.row + 1;
      },
    },
    ...columns,
    {
      title: "Actions",
      data: null,
      orderable: false,
      searchable: false,
      render: () => "",
      createdCell: (td: HTMLElement, _cellData: any, rowData: any) => {
        td.innerHTML = "";
        const root = createRoot(td);
        root.render(
          <Dropdown align="end" className="text-muted">
            <DropdownToggle
              variant="link"
              className="drop-arrow-none fs-xxl link-reset p-0"
            >
              <TbDotsVertical />
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem onClick={() => handleView(rowData)}>
                <TbEye className="me-1" /> View
              </DropdownItem>
              <DropdownItem onClick={() => handleRemark(rowData)}>
                <TbReceipt className="me-1" /> Remark
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        );
      },
    },
  ];

  const filterActions = (
    <div className="d-flex align-items-center gap-2 flex-wrap">
      <DateRangePicker
        format="MM/dd/yyyy"
        style={{ width: 220 }}
        value={dateRange}
        onChange={handleDateRangeChange}
        placeholder="Select date range"
        cleanable
        size="sm"
        disabled={dateFilter !== 'custom'}
      />
      <InputPicker
        data={DateFilterOptions}
        value={dateFilter}
        onChange={handleDateFilterChange}
        placeholder="Date filter"
        style={{ width: 150 }}
        cleanable
        size="sm"
      />
      <InputPicker
        data={StatusFilterOption}
        value={statusFilter}
        onChange={handleStatusFilterChange}
        placeholder="Status"
        style={{ width: 150 }}
        cleanable
        size="sm"
      />
    </div>
  );

  return (
    <>
      <ComponentCard
        title={tabKey === 1 ? "Manage Booking" : ""}
        className="mb-4 overflow-x-auto"
        headerActions={filterActions}
      >
        {loading ? (
          <div className="text-center p-4">Loading...</div>
        ) : (
          <>
            <DataTable
              key={`booking-table-${tabKey}-${dateFilter}-${statusFilter}-${dateRange}-${currentPage}`}
              data={rows}
              columns={columnsWithActions}
              options={{
                responsive: true,
                destroy: true,
                paging: false,
                searching: false,
                info: false,
                layout: {
                  topStart: "buttons",
                },
                buttons: [
                  { extend: "copy", className: "btn btn-sm btn-secondary" },
                  { extend: "csv", className: "btn btn-sm btn-secondary active" },
                  { extend: "excel", className: "btn btn-sm btn-secondary" },
                  { extend: "pdf", className: "btn btn-sm btn-secondary active" },
                ],
              }}
              className="table table-striped dt-responsive align-middle mb-0"
            >
              <thead className="thead-sm text-uppercase fs-xxs">
                <tr>
                  {headers.map((col, idx) => (
                    <th key={idx}>{col}</th>
                  ))}
                  <th>Actions</th>
                </tr>
              </thead>
            </DataTable>

            <TablePagination
              // totalItems={total}
              start={currentPage + 1}
              // end={totalPages}
              // itemsName="bookings"
              showInfo={true}
              previousPage={() => handlePageChange(Math.max(0, currentPage - 1))}
              canPreviousPage={currentPage > 0}
              pageCount={totalPages}
              pageIndex={currentPage}
              setPageIndex={handlePageChange}
              nextPage={() => handlePageChange(Math.min(totalPages - 1, currentPage + 1))}
              canNextPage={currentPage < totalPages - 1}
            />
          </>
        )}
      </ComponentCard>

      <AddRemark
        isOpen={isRemarkOpen}
        onClose={() => setIsRemarkOpen(false)}
        bookingId={selectedBookingId ?? undefined}
        onSave={handleSaveRemark}
      />
    </>
  );
};

export default ExportDataWithButtons;
