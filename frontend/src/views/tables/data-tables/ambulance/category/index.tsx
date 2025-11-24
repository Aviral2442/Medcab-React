import { useEffect, useState, useRef, useMemo } from "react";
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
import TablePagination from "@/components/table/TablePagination";
import TableFilters from "@/components/table/TableFilters";
import { useTableFilters } from "@/hooks/useTableFilters";
import { FaRegTimesCircle, FaRegCheckCircle } from "react-icons/fa";
import _pdfMake from "pdfmake/build/pdfmake";
import _pdfFonts from "pdfmake/build/vfs_fonts";

DataTable.use(DT);
DT.Buttons.jszip(jszip);
DT.Buttons.pdfMake(pdfmake);

const tableConfig: Record<number, { endpoint: string; headers: string[] }> = {
  1: {
    endpoint: "/ambulance/get_ambulance_categories_list",
    headers: [
      "S.No.",
      "ID",
      "Type",
      "Service Type",
      "Icon",
      "Category Name",
      "Created At",
      "Status",
    ],
  },
  2: {
    endpoint: "/ambulance/get_ambulance_faq_list",
    headers: [
      "S.No.",
      "ID",
      // "Ambulance ID",
      "Question",
      "Answer",
      "Created At",
      "Status",
    ],
  },
  3: {
    endpoint: "/ambulance/get_ambulance_facilities_rate_list",
    headers: [
      "S.No.",
      "ID",
      "Amount",
      "Increase/Km",
      "From",
      "To",
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
  onDataChanged,
}: ExportDataWithButtonsProps) => {
  const [tableData, setTableData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const tableRef = useRef<any>(null);

  const [pageSize] = useState(10);
  const [_total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const baseURL = (import.meta as any).env?.VITE_PATH ?? "";

  const toggleCategoryStatus = async (
    categoryId: number,
    currentStatus: number
  ) => {
    try {
      const newStatus = currentStatus === 0 ? 1 : 0;
      await axios.patch(
        `${baseURL}/ambulance/update_ambulance_category_status/${categoryId}`,
        { status: newStatus }
      );
      setTableData((prevData) =>
        prevData.map((item) =>
          item.ambulance_category_id === categoryId
            ? { ...item, ambulance_category_status: newStatus }
            : item
        )
      );
      if (onDataChanged) onDataChanged();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // Line 128-143 - Fix toggleFAQStatus function
  const toggleFAQStatus = async (faqId: number, currentStatus: number) => {
    try {
      const newStatus = currentStatus === 0 ? 1 : 0;
      
      await axios.patch(`${baseURL}/ambulance/update_ambulance_faq_status/${faqId}`, {
        ambulance_faq_status: newStatus,
      });

      if (onDataChanged) onDataChanged();
      fetchData();
    } catch (error) {
      console.error("Error updating FAQ status:", error);
    }
  };

  const toggleFacilitiesRateStatus = async (
    rateId: number,
    currentStatus: number
  ) => {
    try {
      const newStatus = currentStatus === 1 ? 0 : 1;
      await axios.patch(
        `${baseURL}/ambulance/update_ambulance_facilities_rate_status/${rateId}`,
        { status: newStatus }
      );
      setTableData((prevData) =>
        prevData.map((item) =>
          item.ambulance_facilities_rate_id === rateId
            ? { ...item, ambulance_facilities_rate_status: newStatus }
            : item
        )
      );
      if (onDataChanged) onDataChanged();
    } catch (error) {
      console.error("Error updating Facilities Rate status:", error);
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

  const { endpoint } = tableConfig[tabKey];

  const statusFilterOptions = [
    { label: "Active", value: "1" },
    { label: "Inactive", value: "0" },
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = getFilterParams(pageSize, filterParams);
      const res = await axios.get(`${baseURL}${endpoint}`, { params });
      console.log("Fetched data:", res.data);
      let dataArray: any[] = [];
      if (tabKey === 1) {
        dataArray = res.data?.jsonData?.ambulance_categories_list || [];
      } else if (tabKey === 2) {
        dataArray = res.data?.jsonData?.ambulance_faq_list || [];
      } else if (tabKey === 3) {
        dataArray = res.data?.jsonData?.ambulance_facilities_rate_list || [];
      }

      const validData = Array.isArray(dataArray) ? dataArray : [];
      
      // Add debugging
      // console.log("Processed data array:", validData);
      // console.log("First row sample:", validData[2]);
      
      setTableData(validData);

      if (res.data.pagination) {
        setTotal(res.data.pagination.total);
        setTotalPages(res.data.pagination.totalPages);
      } else {
        setTotal(res.data?.total || validData.length);
        setTotalPages(
          res.data?.totalPages || Math.ceil(validData.length / pageSize)
        );
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
  }, [refreshFlag, currentPage, dateFilter, statusFilter, dateRange, tabKey]);

  const formatDate = (timestamp: number) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Memoize columns to prevent unnecessary re-renders
  const CategoryColumns = useMemo(
    () => [
      {
        title: "S.No.",
        data: null,
        orderable: false,
        searchable: false,
        render: (_data: any, _type: any, _row: any, meta: any) => {
          return currentPage * pageSize + meta.row + 1;
        },
      },
      { title: "ID", data: "ambulance_category_id", defaultContent: "N/A" },
      { title: "Type", data: "ambulance_category_type", defaultContent: "N/A" },
      {
        title: "Service Type",
        data: "ambulance_category_service_type",
        defaultContent: "N/A",
        render: (data: any) => {
          if (data === "1") return "Human";
          else if (data === "2") return "Animal";
          else return "N/A";
        },
      },
      {
        title: "Icon",
        data: "ambulance_category_icon",
        defaultContent: "N/A",
        render: (data: any) =>
          data
            ? `<img src="${data}" alt="Icon" style="width: 30px; height: 30px;" />`
            : "N/A",
      },
      { title: "Category Name", data: "ambulance_category_name", defaultContent: "N/A" },
      {
        title: "Created At",
        data: "ambulance_category_added_date",
        defaultContent: "N/A",
        render: (data: string) => {
            const date = new Date(data);
            return date.toLocaleDateString();
    },
      },
      {
        title: "Status",
        data: "ambulance_category_status",
        defaultContent: "N/A",
      render: (data: any) => {
        if (data == 0 || data == "0") {
          return `<span class="badge badge-label badge-soft-success">Active</span>`;
        } else if (data == 1 || data == "1") {
          return `<span class="badge badge-label badge-soft-danger">Inactive</span>`;
        }
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
                  toggleCategoryStatus(
                    rowData.ambulance_category_id,
                    rowData.ambulance_category_status
                  );
                }}
                title={
                  rowData.ambulance_category_status === 1
                    ? "Click to deactivate"
                    : "Click to activate"
                }
                style={{
                  backgroundColor:
                    rowData.ambulance_category_status === 1
                      ? "#d9534f"
                      : "#3a833a",
                }}
              >
                {rowData.ambulance_category_status === 1 ? (
                  <FaRegTimesCircle className="me-1" />
                ) : (
                  <FaRegCheckCircle className="me-1" />
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
    ],
    [currentPage, pageSize]
  );

  const FAQColumns = useMemo(
    () => [
      {
        title: "S.No.",
        data: null,
        orderable: false,
        searchable: false,
        render: (_data: any, _type: any, _row: any, meta: any) => {
          return currentPage * pageSize + meta.row + 1;
        },
      },
      { title: "ID", data: "ambulance_faq_id", defaultContent: "N/A" },
      // { title: "Ambulance ID", data: "ambulance_id", defaultContent: "N/A" },
      { title: "Question", data: "ambulance_faq_que", defaultContent: "N/A" },
      {
        title: "Answer",
        data: "ambulance_faq_ans",
        defaultContent: "N/A",
        render: (data: string) => {
          const maxLength = 100;
          if (!data) return "N/A";
          return data.length > maxLength
            ? data.substring(0, maxLength) + "..."
            : data;
        },
      },
      {
        title: "Date",
        data: "ambulance_faq_timestamp",
        defaultContent: "N/A",
        render: (data: any) => formatDate(data),
      },
      {
        title: "Status",
        data: "ambulance_faq_status",
        defaultContent: "N/A",
        render: (data: any) => {
          if (data == 0 || data == "0") {
            return `<span class="badge badge-label badge-soft-success">Active</span>`;
          } else if (data == 1 || data == "1") {
            return `<span class="badge badge-label badge-soft-danger">Inactive</span>`;
          }
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
          // Line 393-420 - Fix FAQ Toggle Button (reversed)
          root.render(
            <div className="d-flex flex-row gap-1">
              <button
                className="p-0 p-1 text-white rounded-1 d-flex align-items-center justify-content-center"
                onClick={() => {
                  toggleFAQStatus(
                    rowData.ambulance_faq_id,
                    rowData.ambulance_faq_status
                  );
                }}
                title={
                  rowData.ambulance_faq_status === 0
                    ? "Click to deactivate"
                    : "Click to activate"
                }
                style={{
                  backgroundColor:
                    rowData.ambulance_faq_status === 0
                      ? "#d9534f"
                      : "#3a833a",
                }}
              >
                {rowData.ambulance_faq_status === 0 ? (
                  <FaRegTimesCircle className="me-1" />
                ) : (
                  <FaRegCheckCircle className="me-1" />
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
    ],
    [currentPage, pageSize]
  );

  const FacilitiesRateColumns = useMemo(
    () => [
      {
        title: "S.No.",
        data: null,
        orderable: false,
        searchable: false,
        render: (_data: any, _type: any, _row: any, meta: any) => {
          return currentPage * pageSize + meta.row + 1;
        },
      },
      // Check your console.log output to verify the exact field names
      // Based on the backend query at line 713-720 of ambulance.service.ts
      // The fields should be exactly as returned by the SQL query
      { 
        title: "ID", 
        data: "ambulance_facilities_rate_id",
        defaultContent: "N/A" 
      },
      { 
        title: "Amount", 
        data: "ambulance_facilities_rate_amount",
        defaultContent: "N/A"
      },
      {
        title: "Increase/Km",
        data: "ambulance_facilities_rate_increase_per_km",
        defaultContent: "N/A"
      },
      { 
        title: "From", 
        data: "ambulance_facilities_rate_from",
        defaultContent: "N/A"
      },
      { 
        title: "To", 
        data: "ambulance_facilities_rate_to",
        defaultContent: "N/A"
      },
      {
        title: "Status",
        data: "ambulance_facilities_rate_status",
        defaultContent: "N/A",
      render: (data: any) => {
        if (data == 0 || data == "0") {
          return `<span class="badge badge-label badge-soft-success">Active</span>`;
        } else if (data == 1 || data == "1") {
          return `<span class="badge badge-label badge-soft-danger">Inactive</span>`;
        }
      }
      },
      {
        title: "Created At",
        data: "ambulance_facilities_rate_date",
        render: (data: any) => formatDate(data),
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
                  toggleFacilitiesRateStatus(
                    rowData.ambulance_facilities_rate_id,
                    rowData.ambulance_facilities_rate_status
                  );
                }}
                title={
                  rowData.ambulance_facilities_rate_status === 1
                    ? "Click to deactivate"
                    : "Click to activate"
                }
                style={{
                  backgroundColor:
                    rowData.ambulance_facilities_rate_status === 1
                      ? "#d9534f"
                      : "#3a833a",
                }}
              >
                {rowData.ambulance_facilities_rate_status === 1 ? (
                  <FaRegTimesCircle className="me-1" />
                ) : (
                  <FaRegCheckCircle className="me-1" />
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
    ],
    [currentPage, pageSize]
  );

  const getColumns = () => {
    switch (tabKey) {
      case 1:
        return CategoryColumns;
      case 2:
        return FAQColumns;
      case 3:
        return FacilitiesRateColumns;
      default:
        return [];
    }
  };

  const getHeaders = () => {
    return tableConfig[tabKey]?.headers || [];
  };

  return (
    <>
      <ComponentCard
        title={
          <div className="w-100">
            {tabKey === 1
              ? "Manage Ambulance Categories"
              : tabKey === 2
              ? "Manage Ambulance FAQs"
              : "Manage Ambulance Facilities Rates"}
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
              showDateFilter={true}
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
              key={`ambulance-table-${tabKey}`}
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
