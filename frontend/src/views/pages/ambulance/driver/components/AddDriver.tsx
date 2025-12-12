import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Card, Alert, Image } from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";
import ComponentCard from "@/components/ComponentCard";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "@/global.css";

const driverValidationSchema = Yup.object().shape({
  driver_name: Yup.string().required("Driver name is required"),
  driver_last_name: Yup.string().required("Driver last name is required"),
  driver_mobile: Yup.string()
    .required("Driver mobile is required")
    .matches(/^[0-9]{10}$/, "Mobile number must be 10 digits"),
  driver_dob: Yup.string().required("Date of birth is required"),
  driver_gender: Yup.string().required("Gender is required"),
  driver_city_id: Yup.number().required("City is required"),
  driver_created_by: Yup.number().required("Created by is required"),
  driver_created_partner_id: Yup.number().when("driver_created_by", {
    is: 1,
    then: (schema) => schema.required("Partner ID is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  
  // Driver Details
  driver_details_dl_number: Yup.string().required("DL number is required"),
  driver_details_dl_exp_date: Yup.string().required("DL expiry date is required"),
  driver_details_aadhar_number: Yup.string()
    .required("Aadhar number is required")
    .matches(/^[0-9]{12}$/, "Aadhar must be 12 digits"),
  driver_details_pan_card_number: Yup.string()
    .required("PAN number is required")
    .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN format"),
  driver_details_police_verification_date: Yup.string().required(
    "Police verification date is required"
  ),
});

const AddDriver: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const baseURL = (import.meta as any).env?.VITE_PATH ?? "";
  const basePath = (import.meta as any).env?.BASE_PATH ?? "";
  
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Preview states for images
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [dlFrontPreview, setDlFrontPreview] = useState<string | null>(null);
  const [dlBackPreview, setDlBackPreview] = useState<string | null>(null);
  const [aadharFrontPreview, setAadharFrontPreview] = useState<string | null>(null);
  const [aadharBackPreview, setAadharBackPreview] = useState<string | null>(null);
  const [panFrontPreview, setPanFrontPreview] = useState<string | null>(null);
  const [policeVerificationPreview, setPoliceVerificationPreview] = useState<string | null>(null);

  const [initialValues, setInitialValues] = useState({
    driver_profile_img: null as File | null,
    driver_name: "",
    driver_last_name: "",
    driver_mobile: "",
    driver_dob: "",
    driver_gender: "",
    driver_city_id: "",
    driver_created_by: "",
    driver_created_partner_id: "",
    driver_auth_key: "",
    partner_auth_key: "",
    
    // Driver Details
    driver_details_dl_front_img: null as File | null,
    driver_details_dl_back_image: null as File | null,
    driver_details_dl_number: "",
    driver_details_dl_exp_date: "",
    driver_details_aadhar_front_img: null as File | null,
    driver_details_aadhar_back_img: null as File | null,
    driver_details_aadhar_number: "",
    driver_details_pan_card_front_img: null as File | null,
    driver_details_pan_card_number: "",
    driver_details_police_verification_image: null as File | null,
    driver_details_police_verification_date: "",
  });

  useEffect(() => {
    if (isEditMode) {
      fetchDriverDetails();
    }
  }, [id]);

  const fetchDriverDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseURL}/driver/get_driver/${id}`);
      const driver = response.data.jsonData.driver_fetch[0];

      setInitialValues({
        driver_profile_img: null,
        driver_name: driver.driver_name || "",
        driver_last_name: driver.driver_last_name || "",
        driver_mobile: driver.driver_mobile || "",
        driver_dob: driver.driver_dob ? new Date(driver.driver_dob * 1000).toISOString().split('T')[0] : "",
        driver_gender: driver.driver_gender || "",
        driver_city_id: driver.driver_city_id?.toString() || "",
        driver_created_by: driver.driver_created_by?.toString() || "",
        driver_created_partner_id: driver.driver_created_partner_id?.toString() || "",
        driver_auth_key: driver.driver_auth_key || "",
        partner_auth_key: driver.partner_auth_key || "",
        
        driver_details_dl_front_img: null,
        driver_details_dl_back_image: null,
        driver_details_dl_number: driver.driver_details_dl_number || "",
        driver_details_dl_exp_date: driver.driver_details_dl_exp_date || "",
        driver_details_aadhar_front_img: null,
        driver_details_aadhar_back_img: null,
        driver_details_aadhar_number: driver.driver_details_aadhar_number || "",
        driver_details_pan_card_front_img: null,
        driver_details_pan_card_number: driver.driver_details_pan_card_number || "",
        driver_details_police_verification_image: null,
        driver_details_police_verification_date: driver.driver_details_police_verification_date || "",
      });

      // Set preview images
      if (driver.driver_profile_img) setProfilePreview(`${basePath}/${driver.driver_profile_img}`);
      if (driver.driver_details_dl_front_img) setDlFrontPreview(`${basePath}/${driver.driver_details_dl_front_img}`);
      if (driver.driver_details_dl_back_image) setDlBackPreview(`${basePath}/${driver.driver_details_dl_back_image}`);
      if (driver.driver_details_aadhar_front_img) setAadharFrontPreview(`${basePath}/${driver.driver_details_aadhar_front_img}`);
      if (driver.driver_details_aadhar_back_img) setAadharBackPreview(`${basePath}/${driver.driver_details_aadhar_back_img}`);
      if (driver.driver_details_pan_card_front_img) setPanFrontPreview(`${basePath}/${driver.driver_details_pan_card_front_img}`);
      if (driver.driver_details_police_verification_image) setPoliceVerificationPreview(`${basePath}/${driver.driver_details_police_verification_image}`);
    } catch (err: any) {
      console.error("Error fetching driver details:", err);
      setError(err.response?.data?.message || "Failed to fetch driver details");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: string,
    setFieldValue: any,
    setPreview: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setFieldValue(fieldName, file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (values: typeof initialValues) => {
    setSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();

      // Append basic driver info
      formData.append("driver_name", values.driver_name);
      formData.append("driver_last_name", values.driver_last_name);
      formData.append("driver_mobile", values.driver_mobile);
      formData.append("driver_dob", values.driver_dob);
      formData.append("driver_gender", values.driver_gender);
      formData.append("driver_city_id", values.driver_city_id);
      formData.append("driver_created_by", values.driver_created_by);
      
      if (values.driver_created_by === "1" && values.driver_created_partner_id) {
        formData.append("driver_created_partner_id", values.driver_created_partner_id);
      }
      
      if (values.driver_auth_key) formData.append("driver_auth_key", values.driver_auth_key);
      if (values.partner_auth_key) formData.append("partner_auth_key", values.partner_auth_key);

      // Append images
      if (values.driver_profile_img) formData.append("driver_profile_img", values.driver_profile_img);
      if (values.driver_details_dl_front_img) formData.append("driver_details_dl_front_img", values.driver_details_dl_front_img);
      if (values.driver_details_dl_back_image) formData.append("driver_details_dl_back_image", values.driver_details_dl_back_image);
      if (values.driver_details_aadhar_front_img) formData.append("driver_details_aadhar_front_img", values.driver_details_aadhar_front_img);
      if (values.driver_details_aadhar_back_img) formData.append("driver_details_aadhar_back_img", values.driver_details_aadhar_back_img);
      if (values.driver_details_pan_card_front_img) formData.append("driver_details_pan_card_front_img", values.driver_details_pan_card_front_img);
      if (values.driver_details_police_verification_image) formData.append("driver_details_police_verification_image", values.driver_details_police_verification_image);

      // Append driver details
      formData.append("driver_details_dl_number", values.driver_details_dl_number);
      formData.append("driver_details_dl_exp_date", values.driver_details_dl_exp_date);
      formData.append("driver_details_aadhar_number", values.driver_details_aadhar_number);
      formData.append("driver_details_pan_card_number", values.driver_details_pan_card_number);
      formData.append("driver_details_police_verification_date", values.driver_details_police_verification_date);

      let response;
      if (isEditMode) {
        response = await axios.put(
          `${baseURL}/driver/update_driver/${id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        response = await axios.post(
          `${baseURL}/driver/add_driver`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      if (response.data.status === 201 || response.data.status === 200) {
        navigate("/ambulance/driver");
      }
    } catch (err: any) {
      console.error(`Error ${isEditMode ? "updating" : "adding"} driver:`, err);
      setError(
        err.response?.data?.message ||
          `Failed to ${isEditMode ? "update" : "add"} driver`
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <ComponentCard
        title={isEditMode ? "Edit Driver" : "Add New Driver"}
        className="m-2"
      >
        <div className="text-center py-4">Loading driver details...</div>
      </ComponentCard>
    );
  }

  return (
    <ComponentCard
      title={isEditMode ? "Edit Driver" : "Add New Driver"}
      className="m-2"
    >
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Formik
        initialValues={initialValues}
        validationSchema={driverValidationSchema}
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
                      <Col md={3}>
                        <Form.Group>
                          <Form.Label className="fs-6 fw-semibold">
                            First Name <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="driver_name"
                            value={values.driver_name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.driver_name && !!errors.driver_name}
                            placeholder="Enter first name"
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.driver_name}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col md={3}>
                        <Form.Group>
                          <Form.Label className="fs-6 fw-semibold">
                            Last Name <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="driver_last_name"
                            value={values.driver_last_name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.driver_last_name && !!errors.driver_last_name}
                            placeholder="Enter last name"
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.driver_last_name}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col md={3}>
                        <Form.Group>
                          <Form.Label className="fs-6 fw-semibold">
                            Mobile Number <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="driver_mobile"
                            value={values.driver_mobile}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.driver_mobile && !!errors.driver_mobile}
                            placeholder="Enter 10-digit mobile number"
                            maxLength={10}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.driver_mobile}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col md={3}>
                        <Form.Group>
                          <Form.Label className="fs-6 fw-semibold">
                            Date of Birth <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="date"
                            name="driver_dob"
                            value={values.driver_dob}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.driver_dob && !!errors.driver_dob}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.driver_dob}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col md={4}>
                        <Form.Group>
                          <Form.Label className="fs-6 fw-semibold">
                            Gender <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Select
                            name="driver_gender"
                            value={values.driver_gender}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.driver_gender && !!errors.driver_gender}
                          >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            {errors.driver_gender}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col md={4}>
                        <Form.Group>
                          <Form.Label className="fs-6 fw-semibold">
                            City <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="number"
                            name="driver_city_id"
                            value={values.driver_city_id}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.driver_city_id && !!errors.driver_city_id}
                            placeholder="Enter city ID"
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.driver_city_id}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col md={4}>
                        <Form.Group>
                          <Form.Label className="fs-6 fw-semibold">
                            Created By <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Select
                            name="driver_created_by"
                            value={values.driver_created_by}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.driver_created_by && !!errors.driver_created_by}
                          >
                            <option value="">Select</option>
                            <option value="0">Self</option>
                            <option value="1">Partner</option>
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            {errors.driver_created_by}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      {values.driver_created_by === "1" && (
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="fs-6 fw-semibold">
                              Partner ID <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Control
                              type="number"
                              name="driver_created_partner_id"
                              value={values.driver_created_partner_id}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              isInvalid={
                                touched.driver_created_partner_id &&
                                !!errors.driver_created_partner_id
                              }
                              placeholder="Enter partner ID"
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.driver_created_partner_id}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                      )}

                      <Col lg={10}>
                        <Form.Group>
                          <Form.Label className="fs-6 fw-semibold">
                            Profile Image{" "}
                            {!isEditMode && <span className="text-danger">*</span>}
                          </Form.Label>
                          <Form.Control
                            type="file"
                            accept="image/*"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              handleImageChange(e, "driver_profile_img", setFieldValue, setProfilePreview)
                            }
                            onBlur={handleBlur}
                          />
                          {isEditMode && (
                            <Form.Text className="text-muted">
                              Leave empty to keep current image
                            </Form.Text>
                          )}
                        </Form.Group>
                      </Col>
                      <Col lg={2}>
                        {profilePreview && (
                          <Image
                            src={profilePreview}
                            alt="Profile Preview"
                            thumbnail
                            style={{ maxWidth: "200px", maxHeight: "200px" }}
                          />
                        )}
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>

              {/* Driver License Information */}
              <Col lg={12}>
                <Card className="border">
                  <Card.Header className="bg-light">
                    <h6 className="mb-0">Driving License Information</h6>
                  </Card.Header>
                  <Card.Body>
                    <Row className="g-3">
                      <Col md={10}>
                        <Form.Group>
                          <Form.Label className="fs-6 fw-semibold">
                            DL Front Image{" "}
                            {!isEditMode && <span className="text-danger">*</span>}
                          </Form.Label>
                          <Form.Control
                            type="file"
                            accept="image/*"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              handleImageChange(e, "driver_details_dl_front_img", setFieldValue, setDlFrontPreview)
                            }
                          />
                        </Form.Group>
                      </Col>
                      <Col md={1}>
                        {dlFrontPreview && (
                          <Image
                            src={dlFrontPreview}
                            alt="DL Front"
                            thumbnail
                            style={{ maxWidth: "80px", maxHeight: "80px" }}
                          />
                        )}
                      </Col>
                      <Col md={1}>
                        {dlBackPreview && (
                          <Image
                            src={dlBackPreview}
                            alt="DL Back"
                            thumbnail
                            style={{ maxWidth: "80px", maxHeight: "80px" }}
                          />
                        )}
                      </Col>

                      <Col md={10}>
                        <Form.Group>
                          <Form.Label className="fs-6 fw-semibold">
                            DL Back Image{" "}
                            {!isEditMode && <span className="text-danger">*</span>}
                          </Form.Label>
                          <Form.Control
                            type="file"
                            accept="image/*"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              handleImageChange(e, "driver_details_dl_back_image", setFieldValue, setDlBackPreview)
                            }
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label className="fs-6 fw-semibold">
                            DL Number <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="driver_details_dl_number"
                            value={values.driver_details_dl_number}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={
                              touched.driver_details_dl_number &&
                              !!errors.driver_details_dl_number
                            }
                            placeholder="Enter DL number"
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.driver_details_dl_number}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group>
                          <Form.Label className="fs-6 fw-semibold">
                            DL Expiry Date <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="date"
                            name="driver_details_dl_exp_date"
                            value={values.driver_details_dl_exp_date}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={
                              touched.driver_details_dl_exp_date &&
                              !!errors.driver_details_dl_exp_date
                            }
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.driver_details_dl_exp_date}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                    </Row>
                  </Card.Body>
                </Card>
              </Col>

              {/* Aadhar Information */}
              <Col lg={12}>
                <Card className="border">
                  <Card.Header className="bg-light">
                    <h6 className="mb-0">Aadhar Card Information</h6>
                  </Card.Header>
                  <Card.Body>
                    <Row className="g-3">
                      <Col md={10}>
                        <Form.Group>
                          <Form.Label className="fs-6 fw-semibold">
                            Aadhar Front Image{" "}
                            {!isEditMode && <span className="text-danger">*</span>}
                          </Form.Label>
                          <Form.Control
                            type="file"
                            accept="image/*"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              handleImageChange(e, "driver_details_aadhar_front_img", setFieldValue, setAadharFrontPreview)
                            }
                          />
                        </Form.Group>
                      </Col>
                      <Col md={2}>
                        {aadharFrontPreview && (
                          <Image
                            src={aadharFrontPreview}
                            alt="Aadhar Front"
                            thumbnail
                            style={{ maxWidth: "80px", maxHeight: "80px" }}
                          />
                        )}
                      </Col>

                      <Col md={10}>
                        <Form.Group>
                          <Form.Label className="fs-6 fw-semibold">
                            Aadhar Back Image{" "}
                            {!isEditMode && <span className="text-danger">*</span>}
                          </Form.Label>
                          <Form.Control
                            type="file"
                            accept="image/*"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              handleImageChange(e, "driver_details_aadhar_back_img", setFieldValue, setAadharBackPreview)
                            }
                          />
                        </Form.Group>
                      </Col>
                      <Col md={2}>
                        {aadharBackPreview && (
                          <Image
                            src={aadharBackPreview}
                            alt="Aadhar Back"
                            thumbnail
                            style={{ maxWidth: "80px", maxHeight: "80px" }}
                          />
                        )}
                      </Col>
                      <Col md={12}>
                        <Form.Group>
                          <Form.Label className="fs-6 fw-semibold">
                            Aadhar Number <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="driver_details_aadhar_number"
                            value={values.driver_details_aadhar_number}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={
                              touched.driver_details_aadhar_number &&
                              !!errors.driver_details_aadhar_number
                            }
                            placeholder="Enter 12-digit Aadhar number"
                            maxLength={12}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.driver_details_aadhar_number}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                    </Row>
                  </Card.Body>
                </Card>
              </Col>

              {/* PAN Card Information */}
              <Col lg={12}>
                <Card className="border">
                  <Card.Header className="bg-light">
                    <h6 className="mb-0">PAN Card Information</h6>
                  </Card.Header>
                  <Card.Body>
                    <Row className="g-3">
                      <Col md={10}>
                        <Form.Group>
                          <Form.Label className="fs-6 fw-semibold">
                            PAN Card Image{" "}
                            {!isEditMode && <span className="text-danger">*</span>}
                          </Form.Label>
                          <Form.Control
                            type="file"
                            accept="image/*"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              handleImageChange(e, "driver_details_pan_card_front_img", setFieldValue, setPanFrontPreview)
                            }
                          />
                        </Form.Group>
                      </Col>
                      <Col md={2}>
                        {panFrontPreview && (
                          <Image
                            src={panFrontPreview}
                            alt="PAN Card"
                            thumbnail
                            style={{ maxWidth: "100px", maxHeight: "100px" }}
                          />
                        )}
                      </Col>
                      <Col md={12}>
                        <Form.Group>
                          <Form.Label className="fs-6 fw-semibold">
                            PAN Number <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="driver_details_pan_card_number"
                            value={values.driver_details_pan_card_number}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={
                              touched.driver_details_pan_card_number &&
                              !!errors.driver_details_pan_card_number
                            }
                            placeholder="Enter PAN number (e.g., ABCDE1234F)"
                            maxLength={10}
                            style={{ textTransform: "uppercase" }}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.driver_details_pan_card_number}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                    </Row>
                  </Card.Body>
                </Card>
              </Col>

              {/* Police Verification */}
              <Col lg={12}>
                <Card className="border">
                  <Card.Header className="bg-light">
                    <h6 className="mb-0">Police Verification</h6>
                  </Card.Header>
                  <Card.Body>
                    <Row className="g-3">
                      <Col md={10}>
                        <Form.Group>
                          <Form.Label className="fs-6 fw-semibold">
                            Verification Certificate{" "}
                            {!isEditMode && <span className="text-danger">*</span>}
                          </Form.Label>
                          <Form.Control
                            type="file"
                            accept="image/*"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              handleImageChange(
                                e,
                                "driver_details_police_verification_image",
                                setFieldValue,
                                setPoliceVerificationPreview
                              )
                            }
                          />
                        </Form.Group>
                      </Col>
                      <Col md={2}>
                        {policeVerificationPreview && (
                          <Image
                            src={policeVerificationPreview}
                            alt="Police Verification"
                            thumbnail
                            style={{ maxWidth: "100px", maxHeight: "100px" }}
                          />
                        )}
                      </Col>
                      <Col md={12}>
                        <Form.Group>
                          <Form.Label className="fs-6 fw-semibold">
                            Verification Date <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="date"
                            name="driver_details_police_verification_date"
                            value={values.driver_details_police_verification_date}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={
                              touched.driver_details_police_verification_date &&
                              !!errors.driver_details_police_verification_date
                            }
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.driver_details_police_verification_date}
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
                    className="px-3 rounded text-black"
                    type="button"
                    onClick={() => navigate("/ambulance/driver")}
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
                      ? "Update Driver"
                      : "Save Driver"}
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

export default AddDriver;