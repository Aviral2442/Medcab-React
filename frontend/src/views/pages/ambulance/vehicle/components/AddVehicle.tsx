import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Card, Alert, Image } from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";
import ComponentCard from "@/components/ComponentCard";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "@/global.css";

const vehicleValidationSchema = Yup.object().shape({
  vehicle_added_type: Yup.string().required("Vehicle added type is required"),
  vehicle_added_by: Yup.string().required("Vehicle added by is required"),
  vehicle_category_type: Yup.string().required("Vehicle category type is required"),
  vehicle_category_type_service_id: Yup.string().required("Vehicle category type service ID is required"),
  v_vehicle_name: Yup.string().required("Vehicle name is required"),
  v_vehicle_name_id: Yup.string().required("Vehicle name ID is required"),
  vehicle_front_image: Yup.mixed().nullable(),
  vehicle_back_image: Yup.mixed().nullable(),
  vehicle_rc_image: Yup.mixed().nullable(),
  vehicle_rc_number: Yup.string().required("Vehicle RC number is required"),
  vehicle_exp_date: Yup.string().required("Vehicle expiry date is required"),
  vehicle_verify_date: Yup.string().nullable(),
  verify_type: Yup.string().nullable(),
  vehicle_details_added_type: Yup.string().nullable(),
  vehicle_details_fitness_certi_img: Yup.mixed().nullable(),
  vehicle_details_insurance_img: Yup.mixed().nullable(),
  vehicle_details_pollution_img: Yup.mixed().nullable(),
  // Details table fields
  vehicle_details_fitness_exp_date: Yup.string().nullable(),
  vehicle_details_insurance_exp_date: Yup.string().nullable(),
  vehicle_details_insurance_holder_name: Yup.string().nullable(),
  vehicle_details_pollution_exp_date: Yup.string().nullable(),
  created_at: Yup.string().nullable(),
});

// Add helper function to convert backend values to yyyy-MM-dd for <input type="date">
const toInputDate = (raw?: any): string => {
  if (raw === undefined || raw === null || raw === "") return "";

  const s = String(raw).trim();

  // If it's already in YYYY-MM-DD format, return as is
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;

  // Try ISO or strings with date part "YYYY-MM-DD HH:MM:SS"
  if (s.includes(" ")) {
    const part = s.split(" ")[0];
    if (/^\d{4}-\d{2}-\d{2}$/.test(part)) return part;
    // fallback to parsing
  }

  // Numeric values (unix timestamps or other numeric formats)
  if (/^\d+$/.test(s)) {
    try {
      const num = parseInt(s, 10);

      // If length indicates milliseconds (> 11 digits), use directly
      if (s.length >= 13) {
        const d = new Date(num);
        if (!isNaN(d.getTime())) return d.toISOString().slice(0, 10);
      }

      // Assume seconds (10 digits)
      if (s.length === 10) {
        const d = new Date(num * 1000);
        if (!isNaN(d.getTime())) {
          const year = d.getFullYear();
          // Heuristic: if parsed year is reasonable (1970-2035), return it
          if (year >= 1970 && year <= 2035) {
            return d.toISOString().slice(0, 10);
          }
        }

        // Fallback: maybe string is in YYMMDDhhmm (e.g. 2206031400)
        if (/^\d{10}$/.test(s)) {
          const yy = parseInt(s.substr(0, 2), 10);
          const mm = parseInt(s.substr(2, 2), 10);
          const dd = parseInt(s.substr(4, 2), 10);
          const year = 2000 + (yy < 70 ? yy : yy); // basic mapping to 2000+
          if (mm >= 1 && mm <= 12 && dd >= 1 && dd <= 31) {
            const d2 = new Date(year, mm - 1, dd);
            if (!isNaN(d2.getTime())) return d2.toISOString().slice(0, 10);
          }
        }
      }

      // If numeric but other lengths, still try parsing as ms to date
      const dGeneric = new Date(num);
      if (!isNaN(dGeneric.getTime())) return dGeneric.toISOString().slice(0, 10);
    } catch {}
  }

  // Try parsing generic date strings
  try {
    const d = new Date(s);
    if (!isNaN(d.getTime())) return d.toISOString().slice(0, 10);
  } catch {}

  // Try DD-MM-YYYY or DD/MM/YYYY
  const dmy = s.replace(/\//g, "-");
  const parts = dmy.split("-");
  if (parts.length === 3) {
    try {
      // if format is DD-MM-YYYY or D-M-YYYY
      if (parts[0].length <= 2 && parts[2].length === 4) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10);
        const year = parseInt(parts[2], 10);
        if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
          const d2 = new Date(year, month - 1, day);
          if (!isNaN(d2.getTime())) return d2.toISOString().slice(0, 10);
        }
      }
    } catch {}
  }

  return "";
};

