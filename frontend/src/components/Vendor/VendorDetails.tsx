import React, { useState } from "react";
import { Card, Row, Col, Form } from "react-bootstrap";
import { TbPencil, TbCheck, TbX, TbUpload } from "react-icons/tb";

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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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
        const date = /^\d+$/.test(s)
          ? new Date(parseInt(s) * 1000)
          : new Date(s);
        if (isNaN(date.getTime())) return s;

        const pad = (n: number) => String(n).padStart(2, "0");

        if (type === "date") return date.toISOString().split("T")[0];

        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
          date.getDate()
        )}`; //T${pad(date.getHours())}:${pad(date.getMinutes())}
      } catch {
        return s;
      }
    }
    return s;
  };

  const displayText = formatTextValue(value);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (type === "image" && selectedFile) {
      onEdit?.(previewUrl || editValue);
    } else {
      onEdit?.(editValue);
    }
    setIsEditing(false);
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleCancel = () => {
    setEditValue(value?.toString() || "");
    setIsEditing(false);
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  React.useEffect(() => {
    setEditValue(value?.toString() || "");
  }, [value]);

  return (
    <div className="mb-2">
      <Form.Label className="text-muted mb-1 fs-6">{label}</Form.Label>

      {type === "image" && (
        <div className="mb-2 w-100">
          <input
            type="file"
            id={`file-${label}`}
            accept="image/*"
            onChange={handleFileSelect}
            style={{ display: "none" }}
          />

          <img
            src={previewUrl || String(value)}
            alt={label}
            onClick={() => document.getElementById(`file-${label}`)?.click()}
            style={{
              maxWidth: "100px",
              maxHeight: "100px",
              objectFit: "cover",
              aspectRatio: "1/1",
              cursor: "pointer",
              borderRadius: "6px",
              border: "1px solid #ddd",
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
            ) : type === "image" ? (
              <div className="flex-grow-1">
                <label
                  htmlFor={`file-${label}`}
                  className="btn btn-outline-primary btn-sm d-flex align-items-center gap-2 mb-0"
                  style={{ cursor: "pointer" }}
                >
                  <TbUpload size={18} />
                  {/* {selectedFile ? selectedFile.name : "Choose Image"} */}
                </label>
              </div>
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
            <button onClick={handleCancel} className="p-1 rounded border-0">
              <TbX size={18} />
            </button>
          </>
        ) : (
          <>
            {type === "image" ? (
              /* For image type, only show upload button */
              editable &&
              onEdit && (
                <label
                  htmlFor={`file-${label}`}
                  className="btn btn-outline-primary btn-sm d-flex align-items-center gap-2 mb-0"
                  style={{ cursor: "pointer" }}
                >
                  <TbUpload size={18} />
                </label>
              )
            ) : (
              /* For other types, show the input field with value */
              <div className="d-flex align-items-center flex-grow-1 border rounded p-0">
                <Form.Control
                  readOnly
                  plaintext
                  value={displayText}
                  as={type === "textarea" ? "textarea" : "input"}
                  className="flex-grow-1 px-2 "
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
          </>
        )}
      </div>
    </div>
  );
};

// Add this interface for field definitions
interface FieldDef {
  label: string;
  name: string;
  type?: "text" | "number" | "tel" | "email" | "date" | "datetime-local" | "image" | "textarea" | "select";
  editable?: boolean;
  rows?: number;
  options?: { value: string | number; label: string }[];
}

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

const vendortypeOptions = [
  { value: "0", label: "Manpower Vendor" },
  { value: "1", label: "Manpower Partner Vendor" },
];

// Field configuration for vendor - expanded with your full list
const vendorFieldGroups: Record<string, FieldDef[]> = {
  images: [
    { label: "Picture", name: "vendor_picture", type: "image", editable: true },
    {
      label: "Aadhar Front",
      name: "vendor_aadhar_front",
      type: "image",
      editable: true,
    },
    { label: "Aadhar Back", name: "vendor_aadhar_back", type: "image", editable: true },
    { label: "Certificate", name: "vpd_certificate", type: "image", editable: true },
  ],
  main: [
    { label: "Name", name: "vendor_name", type: "text", editable: true },
    { label: "Mobile", name: "vendor_mobile", type: "tel", editable: true },
    { label: "Email", name: "vendor_email", type: "email", editable: true },
    {
      label: "Gender",
      name: "vendor_gender",
      type: "select",
      editable: true,
      options: genderOptions,
    },
    {
      label: "Status",
      name: "vendor_status",
      type: "select",
      editable: false,
      options: vendorStatusOptions,
    },
    { label: "Type", name: "vendor_type", type: "select", editable: false, options: vendortypeOptions },
    { label: "Rating", name: "vendor_rating", type: "number", editable: false },
    { label: "Wallet Amount", name: "vendor_wallet", type: "number", editable: false },
    {
      label: "Created At",
      name: "vendor_created_at",
      type: "datetime-local",
      editable: false,
    },
    {
      label: "Updated At",
      name: "vendor_updated_at",
      type: "datetime-local",
      editable: false,
    },
    {
      label: "Approved At",
      name: "vendor_approved_at",
      type: "datetime-local",
      editable: false,
    },
    { label: "DOB", name: "vendor_dob", type: "date", editable: true },
    { label: "City", name: "city_name", type: "text", editable: true },
    { label: "Category Name", name: "mp_cat_name", type: "text", editable: true },
    {
      label: "Prefer City Location",
      name: "work_location_city_name",
      type: "number",
      editable: true,
    },
    { label: "Manpower Partner", name: "partner_full_name", type: "text", editable: true },
  ],
  ids_and_refs: [
    { label: "Aadhar No", name: "vendor_aadhar_no", type: "text", editable: true },
    { label: "Pancard No", name: "vendor_pancard_no", type: "text", editable: true },
    { label: "Ref Code", name: "vendor_ref_code", type: "text", editable: true },
    { label: "Own Ref Code", name: "vendor_own_ref_code", type: "text", editable: true },
  ],
  status_and_tokens: [
    { label: "OTP Verification Status", name: "v_otp_verification_status", type: "number", editable: true },
    { label: "Duty Status", name: "vendor_duty_status", type: "number", editable: true },
    {
      label: "Last Booking Notified Time",
      name: "vendor_last_booking_notified_time",
      type: "datetime-local",
      editable: true,
    },
  ],
  account_details: [
    { label: "Holder Name", name: "vad_account_holder", type: "text", editable: true },
    { label: "Account Number", name: "vad_account_no", type: "text", editable: true },
    { label: "IFSC Code", name: "vad_ifsc", type: "text", editable: true },
    { label: "Created Date", name: "vad_created_at", type: "date", editable: false },
  ],
  professional_details: [
    { label: "Qualification", name: "vpd_qualification", type: "text", editable: true },
    { label: "License", name: "vpd_license", type: "text", editable: true },
    { label: "Created Date", name: "vpd_created_at", type: "date", editable: false }
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
            <div>
              <Row className="d-flex justify-content-center">
                {vendorFieldGroups.images.map((f) => (
                  <Col md={2} key={f.name}>
                    <Field
                      label={f.label}
                      value={data?.[f.name]}
                      fieldName={f.name}
                      type={f.type}
                      rows={f.rows}
                      options={f.options}
                      editable={!!(editable && f.editable !== false)}
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
            <div>
              <Row>
                {vendorFieldGroups.main.map((f) => (
                  <Col lg={2} md={4} key={f.name}>
                    <Field
                      label={f.label}
                      value={data?.[f.name]}
                      fieldName={f.name}
                      type={f.type}
                      rows={f.rows}
                      options={f.options}
                      editable={!!(editable && f.editable !== false)}
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
          <Section title="IDs & Documents">
            <div>
              <Row>
                {vendorFieldGroups.ids_and_refs.map((f) => (
                  <Col md={3} key={f.name}>
                    <Field
                      label={f.label}
                      value={data?.[f.name]}
                      fieldName={f.name}
                      type={f.type}
                      rows={f.rows}
                      options={f.options}
                      editable={!!(editable && f.editable !== false)}
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
          <Section title="Status & Tokens">
            <div>
              <Row>
                {vendorFieldGroups.status_and_tokens.map((f) => (
                  <Col lg={2} md={4} key={f.name}>
                    <Field
                      label={f.label}
                      value={data?.[f.name]}
                      fieldName={f.name}
                      type={f.type}
                      rows={f.rows}
                      options={f.options}
                      editable={!!(editable && f.editable !== false)}
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
          <Section title="Account Details">
            <div>
              <Row>
                {vendorFieldGroups.account_details.map((f) => (
                  <Col lg={3} md={6} key={f.name}>
                    <Field
                      label={f.label}
                      value={data?.[f.name]}
                      fieldName={f.name}
                      type={f.type}
                      rows={f.rows}
                      options={f.options}
                      editable={!!(editable && f.editable !== false)}
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
          <Section title="Professional Details">
            <div>
              <Row>
                {vendorFieldGroups.professional_details.map((f) => (
                  <Col lg={3} md={6} key={f.name}>
                    <Field
                      label={f.label}
                      value={data?.[f.name]}
                      fieldName={f.name}
                      type={f.type}
                      rows={f.rows}
                      options={f.options}
                      editable={!!(editable && f.editable !== false)}
                      onEdit={(value) => handleFieldUpdate(f.name, value)}
                    />  
                  </Col>
                ))}
              </Row>
            </div>
          </Section>
        </Card.Body>
      </Card>
    </div>
  );
};

export default VendorDetails;
