import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Card, Alert, Image } from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";
import ComponentCard from "@/components/ComponentCard";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "@/global.css";

const partnerValidationSchema = Yup.object().shape({
  partner_f_name: Yup.string().required("First name is required"),
  partner_l_name: Yup.string().required("Last name is required"),
  partner_mobile: Yup.string()
    .matches(/^[0-9]{10}$/, "Mobile number must be 10 digits")
    .required("Mobile number is required"),
  partner_dob: Yup.string().required("Date of birth is required"),
  partner_gender: Yup.string()
    .oneOf(["Male", "Female", "Other"], "Select a valid gender")
    .required("Gender is required"),
  partner_city_id: Yup.number().required("City is required"),
  partner_created_by: Yup.string().required("Created by is required"),
  partner_aadhar_no: Yup.string()
    .matches(/^[0-9]{12}$/, "Aadhar number must be 12 digits")
    .required("Aadhar number is required"),
  partner_wallet: Yup.number()
    .min(0, "Wallet amount cannot be negative")
    .required("Wallet amount is required"),
  partner_pending_wallet_to_comp: Yup.number()
    .min(0, "Pending wallet cannot be negative")
    .required("Pending wallet is required"),
  partner_registration_step: Yup.number()
    .min(1, "Registration step must be at least 1")
    .max(5, "Registration step cannot be more than 5")
    .required("Registration step is required"),
  referral_referral_by: Yup.string().optional(),
});

