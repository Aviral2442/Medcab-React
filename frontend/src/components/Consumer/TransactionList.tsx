import React, { useEffect, useRef } from "react";
import ComponentCard from "@/components/ComponentCard";
import DT from "datatables.net-bs5";
import DataTable from "datatables.net-react";
import type { DataTableRef } from "datatables.net-react";
import "datatables.net-buttons-bs5";
import "datatables.net-buttons/js/buttons.html5";
import jszip from "jszip";
import pdfmake from "pdfmake";

// Register plugins
DataTable.use(DT);
DT.Buttons.jszip(jszip);
DT.Buttons.pdfMake(pdfmake);

interface TransactionListProps {
  data: any;
}

const TransactionList: React.FC<TransactionListProps> = ({ data }) => {
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

  const formatValue = (value: string | number, type: string = "text") => {
    if (!value && value !== 0) return "N/A";
    const valStr = value.toString();
    
    if (type === "date" || type === "datetime-local") {
      try {
        const date = /^\d+$/.test(valStr)
          ? new Date(parseInt(valStr) * 1000)
          : new Date(valStr);
        if (isNaN(date.getTime())) return valStr;
        return date.toLocaleString();
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
      "0": ["success", "Success"],
      "1": ["warning", "Pending"],
      "2": ["danger", "Failed"],
    };
    const [variant, text] = map[statusStr] || ["secondary", status || "N/A"];
    return `<span class="badge bg-${variant} px-2 py-1">${text}</span>`;
  };

  const columns = [
    { 
      title: "ID", 
      data: "consumer_transection_id",
      render: (data: any) => data || "N/A"
    },
    { 
      title: "Name", 
      data: "consumer_name",
      render: (data: any) => data || "N/A"
    },
    { 
      title: "Mobile", 
      data: "consumer_mobile_no",
      render: (data: any) => data || "N/A"
    },
    { 
      title: "Order ID", 
      data: "consumer_transection_order_id",
      render: (data: any) => data || "N/A"
    },
    { 
      title: "Pay ID", 
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
      title: "Pre Amt", 
      data: "consumer_transection_previous_amount",
      render: (data: any) => `₹${data || 0}`,
    },
    { 
      title: "New Amt", 
      data: "consumer_transection_new_amount",
      render: (data: any) => `₹${data || 0}`,
    },
    { 
      title: "Note", 
      data: "consumer_transection_note",
      render: (data: any) => data || "N/A"
    },
    { 
      title: "Trans", 
      data: "consumer_transection_time",
      render: (data: any) => formatValue(data, "datetime-local")
    },
    { 
      title: "Status", 
      data: "consumer_transection_status",
      render: (data: any) => getStatusBadge(data)
    },
  ];

  const tableData = data ? (Array.isArray(data) ? data : [data]) : [];

  return (
    <ComponentCard title="Transaction List" className="mb-4">
      <div className="table-responsive">
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