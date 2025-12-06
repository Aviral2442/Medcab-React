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
    endpoint: "/partner/get_partner_transactions_list",
    headers: [
      "S.No.",
      "ID",
      "Name",
      "Mobile",
      "Pay ID",
      "Type",
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

      const transactions = res.data?.jsonData?.partnerTransactions || [];
      setTableData(transactions);

      if (res.data.paginations) {
        setTotal(res.data.paginations.total);
        setTotalPages(res.data.paginations.totalPages);
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

  const getTransactionType = (type: number | string): string => {
    const typeNum = Number(type);
    switch (typeNum) {
      case 1:
        return "Add in Wallet"; //credit
      case 2:
        return "Transfer to Bank"; //debit
      case 3:
        return "Fetch from Driver"; //gray
      default:
        return `${type || "N/A"}`;
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
      data: "partner_transection_id",
      render: (data: any) => (data ? data : "N/A"),
    },
    {
      title: "Name",
      data: "partner_f_name",
      render: (_data: any, _type: any, row: any) => {
        const first = row?.partner_f_name;
        const last = row?.partner_l_name;
        const url = `/partner-detail/${row.partner_transection_by}`;
        const fullName = [first, last].filter(Boolean).join(" ");
        return fullName ? `<a href="${url}">${fullName}</a>` : "N/A";
      },
    },
    {
      title: "Mobile",
      data: "partner_mobile",
      render: (data: any, _type: any, row: any) => {
        const mobile = data;
        const url = `/partner-detail/${row.partner_transection_by}`;
        return mobile ? `<a href="${url}">${mobile}</a>` : "N/A";
      },
    },
    {
      title: "Pay ID",
      data: "partner_transection_pay_id",
      render: (data: any) => (data ? data : "-"),
    },
    {
      title: "Type",
      data: "partner_transection_type",
      render: (data: any) => getTransactionType(data),
    },
    {
      title: "Prev Amt",
      data: "partner_transection_wallet_previous_amount",
      render: (data: any) =>
        data !== null && data !== undefined && data !== ""
          ? `₹ ${formatValue(data)}`
          : "-",
    },
    {
      title: "Amount",
      data: "partner_transection_amount",
      render: (data: any, _type: any, row: any) => {
        switch (row.partner_transection_type) {
          case "1":
            return `<span class="badge badge-soft-success">₹ ${formatValue(
              data
            )}</span>`;
          case "2":
            return `<span class="badge badge-soft-danger">₹ -${formatValue(
              data
            )}</span>`;
          case "3":
            return `<span class="badge badge-soft-primary">₹ ${formatValue(
              data
            )}</span>`;
          default:
            return `₹${formatValue(data)}`;
        }
      },
    },

    {
      title: "New Amt",
      data: "partner_transection_wallet_new_amount",
      render: (data: any) =>
        data !== null && data !== undefined && data !== ""
          ? `₹ ${formatValue(data)}`
          : "-",
    },
    {
      title: "Note",
      data: "partner_transection_note",
      render: (data: any) => (data ? data : "-"),
    },
    {
      title: "Status",
      data: "partner_transection_status",
      render: (data: any) => getTransactionStatus(data),
    },
    {
      title: "Time",
      data: "partner_transection_time_unix",
      render: (data: any) => (data ? formatDate(data) : "-"),
    },
  ];

  return (
    <>
      <ComponentCard
        title={
          <div className="w-100 ">
            {tabKey === 1 ? "Partner Transaction List" : ""}
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
                    exportOptions: {
                      columns: ":not(:last-child)",
                    },
                  },
                  {
                    extend: "excelHtml5",
                    className: "btn btn-sm btn-primary",
                    text: "Excel",
                    exportOptions: {
                      columns: ":not(:last-child)",
                    },
                  },
                  {
                    extend: "csvHtml5",
                    className: "btn btn-sm btn-primary",
                    text: "CSV",
                    exportOptions: {
                      columns: ":not(:last-child)",
                    },
                  },
                  {
                    extend: "pdfHtml5",
                    className: "btn btn-sm btn-primary",
                    text: "PDF",
                    exportOptions: {
                      columns: ":not(:last-child)",
                    },
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
