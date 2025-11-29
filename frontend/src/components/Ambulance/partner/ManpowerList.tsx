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
// Register plugins
DataTable.use(DT);
DT.Buttons.jszip(jszip);
DT.Buttons.pdfMake(pdfmake);

interface ManpowerListProps {
  data: any[] | null;
}

const ManpowerList: React.FC<ManpowerListProps> = ({ data }) => {
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

  const getStatusBadge = (status: string | number | undefined | null) => {
    const statusStr = status?.toString().toLowerCase();
    const map: Record<string, [string, string]> = {
      "0": ["success", "Success"],
      "1": ["warning", "Pending"],
      "2": ["danger", "Failed"],
      success: ["success", "Success"],
      pending: ["warning", "Pending"],
      failed: ["danger", "Failed"],
      completed: ["info", "Completed"],
    };
    const [variant, text] = map[statusStr || ""] || [
      "secondary",
      status?.toString() || "N/A",
    ];
    return `<span class="badge badge-label badge-soft-${variant} px-2 py-1">${text}</span>`;
  };

  const columns = [
    {
      title: "S.No.",
      data: null,
      render: (_data: any, _type: any, _row: any, meta: any) => meta.row + 1,
    },
    {
      title: "ID",
      data: "partner_man_power_id",
      render: (data: any) => {
        return data !== null && data !== undefined && data !== "" ? data : "N/A";
      },
    },
    {
      title: "profile",
      data: "partner_man_power_profile_img",
      render: (data: any) =>
        data ? `<img src="${data}" alt="Profile Image" width="50" height="50"/>` : " ",
    },
    {
      title: "Name",
      data: "partner_man_power_f_name",
      render: (_data: any, _type: any, row: any) => {
        const first = row?.partner_man_power_f_name;
        const last = row?.partner_man_power_l_name;
        const mobile = row?.partner_man_power_mobile;
        const name = [first, last].filter(Boolean).join(" ");
        const parts: string[] = [];
        if (name) parts.push(name);
        if (mobile) parts.push(mobile);
        return parts.length ? parts.join("<br/>") : " ";
      },
    },
    {
      title: "wallet",
      data: "partner_man_power_wallet",
      render: (data: any) =>
        data !== null && data !== undefined && data !== ""
          ? `₹ ${formatValue(data)}`
          : " ",
    },
    {
      title: "City",
      data: "city_name",
      render: (data: any) => (data ? data : " "),
    },
    {
      title: "created by",
      data: "partner_man_power_created_by",
      render: (data: any) => (data ? data : " "),
    },
    {
      title: "reg step",
      data: "partner_man_power_registration_step",
      render: (data: any) =>
        data !== null && data !== undefined && data !== "" ? data : " ",
    },
    {
      title: "referral",
      data: "mp_referral_referral_by",
      render: (data: any) => (data ? data : " "),
    },
    {
      title: "status",
      data: "partner_man_power_status",
      render: (data: any) =>
        data !== null && data !== undefined && data !== ""
          ? getStatusBadge(data)
          : " ",
    },
    {
      title: "created at",
      data: "created_at",
      render: (data: any) =>
        data !== null && data !== undefined && data !== ""
          ? formatValue(data, "datetime-local")
          : " ",
    },
  ];

  const tableData = data ? (Array.isArray(data) ? data : [data]) : [];

  return (
    <ComponentCard title="Manpower Orders List" className="mb-4">
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
    </ComponentCard>
  );
};

export default ManpowerList;
