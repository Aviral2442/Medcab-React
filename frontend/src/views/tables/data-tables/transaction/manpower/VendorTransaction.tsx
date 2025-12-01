import { useEffect, useState, useRef } from "react";
import ComponentCard from "@/components/ComponentCard";
import "@/global.css";
import DT from "datatables.net-bs5";
import DataTable from "datatables.net-react";
import "datatables.net-buttons-bs5";
import "datatables.net-buttons/js/buttons.html5";
import { TbEye} from "react-icons/tb";
import jszip from "jszip";
import pdfmake from "pdfmake";
import { createRoot } from "react-dom/client";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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
    endpoint: "/transaction/vendor_transaction_list",
    headers: [
    "S.No.",
    "ID",
    "Transaction By",
    "Amount",
    "Pay ID",
    "Type",
    "Prev Amt",
    "New Amt",
    "Note",
    "Time",
    "Created At",
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
  const navigate = useNavigate();
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

      // Fix: Changed from partnerTransactions to consumerTransactions
      const transactions = res.data?.jsonData?.transactions || [];
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

  const getTransactionByType = (type: number | string): string => {
    const typeNum = Number(type);
    switch (typeNum) {
        case 1:
            return "add-in wallet(A)";
        case 2:
            return "cancelation charge(W)";
        case 3:
            return " Cash Collect(W)";
        case 4:
            return "online booking payment(A)";
        case 5: 
            return "for transfer to bank account (W)";
        case 6:
            return "fetched by Partner (W)";
        case 7: 
            return "Incentive from Company(A)";
        case 8:
            return "Debit agains Accept Booking Charge (W)";
        case 9:
            return "Refund agains Accept Booking Cancel (A)";
        default:
            return `${type || "N/A"}`;
    }
  };

  const getTransactionType = (type: number | string): string => {
    const typeNum = Number(type);
    switch (typeNum) {
      case 0:
        return "Direct Driver";
      case 1:
        return "Partner";
      case 2:
        return "Company";
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
      data: "vendor_transection_id",
      render: (data: any) => (data ? data : "N/A"),
    },
    {
      title: "Transaction By",
      data: "vendor_name",
      render: (_data: any, _type: any, row: any) => {
        const name = row?.vendor_name;
        const mobile = row?.vendor_mobile;
        const parts: string[] = [];
        if (name) parts.push(`<strong>${name}</strong>`);
        if (mobile) parts.push(`<small class="text-muted">${mobile}</small>`);
        return parts.length ? parts.join("<br/>") : "N/A";
      },
    },
    {
        title: "By Type",
        data: "vendor_transection_by_type",
        render: (data: any) => getTransactionByType(data),
    },
    {
      title: "Amount",
      data: "vendor_transection_amount",
      render: (data: any) =>
        data !== null && data !== undefined && data !== ""
          ? `₹ ${formatValue(data)}`
          : "-",
    },
    {
      title: "Pay ID",
      data: "vendor_transection_pay_id",
      render: (data: any) => (data ? data : "-"),
    },
    {
      title: "Type",
      data: "vendor_transection_type",
      render: (data: any) => getTransactionType(data),
    },
    {
      title: "Prev Amt",
      data: "vendor_transection_wallet_previous_amount",
      render: (data: any) =>
        data !== null && data !== undefined && data !== ""
          ? `₹ ${formatValue(data)}`
          : "-",
    },
    {
      title: "New Amt",
      data: "vendor_transection_wallet_new_amount",
      render: (data: any) =>
        data !== null && data !== undefined && data !== ""
          ? `₹ ${formatValue(data)}`
          : "-",
    },
    {
      title: "Note",
      data: "vendor_transection_note",
      render: (data: any) => (data ? data : "-"),
    },
    {
      title: "Time",
      data: "vendor_transection_time_unix",
      render: (data: any) => (data ? formatDate(data) : "-"),
    },
    {
      title: "Created At",
      data: "vendor_created_at",
      render: (data: any) => (data ? formatDate(data) : "-"),
    },
    {
        title: "Wallet Status",
        data: "vendor_transection_by_partner_wallet_status",
        render: (data: any) => {
            switch (data) {
                case 0:
                    return '<span class="badge badge-label badge-soft-secondary">Online</span>';
                case 1:
                    return '<span class="badge badge-label badge-soft-success">Partner Wallet</span>';
                case 2:
                    return '<span class="badge badge-label badge-soft-danger">Withdrawal</span>';
                default:
                    return `<span class="badge badge-label badge-soft-secondary">${data || "N/A"}</span>`;
            }
        }
    },
    {
      title: "Status",
      data: "vendor_transection_status",
      render: (data: any) => getTransactionStatus(data),
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
            <button
              className="eye-icon"
              onClick={() => {
                // Fix: Navigate to consumer details instead of partner details
                navigate(`/consumer-details/${rowData.consumer_transection_consumer_id}`);
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
                  <th>Actions</th>
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
