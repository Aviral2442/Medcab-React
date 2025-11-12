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

interface AmbulanceBookingListProps {
  data: any[];
}

const AmbulanceBookingList: React.FC<AmbulanceBookingListProps> = ({ data }) => {
  const tableRef = useRef<DataTableRef>(null);

  useEffect(() => {
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
      title: "S.No.",
      data: null,
      orderable: false,
      render: (_data: any, _type: any, _row: any, meta: any) => {
        return meta.row + 1;
      },
    },
    {
      title: "Name",
      data: "consumer_name",
      render: (data: any) => data || "N/A"
    },
    {
      title: "Source",
      data: "booking_source",
      render: (data: any) => data || "N/A"
    },
    {
      title: "Type",
      data: "booking_type",
      render: (data: any) => data || "N/A"
    },
    {
      title: "Category",
      data: "booking_category",
      render: (data: any) => data || "N/A"
    },
    {
      title: "Schedule Time",
      data: "booking_schedule_time",
      render: (data: any) => formatValue(data, "datetime-local")
    },
    {
      title: "Pickup",
      data: "booking_pickup",
      render: (data: any) => data || "N/A"
    },
    {
      title: "Drop",
      data: "booking_drop",
      render: (data: any) => data || "N/A"
    },
    {
      title: "Amount",
      data: "booking_amount",
      render: (data: any) => `₹${data || 0}`,
    },
    {
      title: "Distance",
      data: "booking_distance",
      render: (data: any) => data || "N/A"
    },
    {
      title: "Duration",
      data: "booking_duration",
      render: (data: any) => data || "N/A"
    },
    {
      title: "Booking Status",
      data: "bookingStatus",
      render: (data: any) => getStatusBadge(data)
    },
  ];

  const tableData = Array.isArray(data) ? data : [];

  return (
    <ComponentCard title="Ambulance Booking List" className="mb-4">
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

export default AmbulanceBookingList;