import { useEffect, useState, useRef, type JSX } from "react";
import ComponentCard from "@/components/ComponentCard";
import "@/global.css";
import DT from "datatables.net-bs5";
import DataTable from "datatables.net-react";
import "datatables.net-buttons-bs5";
import "datatables.net-buttons/js/buttons.html5";
import { TbEye } from "react-icons/tb";
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
import { FaPeopleCarryBox, FaPeoplePulling } from "react-icons/fa6";
import { FaBuilding, FaCar } from "react-icons/fa";

DataTable.use(DT);
DT.Buttons.jszip(jszip);
DT.Buttons.pdfMake(pdfmake);

const tableConfig: Record<number, { endpoint: string; headers: string[] }> = {
  1: {
    endpoint: "/transaction/driver_transaction_list",
    headers: [
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

      const transactions = res.data?.jsonData?.driverTransactions || [];
      setTableData(transactions);

      if (res.data.pagination) {
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

  const getTransactionByType = (type: number | string): JSX.Element => {
    const typeNum = Number(type);
    switch (typeNum) {
      case 0:
        return <FaCar title="Direct Driver" />;
      case 1:
        return <FaPeoplePulling title="By Partner" />;
      case 2:
        return <FaBuilding title="By Company" />;
      case 3:
        return <FaPeopleCarryBox title="Tip From Consumer" />;
      default:
        return <span>{type || "N/A"}</span>;
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
      data: "driver_transection_id",
      render: (data: any) => (data ? data : "N/A"),
    },
    {
      title: "Name",
      data: "trans_by_name",
      render: (_data: any, _type: any, row: any) => {
        const name = row?.trans_by_name;
        const parts: string[] = [];
        if (name) parts.push(`${name}`);
        return parts.length ? parts : "N/A";
      },
    },
    {
      title: "Mobile",
      data: "trans_by_mobile",
      render: (data: any) => (data ? data : "N/A"),
    },
    {
      title: "By Type",
      data: "driver_transection_by_type",
      render: () => "", // Return empty string, we'll render in createdCell
      createdCell: (td: HTMLElement, _cellData: any, rowData: any) => {
        td.innerHTML = "";
        const root = createRoot(td);
        root.render(
          <div className="d-flex align-items-center">
            {getTransactionByType(rowData.driver_transection_by_type)}
          </div>
        );
      },
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
                navigate(`/driver-detail/${rowData.driver_id}`);
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
            {tabKey === 1 ? "Driver Transaction List" : ""}
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
