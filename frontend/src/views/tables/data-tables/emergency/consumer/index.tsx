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
import { consumerColumns } from "@/views/tables/data-tables/consumer-data/consumer/consumer.ts";
import { createRoot } from "react-dom/client";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AddRemark, { REMARK_CATEGORY_TYPES } from "@/components/AddRemark";
import TablePagination from "@/components/table/TablePagination";
import TableFilters from "@/components/table/TableFilters";
import { useTableFilters } from "@/hooks/useTableFilters";
import _pdfMake from "pdfmake/build/pdfmake";
import _pdfFonts from "pdfmake/build/vfs_fonts";

// Register DataTable plugins
DataTable.use(DT);
DT.Buttons.jszip(jszip);
DT.Buttons.pdfMake(pdfmake);

const tableConfig: Record<
  number,
  { endpoint: string; columns: any[]; headers: string[] }
> = {
  1: {
    endpoint: "/consumer_emergency_list",
    columns: consumerColumns,
    headers: [
      "S.No.",
      "ID",
      "consumer id",
      "booking id",
      "request time",
      "created at",
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
  const [selectedConsumerId, setSelectedConsumerId] = useState<number | null>(
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

  const { endpoint, headers } = tableConfig[tabKey];

  const StatusFilterOptions = [
    { label: "New User", value: "newUser" },
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = getFilterParams(pageSize, filterParams);
      const res = await axios.get(`${baseURL}${endpoint}`, { params });
      console.log("API Response:", res.data);

      const consumers = res.data?.jsonData?.consumer_emergency_list
 || [];
      setData(consumers);

      if (res.data.pagination) {
        setTotal(res.data.pagination.total);
        setTotalPages(res.data.pagination.totalPages);
      } else {
        setTotal(res.data?.total || consumers.length);
        setTotalPages(
          res.data?.totalPages || Math.ceil(consumers.length / pageSize)
        );
      }
    } catch (error) {
      console.error("Error fetching consumer data:", error);
      setData([]);
      setTotal(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  const handleRemark = (rowData: any) => {
    const id = rowData?.consumer_id ?? rowData?.id;
    console.log("Selected Consumer ID for Remark:", id);
    setSelectedConsumerId(id);
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
    {
        title: "ID",
        data: "consumer_emergency_id",
        render: (data: any) => data || "N/A",
      },
    {
        title: "consumer Id",
        data: "consumer_emergency_consumer_id",
        render: (data: any) => data || "N/A",
      },
      {
        title: "booking id",
        data: "consumer_emergency_booking_id",
        render: (data: any) => data || "N/A",
      },
      {
        title: "request time",
        data: "consumer_emergency_request_timing",
        render: (data: any) => data || "N/A",
      },
      {
        title: "created at",
        data: "driver_emergency_created_at",
        render: (data: any) => {
            const date = new Date(data);
            return date.toLocaleDateString() || "N/A";
        }
      },
      {
        title: "status",
        data: "consumer_emergency_status",
        render: (data: any) => {
            switch (data) {
                case 0:
                    return "Emergency";
                default:
                    return "N/A";
            }
        },
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
          <div className="d-flex flex-row gap-1">
            <button className="eye-icon p-1"
              onClick={() => {
                navigate(`/consumer-details/${rowData.consumer_id}`);
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
        title={tabKey === 1 ? "Manage Consumer" : ""}
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
          />
        }
        >
        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <DataTable
              key={`consumer-table-${tabKey}-${dateFilter}-${statusFilter}-${dateRange}-${currentPage}`}
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
                // dom: 'Bfrtip', // Add this line to display buttons
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
              className="table table-striped dt-responsive align-middle mb-0 "
            >
              <thead className="thead-sm text-capitalize fs-xxs">
                <tr>
                  {headers.map((header, idx) => (
                    <th key={idx}>{header}</th>
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
        remarkCategoryType={REMARK_CATEGORY_TYPES.EMERGENCY_CONSUMER}
        primaryKeyId={selectedConsumerId}
        onClose={() => setIsRemarkOpen(false)}
        onSuccess={handleRemarkSuccess}
      />
    </>
  );
};

export default ExportDataWithButtons;
