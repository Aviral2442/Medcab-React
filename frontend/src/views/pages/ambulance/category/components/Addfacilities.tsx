import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Alert } from "react-bootstrap";
import axios from "axios";
import ComponentCard from "@/components/ComponentCard";
import { LuTrash } from "react-icons/lu";

interface AddAmbulanceFAQProps {
  mode: "add" | "edit";
  data?: any;
  onCancel: () => void;
  onDataChanged: () => void;
}

interface FAQItem {
  ambulance_faq_que: string;
  ambulance_faq_ans: string;
}

const AddAmbulanceFAQ: React.FC<AddAmbulanceFAQProps> = ({
  mode,
  data,
  onCancel,
  onDataChanged,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [faqList, setFaqList] = useState<FAQItem[]>(
    mode === "edit" && data
      ? [
          {
            ambulance_faq_que: data.ambulance_faq_que || "",
            ambulance_faq_ans: data.ambulance_faq_ans || "",
          },
        ]
      : [
          {
            ambulance_faq_que: "",
            ambulance_faq_ans: "",
          },
        ]
  );

  const baseURL = (import.meta as any).env?.VITE_PATH ?? "";

  useEffect(() => {
    if (mode === "edit" && data) {
      setFaqList([
        {
          ambulance_faq_que: data.ambulance_faq_que || "",
          ambulance_faq_ans: data.ambulance_faq_ans || "",
        },
      ]);
    }
  }, [mode, data]);

  const handleChange = (index: number, key: keyof FAQItem, value: string) => {
    setFaqList((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [key]: value };
      return updated;
    });
  };

  const handleAddMore = () => {
    setFaqList((prev) => [
      ...prev,
      {
        ambulance_faq_que: "",
        ambulance_faq_ans: "",
      },
    ]);
  };

  const handleRemove = (index: number) => {
    if (faqList.length > 1) {
      setFaqList((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === "edit" && data) {
        const payload = {
          ambulance_id: data.ambulance_id,
          ambulance_faq_que: faqList[0].ambulance_faq_que,
          ambulance_faq_ans: faqList[0].ambulance_faq_ans,
        };
        await axios.put(
          `${baseURL}/ambulance/edit_ambulance_faq/${data.ambulance_faq_id}`,
          payload
        );
        onDataChanged();
        onCancel();
      } else {
        // For add mode, send multiple FAQs
        const payload = faqList.map((faq) => ({
          ambulance_id: 1, // You may want to make this dynamic
          ambulance_faq_que: faq.ambulance_faq_que,
          ambulance_faq_ans: faq.ambulance_faq_ans,
        }));
        await Promise.all(
          payload.map((faq) =>
            axios.post(`${baseURL}/ambulance/add_ambulance_faq`, faq)
          )
        );
        onDataChanged();
        onCancel();
      }
    } catch (err: any) {
      console.error("Error saving FAQ:", err);
      console.error("Response data:", err.response?.data);
      setError(
        err.response?.data?.message || "An error occurred while saving FAQ"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ComponentCard
      title={
        <div className="d-flex justify-content-between align-items-center">
          <span>{mode === "edit" ? "Edit Ambulance FAQ" : "Add Ambulance FAQ"}</span>
        </div>
      }
    >
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        {faqList.map((faq, index) => (
          <React.Fragment key={index}>
            <Row className="align-items-end g-3 mb-3">
              {/* Question */}
              <Col lg={mode === "add" ? 11 : 12}>
                <Form.Group
                  controlId={`ambulance_faq_que_${index}`}
                  className="mb-0"
                >
                  <Form.Label>Question {index + 1}</Form.Label>
                  <Form.Control
                    type="text"
                    value={faq.ambulance_faq_que}
                    onChange={(e) =>
                      handleChange(index, "ambulance_faq_que", e.target.value)
                    }
                    required
                    placeholder="Enter question"
                  />
                </Form.Group>
              </Col>

              {/* Remove Button - Only show in add mode */}
              {mode === "add" && (
                <Col lg={1}>
                  {faqList.length > 1 && (
                    <Button
                      variant=""
                      onClick={() => handleRemove(index)}
                      className="w-100 text-danger"
                      title="Remove FAQ"
                    >
                      <LuTrash />
                    </Button>
                  )}
                </Col>
              )}
            </Row>

            {/* Answer */}
            <Row>
              <Col lg={12}>
                <Form.Group
                  controlId={`ambulance_faq_ans_${index}`}
                  className="mb-0"
                >
                  <Form.Label>Answer {index + 1}</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    value={faq.ambulance_faq_ans}
                    onChange={(e) =>
                      handleChange(index, "ambulance_faq_ans", e.target.value)
                    }
                    required
                    placeholder="Enter answer"
                  />
                </Form.Group>
              </Col>
            </Row>

            {index < faqList.length - 1 && <hr className="my-3" />}
          </React.Fragment>
        ))}

        {/* Action Buttons */}
        <Row className="mt-4">
          <Col lg={12} className="d-flex justify-content-end gap-2">
            <Button variant="" className="px-3 bg-light rounded" onClick={onCancel}>
              Cancel
            </Button>
            {mode === "add" && (
              <Button variant="" className="cancel-button px-3 rounded text-white" onClick={handleAddMore}>
                + Add More FAQ
              </Button>
            )}
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? "Saving..." : mode === "edit" ? "Update" : "Save All"}
            </Button>
          </Col>
        </Row>
      </Form>
    </ComponentCard>
  );
};

export default AddAmbulanceFAQ;
