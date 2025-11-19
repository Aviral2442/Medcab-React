import { useEffect, useState } from "react";
import ComponentCard from "@/components/ComponentCard";
// import {
//   Dropdown,
//   DropdownMenu,
//   DropdownItem,
//   DropdownToggle,
// } from "react-bootstrap";

import DT from "datatables.net-bs5";
import DataTable from "datatables.net-react";
import "datatables.net-buttons-bs5";
import "datatables.net-buttons/js/buttons.html5";
import '@/global.css';

// import ReactDOMServer from "react-dom/server";
import {
  // TbDotsVertical,
  TbEdit,
} from "react-icons/tb";

import jszip from "jszip";
import pdfmake from "pdfmake";
import {
  categoryColumns,
  subCategoryColumns,
  couponColumns,
  bannerColumns,
  priceMapperColumns,
  faqColumns,
} from "@/views/tables/data-tables/manpower/category/manpower/category";

import { createRoot } from "react-dom/client";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
// import TablePagination from "@/components/table/TablePagination";
import _pdfMake from "pdfmake/build/pdfmake";
import _pdfFonts from "pdfmake/build/vfs_fonts";

const tableConfig: Record<number, {
  endpoint: string;
  columns: any[];
  headers: string[];
}> = {
  1: { // Category
    endpoint: "/manpower/get-category",
    columns: categoryColumns,
    headers: ["S.No.", 'ID', 'Name', 'Image', 'Top Rated', 'Status'],
  },
  2: { // Sub Category
    endpoint: "/manpower/get-subcategory",
    columns: subCategoryColumns,
    headers: ["S.No.", 'ID', 'cat', 'sub cat', 'Image', 'Overview', 'Description', 'GST%', 'Emergency', 'Popular', 'Status'],
  },
  3: {
    endpoint: "/manpower/get_faq",
    columns: faqColumns,
    headers: ["S.No.", 'ID', 'Question', 'Answer', 'Status'],
  },
  4: {
    endpoint: "/manpower/get-banner",
    columns: bannerColumns,
    headers: ["S.No.", 'ID', 'Image', 'Page', 'Status'],
  },
  5: {
    endpoint: "/manpower/get-coupon",
    columns: couponColumns,
    headers: ["S.No.", 'ID', 'Code', 'Description', 'Cart', 'Discount', 'Dis', 'Max', 'Visible', 'Status'],
  },
  6: {
    endpoint: "/manpower/get-price-mapper",
    columns: priceMapperColumns,
    headers: ["S.No.", 'ID', 'Sub Cat', 'Visit', 'Day', 'Monthly', 'Gender', 'City', 'Status'],
  },
};

type ExportDataWithButtonsProps = {
  tabKey: number;
  onAddNew: () => void;
  onEditRow: (rowData: any) => void;
  refreshFlag: number;
  onDataChanged: () => void;
};

DataTable.use(DT);
DT.Buttons.jszip(jszip);
DT.Buttons.pdfMake(pdfmake);

