import React from "react";
import { Card, Row, Col, Form } from "react-bootstrap";

interface ConsumerDetailsProps {
  data: any;
}

interface FieldDef {
  label: string;
  name: string;
  type?:
    | "text"
    | "number"
    | "tel"
    | "email"
    | "date"
    | "datetime-local"
    | "select";
  options?: { value: string | number; label: string }[];
  rows?: number;
}

const Field: React.FC<{
  label: string;
  value: any;
  type?: string;
  options?: any[];
  rows?: number;
}> = ({ label, value, type = "text", options = [] }) => {
  const format = (val: any) => {
    if (val === null || val === undefined || val === "") return "N/A";
    const s = String(val);

    if ((type === "date" || type === "datetime-local") && s) {
      try {
        const date = /^\d+$/.test(s)
          ? new Date(parseInt(s, 10) * 1000)
          : new Date(s);
        if (isNaN(date.getTime())) return s;
        const pad = (n: number) => String(n).padStart(2, "0");
        if (type === "date") return date.toISOString().split("T")[0];
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
          date.getDate()
        )} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
      } catch {
        return s;
      }
    }

    if (
      type === "email" ||
      type === "tel" ||
      type === "text" ||
      type === "number"
    )
      return s;

    if (type === "select" && options.length > 0) {
      const opt = options.find((o) => String(o.value) === s);
      return opt ? opt.label : s;
    }

    return s;
  };

  return (
    <div className="mb-3">
      <Form.Label className="text-muted mb-1 fs-6">{label}</Form.Label>
      <div className="d-flex align-items-center">
        <div className="d-flex align-items-center flex-grow-1 border rounded p-2">
          <div className="flex-grow-1 text-truncate">{format(value)}</div>
        </div>
      </div>
    </div>
  );
};

// const statusMap: Record<string, [string, string]> = {
//   "2": ["info", "Inactive"],
//   "1": ["warning", "Active"],
//   "0": ["success", "New User"],
// };

const consumerFields: FieldDef[] = [
  { label: "Consumer ID", name: "consumer_id", type: "number" },
  { label: "Name", name: "consumer_name", type: "text" },
  { label: "Mobile", name: "consumer_mobile_no", type: "tel" },
  { label: "Email", name: "consumer_email_id", type: "email" },
  { label: "Referral Code", name: "consumer_my_referal_code", type: "text" },
  { label: "Referred By", name: "consumer_refered_by", type: "text" },
  { label: "City ID", name: "consumer_city_id", type: "number" },
  {
    label: "Registered Date",
    name: "consumer_registred_date",
    type: "datetime-local",
  },
  { label: "Status", name: "consumer_status", type: "select" },
  { label: "Wallet Amount", name: "consumer_wallet_amount", type: "number" },
];

// const getStatusBadge = (status: any) => {
//   const s = String(status ?? "unknown");
//   const [variant, text] = statusMap[s] || ["secondary", s];
//   return <Badge bg={variant}>{text}</Badge>;
// };

const formatDateShort = (value: any) => {
  if (value === null || value === undefined || value === "") return "N/A";
  const s = String(value);
  try {
    const date = /^\d+$/.test(s)
      ? new Date(parseInt(s, 10) * 1000)
      : new Date(s);
    if (isNaN(date.getTime())) return s;
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${pad(date.getMonth() + 1)}/${pad(
      date.getDate()
    )}/${date.getFullYear()}`;
  } catch {
    return s;
  }
};

const ConsumerDetails: React.FC<ConsumerDetailsProps> = ({ data }) => {
  return (
    <div>
      <Card className="mb-4 detailPage-header">
        <Card.Body className="py-3 d-flex flex-wrap align-items-center gap-3 justify-content-center">
          <div>
            <span className="h4 fw-semibold fs-4">Consumer ID:</span>{" "}
            <strong className="fs-4 text-muted">
              {data?.consumer_id || "N/A"}
            </strong>
          </div>
          <div className="h5 mb-0 fs-4 fw-semibold">{data?.consumer_name ?? "N/A"}</div>

          <div>
            <span className="h4 fs-4 fw-semibold">Registered:</span>{" "}
            <strong className="fs-4 text-muted">
              {formatDateShort(data?.consumer_registred_date)}
            </strong>
          </div>
        </Card.Body>
      </Card>

      <Card className="mb-4">
        <Card.Body>
          <h5 className="mb-3">Consumer Information</h5>
          <Row>
            {consumerFields.map((f) => (
              <Col md={3} key={f.name}>
                {f.name === "consumer_status" ? (
                  <div className="mb-3">
                    <Form.Label className="text-muted mb-1 fs-6">
                      Status
                    </Form.Label>
                    <div className="d-flex align-items-center">
                      <div className="d-flex align-items-center flex-grow-1 border rounded p-2">
                        <div className="flex-grow-1">
                          {data?.consumer_status}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : f.name === "consumer_registred_date" ? (
                  <Field
                    label={f.label}
                    value={formatDateShort(data?.[f.name])}
                    type={f.type}
                  />
                ) : (
                  <Field label={f.label} value={data?.[f.name]} type={f.type} />
                )}
              </Col>
            ))}
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ConsumerDetails;
