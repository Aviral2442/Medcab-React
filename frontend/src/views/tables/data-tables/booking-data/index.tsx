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
import AddRemark from "@/components/AddRemark";

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
import { bookingColumns } from "@/views/tables/data-tables/booking-data/booking/bookings.ts";
import { DateRangePicker, InputPicker } from "rsuite";
import { createRoot } from "react-dom/client";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "rsuite/dist/rsuite.min.css";


const tableConfig: Record<
  number,
  {
    endpoint: string;
    columns: any[];
    headers: string[];
  }
> = {
  1: {
    endpoint: "/booking/get_bookings",
    columns: bookingColumns,
    headers: [
      "S.No.",
      "order id",
      "name",
      "mobile_no",
      "address_id",
      "Price",
      "payment_mode",
      "order_date",
      "status",
    ],
  },
};

type ExportDataWithButtonsProps = {
  tabKey: number;
  refreshFlag: number;
  filterParams?: Record<string, any>;
  onDataChanged: () => void;
};

DataTable.use(DT);
DT.Buttons.jszip(jszip);
DT.Buttons.pdfMake(pdfmake);

const ExportDataWithButtons = ({
  tabKey,
  refreshFlag,
  filterParams = {},
  onDataChanged,
}: ExportDataWithButtonsProps) => {
  const [rows, setRows] = useState<any[]>([]);
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
    label:
      item.charAt(0).toUpperCase() + item.slice(1).replace(/([A-Z])/g, " $1"),
    value: item,
  }));

  const StatusFilterOption = [
    { label: "New", value: "1" },
    { label: "Ongoing", value: "2" },
    { label: "Canceled", value: "3" },
    { label: "Completed", value: "4" },
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
      console.log("Fetched data:", res);
      switch (tabKey) {
        case 1:
          setRows(res.data.bookings || []);
          break;
        default:
          setRows(res.data.remark || []);
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

  const handleView = (rowData: any) => {
    const id =
      rowData?.manpower_order_id ?? rowData?.mpo_order_id ?? rowData?.id;
    if (id !== undefined && id !== null) {
      navigate(`/booking-details/${id}`);
    } else {
      console.warn("No id found for row", rowData);
    }
  };

  const handleRemark = (rowData: any) => {
    const id =
      rowData?.manpower_order_id ?? rowData?.mpo_order_id ?? rowData?.id;
    console.log("Selected Booking ID for Remark:", id);
    setSelectedBookingId(id);
    setIsRemarkOpen(true);
  };

  const handleSaveRemark = async (remark: string) => {
    try {
      // Replace with your API endpoint
      await axios.post(`${process.env.VITE_PATH}/add_remarks/${selectedBookingId}`, {
        remarkType: "BOOKING",
        remarks: remark,
      });
      console.log("Remark saved successfully");
      fetchData();
      onDataChanged();
    } catch (error) {
      console.error("Error saving remark:", error);
    }
  };

  const columnsWithActions = [
    {
      title: "S.No.",
      data: null,
      orderable: false,
      render: (_data: any, _type: any, _row: any, meta: any) => {
        return meta.row + 1;
      },
    },
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
              <DropdownItem onClick={() => handleView(rowData)}>
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
        title={tabKey === 1 ? "Manage Booking" : ""}
        className="mb-4 overflow-x-auto"
        headerActions={filterActions}
      >
        {loading ? (
          <div className="text-center p-4">Loading...</div>
        ) : (
          <DataTable
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
