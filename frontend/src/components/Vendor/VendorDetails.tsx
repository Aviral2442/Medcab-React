import React, { useState } from "react";
import { Card, Row, Col, Form, Button } from "react-bootstrap";
import { TbPencil, TbCheck, TbX } from "react-icons/tb";

interface VendorDetailsProps {
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
  <div className="mb-0 pb-0">
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
    if (val === null || val === undefined || val === "") return "N/A";
    const valStr = val.toString();

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
                  <option key={String(opt.value)} value={opt.value}>
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

// Standard option maps
const genderOptions = [
  { value: "1", label: "Male" },
  { value: "2", label: "Female" },
];

const vendorStatusOptions = [
  { value: "0", label: "Inactive" },
  { value: "1", label: "Active" },
  { value: "2", label: "New" },
  { value: "3", label: "Pending Approval" },
  { value: "4", label: "Assigned" },
  { value: "5", label: "Free" },
  { value: "6", label: "On Duty" },
  { value: "7", label: "Off Duty" },
];

// Field configuration for vendor - expanded with your full list
const vendorFieldGroups = {
  main: [
    { label: "Vendor ID", name: "vendor_id", type: "number", editable: false },
    { label: "Vendor Name", name: "vendor_name" },
    { label: "Vendor Mobile", name: "vendor_mobile", type: "tel" },
    { label: "Vendor Email", name: "vendor_email", type: "email" },
    { label: "Vendor Picture", name: "vendor_picture" },
    {
      label: "Vendor Status",
      name: "vendor_status",
      type: "select",
      options: vendorStatusOptions,
    },
    { label: "Vendor Type", name: "vendor_type" },
    { label: "Vendor Rating", name: "vendor_rating", type: "number" },
    { label: "Vendor Wallet", name: "vendor_wallet", type: "number" },
    {
      label: "Vendor Created At",
      name: "vendor_created_at",
      type: "datetime-local",
      editable: false,
    },
    {
      label: "Vendor Updated At",
      name: "vendor_updated_at",
      type: "datetime-local",
      editable: false,
    },
    {
      label: "Vendor Approved At",
      name: "vendor_approved_at",
      type: "datetime-local",
    },
    { label: "Vendor DOB", name: "vendor_dob", type: "date" },
  ],
  ids_and_refs: [
    { label: "Vendor Aadhar No", name: "vendor_aadhar_no" },
    { label: "Vendor Aadhar Front", name: "vendor_aadhar_front" },
    { label: "Vendor Aadhar Back", name: "vendor_aadhar_back" },
    { label: "Pancard No", name: "vendor_pancard_no" },
    { label: "Vendor Ref Code", name: "vendor_ref_code" },
    { label: "Vendor Own Ref Code", name: "vendor_own_ref_code" },
  ],
  relations_and_meta: [
    { label: "City", name: "city_name" },
    { label: "Category Name", name: "mp_cat_name" },
    {
      label: "Vendor Category Details ID",
      name: "vendor_category_details_id",
      type: "number",
    },
    {
      label: "Vendor Account Details ID",
      name: "vendor_account_details_id",
      type: "number",
    },
    {
      label: "Vendor Address Details ID",
      name: "vendor_address_details_id",
      type: "number",
    },
    {
      label: "Vendor Professional Details ID",
      name: "vendor_professional_details_id",
      type: "number",
    },
    {
      label: "Prefer Location ID",
      name: "vendor_prefer_location_id",
      type: "number",
    },
    { label: "MP Partner ID", name: "vendor_mp_partner_id", type: "number" },
  ],
  status_and_tokens: [
    { label: "OTP Verification Status", name: "v_otp_verification_status" },
    { label: "Duty Status", name: "vendor_duty_status" },
    {
      label: "Last Booking Notified Time",
      name: "vendor_last_booking_notified_time",
      type: "datetime-local",
    },
    { label: "FCM Token", name: "vendor_fcm_token" },
    { label: "Auth Key", name: "vendor_auth_key" },
    { label: "Wallet", name: "vendor_wallet", type: "number" },
  ],
  gender_and_misc: [
    {
      label: "Gender",
      name: "vendor_gender",
      type: "select",
      options: genderOptions,
    },
    {
      label: "A/c Details ID",
      name: "vendor_account_details_id",
      type: "number",
    },
    {
      label: "Professional Details ID",
      name: "vendor_professional_details_id",
      type: "number",
    },
  ],
};

const VendorDetails: React.FC<VendorDetailsProps> = ({
  data,
  onUpdate,
  editable = true,
}) => {
  const handleFieldUpdate = (field: string, value: string) =>
    onUpdate?.(field, value);

  // const getStatusBadge = (status: any) => {
  //   const s = String(status ?? "unknown");
  //   const map: Record<string, [string, string]> = {
  //     "0": ["secondary", "Inactive"],
  //     "1": ["success", "Active"],
  //     "2": ["info", "New"],
  //     "3": ["warning", "Pending Approval"],
  //     "4": ["primary", "Assigned"],
  //     "5": ["success", "Free"],
  //     "6": ["primary", "On Duty"],
  //     "7": ["secondary", "Off Duty"],
  //   };
  //   const [variant, text] = map[s] || ["secondary", s];
  //   return <Badge bg={variant}>{text}</Badge>;
  // };

  const formatDate = (value: string | number) => {
    if (value === null || value === undefined || value === "") return "N/A";
    const valStr = String(value);
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
          <Col md={4} key={name}>
            <Field
              label={label}
              value={data?.[name]}
              fieldName={name}
              type={type}
              rows={rows}
              options={options}
              editable={!!(editable && customEditable)}
              onEdit={(value) => handleFieldUpdate(name, value)}
            />
          </Col>
        )
      )}
    </Row>
  );

  return (
    <div>
      <Card className="mb-4 bg-light">
        <Card.Body className="py-3 d-flex flex-wrap align-items-center gap-3 justify-content-center">
          <div>
            <span className="h4 fw-semibold fs-3">Vendor:</span>{" "}
            <strong className="fs-3 text-muted">
              {data?.vendor_name ?? "N/A"}
            </strong>
          </div>
          <div>
            <span className="h4 fs-3 fw-semibold">Created:</span>{" "}
            <strong className="fs-3 text-muted">
              {formatDate(data?.vendor_created_at)}
            </strong>
          </div>
        </Card.Body>
      </Card>

      <Card className="mb-4">
        <Card.Body>
          <Section title="Vendor Information">
            {renderFields(vendorFieldGroups.main)}
          </Section>
        </Card.Body>
      </Card>

      <Card className="mb-4">
        <Card.Body>
          <Section title="IDs & Documents">
            {renderFields(vendorFieldGroups.ids_and_refs)}
          </Section>
        </Card.Body>
      </Card>

      <Card className="mb-4">
        <Card.Body>
          <Section title="Relations & Meta">
            {renderFields(vendorFieldGroups.relations_and_meta)}
          </Section>
        </Card.Body>
      </Card>

      <Card className="mb-4">
        <Card.Body>
          <Section title="Status & Tokens">
            {renderFields(vendorFieldGroups.status_and_tokens)}
          </Section>
        </Card.Body>
      </Card>

      <Card className="mb-4">
        <Card.Body>
          <Section title="Gender & Misc">
            {renderFields(vendorFieldGroups.gender_and_misc)}
          </Section>
        </Card.Body>
      </Card>
    </div>
  );
};

export default VendorDetails;
