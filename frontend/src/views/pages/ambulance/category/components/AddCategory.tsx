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
import * as Yup from "yup";

const CategoryValidationSchema = Yup.object().shape({
  ambulance_category_type: Yup.string().required("Category Type is required"),
  ambulance_category_service_type: Yup.string().required(
    "Service Type is required"
  ),
  ambulance_category_state_id: Yup.string().required("State is required"),
  ambulance_category_name: Yup.string().required("Category Name is required"),
  iconPath: Yup.mixed().nullable(),
  ambulance_catagory_desc: Yup.string().required("Description is required"),
});

interface AddCategoryProps {
  tabKey?: number;
  mode: "add" | "edit";
  data?: any;
  onCancel: () => void;
  onDataChanged: () => void;
}

const AddCategory: React.FC<AddCategoryProps> = ({
  mode,
  data,
  onCancel,
  onDataChanged,
}) => {
  const [formValues, setFormValues] = React.useState({
    ambulance_category_type: "",
    ambulance_category_service_type: "",
    ambulance_category_state_id: "",
    ambulance_category_name: "",
    iconPath: null as File | null,
    ambulance_catagory_desc: "",
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [states, setStates] = React.useState<Array<any>>([]);

  const baseURL = (import.meta as any).env?.VITE_PATH ?? "";

  // Populate form for edit mode
  React.useEffect(() => {
    if (mode === "edit" && data) {
      setFormValues({
        ambulance_category_type: data.ambulance_category_type || "",
        ambulance_category_service_type:
          data.ambulance_category_service_type || "",
        ambulance_category_state_id: data.ambulance_category_state_id || "",
        ambulance_category_name: data.ambulance_category_name || "",
        iconPath: null,
        ambulance_catagory_desc: data.ambulance_catagory_desc || "",
      });
    }
  }, [mode, data]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormValues((prev) => ({ ...prev, iconPath: file }));
    if (errors.iconPath) {
      setErrors((prev) => ({ ...prev, iconPath: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      // Validate only if adding or if icon is provided in edit mode
      const validationSchema =
        mode === "edit" && !formValues.iconPath
          ? CategoryValidationSchema.omit(["iconPath"])
          : CategoryValidationSchema;

      await validationSchema.validate(formValues, {
        abortEarly: false,
      });

      const formData = new FormData();
      formData.append(
        "ambulance_category_type",
        formValues.ambulance_category_type
      );
      formData.append(
        "ambulance_category_service_type",
        formValues.ambulance_category_service_type
      );
      formData.append(
        "ambulance_category_state_id",
        formValues.ambulance_category_state_id
      );
      formData.append(
        "ambulance_category_name",
        formValues.ambulance_category_name
      );
      formData.append(
        "ambulance_catagory_desc",
        formValues.ambulance_catagory_desc
      );
      if (formValues.iconPath) {
        formData.append("ambulance_category_icon", formValues.iconPath);
      }

      if (mode === "add") {
        await axios.post(
          `${baseURL}/ambulance/add_ambulance_category`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      } else {
        await axios.put(
          `${baseURL}/ambulance/edit_ambulance_category/${data.ambulance_category_id}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      }

      onDataChanged();
      onCancel();
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const validationErrors: Record<string, string> = {};
        err.inner.forEach((error) => {
          if (error.path) {
            validationErrors[error.path] = error.message;
          }
        });
        setErrors(validationErrors);
      } else {
        console.error("Submission error:", err);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchStates = async () => {
    try {
      const response = await axios.get(`${baseURL}/get_states`);
      setStates(response.data?.jsonData?.state_list || []);
    } catch (error) {
      console.error("Error fetching states:", error);
    }
  };

  React.useEffect(() => {
    fetchStates();
  }, []);

  return (
    <ComponentCard title={`${mode === "add" ? "Add" : "Edit"} Category`}>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={10}>
            <Form.Group className="mb-3">
              <FormLabel>
                Icon {mode === "add" && <span className="text-danger">*</span>}
              </FormLabel>
              <FormControl
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                isInvalid={!!errors.iconPath}
              />
              <Form.Control.Feedback type="invalid">
                {errors.iconPath}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={2}>
            {mode === "edit" && data?.ambulance_category_icon && (
              <div className="mb-3">
                <img
                  src={`${baseURL}/${data.ambulance_category_icon}`}
                  alt="Category Icon"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                  }}
                />
              </div>
            )}
            {formValues.iconPath && (
              <div className="mb-3">
                <img
                  src={URL.createObjectURL(formValues.iconPath)}
                  alt="Selected Icon"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                  }}
                  className="mt-2"
                />
              </div>
            )}
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <FormLabel>
                Category Type <span className="text-danger">*</span>
              </FormLabel>
              <FormControl
                type="text"
                name="ambulance_category_type"
                value={formValues.ambulance_category_type}
                onChange={handleInputChange}
                placeholder="Enter category type"
                isInvalid={!!errors.ambulance_category_type}
              />
              <Form.Control.Feedback type="invalid">
                {errors.ambulance_category_type}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <FormLabel>
                Category Name <span className="text-danger">*</span>
              </FormLabel>
              <FormControl
                type="text"
                name="ambulance_category_name"
                value={formValues.ambulance_category_name}
                onChange={handleInputChange}
                placeholder="Enter category name"
                isInvalid={!!errors.ambulance_category_name}
              />
              <Form.Control.Feedback type="invalid">
                {errors.ambulance_category_name}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>
                State <span className="text-danger">*</span>
              </Form.Label>
              <Form.Select
                name="ambulance_category_state_id"
                value={formValues.ambulance_category_state_id}
                onChange={handleInputChange}
                isInvalid={!!errors.ambulance_category_state_id}
              >
                <option value="">Select State</option>
                {states.map((state: any) => (
                  <option key={state.state_id} value={state.state_id}>
                    {state.state_name}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.ambulance_category_state_id}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <FormLabel>
                Service Type <span className="text-danger">*</span>
              </FormLabel>
              <Form.Select
                name="ambulance_category_service_type"
                value={formValues.ambulance_category_service_type}
                onChange={handleInputChange}
                isInvalid={!!errors.ambulance_category_service_type}
              >
                <option value="">Select Service Type</option>
                <option value="1">Human</option>
                <option value="2">Animal</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.ambulance_category_service_type}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={12}>
            <Form.Group className="mb-3">
              <FormLabel>
                Description <span className="text-danger">*</span>
              </FormLabel>
              <FormControl
                as="textarea"
                rows={3}
                name="ambulance_catagory_desc"
                value={formValues.ambulance_catagory_desc}
                onChange={handleInputChange}
                placeholder="Enter description"
                isInvalid={!!errors.ambulance_catagory_desc}
              />
              <Form.Control.Feedback type="invalid">
                {errors.ambulance_catagory_desc}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col className="d-flex justify-content-end gap-2">
            <button
              className="px-3 rounded text-black"
              onClick={onCancel}
              disabled={isSubmitting}
              type="button"
            >
              Cancel
            </button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Submitting..."
                : mode === "add"
                ? "Add Category"
                : "Update Category"}
            </Button>
          </Col>
        </Row>
      </Form>
    </ComponentCard>
  );
};

export default AddCategory;
