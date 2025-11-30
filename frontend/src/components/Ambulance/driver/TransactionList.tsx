import React, { useEffect, useRef } from "react";
import ComponentCard from "@/components/ComponentCard";
import DT from "datatables.net-bs5";
import DataTable from "datatables.net-react";
import "datatables.net-buttons-bs5";
import "datatables.net-buttons/js/buttons.html5";
import "datatables.net-responsive";
import jszip from "jszip";
import pdfmake from "pdfmake";
import "pdfmake/build/vfs_fonts";
import { formatDate } from "@/components/DateFormat";
import TablePagination from "@/components/table/TablePagination";
import { Spinner } from "react-bootstrap";
import { createRoot } from "react-dom/client";
import { TbEye } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

// Register plugins
DataTable.use(DT);
DT.Buttons.jszip(jszip);
DT.Buttons.pdfMake(pdfmake);

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface TransactionListProps {
  data: any[] | null;
  loading?: boolean;
  error?: string | null;
  pagination?: PaginationData;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  onViewTransaction?: (transaction: any) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({
  data,
  loading = false,
  error = null,
  pagination = { page: 1, limit: 10, total: 0, totalPages: 0 },
  currentPage = 0,
  onPageChange,
  onViewTransaction,
}) => {
  const tableRef = useRef<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (tableRef.current) {
      const api = tableRef.current.dt();
      if (api) {
        api.clear();
        if (data && Array.isArray(data)) {
          api.rows.add(data);
        }
        api.draw();
      }
    }
  }, [data]);

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

  const getWalletStatus = (status: number | string): string => {
    const statusNum = Number(status);
    switch (statusNum) {
      case 0:
        return '<span class="badge badge-label badge-soft-info">Online</span>';
      case 1:
        return '<span class="badge badge-label badge-soft-primary">From Partner Wallet</span>';
      case 2:
        return '<span class="badge badge-label badge-soft-danger">Withdrawal</span>';
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
        return "Add in Wallet (A)";
      case 2:
        return "Cancellation Charge (W)";
      case 3:
        return "Cash Collect (W)";
      case 4:
        return "Online Booking Payment (A)";
      case 5:
        return "Transfer to Bank (W)";
      case 6:
        return "Fetched by Partner (W)";
      case 7:
        return "Incentive from Company (A)";
      case 15:
        return "Tip from Consumer";
      default:
        return `${type || "N/A"}`;
    }
  };

  const getTransactionByType = (type: number | string): string => {
    const typeNum = Number(type);
    switch (typeNum) {
      case 0:
        return "Direct Driver";
      case 1:
        return "By Partner";
      case 2:
        return "By Company";
      case 3:
        return "Tip From Consumer";
      default:
        return `${type || "N/A"}`;
    }
  };

  const headers = [
    "S.No.",
    "ID",
    "Transaction By",
    "By Type",
    "Note",
    "Amount",
    "Type",
    "Status",
    "Wallet Status",
    "Prev Amt",
    "New Amt",
    "Time",
    "Actions",
  ];

  const columns = [
    {
      title: "S.No.",
      data: null,
      orderable: false,
      searchable: false,
      render: (_data: any, _type: any, _row: any, meta: any) =>
        currentPage * pagination.limit + meta.row + 1,
    },
    {
      title: "ID",
      data: "driver_transection_id",
      render: (data: any) => (data ? data : "N/A"),
    },
    {
      title: "Transaction By",
      data: "trans_by_name",
      render: (_data: any, _type: any, row: any) => {
        const name = row?.trans_by_name;
        const mobile = row?.trans_by_mobile;
        const parts: string[] = [];
        if (name) parts.push(`<strong>${name}</strong>`);
        if (mobile) parts.push(`<small class="text-muted">${mobile}</small>`);
        return parts.length ? parts.join("<br/>") : "N/A";
      },
    },
    {
      title: "By Type",
      data: "driver_transection_by_type",
      render: (data: any) => getTransactionByType(data),
    },
    {
      title: "Note",
      data: "driver_transection_note",
      render: (data: any) => (data ? data : "-"),
    },
    {
      title: "Amount",
      data: "driver_transection_amount",
      render: (data: any) =>
        data !== null && data !== undefined && data !== ""
          ? `₹ ${formatValue(data)}`
          : "",
    },
    {
      title: "Type",
      data: "driver_transection_type",
      render: (data: any) => getTransactionType(data),
    },
    {
      title: "Prev Amt",
      data: "driver_transection_wallet_previous_amount",
      render: (data: any) =>
        data !== null && data !== undefined && data !== ""
          ? `₹ ${formatValue(data)}`
          : "-",
    },
    {
      title: "New Amt",
      data: "driver_transection_wallet_new_amount",
      render: (data: any) =>
        data !== null && data !== undefined && data !== ""
          ? `₹ ${formatValue(data)}`
          : "-",
    },
    {
      title: "Date",
      data: "driver_transection_time_unix",
      render: (data: any) => (data ? formatDate(data) : "-"),
    },
    {
      title: "Wallet Status",
      data: "driver_transection_by_partner_wallet_status",
      render: (data: any) => getWalletStatus(data),
    },
    {
      title: "Status",
      data: "driver_transection_status",
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
                navigate(`/driver-transaction-details/${rowData.consumer_id}`);
              }}
            >
              <TbEye className="me-1" />
            </button>
          </div>
        );
      },
    },
  ];

  const tableData = data ? (Array.isArray(data) ? data : [data]) : [];
  const totalPages = pagination?.totalPages || 0;

  if (error) {
    return (
      <ComponentCard title="Driver Transactions">
        <div className="text-center p-4 text-danger">{error}</div>
      </ComponentCard>
    );
  }

  return (
    <ComponentCard title="Driver Transactions" className="mb-2">
      {loading ? (
        <div className="text-center p-4">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Loading transactions...</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <DataTable
            ref={tableRef}
            key={`driver-transaction-table-${currentPage}`}
            data={tableData}
            columns={columns}
            options={{
              responsive: true,
              destroy: true,
              paging: false,
              searching: true,
              info: false,
              ordering: true,
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

          {onPageChange && totalPages > 0 && (
            <TablePagination
              start={currentPage + 1}
              showInfo={true}
              previousPage={() => onPageChange(Math.max(0, currentPage - 1))}
              canPreviousPage={currentPage > 0}
              pageCount={totalPages}
              pageIndex={currentPage}
              setPageIndex={onPageChange}
              nextPage={() =>
                onPageChange(Math.min(totalPages - 1, currentPage + 1))
              }
              canNextPage={currentPage < totalPages - 1}
            />
          )}
        </div>
      )}
    </ComponentCard>
  );
};

export default TransactionList;
