import { useEffect, useState, useRef } from "react";
import ComponentCard from "@/components/ComponentCard";
import "@/global.css";
import DT from "datatables.net-bs5";
import DataTable from "datatables.net-react";
import "datatables.net-buttons-bs5";
import "datatables.net-buttons/js/buttons.html5";

import { TbArrowRight, TbEye, TbReceipt } from "react-icons/tb";
import jszip from "jszip";
import pdfmake from "pdfmake";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import TablePagination from "@/components/table/TablePagination";
import TableFilters from "@/components/table/TableFilters";
import { useTableFilters } from "@/hooks/useTableFilters";
import _pdfFonts from "pdfmake/build/vfs_fonts";
import _pdfMake from "pdfmake/build/pdfmake";
import { bookingColumns } from "./components/booking";
import { createRoot } from "react-dom/client";
import AddRemark, { REMARK_CATEGORY_TYPES } from "@/components/AddRemark";

DataTable.use(DT);
DT.Buttons.jszip(jszip);
DT.Buttons.pdfMake(pdfmake);

const tableConfig: Record<number, { endpoint: string; headers: string[] }> = {
  1: {
    endpoint: "/ambulance/get_ambulance_booking_list",
    headers: [
      "S.No.",
      "ID",
      "Type",
      "Consumer",
      "Category",
      "Schedule",
      "Pickup",
      "Drop",
      "Amount",
      "Created",
      // "Remark",
      "Status",
    ],
  },
  2: {
    endpoint: "/ambulance/get_regular_ambulance_booking_list",
    headers: [
      "S.No.",
      "ID",
      "Type",
      "Consumer",
      "Category",
      "Schedule",
      "Pickup",
      "Drop",
      "Amount",
      "Created",
      // "Remark",
      "Status",
    ],
  },
  3: {
    endpoint: "/ambulance/get_rental_ambulance_booking_list",
    headers: [
      "S.No.",
      "ID",
      "Type",
      "Consumer",
      "Category",
      "Schedule",
      "Pickup",
      "Drop",
      "Amount",
      "Created",
      // "Remark",
      "Status",
    ],
  },
  4: {
    endpoint: "/ambulance/get_bulk_ambulance_booking_list",
    headers: [
      "S.No.",
      "ID",
      "Type",
      "Consumer",
      "Category",
      "Schedule",
      "Pickup",
      "Drop",
      "Amount",
      "Created",
      // "Remark",
      "Status",
    ],
  },
};

type ExportDataWithButtonsProps = {
  tabKey: number;
  refreshFlag: number;
  onAddNew: () => void;
  onEditRow?: (rowData: any) => void;
  onDataChanged?: () => void;
  filterParams?: Record<string, any>;
};

