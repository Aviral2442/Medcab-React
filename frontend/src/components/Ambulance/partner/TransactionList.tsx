import React, { useEffect, useRef } from "react";
import ComponentCard from "@/components/ComponentCard";
import DT from "datatables.net-bs5";
import DataTable from "datatables.net-react";
import type { DataTableRef } from "datatables.net-react";
import "datatables.net-buttons-bs5";
import "datatables.net-buttons/js/buttons.html5";
import "datatables.net-responsive";
import jszip from "jszip";
import pdfmake from "pdfmake";
import _pdfMake from "pdfmake/build/vfs_fonts";
import _pdfFonts from "pdfmake/build/vfs_fonts";
import { formatDate } from "@/components/DateFormat";
import TablePagination from "@/components/table/TablePagination";
import TableFilters from "@/components/table/TableFilters";
import { Spinner } from "react-bootstrap";

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
  pagination: PaginationData;
  currentPage: number;
  dateFilter: string | null;
  dateRange: [Date | null, Date | null];
  onDateFilterChange: (value: string | null) => void;
  onDateRangeChange: (range: [Date | null, Date | null]) => void;
  onPageChange: (page: number) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({
  data,
  loading = false,
  pagination,
  currentPage,
  dateFilter,
  dateRange,
  onDateFilterChange,
  onDateRangeChange,
  onPageChange,
}) => {
  const tableRef = useRef<DataTableRef>(null);

  useEffect(() => {
    // Destroy existing DataTable instance when component unmounts or data changes
    return () => {
      if (tableRef.current) {
        const table = tableRef.current.dt();
        if (table) {
          table.destroy();
        }
      }
    };
  }, [data]);

  const formatValue = (
    value: string | number | null | undefined,
    type: string = "text"
  ) => {
    if (value === null || value === undefined) return "N/A";
    if (typeof value === "string" && value.trim() === "") return "N/A";

    const valStr = value.toString();
    if (type === "date" || type === "datetime-local") {
      try {
        const date = formatDate(valStr);
        return date;
      } catch {
        return valStr;
      }
    }
    return valStr;
  };

  const columns = [
    {
      title: "S.No.",
      data: null,
      render: (_data: any, _type: any, _row: any, meta: any) =>
        currentPage * pagination.limit + meta.row + 1,
    },
    {
      title: "ID",
      data: "partner_transection_id",
      render: (data: any) => {
        return data !== null && data !== undefined && data !== ""
          ? data
          : "N/A";
      },
    },
    {
      title: "Transaction By",
      data: "partner_f_name",
      render: (_data: any, _type: any, row: any) => {
        const first = row?.partner_f_name;
        const last = row?.partner_l_name;
        const mobile = row?.partner_mobile;
        const name = [first, last].filter(Boolean).join(" ");
        const parts: string[] = [];
        if (name) parts.push(name);
        if (mobile) parts.push(mobile);
        return parts.length ? parts.join("<br/>") : " ";
      },
    },
    {
      title: "Amount",
      data: "partner_transection_amount",
      render: (data: any) =>
        data !== null && data !== undefined && data !== ""
          ? `₹ ${formatValue(data)}`
          : " ",
    },
    {
      title: "PayID",
      data: "partner_transection_pay_id",
      render: (data: any) => (data ? data : " "),
    },
    {
      title: "Type",
      data: "partner_transection_type",
      render: (data: any) => {
        switch (data) {
          case "1":
            return "Add in Wallet";
          case "2":
            return "Transfer to Bank";
          case "3":
            return "Fetch from Driver";
          default:
            return data || " ";
        }
      },
    },
    {
      title: "Prev Amt",
      data: "partner_transection_wallet_previous_amount",
      render: (data: any) =>
        data !== null && data !== undefined && data !== ""
          ? `₹ ${formatValue(data)}`
          : " ",
    },
    {
      title: "New Amt",
      data: "partner_transection_wallet_new_amount",
      render: (data: any) =>
        data !== null && data !== undefined && data !== ""
          ? `₹ ${formatValue(data)}`
          : " ",
    },
    {
      title: "Time",
      data: "partner_transection_time_unix",
      render: (data: any) => {
        return formatDate(data);
      },
    },
    {
      title: "Created At",
      data: "created_at",
      render: (data: any) => {
        return formatDate(data);
      },
    },
  ];

  const tableData = data ? (Array.isArray(data) ? data : [data]) : [];

  // Calculate safe pagination values
  const totalPages = pagination?.totalPages || 0;
  const pageIndex = currentPage || 0;
  const canPrev = pageIndex > 0;
  const canNext = pageIndex < totalPages - 1;

  return (
    <ComponentCard
      title="Transaction Orders List"
      className="mb-4"
      headerActions={
        <TableFilters
          dateFilter={dateFilter}
          statusFilter={null}
          dateRange={dateRange}
          onDateFilterChange={onDateFilterChange}
          onStatusFilterChange={() => {}}
          onDateRangeChange={onDateRangeChange}
          statusOptions={[]}
          showStatusFilter={false}
          showDateFilter={true}
          showDateRange={true}
          className="w-100"
        />
      }
    >
      {loading ? (
        <div className="text-center py-4">
          <Spinner animation="border" variant="primary" size="sm" />
          <span className="ms-2">Loading transactions...</span>
        </div>
      ) : (
        <>
          {tableData.length === 0 ? (
            <div className="text-center py-4 text-muted">No transactions found</div>
          ) : (
            <div className="table-responsive">
              <DataTable
                data={tableData}
                columns={columns}
                options={{
                  responsive: true,
                  paging: false,
                  searching: true,
                  ordering: true,
                  info: false,
                  layout: { topStart: "buttons" },
                  buttons: [
                    { extend: "copy", className: "btn btn-sm btn-secondary" },
                    { extend: "csv", className: "btn btn-sm btn-secondary" },
                    { extend: "excel", className: "btn btn-sm btn-secondary" },
                    { extend: "pdf", className: "btn btn-sm btn-secondary" },
                  ],
                }}
                className="table table-striped align-middle mb-0 nowrap w-100"
                ref={tableRef}
              >
                <thead className="thead-sm text-uppercase fs-xxs">
                  <tr>
                    {columns.map((col, idx) => (
                      <th key={idx}>{col.title}</th>
                    ))}
                  </tr>
                </thead>
              </DataTable>
            </div>
          )}

          {totalPages > 0 && (
            <div className="mt-3">
              <TablePagination
                start={pageIndex + 1}
                showInfo={true}
                previousPage={() => onPageChange(Math.max(0, pageIndex - 1))}
                canPreviousPage={canPrev}
                pageCount={totalPages}
                pageIndex={pageIndex}
                setPageIndex={onPageChange}
                nextPage={() => onPageChange(Math.min(totalPages - 1, pageIndex + 1))}
                canNextPage={canNext}
              />
            </div>
          )}
        </>
      )}
    </ComponentCard>
  );
};

export default TransactionList;