const AddPartner: React.FC = () => {
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
  const [aadharFrontPreview, setAadharFrontPreview] = useState<string | null>(null);
  const [aadharBackPreview, setAadharBackPreview] = useState<string | null>(null);

  const [initialValues, setInitialValues] = useState({
    partner_profile_img: null as File | null,
    partner_f_name: "",
    partner_l_name: "",
    partner_mobile: "",
    partner_dob: "",
    partner_gender: "",
    partner_city_id: "",
    partner_created_by: "",
    partner_aadhar_front: null as File | null,
    partner_aadhar_back: null as File | null,
    partner_aadhar_no: "",
    partner_wallet: "0",
    partner_pending_wallet_to_comp: "0",
    partner_registration_step: "1",
    referral_referral_by: "",
  });

  useEffect(() => {
    if (isEditMode) {
      fetchPartnerDetails();
    }
  }, [id]);

  const fetchPartnerDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseURL}/partner/fetch_partner_by_id/${id}`);
      const partner = response.data.jsonData.partner;
      console.log("Fetched Partner Details:", partner);

      setInitialValues({
        partner_profile_img: null,
        partner_f_name: partner.partner_f_name || "",
        partner_l_name: partner.partner_l_name || "",
        partner_mobile: partner.partner_mobile || "",
        partner_dob: partner.partner_dob
          ? new Date(partner.partner_dob * 1000).toISOString().split("T")[0]
          : "",
        partner_gender: partner.partner_gender || "",
        partner_city_id: partner.partner_city_id?.toString() || "",
        partner_created_by: partner.partner_created_by || "",
        partner_aadhar_front: null,
        partner_aadhar_back: null,
        partner_aadhar_no: partner.partner_aadhar_no || "",
        partner_wallet: partner.partner_wallet?.toString() || "0",
        partner_pending_wallet_to_comp: partner.partner_pending_wallet_to_comp?.toString() || "0",
        partner_registration_step: partner.partner_registration_step?.toString() || "1",
        referral_referral_by: partner.referral_referral_by || "",
      });

      // Set preview images
      if (partner.partner_profile_img)
        setProfilePreview(`${basePath}/${partner.partner_profile_img}`);
      if (partner.partner_aadhar_front)
        setAadharFrontPreview(`${basePath}/${partner.partner_aadhar_front}`);
      if (partner.partner_aadhar_back)
        setAadharBackPreview(`${basePath}/${partner.partner_aadhar_back}`);
    } catch (err: any) {
      console.error("Error fetching partner details:", err);
      setError(err.response?.data?.message || "Failed to fetch partner details");
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

      // Append basic partner info
      formData.append("partner_f_name", values.partner_f_name);
      formData.append("partner_l_name", values.partner_l_name);
      formData.append("partner_mobile", values.partner_mobile);
      formData.append("partner_dob", values.partner_dob);
      formData.append("partner_gender", values.partner_gender);
      formData.append("partner_city_id", values.partner_city_id);
      formData.append("partner_created_by", values.partner_created_by);
      formData.append("partner_aadhar_no", values.partner_aadhar_no);
      formData.append("partner_wallet", values.partner_wallet);
      formData.append("partner_pending_wallet_to_comp", values.partner_pending_wallet_to_comp);
      formData.append("partner_registration_step", values.partner_registration_step);
      
      if (values.referral_referral_by) {
        formData.append("referral_referral_by", values.referral_referral_by);
      }

      // Append images
      if (values.partner_profile_img)
        formData.append("partner_profile_img", values.partner_profile_img);
      if (values.partner_aadhar_front)
        formData.append("partner_aadhar_front", values.partner_aadhar_front);
      if (values.partner_aadhar_back)
        formData.append("partner_aadhar_back", values.partner_aadhar_back);

      let response;
      if (isEditMode) {
        response = await axios.put(
          `${baseURL}/partner/update_partner/${id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        response = await axios.post(
          `${baseURL}/partner/add_partner`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      if (response.data.status === 201 || response.data.status === 200) {
        navigate("/ambulance/partner");
      }
    } catch (err: any) {
      console.error(`Error ${isEditMode ? "updating" : "adding"} partner:`, err);
      setError(
        err.response?.data?.message ||
          `Failed to ${isEditMode ? "update" : "add"} partner`
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <ComponentCard
        title={isEditMode ? "Edit Partner" : "Add New Partner"}
        className="m-2"
      >
        <div className="text-center py-4">Loading partner details...</div>
      </ComponentCard>
    );
  }

  return (
    <ComponentCard
      title={isEditMode ? "Edit Partner" : "Add New Partner"}
      className="m-2"
    >
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Formik
        initialValues={initialValues}
        validationSchema={partnerValidationSchema}
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
                          <Form.Label className="fs-6 fw-semibold">
                            First Name <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="partner_f_name"
                            value={values.partner_f_name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={
                              touched.partner_f_name && !!errors.partner_f_name
                            }
                            placeholder="Enter first name"
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.partner_f_name}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group>
                          <Form.Label className="fs-6 fw-semibold">
                            Last Name <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="partner_l_name"
                            value={values.partner_l_name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={
                              touched.partner_l_name && !!errors.partner_l_name
                            }
                            placeholder="Enter last name"
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.partner_l_name}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group>
                          <Form.Label className="fs-6 fw-semibold">
                            Mobile Number <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="partner_mobile"
                            value={values.partner_mobile}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={
                              touched.partner_mobile && !!errors.partner_mobile
                            }
                            placeholder="Enter 10-digit mobile number"
                            maxLength={10}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.partner_mobile}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group>
                          <Form.Label className="fs-6 fw-semibold">
                            Date of Birth <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="date"
                            name="partner_dob"
                            value={values.partner_dob}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.partner_dob && !!errors.partner_dob}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.partner_dob}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group>
                          <Form.Label className="fs-6 fw-semibold">
                            Gender <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Select
                            name="partner_gender"
                            value={values.partner_gender}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={
                              touched.partner_gender && !!errors.partner_gender
                            }
                          >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            {errors.partner_gender}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group>
                          <Form.Label className="fs-6 fw-semibold">
                            City <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="number"
                            name="partner_city_id"
                            value={values.partner_city_id}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={
                              touched.partner_city_id && !!errors.partner_city_id
                            }
                            placeholder="Enter city ID"
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.partner_city_id}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group>
                          <Form.Label className="fs-6 fw-semibold">
                            Created By <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Select
                            name="partner_created_by"
                            value={values.partner_created_by}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={
                              touched.partner_created_by &&
                              !!errors.partner_created_by
                            }
                          >
                            <option value="">Select</option>
                            <option value="Self">Self</option>
                            <option value="Admin">Admin</option>
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            {errors.partner_created_by}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group>
                          <Form.Label className="fs-6 fw-semibold">
                            Registration Step <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="number"
                            name="partner_registration_step"
                            value={values.partner_registration_step}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={
                              touched.partner_registration_step &&
                              !!errors.partner_registration_step
                            }
                            placeholder="Enter step (1-5)"
                            min={1}
                            max={5}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.partner_registration_step}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

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
                              handleImageChange(
                                e,
                                "partner_profile_img",
                                setFieldValue,
                                setProfilePreview
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

              {/* Aadhar Information */}
              <Col lg={12}>
                <Card className="border">
                  <Card.Header className="bg-light">
                    <h6 className="mb-0">Aadhar Card Information</h6>
                  </Card.Header>
                  <Card.Body>
                    <Row className="g-3">
                      <Col md={12}>
                        <Form.Group>
                          <Form.Label className="fs-6 fw-semibold">
                            Aadhar Number <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="partner_aadhar_no"
                            value={values.partner_aadhar_no}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={
                              touched.partner_aadhar_no &&
                              !!errors.partner_aadhar_no
                            }
                            placeholder="Enter 12-digit Aadhar number"
                            maxLength={12}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.partner_aadhar_no}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

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
                              handleImageChange(
                                e,
                                "partner_aadhar_front",
                                setFieldValue,
                                setAadharFrontPreview
                              )
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
                              handleImageChange(
                                e,
                                "partner_aadhar_back",
                                setFieldValue,
                                setAadharBackPreview
                              )
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
                    </Row>
                  </Card.Body>
                </Card>
              </Col>

              {/* Wallet Information */}
              <Col lg={12}>
                <Card className="border">
                  <Card.Header className="bg-light">
                    <h6 className="mb-0">Wallet Information</h6>
                  </Card.Header>
                  <Card.Body>
                    <Row className="g-3">
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label className="fs-6 fw-semibold">
                            Wallet Amount <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="number"
                            name="partner_wallet"
                            value={values.partner_wallet}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={
                              touched.partner_wallet && !!errors.partner_wallet
                            }
                            placeholder="Enter wallet amount"
                            min={0}
                            step="0.01"
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.partner_wallet}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group>
                          <Form.Label className="fs-6 fw-semibold">
                            Pending Wallet to Company{" "}
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="number"
                            name="partner_pending_wallet_to_comp"
                            value={values.partner_pending_wallet_to_comp}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={
                              touched.partner_pending_wallet_to_comp &&
                              !!errors.partner_pending_wallet_to_comp
                            }
                            placeholder="Enter pending amount"
                            min={0}
                            step="0.01"
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.partner_pending_wallet_to_comp}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>

              {/* Referral Information */}
              <Col lg={12}>
                <Card className="border">
                  <Card.Header className="bg-light">
                    <h6 className="mb-0">Referral Information</h6>
                  </Card.Header>
                  <Card.Body>
                    <Row className="g-3">
                      <Col md={12}>
                        <Form.Group>
                          <Form.Label className="fs-6 fw-semibold">
                            Referred By (Optional)
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="referral_referral_by"
                            value={values.referral_referral_by}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="Enter referral code or partner ID"
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
                    className="px-3 rounded text-black border-0"
                    type="button"
                    onClick={() => navigate("/ambulance/partner")}
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
                      ? "Update Partner"
                      : "Save Partner"}
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

export default AddPartner;