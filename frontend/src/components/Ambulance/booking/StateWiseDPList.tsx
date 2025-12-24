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
import { Spinner } from "react-bootstrap";
import TablePagination from "@/components/table/TablePagination";
import "@/global.css";

// Register plugins
DataTable.use(DT);
DT.Buttons.jszip(jszip);
DT.Buttons.pdfMake(pdfmake);

interface CityWiseDPListProps {
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

const CityWiseDPList: React.FC<CityWiseDPListProps> = ({
  data,
  loading = false,
  error = null,
  currentPage = 0,
  pagination,
  onPageChange,
}) => {
  const tableRef = useRef<any>(null);

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

  const headers = [
    "S.No.",
    // "City ID"","
    "By",
    "Name",
    "Mobile",
    "Vehicle",
    "Vehicle RC",
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
      title: "Name",
      data: "state_name",
      render: (data: any) => (data ? data : "N/A"),
    },
    {
      title: "By",
      data: "vehicle_added_type",
      render: (data: any) => {
        switch (data) {
          case "0":
            return "Driver";
          case "1":
            return "Partner";
        }
      },
    },
    {
      title: "Name",
      data: null,
      render: (_data: any, _type: any, row: any) => {
        const firstName = row.name || "";
        const lastName = row.last_name || "";
        return firstName || lastName
          ? `${firstName} ${lastName}`.trim()
          : "N/A";
      },
    },
    {
      title: "Mobile",
      data: "mobile",
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
              ordering: true,
              order: [[1, "asc"]],
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
              {(() => {
                const pageIndexLocal = (pagination.page || 1) - 1;
                return (
                  <TablePagination
                    start={pageIndexLocal + 1}
                    showInfo={true}
                    previousPage={() =>
                      onPageChange &&
                      onPageChange(Math.max(0, pageIndexLocal - 1))
                    }
                    canPreviousPage={pageIndexLocal > 0}
                    pageCount={pagination.totalPages}
                    pageIndex={pageIndexLocal}
                    setPageIndex={(p) => onPageChange && onPageChange(p)}
                    nextPage={() =>
                      onPageChange &&
                      onPageChange(
                        Math.min(pagination.totalPages - 1, pageIndexLocal + 1)
                      )
                    }
                    canNextPage={pageIndexLocal < pagination.totalPages - 1}
                  />
                );
              })()}
            </div>
          )}
        </div>
      )}
    </ComponentCard>
  );
};

export default CityWiseDPList;
