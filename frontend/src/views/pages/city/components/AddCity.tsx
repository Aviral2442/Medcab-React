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
    why_choose_meta_desc: Yup.string().required("Why Choose Meta Description is required"),
    city_block1_heading: Yup.string().required("Block 1 Heading is required"),
    city_block1_body: Yup.string().required("Block 1 Body is required"),
    city_block2_heading: Yup.string().required("Block 2 Heading is required"),
    city_block2_body: Yup.string().required("Block 2 Body is required"),
    city_thumbnail_alt: Yup.string().required("Thumbnail Alt Text is required"),
    city_force_keyword: Yup.string().required("Force Keyword is required"),
    city_faq_heading: Yup.string().required("FAQ Heading is required"),
    city_emergency_desc: Yup.string().required("Emergency Description is required"),
});

// Make all props optional since component can be used standalone
interface AddCityProps {
  mode?: "add" | "edit";
  data?: any;
  onCancel?: () => void;
  onDataChanged?: () => void;
}

const AddCity: React.FC<AddCityProps> = ({
  mode,
  data,
  onCancel,
  onDataChanged,
}) => {
    const navigate = useNavigate();
    const { id } = useParams();
    
    // Use props if provided, otherwise determine from URL params
    const isEditMode = mode === "edit" || Boolean(id);
    const baseURL = (import.meta as any).env?.VITE_PATH ?? "";
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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
        city_thumbnail_alt: "",
        city_meta_title: "",
        city_meta_desc: "",
        city_meta_keyword: "",
        city_force_keyword: "",
        city_faq_heading: "",
        city_emergency_desc: "",
    });

    useEffect(() => {
        // Fetch from URL id or from props data
        if (isEditMode) {
            if (id) {
                fetchCityDetails();
            } else if (data) {
                // Load from props data if provided
                loadDataFromProps();
            }
        }
    }, [id, data]);

    const loadDataFromProps = () => {
        if (data) {
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
                city_thumbnail_alt: data.city_thumbnail_alt || "",
                city_meta_title: data.city_meta_title || "",
                city_meta_desc: data.city_meta_desc || "",
                city_meta_keyword: data.city_meta_keyword || "",
                city_force_keyword: data.city_force_keyword || "",
                city_faq_heading: data.city_faq_heading || "",
                city_emergency_desc: data.city_emergency_desc || "",
            });

            if (data.city_thumbnail) {
                setPreviewImage(`${baseURL}/${data.city_thumbnail}`);
            }
        }
    };

    const fetchCityDetails = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                `${baseURL}/content_writer/fetch_city_content/${id}`
            );
            const city = response.data.jsonData.city_content;

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
                city_thumbnail_alt: city.city_thumbnail_alt || "",
                city_meta_title: city.city_meta_title || "",
                city_meta_desc: city.city_meta_desc || "",
                city_meta_keyword: city.city_meta_keyword || "",
                city_force_keyword: city.city_force_keyword || "",
                city_faq_heading: city.city_faq_heading || "",
                city_emergency_desc: city.city_emergency_desc || "",
            });

            if (city.city_thumbnail) {
                setPreviewImage(`${baseURL}/${city.city_thumbnail}`);
            }
        } catch (err: any) {
            console.error("Error fetching city details:", err);
            setError(err.response?.data?.message || "Failed to fetch city details");
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        setFieldValue: any
    ) => {
        const file = e.target.files?.[0];
        if (file) {
            setFieldValue("city_thumbnail", file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (values: typeof initialValues) => {
        setSubmitting(true);
        setError(null);

        try {
            const formData = new FormData();

            if (values.city_thumbnail) {
                formData.append("city_thumbnail", values.city_thumbnail);
            }

            formData.append("city_name", values.city_name);
            formData.append("city_title_sku", values.city_title_sku);
            formData.append("city_title", values.city_title);
            formData.append("city_heading", values.city_heading);
            formData.append("city_body_desc", values.city_body_desc);
            formData.append("city_why_choose_us", values.city_why_choose_us);
            formData.append("why_choose_meta_desc", values.why_choose_meta_desc);
            formData.append("city_block1_heading", values.city_block1_heading);
            formData.append("city_block1_body", values.city_block1_body);
            formData.append("city_block2_heading", values.city_block2_heading);
            formData.append("city_block2_body", values.city_block2_body);
            formData.append("city_thumbnail_alt", values.city_thumbnail_alt);
            formData.append("city_meta_title", values.city_meta_title);
            formData.append("city_meta_desc", values.city_meta_desc);
            formData.append("city_meta_keyword", values.city_meta_keyword);
            formData.append("city_force_keyword", values.city_force_keyword);
            formData.append("city_faq_heading", values.city_faq_heading);
            formData.append("city_emergency_desc", values.city_emergency_desc);

            let response;
            // Use id from URL or from data prop
            const cityId = id || data?.city_id;
            
            if (isEditMode && cityId) {
                response = await axios.put(
                    `${baseURL}/content_writer/edit_city_content/${cityId}`,
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );
            } else {
                response = await axios.post(
                    `${baseURL}/content_writer/add_city_content`,
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );
            }

            if (response.data.status === 201 || response.data.status === 200) {
                // Call onDataChanged callback if provided (for tab interface)
                if (onDataChanged) {
                    onDataChanged();
                }
                
                // Call onCancel callback if provided (for tab interface)
                if (onCancel) {
                    onCancel();
                } else {
                    // Otherwise navigate (for standalone route)
                    navigate("/city");
                }
                
                console.log("Data saved successfully");
            }
        } catch (err: any) {
            console.error(
                `Error ${isEditMode ? "updating" : "adding"} city:`,
                err
            );
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
            navigate("/city");
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

    return (
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
                initialValues={initialValues}
                validationSchema={cityValidationSchema}
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
                }) => (
                    <Form onSubmit={handleSubmit}>
                        <Row className="g-3">

                            {/* Basic Information */}
                            <Col lg={12}>
                                <Card className="border">
                                    <Card.Header className="bg-light">
                                        <h6 className="mb-0">Basic Information</h6>
                                    </Card.Header>
                                    <Card.Body>
                                        <Row className="g-3">
                                            <Col md={6}>
                                                <Form.Group>
                                                    <Form.Label className="fw-semibold">
                                                        City Name <span className="text-danger">*</span>
                                                    </Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="city_name"
                                                        value={values.city_name}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        isInvalid={touched.city_name && !!errors.city_name}
                                                        placeholder="Enter city name"
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors.city_name}
                                                    </Form.Control.Feedback>
                                                </Form.Group>
                                            </Col>

                                            <Col md={6}>
                                                <Form.Group>
                                                    <Form.Label className="fw-semibold">
                                                        City Title SKU <span className="text-danger">*</span>
                                                    </Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="city_title_sku"
                                                        value={values.city_title_sku}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        isInvalid={touched.city_title_sku && !!errors.city_title_sku}
                                                        placeholder="Enter city title SKU/slug"
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors.city_title_sku}
                                                    </Form.Control.Feedback>
                                                </Form.Group>
                                            </Col>

                                            <Col md={6}>
                                                <Form.Group>
                                                    <Form.Label className="fw-semibold">
                                                        City Title <span className="text-danger">*</span>
                                                    </Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="city_title"
                                                        value={values.city_title}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        isInvalid={touched.city_title && !!errors.city_title}
                                                        placeholder="Enter city title"
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors.city_title}
                                                    </Form.Control.Feedback>
                                                </Form.Group>
                                            </Col>

                                            <Col md={6}>
                                                <Form.Group>
                                                    <Form.Label className="fw-semibold">
                                                        City Heading <span className="text-danger">*</span>
                                                    </Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="city_heading"
                                                        value={values.city_heading}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        isInvalid={touched.city_heading && !!errors.city_heading}
                                                        placeholder="Enter city heading"
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors.city_heading}
                                                    </Form.Control.Feedback>
                                                </Form.Group>
                                            </Col>

                                            <Col md={6}>
                                                <Form.Group>
                                                    <Form.Label className="fw-semibold">
                                                        Thumbnail Alt Text <span className="text-danger">*</span>
                                                    </Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="city_thumbnail_alt"
                                                        value={values.city_thumbnail_alt}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        isInvalid={touched.city_thumbnail_alt && !!errors.city_thumbnail_alt}
                                                        placeholder="Enter thumbnail alt text"
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors.city_thumbnail_alt}
                                                    </Form.Control.Feedback>
                                                </Form.Group>
                                            </Col>

                                            <Col md={6}>
                                                <Form.Group>
                                                    <Form.Label className="fw-semibold">
                                                        FAQ Heading <span className="text-danger">*</span>
                                                    </Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="city_faq_heading"
                                                        value={values.city_faq_heading}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        isInvalid={touched.city_faq_heading && !!errors.city_faq_heading}
                                                        placeholder="Enter FAQ heading"
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors.city_faq_heading}
                                                    </Form.Control.Feedback>
                                                </Form.Group>
                                            </Col>

                                            <Col md={12}>
                                                <Form.Group>
                                                    <SnowEditor
                                                        title="Body Description"
                                                        value={values.city_body_desc}
                                                        onChange={(value: string) =>
                                                            setFieldValue("city_body_desc", value)
                                                        }
                                                    />
                                                    {touched.city_body_desc && errors.city_body_desc && (
                                                        <div className="text-danger small mt-1">
                                                            {errors.city_body_desc}
                                                        </div>
                                                    )}
                                                </Form.Group>
                                            </Col>

                                            <Col md={12}>
                                                <Form.Group>
                                                    <SnowEditor
                                                        title="Why Choose Us"
                                                        value={values.city_why_choose_us}
                                                        onChange={(value: string) =>
                                                            setFieldValue("city_why_choose_us", value)
                                                        }
                                                    />
                                                    {touched.city_why_choose_us && errors.city_why_choose_us && (
                                                        <div className="text-danger small mt-1">
                                                            {errors.city_why_choose_us}
                                                        </div>
                                                    )}
                                                </Form.Group>
                                            </Col>

                                            <Col md={12}>
                                                <Form.Group>
                                                    <SnowEditor
                                                        title="Why Choose Meta Description"
                                                        value={values.why_choose_meta_desc}
                                                        onChange={(value: string) =>
                                                            setFieldValue("why_choose_meta_desc", value)
                                                        }
                                                    />
                                                    {touched.why_choose_meta_desc && errors.why_choose_meta_desc && (
                                                        <div className="text-danger small mt-1">
                                                            {errors.why_choose_meta_desc}
                                                        </div>
                                                    )}
                                                </Form.Group>
                                            </Col>

                                            <Col md={12}>
                                                <Form.Group>
                                                    <SnowEditor
                                                        title="Emergency Description"
                                                        value={values.city_emergency_desc}
                                                        onChange={(value: string) =>
                                                            setFieldValue("city_emergency_desc", value)
                                                        }
                                                    />
                                                    {touched.city_emergency_desc && errors.city_emergency_desc && (
                                                        <div className="text-danger small mt-1">
                                                            {errors.city_emergency_desc}
                                                        </div>
                                                    )}
                                                </Form.Group>
                                            </Col>
                            <Col lg={10}>
                                <Card className="border">
                                    <Card.Body>
                                        <Form.Group>
                                            <Form.Label className="fw-semibold">
                                                City Thumbnail{" "}
                                                {!isEditMode && <span className="text-danger">*</span>}
                                            </Form.Label>
                                            <Form.Control
                                                type="file"
                                                id="city_thumbnail"
                                                accept="image/*"
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                    handleImageChange(e, setFieldValue)
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
                            {/* City Thumbnail Image */}
                            <Col lg={2}>
                                {previewImage && (
                                    <div className="">
                                        <Image
                                            src={previewImage}
                                            alt="Preview"
                                            thumbnail
                                            style={{ maxWidth: "200px", maxHeight: "200px" }}
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
                                        <h6 className="mb-0">Content Blocks</h6>
                                    </Card.Header>
                                    <Card.Body>
                                        <Row className="g-3">
                                            <Col md={6}>
                                                <Form.Group>
                                                    <Form.Label className="fw-semibold">
                                                        Block 1 Heading <span className="text-danger">*</span>
                                                    </Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="city_block1_heading"
                                                        value={values.city_block1_heading}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        isInvalid={touched.city_block1_heading && !!errors.city_block1_heading}
                                                        placeholder="Enter block 1 heading"
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors.city_block1_heading}
                                                    </Form.Control.Feedback>
                                                </Form.Group>
                                            </Col>

                                            <Col md={6}>
                                                <Form.Group>
                                                    <Form.Label className="fw-semibold">
                                                        Block 2 Heading <span className="text-danger">*</span>
                                                    </Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="city_block2_heading"
                                                        value={values.city_block2_heading}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        isInvalid={touched.city_block2_heading && !!errors.city_block2_heading}
                                                        placeholder="Enter block 2 heading"
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors.city_block2_heading}
                                                    </Form.Control.Feedback>
                                                </Form.Group>
                                            </Col>

                                            <Col md={12}>
                                                <Form.Group>
                                                    <SnowEditor
                                                        title="Block 1 Body"
                                                        value={values.city_block1_body}
                                                        onChange={(value: string) =>
                                                            setFieldValue("city_block1_body", value)
                                                        }
                                                    />
                                                    {touched.city_block1_body && errors.city_block1_body && (
                                                        <div className="text-danger small mt-1">
                                                            {errors.city_block1_body}
                                                        </div>
                                                    )}
                                                </Form.Group>
                                            </Col>

                                            <Col md={12}>
                                                <Form.Group>
                                                    <SnowEditor
                                                        title="Block 2 Body"
                                                        value={values.city_block2_body}
                                                        onChange={(value: string) =>
                                                            setFieldValue("city_block2_body", value)
                                                        }
                                                    />
                                                    {touched.city_block2_body && errors.city_block2_body && (
                                                        <div className="text-danger small mt-1">
                                                            {errors.city_block2_body}
                                                        </div>
                                                    )}
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
                                            <Col md={6}>
                                                <Form.Group>
                                                    <Form.Label className="fw-semibold">
                                                        Meta Title <span className="text-danger">*</span>
                                                    </Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="city_meta_title"
                                                        value={values.city_meta_title}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        isInvalid={touched.city_meta_title && !!errors.city_meta_title}
                                                        placeholder="Enter meta title"
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors.city_meta_title}
                                                    </Form.Control.Feedback>
                                                </Form.Group>
                                            </Col>

                                            <Col md={6}>
                                                <Form.Group>
                                                    <Form.Label className="fw-semibold">
                                                        Meta Keywords <span className="text-danger">*</span>
                                                    </Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="city_meta_keyword"
                                                        value={values.city_meta_keyword}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        isInvalid={touched.city_meta_keyword && !!errors.city_meta_keyword}
                                                        placeholder="Enter meta keywords (comma separated)"
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors.city_meta_keyword}
                                                    </Form.Control.Feedback>
                                                </Form.Group>
                                            </Col>

                                            <Col md={6}>
                                                <Form.Group>
                                                    <Form.Label className="fw-semibold">
                                                        Meta Description <span className="text-danger">*</span>
                                                    </Form.Label>
                                                    <Form.Control
                                                        as="textarea"
                                                        rows={3}
                                                        name="city_meta_desc"
                                                        value={values.city_meta_desc}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        isInvalid={touched.city_meta_desc && !!errors.city_meta_desc}
                                                        placeholder="Enter meta description"
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors.city_meta_desc}
                                                    </Form.Control.Feedback>
                                                </Form.Group>
                                            </Col>

                                            <Col md={6}>
                                                <Form.Group>
                                                    <Form.Label className="fw-semibold">
                                                        Force Keywords <span className="text-danger">*</span>
                                                    </Form.Label>
                                                    <Form.Control
                                                        as="textarea"
                                                        rows={3}
                                                        name="city_force_keyword"
                                                        value={values.city_force_keyword}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        isInvalid={touched.city_force_keyword && !!errors.city_force_keyword}
                                                        placeholder="Enter force keywords"
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors.city_force_keyword}
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
                                    <Button
                                        variant="secondary"
                                        onClick={handleCancel}
                                        disabled={submitting}
                                    >
                                        Cancel
                                    </Button>
                                    <Button variant="primary" type="submit" disabled={submitting}>
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
                )}
            </Formik>
        </ComponentCard>
    );
};

export default AddCity;