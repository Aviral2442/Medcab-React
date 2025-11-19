import React, { useState } from "react";
import { Card, Row, Col, Form, Button } from "react-bootstrap";
import { TbPencil, TbCheck, TbX } from "react-icons/tb";
import "@/global.css";
import DateConversion from "../DateConversion";

interface BookingDetailsFormProps {
  data: any;
  onUpdate?: (field: string, value: string) => void;
  editable?: boolean;
}

interface SectionProps {
  title: string;
  children: React.ReactNode;
  titleColor?: string;
}

const Section: React.FC<SectionProps> = ({
  title,
  children,
  titleColor = "primary",
}) => (
  <div className="pb-0 pt-0 mb-0 mt-0">
    <h6 className={`text-${titleColor} mb-2 `}>{title}</h6>
    {children}
  </div>
);

interface FieldProps {
  label: string;
  value: string | number;
  fieldName: string;
  editable?: boolean;
  onEdit?: (value: string) => void;
  type?:
    | "text"
    | "number"
    | "tel"
    | "email"
    | "date"
    | "datetime-local"
    | "textarea"
    | "select";
  rows?: number;
  options?: { value: string | number; label: string }[];
}

const Field: React.FC<FieldProps> = ({
  label,
  value,
  editable = true,
  onEdit,
  type = "text",
  rows = 3,
  options = [],
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value?.toString() || "");

  const formatDisplayValue = (val: string | number) => {
    if (!val && val !== 0) return "N/A";
    const valStr = val.toString();

    // For select fields, show the label instead of value
    if (type === "select" && options.length > 0) {
      const option = options.find((opt) => opt.value.toString() === valStr);
      return option ? option.label : valStr;
    }

    if (type === "date" || type === "datetime-local") {
      try {
        const date = /^\d+$/.test(valStr)
          ? new Date(parseInt(valStr) * 1000)
          : new Date(valStr);
        if (isNaN(date.getTime())) return valStr;

        const pad = (n: number) => String(n).padStart(2, "0");
        if (type === "date") {
          // Use DateConversion for date display
          return DateConversion(date.toISOString());
        }
        // For datetime-local, format as YYYY-MM-DDTHH:mm for input
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
          date.getDate()
        )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
      } catch {
        return valStr;
      }
    }

    return valStr;
  };

  const displayValue = formatDisplayValue(value);

  const handleSave = () => {
    onEdit?.(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value?.toString() || "");
    setIsEditing(false);
  };

  React.useEffect(() => {
    setEditValue(value?.toString() || "");
  }, [value]);

  return (
    <div className="mb-2">
      <Form.Label className="text-muted mb-1 fs-6">{label}</Form.Label>
      <div className="d-flex align-items-center gap-2">
        {isEditing ? (
          <>
            {type === "select" ? (
              <Form.Select
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="flex-grow-1"
              >
                {options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Form.Select>
            ) : (
              <Form.Control
                as={type === "textarea" ? "textarea" : "input"}
                type={type !== "textarea" ? type : undefined}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="flex-grow-1"
                {...(type === "textarea" ? { rows } : {})}
              />
            )}
            <button
              onClick={handleSave}
              className="p-1 rounded bg-black text-white"
            >
              <TbCheck size={18} />
            </button>
            <button
              onClick={handleCancel}
              className="p-1 rounded border-0"
            >
              <TbX size={18} />
            </button>
          </>
        ) : (
          <div className="d-flex align-items-center flex-grow-1 border rounded">
            <Form.Control
              readOnly
              plaintext
              value={displayValue}
              as={type === "textarea" ? "textarea" : "input"}
              className="flex-grow-1 px-2 input-field"
            />
            {editable && onEdit && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-muted bg-transparent border-0 p-1"
              >
                <TbPencil size={18} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const mpodStatusOptions = [
  { value: 0, label: "Pending" },
  { value: 1, label: "Started" },
  { value: 2, label: "Completed" },
  { value: 3, label: "Cancel" },
];

const mpoStatusOptions = [
  { value: 1, label: "New" },
  { value: 2, label: "Ongoing" },
  { value: 3, label: "Canceled" },
  { value: 4, label: "Completed" },
  { value: 5, label: "Processing" },
  { value: 6, label: "Assigned" },
];

// Safely build period duration string; fall back to "N/A" when parts are missing

// 🌀 Config-driven field groups
const getFieldGroups = (periodDuration: string) => ({
  orderInfo: [
    { label: "Order Category", name: "mpsc_name" },
    // {
    //   label: "Order ID",
    //   name: "manpower_order_id",
    //   type: "text",
    //   editable: false,
    // },
    // {
    //   label: "Status",
    //   name: "mpo_status",
    //   type: "select",
    //   options: mpoStatusOptions,
    //   editable: false,
    // },
    {
      label: "Created At",
      name: "mpo_created_at",
      type: "datetime-local",
      editable: false,
    },
  ],
  consumer: [
    { label: "Consumer Name", name: "consumer_name", editable: false },
    {
      label: "Consumer Mobile",
      name: "consumer_mobile_no",
      type: "tel",
      editable: false,
    },
    {
      label: "Consumer Wallet",
      name: "consumer_wallet_amount",
      type: "number",
      editable: false,
    },
    {
      label: "Consumer Registered Date",
      name: "consumer_registred_date",
      type: "date",
      editable: false,
    },
    { label: "OTP", name: "mpo_otp", type: "number", editable: false },
    {
      label: "Verify OTP",
      name: "mpod_verify_otp",
      type: "number",
      editable: false,
    },
  ],
  payment: [
    { label: "Transaction ID", name: "mpo_transection_id", editable: false },
    { label: "Bank Reference No", name: "mpo_bank_ref_no", editable: false },
    {
      label: "Transfer Amount",
      name: "mpo_transfer_amount",
      type: "number",
      editable: false,
    },
    {
      label: "Final Price",
      name: "mpo_final_price",
      type: "number",
      editable: true,
    },
    {
      label: "GST Percentage",
      name: "mpo_gst_percentage",
      type: "number",
      editable: true,
    },
    {
      label: "GST Amount",
      name: "mpo_gst_amount",
      type: "number",
      editable: true,
    },
    {
      label: "Health Card Charges",
      name: "mpo_health_card_charges",
      type: "number",
      editable: true,
    },
    {
      label: "Health Card Discount",
      name: "mpo_health_card_discount",
      type: "number",
      editable: true,
    },
    {
      label: "Coupon Discount",
      name: "mpo_coupon_discount",
      type: "number",
      editable: true,
    },
  ],
  // tax: [
  // ],
  vendor: [
    {
      label: "Vendor Name",
      name: "mpo_vendor_name",
      type: "text",
      editable: true,
    },
    {
      label: "Vendor Mobile",
      name: "mpo_vendor_mobile",
      type: "tel",
      editable: true,
    },
    {
      label: "Vendor Picture",
      name: "mpo_vender_picture",
      type: "text",
      editable: true,
    },
  ],
  orderDetails: [
    {
      label: "Product Quantity",
      name: "mpod_product_quantity",
      type: "number",
    },
    { label: "Price", name: "mpod_price", type: "number" },
    { label: "Tax", name: "mpod_tax", type: "number" },
    { label: "Offer Amount", name: "mpod_offer_amount", type: "number" },
    { label: "Company Charge", name: "mpod_company_charge", type: "number" },
    {
      label: "Period Duration",
      name: periodDuration,
      type: "text",
      editable: false,
    },
    { label: "Till Date", name: "mpod_till_date", type: "date" },
    {
      label: "Status (Detail)",
      name: "mpod_status",
      type: "select",
      options: mpodStatusOptions,
    },
    { label: "Assign Time", name: "mpod_assign_time", type: "datetime-local" },
    {
      label: "Instruction",
      name: "mpod_instruction",
      type: "textarea",
      rows: 3,
    },
  ],
});

const BookingDetailsForm: React.FC<BookingDetailsFormProps> = ({
  data,
  onUpdate,
  editable = true,
}) => {
  const handleFieldUpdate = (field: string, value: string) =>
    onUpdate?.(field, value);

  const formatDate = (value: string | number) => {
    if (!value && value !== 0) return "N/A";
    const valStr = value.toString();

    try {
      const date = /^\d+$/.test(valStr)
        ? new Date(parseInt(valStr) * 1000)
        : new Date(valStr);

      if (isNaN(date.getTime())) return valStr;

      // Use DateConversion component for consistent formatting
      return DateConversion(date.toISOString());
    } catch {
      return valStr;
    }
  };

  const periodDuration =
    [data?.mpod_period_duration, data?.mpod_period_type]
      .filter((v) => v !== null && v !== undefined && String(v).trim() !== "")
      .join(" ") || "N/A";

  const fieldGroups = getFieldGroups(periodDuration);

  return (
    <div>
      {/* Booking Header */}
      <Card className="mb-4 detailPage-header">
        <Card.Body className="py-3 d-flex flex-wrap align-items-center gap-3 justify-content-center">
          <div>
            <span className="h4 fw-semibold fs-4">Booking ID:</span>{" "}
            <strong className="fs-4 text-muted">
              {data?.manpower_order_id || "N/A"}
            </strong>
          </div>
          <div>
            <span className="h4 fs-4 fw-semibold">Order Date:</span>{" "}
            <strong className="fs-4 text-muted">
              {formatDate(data?.mpo_order_date)}
            </strong>
          </div>
          <div>
            <span className="h4 fs-4 fw-semibold">Status:</span>{" "}
            <strong className="fs-4">
              {(() => {
                const status = data?.mpo_status;
                const statusOption = mpoStatusOptions.find(
                  (opt) => opt.value.toString() === status?.toString()
                );
                const statusText = statusOption?.label || "Unknown";
                const statusClass =
                  status === 1 || status === "1"
                    ? "text-primary"
                    : status === 2 || status === "2"
                    ? "text-warning"
                    : status === 3 || status === "3"
                    ? "text-danger"
                    : status === 4 || status === "4"
                    ? "text-success"
                    : status === 5 || status === "5"
                    ? "text-info"
                    : status === 6 || status === "6"
                    ? "text-secondary"
                    : "text-muted";
                return <span className={statusClass}>{statusText}</span>;
              })()}
            </strong>
          </div>
        </Card.Body>
      </Card>

      {/* All Sections */}
      <Card className="mb-4">
        <Card.Body>
          <Section title="Consumer Information">
            <div className="">
              <Row>
                {fieldGroups.consumer.map((f) => (
                  <Col lg={2} md={4} key={f.name}>
                    <Field
                      label={f.label}
                      value={data?.[f.name]}
                      fieldName={f.name}
                      editable={editable && f.editable !== false}
                      onEdit={(value) => handleFieldUpdate(f.name, value)}
                    />
                  </Col>
                ))}
              </Row>
            </div>
          </Section>
        </Card.Body>
      </Card>

      <Card className="mb-4">
        <Card.Body>
          <Section title="Order Information">
            <div className="">
              <Row>
                {fieldGroups.orderInfo.map((f) => (
                  <Col className="col-12 col-sm-6 col-md-3" key={f.name}>
                    <Field
                      label={f.label}
                      value={data?.[f.name]}
                      fieldName={f.name}
                      editable={false}
                      onEdit={(value) => handleFieldUpdate(f.name, value)}
                    />
                  </Col>
                ))}
                <Col className="col-12 col-md-6">
                  <Field
                    label="Address"
                    value={data?.ua_address}
                    fieldName="ua_address"
                    editable={true}
                    onEdit={(value) => handleFieldUpdate("ua_address", value)}
                  />
                </Col>
              </Row>
            </div>
          </Section>
        </Card.Body>
      </Card>

      <Card className="mb-4">
        <Card.Body>
          <Section title="Payment Information">
            <div className="">
              <Row>
                {fieldGroups.payment.map((f) => (
                  <Col lg={2} md={4} key={f.name}>
                    <Field
                      label={f.label}
                      value={data?.[f.name]}
                      fieldName={f.name}
                      editable={editable && f.editable !== false}
                      onEdit={(value) => handleFieldUpdate(f.name, value)}
                    />
                  </Col>
                ))}
              </Row>
            </div>
          </Section>
        </Card.Body>
      </Card>

      <Card className="mb-4">
        <Card.Body>
          <Section title="Vendor Information">
            <div className="">
              <Row>
                {fieldGroups.vendor.map((f) => (
                  <Col lg={4} md={6} key={f.name}>
                    <Field
                      label={f.label}
                      value={data?.[f.name]}
                      fieldName={f.name}
                      editable={editable && f.editable !== false}
                      onEdit={(value) => handleFieldUpdate(f.name, value)}
                    />
                  </Col>
                ))}
              </Row>
            </div>
          </Section>
        </Card.Body>
      </Card>

      <Card className="mb-4">
        <Card.Body>
          <Section title="Order Details">
            <div className="">
              <Row>
                {fieldGroups.orderDetails.map((f) => (
                  <Col lg={2} md={4} key={f.name}>
                    <Field
                      label={f.label}
                      value={data?.[f.name]}
                      fieldName={f.name}
                      editable={editable && f.editable !== false}
                      onEdit={(value) => handleFieldUpdate(f.name, value)}
                    />
                  </Col>
                ))}
              </Row>
            </div>
          </Section>
        </Card.Body>
      </Card>

      <Card className="mb-4">
        <Card.Body>
          <Section title="">
            <Button variant="" className="me-2 mb-2 bg-light text-dark">
              Cancel
            </Button>
            <Button variant="secondary" className="me-2 mb-2">
              OTP Match
            </Button>
            <Button variant="success" className="me-2 mb-2">
              Complete
            </Button>
            <Button variant="info" className="me-2 mb-2">
              Assign
            </Button>
          </Section>
        </Card.Body>
      </Card>
    </div>
  );
};

export default BookingDetailsForm;
