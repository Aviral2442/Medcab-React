import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Card, Alert, Image } from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";
import SnowEditor from "@/views/forms/editors/index";
import ComponentCard from "@/components/ComponentCard";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "@/global.css";

const blogValidationSchema = Yup.object({
  blogs_title: Yup.string().required("Blog title is required"),
  blogs_sku: Yup.string().required("Blog SKU is required"),
  blogs_short_desc: Yup.string().required("Short description is required"),
  blogs_long_desc: Yup.string().required("Long description is required"),
  blogs_category: Yup.number().required("Category is required"),
  blogs_meta_title: Yup.string().required("Meta title is required"),
  blogs_meta_desc: Yup.string().required("Meta description is required"),
  blogs_meta_keywords: Yup.string().required("Meta keywords are required"),
  blogs_force_keywords: Yup.string(),
  blogs_schema: Yup.string(),
});

const AddBlogs = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const baseURL = (import.meta as any).env?.VITE_PATH ?? "";
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [initialValues, setInitialValues] = useState({
    blogs_image: null as File | null,
    blogs_title: "",
    blogs_sku: "",
    blogs_short_desc: "",
    blogs_long_desc: "",
    blogs_category: "",
    blogs_meta_title: "",
    blogs_meta_desc: "",
    blogs_meta_keywords: "",
    blogs_force_keywords: "",
    blogs_schema: "",
  });

  useEffect(() => {
    if (isEditMode) {
      fetchBlogDetails();
    }
  }, [id]);

  const fetchBlogDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${baseURL}/content_writer/get_blog/${id}`
      );
      const blog = response.data.jsonData.blog;

      setInitialValues({
        blogs_image: null,
        blogs_title: blog.blogs_title || "",
        blogs_sku: blog.blogs_sku || "",
        blogs_short_desc: blog.blogs_short_desc || "",
        blogs_long_desc: blog.blogs_long_desc || "",
        blogs_category: blog.blogs_category?.toString() || "",
        blogs_meta_title: blog.blogs_meta_title || "",
        blogs_meta_desc: blog.blogs_meta_desc || "",
        blogs_meta_keywords: blog.blogs_meta_keywords || "",
        blogs_force_keywords: blog.blogs_force_keywords || "",
        blogs_schema: blog.blogs_schema || "",
      });

      if (blog.blogs_image) {
        setPreviewImage(`${baseURL}/${blog.blogs_image}`);
      }
    } catch (err: any) {
      console.error("Error fetching blog details:", err);
      setError(err.response?.data?.message || "Failed to fetch blog details");
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
      setFieldValue("blogs_image", file);
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

      if (values.blogs_image) {
        formData.append("blogs_image", values.blogs_image);
      }

      formData.append("blogs_title", values.blogs_title);
      formData.append("blogs_sku", values.blogs_sku);
      formData.append("blogs_short_desc", values.blogs_short_desc);
      formData.append("blogs_long_desc", values.blogs_long_desc);
      formData.append("blogs_category", values.blogs_category);
      formData.append("blogs_meta_title", values.blogs_meta_title);
      formData.append("blogs_meta_desc", values.blogs_meta_desc);
      formData.append("blogs_meta_keywords", values.blogs_meta_keywords);
      formData.append("blogs_force_keywords", values.blogs_force_keywords);
      formData.append("blogs_schema", values.blogs_schema);

      let response;
      if (isEditMode) {
        response = await axios.put(
          `${baseURL}/content_writer/edit_blog/${id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        response = await axios.post(
          `${baseURL}/content_writer/add_blog`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      if (response.data.status === 201 || response.data.status === 200) {
        navigate("/blogs");
      }
    } catch (err: any) {
      console.error(
        `Error ${isEditMode ? "updating" : "adding"} blog:`,
        err
      );
      setError(
        err.response?.data?.message ||
          `Failed to ${isEditMode ? "update" : "add"} blog`
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <ComponentCard
        title={isEditMode ? "Edit Blog" : "Add New Blog"}
        className="m-2"
      >
        <div className="text-center py-4">Loading blog details...</div>
      </ComponentCard>
    );
  }

  return (
    <ComponentCard
      title={isEditMode ? "Edit Blog" : "Add New Blog"}
      className="m-2"
    >
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Formik
        initialValues={initialValues}
        validationSchema={blogValidationSchema}
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
              {/* Blog Image */}

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
                          <Form.Label className="fs-6 fw-semibold">
                            Blog Title <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="blogs_title"
                            value={values.blogs_title}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={
                              touched.blogs_title && !!errors.blogs_title
                            }
                            placeholder="Enter blog title"
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.blogs_title}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group>
                          <Form.Label className="fs-6 fw-semibold">
                            Blog SKU <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="blogs_sku"
                            value={values.blogs_sku}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.blogs_sku && !!errors.blogs_sku}
                            placeholder="Enter blog SKU/slug"
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.blogs_sku}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group>
                          <Form.Label className="fs-6 fw-semibold">
                            Category <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Select
                            name="blogs_category"
                            value={values.blogs_category}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={
                              touched.blogs_category && !!errors.blogs_category
                            }
                          >
                            <option value="">Select Category</option>
                            <option value="1">Ambulance</option>
                            <option value="2">Pathology</option>
                            <option value="3">Manpower</option>
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            {errors.blogs_category}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group>
                          <Form.Label className="fs-6 fw-semibold">
                            Force Keywords
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="blogs_force_keywords"
                            value={values.blogs_force_keywords}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="Enter force keywords (optional)"
                          />
                        </Form.Group>
                      </Col>

                      <Col md={12}>
                        <Form.Group>
                          <Form.Label className="fs-6 fw-semibold">
                            Short Description{" "}
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <SnowEditor
                            value={values.blogs_short_desc}
                            onChange={(value: string) =>
                              setFieldValue("blogs_short_desc", value)
                            }
                          />
                          {touched.blogs_short_desc &&
                            errors.blogs_short_desc && (
                              <div className="text-danger small mt-1">
                                {errors.blogs_short_desc}
                              </div>
                            )}
                        </Form.Group>
                      </Col>

                      <Col md={12}>
                        <Form.Group>
                          <Form.Label className="fs-6 fw-semibold">
                            Long Description{" "}
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <SnowEditor
                            value={values.blogs_long_desc}
                            onChange={(value: string) =>
                              setFieldValue("blogs_long_desc", value)
                            }
                          />
                          {touched.blogs_long_desc &&
                            errors.blogs_long_desc && (
                              <div className="text-danger small mt-1">
                                {errors.blogs_long_desc}
                              </div>
                            )}
                        </Form.Group>
                      </Col>
              <Col lg={10}>
                <Card className="border">
                  <Card.Body>
                    <Form.Group>
                      <Form.Label className="fs-6 fw-semibold">
                        Blog Image{" "}
                        {!isEditMode && <span className="text-danger">*</span>}
                      </Form.Label>
                      <Form.Control
                        type="file"
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
                          <Form.Label className="fs-6 fw-semibold">
                            Meta Title <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="blogs_meta_title"
                            value={values.blogs_meta_title}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={
                              touched.blogs_meta_title &&
                              !!errors.blogs_meta_title
                            }
                            placeholder="Enter meta title"
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.blogs_meta_title}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group>
                          <Form.Label className="fs-6 fw-semibold">
                            Meta Keywords <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="blogs_meta_keywords"
                            value={values.blogs_meta_keywords}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={
                              touched.blogs_meta_keywords &&
                              !!errors.blogs_meta_keywords
                            }
                            placeholder="Enter meta keywords (comma separated)"
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.blogs_meta_keywords}
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
                            rows={3}
                            name="blogs_meta_desc"
                            value={values.blogs_meta_desc}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={
                              touched.blogs_meta_desc &&
                              !!errors.blogs_meta_desc
                            }
                            placeholder="Enter meta description"
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.blogs_meta_desc}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col md={12}>
                        <Form.Group>
                          <Form.Label className="fs-6 fw-semibold">
                            Schema Markup
                          </Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={10}
                            name="blogs_schema"
                            value={values.blogs_schema}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="Enter schema markup JSON (optional)"
                          />
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
              className="px-3 rounded text-black"
                    onClick={() => navigate("/blogs")}
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <Button variant="primary" type="submit" disabled={submitting}>
                    {submitting
                      ? isEditMode
                        ? "Updating..."
                        : "Saving..."
                      : isEditMode
                      ? "Update Blog"
                      : "Save Blog"}
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

export default AddBlogs;

/*

            

*/
