import React from "react";
import DT from "datatables.net-bs5";
import DataTable from "datatables.net-react";
import "datatables.net-buttons-bs5";
import "datatables.net-buttons/js/buttons.html5";
import "datatables.net-responsive";
import jszip from "jszip";
import pdfmake from "pdfmake";
import ComponentCard from "@/components/ComponentCard";

// Register plugins
DataTable.use(DT);
DT.Buttons.jszip(jszip);
DT.Buttons.pdfMake(pdfmake);

interface TransactionListProps {
  data: any;
}

const TransactionList: React.FC<TransactionListProps> = ({ data }) => {
  const formatValue = (value: string | number, type: string = "text") => {
    if (!value && value !== 0) return "N/A";
    const valStr = value.toString();

    if (type === "date" || type === "datetime-local") {
      try {
        const date = /^\d+$/.test(valStr)
          ? new Date(parseInt(valStr) * 1000)
          : new Date(valStr);
        if (isNaN(date.getTime())) return valStr;

        const pad = (n: number) => String(n).padStart(2, "0");
        const month = pad(date.getMonth() + 1);
        const day = pad(date.getDate());
        const year = date.getFullYear();
        const hours = pad(date.getHours());
        const minutes = pad(date.getMinutes());

        return `${month}/${day}/${year} ${hours}:${minutes}`;
      } catch {
        return valStr;
      }
    }

    return valStr;
  };


  const getStatusBadge = (status: string | number) => {
    const statusStr = status?.toString().toLowerCase();
    const map: Record<string, [string, string]> = {
      success: ["success", "Success"],
      pending: ["warning", "Pending"],
      failed: ["danger", "Failed"],
      completed: ["info", "Completed"],
      "1": ["success", "Success"],
      "0": ["warning", "Pending"],
      "2": ["danger", "Failed"],
    };
    const [variant, text] = map[statusStr] || ["secondary", status || "N/A"];
    return `<span class="badge bg-${variant} px-2 py-1">${text}</span>`;
  };


  // Define columns for DataTable
  const columns = [
    { 
      title: "ID", 
      data: "consumer_transection_id",
      render: (data: any) => data || "N/A"
    },
    { 
      title: "Order_ID", 
      data: "consumer_transection_order_id",
      render: (data: any) => data || "N/A"
    },
    { 
      title: "Pay_ID", 
      data: "consumer_transection_payment_id",
      render: (data: any) => data || "N/A"
    },
    { 
      title: "Type", 
      data: "consumer_transection_type_cr_db",
      render: (data: any) => data || "N/A"
    },
    { 
      title: "Flow", 
      data: "consumer_transection_flow",
      render: (data: any) => data || "N/A"
    },
    { 
      title: "Amt", 
      data: "consumer_transection_amount",
      render: (data: any) => `₹${data || 0}`,
    },
    { 
      title: "Pre_Amt", 
      data: "consumer_transection_previous_amount",
      render: (data: any) => `₹${data || 0}`,
    },
    { 
      title: "New_Amt", 
      data: "consumer_transection_new_amount",
      render: (data: any) => `₹${data || 0}`,
    },
    { 
      title: "Done By", 
      data: "consumer_transection_done_by",
      render: (data: any) => data || "N/A"
    },
    { 
      title: "Status", 
      data: "consumer_transection_status",
      render: (data: any) => getStatusBadge(data)
    },
    { 
      title: "Note", 
      data: "consumer_transection_note",
      render: (data: any) => data || "N/A"
    },
    { 
      title: "Trans_On", 
      data: "consumer_transection_time",
      render: (data: any) => formatValue(data, "datetime-local")
    },
  ];

  // Prepare data array (wrap single object in array)
  const tableData = data ? [data] : [];
  // console.log("TransactionList data:", data);

  return (
    <ComponentCard title="Transaction Details" className="mb-4">
      <div className="table-responsive" style={{ overflowX: "scroll" }}>
        <DataTable
          data={tableData || tableData[0]}
          columns={columns}
          options={{
            responsive: false,
            paging: false,
            searching: true,
            ordering: true,
            info: false,
            layout: {
              topStart: "buttons",
            },
            buttons: [
              { extend: "copy", className: "btn btn-sm btn-secondary" },
              { extend: "csv", className: "btn btn-sm btn-secondary" },
              { extend: "excel", className: "btn btn-sm btn-secondary" },
              { extend: "pdf", className: "btn btn-sm btn-secondary" },
            ],
          }}
          className="table table-striped align-middle mb-0 nowrap w-100"
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
    </ComponentCard>
  );
};

export default TransactionList;