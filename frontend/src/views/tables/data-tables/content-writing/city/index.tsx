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
import { useNavigate, useParams } from "react-router-dom";
import TablePagination from "@/components/table/TablePagination";
import TableFilters from "@/components/table/TableFilters";
import { useTableFilters } from "@/hooks/useTableFilters";
import _pdfFonts from "pdfmake/build/vfs_fonts";
import _pdfMake from "pdfmake/build/pdfmake";
import { FaRegTimesCircle, FaRegCheckCircle } from "react-icons/fa";


DataTable.use(DT);
DT.Buttons.jszip(jszip);
DT.Buttons.pdfMake(pdfmake);

const headersCity = [
  "S.No.",
  "City ID",
  "City Name",
  "City Title",
  "Created At",
  "Status",
];

const headersCityFAQ = [
  "S.No.", "FAQ ID", "City Name", "Question", "Answer", "Status"
];

// Map section names to their IDs
const sectionMap: Record<string, number> = {
  'ambulance': 1,
  'manpower': 2,
  'video-consultation': 3,
  'pathology': 4,
};

const tableConfig: Record<number, Record<number, { endpoint: string; headers: string[] }>> = {
  1: {
    1: {
      endpoint: "/content_writer/get_city_content",
      headers: headersCity,
    },
    2: {
      endpoint: "/content_writer/get_city_content_faq_list",
      headers: headersCityFAQ,
    },
  },
  2: {
    1: {
      endpoint: "/content_writer/get_manpower_city_content",
      headers: headersCity,
    },
    2: {
      endpoint: "/content_writer/get_city_manpower_content_faq_list",
      headers: headersCityFAQ,
    },
  },
  3: {
    1: {
      endpoint: "/content_writer/get_video_consult_city_content",
      headers: headersCity,
    },
    2: {
      endpoint: "/content_writer/get_city_video_consult_content_faq_list",
      headers: headersCityFAQ,
    },
  },
  4: {
    1: {
      endpoint: "/content_writer/get_pathology_city_content",
      headers: headersCity,
    },
    2: {
      endpoint: "/content_writer/get_city_pathology_content_faq_list",
      headers: headersCityFAQ,
    },
  }
};

type ExportDataWithButtonsProps = {
  tabKey: number;
  refreshFlag: number;
  onAddNew: () => void;
  onEditRow?: (rowData: any) => void;
  onDataChanged?: () => void;
  filterParams?: Record<string, any>;
  sectionId?: number; // Add this prop
};

// Add a helper function to get section name from ID
const getSectionNameFromId = (id: number): string => {
  const sectionNames: Record<number, string> = {
    1: 'ambulance',
    2: 'manpower',
    3: 'video-consultation',
    4: 'pathology',
  };
  return sectionNames[id] || 'ambulance';
};

