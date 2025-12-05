import { useEffect, useState } from "react";
import ComponentCard from "@/components/ComponentCard";
import '@/global.css';
import DT from "datatables.net-bs5";
import DataTable from "datatables.net-react";
import "datatables.net-buttons-bs5";
import "datatables.net-buttons/js/buttons.html5";

import { TbEye, TbReceipt } from "react-icons/tb";

import jszip from "jszip";
import pdfmake from "pdfmake";
import { vendorColumns } from "@/views/tables/data-tables/manpower/vendor/components/vendor";
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
    endpoint: "/vendor/vendors_list",
    columns: vendorColumns,
    headers: [
      "S.No.",
      "ID",
      "Picture",
      "Name",
      "Mobile",
      "Gender",
      "City",
      "Category ",
      "Date",
      "Remark",
      "Status",
    ],
  },
};

type ExportDataWithButtonsProps = {
  tabKey: number;
  refreshFlag: number;
  filterParams?: Record<string, any>;
  onDataChanged?: () => void;
};

const ExportDataWithButtons = ({
  tabKey,
  refreshFlag,
  filterParams = {},
  onDataChanged,
}: ExportDataWithButtonsProps) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isRemarkOpen, setIsRemarkOpen] = useState(false);
  const [selectedVendorId, setSelectedVendorId] = useState<number | null>(null);

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
    { label: "Active", value: "active" },
    { label: "Blocked", value: "block" },
    { label: "New", value: "new" },
    { label: "Pending Approval", value: "pendingApproval" },
    { label: "Assigned", value: "assign" },
    { label: "Free", value: "free" },
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = getFilterParams(pageSize, filterParams);
      const res = await axios.get(`${baseURL}${endpoint}`, { params });
      console.log("API Response:", res.data);

      const vendors = res.data?.jsonData || [];
      setData(vendors);

      if (res.data.pagination) {
        setTotal(res.data.pagination.total);
        setTotalPages(res.data.pagination.totalPages);
      } else {
        setTotal(
          res.data?.jsonData?.total || res.data?.total || vendors.length
        );
        setTotalPages(
          res.data?.jsonData?.totalPages ||
            res.data?.totalPages ||
            Math.ceil(vendors.length / pageSize)
        );
      }
    } catch (error) {
      console.error("Error fetching vendor data:", error);
      setData([]);
      setTotal(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  const handleRemark = (rowData: any) => {
    const id = rowData?.vendor_id ?? rowData?.id;
    setSelectedVendorId(id);
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
                      <button className="eye-icon p-1"
                        onClick={() => {
                          navigate(`/vendor-details/${rowData.vendor_id}`);
                        }}
                      >
                        <TbEye className="me-1" />
                      </button>
                        <button className="remark-icon" onClick={() => handleRemark(rowData)}>
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
        title={tabKey === 1 ? "Manage Vendor" : ""}
        className="mb-2"
        headerActions={
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
        }
      >
        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <DataTable
              key={`vendor-table-${tabKey}-${dateFilter}-${statusFilter}-${dateRange}-${currentPage}`}
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
        remarkCategoryType={REMARK_CATEGORY_TYPES.MANPOWER_VENDOR}
        primaryKeyId={selectedVendorId}
        onSuccess={handleRemarkSuccess}
      />
    </>
  );
};

// Export the component directly
export default ExportDataWithButtons;
