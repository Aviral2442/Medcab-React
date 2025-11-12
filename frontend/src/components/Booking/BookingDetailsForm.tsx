import React, { useState } from "react";
import { Card, Row, Col, Form, Button, Badge } from "react-bootstrap";
import { TbPencil, TbCheck, TbX } from "react-icons/tb";

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
    <h5 className={`text-${titleColor} mb-2 `}>{title}</h5>
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
        if (type === "date") return date.toISOString().split("T")[0];
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
    <div className="mb-3">
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
            <Button
              variant="success"
              size="sm"
              onClick={handleSave}
              className="p-1"
            >
              <TbCheck size={18} />
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleCancel}
              className="p-1"
            >
              <TbX size={18} />
            </Button>
          </>
        ) : (
          <div className="d-flex align-items-center flex-grow-1 border rounded">
            <Form.Control
              readOnly
              plaintext
              value={displayValue}
              as={type === "textarea" ? "textarea" : "input"}
              className="flex-grow-1 p-2 "
            />
            {editable && onEdit && (
              <Button
                variant="link"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="text-muted p-1"
              >
                <TbPencil size={18} />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Enum options
const paymentTypeOptions = [
  { value: "COD", label: "COD (Cash on Delivery)" },
  { value: "Online", label: "Online Payment" },
];

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

// 🌀 Config-driven field groups
const fieldGroups = {
  orderInfo: [
    {
      label: "Order ID",
      name: "manpower_order_id",
      type: "text",
      editable: false,
    },
    { label: "Order Date", name: "mpo_order_date", type: "date" },
    {
      label: "Status",
      name: "mpo_status",
      type: "select",
      options: mpoStatusOptions,
    },
    { label: "User ID", name: "mpo_user_id", type: "number" },
    { label: "Address ID", name: "mpo_address_id", type: "number" },
    {
      label: "Created At",
      name: "mpo_created_at",
      type: "datetime-local",
      editable: false,
    },
    {
      label: "Updated At",
      name: "mpo_updated_at",
      type: "datetime-local",
      editable: false,
    },
  ],
  payment: [
    { label: "Payment Mode", name: "mpo_payment_mode" },
    {
      label: "Payment Type",
      name: "mpo_payment_type",
      type: "select",
      options: paymentTypeOptions,
    },
    { label: "Payment Mobile", name: "mpo_payment_mobile", type: "tel" },
    { label: "Transaction ID", name: "mpo_transection_id" },
    { label: "Bank Reference No", name: "mpo_bank_ref_no" },
    { label: "Transfer Amount", name: "mpo_transfer_amount", type: "number" },
    { label: "Final Price", name: "mpo_final_price", type: "number" },
  ],
  tax: [
    { label: "GST Percentage", name: "mpo_gst_percentage", type: "number" },
    { label: "GST Amount", name: "mpo_gst_amount", type: "number" },
    {
      label: "Health Card Charges",
      name: "mpo_health_card_charges",
      type: "number",
    },
    {
      label: "Health Card Discount",
      name: "mpo_health_card_discount",
      type: "number",
    },
    { label: "Coupon Discount", name: "mpo_coupon_discount", type: "number" },
  ],
  vendor: [
    { label: "Vendor ID", name: "mpo_vendor_id", type: "number" },
    { label: "Vendor Name", name: "mpo_vendor_name" },
    { label: "Vendor Mobile", name: "mpo_vendor_mobile", type: "tel" },
    { label: "Vendor Picture", name: "mpo_vender_picture" },
  ],
  otp: [
    { label: "OTP", name: "mpo_otp" },
    { label: "Verify OTP", name: "mpod_verify_otp" },
  ],
  orderDetails: [
    { label: "Product ID", name: "mpod_product_id", type: "number" },
    {
      label: "Product Quantity",
      name: "mpod_product_quantity",
      type: "number",
    },
    { label: "Price", name: "mpod_price", type: "number" },
    { label: "Tax", name: "mpod_tax", type: "number" },
    { label: "Offer Amount", name: "mpod_offer_amount", type: "number" },
    { label: "Company Charge", name: "mpod_company_charge", type: "number" },
    { label: "Period Type", name: "mpod_period_type" },
    { label: "Period Duration", name: "mpod_period_duration", type: "number" },
    { label: "Till Date", name: "mpod_till_date", type: "date" },
    {
      label: "Status (Detail)",
      name: "mpod_status",
      type: "select",
      options: mpodStatusOptions,
    },
    { label: "Assign Time", name: "mpod_assign_time", type: "datetime-local" },
    { label: "Vendor ID (Detail)", name: "mpod_vendor_id", type: "number" },
    { label: "Vendor Name (Detail)", name: "mpod_vendor_name" },
    {
      label: "Vendor Number (Detail)",
      name: "mpod_vendor_number",
      type: "tel",
    },
    {
      label: "Instruction",
      name: "mpod_instruction",
      type: "textarea",
      rows: 3,
    },
  ],
};

const BookingDetailsForm: React.FC<BookingDetailsFormProps> = ({
  data,
  onUpdate,
  editable = true,
}) => {
  const handleFieldUpdate = (field: string, value: string) =>
    onUpdate?.(field, value);

  const getStatusBadge = (status: number) => {
    const map: Record<number, [string, string]> = {
      1: ["success", "New"],
      2: ["warning", "Ongoing"],
      3: ["danger", "Canceled"],
      4: ["secondary", "Completed"],
      5: ["info", "Processing"],
      6: ["primary", "Assigned"],
    };
    const [variant, text] = map[status] || ["secondary", "Unknown"];
    return <Badge bg={variant}>{text}</Badge>;
  };

  const getPaymentTypeBadge = (type: string) => {
    const map: Record<string, [string, string]> = {
      COD: ["success", "COD"],
      Online: ["info", "Online"],
    };
    const [variant, text] = map[type] || ["secondary", type || "N/A"];
    return <Badge bg={variant}>{text}</Badge>;
  };

  const formatDate = (value: string | number) => {
    if (!value && value !== 0) return "N/A";
    const valStr = value.toString();

    try {
      const date = /^\d+$/.test(valStr)
        ? new Date(parseInt(valStr) * 1000)
        : new Date(valStr);

      if (isNaN(date.getTime())) return valStr;

      const pad = (n: number) => String(n).padStart(2, "0");
      const month = pad(date.getMonth() + 1);
      const day = pad(date.getDate());
      const year = date.getFullYear();

      return `${month}/${day}/${year}`;
    } catch {
      return valStr;
    }
  };

  const renderFields = (fields: any[]) => (
    <Row>
      {fields.map(
        ({
          label,
          name,
          type = "text",
          editable: customEditable = true,
          rows,
          options,
        }: any) => (
          <Col md={3} key={name}>
            <Field
              label={label}
              value={data?.[name]}
              fieldName={name}
              type={type}
              rows={rows}
              options={options}
              editable={editable && customEditable}
              onEdit={(value) => handleFieldUpdate(name, value)}
            />
          </Col>
        )
      )}
    </Row>
  );

  return (
    <div>
      {/* Booking Header */}
      <Card className="mb-4 bg-light">
        <Card.Body className="py-3 d-flex flex-wrap align-items-center gap-3 justify-content-center">
          <div>
            <span className="h4 fw-semibold fs-3">Booking ID:</span>{" "}
            <strong className="fs-3 text-muted">
              {data?.manpower_order_id || "N/A"}
            </strong>
          </div>
          <div>
            <span className="h4 fs-3 fw-semibold">Order Date:</span>{" "}
            <strong className="fs-3 text-muted">
              {formatDate(data?.mpo_order_date)}
            </strong>
          </div>
        </Card.Body>
      </Card>

      {/* All Sections */}
      <Card className="mb-4">
        <Card.Body>
          <Section title="Order Information">
            {renderFields(fieldGroups.orderInfo)}
          </Section>
        </Card.Body>
      </Card>

      <Card className="mb-4">
        <Card.Body>
          <Section title="Payment Information">
            {renderFields(fieldGroups.payment)}
          </Section>
        </Card.Body>
      </Card>

      <Card className="mb-4">
        <Card.Body>
          <Section title="Tax & Charges">
            {renderFields(fieldGroups.tax)}
          </Section>
        </Card.Body>
      </Card>

      <Card className="mb-4">
        <Card.Body>
          <Section title="Vendor Information">
            {renderFields(fieldGroups.vendor)}
          </Section>
        </Card.Body>
      </Card>

      <Card className="mb-4">
        <Card.Body>
          <Section title="OTP Verification">
            {renderFields(fieldGroups.otp)}
          </Section>
        </Card.Body>
      </Card>

      <Card className="mb-4">
        <Card.Body>
          <Section title="Order Details">
            {renderFields(fieldGroups.orderDetails)}
          </Section>
        </Card.Body>
      </Card>
    </div>
  );
};

export default BookingDetailsForm;
