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
    | "image"
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

  // Convert value to readable text
  const formatTextValue = (val: string | number | undefined): string => {
    if (val === null || val === undefined || val === "") return "N/A";
    const s = String(val);

    if (type === "select" && options.length > 0) {
      const opt = options.find((o) => String(o.value) === s);
      return opt ? opt.label : s;
    }

    if (type === "date" || type === "datetime-local") {
      try {
        const date = /^\d+$/.test(s) ? new Date(parseInt(s) * 1000) : new Date(s);
        if (isNaN(date.getTime())) return s;

        const pad = (n: number) => String(n).padStart(2, "0");

        if (type === "date") return date.toISOString().split("T")[0];

        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
          date.getDate()
        )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
      } catch {
        return s;
      }
    }
    return s;
  };

  const displayText = formatTextValue(value);

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

      {/* ✅ Show image ABOVE input (never inside the input) */}
      {type === "image" && value && (
        <div className="mb-2 w-100">
          <img
            src={String(value)}
            alt={label}
            style={{
              maxWidth: "100px",
              maxHeight: "100px",
            }}
            className="img-thumbnail"
          />
        </div>
      )}

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
                type={type === "image" ? "text" : type}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="flex-grow-1"
                {...(type === "textarea" ? { rows } : {})}
              />
            )}

            <button onClick={handleSave} className="p-1 rounded bg-black text-white">
              <TbCheck size={18} />
            </button>
            <button  onClick={handleCancel} className="p-1 rounded ">
              <TbX size={18} />
            </button>
          </>
        ) : (
          <div className="d-flex align-items-center flex-grow-1 border rounded p-0">
            <Form.Control
              readOnly
              plaintext
              value={displayText}
              as={type === "textarea" ? "textarea" : "input"}
              className="flex-grow-1 p-2"
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
  images: [
    { label: "Vendor Picture", name: "vendor_picture", type: "image" },
    {
      label: "Vendor Aadhar Front",
      name: "vendor_aadhar_front",
      type: "image",
    },
    { label: "Vendor Aadhar Back", name: "vendor_aadhar_back", type: "image" },
  ],
  main: [
    { label: "Vendor ID", name: "vendor_id", type: "number", editable: false },
    { label: "Vendor Name", name: "vendor_name" },
    { label: "Vendor Mobile", name: "vendor_mobile", type: "tel" },
    { label: "Vendor Email", name: "vendor_email", type: "email" },
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

  // console.log("VendorDetails data----:", data);

  return (
    <div>
      <Card className="mb-4 detailPage-header">
        <Card.Body className="py-3 d-flex flex-wrap align-items-center gap-3 justify-content-center">
          <div>
            <span className="h4 fw-semibold fs-4">Venodr ID:</span>{" "}
            <strong className="fs-4 text-muted">
              {data?.vendor_id || "N/A"}
            </strong>
          </div>
          <div className="h5 mb-0 fs-4 fw-semibold">
            {data?.vendor_name ?? "N/A"}
          </div>

          <div>
            <span className="h4 fs-4 fw-semibold">Registered:</span>{" "}
            <strong className="fs-4 text-muted">
              {formatDate(data?.vendor_created_at)}
            </strong>
          </div>
        </Card.Body>
      </Card>

      <Card className="mb-4">
        <Card.Body>
          <Section title="Vendor Images">
            {renderFields(vendorFieldGroups.images)}
          </Section>
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