const ExportDataWithButtons = ({
  tabKey,
  onAddNew,
  onEditRow,
  refreshFlag,
  // onDataChanged,
}: ExportDataWithButtonsProps) => {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // URL search params
  const [searchParams, _setSearchParams] = useSearchParams();
  
  // Pagination states - initialize from URL
  const [currentPage, _setCurrentPage] = useState(() => {
    const page = searchParams.get('page');
    return page ? parseInt(page) - 1 : 0; // Convert to 0-based index
  });
  const [pageSize, _setPageSize] = useState(10);
  const [_total, setTotal] = useState(0);
  const [_totalPages, setTotalPages] = useState(0);
  
  const baseURL = (import.meta as any).env?.VITE_PATH ?? "";

  const { endpoint, columns, headers } = tableConfig[tabKey];

  // Update URL when page changes
  // const handlePageChange = (newPage: number) => {
  //   setCurrentPage(newPage);
  //   const newParams = new URLSearchParams(searchParams);
  //   newParams.set('page', (newPage + 1).toString()); // Convert to 1-based for URL
  //   setSearchParams(newParams);
  // };

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: pageSize.toString(),
      });

      const res = await axios.get(`${baseURL}${endpoint}`, { params });
      console.log("API Response:", res.data);

      let dataArray: any[] = [];
      
      switch (tabKey) {
        case 1:
          dataArray = res.data.categories || [];
          setTotal(res.data.total || 0);
          setTotalPages(res.data.totalPages || 0);
          break;
        case 2:
          dataArray = res.data.subCategories || [];
          setTotal(res.data.total || 0);
          setTotalPages(res.data.totalPages || 0);
          break;
        case 3:
          dataArray = res.data.jsonData?.faqs || [];
          setTotal(res.data.pagination?.total || 0);
          setTotalPages(res.data.pagination?.totalPages || 0);
          break;
        case 4:
          dataArray = res.data.banners || [];
          setTotal(res.data.total || 0);
          setTotalPages(res.data.totalPages || 0);
          break;
        case 5:
          dataArray = res.data.coupons || [];
          setTotal(res.data.total || 0);
          setTotalPages(res.data.totalPages || 0);
          break;
        case 6:
          dataArray = res.data.priceMapper || [];
          setTotal(res.data.total || 0);
          setTotalPages(res.data.totalPages || 0);
          break;
        default:
          dataArray = res.data.categories || [];
          setTotal(res.data.total || 0);
          setTotalPages(res.data.totalPages || 0);
      }
      
      setRows(dataArray);
    } catch (err) {
      console.error("Fetch error:", err);
      setRows([]);
      setTotal(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [tabKey, refreshFlag, currentPage, pageSize]);

  const columnsWithActions = [
    {
      title: "S.No.",
      data: null,
      orderable: false,
      searchable: false,
      render: (_data: any, _type: any, _row: any, meta: any) => {
        return currentPage * pageSize + meta.row + 1;
      },
    },
    ...columns.slice(1), // Skip the first S.No. column from original columns
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
          <div className="d-flex align-items-center gap-2">
            <button
              className="edit-icon p-0 p-1 border-0 text-white rounded-1 d-flex align-items-center justify-content-center"
              onClick={() => onEditRow(rowData)}
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
          tabKey === 1
            ? "Category"
            : tabKey === 2
            ? "Sub Category"
            : tabKey === 3
            ? "FAQ"
            : tabKey === 4
            ? "Banner"
            : tabKey === 5
            ? "Coupons"
            : "Price Mapper"
        }
        className="mb-4"
        onAddNew={onAddNew}
      >
        {loading ? (
          <div className="text-center p-4">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <DataTable
              key={`export-table-${tabKey}-${currentPage}`}
              data={rows}
              columns={columnsWithActions}
              options={{
                responsive: true,
                destroy: true,
                paging: true,
                searching: true,
                info: true,
                layout: {
                  topStart: "buttons",
                },
                buttons: [
                  { extend: "copy", className: "btn btn-sm btn-secondary" },
                  { extend: "csv", className: "btn btn-sm btn-secondary active" },
                  { extend: "excel", className: "btn btn-sm btn-secondary" },
                  { extend: "pdf", className: "btn btn-sm btn-secondary active" },
                ],
              }}
              className="table table-striped dt-responsive align-middle mb-0 "
            >
              <thead className="thead-sm text-capitalize fs-xxs">
                <tr>
                  {headers.map((col, idx) => (
                    <th key={idx}>{col}</th>
                  ))}
                  <th>Actions</th>
                </tr>
              </thead>
            </DataTable>

            {/* <TablePagination
              // totalItems={total}
              start={currentPage + 1}
              // end={totalPages}
              // itemsName="items"
              showInfo={true}
              previousPage={() => handlePageChange(Math.max(0, currentPage - 1))}
              canPreviousPage={currentPage > 0}
              pageCount={totalPages}
              pageIndex={currentPage}
              setPageIndex={handlePageChange}
              nextPage={() => handlePageChange(Math.min(totalPages - 1, currentPage + 1))}
              canNextPage={currentPage < totalPages - 1}
            /> */}
          </div>
        )}
      </ComponentCard>
    </>
  );
};

export default ExportDataWithButtons;
