import React from "react";
import ComponentCard from "@/components/ComponentCard";
import {
  Col,
  Form,
  FormControl,
  FormLabel,
  Row,
  Button,
} from "react-bootstrap";
import axios from "axios";

interface AddPriceMapperProps {
  mode: "add" | "edit";
  data?: any;
  onCancel: () => void;
  onDataChanged: () => void;
}

const AddPriceMapper: React.FC<AddPriceMapperProps> = ({
  mode,
  data,
  onCancel,
  onDataChanged,
}) => {
  const [formValues, setFormValues] = React.useState({
    mpc_coupon_code: "",
    mpc_coupon_description: "",
    mpc_coupon_min_cart_value: "",
    mpc_coupon_discount_percent: "",
    mpc_coupon_discount_amount: "",
    mpc_coupon_max_discount_value: "",
    mpc_coupon_visible: "1",
    mpc_coupon_status: "0", 
  });

  const baseURL = (import.meta as any).env?.VITE_PATH ?? "";

  React.useEffect(() => {
    if (mode === "edit" && data) {
      setFormValues({
        mpc_coupon_code: data.mpc_coupon_code || "",
        mpc_coupon_description: data.mpc_coupon_description || "",
        mpc_coupon_min_cart_value: String(data.mpc_coupon_min_cart_value ?? ""),
        mpc_coupon_discount_percent: String(
          data.mpc_coupon_discount_percent ?? ""
        ),
        mpc_coupon_discount_amount: String(data.mpc_coupon_discount_amount ?? ""),
        mpc_coupon_max_discount_value: String(
          data.mpc_coupon_max_discount_value ?? ""
        ),
        mpc_coupon_visible: String(data.mpc_coupon_visible ?? "1"),
        mpc_coupon_status: String(data.mpc_coupon_status ?? "active"),
      });
    }
  }, [mode, data]);

  const handleChange = (key: string, value: any) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (mode === "edit") {
        await axios.put(`${baseURL}/manpower/edit-coupon/${data.mpc_coupon_id}`, formValues);
      } else {
        await axios.post(`${baseURL}/manpower/add-coupon`, formValues);
      }
      onDataChanged();
      onCancel();
    } catch (err) {
      console.error("Error saving coupon:", err);
      alert("Failed to save coupon");
    }
  };

  return (
    <ComponentCard
      title={
        <div className="d-flex justify-content-between align-items-center">
          <span>{mode === "edit" ? "Edit Coupon" : "Add Coupon"}</span>
        </div>
      }
    >
      <Form onSubmit={handleSubmit}>
        <Row className="align-items-end g-3">
          {/* Coupon Code */}
          <Col lg={3}>
            <Form.Group controlId="mpc_coupon_code" className="mb-0">
              <FormLabel>Coupon Code</FormLabel>
              <FormControl
                type="text"
                value={formValues.mpc_coupon_code}
                onChange={(e) => handleChange("mpc_coupon_code", e.target.value)}
                required
              />
            </Form.Group>
          </Col>

          {/* Coupon Description */}
          <Col lg={3}>
            <Form.Group controlId="mpc_coupon_description" className="mb-0">
              <FormLabel>Coupon Description</FormLabel>
              <FormControl
                type="text"
                value={formValues.mpc_coupon_description}
                onChange={(e) =>
                  handleChange("mpc_coupon_description", e.target.value)
                }
              />
            </Form.Group>
          </Col>

          {/* Min Cart Value */}
          <Col lg={3}>
            <Form.Group controlId="mpc_coupon_min_cart_value" className="mb-0">
              <FormLabel>Coupon Min Cart Value</FormLabel>
              <FormControl
                type="number"
                value={formValues.mpc_coupon_min_cart_value}
                onChange={(e) =>
                  handleChange("mpc_coupon_min_cart_value", e.target.value)
                }
              />
            </Form.Group>
          </Col>

          {/* Discount % */}
          <Col lg={3}>
            <Form.Group controlId="mpc_coupon_discount_percent" className="mb-0">
              <FormLabel>Coupon Discount Percentage</FormLabel>
              <FormControl
                type="number"
                placeholder="Enter discount % (0-100)"
                value={formValues.mpc_coupon_discount_percent}
                onChange={(e) =>
                  handleChange("mpc_coupon_discount_percent", e.target.value)
                }
              />
            </Form.Group>
          </Col>

          {/* Discount Amount */}
          <Col lg={3}>
            <Form.Group controlId="mpc_coupon_discount_amount" className="mb-0">
              <FormLabel>Coupon Discount Amount</FormLabel>
              <FormControl
                type="number"
                value={formValues.mpc_coupon_discount_amount}
                onChange={(e) =>
                  handleChange("mpc_coupon_discount_amount", e.target.value)
                }
              />
            </Form.Group>
          </Col>

          {/* Max Discount Value */}
          <Col lg={3}>
            <Form.Group controlId="mpc_coupon_max_discount_value" className="mb-0">
              <FormLabel>Coupon Max Discount Value</FormLabel>
              <FormControl
                type="number"
                value={formValues.mpc_coupon_max_discount_value}
                onChange={(e) =>
                  handleChange("mpc_coupon_max_discount_value", e.target.value)
                }
              />
            </Form.Group>
          </Col>

          {/* Visible Dropdown */}
          <Col lg={3}>
            <Form.Group controlId="mpc_coupon_visible" className="mb-0">
              <FormLabel>Coupon Visible</FormLabel>
              <Form.Select
                value={formValues.mpc_coupon_visible}
                onChange={(e) => handleChange("mpc_coupon_visible", e.target.value)}
              >
                <option value="0">Yes</option>
                <option value="1">No</option>
              </Form.Select>
            </Form.Group>
          </Col>

          {/* Status Dropdown */}
          <Col lg={3}>
            <Form.Group controlId="mpc_coupon_status" className="mb-0">
              <FormLabel>Coupon Status</FormLabel>
              <Form.Select
                value={formValues.mpc_coupon_status}
                onChange={(e) => handleChange("mpc_coupon_status", e.target.value)}
              >
                <option value="0">Active</option>
                <option value="1">Inactive</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        {/* Buttons */}
        <Col lg={12} className="d-flex justify-content-end gap-2 ms-auto mt-4">
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {mode === "edit" ? "Update" : "Submit"}
          </Button>
        </Col>
      </Form>
    </ComponentCard>
  );
};

export default AddPriceMapper;
