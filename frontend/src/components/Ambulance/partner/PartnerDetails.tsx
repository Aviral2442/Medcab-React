import React from "react";
import { Card, Row, Col, Image, Alert } from "react-bootstrap";
import DateConversion from "../../DateConversion";
import "@/global.css";

type PartnerDetail = {
  partner_id?: number;
  partner_f_name?: string;
  partner_l_name?: string;
  partner_mobile?: string;
  partner_wallet?: number;
  partner_pending_wallet_to_comp?: number;
  partner_dob?: number | string | null;
  partner_gender?: string | null;
  partner_city_id?: number | string | null;
  partner_created_by?: number | string | null;
  partner_profile_img?: string | null;
  partner_aadhar_front?: string | null;
  partner_aadhar_back?: string | null;
  partner_aadhar_no?: string | null;
  partner_registration_step?: number | string | null;
  partner_auth_key?: string | null;
  partner_referral?: string | null;
  referral_referral_by?: string | null;
  created_at?: string | number | null;
  updated_at?: string | number | null;
  partner_status?: number | string | null;
  partner_acc_dtl_id?: number | string | null;
  partner_acc_dtl_p_id?: number | string | null;
  partner_acc_dtl_acc_no?: string | null;
  partner_acc_dtl_ifsc?: string | null;
  partner_acc_dtl_acc_holder?: string | null;
  partner_acc_dtl_added_date?: string | number | null;
  partner_acc_dtl_status?: number | string | null;
};

const basePath = (import.meta as any).env?.base_Path ?? "";

type FieldConfig = {
  name: keyof PartnerDetail;
  label: string;
  type?: "text" | "date" | "datetime" | "currency";
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

const Field: React.FC<{ label: string; value?: any; type?: FieldConfig["type"] }> = ({
  label,
  value,
  type = "text",
}) => (
  <div className="mb-2">
    <div className="text-muted mb-1 fs-6">{label}</div>
    <div className="border rounded px-2 py-1 bg-white">{formatValue(value, type)}</div>
  </div>
);

const Section: React.FC<{ title: string; children: React.ReactNode; titleColor?: string }> = ({
  title,
  children,
  titleColor = "primary",
}) => (
  <div className="pb-0 pt-0 mb-0 mt-0">
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
        { name: "partner_id", label: "Partner ID" },
        { name: "partner_f_name", label: "First Name" },
        { name: "partner_l_name", label: "Last Name" },
        { name: "partner_mobile", label: "Mobile" },
        { name: "partner_wallet", label: "Wallet", type: "currency" },
        { name: "partner_pending_wallet_to_comp", label: "Pending Wallet", type: "currency" },
        { name: "partner_dob", label: "Date of Birth", type: "date" },
        { name: "partner_gender", label: "Gender" },
        { name: "partner_city_id", label: "City ID" },
      ],
    },
    kyc: {
      title: "KYC / Documents",
      cols: 3,
      fields: [
        { name: "partner_aadhar_no", label: "Aadhar Number" },
        { name: "partner_registration_step", label: "Registration Step" },
        { name: "partner_referral", label: "Referral Code" },
        { name: "referral_referral_by", label: "Referral By" },
      ],
    },
    account: {
      title: "Bank Account Details",
      cols: 3,
      fields: [
        { name: "partner_acc_dtl_id", label: "Account Detail ID" },
        { name: "partner_acc_dtl_p_id", label: "Partner ID (acc)" },
        { name: "partner_acc_dtl_acc_no", label: "Account Number" },
        { name: "partner_acc_dtl_ifsc", label: "IFSC" },
        { name: "partner_acc_dtl_acc_holder", label: "Account Holder" },
        { name: "partner_acc_dtl_added_date", label: "Added Date", type: "datetime" },
        { name: "partner_acc_dtl_status", label: "Account Status" },
      ],
    },
    createdStatus: {
      title: "Created & Status",
      cols: 3,
      fields: [
        { name: "partner_created_by", label: "Created By" },
        { name: "created_at", label: "Created At", type: "datetime" },
        { name: "updated_at", label: "Updated At", type: "datetime" },
        { name: "partner_status", label: "Status" },
      ],
    },
  };
};

