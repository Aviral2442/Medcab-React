import { useEffect, useState } from "react";
import ComponentCard from "@/components/ComponentCard";
import DT from "datatables.net-bs5";
import DataTable from "datatables.net-react";
import "datatables.net-buttons-bs5";
import "datatables.net-buttons/js/buttons.html5";
import "@/global.css";

import { TbArrowRight } from "react-icons/tb";

import jszip from "jszip";
import pdfmake from "pdfmake";
import { driverColumns } from "@/views/tables/data-tables/ambulance/driver-location/components/driver-location";
import { createRoot } from "react-dom/client";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import TablePagination from "@/components/table/TablePagination";
import TableFilters from "@/components/table/TableFilters";
import { useTableFilters } from "@/hooks/useTableFilters";
import { FaMapMarkerAlt } from "react-icons/fa";

// Register DataTable plugins
DataTable.use(DT);
DT.Buttons.jszip(jszip);
DT.Buttons.pdfMake(pdfmake);

const tableConfig: Record<
  number,
  { endpoint: string; columns: any[]; headers: string[] }
> = {
  1: {
    endpoint: "/driver/driver_on_off_data",
    columns: driverColumns,
    headers: [
      "S.No.",
      "ID",
      "Name",
      "Mobile",
      "Vehicle",
      "VRC Number",
      "Wallet",
      "Created At",
      "Duty",
      "Status",
    ],
  },
};

type ExportDataWithButtonsProps = {
  tabKey: number;
  refreshFlag: number;
  onMap?: () => void;
  filterParams?: Record<string, any>;
  onDataChanged?: () => void;
};

const ExportDataWithButtons = ({
  tabKey,
  refreshFlag,
  onMap = () => {},
  filterParams = {},
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

  const { endpoint, columns, headers } = tableConfig[tabKey];

  const StatusFilterOptions = [
    { label: "On", value: "ON" },
    { label: "Off", value: "OFF" },
    { label: "New", value: 0 },
    { label: "Active", value: 1 },
    { label: "Inactive", value: 2 },
    { label: "Deleted", value: 3 },
    { label: "Verification", value: 4 },
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = getFilterParams(pageSize, filterParams);
      const res = await axios.get(`${baseURL}${endpoint}`, { params });
      console.log("API Response:", res.data);

      const drivers = res.data?.jsonData?.driverOnOffData || [];
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
          <div className="d-flex gap-1 align-content-center">
            <button
              className="eye-icon p-1"
              onClick={() => {
                navigate(`/ambulance/driver-duty/${rowData.driver_id}`);
              }}
            >
              <FaMapMarkerAlt className="me-1" />
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
              onStatusFilterChange={handleStatusFilterChange}
              onDateRangeChange={handleDateRangeChange}
              statusOptions={StatusFilterOptions}
              className="w-100"
            />
            <button
              className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
              onClick={onMap}
            >
              Map <TbArrowRight className="fs-5" />
            </button>
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
