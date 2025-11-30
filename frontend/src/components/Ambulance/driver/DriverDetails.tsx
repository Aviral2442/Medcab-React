import React from "react";
import { Card, Row, Col, Image, Spinner, Alert, Button} from "react-bootstrap";
import DateConversion from "../../DateConversion";
import "@/global.css";

type DriverDetail = {
  driver_id?: number;
  driver_name?: string;
  driver_last_name?: string;
  driver_mobile?: string;
  driver_wallet_amount?: number;
  driver_assigned_vehicle_id?: number | null;
  v_vehicle_name?: string | null;
  vehicle_rc_number?: string | null;
  vehicle_category_type?: string | null;
  driver_dob?: number | string | null;
  driver_gender?: string | null;
  city_name?: string | null;
  driver_created_by?: number | string | null;
  driver_created_partner_id?: number | string | null;
  partner_f_name?: string | null;
  partner_l_name?: string | null;
  partner_mobile?: string | null;
  driver_profile_img?: string | null;
  driver_registration_step?: number | string | null;
  driver_otp_verification?: number | string | null;
  driver_duty_status?: string | null;
  driver_status?: number | string | null;
  driver_on_booking_status?: number | string | null;
  driver_total_ride_till_today?: number | string | null;
  driver_rating?: number | string | null;
  driver_last_booking_notified_time?: number | string | null;
  driver_verify_date?: number | string | null;
  driver_verify_by?: string | null;
  join_bonus_status?: number | string | null;
  join_bonus_time?: number | string | null;
  driver_details_aadhar_front_img?: string | null;
  driver_details_aadhar_back_img?: string | null;
  driver_details_dl_front_img?: string | null;
  driver_details_dl_back_image?: string | null;
  driver_details_pan_card_front_img?: string | null;
  driver_details_police_verification_image?: string | null;
  driver_details_aadhar_number?: string | null;
  driver_details_dl_number?: string | null;
  driver_details_dl_exp_date?: number | string | null;
  driver_details_pan_card_number?: string | null;
  driver_details_police_verification_date?: number | string | null;
};

const basePath = (import.meta as any).env?.base_Path ?? "";

type FieldConfig = {
  name: keyof DriverDetail;
  label: string;
  type?: "text" | "date" | "datetime" | "currency" | "image";
};

const formatValue = (val: any, type?: FieldConfig["type"]) => {
  if (val === undefined || val === null || val === "") return "N/A";

  if (type === "date" || type === "datetime") {
    try {
      const date = /^\d+$/.test(String(val))
        ? new Date(parseInt(String(val)) * 1000)
        : new Date(val);
      if (isNaN(date.getTime())) return String(val);
      return DateConversion(date.toISOString());
    } catch {
      return String(val);
    }
  }

  if (type === "currency") {
    return `₹${Number(val || 0)}`;
  }

  return String(val);
};

const Field: React.FC<{
  label: string;
  value?: any;
  type?: FieldConfig["type"];
}> = ({ label, value, type = "text" }) => {
  return (
    <div className="mb-2">
      <div className="text-muted mb-1 fs-6">{label}</div>
      <div className="border rounded px-2 py-1 bg-white">
        {formatValue(value, type)}
      </div>
    </div>
  );
};

const Section: React.FC<{
  title: string;
  children: React.ReactNode;
  titleColor?: string;
}> = ({ title, children, titleColor = "primary" }) => (
  <div>
    <h6 className={`text-${titleColor} mb-3`}>{title}</h6>
    {children}
  </div>
);

const getFieldGroups = (): Record<
  string,
  { title: string; fields: FieldConfig[]; cols?: number }
> => {
  return {
    basicInfo: {
      title: "Basic Information",
      cols: 3,
      fields: [
        { name: "driver_name", label: "First Name" },
        { name: "driver_last_name", label: "Last Name" },
        { name: "driver_mobile", label: "Mobile" },
        { name: "driver_wallet_amount", label: "Wallet", type: "currency" },
        { name: "driver_dob", label: "Date of Birth", type: "date" },
        { name: "driver_gender", label: "Gender" },
        { name: "city_name", label: "City Name" },
      ],
    },
    partnerInfo: {
      title: "Partner Information",
      cols: 3,
      fields: [
        { name: "driver_created_by", label: "Created By" },
        { name: "driver_created_partner_id", label: "Partner ID" },
        { name: "partner_f_name", label: "Partner First Name" },
        { name: "partner_l_name", label: "Partner Last Name" },
        { name: "partner_mobile", label: "Partner Mobile" },
      ],
    },
    statusAndRegistration: {
      title: "Registration & Status",
      cols: 3,
      fields: [
        { name: "driver_registration_step", label: "Registration Step" },
        { name: "driver_otp_verification", label: "OTP Verification" },
        { name: "driver_duty_status", label: "Duty Status" },
        { name: "driver_status", label: "Status" },
        { name: "driver_on_booking_status", label: "On Booking Status" },
      ],
    },
    stats: {
      title: "Statistics / Verification",
      cols: 3,
      fields: [
        { name: "driver_total_ride_till_today", label: "Total Rides" },
        { name: "driver_rating", label: "Rating" },
        {
          name: "driver_last_booking_notified_time",
          label: "Last Booking Notified Time",
          type: "datetime",
        },
        { name: "driver_verify_date", label: "Verify Date", type: "date" },
        { name: "driver_verify_by", label: "Verify By" },
        { name: "join_bonus_status", label: "Join Bonus Status" },
        { name: "join_bonus_time", label: "Join Bonus Time", type: "datetime" },
      ],
    },
    Documents: {
      title: "Documents & Images",
      cols: 3,
      fields: [
        { name: "driver_profile_img", label: "Profile Image", type: "image" },
        {
          name: "driver_details_aadhar_front_img",
          label: "Aadhar Front Image",
          type: "image",
        },
        { name: "driver_details_aadhar_back_img", label: "Aadhar Back Image", type: "image" },
        { name: "driver_details_dl_front_img", label: "DL Front Image" , type: "image" },
        { name: "driver_details_dl_back_image", label: "DL Back Image" , type: "image" },
        {
          name: "driver_details_pan_card_front_img",
          label: "PAN Card Front Image",
          type: "image"
        },
        {
          name: "driver_details_police_verification_image",
          label: "Police Verification Image",
          type: "image"
        },
        { name: "driver_details_aadhar_number", label: "Aadhar Number" },
        { name: "driver_details_dl_number", label: "DL Number" },
        {
          name: "driver_details_dl_exp_date",
          label: "DL Expiry Date",
          type: "date",
        },
        { name: "driver_details_pan_card_number", label: "PAN Card Number" },
        {
          name: "driver_details_police_verification_date",
          label: "Police Verification Date",
          type: "date",
        },
      ],
    },
  };
};