// Add prop type and accept data
const PartnerDetails: React.FC<{ data: PartnerDetail | null }> = ({ data }) => {
  if (!data) {
    return <Alert variant="warning">No partner data available</Alert>;
  }

  const fieldGroups = getFieldGroups();

  return (
    <div>
      <Card className="mb-4 mt-2 detailPage-header">
        <Card.Body className="py-3 d-flex justify-content-center align-items-center gap-3 flex-wrap">
          <div>
            <span className="h5 fw-semibold">Partner ID:</span>{" "}
            <strong className="fs-5 text-muted">{data.partner_id ?? "N/A"}</strong>
          </div>
          <div>
            <span className="h5 fw-semibold">Name:</span>{" "}
            <strong className="fs-5 text-muted">
              {`${data.partner_f_name ?? ""} ${data.partner_l_name ?? ""}`.trim() || "N/A"}
            </strong>
          </div>
          <div>
            <span className="h5 fw-semibold">Mobile:</span>{" "}
            <strong className="fs-5 text-muted">{data.partner_mobile ?? "N/A"}</strong>
          </div>
        </Card.Body>
      </Card>

      <Card className="mb-4">
        <Card.Body>
          <Row className="g-3">
            <Col lg={3} md={4}>
              <div className="text-muted mb-1 fs-6">Profile Image</div>
              {data.partner_profile_img ? (
                <Image
                  src={`${basePath}/${data.partner_profile_img}`}
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

              <div className="mt-3">
                <div className="text-muted mb-1 fs-6">Aadhar Front</div>
                {data.partner_aadhar_front ? (
                  <Image
                    src={`${basePath}/${data.partner_aadhar_front}`}
                    alt="Aadhar Front"
                    thumbnail
                    style={{ maxWidth: 240, maxHeight: 240 }}
                  />
                ) : (
                  <div className="border rounded d-flex align-items-center justify-content-center" style={{ height: 120 }}>
                    <div className="text-muted">No Aadhar Front</div>
                  </div>
                )}
              </div>

              <div className="mt-3">
                <div className="text-muted mb-1 fs-6">Aadhar Back</div>
                {data.partner_aadhar_back ? (
                  <Image
                    src={`${basePath}/${data.partner_aadhar_back}`}
                    alt="Aadhar Back"
                    thumbnail
                    style={{ maxWidth: 240, maxHeight: 240 }}
                  />
                ) : (
                  <div className="border rounded d-flex align-items-center justify-content-center" style={{ height: 120 }}>
                    <div className="text-muted">No Aadhar Back</div>
                  </div>
                )}
              </div>
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

      {/* KYC / Documents */}
      <Card className="mb-4">
        <Card.Body>
          <Section title={fieldGroups.kyc.title}>
            <Row>
              {fieldGroups.kyc.fields.map((f) => (
                <Col lg={3} md={6} key={String(f.name)}>
                  <Field label={f.label} value={data[f.name]} type={f.type} />
                </Col>
              ))}
            </Row>
          </Section>
        </Card.Body>
      </Card>

      {/* Bank Account */}
      <Card className="mb-4">
        <Card.Body>
          <Section title={fieldGroups.account.title}>
            <Row>
              {fieldGroups.account.fields.map((f) => (
                <Col lg={3} md={6} key={String(f.name)}>
                  <Field label={f.label} value={data[f.name]} type={f.type} />
                </Col>
              ))}
            </Row>
          </Section>
        </Card.Body>
      </Card>

      {/* Created & Status */}
      <Card className="mb-4">
        <Card.Body>
          <Section title={fieldGroups.createdStatus.title}>
            <Row>
              {fieldGroups.createdStatus.fields.map((f) => (
                <Col lg={3} md={6} key={String(f.name)}>
                  <Field label={f.label} value={data[f.name]} type={f.type} />
                </Col>
              ))}
            </Row>
          </Section>
        </Card.Body>
      </Card>
    </div>
  );
};

export default PartnerDetails;