const ExportDataWithButtons = ({
  tabKey,
  refreshFlag,
  onAddNew,
  onEditRow,
  filterParams = {},
  sectionId,
}: ExportDataWithButtonsProps) => {
  const navigate = useNavigate();
  const params = useParams();
  const [tableData, setTableData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const tableRef = useRef<any>(null);

  const [pageSize] = useState(10);
  const [_total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const baseURL = (import.meta as any).env?.VITE_PATH ?? "";

  // Determine the section ID from props or URL params
  const currentSectionId = sectionId || sectionMap[params.section || 'ambulance'] || 1;
  
  // Get section name for URL navigation
  const currentSectionName = getSectionNameFromId(currentSectionId);

  // Get section name for display
  const getSectionName = () => {
    const sectionNames: Record<number, string> = {
      1: 'Ambulance',
      2: 'Manpower',
      3: 'Video Consultation',
      4: 'Pathology',
    };
    return sectionNames[currentSectionId];
  };

  const toggleStatus = async (cityId: number, currentStatus: number) => {
    try {
      // Ensure currentStatus is a number
      const statusNum = typeof currentStatus === "string" ? parseInt(currentStatus) : currentStatus;
      const newStatus = statusNum === 0 ? 1 : 0;
      
      // Get the correct endpoint based on section
      let endpoint = "";
      let statusField = "";
      
      switch (currentSectionId) {
        case 1:
          endpoint = `/content_writer/update_city_content_status/${cityId}`;
          statusField = "city_status";
          break;
        case 2:
          endpoint = `/content_writer/update_manpower_city_content_status/${cityId}`;
          statusField = "city_status";
          break;
        case 3:
          endpoint = `/content_writer/update_video_consult_city_content_status/${cityId}`;
          statusField = "city_status";
          break;
        case 4:
          endpoint = `/content_writer/update_pathology_city_content_status/${cityId}`;
          statusField = "city_pathology_status";
          break;
        default:
          endpoint = `/content_writer/update_city_content_status/${cityId}`;
          statusField = "city_status";
      }

      await axios.patch(`${baseURL}${endpoint}`, {
        [statusField]: newStatus,
      });

      setTableData((prevData) =>
        prevData.map((city) => {
          const itemId = currentSectionId === 4 ? city.city_pathology_id : city.city_id;
          if (itemId === cityId) {
            return { ...city, [statusField]: newStatus };
          }
          return city;
        })
      );
    } catch (error) {
      console.error("Error updating city status:", error);
    }
  };

  const toggleFAQStatus = async (faqId: number, currentStatus: any) => {
    try {
      const status =
        typeof currentStatus === "string"
          ? parseInt(currentStatus)
          : currentStatus;
      const newStatus = status === 0 ? 1 : 0;

      // Get the correct endpoint based on section
      let endpoint = "";
      let statusField = "";
      
      switch (currentSectionId) {
        case 1:
          endpoint = `/content_writer/update_city_content_faq_status/${faqId}`;
          statusField = "city_faq_status";
          break;
        case 2:
          endpoint = `/content_writer/update_city_manpower_content_faq_status/${faqId}`;
          statusField = "city_faq_status";
          break;
        case 3:
          endpoint = `/content_writer/update_city_video_consult_content_faq_status/${faqId}`;
          statusField = "city_faq_status";
          break;
        case 4:
          endpoint = `/content_writer/update_city_pathology_content_faq_status/${faqId}`;
          statusField = "city_pathology_faq_status";
          break;
        default:
          endpoint = `/content_writer/update_city_content_faq_status/${faqId}`;
          statusField = "city_faq_status";
      }

      await axios.patch(`${baseURL}${endpoint}`, {
        [statusField]: newStatus,
      });

      setTableData((prevData) =>
        prevData.map((faq) => {
          const itemId = currentSectionId === 4 ? faq.city_pathology_faq_id : faq.city_faq_id;
          if (itemId === faqId) {
            return { ...faq, [statusField]: newStatus };
          }
          return faq;
        })
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
    defaultDateFilter: "",
  });

  // Use currentSectionId instead of tabKey for table config
  const config = tableConfig[currentSectionId]?.[tabKey];
  const { endpoint, headers } = config || { endpoint: "", headers: [] };

  const statusFilterOptions = [
    { label: "Active", value: "0" },
    { label: "Inactive", value: "1" },
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = getFilterParams(pageSize, filterParams);
      const res = await axios.get(`${baseURL}${endpoint}`, { params });
      console.log("API Response:", res.data);

      let dataArray: any[] = [];

      // console.log("Current Section ID:", currentSectionId);
      
      // Fix: Use currentSectionId directly instead of sectionMap[currentSectionId]
      if (currentSectionId === 1) {
        if (tabKey === 1) {
          dataArray = res.data?.jsonData?.city_content_list || [];
        } else if (tabKey === 2) {
          dataArray = res.data?.jsonData?.city_content_faq_list || [];
        }
      } else if (currentSectionId === 2) {
        if (tabKey === 1) {
          dataArray = res.data?.jsonData?.city_manpower_content_list || [];
        } else if (tabKey === 2) {
          dataArray = res.data?.jsonData?.city_manpower_content_faq_list || [];
        }
      } else if (currentSectionId === 3) {
        if (tabKey === 1) {
          dataArray = res.data?.jsonData?.city_video_consultancy_content_list || [];
        } else if (tabKey === 2) {
          dataArray = res.data?.jsonData?.city_content_video_consult_faq_list || [];
        }
      } else if (currentSectionId === 4) {
        if (tabKey === 1) {
          dataArray = res.data?.jsonData?.pathology_city_content_list || [];
        } else if (tabKey === 2) {
          dataArray = res.data?.jsonData?.city_content_pathology_faq_list || [];
        }
      }

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
    currentSectionId,
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
      data: currentSectionId === 4 ? "city_pathology_id" : "city_id",
      render: (data: any) => {
        return data || "N/A";
      },
    },
    {
      title: "City Name",
      data: currentSectionId === 4 ? "city_pathology_name" : "city_name",
      render: (data: string) => {
        return data || "N/A";
      },
    },
    {
      title: "City Title",
      data: currentSectionId === 4 ? "city_pathology_title" : "city_title",
      render: (data: string) => {
        return data || "N/A";
      },
    },
    {
      title: "Date",
      data: currentSectionId === 4 ? "city_pathology_timestamp" : "city_timestamp",
      render: (data: any) => {
        return formatDate(data);
      },
    },
    {
      title: "Status",
      data: currentSectionId === 4 ? "city_pathology_status" : "city_status",
      render: (data: any) => {
        const status = typeof data === "string" ? parseInt(data) : data;
        if (status === 0 || status === "0") {
          return `<span class="badge badge-label badge-soft-success">Active</span>`;
        } else if (status === 1 || status === "1") {
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
        
        // Get the correct ID field based on section
        const cityId = currentSectionId === 4 ? rowData.city_pathology_id : rowData.city_id;
        const cityStatus = currentSectionId === 4 ? rowData.city_pathology_status : rowData.city_status;
        
        root.render(
          <div className="d-flex flex-row gap-1">
            <button
              className="p-0 p-1 text-white rounded-1 d-flex align-items-center justify-content-center"
              onClick={() => {
                toggleStatus(cityId, cityStatus);
              }}
              title={
                cityStatus === 0
                  ? "Click to deactivate"
                  : "Click to activate"
              }
              style={{
                backgroundColor:
                  cityStatus === 0 ? "#d9534f" : "#3a833a",
              }}
            >
              {cityStatus === 0 ? (
                <FaRegTimesCircle className="me-1" />
              ) : (
                <FaRegCheckCircle className="me-1" />
              )}
            </button>
            <button
              className="edit-icon p-0 p-1 text-white rounded-1 d-flex align-items-center justify-content-center"
              onClick={() => {
                navigate(`/city/${currentSectionName}/edit-city/${cityId}`);
              }}
            >
              <TbEdit className="me-1" />
            </button>
          </div>
        );
      },
    },
  ];

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
      data: currentSectionId === 4 ? "city_pathology_faq_id" : "city_faq_id",
      render: (data: any) => {
        return data || "N/A";
      },
    },
    {
      title: "City",
      data: "city_name",
      defaultContent: "N/A",
    },
    {
      title: "Question",
      data: currentSectionId === 4 ? "city_pathology_faq_que" : "city_faq_que",
      render: (data: string) => {
        return data || "N/A";
      },
    },
    {
      title: "Answer",
      data: currentSectionId === 4 ? "city_pathology_faq_ans" : "city_faq_ans",
      render: (data: string) => {
        return data || "N/A";
      },
    },
    {
      title: "Status",
      data: currentSectionId === 4 ? "city_pathology_faq_status" : "city_faq_status",
      defaultContent: "0",
      render: (data: any) => {
        const status = typeof data === "string" ? parseInt(data) : data;
        if (status === 0 || status === "0") {
          return `<span class="badge badge-label badge-soft-success">Active</span>`;
        } else if (status === 1 || status === "1") {
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
        
        // Get the correct ID and status fields based on section
        const faqId = currentSectionId === 4 ? rowData.city_pathology_faq_id : rowData.city_faq_id;
        const faqStatus = currentSectionId === 4 ? rowData.city_pathology_faq_status : rowData.city_faq_status;
        const status =
          typeof faqStatus === "string"
            ? parseInt(faqStatus)
            : faqStatus;

        root.render(
          <div className="d-flex flex-row gap-1">
            <button
              className="p-0 p-1 text-white rounded-1 d-flex align-items-center justify-content-center"
              onClick={() => {
                toggleFAQStatus(faqId, faqStatus);
              }}
              title={status === 0 ? "Click to deactivate" : "Click to activate"}
              style={{
                backgroundColor: status === 0 ? "#d9534f" : "#3a833a",
              }}
            >
              {status === 0 ? (
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
        "Status",
      ];
    }
    return headers;
  };

  return (
    <>
      <ComponentCard
        title={
          <div className="w-100">
            {getSectionName()} - {tabKey === 1 ? "City" : "City FAQ"}
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
              key={`city-table-${currentSectionId}-${tabKey}-${dateFilter}-${statusFilter}-${dateRange}-${currentPage}`}
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