const ExportDataWithButtons = ({
  tabKey,
  refreshFlag,
  onAddNew,
  // onEditRow,
  onDataChanged,
  filterParams = {},
}: ExportDataWithButtonsProps) => {
  const navigate = useNavigate();
  const [tableData, setTableData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const tableRef = useRef<any>(null);
  const [selectedConsumerId, setSelectedConsumerId] = useState<number | null>(
    null
  );
  const [isRemarkOpen, setIsRemarkOpen] = useState(false);

  const [pageSize] = useState(10);
  const [_total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const baseURL = (import.meta as any).env?.VITE_PATH ?? "";

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

  const { endpoint, headers } = tableConfig[tabKey];

  // Updated status options to match backend statuses
  const statusFilterOptions = [
    { label: "Enquery", value: "enquery" },
    { label: "Confirm Booking", value: "confirmBooking" },
    { label: "Driver Assign", value: "driverAssign" },
    { label: "Invoice", value: "invoice" },
    { label: "Complete", value: "complete" },
    { label: "Cancel", value: "cancel" },
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = getFilterParams(pageSize, filterParams);
      const res = await axios.get(`${baseURL}${endpoint}`, { params });
      // console.log("API Response:", res.data);

      let dataArray: any[] = [];
      let bookings_id: any[] = [];

      if (tabKey === 1) {
        dataArray = res.data?.jsonData?.booking_list || [];
        bookings_id = res.data?.jsonData?.booking_list?.booking_id || [];
      } else if (tabKey === 2) {
        dataArray = res.data?.jsonData?.regular_ambulance_booking_list || [];
        bookings_id =
          res.data?.jsonData?.regular_ambulance_booking_list?.booking_id || [];
      } else if (tabKey === 3) {
        dataArray = res.data?.jsonData?.rental_ambulance_booking_list || [];
        bookings_id =
          res.data?.jsonData?.rental_ambulance_booking_list?.booking_id || [];
      } else if (tabKey === 4) {
        dataArray = res.data?.jsonData?.bulk_ambulance_booking_list || [];
        bookings_id =
          res.data?.jsonData?.bulk_ambulance_booking_list?.booking_id || [];
      }
      console.log("Bookings IDs:", bookings_id);

      // Ensure data is an array and has proper structure
      const validData = Array.isArray(dataArray) ? dataArray : [];
      setTableData(validData);

      if (res.data.pagination) {
        setTotal(res.data.pagination.total);
        setTotalPages(res.data.pagination.totalPages);
      } else {
        setTotal(validData.length);
        setTotalPages(Math.ceil(validData.length / pageSize));
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setTableData([]);
      setTotal(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
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

  const handleRemark = (rowData: any) => {
    const id = rowData?.booking_id;
    setSelectedConsumerId(id);
    setIsRemarkOpen(true);
  };

  const handleRemarkSuccess = () => {
    fetchData();
    onDataChanged?.();
  };

  const columnsWithActions = [
    ...bookingColumns,
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
              className="eye-icon"
              onClick={() => {
                navigate(`/ambulance/booking/details/${rowData.booking_id}`);
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
        title={
          <div className="w-100">
            {tabKey === 1
              ? "All Ambulance Bookings"
              : tabKey === 2
              ? "Regular Ambulance Bookings"
              : tabKey === 3
              ? "Rental Ambulance Bookings"
              : tabKey === 4
              ? "Bulk Ambulance Bookings"
              : ""}
          </div>
        }
        className="mb-2"
        headerActions={
          <div className="d-flex gap-2 align-items-center">
            <TableFilters
              dateFilter={dateFilter}
              statusFilter={statusFilter}
              dateRange={dateRange}
              onDateFilterChange={handleDateFilterChange}
              onStatusFilterChange={handleStatusFilterChange}
              onDateRangeChange={handleDateRangeChange}
              statusOptions={statusFilterOptions}
              showDateRange={true}
              showDateFilter={true}
              showStatusFilter={true}
              dateFilterPlaceholder="Quick filter"
              dateRangePlaceholder="Custom date range"
              statusFilterPlaceholder="Status"
            />
            {tabKey === 1 && (
              <button
                className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
                onClick={onAddNew}
              >
                Add New <TbArrowRight className="fs-5" />
              </button>
            )}
          </div>
        }
      >
        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <DataTable
              ref={tableRef}
              key={`ambulance-booking-table-${tabKey}-${dateFilter}-${statusFilter}-${dateRange}-${currentPage}`}
              data={tableData}
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
                  {
                    extend: "copyHtml5",
                    className: "btn btn-sm btn-primary",
                    text: "Copy",
                  },
                  {
                    extend: "excelHtml5",
                    className: "btn btn-sm btn-primary",
                    text: "Excel",
                  },
                  {
                    extend: "csvHtml5",
                    className: "btn btn-sm btn-primary",
                    text: "CSV",
                  },
                  {
                    extend: "pdfHtml5",
                    className: "btn btn-sm btn-primary",
                    text: "PDF",
                  },
                ],
              }}
              className="table table-striped dt-responsive align-middle mb-0"
            >
              <thead className="thead-sm text-capitalize fs-xxs">
                <tr>
                  {headers.map((header, idx) => (
                    <th key={idx}>{header}</th>
                  ))}
                </tr>
              </thead>
            </DataTable>

            <TablePagination
              start={currentPage + 1}
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
        remarkCategoryType={REMARK_CATEGORY_TYPES.AMBULANCE_BOOKING}
        primaryKeyId={selectedConsumerId}
        onSuccess={handleRemarkSuccess}
      />
    </>
  );
};

export default ExportDataWithButtons;
