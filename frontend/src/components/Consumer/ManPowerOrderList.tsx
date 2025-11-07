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

interface ManPowerOrderListProps {
  data: any[];
}

const ManPowerOrderList: React.FC<ManPowerOrderListProps> = ({ data }) => {
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
      "0": ["success", "Success"],
      "1": ["warning", "Pending"],
      "2": ["danger", "Failed"],
    };
    const [variant, text] = map[statusStr] || ["secondary", status || "N/A"];
    return `<span class="badge bg-${variant} px-2 py-1">${text}</span>`;
  };

  // Define columns for DataTable
  const columns = [
    {
      title: "Order Date",
      data: "mpo_order_date",
      render: (data: any) => formatValue(data, "date")
    },
    {
      title: "Final Price",
      data: "mpo_final_price",
      render: (data: any) => `₹${data || 0}`,
    },
    {
      title: "Transaction ID",
      data: "mpo_transection_id",
      render: (data: any) => data || "N/A"
    },
    {
      title: "Vendor ID",
      data: "mpo_vendor_id",
      render: (data: any) => data || "N/A"
    },
    {
      title: "Product ID",
      data: "mpod_product_id",
      render: (data: any) => data || "N/A"
    },
    {
      title: "Price",
      data: "mpod_price",
      render: (data: any) => `₹${data || 0}`,
    },
    {
      title: "Period Type",
      data: "mpod_period_type",
      render: (data: any) => data || "N/A"
    },
    {
      title: "Quantity",
      data: "mpod_product_quantity",
      render: (data: any) => data || "N/A"
    },
    {
      title: "From Date",
      data: "mpod_from_date",
      render: (data: any) => formatValue(data, "date")
    },
    {
      title: "Till Date",
      data: "mpod_till_date",
      render: (data: any) => formatValue(data, "date")
    },
    {
      title: "Vendor ID",
      data: "mpod_vendor_id",
      render: (data: any) => data || "N/A"
    },
    {
      title: "Verify OTP",
      data: "mpod_verify_otp",
      render: (data: any) => data || "N/A"
    },
    {
      title: "Status",
      data: "mpod_status",
      render: (data: any) => getStatusBadge(data)
    },
  ];

  return (
    <ComponentCard title="Manpower Order List" className="mb-4">
      <div className="table-responsive" style={{ overflowX: "scroll" }}>
        <DataTable
          data={data}
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

export default ManPowerOrderList;