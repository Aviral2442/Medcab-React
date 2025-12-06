import React, { useEffect, useState } from "react";
import { Form, Button, Row, Col, Card, Image, Alert } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import * as Yup from "yup";
import { Formik } from "formik";
import SnowEditor from "@/views/forms/editors";
import ComponentCard from "@/components/ComponentCard";

const cityValidationSchema = Yup.object().shape({
  city_name: Yup.string().required("Name is required"),
  city_title_sku: Yup.string().required("Sku is required"),
  city_title: Yup.string().required("Title is required"),
  city_heading: Yup.string().required("Heading is required"),
  city_meta_title: Yup.string().required("Meta Title is required"),
  city_meta_keyword: Yup.string().required("Meta Keywords is required"),
  city_meta_desc: Yup.string().required("Meta Description is required"),
  city_body_desc: Yup.string().required("Body Description is required"),
  city_why_choose_us: Yup.string().required("Why Choose Us is required"),
  why_choose_meta_desc: Yup.string().required(
    "Why Choose Meta Description is required"
  ),
  city_block1_heading: Yup.string().required("Block 1 Heading is required"),
  city_block1_body: Yup.string().required("Block 1 Body is required"),
  city_block2_heading: Yup.string().required("Block 2 Heading is required"),
  city_block2_body: Yup.string().required("Block 2 Body is required"),
  city_block3_heading: Yup.string().required("Block 3 Heading is required"),
  city_block3_body: Yup.string().required("Block 3 Body is required"),
  city_thumbnail_alt: Yup.string().required("Thumbnail Alt Text is required"),
  city_thumbnail_title: Yup.string().required("Thumbnail Title is required"),
  city_force_keyword: Yup.string().required("Force Keyword is required"),
  city_faq_heading: Yup.string().required("FAQ Heading is required"),
  city_faq_desc: Yup.string().required("FAQ Description is required"),
  city_emergency_heading: Yup.string().required(
    "Emergency Heading is required"
  ),
  city_emergency_desc: Yup.string().required(
    "Emergency Description is required"
  ),
});

const pathologyCityValidationSchema = Yup.object().shape({
  city_pathology_name: Yup.string().required("Name is required"),
  city_pathology_title_sku: Yup.string().required("Sku is required"),
  city_pathology_title: Yup.string().required("Title is required"),
  city_pathology_heading: Yup.string().required("Heading is required"),
  city_pathology_body_desc: Yup.string().required(
    "Body Description is required"
  ),
  city_pathology_why_choose_us: Yup.string().required(
    "Why Choose Us is required"
  ),
  city_pathology_block1_heading: Yup.string().required(
    "Block 1 Heading is required"
  ),
  city_pathology_block1_body: Yup.string().required("Block 1 Body is required"),
  city_pathology_block2_heading: Yup.string().required(
    "Block 2 Heading is required"
  ),
  city_pathology_block2_body: Yup.string().required("Block 2 Body is required"),
  city_pathology_block3_heading: Yup.string().required(
    "Block 3 Heading is required"
  ),
  city_pathology_block3_body: Yup.string().required("Block 3 Body is required"),
  city_pathology_thumbnail_alt: Yup.string().required(
    "Thumbnail Alt Text is required"
  ),
  city_pathology_thumbnail_title: Yup.string().required(
    "Thumbnail Title is required"
  ),
  city_pathology_meta_title: Yup.string().required("Meta Title is required"),
  city_pathology_meta_desc: Yup.string().required(
    "Meta Description is required"
  ),
  city_pathology_meta_keyword: Yup.string().required(
    "Meta Keywords is required"
  ),
  city_pathology_force_keyword: Yup.string().required(
    "Force Keyword is required"
  ),
  city_pathology_faq_heading: Yup.string().required("FAQ Heading is required"),
  city_pathology_faq_desc: Yup.string().required("FAQ Description is required"),
  city_pathology_emergency_heading: Yup.string().required(
    "Emergency Heading is required"
  ),
  city_pathology_emergency_desc: Yup.string().required(
    "Emergency Description is required"
  ),
});

interface AddCityProps {
  mode?: "add" | "edit";
  data?: any;
  onCancel?: () => void;
  onDataChanged?: () => void;
  sectionId?: number;
}

// Map section names to their IDs
const sectionMap: Record<string, number> = {
  ambulance: 1,
  manpower: 2,
  "video-consultation": 3,
  pathology: 4,
};

