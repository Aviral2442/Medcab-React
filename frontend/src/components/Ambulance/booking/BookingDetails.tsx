import React, { useState } from "react";
import { Card, Row, Col, Form, Button } from "react-bootstrap";
import { TbPencil, TbCheck, TbX, TbEye } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import "@/global.css";
import DateConversion from "@/components/DateConversion";

interface AmbulanceBookingDetailsFormProps {
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
    <h6 className={`text-${titleColor} mb-2`}>{title}</h6>
    {children}
  </div>
);

interface FieldProps {
  label: string;
  value: string | number | boolean;
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
    | "select"
    | "boolean";
  rows?: number;
  options?: { value: string | number; label: string }[];
  showViewIcon?: boolean;
  consumerId?: number;
}

const Field: React.FC<FieldProps> = ({
  label,
  value,
  editable = true,
  onEdit,
  type = "text",
  rows = 3,
  options = [],
  showViewIcon = false,
  consumerId,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value?.toString() || "");
  const navigate = useNavigate();

  const formatDisplayValue = (val: string | number | boolean) => {
    if (val === null || val === undefined) return "N/A";

    if (type === "boolean") {
      return val ? "Yes" : "No";
    }

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
        if (type === "date") {
          return DateConversion(date.toISOString());
        }
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
                type={type !== "textarea" && type !== "boolean" ? type : undefined}
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
          <div className="d-flex align-items-center flex-grow-1 border rounded">
            <Form.Control
              readOnly
              plaintext
              value={displayValue}
              as={type === "textarea" ? "textarea" : "input"}
              className="flex-grow-1 px-2 input-field"
            />
            {showViewIcon && consumerId && (
              <button
                onClick={() => navigate(`/consumer-details/${consumerId}`)}
                className="text-primary bg-transparent border-0 p-1"
                title="View Consumer Details"
              >
                <TbEye size={18} />
              </button>
            )}
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

const bookingStatusOptions = [
  { value: 0, label: "Pending" },
  { value: 1, label: "Accepted" },
  { value: 2, label: "On the Way" },
  { value: 3, label: "Arrived" },
  { value: 4, label: "Started" },
  { value: 5, label: "Completed" },
  { value: 6, label: "Cancelled" },
];

const bookingTypeOptions = [
  { value: 0, label: "Regular" },
  { value: 1, label: "Rental" },
  { value: 2, label: "Bulk" },
];

const paymentStatusOptions = [
  { value: 0, label: "Pending" },
  { value: 1, label: "Paid" },
  { value: 2, label: "Failed" },
  { value: 3, label: "Refunded" },
];

const AmbulanceBookingDetailsForm: React.FC<AmbulanceBookingDetailsFormProps> = ({
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
      return DateConversion(date.toISOString());
    } catch {
      return valStr;
    }
  };

  const isBulkBooking = () => data?.booking_type === 2 || data?.booking_type === "2";
  const isRentalBooking = () => data?.booking_type === 1 || data?.booking_type === "1";

  const sections = [
    {
      title: "Consumer Information",
      fields: [
        { label: "Consumer Name", name: "booking_con_name", editable: false, cols: 4, showViewIcon: true },
        { label: "Consumer Mobile", name: "booking_con_mobile", type: "tel" as const, editable: false, cols: 4 },
        { label: "Consumer ID", name: "booking_by_cid", editable: false, cols: 4 },
      ],
    },
    {
      title: "Booking Information",
      fields: [
        { label: "Booking Type", name: "booking_type", type: "select" as const, options: bookingTypeOptions, editable: false, cols: 2 },
        { label: "Booking Source", name: "booking_source", editable: false, cols: 2 },
        { label: "Generate Source", name: "booking_generate_source", editable: false, cols: 2 },
        { label: "Category", name: "booking_view_category_name", editable: false, cols: 2 },
        { label: "Schedule Time", name: "booking_schedule_time", type: "datetime-local" as const, editable: false, cols: 2 },
        { label: "Created At", name: "created_at", type: "datetime-local" as const, editable: false, cols: 2 },
      ],
    },
    {
      title: "Location Information",
      fields: [
        { label: "Pickup Location", name: "booking_pickup", type: "textarea" as const, rows: 2, cols: 6 },
        { label: "Pickup City", name: "booking_pickup_city", cols: 3 },
        { label: "Pickup Latitude", name: "booking_pick_lat", type: "number" as const, editable: false, cols: 3 },
        { label: "Pickup Longitude", name: "booking_pick_long", type: "number" as const, editable: false, cols: 3 },
        { label: "Drop Location", name: "booking_drop", type: "textarea" as const, rows: 2, cols: 6 },
        { label: "Drop City", name: "booking_drop_city", cols: 3 },
        { label: "Drop Latitude", name: "booking_drop_lat", type: "number" as const, editable: false, cols: 3 },
        { label: "Drop Longitude", name: "booking_drop_long", type: "number" as const, editable: false, cols: 3 },
        { label: "Distance (KM)", name: "booking_distance", cols: 3 },
        { label: "Duration", name: "booking_duration", cols: 3 },
        { label: "Duration (Sec)", name: "booking_duration_in_sec", editable: false, cols: 3 },
        { label: "Radius", name: "booking_radius", cols: 3 },
      ],
    },
    {
      title: "Payment Information",
      fields: [
        { label: "Total Amount", name: "booking_total_amount", type: "number" as const, editable: false, cols: 3 },
        { label: "Booking Amount", name: "booking_amount", type: "number" as const, editable: false, cols: 3 },
        { label: "Advance Amount", name: "booking_adv_amount", type: "number" as const, cols: 3 },
        { label: "Payment Method", name: "booking_payment_method", editable: false, cols: 3 },
        { label: "Payment Type", name: "booking_payment_type", editable: false, cols: 3 },
        { label: "Payment Status", name: "booking_payment_status", type: "select" as const, options: paymentStatusOptions, cols: 3 },
      ],
    },
    {
      title: "Vehicle & Driver Information",
      fields: [
        { label: "Vehicle ID", name: "booking_acpt_vehicle_id", editable: false, cols: 4 },
        { label: "Driver ID", name: "booking_acpt_driver_id", editable: false, cols: 4 },
        { label: "Accept Time", name: "booking_acpt_time", type: "datetime-local" as const, editable: false, cols: 4 },
        { label: "Arrival to Pickup Duration (Sec)", name: "booking_a_t_p_duration_in_sec", editable: false, cols: 4 },
        { label: "Arrival to Pickup Distance", name: "booking_ap_distance", editable: false, cols: 4 },
        { label: "Arrival to Pickup Duration", name: "booking_ap_duration", editable: false, cols: 4 },
      ],
    },
    {
      title: "Rate Information",
      fields: [
        { label: "Base Rate", name: "booking_view_base_rate", type: "number" as const, editable: false, cols: 2 },
        { label: "Per KM Rate", name: "booking_view_per_km_rate", type: "number" as const, editable: false, cols: 2 },
        { label: "KM Rate", name: "booking_view_km_rate", type: "number" as const, editable: false, cols: 2 },
        { label: "KM Till", name: "booking_view_km_till", editable: false, cols: 2 },
        { label: "Per Extra KM Rate", name: "booking_view_per_ext_km_rate", type: "number" as const, editable: false, cols: 2 },
        { label: "Per Extra Min Rate", name: "booking_view_per_ext_min_rate", type: "number" as const, editable: false, cols: 2 },
        { label: "Service Charge", name: "booking_view_service_charge_rate", type: "number" as const, editable: false, cols: 2 },
        { label: "Service Charge Discount", name: "booking_view_service_charge_rate_discount", type: "number" as const, editable: false, cols: 2 },
        { label: "Total Fare", name: "booking_view_total_fare", type: "number" as const, editable: false, cols: 2 },
      ],
    },
    {
      title: "OTP & Verification",
      fields: [
        { label: "OTP", name: "booking_view_otp", editable: false, cols: 3 },
        { label: "OTP Status", name: "booking_view_status_otp", type: "boolean" as const, editable: false, cols: 3 },
        { label: "Rating Status", name: "booking_view_rating_status", type: "boolean" as const, editable: false, cols: 3 },
        { label: "Consumer to Driver Rating Status", name: "booking_view_rating_c_to_d_status", type: "boolean" as const, editable: false, cols: 3 },
      ],
    },
    {
      title: "Bulk Booking Information",
      show: isBulkBooking(),
      fields: [
        { label: "Bulk Master Key", name: "booking_bulk_master_key", editable: false, cols: 4 },
        { label: "No. of Bulk", name: "booking_no_of_bulk", editable: false, cols: 4 },
        { label: "Bulk Total", name: "booking_bulk_total", type: "number" as const, editable: false, cols: 4 },
      ],
    },
    {
      title: "Rental Booking Information",
      show: isRentalBooking(),
      fields: [
        { label: "Rental Type", name: "booking_type_for_rental", editable: false, cols: 6 },
      ],
    },
    {
      title: "Additional Information",
      fields: [
        { label: "Arrival Time", name: "booking_view_arrival_time", type: "datetime-local" as const, editable: false, cols: 4 },
        { label: "Pickup Time", name: "booking_view_pickup_time", type: "datetime-local" as const, editable: false, cols: 4 },
        { label: "Dropped Time", name: "booking_view_dropped_time", type: "datetime-local" as const, editable: false, cols: 4 },
        { label: "Shoot Time", name: "bv_shoot_time", type: "datetime-local" as const, editable: false, cols: 4 },
        { label: "Virtual Number", name: "bv_virtual_number", type: "tel" as const, editable: false, cols: 4 },
        { label: "Virtual Number Status", name: "bv_virtual_number_status", type: "boolean" as const, editable: false, cols: 4 },
        { label: "Cloud Consumer CRID", name: "bv_cloud_con_crid", editable: false, cols: 4 },
        { label: "Cloud Consumer CRID (C to D)", name: "bv_cloud_con_crid_c_to_d", editable: false, cols: 4 },
        { label: "Category Icon", name: "booking_view_category_icon", editable: false, cols: 4 },
        { label: "Includes", name: "booking_view_includes", type: "textarea" as const, rows: 3, cols: 6 },
      ],
    },
  ];

  return (
    <div>
      <Card className="mb-4 detailPage-header">
        <Card.Body className="py-3 d-flex flex-wrap align-items-center gap-3 justify-content-center">
          <div>
            <span className="h4 fw-semibold fs-4">Booking ID:</span>{" "}
            <strong className="fs-4 text-muted">
              {data?.booking_id || "N/A"}
            </strong>
          </div>
          <div>
            <span className="h4 fs-4 fw-semibold">Schedule Date:</span>{" "}
            <strong className="fs-4 text-muted">
              {formatDate(data?.booking_schedule_time)}
            </strong>
          </div>
          <div>
            <span className="h4 fs-4 fw-semibold">Status:</span>{" "}
            <strong className="fs-4">
              {(() => {
                const status = data?.booking_status;
                const statusOption = bookingStatusOptions.find(
                  (opt) => opt.value.toString() === status?.toString()
                );
                const statusText = statusOption?.label || "Unknown";
                const statusClass =
                  status === 0 || status === "0"
                    ? "text-warning"
                    : status === 1 || status === "1"
                    ? "text-info"
                    : status === 2 || status === "2"
                    ? "text-primary"
                    : status === 3 || status === "3"
                    ? "text-secondary"
                    : status === 4 || status === "4"
                    ? "text-info"
                    : status === 5 || status === "5"
                    ? "text-success"
                    : status === 6 || status === "6"
                    ? "text-danger"
                    : "text-muted";
                return <span className={statusClass}>{statusText}</span>;
              })()}
            </strong>
          </div>
        </Card.Body>
      </Card>

      {sections.map((section, idx) => {
        if (section.show === false) return null;

        return (
          <Card className="mb-4" key={idx}>
            <Card.Body>
              <Section title={section.title}>
                <Row>
                  {section.fields.map((f) => (
                    <Col lg={f.cols || 4} md={6} key={f.name}>
                      <Field
                        label={f.label}
                        value={data?.[f.name]}
                        fieldName={f.name}
                        editable={editable && f.editable !== false}
                        onEdit={(value) => handleFieldUpdate(f.name, value)}
                        type={f.type}
                        rows={f.rows}
                        options={f.options}
                        showViewIcon={f.showViewIcon}
                        consumerId={f.showViewIcon ? data?.booking_by_cid : undefined}
                      />
                    </Col>
                  ))}
                </Row>
              </Section>
            </Card.Body>
          </Card>
        );
      })}

      <Card className="mb-4">
        <Card.Body>
          <Section title="">
            <Button variant="" className="me-2 mb-2 bg-light text-dark">
              Cancel Booking
            </Button>
            <Button variant="secondary" className="me-2 mb-2">
              Verify OTP
            </Button>
            <Button variant="success" className="me-2 mb-2">
              Complete Booking
            </Button>
            <Button variant="info" className="me-2 mb-2">
              Assign Driver
            </Button>
          </Section>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AmbulanceBookingDetailsForm;