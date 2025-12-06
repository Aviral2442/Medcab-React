import { useEffect, useState } from "react";
import ComponentCard from "@/components/ComponentCard";
import "@/global.css";
import DT from "datatables.net-bs5";
import DataTable from "datatables.net-react";
import "datatables.net-buttons-bs5";
import "datatables.net-buttons/js/buttons.html5";

import { TbArrowRight, TbEdit, TbReceipt } from "react-icons/tb";

import jszip from "jszip";
import pdfmake from "pdfmake";
import { vehicleColumns } from "@/views/tables/data-tables/ambulance/vehicle/components/vehical";
import { createRoot } from "react-dom/client";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AddRemark, { REMARK_CATEGORY_TYPES } from "@/components/AddRemark";
import TablePagination from "@/components/table/TablePagination";
import TableFilters from "@/components/table/TableFilters";
import { useTableFilters } from "@/hooks/useTableFilters";

// Register DataTable plugins
DataTable.use(DT);
DT.Buttons.jszip(jszip);
DT.Buttons.pdfMake(pdfmake);

const tableConfig: Record<
  number,
  { endpoint: string; columns: any[]; headers: string[] }
> = {
  1: {
    endpoint: "/vehicle/get_vehicle_list",
    columns: vehicleColumns,
    headers: [
      "S.No.",
      "ID",
      "Added By",
      "Added Type",
      "Name",
      "Category",
      // "Verify Type",
      "Verify Date",
      "Exp Date",
      "Created At",
      "Status",
    ],
  },
};

type ExportDataWithButtonsProps = {
  tabKey: number;
  refreshFlag: number;
  onAddNew?: () => void;
  filterParams?: Record<string, any>;
  onDataChanged?: () => void;
};

const ExportDataWithButtons = ({
  tabKey,
  refreshFlag,
  onAddNew,
  filterParams = {},
  onDataChanged,
}: ExportDataWithButtonsProps) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isRemarkOpen, setIsRemarkOpen] = useState(false);
  const [selectedVehicalId, SetSelectedVehicalId] = useState<number | null>(
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
    { label: "unverified", value: 0 },
    { label: "verified", value: 1 },
    { label: "inactive", value: 2 },
    { label: "deleted", value: 3 },
    { label: "verification", value: 4 },
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = getFilterParams(pageSize, filterParams);
      const res = await axios.get(`${baseURL}${endpoint}`, { params });
      console.log("API Response:", res.data);

      // Accept either 'vehicle_list' or 'vehicles'
      const vehicles =
        res.data?.jsonData?.vehicle_list || res.data?.jsonData?.vehicles || [];
      console.log("Fetched Vehicle Data:", vehicles);
      setData(vehicles);

      if (res.data?.paginations) {
        setTotal(res.data?.paginations?.total);
        setTotalPages(res.data?.paginations?.totalPages);
      } else {
        setTotal(res.data?.total);
        setTotalPages(
          res.data?.pagination?.totalPages ||
            Math.ceil(vehicles.length / pageSize)
        );
      }
    } catch (error) {
      console.error("Error fetching vehicle data:", error);
      setData([]);
      setTotal(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  const handleRemark = (rowData: any) => {
    const id = rowData?.vehicle_id;
    console.log("Selected Vehicle ID for Remark:", id);
    SetSelectedVehicalId(id);
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
              className="edit-icon p-0 p-1 text-white rounded-1 d-flex align-items-center justify-content-center"
              onClick={() => {
                navigate(`/ambulance/vehicle/edit/${rowData.vehicle_id}`);
              }}
            >
              <TbEdit className="me-1" />
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

  const headersWithActions = [...headers, "Actions"];

  return (
    <>
      <ComponentCard
        title={tabKey === 1 ? "Manage Vehicles" : ""}
        className="mb-2 overflow-x-auto"
        headerActions={
          <div className="d-flex gap-2 align-items-center">
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
              className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1 text-nowrap"
              onClick={onAddNew}
            >
              Add New <TbArrowRight className="fs-6" />
            </button>
          </div>
        }
      >
        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <DataTable
              key={`vehicle-table-${tabKey}-${dateFilter}-${statusFilter}-${dateRange}-${currentPage}`}
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
                  {headersWithActions.map((header, idx) => (
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
        remarkCategoryType={REMARK_CATEGORY_TYPES.VEHICLE}
        primaryKeyId={selectedVehicalId}
        onSuccess={handleRemarkSuccess}
      />
    </>
  );
};

export default ExportDataWithButtons;
