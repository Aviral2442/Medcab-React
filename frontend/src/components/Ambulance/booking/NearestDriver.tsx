import React, { useEffect, useRef, useState } from "react";
import ComponentCard from "@/components/ComponentCard";
import DT from "datatables.net-bs5";
import DataTable from "datatables.net-react";
import "datatables.net-buttons-bs5";
import "datatables.net-buttons/js/buttons.html5";
import "datatables.net-responsive";
import jszip from "jszip";
import pdfmake from "pdfmake";
import "pdfmake/build/vfs_fonts";
import { Spinner } from "react-bootstrap";
import TablePagination from "@/components/table/TablePagination";
import "@/global.css";

// Register plugins
DataTable.use(DT);
DT.Buttons.jszip(jszip);
DT.Buttons.pdfMake(pdfmake);

interface NearestDriverProps {
  data: any[] | null;
  loading?: boolean;
  error?: string | null;
  currentPage?: number;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;
  onPageChange?: (pageIndex: number) => void;
}

const NearestDriver: React.FC<NearestDriverProps> = ({
  data,
  loading = false,
  error = null,
  currentPage = 0,
  pagination,
  onPageChange,
}) => {
  const tableRef = useRef<any>(null);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
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

  useEffect(() => {
    if (pagination) {
      setTotalPages(pagination.totalPages || 0);
    }
  }, [pagination]);

  const handlePageChange = (newPage: number) => {
    if (onPageChange) {
      onPageChange(newPage);
    }
  };

  const headers = [
    "S.No.",
    "Vehicle",
    "Vehicle RC",
    "Name",
    "Mobile",
    "Distance (km)",
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
      title: "Vehicle",
      data: "v_vehicle_name",
      render: (data: any) => {
        if (data === "unknown") return "";
        else return data;
      },
    },
    {
      title: "Vehicle RC",
      data: "vehicle_rc_number",
      render: (data: any) => {
        return data;
      },
    },
    {
      title: "Name",
      data: null,
      render: (_data: any, _type: any, row: any) => {
        const firstName = row.driver_name || "";
        const lastName = row.driver_last_name || "";
        return firstName || lastName
          ? `${firstName} ${lastName}`.trim()
          : " ";
      },
    },
    {
      title: "Mobile",
      data: "driver_mobile",
    },
    {
        title: "Distance (km)",
        data: "distance",
        render: (data: any) => {
          return data ? data.toFixed(2) : " ";
        },
    }
  ];

  const tableData = data ? (Array.isArray(data) ? data : [data]) : [];

  if (error) {
    return (
      <ComponentCard title="City Wise Driver/Partner List">
        <div className="text-center p-4 text-danger">{error}</div>
      </ComponentCard>
    );
  }

  return (
    <ComponentCard title="State Wise Driver/Partner List" className="mb-2">
      {loading ? (
        <div className="text-center p-4">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Loading state wise data...</p>
        </div>
      ) : tableData.length === 0 ? (
        <div className="text-center p-4">
          <p className="text-muted">
            No city wise data found for this booking.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <DataTable
            ref={tableRef}
            key={`citywise-table-${currentPage}`}
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
                  exportOptions: {
                    columns: ":visible",
                  },
                },
                {
                  extend: "excelHtml5",
                  className: "btn btn-sm btn-primary",
                  text: "Excel",
                  exportOptions: {
                    columns: ":visible",
                  },
                },
                {
                  extend: "csvHtml5",
                  className: "btn btn-sm btn-primary",
                  text: "CSV",
                  exportOptions: {
                    columns: ":visible",
                  },
                },
                {
                  extend: "pdfHtml5",
                  className: "btn btn-sm btn-primary",
                  text: "PDF",
                  exportOptions: {
                    columns: ":visible",
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

          {pagination && pagination.totalPages > 0 && (
            <div className="mt-3">
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
        </div>
      )}
    </ComponentCard>
  );
};

export default NearestDriver;