type Props = {
  data?: DriverDetail | null;
  loading?: boolean;
  error?: string | null;
};

const DriverDetails: React.FC<Props> = ({ data, loading = false, error = null }) => {
  if (loading) {
    return (
      <div className="d-flex justify-content-center p-4">
        <Spinner animation="border" role="status" />
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (!data) {
    return <Alert variant="warning">No driver data available</Alert>;
  }

  const fieldGroups = getFieldGroups();

  return (
    <div>
      {/* Driver */}
      <Card className="mb-4 mt-2">
        <Card.Body>
          <Row className="g-3">
            <Col lg={3} md={4}>
              <div className="text-muted mb-1 fs-6">Profile Image</div>
              {data.driver_profile_img ? (
                <Image
                  src={`${basePath}/${data.driver_profile_img}`}
                  alt="Profile"
                  thumbnail
                  style={{ maxWidth: 240, maxHeight: 240 }}
                />
              ) : (
                <div
                  className="border rounded d-flex align-items-center justify-content-center"
                  style={{ height: 240 }}
                >
                  <div className="text-muted">No Image</div>
                </div>
              )}
            </Col>

            <Col lg={9} md={8}>
              <Row>
                {fieldGroups.basicInfo.fields.map((f) => (
                  <Col lg={4} md={6} key={String(f.name)}>
                    <Field label={f.label} value={data[f.name]} type={f.type} />
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Partner Info */}
      <Card className="mb-4">
        <Card.Body>
          <Section title={fieldGroups.partnerInfo.title}>
            <Row>
              {fieldGroups.partnerInfo.fields.map((f) => (
                <Col lg={2} md={6} key={String(f.name)}>
                  <Field label={f.label} value={data[f.name]} type={f.type} />
                </Col>
              ))}
            </Row>
          </Section>
        </Card.Body>
      </Card>

      {/* Status & Registration */}
      <Card className="mb-4">
        <Card.Body>
          <Section title={fieldGroups.statusAndRegistration.title}>
            <Row>
              {fieldGroups.statusAndRegistration.fields.map((f) => (
                <Col lg={2} md={6} key={String(f.name)}>
                  <Field label={f.label} value={data[f.name]} type={f.type} />
                </Col>
              ))}
            </Row>
          </Section>
        </Card.Body>
      </Card>

      {/* Stats / Verification */}
      <Card className="mb-4">
        <Card.Body>
          <Section title={fieldGroups.stats.title}>
            <div>
              <Row>
                {fieldGroups.stats.fields.map((f) => (
                  <Col lg={2} md={6} key={String(f.name)}>
                    <Field label={f.label} value={data[f.name]} type={f.type} />
                  </Col>
                ))}
              </Row>
            </div>
          </Section>
        </Card.Body>
      </Card>

      {/* Documents & Images */}
      <Card className="mb-4">
        <Card.Body>
          <Section title={fieldGroups.Documents.title}>
            <div>
              <Row>
                {fieldGroups.Documents.fields.map((f) => (
                  <Col lg={3} md={6} key={String(f.name)}>
                    {f.type === "image" ? (
                      <div className="mb-3">
                        <div className="text-muted mb-1 fs-6">{f.label}</div>
                        {data[f.name] ? (
                          <Image
                            src={`${basePath}/${data[f.name]}`}
                            alt={f.label}
                            thumbnail
                            style={{ maxWidth: "100%", maxHeight: 200 }}
                          />
                        ) : (
                          <div
                            className="border rounded d-flex align-items-center justify-content-center"
                            style={{ height: 200 }}
                          >
                            <div className="text-muted">No Image</div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <Field label={f.label} value={data[f.name]} type={f.type} />
                    )}
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

export default DriverDetails;
