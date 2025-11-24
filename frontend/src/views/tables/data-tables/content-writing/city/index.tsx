import { useEffect, useState, useRef } from "react";
import ComponentCard from "@/components/ComponentCard";
import "@/global.css";
import DT from "datatables.net-bs5";
import DataTable from "datatables.net-react";
import "datatables.net-buttons-bs5";
import "datatables.net-buttons/js/buttons.html5";

import { TbEdit, TbArrowRight } from "react-icons/tb";
import jszip from "jszip";
import pdfmake from "pdfmake";
import { createRoot } from "react-dom/client";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import TablePagination from "@/components/table/TablePagination";
import TableFilters from "@/components/table/TableFilters";
import { useTableFilters } from "@/hooks/useTableFilters";
import _pdfFonts from "pdfmake/build/vfs_fonts";
import _pdfMake from "pdfmake/build/pdfmake";
import { FaRegTimesCircle, FaRegCheckCircle } from "react-icons/fa";


DataTable.use(DT);
DT.Buttons.jszip(jszip);
DT.Buttons.pdfMake(pdfmake);

const tableConfig: Record<number, { endpoint: string; headers: string[] }> = {
  1: {
    endpoint: "/content_writer/get_city_content",
    headers: [
      "S.No.",
      "City ID",
      "City Name",
      "City Title",
      "Created At",
      "Status",
    ],
  },
  2: {
    endpoint: "/content_writer/get_city_content_faq_list",
    headers: [
      "S.No.",
      "FAQ ID",
      "Question",
      "Answer",
      "Status",
    ],
  },
};

type ExportDataWithButtonsProps = {
  tabKey: number;
  refreshFlag: number;
  onAddNew: () => void;
  onEditRow?: (rowData: any) => void;
  onDataChanged?: () => void;
  filterParams?: Record<string, any>;
};

