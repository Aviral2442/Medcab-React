import { useEffect, useState } from "react";
import ComponentCard from "@/components/ComponentCard";
import DT from "datatables.net-bs5";
import DataTable from "datatables.net-react";
import "datatables.net-buttons-bs5";
import "datatables.net-buttons/js/buttons.html5";
import "@/global.css";

import { TbEye } from "react-icons/tb";

import jszip from "jszip";
import pdfmake from "pdfmake";
import { createRoot } from "react-dom/client";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import TablePagination from "@/components/table/TablePagination";
import TableFilters from "@/components/table/TableFilters";
import { useTableFilters } from "@/hooks/useTableFilters";
import { formatDate } from "@/components/DateFormat";
import _pdfMake from "pdfmake/build/pdfmake";
import _pdfFonts from "pdfmake/build/vfs_fonts";

// Register DataTable plugins
DataTable.use(DT);
DT.Buttons.jszip(jszip);
DT.Buttons.pdfMake(pdfmake);

const tableConfig: Record<
  number,
  { endpoint: string; headers: string[] }
> = {
  1: {
    endpoint: "/driver/driver_on_off_data",
    headers: [
      "S.No.",
      "ID",
      "Name",
      "Mobile",
      "V Name",
      "VRC Number",
      "Created At",
      "Status",
    ],
  },
};

type ExportDataWithButtonsProps = {
  tabKey: number;
  refreshFlag: number;
  filterParams?: Record<string, any>;
  onDataChanged?: () => void;
  statusFilter?: string | null;
  onStatusFilterChange?: (value: string | null) => void;
};

const ExportDataWithButtons = ({
  tabKey,
  refreshFlag,
  filterParams = {},
  statusFilter: externalStatusFilter = null,
  onStatusFilterChange,
}: ExportDataWithButtonsProps) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

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

  // When parent provides external status filter, sync it into the table's hook state
  useEffect(() => {
    if (externalStatusFilter !== null && externalStatusFilter !== statusFilter) {
      handleStatusFilterChange(externalStatusFilter);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalStatusFilter]);

  // Whenever internal statusFilter changes, notify parent so Map can update
  useEffect(() => {
    if (onStatusFilterChange) {
      onStatusFilterChange(statusFilter as string | null);
    }
  }, [statusFilter, onStatusFilterChange]);

  const { endpoint, headers } = tableConfig[tabKey];

  const StatusFilterOptions = [
    { label: "On", value: "ON" },
    { label: "Off", value: "OFF" }
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      // Merge external filter params (like status from map) into getFilterParams
      const mergedParams = { ...filterParams };
      if (externalStatusFilter !== null && externalStatusFilter !== undefined) {
        mergedParams.status = externalStatusFilter;
      }
      const params = getFilterParams(pageSize, mergedParams);
      const res = await axios.get(`${baseURL}${endpoint}`, { params });
      console.log("API Response:", res.data);

      // support both shapes (driverOnOffData for on/off, driver_Live_Location_Data for live location)
      const drivers =
        res.data?.jsonData?.driverOnOffData ||
        res.data?.jsonData?.driver_Live_Location_Data ||
        [];
      setData(drivers);
      
      if (res.data.paginations) {
        setTotal(res.data.paginations.total);
        setTotalPages(res.data.paginations.totalPages);
      } else {
        setTotal(res.data?.total || drivers.length);
        setTotalPages(
          res.data?.totalPages || Math.ceil(drivers.length / pageSize)
        );
      }
    } catch (error) {
      console.error("Error fetching driver data:", error);
      setData([]);
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
    {
        title: "ID",
        data: "driver_id",
    },
    {
        title: "Name",
        data: "driver_name",
        render: (data: string, _type: any, row: any) => {
            return `${data} ${row.driver_last_name}`;
        }
    },
    {
        title: "Mobile",
        data: "driver_mobile",
    },
    {
        title: "V Name",
        data: "v_vehicle_name",
    },
    {
        title: "VRC Number",
        data: "vehicle_rc_number",
    },
    {
        title: "created_at",
        data: "created_at",
        render: (data: string) => {
            return formatDate(data);
        }
    },
    {
        title: "duty_status",
        data: "driver_duty_status",
        render: (data: any) => {
            if (data == 'OFF') {
                return `<span class="badge badge-label badge-soft-danger">OFF</span>`;
            } else {
                return `<span class="badge badge-label badge-soft-success">ON</span>`;
            }   
        }
    },
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
          <div className="d-flex gap-1 align-content-center">
            <button
              className="eye-icon p-1"
              onClick={() => {
                navigate(`/ambulance/driver-duty/${rowData.driver_id}`);
              }}
            >
              <TbEye className="me-1" />
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
            {tabKey === 1 ? "Driver Duty Location" : " "}
          </div>
        }
        className="mb-2 overflow-x-auto"
        headerActions={
          <div className="d-flex gap-2 align-content-center">
            <TableFilters
              dateFilter={dateFilter}
              statusFilter={statusFilter}
              dateRange={dateRange}
              onDateFilterChange={handleDateFilterChange}
              onStatusFilterChange={(v) => {
                handleStatusFilterChange(v);
                if (onStatusFilterChange) onStatusFilterChange(v);
              }}
              onDateRangeChange={handleDateRangeChange}
              statusOptions={StatusFilterOptions}
              showDateRange={true}
              showDateFilter={true}
              showStatusFilter={true}
              dateFilterPlaceholder="Quick filter"
              dateRangePlaceholder="Custom range"
              statusFilterPlaceholder="Status"
              className="w-100"
            />
          </div>
        }
      >
        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : (
          <div className="overflow-x-auto ">
            <DataTable
              key={`driver-table-${tabKey}-${dateFilter}-${statusFilter}-${dateRange}-${currentPage}`}
              data={data}
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
    </>
  );
};

export default ExportDataWithButtons;
