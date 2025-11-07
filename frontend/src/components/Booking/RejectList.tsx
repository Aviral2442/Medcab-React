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

interface PickUpVendorListProps {
  data: any;
}

const PickUpVendorList: React.FC<PickUpVendorListProps> = ({ data }) => {


  // Define columns for DataTable
  const columns = [
    { 
      title: "Vendor ID", 
      data: "vendor_id",
      render: (data: any) => data || "N/A"
    },
    { 
      title: "Vendor Name", 
      data: "vendor_name",
      render: (data: any) => data || "N/A"
    },
    { 
      title: "Vendor Mobile", 
      data: "vendor_mobile",
      render: (data: any) => data || "N/A"
    },
  ];

  // Prepare data array (wrap single object in array)
  const tableData = data ? [data] : [];

  return (
    <ComponentCard title="Reject List Details" className="mb-4">
      <div className="table-responsive" style={{ overflowX: "scroll" }}>
        <DataTable
          data={tableData[0]}
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

export default PickUpVendorList;