const ExportDataWithButtons = ({
  tabKey,
  refreshFlag,
  onAddNew,
  onEditRow,
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

  const toggleStatus = async (cityId: number, currentStatus: number) => {
    try {
      const newStatus = currentStatus === 1 ? 0 : 1;
      await axios.patch(
        `${baseURL}/content_writer/update_city_content_status/${cityId}`,
        {
          city_content_status: newStatus,
        }
      );

      setTableData((prevData) =>
        prevData.map((city) =>
          city.city_id === cityId
            ? { ...city, city_status: newStatus }
            : city
        )
      );
    } catch (error) {
      console.error("Error updating city status:", error);
    }
  };

  const toggleFAQStatus = async (faqId: number, currentStatus: any) => {
    try {
      // Convert string to number
      const status = typeof currentStatus === 'string' ? parseInt(currentStatus) : currentStatus;
      const newStatus = status === 1 ? 0 : 1;
      
      await axios.patch(
        `${baseURL}/content_writer/update_city_content_faq_status/${faqId}`,
        {
          city_faq_status: newStatus,
        }
      );

      setTableData((prevData) =>
        prevData.map((faq) =>
          faq.city_faq_id === faqId
            ? { ...faq, city_faq_status: newStatus }
            : faq
        )
      );
    } catch (error) {
      console.error("Error updating FAQ status:", error);
    }
  };

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
    defaultDateFilter: "today",
  });

  const { endpoint, headers } = tableConfig[tabKey];

  const statusFilterOptions = [
    { label: "Active", value: "1" },
    { label: "Inactive", value: "0" },
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = getFilterParams(pageSize, filterParams);
      const res = await axios.get(`${baseURL}${endpoint}`, { params });
      console.log("API Response:", res.data);

      let dataArray: any[] = [];
      
      if (tabKey === 1) {
        dataArray = res.data?.jsonData?.city_content_list || [];
      } else if (tabKey === 2) {
        dataArray = res.data?.jsonData?.city_content_faq_list || [];
      }
      
      // Ensure data is an array and has proper structure
      const validData = Array.isArray(dataArray) ? dataArray : [];
      setTableData(validData);

      if (res.data.pagination) {
        setTotal(res.data.pagination.total);
        setTotalPages(res.data.pagination.totalPages);
      } else {
        setTotal(validData.length);
        setTotalPages(Math.ceil(validData.length / pageSize));
      }
    } catch (error) {
      console.error("Error fetching data:", error);
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

  const formatDate = (timestamp: number) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const cityColumns = [
    {
      title: "S.No.",
      data: null,
      orderable: false,
      searchable: false,
      render: (_data: any, _type: any, _row: any, meta: any) => {
        return currentPage * pageSize + meta.row + 1;
      },
    },
    {
      title: "ID",
      data: "city_id",
    },
    {
      title: "City Name",
      data: "city_name",
      render: (data: string) => {
        return data || "N/A";
      },
    },
    {
      title: "City Title",
      data: "city_title",
      render: (data: string) => {
        return data || "N/A";
      },
    },
    {
      title: "Date",
      data: "city_timestamp",
      render: (data: number) => formatDate(data),
    },
    {
      title: "Status",
      data: "city_status",
      render: (data: any) => {
        // Convert string to number for comparison
        const status = typeof data === 'string' ? parseInt(data) : data;
        if (status === 1 || status === "1") {
          return `<span class="badge badge-label badge-soft-success">Active</span>`;
        } else if (status === 0 || status === "0") {
          return `<span class="badge badge-label badge-soft-danger">Inactive</span>`;
        }
        return `<span class="badge badge-label badge-soft-secondary">Unknown</span>`;
      },
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
              className="p-0 p-1 text-white rounded-1 d-flex align-items-center justify-content-center"
              onClick={() => {
                toggleStatus(rowData.city_id, rowData.city_status);
              }}
              title={
                rowData.city_status === 1
                  ? "Click to deactivate"
                  : "Click to activate"
              }
              style={{
                backgroundColor:
                  rowData.city_status === 1 ? "#d9534f" : "#3a833a",
              }}
            >
              {rowData.city_status === 1 ? (
                <FaRegTimesCircle className="me-1" />
              ) : (
                <FaRegCheckCircle className="me-1" />
              )}
            </button>
            <button
              className="edit-icon p-0 p-1 text-white rounded-1 d-flex align-items-center justify-content-center"
              onClick={() => {
                navigate(`/edit-city/${rowData.city_id}`);
              }}
            >
              <TbEdit className="me-1" />
            </button>
          </div>
        );
      },
    },
  ];

  const getColumns = () => {
    if (tabKey === 1) {
      return cityColumns;
    } else if (tabKey === 2) {
      return cityFAQColumns;
    }
    return cityColumns;
  };

  const getHeaders = () => {
    if (tabKey === 1) {
      return [
        "S.No.",
        "City ID",
        "City Name",
        "City Title",
        "Created At",
        "Status",
      ];
    } else if (tabKey === 2) {
      return [
        "S.No.",
        "FAQ ID",
        "City Name",
        "Question",
        "Answer",
        "Status", // Removed "Created At" to match cityFAQColumns
      ];
    }
    return headers;
  };

  const cityFAQColumns = [
    {
      title: "S.No.",
      data: null,
      orderable: false,
      searchable: false,
      render: (_data: any, _type: any, _row: any, meta: any) => {
        return currentPage * pageSize + meta.row + 1;
      },
    },
    {
      title: "ID",
      data: "city_faq_id",
      defaultContent: "N/A", // Add this to handle missing data
      render: (data: any) => {
        return data || "N/A";
      },
    },
    {
      title: "City Name",
      data: "city_name",
      defaultContent: "N/A", // Add this
    },
    {
      title: "Question",
      data: "city_faq_que",
      defaultContent: "N/A", // Add this
      render: (data: string) => {
        return data || "N/A";
      },
    },
    {
      title: "Answer",
      data: "city_faq_ans",
      defaultContent: "N/A", // Add this
      render: (data: string) => {
        const maxLength = 100;
        if (!data) return "N/A";
        return data.length > maxLength 
          ? data.substring(0, maxLength) + "..." 
          : data;
      },
    },
    {
      title: "Status",
      data: "city_faq_status",
      defaultContent: "0", // Add this
      render: (data: any) => {
        // Convert string to number for comparison
        const status = typeof data === 'string' ? parseInt(data) : data;
        if (status === 1 || status === "1") {
          return `<span class="badge badge-label badge-soft-success">Active</span>`;
        } else if (status === 0 || status === "0") {
          return `<span class="badge badge-label badge-soft-danger">Inactive</span>`;
        }
        return `<span class="badge badge-label badge-soft-secondary">Unknown</span>`;
      },
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
        const status = typeof rowData.city_faq_status === 'string' 
          ? parseInt(rowData.city_faq_status) 
          : rowData.city_faq_status;
          
        root.render(
          <div className="d-flex flex-row gap-1">
            <button
              className="p-0 p-1 text-white rounded-1 d-flex align-items-center justify-content-center"
              onClick={() => {
                toggleFAQStatus(rowData.city_faq_id, rowData.city_faq_status);
              }}
              title={status === 1 ? "Click to deactivate" : "Click to activate"}
              style={{
                backgroundColor: status === 1 ? "#d9534f" : "#3a833a",
              }}
            >
              {status === 1 ? (
                <FaRegTimesCircle  className="me-1" />
              ) : (
                <FaRegCheckCircle  className="me-1" />
              )}
            </button>
            <button
              className="edit-icon p-0 p-1 text-white rounded-1 d-flex align-items-center justify-content-center"
              onClick={() => {
                if (onEditRow) onEditRow(rowData);
              }}
            >
              <TbEdit className="me-1" />
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
          <div className="w-100">
            {tabKey === 1 ? "Manage City" : "Manage City FAQ"}
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
        showDateRange={true}
        showDateFilter={true} // Now showing both
        showStatusFilter={true}
        dateFilterPlaceholder="Quick filter"
        dateRangePlaceholder="Custom date range"
        statusFilterPlaceholder="Status"
      />
            <button 
              className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
              onClick={onAddNew}
            >
              Add New <TbArrowRight className="fs-5" />
            </button>
          </div>
        }
      >
        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <DataTable
              ref={tableRef}
              key={`city-table-${tabKey}-${dateFilter}-${statusFilter}-${dateRange}-${currentPage}`}
              data={tableData}
              columns={getColumns()}
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
                  {getHeaders().map((header, idx) => (
                    <th key={idx}>{header}</th>
                  ))}
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