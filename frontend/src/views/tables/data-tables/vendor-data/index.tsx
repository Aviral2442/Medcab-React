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
  TbEye,
  TbReceipt,
} from "react-icons/tb";

import jszip from "jszip";
import pdfmake from "pdfmake";
import { vendorColumns } from "@/views/tables/data-tables/vendor-data/vendor/vendor.ts";
import { createRoot } from "react-dom/client";
import axios from "axios";
import { useNavigate } from "react-router";
import AddRemark from "@/components/AddRemark";
import { DateRangePicker, InputPicker } from "rsuite";
import "rsuite/dist/rsuite.min.css";

// Register DataTable plugins
DataTable.use(DT);
DT.Buttons.jszip(jszip);
DT.Buttons.pdfMake(pdfmake);

const tableConfig: Record<
  number,
  { endpoint: string; columns: any[]; headers: string[] }
> = {
  1: {
    endpoint: "/vendor/vendors_list",
    columns: vendorColumns,
    headers: [
      "S.No.",
      "ID",
      "Picture",
      "Name",
      "Mobile",
      "Gender",
      "City",
      "Category ",
      "Date",
      "Status",
    ],
  },
};

type ExportDataWithButtonsProps = {
  tabKey: number;
  refreshFlag: number;
  filterParams?: Record<string, any>;
  onDataChanged?: () => void;
};

const ExportDataWithButtons = ({
  tabKey,
  refreshFlag,
  filterParams = {},
  onDataChanged,
}: ExportDataWithButtonsProps) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isRemarkOpen, setIsRemarkOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(
    null
  );
  const [dateFilter, setDateFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<[Date, Date] | null>(null);

  const navigate = useNavigate();

  const { endpoint, columns, headers } = tableConfig[tabKey];

  const DateFilterOptions = [
    "today",
    "yesterday",
    "thisWeek",
    "thisMonth",
    "custom",
  ].map((item) => ({
    label: item,
    value: item,
  }));

  const StatusFilterOption = [
    { label: "Active", value: "active" },
    { label: "Blocked", value: "block" },
    { label: "New", value: "new" },
    { label: "Pending Approval", value: "pendingApproval" },
    { label: "Assigned", value: "assign" },
    { label: "Free", value: "free" },
    { label: "On Duty", value: "onDuty" },
    { label: "OFF Duty", value: "offDuty" },
  ];

  const getFilterParams = () => {
    const params: any = { ...filterParams };
    if (dateFilter) params.date = dateFilter;
    if (statusFilter) params.status = statusFilter;
    if (dateRange) {
      params.fromDate = dateRange[0].toISOString().split("T")[0];
      params.toDate = dateRange[1].toISOString().split("T")[0];
    }
    return params;
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${process.env.VITE_PATH}${endpoint}`, { params: getFilterParams() });
      console.log("API Response:", res.data);
      const vendors = res.data?.jsonData?.vendors || [];
      // console.log("Fetched vendor data:", vendors);
      setData(vendors);
    } catch (error) {
      console.error("Error fetching vendor data:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRemark = (rowData: any) => {
    const id = rowData?.vendor_id ?? rowData?.id;
    console.log("Selected Booking ID for Remark:", id);
    setSelectedBookingId(id);
    setIsRemarkOpen(true);
  };

  const handleSaveRemark = async (remark: string) => {
    try {
      await axios.post(`${process.env.VITE_PATH}/add_remarks/${selectedBookingId}`, {
        remarkType: "VENDOR",
        remarks: remark,
      });
      console.log("Remark saved successfully");
      fetchData();
      onDataChanged?.();
    } catch (error) {
      console.error("Error saving remark:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [tabKey, refreshFlag, dateFilter, statusFilter, dateRange, JSON.stringify(filterParams)]);

  const columnsWithActions = [
    {
      title: "S.No.",
      data: null,
      orderable: false,
      searchable: false,
      render: (_data: any, _type: any, _row: any, meta: any) => {
        return meta.row + 1;
      },
    },
    ...columns,
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
              <DropdownItem
                onClick={() => {
                  navigate(`/vendor-details/${rowData.vendor_id}`);
                }}
              >
                <TbEye className="me-1" /> View
              </DropdownItem>
              <DropdownItem onClick={() => handleRemark(rowData)}>
                <TbReceipt className="me-1" /> Remark
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        );
      },
    },
  ];

  const filterActions = (
    <div className="d-flex align-items-center gap-2 flex-wrap">
      <DateRangePicker
        format="MM/dd/yyyy"
        style={{ width: 220 }}
        value={dateRange}
        onChange={setDateRange}
        placeholder="Select date range"
        cleanable
        size="sm"
      />
      <InputPicker
        data={DateFilterOptions}
        value={dateFilter}
        onChange={setDateFilter}
        placeholder="Date filter"
        style={{ width: 150 }}
        cleanable
        size="sm"
      />
      <InputPicker
        data={StatusFilterOption}
        value={statusFilter}
        onChange={setStatusFilter}
        placeholder="Status"
        style={{ width: 150 }}
        cleanable
        size="sm"
      />
    </div>
  );

  return (
    <>
      <ComponentCard
        title={tabKey === 1 ? "Manage Vendor" : ""}
        className="mb-2 overflow-x-auto"
        headerActions={filterActions}
      >
        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : (
          <DataTable
            key={`vendor-table-${tabKey}-${dateFilter}-${statusFilter}-${dateRange}`}
            data={data}
            columns={columnsWithActions}
            options={{
              responsive: true,
              destroy: true,
              layout: { 
                topStart: "buttons",
                topEnd: "search"
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
      <AddRemark
        isOpen={isRemarkOpen}
        onClose={() => setIsRemarkOpen(false)}
        bookingId={selectedBookingId ?? undefined}
        onSave={handleSaveRemark}
      />
    </>
  );
};

export default ExportDataWithButtons;
