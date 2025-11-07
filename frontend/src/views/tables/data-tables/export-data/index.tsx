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

import ReactDOMServer from "react-dom/server";
import {
  TbChevronLeft,
  TbChevronRight,
  TbChevronsLeft,
  TbChevronsRight,
  TbDotsVertical,
  TbEdit,
  TbEye,
  TbTrash,
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
    columns: subCategoryColumns, // define similar to categoryColumns
    headers: ["S.No.", 'Sub Category ID', 'Category Name', 'Name', 'Image', 'Overview', 'Description', 'GST%', 'Emergency', 'Popular', 'Status'],
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
    headers: ["S.No.", 'ID', 'Code', 'Description', 'Min Cart', 'Discount %', 'Discount Amt', 'Max Discount', 'Visible', 'Status'],
  },
  6: {
    endpoint: "/manpower/get-price-mapper",
    columns: priceMapperColumns,
    headers: ["S.No.", 'ID', 'Sub Cat Name', 'Visit Rate', 'Day Rate', 'Monthly Rate', 'Gender', 'City', 'Status'],
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
  onDataChanged,
}: ExportDataWithButtonsProps) => {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const baseURL = (import.meta as any).env?.VITE_PATH ?? "";

  const { endpoint, columns, headers } = tableConfig[tabKey];



  const fetchData = async () => {
    setLoading(true);
    try {
      // const res = await axios.get("/manpower/get-categories");
      const res = await axios.get(`${baseURL}${endpoint}`);
      console.log("Fetched data:", res);
      switch (tabKey) {
        case 1:
          setRows(res.data.categories || []);
          break;
        case 2:
          setRows(res.data.subCategories || []);
          break;
        case 4:
          setRows(res.data.banners || []);
          break;
        case 5:
          setRows(res.data.coupons || []);
          break;
        case 6:
          setRows(res.data.priceMapper || []);
          break;
        default:
          setRows(res.data.categories || []);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [tabKey, refreshFlag]);

  const handleDelete = async (rowData: any) => {
    // console.log("Delete clicked", rowData);
    let mp_id;
    let mp_name;
    switch(tabKey) { 
      case 1:
        mp_id = rowData.mp_cat_id;
        mp_name = rowData.mp_cat_name;
        break;
      case 2:
        mp_id = rowData.mp_sub_category_id;
        mp_name = rowData.mpsc_name;
        break;
      case 4:
        mp_id = rowData.banner_id;
        mp_name = rowData.banner_id;
        break;
      case 5:
        mp_id = rowData.mpc_coupon_id;
        mp_name = rowData.mpc_coupon_code;
        break;
      case 6:
        mp_id = rowData.mppm_id;
        mp_name = rowData.mppm_id;
        break;
      // Add cases for other tabKeys as needed
      default:
        mp_id = rowData.mp_cat_id; // Default case
    }
    if (!confirm(`Are you sure you want to delete "${mp_name}"?`))
      return;
    try {
      await axios.delete(`${endpoint.replace("get-", "delete-")}/${mp_id}`);
      onDataChanged();
      // fetchData();
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete item");
    }
  };

  const columnsWithActions = [
    ...columns,
    {
      title: "Actions",
      data: null,
      orderable: false,
      createdCell: (td: HTMLElement, rowData: any) => {
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
              <DropdownItem onClick={() => console.log("View", rowData)}>
                <TbEye className="me-1" /> View
              </DropdownItem>
              <DropdownItem onClick={() => onEditRow(rowData)}>
                <TbEdit className="me-1" /> Edit
              </DropdownItem>
              <DropdownItem
                className="text-danger"
                onClick={() => handleDelete(rowData)}
              >
                <TbTrash className="me-1" /> Delete
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
          <DataTable
            // data={categoryTableData.body}
            data={rows}
            columns={columnsWithActions}
            options={{
              responsive: true,
              layout: {
                topStart: "buttons",
              },
              buttons: [
                { extend: "copy", className: "btn btn-sm btn-secondary" },
                { extend: "csv", className: "btn btn-sm btn-secondary active" },
                { extend: "excel", className: "btn btn-sm btn-secondary" },
                { extend: "pdf", className: "btn btn-sm btn-secondary active" },
              ],
              language: {
                paginate: {
                  first: ReactDOMServer.renderToStaticMarkup(
                    <TbChevronsLeft className="fs-lg" />
                  ),
                  previous: ReactDOMServer.renderToStaticMarkup(
                    <TbChevronLeft className="fs-lg" />
                  ),
                  next: ReactDOMServer.renderToStaticMarkup(
                    <TbChevronRight className="fs-lg" />
                  ),
                  last: ReactDOMServer.renderToStaticMarkup(
                    <TbChevronsRight className="fs-lg" />
                  ),
                },
              },
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
        )}
      </ComponentCard>
    </>
  );
};

export default ExportDataWithButtons;
