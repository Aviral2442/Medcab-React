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
import { Spinner } from "react-bootstrap";
import '@/global.css'

// Register plugins
DataTable.use(DT);
DT.Buttons.jszip(jszip);
DT.Buttons.pdfMake(pdfmake);

interface TransactionListProps {
  data: any[] | null;
  loading?: boolean;
  error?: string | null;
  currentPage?: number;
  onViewTransaction?: (transaction: any) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({
  data,
  loading = false,
  error = null,
  currentPage = 0,
}) => {
  const tableRef = useRef<any>(null);

  useEffect(() => {
    // Cleanup function to properly destroy DataTable
    return () => {
      if (tableRef.current) {
        try {
          const api = tableRef.current.dt();
          if (api) {
            api.destroy();
          }
        } catch (error) {
          console.error("Error destroying DataTable:", error);
        }
      }
    };
  }, []);

  useEffect(() => {
    if (tableRef.current && data) {
      try {
        const api = tableRef.current.dt();
        if (api) {
          api.clear();
          if (Array.isArray(data) && data.length > 0) {
            api.rows.add(data);
          }
          api.draw();
        }
      } catch (error) {
        console.error("Error updating DataTable:", error);
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
      case 8:
        return "Debit Against Accept Booking Charge (W)";
      case 9:
        return "Refund Against Accept Booking Cancel (A)";
      default:
        return `${type || "N/A"}`;
    }
  };

  const getTransactionByType = (type: number | string): string => {
    const typeNum = Number(type);
    switch (typeNum) {
      case 0:
        return "Direct Vendor";
      case 1:
        return "By Partner";
      case 2:
        return "By Company";
      default:
        return `${type || "N/A"}`;
    }
  };

  const headers = [
    "S.No.",
    "ID",
    "By",
    "Vendor",
    "Note",
    "Type",
    "Amount",
    "Prev Amt",
    "New Amt",
    "Date",
    // "Wallet",
    "Status",
  ];

  const columns = [
    {
      title: "S.No.",
      data: null,
      orderable: false,
      searchable: false,
      render: (_data: any, _type: any, _row: any, meta: any) => meta.row + 1,
    },
    {
      title: "ID",
      data: "vendor_transection_id",
      render: (data: any) => (data ? data : "N/A"),
    },
    {
      title: "By",
      data: "vendor_transection_by_type",
      render: (data: any) => getTransactionByType(data),
    },
    {
      title: "Name",
      data: "vendor_name",
      render: (_data: any, _type: any, row: any) => {
        const name = row.vendor_name ? row.vendor_name : "N/A";
        return `<div><strong>${name}</strong>`;
      },
    },
    {
      title: "Mobile",
      data: "vendor_mobile",
      render: (_data: any, _type: any, row: any) => {
        const mobile = row.vendor_mobile ? row.vendor_mobile : "N/A";
        return `<div>${mobile}</div>`;
      }
    },
    {
      title: "Note",
      data: "vendor_transection_note",
      render: (data: any) => (data ? data : "-"),
    },
    {
      title: "Type",
      data: "vendor_transection_type",
      render: (data: any) => getTransactionType(data),
    },
    {
      title: "Amount",
      data: "vendor_transection_amount",
      render: (data: any) =>
        data !== null && data !== undefined && data !== ""
          ? `₹${formatValue(data)}`
          : "",
    },
    {
      title: "Prev Amt",
      data: "vendor_transection_wallet_previous_amount",
      render: (data: any) =>
        data !== null && data !== undefined && data !== ""
          ? `₹${formatValue(data)}`
          : "-",
    },
    {
      title: "New Amt",
      data: "vendor_transection_wallet_new_amount",
      render: (data: any) =>
        data !== null && data !== undefined && data !== ""
          ? `₹${formatValue(data)}`
          : "-",
    },
    {
      title: "Date",
      data: "vendor_transection_time_unix",
      render: (data: any) => (data ? formatDate(data) : "-"),
    },
    // {
    //   title: "Wallet",
    //   data: "vendor_transection_by_partner_wallet_status",
    //   render: (data: any) => getWalletStatus(data),
    // },
    {
      title: "Status",
      data: "vendor_transection_status",
      render: (data: any) => getTransactionStatus(data),
    }
  ];

  const tableData = data ? (Array.isArray(data) ? data : [data]) : [];

  if (error) {
    return (
      <ComponentCard title="Vendor Transactions">
        <div className="text-center p-4 text-danger">{error}</div>
      </ComponentCard>
    );
  }

  return (
    <ComponentCard title="Vendor Transactions" className="mb-2">
      {loading ? (
        <div className="text-center p-4">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Loading transactions...</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <DataTable
            ref={tableRef}
            key={`vendor-transaction-table-${currentPage}`}
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
        </div>
      )}
    </ComponentCard>
  );
};

export default TransactionList;



/*

vendor_transection_id
vendor_name
vendor_mobile
vendor_transection_by_type  (0 for direct driver 1 for by partner 2 for by company)
vendor_transection_by_partner_wallet_status (0 for online, 1 from from partner wallet, 2 for withdrawal)
vendor_transection_type (1 for add-in wallet(A) 2 for cancelation charge(W) 3 for Cash Collect(W) 4 for online booking payment(A) 5 for transfer to bank account (W) 6 for fetched by Partner (W) 7 for Incentive from Company(A) 8 Debit agains Accept Booking Charge (W) 9 Refund agains Accept Booking Cancel (A))
vendor_transection_amount
vendor_transection_wallet_previous_amount
vendor_transection_wallet_new_amount
vendor_transection_time_unix
vendor_created_at
vendor_transection_status (0 for default, 1 for Pending withdrawal request, 2 for refunded.)


*/