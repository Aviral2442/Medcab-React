import { useEffect, useState } from "react";
import ComponentCard from "@/components/ComponentCard";
import {
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
} from "react-bootstrap";

import DT from "datatables.net-bs5";
import DataTable from "datatables.net-react";
import "datatables.net-buttons-bs5";
import "datatables.net-buttons/js/buttons.html5";

// import ReactDOMServer from "react-dom/server";
import {
  TbDotsVertical,
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
} from "@/views/tables/data-tables/export-data/manpower/category.ts";

import { createRoot } from "react-dom/client";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import TablePagination from "@/components/table/TablePagination";

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
    headers: ["S.No.", 'ID', 'Cat_1', 'Name', 'Image', 'Overview', 'Description', 'GST%', 'Emergency', 'Popular', 'Status'],
  },
  3: {
    endpoint: "/manpower/get-faqs",
    columns: categoryColumns,
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
    headers: ["S.No.", 'ID', 'Code', 'Description', 'Min_Cart', 'Discount', 'Dis_Amt', 'Max_Dis', 'Visible', 'Status'],
  },
  6: {
    endpoint: "/manpower/get-price-mapper",
    columns: priceMapperColumns,
    headers: ["S.No.", 'ID', 'Sub_Cat', 'Visit_Rate', 'Day_Rate', 'Monthly_Rate', 'Gender', 'City', 'Status'],
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
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Pagination states - initialize from URL
  const [currentPage, setCurrentPage] = useState(() => {
    const page = searchParams.get('page');
    return page ? parseInt(page) - 1 : 0; // Convert to 0-based index
  });
  const [pageSize, _setPageSize] = useState(10);
  const [_total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  const baseURL = (import.meta as any).env?.VITE_PATH ?? "";

  const { endpoint, columns, headers } = tableConfig[tabKey];

  // Update URL when page changes
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', (newPage + 1).toString()); // Convert to 1-based for URL
    setSearchParams(newParams);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseURL}${endpoint}`, {
        params: {
          page: currentPage + 1,
          limit: pageSize,
        },
      });
      console.log("Fetched data:", res);
      
      let dataArray = [];
      switch (tabKey) {
        case 1:
          dataArray = res.data.categories || [];
          break;
        case 2:
          dataArray = res.data.subCategories || [];
          break;
        case 4:
          dataArray = res.data.banners || [];
          break;
        case 5:
          dataArray = res.data.coupons || [];
          break;
        case 6:
          dataArray = res.data.priceMapper || [];
          break;
        default:
          dataArray = res.data.categories || [];
      }
      
      setRows(dataArray);
      setTotal(res.data.total || dataArray.length);
      setTotalPages(res.data.totalPages || Math.ceil(dataArray.length / pageSize));
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
          <Dropdown align="end" className="text-muted">
            <DropdownToggle
              variant="link"
              className="drop-arrow-none fs-xxl link-reset p-0"
            >
              <TbDotsVertical />
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem onClick={() => onEditRow(rowData)}>
                <TbEdit className="me-1" /> Edit
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
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
          <>
            <DataTable
              key={`export-table-${tabKey}-${currentPage}`}
              data={rows}
              columns={columnsWithActions}
              options={{
                responsive: true,
                destroy: true,
                paging: false,
                searching: false,
                info: false,
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
              className="table table-striped dt-responsive align-middle mb-0"
            >
              <thead className="thead-sm text-uppercase fs-xxs">
                <tr>
                  {headers.map((col, idx) => (
                    <th key={idx}>{col}</th>
                  ))}
                  <th>Actions</th>
                </tr>
              </thead>
            </DataTable>

            <TablePagination
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
            />
          </>
        )}
      </ComponentCard>
    </>
  );
};

export default ExportDataWithButtons;
