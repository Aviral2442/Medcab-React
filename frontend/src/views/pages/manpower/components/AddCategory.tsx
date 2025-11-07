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

interface AddCategoryProps {
  tabKey?: number;
  mode: "add" | "edit";
  data?: any;
  onCancel: () => void;
  onDataChanged: () => void;
}

const AddCategory: React.FC<AddCategoryProps> = ({ mode, data, onCancel, onDataChanged }) => {
  const [formValues, setFormValues] = React.useState({
    mp_cat_name: "",
    mp_cat_image: null as File | null,
    mp_cat_top_rated_status: "1", // 1 = Rated, 0 = Not Rated
    mp_cat_status: "0", // 0 = Active, 1 = Inactive
  });
  const baseURL = (import.meta as any).env?.VITE_PATH ?? "";

  React.useEffect(() => {
    if (mode === "edit" && data) {
      setFormValues({
        mp_cat_name: data.mp_cat_name || "",
        mp_cat_image: null,
        mp_cat_top_rated_status: String(data.mp_cat_top_rated_status ?? "1"),
        mp_cat_status: String(data.mp_cat_status ?? "0"),
      });
    }
  }, [mode, data]);

  const handleChange = (key: string, value: any) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setFormValues((prev) => ({
        ...prev,
        mp_cat_image: file,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("mp_cat_name", formValues.mp_cat_name);
    if (formValues.mp_cat_image)
      formData.append("mp_cat_image", formValues.mp_cat_image);
    formData.append(
      "mp_cat_top_rated_status",
      formValues.mp_cat_top_rated_status
    );
    formData.append("mp_cat_status", formValues.mp_cat_status);
    // console.log(formData);
    try {
      if (mode === "edit") {
        // console.log("Updating category...", formValues);
        await axios.put(
          `${baseURL}/manpower/edit-category/${data.mp_cat_id}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      } else {
        // console.log("Creating new category...", formValues);
        await axios.post(`${baseURL}/manpower/add-category`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      onDataChanged();
      onCancel();
    } catch (err) {
      console.error("Error saving category:", err);
      alert("Failed to save category");
    }
  };

  return (
    <ComponentCard
      title={
        <div className="d-flex justify-content-between align-items-center">
          <span>{mode === "edit" ? "Edit Category" : "Add Category"}</span>
        </div>
      }
    >
      <Form onSubmit={handleSubmit}>
        <Row className="align-items-end g-3">
          {/* Category Name */}
          <Col lg={3}>
            <Form.Group controlId="mp_cat_name" className="mb-0">
              <FormLabel>Category Name</FormLabel>
              <FormControl
                type="text"
                value={formValues.mp_cat_name}
                onChange={(e) => handleChange("mp_cat_name", e.target.value)}
                required
              />
            </Form.Group>
          </Col>

          {/* Upload Image */}
          <Col lg={3}>
            <Form.Group controlId="mp_cat_image" className="mb-0">
              <FormLabel>Upload Image</FormLabel>
              <FormControl
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            </Form.Group>
          </Col>

          {/* Top Rated Status */}
          <Col lg={3}>
            <Form.Group controlId="mp_cat_top_rated_status" className="mb-0">
              <FormLabel>Top Rated Status</FormLabel>
              <Form.Select
                value={formValues.mp_cat_top_rated_status}
                onChange={(e) =>
                  handleChange("mp_cat_top_rated_status", e.target.value)
                }
              >
                <option value="1">Rated</option>
                <option value="0">Not Rated</option>
              </Form.Select>
            </Form.Group>
          </Col>

          {/* Status */}
          <Col lg={3}>
            <Form.Group controlId="mp_cat_status" className="mb-0">
              <FormLabel>Status</FormLabel>
              <Form.Select
                value={formValues.mp_cat_status}
                onChange={(e) => handleChange("mp_cat_status", e.target.value)}
              >
                <option value="0">Active</option>
                <option value="1">Inactive</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        {/* Buttons */}
        <Col lg={1} className="d-flex justify-content-end gap-2 ms-auto mt-4">
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

export default AddCategory;
