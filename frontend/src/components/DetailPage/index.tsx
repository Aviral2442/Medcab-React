import React, { useState } from "react";
import { Card, Row, Col, Form } from "react-bootstrap";
import { TbPencil, TbCheck, TbX } from "react-icons/tb";
import DateConversion from "../DateConversion";

interface FieldConfig {
  label: string;
  name: string;
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
  editable?: boolean;
  rows?: number;
  options?: { value: string | number; label: string }[];
  cols?: number; // Bootstrap column size
}

interface SectionConfig {
  title: string;
  fields: FieldConfig[];
  titleColor?: string;
  show?: boolean; // For conditional rendering
}

interface DetailPageProps {
  data: any;
  sections: SectionConfig[];
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
    {title && <h6 className={`text-${titleColor} mb-2`}>{title}</h6>}
    {children}
  </div>
);

interface FieldProps {
  label: string;
  value: string | number | boolean | null | undefined;
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

  const formatDisplayValue = (val: string | number | boolean | null | undefined) => {
    if (val === null || val === undefined) return "N/A";
    
    // Handle boolean values
    if (type === "boolean") {
      return val ? "Yes" : "No";
    }

    const valStr = val.toString();

    // For select fields, show the label instead of value
    if (type === "select" && options.length > 0) {
      const option = options.find((opt) => opt.value.toString() === valStr);
      return option ? option.label : valStr;
    }

    // Date formatting
    if (type === "date" || type === "datetime-local") {
      try {
        const date = /^\d+$/.test(valStr)
          ? new Date(parseInt(valStr) * 1000)
          : new Date(valStr);
        if (isNaN(date.getTime())) return valStr;
        return DateConversion(date.toISOString());
      } catch {
        return valStr;
      }
    }

    // Number formatting (for amounts)
    if (type === "number" && !isNaN(Number(val))) {
      return `${Number(val || ' ')}`;
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
            ) : type === "boolean" ? (
              <Form.Select
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="flex-grow-1"
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
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
              className="p-1 rounded bg-black text-white border-0"
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

const DetailPage: React.FC<DetailPageProps> = ({
  data,
  sections,
  onUpdate,
  editable = true,
}) => {
  const handleFieldUpdate = (field: string, value: string) => {
    onUpdate?.(field, value);
  };

  return (
    <div>
      {sections.map((section, sectionIndex) => {
        // Skip section if show is false
        if (section.show === false) return null;

        return (
          <Card className="mb-4" key={sectionIndex}>
            <Card.Body>
              <Section title={section.title} titleColor={section.titleColor}>
                <Row>
                  {section.fields.map((field, fieldIndex) => {
                    const colSize = field.cols || 4; // Default to col-lg-4
                    const mdSize = field.type === "textarea" ? 6 : 6;

                    return (
                      <Col lg={colSize} md={mdSize} key={fieldIndex}>
                        <Field
                          label={field.label}
                          value={data?.[field.name]}
                          fieldName={field.name}
                          editable={editable && field.editable !== false}
                          onEdit={(value) => handleFieldUpdate(field.name, value)}
                          type={field.type}
                          rows={field.rows}
                          options={field.options}
                        />
                      </Col>
                    );
                  })}
                </Row>
              </Section>
            </Card.Body>
          </Card>
        );
      })}
    </div>
  );
};

export default DetailPage;