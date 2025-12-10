import { useEffect, useState, useRef } from "react";
import ComponentCard from "@/components/ComponentCard";
import "@/global.css";
import DT from "datatables.net-bs5";
import DataTable from "datatables.net-react";
import "datatables.net-buttons-bs5";
import "datatables.net-buttons/js/buttons.html5";
import jszip from "jszip";
import pdfmake from "pdfmake";
import axios from "axios";
import TablePagination from "@/components/table/TablePagination";
import TableFilters from "@/components/table/TableFilters";
import { useTableFilters } from "@/hooks/useTableFilters";
import _pdfMake from "pdfmake/build/pdfmake";
import _pdfFonts from "pdfmake/build/vfs_fonts";
import { formatDate } from "@/components/DateFormat";



DataTable.use(DT);
DT.Buttons.jszip(jszip);
DT.Buttons.pdfMake(pdfmake);

const tableConfig: Record<number, { endpoint: string; headers: string[] }> = {
  1: {
    endpoint: "/transaction/consumer_transaction_list",
    headers: [
      "S.No.",
      "ID",
      "Name",
      "Mobile",
      "Pay ID",
      "Amount",
      "Prev Amt",
      "New Amt",
      "Note",
      "Time",
      "Status",
    ],
  },
};

type ExportDataWithButtonsProps = {
  tabKey: number;
  refreshFlag: number;
  filterParams?: Record<string, any>;
  _onDataChanged?: () => void;
};

const ExportDataWithButtons = ({
  tabKey,
  refreshFlag,
  filterParams = {},
}: ExportDataWithButtonsProps) => {
  const [tableData, setTableData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const tableRef = useRef<any>(null);

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

  const statusFilterOptions = [
    { label: "Default", value: "0" },
    { label: "Pending Withdrawal", value: "1" },
    { label: "Refunded", value: "2" },
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = getFilterParams(pageSize, filterParams);
      const res = await axios.get(`${baseURL}${endpoint}`, { params });
      console.log("API Response:", res.data);

      const transactions = res.data?.jsonData?.consumerTransactions || [];
      setTableData(transactions);

      if (res.data?.paginations) {
        setTotal(res.data.paginations.total);
        setTotalPages(res.data.paginations.totalPages);
      } else if (res.data?.pagination) {
        setTotal(res.data.pagination.total);
        setTotalPages(res.data.pagination.totalPages);
      } else {
        setTotal(transactions.length);
        setTotalPages(Math.ceil(transactions.length / pageSize));
      }
    } catch (error) {
      console.error("Error fetching transaction data:", error);
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

  const formatValue = (val: any): string => {
    if (val === null || val === undefined || val === "") return "";
    const num = parseFloat(val);
    if (isNaN(num)) return String(val);
    const fixed = num.toFixed(2);
    const [intPart, decPart] = fixed.split(".");
    const formatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `${formatted}.${decPart}`;
  };

  const getTransactionStatus = (status: number | string): string => {
    const statusNum = Number(status);
    switch (statusNum) {
      case 0:
        return '<span class="badge badge-label badge-soft-secondary">Default</span>';
      case 1:
        return '<span class="badge badge-label badge-soft-warning">Pending Withdrawal</span>';
      case 2:
        return '<span class="badge badge-label badge-soft-success">Refunded</span>';
      default:
        return `<span class="badge badge-label badge-soft-secondary">${
          status || "N/A"
        }</span>`;
    }
  };

  const columns = [
    {
      title: "S.No.",
      data: null,
      orderable: false,
      searchable: false,
      render: (_data: any, _type: any, _row: any, meta: any) =>
        currentPage * pageSize + meta.row + 1,
    },
    {
      title: "ID",
      data: "consumer_transection_id",
      render: (data: any) => (data ? data : "N/A"),
    },
    {
      title: "Name",
      data: "consumer_name",
      render: (_data: any, _type: any, row: any) => {
        const name = row?.consumer_name;
        const url = `/consumer-details/${row.consumer_transection_done_by}`;
        return name
          ? `<a href="${url}">${name}</a>`
          : "N/A";
      },
    },
    {
      title: "Mobile",
      data: "consumer_mobile_no",
      render: (data: any, _type: any, row: any) => {
        const mobile = data;
        const url = `/consumer-details/${row.consumer_transection_done_by}`;
        return mobile
          ? `<a href="${url}">${mobile}</a>`
          : "N/A";
      }
    },
    {
      title: "Pay ID",
      data: "consumer_transection_payment_id",
      render: (data: any) => (data ? data : "-"),
    },
        {
      title: "Prev Amt",
      data: "consumer_transection_previous_amount",
      render: (data: any) =>
        data !== null && data !== undefined && data !== ""
          ? `₹${formatValue(data)}`
          : "-",
    },
    {
      title: "Amount",
      data: "consumer_transection_amount",
      render: (data: any, _type: any, row: any) => {
        switch (row.consumer_transection_type_cr_db) {
          case "0":
            return `<span class="badge badge-soft-success">₹ ${formatValue(
              data
            )}</span>`;
          case "1":
            return `<span class="badge badge-soft-danger">₹ ${formatValue(
              data
            )}</span>`;
          case "2":
            return `<span class="badge badge-soft-info">₹ ${formatValue(
              data
            )}</span>`;
          case "3":
            return `<span class="badge badge-soft-primary">₹ ${formatValue(
              data
            )}</span>`;
          case "4":
            return `<span class="badge badge-soft-warning">₹ ${formatValue(
              data
            )}</span>`;
          default:
            return `₹ ${formatValue(data)}`;
        }
      },
    },

    {
      title: "New Amt",
      data: "consumer_transection_new_amount",
      render: (data: any) =>
        data !== null && data !== undefined && data !== ""
          ? `₹${formatValue(data)}`
          : "-",
    },
    {
      title: "Note",
      data: "consumer_transection_note",
      render: (data: any) => (data ? data : "-"),
    },
    {
      title: "Status",
      data: "consumer_transection_status",
      render: (data: any) => getTransactionStatus(data),
    },
    {
      title: "Time",
      data: "consumer_transection_time",
      render: (data: any) => (data ? formatDate(data) : "-"),
    },
  ];

  return (
    <>
      <ComponentCard
        title={
          <div className="w-100 ">
            {/* Fix: Changed title to Consumer Transaction List */}
            {tabKey === 1 ? "Consumer Transaction List" : ""}
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
            />
          </div>
        }
      >
        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <DataTable
              ref={tableRef}
              key={`transaction-table-${tabKey}-${dateFilter}-${statusFilter}-${dateRange}-${currentPage}`}
              data={tableData}
              columns={columns}
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
    </>
  );
};

export default ExportDataWithButtons;
