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

interface AddSubCategoryProps {
  mode: "add" | "edit";
  data?: any;
  onCancel: () => void;
  onDataChanged: () => void;
}

const AddSubCategory: React.FC<AddSubCategoryProps> = ({
  mode,
  data,
  onCancel,
  onDataChanged,
}) => {
  const [categories, setCategories] = React.useState<any[]>([]);
  const [formValues, setFormValues] = React.useState({
    mpsc_category_id: "",
    mpsc_name: "",
    mpsc_image: null as File | null,
    mpsc_overview: "",
    mpsc_description: "",
    mpsc_gst_percentage: "",
    mpsc_emergency_status: "0", // 0 = No, 1 = Yes
    mpsc_popular_status: "0", // 0 = No, 1 = Yes
    mpsc_status: "0", // 0 = Active, 1 = Inactive
    mpsc_visit_rate: "",
    mpsc_day_rate: "",
    mpsc_month_rate: "",
    mpsc_gender: "",
    mpsc_city: "",
  });

  const baseURL = (import.meta as any).env?.VITE_PATH ?? "";

  // Fetch categories for dropdown
  React.useEffect(() => {
    axios
      .get(`${baseURL}/manpower/get-category`)
      .then((res) => setCategories(res.data.categories || []))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  // Pre-fill if editing
  React.useEffect(() => {
    if (mode === "edit" && data) {
      setFormValues({
        mpsc_category_id: data.mpsc_category_id || "",
        mpsc_name: data.mpsc_name || "",
        mpsc_image: null,
        mpsc_overview: data.mpsc_overview || "",
        mpsc_description: data.mpsc_description || "",
        mpsc_gst_percentage: data.mpsc_gst_percentage || "",
        mpsc_emergency_status: String(
          data.mpsc_emergency_status ?? "0"
        ),
        mpsc_popular_status: String(
          data.mpsc_popular_status ?? "0"
        ),
        mpsc_status: String(data.mpsc_status ?? "0"),
        mpsc_visit_rate: data.mppm_visit_rate || "",
        mpsc_day_rate: data.mppm_days_rate || "",
        mpsc_month_rate: data.mppm_month_rate || "",
        mpsc_gender: data.mppm_gender || "",
        mpsc_city: data.mppm_city_id || "",
      });
    }
  }, [mode, data]);

  const handleChange = (key: string, value: any) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setFormValues((prev) => ({ ...prev, mpsc_image: file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("mpsc_category_id", formValues.mpsc_category_id);
    formData.append("mpsc_name", formValues.mpsc_name);
    if (formValues.mpsc_image) {
      formData.append("mpsc_image", formValues.mpsc_image);
    }
    formData.append("mpsc_overview", formValues.mpsc_overview);
    formData.append(
      "mpsc_description",
      formValues.mpsc_description
    );
    formData.append("mpsc_gst_percentage", formValues.mpsc_gst_percentage);
    formData.append(
      "mpsc_emergency_status",
      formValues.mpsc_emergency_status
    );
    formData.append(
      "mpsc_popular_status",
      formValues.mpsc_popular_status
    );
    formData.append("mpsc_status", formValues.mpsc_status);
    formData.append("mpsc_visit_rate", formValues.mpsc_visit_rate);
    formData.append("mpsc_day_rate", formValues.mpsc_day_rate);
    formData.append("mpsc_month_rate", formValues.mpsc_month_rate);
    formData.append("mpsc_gender", formValues.mpsc_gender);
    formData.append("mpsc_city", formValues.mpsc_city);

    try {
      if (mode === "edit") {
        await axios.put(
          `${baseURL}/manpower/edit-subcategory/${data.mp_sub_category_id}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      } else {
        await axios.post(`${baseURL}/manpower/add-subcategory`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      onDataChanged();
      onCancel();
    } catch (err) {
      console.error("Error saving subcategory:", err);
      alert("Failed to save subcategory");
    }
  };

  return (
    <ComponentCard
      title={mode === "edit" ? "Edit Sub Category" : "Add Sub Category"}
    >
      <Form onSubmit={handleSubmit}>
        <Row className="g-3">
          {/* Category Dropdown */}
          <Col lg={3}>
            <Form.Group>
              <FormLabel>Manpower Category</FormLabel>
              <Form.Select
                value={formValues.mpsc_category_id}
                onChange={(e) => handleChange("mpsc_category_id", e.target.value)}
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.mp_cat_id} value={cat.mp_cat_id}>
                    {cat.mp_cat_name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          {/* Sub Category Name */}
          <Col lg={3}>
            <Form.Group>
              <FormLabel>Sub Category Name</FormLabel>
              <FormControl
                type="text"
                value={formValues.mpsc_name}
                onChange={(e) =>
                  handleChange("mpsc_name", e.target.value)
                }
                required
              />
            </Form.Group>
          </Col>

          {/* Image Upload */}
          <Col lg={3}>
            <Form.Group>
              <FormLabel>Upload Image</FormLabel>
              <FormControl
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            </Form.Group>
          </Col>

          {/* Overview */}
          <Col lg={3}>
            <Form.Group>
              <FormLabel>Overview</FormLabel>
              <FormControl
                type="text"
                value={formValues.mpsc_overview}
                onChange={(e) =>
                  handleChange("mpsc_overview", e.target.value)
                }
              />
            </Form.Group>
          </Col>

          {/* Description */}
          <Col lg={3}>
            <Form.Group>
              <FormLabel>Description</FormLabel>
              <FormControl
                as="textarea"
                rows={2}
                value={formValues.mpsc_description}
                onChange={(e) =>
                  handleChange("mpsc_description", e.target.value)
                }
              />
            </Form.Group>
          </Col>

          {/* GST Percentage */}
          <Col lg={3}>
            <Form.Group>
              <FormLabel>GST %</FormLabel>
              <FormControl
                type="number"
                placeholder="Enter GST %"
                value={formValues.mpsc_gst_percentage}
                onChange={(e) => handleChange("mpsc_gst_percentage", e.target.value)}
              />
            </Form.Group>
          </Col>

          {/* Emergency Status */}
          <Col lg={3}>
            <Form.Group>
              <FormLabel>Emergency Status</FormLabel>
              <Form.Select
                value={formValues.mpsc_emergency_status}
                onChange={(e) =>
                  handleChange("mpsc_emergency_status", e.target.value)
                }
              >
                <option value="1">Yes</option>
                <option value="0">No</option>
              </Form.Select>
            </Form.Group>
          </Col>

          {/* Popular Status */}
          <Col lg={3}>
            <Form.Group>
              <FormLabel>Popular Status</FormLabel>
              <Form.Select
                value={formValues.mpsc_popular_status}
                onChange={(e) =>
                  handleChange("mpsc_popular_status", e.target.value)
                }
              >
                <option value="1">Yes</option>
                <option value="0">No</option>
              </Form.Select>
            </Form.Group>
          </Col>

          {/* Status */}
          <Col lg={3}>
            <Form.Group>
              <FormLabel>Status</FormLabel>
              <Form.Select
                value={formValues.mpsc_status}
                onChange={(e) =>
                  handleChange("mpsc_status", e.target.value)
                }
              >
                <option value="0">Active</option>
                <option value="1">Inactive</option>
              </Form.Select>
            </Form.Group>
          </Col>

          {/* Visit Rate */}
          <Col lg={3}>
            <Form.Group>
              <FormLabel>Visit Rate</FormLabel>
              <FormControl
                type="number"
                value={formValues.mpsc_visit_rate}
                onChange={(e) =>
                  handleChange("mpsc_visit_rate", e.target.value)
                }
              />
            </Form.Group>
          </Col>

          {/* Day Rate */}
          <Col lg={3}>
            <Form.Group>
              <FormLabel>Day Rate</FormLabel>
              <FormControl
                type="number"
                value={formValues.mpsc_day_rate}
                onChange={(e) =>
                  handleChange("mpsc_day_rate", e.target.value)
                }
              />
            </Form.Group>
          </Col>

          {/* Month Rate */}
          <Col lg={3}>
            <Form.Group>
              <FormLabel>Month Rate</FormLabel>
              <FormControl
                type="number"
                value={formValues.mpsc_month_rate}
                onChange={(e) =>
                  handleChange("mpsc_month_rate", e.target.value)
                }
              />
            </Form.Group>
          </Col>

          {/* Gender */}
          <Col lg={3}>
            <Form.Group>
              <FormLabel>Gender</FormLabel>
              <Form.Select
                value={formValues.mpsc_gender}
                onChange={(e) =>
                  handleChange("mpsc_gender", e.target.value)
                }
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </Form.Select>
            </Form.Group>
          </Col>

          {/* City */}
          <Col lg={3}>
            <Form.Group>
              <FormLabel>City</FormLabel>
              <FormControl
                type="text"
                value={formValues.mpsc_city}
                onChange={(e) =>
                  handleChange("mpsc_city", e.target.value)
                }
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Buttons */}
        <Row className="mt-4">
          <Col className="d-flex justify-content-end gap-2">
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {mode === "edit" ? "Update" : "Submit"}
            </Button>
          </Col>
        </Row>
      </Form>
    </ComponentCard>
  );
};

export default AddSubCategory;