const AddCity: React.FC<AddCityProps> = ({
  mode,
  data,
  onCancel,
  onDataChanged,
  sectionId: propSectionId,
}) => {
  const navigate = useNavigate();
  const { id, section } = useParams();

  // Determine sectionId from props or URL params
  const sectionId = propSectionId ?? (section ? sectionMap[section] || 1 : 1);

  const isEditMode = mode === "edit" || Boolean(id);
  const baseURL = (import.meta as any).env?.VITE_PATH ?? "";

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cityData, setCityData] = useState([]);

  const [initialValues, setInitialValues] = useState({
    city_thumbnail: null as File | null,
    city_name: "",
    city_title_sku: "",
    city_title: "",
    city_heading: "",
    city_body_desc: "",
    city_why_choose_us: "",
    why_choose_meta_desc: "",
    city_block1_heading: "",
    city_block1_body: "",
    city_block2_heading: "",
    city_block2_body: "",
    city_block3_heading: "",
    city_block3_body: "",
    city_thumbnail_alt: "",
    city_thumbnail_title: "",
    city_meta_title: "",
    city_meta_desc: "",
    city_meta_keyword: "",
    city_force_keyword: "",
    city_faq_heading: "",
    city_faq_desc: "",
    city_emergency_heading: "",
    city_emergency_desc: "",
  });

  const [pathologyInitialValues, setPathologyInitialValues] = useState({
    city_pathology_thumbnail: null as File | null,
    city_pathology_name: "",
    city_pathology_title_sku: "",
    city_pathology_title: "",
    city_pathology_heading: "",
    city_pathology_body_desc: "",
    city_pathology_why_choose_us: "",
    why_choose_meta_desc: "",
    city_pathology_block1_heading: "",
    city_pathology_block1_body: "",
    city_pathology_block2_heading: "",
    city_pathology_block2_body: "",
    city_pathology_block3_heading: "",
    city_pathology_block3_body: "",
    city_pathology_thumbnail_alt: "",
    city_pathology_thumbnail_title: "",
    city_pathology_meta_title: "",
    city_pathology_meta_desc: "",
    city_pathology_meta_keyword: "",
    city_pathology_force_keyword: "",
    city_pathology_faq_heading: "",
    city_pathology_faq_desc: "",
    city_pathology_emergency_heading: "",
    city_pathology_emergency_desc: "",
  });

  useEffect(() => {
    fetchCityContent();
    if (isEditMode) {
      if (id) {
        fetchCityDetails();
      } else if (data) {
        loadDataFromProps();
      }
    }
  }, [id, data, sectionId]);

  const fetchCityContent = async () => {
    try {
      const res = await axios.get(`${baseURL}/content_writer/get_city_content`);
      setCityData(res.data?.jsonData?.city_content_list || []);
    } catch (err) {
      console.error("Error fetching City Content:", err);
    }
  };

  const loadDataFromProps = () => {
    if (data) {
      if (sectionId === 4) {
        setPathologyInitialValues({
          city_pathology_thumbnail: null,
          city_pathology_name: data.city_pathology_name || "",
          city_pathology_title_sku: data.city_pathology_title_sku || "",
          city_pathology_title: data.city_pathology_title || "",
          city_pathology_heading: data.city_pathology_heading || "",
          city_pathology_body_desc: data.city_pathology_body_desc || "",
          city_pathology_why_choose_us: data.city_pathology_why_choose_us || "",
          why_choose_meta_desc: data.why_choose_meta_desc || "",
          city_pathology_block1_heading:
            data.city_pathology_block1_heading || "",
          city_pathology_block1_body: data.city_pathology_block1_body || "",
          city_pathology_block2_heading:
            data.city_pathology_block2_heading || "",
          city_pathology_block2_body: data.city_pathology_block2_body || "",
          city_pathology_block3_heading:
            data.city_pathology_block3_heading || "",
          city_pathology_block3_body: data.city_pathology_block3_body || "",
          city_pathology_thumbnail_alt: data.city_pathology_thumbnail_alt || "",
          city_pathology_thumbnail_title:
            data.city_pathology_thumbnail_title || "",
          city_pathology_meta_title: data.city_pathology_meta_title || "",
          city_pathology_meta_desc: data.city_pathology_meta_desc || "",
          city_pathology_meta_keyword: data.city_pathology_meta_keyword || "",
          city_pathology_force_keyword: data.city_pathology_force_keyword || "",
          city_pathology_faq_heading: data.city_pathology_faq_heading || "",
          city_pathology_faq_desc: data.city_pathology_faq_desc || "",
          city_pathology_emergency_heading:
            data.city_pathology_emergency_heading || "",
          city_pathology_emergency_desc:
            data.city_pathology_emergency_desc || "",
        });
        if (data.city_pathology_thumbnail) {
          setPreviewImage(`${baseURL}/${data.city_pathology_thumbnail}`);
        }
      } else {
        setInitialValues({
          city_thumbnail: null,
          city_name: data.city_name || "",
          city_title_sku: data.city_title_sku || "",
          city_title: data.city_title || "",
          city_heading: data.city_heading || "",
          city_body_desc: data.city_body_desc || "",
          city_why_choose_us: data.city_why_choose_us || "",
          why_choose_meta_desc: data.why_choose_meta_desc || "",
          city_block1_heading: data.city_block1_heading || "",
          city_block1_body: data.city_block1_body || "",
          city_block2_heading: data.city_block2_heading || "",
          city_block2_body: data.city_block2_body || "",
          city_block3_heading: data.city_block3_heading || "",
          city_block3_body: data.city_block3_body || "",
          city_thumbnail_alt: data.city_thumbnail_alt || "",
          city_thumbnail_title: data.city_thumbnail_title || "",
          city_meta_title: data.city_meta_title || "",
          city_meta_desc: data.city_meta_desc || "",
          city_meta_keyword: data.city_meta_keyword || "",
          city_force_keyword: data.city_force_keyword || "",
          city_faq_heading: data.city_faq_heading || "",
          city_faq_desc: data.city_faq_desc || "",
          city_emergency_heading: data.city_emergency_heading || "",
          city_emergency_desc: data.city_emergency_desc || "",
        });
        if (data.city_thumbnail) {
          setPreviewImage(`${baseURL}/${data.city_thumbnail}`);
        }
      }
    }
  };

  const fetchCityDetails = async () => {
    setLoading(true);
    try {
      let endpoint = "";
      switch (sectionId) {
        case 1:
          endpoint = `/content_writer/fetch_city_content/${id}`;
          break;
        case 2:
          endpoint = `/content_writer/fetch_manpower_city_content/${id}`;
          break;
        case 3:
          endpoint = `/content_writer/fetch_video_consult_city_content/${id}`;
          break;
        case 4:
          endpoint = `/content_writer/fetch_pathology_city_content/${id}`;
          break;
        default:
          endpoint = `/content_writer/fetch_city_content/${id}`;
      }

      const response = await axios.get(`${baseURL}${endpoint}`);
      console.log("Full response:", response.data);

      if (sectionId === 4) {
        // Handle pathology section
        const city = response.data?.jsonData?.city_pathology_content;

        if (!city) {
          console.error(
            "Pathology city content not found. Available keys:",
            Object.keys(response.data?.jsonData || {})
          );
          throw new Error("Pathology city content not found in response");
        }

        setPathologyInitialValues({
          city_pathology_thumbnail: null,
          city_pathology_name: city.city_pathology_name || "",
          city_pathology_title_sku: city.city_pathology_title_sku || "",
          city_pathology_title: city.city_pathology_title || "",
          city_pathology_heading: city.city_pathology_heading || "",
          city_pathology_body_desc: city.city_pathology_body_desc || "",
          city_pathology_why_choose_us: city.city_pathology_why_choose_us || "",
          why_choose_meta_desc: city.why_choose_meta_desc || "",
          city_pathology_block1_heading:
            city.city_pathology_block1_heading || "",
          city_pathology_block1_body: city.city_pathology_block1_body || "",
          city_pathology_block2_heading:
            city.city_pathology_block2_heading || "",
          city_pathology_block2_body: city.city_pathology_block2_body || "",
          city_pathology_block3_heading:
            city.city_pathology_block3_heading || "",
          city_pathology_block3_body: city.city_pathology_block3_body || "",
          city_pathology_thumbnail_alt: city.city_pathology_thumbnail_alt || "",
          city_pathology_thumbnail_title:
            city.city_pathology_thumbnail_title || "",
          city_pathology_meta_title: city.city_pathology_meta_title || "",
          city_pathology_meta_desc: city.city_pathology_meta_desc || "",
          city_pathology_meta_keyword: city.city_pathology_meta_keyword || "",
          city_pathology_force_keyword: city.city_pathology_force_keyword || "",
          city_pathology_faq_heading: city.city_pathology_faq_heading || "",
          city_pathology_faq_desc: city.city_pathology_faq_desc || "",
          city_pathology_emergency_heading:
            city.city_pathology_emergency_heading || "",
          city_pathology_emergency_desc:
            city.city_pathology_emergency_desc || "",
        });

        if (city.city_pathology_thumbnail) {
          setPreviewImage(`${baseURL}/${city.city_pathology_thumbnail}`);
        }
      } else {
        let city;
        const jsonData = response.data?.jsonData;

        if (sectionId === 1) {
          city = jsonData?.city_content;
        } else if (sectionId === 2) {
          city = jsonData?.city_manpower_content;
        } else if (sectionId === 3) {
          city = jsonData?.city_video_consultancy_content;
        }

        if (!city) {
          console.error(
            "City content not found. Available keys:",
            Object.keys(jsonData || {})
          );
          console.error("Full jsonData:", jsonData);
          throw new Error("City content not found in response");
        }

        setInitialValues({
          city_thumbnail: null,
          city_name: city.city_name || "",
          city_title_sku: city.city_title_sku || "",
          city_title: city.city_title || "",
          city_heading: city.city_heading || "",
          city_body_desc: city.city_body_desc || "",
          city_why_choose_us: city.city_why_choose_us || "",
          why_choose_meta_desc: city.why_choose_meta_desc || "",
          city_block1_heading: city.city_block1_heading || "",
          city_block1_body: city.city_block1_body || "",
          city_block2_heading: city.city_block2_heading || "",
          city_block2_body: city.city_block2_body || "",
          city_block3_heading: city.city_block3_heading || "",
          city_block3_body: city.city_block3_body || "",
          city_thumbnail_alt: city.city_thumbnail_alt || "",
          city_thumbnail_title: city.city_thumbnail_title || "",
          city_meta_title: city.city_meta_title || "",
          city_meta_desc: city.city_meta_desc || "",
          city_meta_keyword: city.city_meta_keyword || "",
          city_force_keyword: city.city_force_keyword || "",
          city_faq_heading: city.city_faq_heading || "",
          city_faq_desc: city.city_faq_desc || "",
          city_emergency_heading: city.city_emergency_heading || "",
          city_emergency_desc: city.city_emergency_desc || "",
        });

        if (city.city_thumbnail) {
          setPreviewImage(`${baseURL}/${city.city_thumbnail}`);
        }
      }
    } catch (err: any) {
      console.error("Error fetching city details:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to fetch city details"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: any,
    fieldName: string
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setFieldValue(fieldName, file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (values: any) => {
    setSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();

      // Get thumbnail field name based on section
      const thumbnailField =
        sectionId === 4 ? "city_pathology_thumbnail" : "city_thumbnail";

      // Add thumbnail if present
      if (values[thumbnailField]) {
        formData.append("city_thumbnail", values[thumbnailField]);
      }

      // Add all other fields
      Object.keys(values).forEach((key) => {
        if (
          key !== thumbnailField &&
          values[key] !== null &&
          values[key] !== undefined
        ) {
          formData.append(key, values[key]);
        }
      });

      let response;
      const cityId = id || data?.city_id || data?.city_pathology_id;

      let apiEndpoint = "";
      if (isEditMode && cityId) {
        switch (sectionId) {
          case 1:
            apiEndpoint = `/content_writer/edit_city_content/${cityId}`;
            break;
          case 2:
            apiEndpoint = `/content_writer/edit_manpower_city_content/${cityId}`;
            break;
          case 3:
            apiEndpoint = `/content_writer/edit_video_consult_city_content/${cityId}`;
            break;
          case 4:
            apiEndpoint = `/content_writer/edit_pathology_city_content/${cityId}`;
            break;
          default:
            apiEndpoint = `/content_writer/edit_city_content/${cityId}`;
        }
        response = await axios.put(`${baseURL}${apiEndpoint}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        switch (sectionId) {
          case 1:
            apiEndpoint = `/content_writer/add_city_content`;
            break;
          case 2:
            apiEndpoint = `/content_writer/add_manpower_city_content`;
            break;
          case 3:
            apiEndpoint = `/content_writer/add_video_consult_city_content`;
            break;
          case 4:
            apiEndpoint = `/content_writer/add_pathology_city_content`;
            break;
          default:
            apiEndpoint = `/content_writer/add_city_content`;
        }
        response = await axios.post(`${baseURL}${apiEndpoint}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      if (response.data.status === 201 || response.data.status === 200) {
        if (onDataChanged) {
          onDataChanged();
        }

        if (onCancel) {
          onCancel();
        } else {
          const routeMap: Record<number, string> = {
            1: "/city/ambulance",
            2: "/city/manpower",
            3: "/city/video-consultation",
            4: "/city/pathology",
          };
          navigate(routeMap[sectionId] || "/city/ambulance");
        }
      }
    } catch (err: any) {
      console.error(`Error ${isEditMode ? "updating" : "adding"} city:`, err);
      setError(
        err.response?.data?.message ||
          `Failed to ${isEditMode ? "update" : "add"} city`
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      // Navigate back to correct section
      const routeMap: Record<number, string> = {
        1: "/city/ambulance",
        2: "/city/manpower",
        3: "/city/video-consultation",
        4: "/city/pathology",
      };
      navigate(routeMap[sectionId] || "/city/ambulance");
    }
  };

  if (loading) {
    return (
      <ComponentCard
        title={isEditMode ? "Edit City Content" : "Add New City Content"}
        className="m-2"
      >
        <div className="text-center py-4">Loading city details...</div>
      </ComponentCard>
    );
  }

  // Helper function to get field name based on section
  const getFieldName = (baseName: string) => {
    // Special case for why_choose_meta_desc - same field name for all sections
    if (baseName === "why_choose_meta_desc") {
      return "why_choose_meta_desc";
    }

    if (sectionId === 4) {
      // For pathology section, convert city_ prefix to city_pathology_
      if (baseName.startsWith("city_")) {
        return baseName.replace("city_", "city_pathology_");
      }
      return `city_pathology_${baseName}`;
    }
    return baseName;
  };

  return (
    <div className="">
      <ComponentCard
        title={isEditMode ? "Edit City Content" : "Add New City Content"}
        className="m-2"
      >
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Formik
          initialValues={
            sectionId === 4 ? pathologyInitialValues : initialValues
          }
          validationSchema={
            sectionId === 4
              ? pathologyCityValidationSchema
              : cityValidationSchema
          }
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
          }) => {
            // Helper to get field value - uses the actual field name in values
            const getFieldValue = (baseName: string) => {
              const fieldName = getFieldName(baseName);
              return (values as any)[fieldName] ?? "";
            };

            // Helper to get field error
            const getFieldError = (baseName: string) => {
              const fieldName = getFieldName(baseName);
              return (errors as any)[fieldName];
            };

            // Helper to get field touched state
            const getFieldTouched = (baseName: string) => {
              const fieldName = getFieldName(baseName);
              return (touched as any)[fieldName];
            };

            return (
              <Form onSubmit={handleSubmit} className="compact-form">
                <Row className="g-3">
                  {/* Basic Information */}
                  <Col lg={12}>
                    <Card className="border">
                      <Card.Header className="bg-light">
                        <h6 className="mb-0">Basic Information</h6>
                      </Card.Header>
                      <Card.Body>
                        <Row className="g-3">
                          <Col md={12}>
                            <Form.Group>
                              <Form.Label className="fs-6 fw-semibold">
                                City Title{" "}
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <Form.Control
                                type="text"
                                name={getFieldName("city_title")}
                                value={getFieldValue("city_title")}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={
                                  getFieldTouched("city_title") &&
                                  !!getFieldError("city_title")
                                }
                                placeholder="Enter city title"
                              />
                              <Form.Control.Feedback type="invalid">
                                {getFieldError("city_title")}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>

                          <Col md={6}>
                            <Form.Group>
                              <Form.Label className="fs-6 fw-semibold">
                                City Name <span className="text-danger">*</span>
                              </Form.Label>
                              <Form.Select
                                name={getFieldName("city_name")}
                                value={getFieldValue("city_name")}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={
                                  getFieldTouched("city_name") &&
                                  !!getFieldError("city_name")
                                }
                              >
                                <option value="">Select City</option>
                                {cityData.map((city: any) => (
                                  <option
                                    key={city.city_id}
                                    value={city.city_name}
                                  >
                                    {city.city_name}
                                  </option>
                                ))}
                              </Form.Select>
                              <Form.Control.Feedback type="invalid">
                                {getFieldError("city_name")}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>

                          <Col md={6}>
                            <Form.Group>
                              <Form.Label className="fs-6 fw-semibold">
                                City Title SKU{" "}
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <Form.Control
                                type="text"
                                name={getFieldName("city_title_sku")}
                                value={getFieldValue("city_title_sku")}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={
                                  getFieldTouched("city_title_sku") &&
                                  !!getFieldError("city_title_sku")
                                }
                                placeholder="Enter city title SKU/slug"
                              />
                              <Form.Control.Feedback type="invalid">
                                {getFieldError("city_title_sku")}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>

                          <Col md={6}>
                            <Form.Group>
                              <Form.Label className="fs-6 fw-semibold">
                                Thumbnail Alt Text{" "}
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <Form.Control
                                type="text"
                                name={getFieldName("city_thumbnail_alt")}
                                value={getFieldValue("city_thumbnail_alt")}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={
                                  getFieldTouched("city_thumbnail_alt") &&
                                  !!getFieldError("city_thumbnail_alt")
                                }
                                placeholder="Enter thumbnail alt text"
                              />
                              <Form.Control.Feedback type="invalid">
                                {getFieldError("city_thumbnail_alt")}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>

                          <Col md={6}>
                            <Form.Group>
                              <Form.Label className="fs-6 fw-semibold">
                                Thumbnail Title{" "}
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <Form.Control
                                type="text"
                                name={getFieldName("city_thumbnail_title")}
                                value={getFieldValue("city_thumbnail_title")}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={
                                  getFieldTouched("city_thumbnail_title") &&
                                  !!getFieldError("city_thumbnail_title")
                                }
                                placeholder="Enter thumbnail title"
                              />
                              <Form.Control.Feedback type="invalid">
                                {getFieldError("city_thumbnail_title")}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>

                          <Col lg={10}>
                            <Card className="border">
                              <Card.Body>
                                <Form.Group>
                                  <Form.Label className="fs-6 fw-semibold">
                                    City Thumbnail{" "}
                                    {!isEditMode && (
                                      <span className="text-danger">*</span>
                                    )}
                                  </Form.Label>
                                  <Form.Control
                                    type="file"
                                    accept="image/*"
                                    onChange={(
                                      e: React.ChangeEvent<HTMLInputElement>
                                    ) =>
                                      handleImageChange(
                                        e,
                                        setFieldValue,
                                        getFieldName("city_thumbnail")
                                      )
                                    }
                                    onBlur={handleBlur}
                                  />
                                  {isEditMode && (
                                    <Form.Text className="text-muted">
                                      Leave empty to keep current image
                                    </Form.Text>
                                  )}
                                </Form.Group>
                              </Card.Body>
                            </Card>
                          </Col>

                          <Col lg={2}>
                            {previewImage && (
                              <div>
                                <Image
                                  src={previewImage}
                                  alt="Preview"
                                  thumbnail
                                  style={{
                                    maxWidth: "182px",
                                    maxHeight: "200px",
                                  }}
                                />
                              </div>
                            )}
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  </Col>

                  {/* Content Blocks */}
                  <Col lg={12}>
                    <Card className="border">
                      <Card.Header className="bg-light">
                        <h6 className="mb-0">Main Body Content</h6>
                      </Card.Header>
                      <Card.Body>
                        <Row className="g-3">
                          <Col md={6}>
                            <Form.Group>
                              <Form.Label className="fs-6 fw-semibold">
                                City Heading{" "}
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <Form.Control
                                type="text"
                                name={getFieldName("city_heading")}
                                value={getFieldValue("city_heading")}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={
                                  getFieldTouched("city_heading") &&
                                  !!getFieldError("city_heading")
                                }
                                placeholder="Enter city heading"
                              />
                              <Form.Control.Feedback type="invalid">
                                {getFieldError("city_heading")}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>

                          <Col md={12}>
                            <Form.Group>
                              <Form.Label className="fs-6 fw-semibold">
                                Body Description{" "}
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <SnowEditor
                                value={getFieldValue("city_body_desc")}
                                onChange={(value: string) =>
                                  setFieldValue(
                                    getFieldName("city_body_desc"),
                                    value
                                  )
                                }
                              />
                              {getFieldTouched("city_body_desc") &&
                                getFieldError("city_body_desc") && (
                                  <div className="text-danger small mt-1">
                                    {getFieldError("city_body_desc")}
                                  </div>
                                )}
                            </Form.Group>
                          </Col>

                          <Col md={12}>
                            <Form.Group>
                              <Form.Label className="fs-6 fw-semibold">
                                Section 1 Heading{" "}
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <Form.Control
                                type="text"
                                name={getFieldName("city_block1_heading")}
                                value={getFieldValue("city_block1_heading")}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={
                                  getFieldTouched("city_block1_heading") &&
                                  !!getFieldError("city_block1_heading")
                                }
                                placeholder="Enter block 1 heading"
                              />
                              <Form.Control.Feedback type="invalid">
                                {getFieldError("city_block1_heading")}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>

                          <Col md={12}>
                            <Form.Group>
                              <Form.Label className="fs-6 fw-semibold">
                                Section 1 Description{" "}
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <Form.Control
                                as="textarea"
                                rows={3}
                                name={getFieldName("city_block1_body")}
                                value={getFieldValue("city_block1_body")}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={
                                  getFieldTouched("city_block1_body") &&
                                  !!getFieldError("city_block1_body")
                                }
                                placeholder="Enter block 1 description"
                              />
                              <Form.Control.Feedback type="invalid">
                                {getFieldError("city_block1_body")}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>

                          <Col md={12}>
                            <Form.Group>
                              <Form.Label className="fs-6 fw-semibold">
                                Section 2 Heading{" "}
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <Form.Control
                                type="text"
                                name={getFieldName("city_block2_heading")}
                                value={getFieldValue("city_block2_heading")}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={
                                  getFieldTouched("city_block2_heading") &&
                                  !!getFieldError("city_block2_heading")
                                }
                                placeholder="Enter block 2 heading"
                              />
                              <Form.Control.Feedback type="invalid">
                                {getFieldError("city_block2_heading")}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>

                          <Col md={12}>
                            <Form.Group>
                              <Form.Label className="fs-6 fw-semibold">
                                Section 2 Description{" "}
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <Form.Control
                                as="textarea"
                                rows={3}
                                name={getFieldName("city_block2_body")}
                                value={getFieldValue("city_block2_body")}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={
                                  getFieldTouched("city_block2_body") &&
                                  !!getFieldError("city_block2_body")
                                }
                                placeholder="Enter block 2 description"
                              />
                              <Form.Control.Feedback type="invalid">
                                {getFieldError("city_block2_body")}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>

                          <Col md={12}>
                            <Form.Group>
                              <Form.Label className="fs-6 fw-semibold">
                                Section 3 Heading{" "}
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <Form.Control
                                type="text"
                                name={getFieldName("city_block3_heading")}
                                value={getFieldValue("city_block3_heading")}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={
                                  getFieldTouched("city_block3_heading") &&
                                  !!getFieldError("city_block3_heading")
                                }
                                placeholder="Enter block 3 heading"
                              />
                              <Form.Control.Feedback type="invalid">
                                {getFieldError("city_block3_heading")}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>

                          <Col md={12}>
                            <Form.Group>
                              <Form.Label className="fs-6 fw-semibold">
                                Section 3 Description{" "}
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <SnowEditor
                                value={getFieldValue("city_block3_body")}
                                onChange={(value: string) =>
                                  setFieldValue(
                                    getFieldName("city_block3_body"),
                                    value
                                  )
                                }
                              />
                              {getFieldTouched("city_block3_body") &&
                                getFieldError("city_block3_body") && (
                                  <div className="text-danger small mt-1">
                                    {getFieldError("city_block3_body")}
                                  </div>
                                )}
                            </Form.Group>
                          </Col>

                          <Col md={12}>
                            <Form.Group>
                              <Form.Label className="fs-6 fw-semibold">
                                Why Choose Us{" "}
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <Form.Control
                                type="text"
                                name={getFieldName("city_why_choose_us")}
                                value={getFieldValue("city_why_choose_us")}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={
                                  getFieldTouched("city_why_choose_us") &&
                                  !!getFieldError("city_why_choose_us")
                                }
                                placeholder="Enter why choose us heading"
                              />
                              <Form.Control.Feedback type="invalid">
                                {getFieldError("city_why_choose_us")}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>

                          <Col md={12}>
                            <Form.Group>
                              <Form.Label className="fs-6 fw-semibold">
                                Why Choose Description{" "}
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <SnowEditor
                                value={getFieldValue("why_choose_meta_desc")}
                                onChange={(value: string) =>
                                  setFieldValue("why_choose_meta_desc", value)
                                }
                              />
                              {getFieldTouched("why_choose_meta_desc") &&
                                getFieldError("why_choose_meta_desc") && (
                                  <div className="text-danger small mt-1">
                                    {getFieldError("why_choose_meta_desc")}
                                  </div>
                                )}
                            </Form.Group>
                          </Col>

                          <Col md={12}>
                            <Form.Group>
                              <Form.Label className="fs-6 fw-semibold">
                                Emergency Heading{" "}
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <Form.Control
                                type="text"
                                name={getFieldName("city_emergency_heading")}
                                value={getFieldValue("city_emergency_heading")}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={
                                  getFieldTouched("city_emergency_heading") &&
                                  !!getFieldError("city_emergency_heading")
                                }
                                placeholder="Enter emergency heading"
                              />
                              <Form.Control.Feedback type="invalid">
                                {getFieldError("city_emergency_heading")}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>

                          <Col md={12}>
                            <Form.Group>
                              <Form.Label className="fs-6 fw-semibold">
                                Emergency Description{" "}
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <SnowEditor
                                value={getFieldValue("city_emergency_desc")}
                                onChange={(value: string) =>
                                  setFieldValue(
                                    getFieldName("city_emergency_desc"),
                                    value
                                  )
                                }
                              />
                              {getFieldTouched("city_emergency_desc") &&
                                getFieldError("city_emergency_desc") && (
                                  <div className="text-danger small mt-1">
                                    {getFieldError("city_emergency_desc")}
                                  </div>
                                )}
                            </Form.Group>
                          </Col>

                          <Col md={12}>
                            <Form.Group>
                              <Form.Label className="fs-6 fw-semibold">
                                FAQ Heading{" "}
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <Form.Control
                                type="text"
                                name={getFieldName("city_faq_heading")}
                                value={getFieldValue("city_faq_heading")}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={
                                  getFieldTouched("city_faq_heading") &&
                                  !!getFieldError("city_faq_heading")
                                }
                                placeholder="Enter FAQ heading"
                              />
                              <Form.Control.Feedback type="invalid">
                                {getFieldError("city_faq_heading")}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>

                          <Col md={12}>
                            <Form.Group>
                              <Form.Label className="fs-6 fw-semibold">
                                FAQ Description{" "}
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <Form.Control
                                as="textarea"
                                rows={3}
                                name={getFieldName("city_faq_desc")}
                                value={getFieldValue("city_faq_desc")}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={
                                  getFieldTouched("city_faq_desc") &&
                                  !!getFieldError("city_faq_desc")
                                }
                                placeholder="Enter FAQ description"
                              />
                              <Form.Control.Feedback type="invalid">
                                {getFieldError("city_faq_desc")}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  </Col>

                  {/* SEO Information */}
                  <Col lg={12}>
                    <Card className="border">
                      <Card.Header className="bg-light">
                        <h6 className="mb-0">SEO Information</h6>
                      </Card.Header>
                      <Card.Body>
                        <Row className="g-3">
                          <Col md={12}>
                            <Form.Group>
                              <Form.Label className="fs-6 fw-semibold">
                                Meta Title{" "}
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <Form.Control
                                type="text"
                                name={getFieldName("city_meta_title")}
                                value={getFieldValue("city_meta_title")}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={
                                  getFieldTouched("city_meta_title") &&
                                  !!getFieldError("city_meta_title")
                                }
                                placeholder="Enter meta title"
                              />
                              <Form.Control.Feedback type="invalid">
                                {getFieldError("city_meta_title")}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>

                          <Col md={6}>
                            <Form.Group>
                              <Form.Label className="fs-6 fw-semibold">
                                Meta Keywords{" "}
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <Form.Control
                                as="textarea"
                                rows={3}
                                name={getFieldName("city_meta_keyword")}
                                value={getFieldValue("city_meta_keyword")}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={
                                  getFieldTouched("city_meta_keyword") &&
                                  !!getFieldError("city_meta_keyword")
                                }
                                placeholder="Enter meta keywords"
                              />
                              <Form.Control.Feedback type="invalid">
                                {getFieldError("city_meta_keyword")}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>

                          <Col md={6}>
                            <Form.Group>
                              <Form.Label className="fs-6 fw-semibold">
                                Force Keywords{" "}
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <Form.Control
                                as="textarea"
                                rows={3}
                                name={getFieldName("city_force_keyword")}
                                value={getFieldValue("city_force_keyword")}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={
                                  getFieldTouched("city_force_keyword") &&
                                  !!getFieldError("city_force_keyword")
                                }
                                placeholder="Enter force keywords"
                              />
                              <Form.Control.Feedback type="invalid">
                                {getFieldError("city_force_keyword")}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>

                          <Col md={12}>
                            <Form.Group>
                              <Form.Label className="fs-6 fw-semibold">
                                Meta Description{" "}
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <Form.Control
                                as="textarea"
                                rows={5}
                                name={getFieldName("city_meta_desc")}
                                value={getFieldValue("city_meta_desc")}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={
                                  getFieldTouched("city_meta_desc") &&
                                  !!getFieldError("city_meta_desc")
                                }
                                placeholder="Enter meta description"
                              />
                              <Form.Control.Feedback type="invalid">
                                {getFieldError("city_meta_desc")}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  </Col>

                  {/* Action Buttons */}
                  <Col lg={12}>
                    <div className="d-flex gap-2 justify-content-end">
                      <button
                        type="button"
                        className="px-3 rounded text-black"
                        onClick={handleCancel}
                        disabled={submitting}
                      >
                        Cancel
                      </button>
                      <Button
                        variant="primary"
                        type="submit"
                        disabled={submitting}
                      >
                        {submitting
                          ? isEditMode
                            ? "Updating..."
                            : "Saving..."
                          : isEditMode
                          ? "Update City"
                          : "Save City"}
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Form>
            );
          }}
        </Formik>
      </ComponentCard>
    </div>
  );
};

export default AddCity;

/*

  city_pathology_name
  city_pathology_title_sku
  city_pathology_title
  city_pathology_heading
  city_pathology_body_desc
  city_pathology_why_choose_us
  city_pathology_block1_heading
  city_pathology_block1_body
  city_pathology_block2_heading
  city_pathology_block2_body
  city_pathology_block3_heading
  city_pathology_block3_body
  city_pathology_thumbnail
  city_pathology_thumbnail_alt
  city_pathology_thumbnail_title
  city_pathology_meta_title
  city_pathology_meta_desc
  city_pathology_meta_keyword
  city_pathology_force_keyword
  city_pathology_faq_heading
  city_pathology_faq_desc
  city_pathology_emergency_heading
  city_pathology_emergency_desc

*/
