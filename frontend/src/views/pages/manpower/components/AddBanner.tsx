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

interface AddBannerProps {
  mode: "add" | "edit";
  data?: any;
  onCancel: () => void;
  onDataChanged: () => void;
}

const AddBanner: React.FC<AddBannerProps> = ({
  mode,
  data,
  onCancel,
  onDataChanged,
}) => {
  const [formValues, setFormValues] = React.useState({
    banner_page: "",
    banner_status: "0", // 0=Active, 1=Inactive
  });
  const baseURL = (import.meta as any).env?.VITE_PATH ?? "";
  const [file, setFile] = React.useState<File | null>(null);

  React.useEffect(() => {
    if (mode === "edit" && data) {
      setFormValues({
        banner_page: data.banner_page || "",
        banner_status: String(data.banner_status ?? "0"),
      });
    }
  }, [mode, data]);

  const handleChange = (key: string, value: any) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    if (file) formData.append("file", file);
    formData.append("banner_page", formValues.banner_page);
    formData.append("banner_status", formValues.banner_status);

    try {
      if (mode === "edit" && data) {
        await axios.put(`${baseURL}/manpower/edit-banner/${data.banner_id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axios.post(`${baseURL}/manpower/add-banner`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      onDataChanged();
      onCancel();
    } catch (err) {
      console.error("Error saving banner:", err);
      alert("Failed to save banner");
    }
  };

  return (
    <ComponentCard
      title={
        <div className="d-flex justify-content-between align-items-center">
          <span>{mode === "edit" ? "Edit Banner" : "Add Banner"}</span>
        </div>
      }
    >
      <Form onSubmit={handleSubmit}>
        <Row className="align-items-end g-3">
          {/* Upload Image */}
          <Col lg={3}>
            <Form.Group controlId="banner_image" className="mb-0">
              <FormLabel>Upload Image</FormLabel>
              <FormControl type="file" onChange={handleFileChange} />
            </Form.Group>
          </Col>

          {/* Banner Page */}
          <Col lg={3}>
            <Form.Group controlId="banner_page" className="mb-0">
              <FormLabel>Banner Page</FormLabel>
              <FormControl
                type="text"
                value={formValues.banner_page}
                onChange={(e) => handleChange("banner_page", e.target.value)}
                required
              />
            </Form.Group>
          </Col>

          {/* Status Dropdown */}
          <Col lg={3}>
            <Form.Group controlId="banner_status" className="mb-0">
              <FormLabel>Status</FormLabel>
              <Form.Select
                value={formValues.banner_status}
                onChange={(e) => handleChange("banner_status", e.target.value)}
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

export default AddBanner;
