import { useEffect, useState, useRef } from "react";
import ComponentCard from "@/components/ComponentCard";
import "@/global.css";
// import { InputGroup, FormControl, ButtonGroup, Button } from "react-bootstrap";
import DT from "datatables.net-bs5";
import DataTable from "datatables.net-react";
import "datatables.net-buttons-bs5";
import "datatables.net-buttons/js/buttons.html5";

import { TbEye, TbEdit, TbArrowRight} from "react-icons/tb";
import jszip from "jszip";
import pdfmake from "pdfmake";
import { createRoot } from "react-dom/client";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import TablePagination from "@/components/table/TablePagination";
import TableFilters from "@/components/table/TableFilters";
import { useTableFilters } from "@/hooks/useTableFilters";
import _pdfMake from "pdfmake/build/pdfmake";
import _pdfFonts from "pdfmake/build/vfs_fonts";
// import { LuActivity, LuCircle } from "react-icons/lu";

DataTable.use(DT);
DT.Buttons.jszip(jszip);
DT.Buttons.pdfMake(pdfmake);

const tableConfig: Record<number, { endpoint: string; headers: string[] }> = {
  1: {
    endpoint: "/content_writer/get_blogs_list",
    headers: [
      "S.No.",
      "Image",
      "Blog ID",
      "Title",
      "Category",
      "Created At",
      "Status",
    ],
  },
};

type ExportDataWithButtonsProps = {
  tabKey: number;
  refreshFlag: number;
  onAddNew: () => void;
  filterParams?: Record<string, any>;
  _onDataChanged?: () => void;
};

const ExportDataWithButtons = ({
  tabKey,
  refreshFlag,
  onAddNew,
  filterParams = {},
//   _onDataChanged,
}: ExportDataWithButtonsProps) => {
  const navigate = useNavigate();
  const [tableData, setTableData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
  const tableRef = useRef<any>(null);

  const [pageSize] = useState(10);
  const [_total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const baseURL = (import.meta as any).env?.VITE_PATH ?? "";
  const basePath = "http://localhost:4000";

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

      const blogs = res.data?.jsonData?.blogs_list || [];
      setTableData(blogs);

      if (res.data.pagination) {
        setTotal(res.data.pagination.total);
        setTotalPages(res.data.pagination.totalPages);
      } else {
        setTotal(blogs.length);
        setTotalPages(Math.ceil(blogs.length / pageSize));
      }
    } catch (error) {
      console.error("Error fetching blogs data:", error);
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

  const blogColumns = [
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
      data: "blogs_id",
    },
    {
      title: "Image",
      data: "blogs_image",
      orderable: false,
      render: (data: string) => {
        if (!data) return '<span class="text-muted">No Image</span>';
        return `<img src="${basePath}/${data}" alt="Blog" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;" />`;
      },
    },
    {
      title: "Title",
      data: "blogs_title",
      render: (data: string) => {
        return data || "N/A";
      },
    },
    {
      title: "Category",
      data: "blogs_category",
      render: (data: number) => {
        const categoryMap: Record<number, string> = {
          1: "Ambulance",
          2: "Pathology",
          3: "Manpower",
        };
        return categoryMap[data] || "Unknown";
      },
    },
    {
      title: "Date",
      data: "blogs_created_at",
      render: (data: number) => formatDate(data),
    },
    {
      title: "Status",
      data: "blogs_status",
    render: (data: number) => {
      if (data == 1) {
        return `<span class="badge badge-label badge-soft-success">Active</span>`;
      } else if (data == 0) {
        return `<span class="badge badge-label badge-soft-danger">Inactive</span>`;
      }
    }
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
              className="eye-icon p-0 ps-1 text-white rounded-1 d-flex align-items-center justify-content-center"
              onClick={() => {
                // navigate(`/blog-details/${rowData.blogs_id}`);
              }}
            >
                {/* created a toggle for inactive or active blogs */}

              <TbEye className="me-1" />
              {/* <TbEyeClosed/> */}
            </button>
            <button
              className="edit-icon p-0 ps-1 py-1 text-white rounded-1 d-flex align-items-center justify-content-center"
              onClick={() => {
                navigate(`/edit-blog/${rowData.blogs_id}`);
              }}
            >
              <TbEdit className="me-1" />
            </button>
            {/* <button
                className="icon-link icon-link-hover link-secondary link-underline-secondary link-underline-opacity-25 fw-semibold bg-transparent border-0 p-0"

              >
                
                
            </button> */}
          </div>
        );
      },
    },
  ];

  return (
    <>
      <ComponentCard
        title={
          <div className="w-100 ">
            {tabKey === 1 ? "Manage Blogs" : ""}
            {/* <div className="mb-3"></div> */}
            {/* <div className="d-flex flex-column flex-md-row gap-2 align-items-start align-items-md-center justify-content-between">
              <div className="d-flex gap-2 flex-wrap">
                <InputGroup style={{ maxWidth: '300px' }}>
                  <FormControl
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </InputGroup>
                <ButtonGroup>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleExport('copy')}
                  >
                    Copy
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleExport('excel')}
                  >
                    Excel
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleExport('csv')}
                  >
                    CSV
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleExport('pdf')}
                  >
                    PDF
                  </Button>
                </ButtonGroup>
              </div>
            </div> */}
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
            />
            <button 
              className="icon-link icon-link-hover link-secondary link-underline-secondary link-underline-opacity-25 fw-semibold bg-transparent border-0 p-0"
              onClick={onAddNew}
            >
              Add New <TbArrowRight className="bi align-middle fs-lg"></TbArrowRight>
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
              key={`blogs-table-${tabKey}-${dateFilter}-${statusFilter}-${dateRange}-${currentPage}`}
              data={tableData}
              columns={blogColumns}
               options={{
                responsive: true,
                destroy: true,
                paging: false,
                searching: true,
                info: false,
                layout: {
                  topStart: "buttons",
                },
                // dom: 'Bfrtip', // Add this line to display buttons
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
              <thead className="thead-sm text-uppercase fs-xxs">
                <tr>
                  {headers.map((header, idx) => (
                    <th key={idx}>{header}</th>
                  ))}
                  <th>Actions</th>
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
