import { useEffect, useState } from "react";
import ComponentCard from "@/components/ComponentCard";
import '@/global.css';
import DT from "datatables.net-bs5";
import DataTable from "datatables.net-react";
import "datatables.net-buttons-bs5";
import "datatables.net-buttons/js/buttons.html5";
import AddRemark, { REMARK_CATEGORY_TYPES } from "@/components/AddRemark";

import { TbEye, TbReceipt } from "react-icons/tb";

import jszip from "jszip";
import pdfmake from "pdfmake";
import { bookingColumns } from "@/views/tables/data-tables/manpower/booking/booking/bookings";
import { createRoot } from "react-dom/client";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import TablePagination from "@/components/table/TablePagination";
import TableFilters from "@/components/table/TableFilters";
import { useTableFilters } from "@/hooks/useTableFilters";

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
      "id",
      "name",
      "mobile",
      "address",
      "Price",
      "date",
      "Remark",
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

  const [pageSize] = useState(10);
  const [_total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const baseURL = (import.meta as any).env?.VITE_PATH ?? "";
  const navigate = useNavigate();

  // Use the custom hook for filters
  const {
    dateFilter,
    statusFilter,
    dateRange,
    currentPage,
    handleDateFilterChange,
    handleStatusFilterChange,
    handleDateRangeChange,
    handlePageChange,
    getFilterParams,
  } = useTableFilters({
    defaultDateFilter: "",
  });

  const { endpoint, columns, headers } = tableConfig[tabKey];

  const StatusFilterOptions = [
    { label: "New", value: "1" },
    { label: "Ongoing", value: "2" },
    { label: "Canceled", value: "3" },
    { label: "Completed", value: "4" },
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = getFilterParams(pageSize, filterParams);
      const res = await axios.get(`${baseURL}${endpoint}`, { params });
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

  const handleView = (rowData: any) => {
    const id =
      rowData?.manpower_order_id ?? rowData?.mpo_order_id ?? rowData?.id;
    if (id !== undefined && id !== null) {
      navigate(`/manpower/booking/details/${id}`);
    } else {
      console.warn("No id found for row", rowData);
    }
  };

  const handleRemark = (rowData: any) => {
    const id = rowData?.manpower_order_id ?? rowData?.mpo_order_id ?? rowData?.id;
    setSelectedBookingId(id);
    setIsRemarkOpen(true);
  };

  const handleRemarkSuccess = () => {
    fetchData();
    onDataChanged?.();
  };

  useEffect(() => {
    fetchData();
  }, [
    tabKey,
    refreshFlag,
    currentPage,
    pageSize,
    dateFilter,
    statusFilter,
    dateRange,
  ]);

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
          <div className="d-flex flex-row gap-1">
            <button
              className="eye-icon p-1"
              onClick={() => {
                handleView(rowData);
              }}
            >
              <TbEye className="me-1" />
            </button>
            <button
              className="remark-icon"
              onClick={() => handleRemark(rowData)}
            >
              <TbReceipt className="me-1" />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <ComponentCard
        title={tabKey === 1 ? "Manage Booking" : ""}
        className="mb-4 overflow-x-auto"
        headerActions={
          <TableFilters
            dateFilter={dateFilter}
            statusFilter={statusFilter}
            dateRange={dateRange}
            onDateFilterChange={handleDateFilterChange}
            onStatusFilterChange={handleStatusFilterChange}
            onDateRangeChange={handleDateRangeChange}
            statusOptions={StatusFilterOptions}
          />
        }
      >
        {loading ? (
          <div className="text-center p-4">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <DataTable
              key={`booking-table-${tabKey}-${dateFilter}-${statusFilter}-${dateRange}-${currentPage}`}
              data={rows}
              columns={columnsWithActions}
              options={{
                responsive: true,
                destroy: true,
                paging: false,
                searching: true,
                info: false,
                layout: {
                  topStart: "buttons",
                },
                buttons: [
                  { extend: "copy", className: "btn btn-sm btn-secondary" },
                  {
                    extend: "csv",
                    className: "btn btn-sm btn-secondary active",
                  },
                  { extend: "excel", className: "btn btn-sm btn-secondary" },
                  {
                    extend: "pdf",
                    className: "btn btn-sm btn-secondary active",
                  },
                ],
              }}
              className="table table-striped dt-responsive align-middle mb-0"
            >
              <thead className="thead-sm text-capitalize fs-xxs">
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
              // itemsName="items"
              showInfo={true}
              previousPage={() =>
                handlePageChange(Math.max(0, currentPage - 1))
              }
              canPreviousPage={currentPage > 0}
              pageCount={totalPages}
              pageIndex={currentPage}
              setPageIndex={handlePageChange}
              nextPage={() =>
                handlePageChange(Math.min(totalPages - 1, currentPage + 1))
              }
              canNextPage={currentPage < totalPages - 1}
            />
          </div>
        )}
      </ComponentCard>

      <AddRemark
        isOpen={isRemarkOpen}
        onClose={() => setIsRemarkOpen(false)}
        remarkCategoryType={REMARK_CATEGORY_TYPES.MANPOWER_ORDER}
        primaryKeyId={selectedBookingId}
        onSuccess={handleRemarkSuccess}
      />
    </>
  );
};

export default ExportDataWithButtons;