// Add helper to convert a 'YYYY-MM-DD' input to backend 'YYYY-MM-DD HH:mm:ss'
const toBackendDateTime = (value?: string) => {
  if (!value) return "";
  return `${value} 00:00:00`;
};

const AddVehicle: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const baseURL = (import.meta as any).env?.VITE_PATH ?? "";

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [previewFront, setPreviewFront] = useState<string | null>(null);
  const [previewBack, setPreviewBack] = useState<string | null>(null);
  const [previewRC, setPreviewRC] = useState<string | null>(null);
  const [previewFitness, setPreviewFitness] = useState<string | null>(null);
  const [previewInsurance, setPreviewInsurance] = useState<string | null>(null);
  const [previewPollution, setPreviewPollution] = useState<string | null>(null);

  const [initialValues, setInitialValues] = useState({
    vehicle_added_type: "", // 0 = self, 1 = partner
    vehicle_added_by: "",
    vehicle_category_type: "",
    vehicle_category_type_service_id: "",
    v_vehicle_name: "",
    v_vehicle_name_id: "",
    vehicle_front_image: null as File | null,
    vehicle_back_image: null as File | null,
    vehicle_rc_image: null as File | null,
    vehicle_rc_number: "",
    vehicle_exp_date: "",
    vehicle_verify_date: "",
    verify_type: "",

    // details (make them strings, not null)
    vehicle_details_added_type: "",
    vehicle_details_added_by: "",
    vehicle_details_fitness_certi_img: null as File | null,
    vehicle_details_fitness_exp_date: "",
    vehicle_details_insurance_img: null as File | null,
    vehicle_details_insurance_exp_date: "",
    vehicle_details_insurance_holder_name: "",
    vehicle_details_pollution_img: null as File | null,
    vehicle_details_pollution_exp_date: "",
  });

  useEffect(() => {
    if (isEditMode) {
      fetchVehicle();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchVehicle = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseURL}/vehicle/get_vehicle/${id}`);
      console.log(response.data.length);
      const vehicle = response.data?.jsonData?.vehicle_data[0];

      setInitialValues({
        vehicle_added_type: vehicle?.vehicle_added_type?.toString() || "",
        vehicle_added_by: vehicle?.vehicle_added_by?.toString() || "",
        vehicle_category_type: vehicle?.vehicle_category_type?.toString() || "",
        vehicle_category_type_service_id: vehicle?.vehicle_category_type_service_id || "",
        v_vehicle_name: vehicle?.v_vehicle_name || "",
        v_vehicle_name_id: vehicle?.v_vehicle_name_id?.toString() || "",
        vehicle_front_image: null,
        vehicle_back_image: null,
        vehicle_rc_image: null,
        vehicle_rc_number: vehicle?.vehicle_rc_number || "",
        // Normalize dates to ISO "YYYY-MM-DD" so <input type="date"> accepts them
        vehicle_exp_date: toInputDate(vehicle?.vehicle_exp_date),
        vehicle_verify_date: toInputDate(vehicle?.vehicle_verify_date),
        verify_type: vehicle?.verify_type || "",

        vehicle_details_added_type: vehicle?.vehicle_details_added_type?.toString() || "",
        vehicle_details_added_by: vehicle?.vehicle_details_added_by?.toString() || "",
        vehicle_details_fitness_certi_img: null,
        vehicle_details_fitness_exp_date: toInputDate(vehicle?.vehicle_details_fitness_exp_date),
        vehicle_details_insurance_img: null,
        vehicle_details_insurance_exp_date: toInputDate(vehicle?.vehicle_details_insurance_exp_date),
        vehicle_details_insurance_holder_name: vehicle?.vehicle_details_insurance_holder_name || "",
        vehicle_details_pollution_img: null,
        vehicle_details_pollution_exp_date: toInputDate(vehicle?.vehicle_details_pollution_exp_date),
      });

      // Load previews if server returns image paths
      if (vehicle?.vehicle_front_image) {
        setPreviewFront(`${baseURL}/${vehicle.vehicle_front_image}`);
      }
      if (vehicle?.vehicle_back_image) {
        setPreviewBack(`${baseURL}/${vehicle.vehicle_back_image}`);
      }
      if (vehicle?.vehicle_rc_image) {
        setPreviewRC(`${baseURL}/${vehicle.vehicle_rc_image}`);
      }
      if (vehicle?.vehicle_details_fitness_certi_img) {
        setPreviewFitness(`${baseURL}/${vehicle.vehicle_details_fitness_certi_img}`);
      }
      if (vehicle?.vehicle_details_insurance_img) {
        setPreviewInsurance(`${baseURL}/${vehicle.vehicle_details_insurance_img}`);
      }
      if (vehicle?.vehicle_details_pollution_img) {
        setPreviewPollution(`${baseURL}/${vehicle.vehicle_details_pollution_img}`);
      }
    } catch (err: any) {
      console.error("Failed to fetch vehicle details:", err);
      setError(err.response?.data?.message || "Failed to fetch vehicle details");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: any,
    fieldName: string,
    setPreview: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    const file = e.target.files?.[0];
    setFieldValue(fieldName, file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (values: typeof initialValues) => {
    setSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("vehicle_added_type", values.vehicle_added_type);
      formData.append("vehicle_added_by", values.vehicle_added_by);
      formData.append("vehicle_category_type", values.vehicle_category_type);
      formData.append("vehicle_category_type_service_id", values.vehicle_category_type_service_id);
      formData.append("v_vehicle_name", values.v_vehicle_name);
      formData.append("v_vehicle_name_id", values.v_vehicle_name_id);
      if (values.vehicle_front_image) formData.append("vehicle_front_image", values.vehicle_front_image);
      if (values.vehicle_back_image) formData.append("vehicle_back_image", values.vehicle_back_image);
      if (values.vehicle_rc_image) formData.append("vehicle_rc_image", values.vehicle_rc_image);
      formData.append("vehicle_rc_number", values.vehicle_rc_number);
      // send backend-friendly datetime format
      formData.append("vehicle_exp_date", toBackendDateTime(values.vehicle_exp_date));
      if (values.vehicle_verify_date) formData.append("vehicle_verify_date", toBackendDateTime(values.vehicle_verify_date));
      if (values.verify_type) formData.append("verify_type", values.verify_type);

      // Details
      if (values.vehicle_details_fitness_certi_img) formData.append("vehicle_details_fitness_certi_img", values.vehicle_details_fitness_certi_img);
      formData.append("vehicle_details_fitness_exp_date", toBackendDateTime(values.vehicle_details_fitness_exp_date));
      if (values.vehicle_details_insurance_img) formData.append("vehicle_details_insurance_img", values.vehicle_details_insurance_img);
      formData.append("vehicle_details_insurance_exp_date", toBackendDateTime(values.vehicle_details_insurance_exp_date));
      formData.append("vehicle_details_insurance_holder_name", values.vehicle_details_insurance_holder_name);
      if (values.vehicle_details_pollution_img) formData.append("vehicle_details_pollution_img", values.vehicle_details_pollution_img);
      formData.append("vehicle_details_pollution_exp_date", toBackendDateTime(values.vehicle_details_pollution_exp_date));

      // Append details added type / by
      if (values.vehicle_details_added_type) formData.append("vehicle_details_added_type", values.vehicle_details_added_type);
      if (values.vehicle_details_added_by) formData.append("vehicle_details_added_by", values.vehicle_details_added_by);

      let response;
      if (isEditMode) {
        response = await axios.put(`${baseURL}/vehicle/update_vehicle/${id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        response = await axios.post(`${baseURL}/vehicle/add_vehicle`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      if (response.data.status === 200 || response.data.status === 201) {
        navigate("/ambulance/vehicle");
      } else {
        setError(response.data.message || "Failed to save vehicle");
      }
    } catch (err: any) {
      console.error("Vehicle submit error:", err);
      setError(err.response?.data?.message || "Failed to save vehicle");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <ComponentCard title={isEditMode ? "Edit Vehicle" : "Add New Vehicle"} className="m-2">
        <div className="text-center py-4">Loading vehicle details...</div>
      </ComponentCard>
    );
  }

  return (
    <ComponentCard title={isEditMode ? "Edit Vehicle" : "Add New Vehicle"} className="m-2">
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Formik initialValues={initialValues} validationSchema={vehicleValidationSchema} onSubmit={handleSubmit} enableReinitialize>
        {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue }) => (
          <Form onSubmit={handleSubmit}>
            <Row className="g-3">
              <Col lg={12}>
                <Card className="border">
                  <Card.Header className="bg-light">
                    <h6 className="mb-0">Basic Information</h6>
                  </Card.Header>
                  <Card.Body>
                    <Row className="g-3">
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label className="fs-6 fw-semibold">Added Type <span className="text-danger">*</span></Form.Label>
                          <Form.Select
                            name="vehicle_added_type"
                            value={values.vehicle_added_type}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.vehicle_added_type && !!errors.vehicle_added_type}
                          >
                            <option value="">Select</option>
                            <option value="0">Self</option>
                            <option value="1">Partner</option>
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">{errors.vehicle_added_type}</Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col md={4}>
                        <Form.Group>
                          <Form.Label className="fs-6 fw-semibold">Added By <span className="text-danger">*</span></Form.Label>
                          <Form.Control
                            type="text"
                            name="vehicle_added_by"
                            value={values.vehicle_added_by}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.vehicle_added_by && !!errors.vehicle_added_by}
                            placeholder="Enter user id"
                          />
                          <Form.Control.Feedback type="invalid">{errors.vehicle_added_by}</Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col md={4}>
                        <Form.Group>
                          <Form.Label className="fs-6 fw-semibold">Category Type <span className="text-danger">*</span></Form.Label>
                          <Form.Select
                            name="vehicle_category_type"
                            value={values.vehicle_category_type}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.vehicle_category_type && !!errors.vehicle_category_type}
                          >
                            <option value="">Select Category Type</option>
                            <option value="1">Type 1</option>
                            <option value="2">Type 2</option>
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">{errors.vehicle_category_type}</Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group>
                          <Form.Label className="fs-6 fw-semibold">Category Service ID <span className="text-danger">*</span></Form.Label>
                          <Form.Control
                            type="text"
                            name="vehicle_category_type_service_id"
                            value={values.vehicle_category_type_service_id}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.vehicle_category_type_service_id && !!errors.vehicle_category_type_service_id}
                            placeholder="Enter comma separated service ids"
                          />
                          <Form.Control.Feedback type="invalid">{errors.vehicle_category_type_service_id}</Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group>
                          <Form.Label className="fs-6 fw-semibold">Vehicle Name <span className="text-danger">*</span></Form.Label>
                          <Form.Control
                            type="text"
                            name="v_vehicle_name"
                            value={values.v_vehicle_name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.v_vehicle_name && !!errors.v_vehicle_name}
                            placeholder="Enter vehicle name"
                          />
                          <Form.Control.Feedback type="invalid">{errors.v_vehicle_name}</Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group>
                          <Form.Label className="fs-6 fw-semibold">Vehicle Name ID <span className="text-danger">*</span></Form.Label>
                          <Form.Control
                            type="text"
                            name="v_vehicle_name_id"
                            value={values.v_vehicle_name_id}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.v_vehicle_name_id && !!errors.v_vehicle_name_id}
                            placeholder="Enter vehicle name id"
                          />
                          <Form.Control.Feedback type="invalid">{errors.v_vehicle_name_id}</Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>

              <Col lg={12}>
                <Card className="border">
                  <Card.Header className="bg-light">
                    <h6 className="mb-0">Vehicle Images</h6>
                  </Card.Header>
                  <Card.Body>
                    <Row className="g-3">
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label className="fs-6 fw-semibold">Front Image</Form.Label>
                          <Form.Control
                            name="vehicle_front_image"
                            type="file"
                            accept="image/*"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFileChange(e, setFieldValue, "vehicle_front_image", setPreviewFront)}
                            onBlur={handleBlur}
                            isInvalid={touched.vehicle_front_image && !!errors.vehicle_front_image}
                          />
                          {touched.vehicle_front_image && (errors as any).vehicle_front_image && (
                            <div className="text-danger small mt-1">{(errors as any).vehicle_front_image}</div>
                          )}
                        </Form.Group>
                      </Col>

                      <Col md={4}>
                        <Form.Group>
                          <Form.Label className="fs-6 fw-semibold">Back Image</Form.Label>
                          <Form.Control
                            name="vehicle_back_image"
                            type="file"
                            accept="image/*"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFileChange(e, setFieldValue, "vehicle_back_image", setPreviewBack)}
                            onBlur={handleBlur}
                            isInvalid={touched.vehicle_back_image && !!errors.vehicle_back_image}
                          />
                          {touched.vehicle_back_image && (errors as any).vehicle_back_image && (
                            <div className="text-danger small mt-1">{(errors as any).vehicle_back_image}</div>
                          )}
                        </Form.Group>
                      </Col>

                      <Col md={4}>
                        <Form.Group>
                          <Form.Label className="fs-6 fw-semibold">RC Image</Form.Label>
                          <Form.Control
                            name="vehicle_rc_image"
                            type="file"
                            accept="image/*"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFileChange(e, setFieldValue, "vehicle_rc_image", setPreviewRC)}
                            onBlur={handleBlur}
                            isInvalid={touched.vehicle_rc_image && !!errors.vehicle_rc_image}
                          />
                          {touched.vehicle_rc_image && (errors as any).vehicle_rc_image && (
                            <div className="text-danger small mt-1">{(errors as any).vehicle_rc_image}</div>
                          )}
                        </Form.Group>
                      </Col>

                      {/* previews */}
                      <Col md={12} className="d-flex gap-3 flex-wrap">
                        {previewFront && <Image src={previewFront} alt="Front" thumbnail style={{ maxWidth: 150 }} />}
                        {previewBack && <Image src={previewBack} alt="Back" thumbnail style={{ maxWidth: 150 }} />}
                        {previewRC && <Image src={previewRC} alt="RC" thumbnail style={{ maxWidth: 150 }} />}
                      </Col>

                      <Col md={4}>
                        <Form.Group>
                          <Form.Label className="fs-6 fw-semibold">RC Number <span className="text-danger">*</span></Form.Label>
                          <Form.Control type="text" name="vehicle_rc_number" value={values.vehicle_rc_number} onChange={handleChange} onBlur={handleBlur} isInvalid={touched.vehicle_rc_number && !!errors.vehicle_rc_number} placeholder="Enter vehicle RC number" />
                          <Form.Control.Feedback type="invalid">{errors.vehicle_rc_number}</Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col md={4}>
                        <Form.Group>
                          <Form.Label className="fs-6 fw-semibold">RC Expiry Date <span className="text-danger">*</span></Form.Label>
                          <Form.Control type="date" name="vehicle_exp_date" value={values.vehicle_exp_date} onChange={handleChange} onBlur={handleBlur} isInvalid={touched.vehicle_exp_date && !!errors.vehicle_exp_date} />
                          <Form.Control.Feedback type="invalid">{errors.vehicle_exp_date}</Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col md={4}>
                        <Form.Group>
                          <Form.Label className="fs-6 fw-semibold">Verify Type</Form.Label>
                          <Form.Select name="verify_type" value={values.verify_type} onChange={handleChange} onBlur={handleBlur} isInvalid={touched.verify_type && !!errors.verify_type}>
                            <option value="">Select verify type</option>
                            <option value="manual">Manual</option>
                            <option value="automated">Automated</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>

              {/* Details Documents */}
              <Col lg={12}>
                <Card className="border">
                  <Card.Header className="bg-light">
                    <h6 className="mb-0">Vehicle Details & Documents</h6>
                  </Card.Header>
                  <Card.Body>
                    <Row className="g-3">
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label className="fs-6 fw-semibold">Details Added Type</Form.Label>
                          <Form.Select
                            name="vehicle_details_added_type"
                            value={values.vehicle_details_added_type}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.vehicle_details_added_type && !!errors.vehicle_details_added_type}
                          >
                            <option value="">Select</option>
                            <option value="0">Self</option>
                            <option value="1">Partner</option>
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">{errors.vehicle_details_added_type}</Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col md={4}>
                        <Form.Group>
                          <Form.Label className="fs-6 fw-semibold">Details Added By</Form.Label>
                          <Form.Control
                            type="text"
                            name="vehicle_details_added_by"
                            value={values.vehicle_details_added_by}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.vehicle_details_added_by && !!errors.vehicle_details_added_by}
                            placeholder="Enter user / partner id"
                          />
                          <Form.Control.Feedback type="invalid">{errors.vehicle_details_added_by}</Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col md={4}>
                        <Form.Group>
                          <Form.Label className="fs-6 fw-semibold">Fitness Certificate</Form.Label>
                          <Form.Control
                            name="vehicle_details_fitness_certi_img"
                            type="file"
                            accept="image/*,application/pdf"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFileChange(e, setFieldValue, "vehicle_details_fitness_certi_img", setPreviewFitness)}
                            onBlur={handleBlur}
                            isInvalid={touched.vehicle_details_fitness_certi_img && !!errors.vehicle_details_fitness_certi_img}
                          />
                          {touched.vehicle_details_fitness_certi_img && (errors as any).vehicle_details_fitness_certi_img && (
                            <div className="text-danger small mt-1">{(errors as any).vehicle_details_fitness_certi_img}</div>
                          )}
                        </Form.Group>
                      </Col>

                      <Col md={4}>
                        <Form.Group>
                          <Form.Label className="fs-6 fw-semibold">Fitness Expiry</Form.Label>
                          <Form.Control type="date" name="vehicle_details_fitness_exp_date" value={values.vehicle_details_fitness_exp_date} onChange={handleChange} onBlur={handleBlur} />
                        </Form.Group>
                      </Col>

                      <Col md={4}>
                        <Form.Group>
                          <Form.Label className="fs-6 fw-semibold">Insurance</Form.Label>
                          <Form.Control
                            name="vehicle_details_insurance_img"
                            type="file"
                            accept="image/*,application/pdf"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFileChange(e, setFieldValue, "vehicle_details_insurance_img", setPreviewInsurance)}
                            onBlur={handleBlur}
                            isInvalid={touched.vehicle_details_insurance_img && !!errors.vehicle_details_insurance_img}
                          />
                          {touched.vehicle_details_insurance_img && (errors as any).vehicle_details_insurance_img && (
                            <div className="text-danger small mt-1">{(errors as any).vehicle_details_insurance_img}</div>
                          )}
                        </Form.Group>
                      </Col>

                      <Col md={4}>
                        <Form.Group>
                          <Form.Label className="fs-6 fw-semibold">Insurance Expiry</Form.Label>
                          <Form.Control type="date" name="vehicle_details_insurance_exp_date" value={values.vehicle_details_insurance_exp_date} onChange={handleChange} onBlur={handleBlur} />
                        </Form.Group>
                      </Col>

                      <Col md={4}>
                        <Form.Group>
                          <Form.Label className="fs-6 fw-semibold">Insurance Holder Name</Form.Label>
                          <Form.Control type="text" name="vehicle_details_insurance_holder_name" value={values.vehicle_details_insurance_holder_name} onChange={handleChange} onBlur={handleBlur} placeholder="Enter holder name" />
                        </Form.Group>
                      </Col>

                      <Col md={4}>
                        <Form.Group>
                          <Form.Label className="fs-6 fw-semibold">Pollution Certificate</Form.Label>
                          <Form.Control
                            name="vehicle_details_pollution_img"
                            type="file"
                            accept="image/*,application/pdf"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFileChange(e, setFieldValue, "vehicle_details_pollution_img", setPreviewPollution)}
                            onBlur={handleBlur}
                            isInvalid={touched.vehicle_details_pollution_img && !!errors.vehicle_details_pollution_img}
                          />
                          {touched.vehicle_details_pollution_img && (errors as any).vehicle_details_pollution_img && (
                            <div className="text-danger small mt-1">{(errors as any).vehicle_details_pollution_img}</div>
                          )}
                        </Form.Group>
                      </Col>

                      <Col md={12}>
                        <div className="d-flex gap-3 flex-wrap">
                          {previewFitness && <Image src={previewFitness} alt="Fitness" thumbnail style={{ maxWidth: 150 }} />}
                          {previewInsurance && <Image src={previewInsurance} alt="Insurance" thumbnail style={{ maxWidth: 150 }} />}
                          {previewPollution && <Image src={previewPollution} alt="Pollution" thumbnail style={{ maxWidth: 150 }} />}
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>

              {/* Action Buttons */}
              <Col lg={12}>
                <div className="d-flex gap-2 justify-content-end">
                  <button className="px-3 border-0 rounded text-black" onClick={() => navigate("/ambulance/vehicle")} disabled={submitting}>
                    Cancel
                  </button>
                  <Button variant="primary" type="submit" disabled={submitting}>
                    {submitting ? (isEditMode ? "Updating..." : "Saving...") : isEditMode ? "Update Vehicle" : "Save Vehicle"}
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
        )}
      </Formik>
    </ComponentCard>
  );
};

export default AddVehicle;