import React from "react";

interface BookingListProps {
  mode: "add" | "edit";
  data?: any;
  onCancel: () => void;
  onDataChanged: () => void;
}

const BookingList: React.FC<BookingListProps> = ({
  mode,
  data,
  onCancel,
  onDataChanged,
}) => {
    console.log("BulkBooking Props:", { mode, data, onCancel, onDataChanged });

  return (
    <div>BookingList</div>
  )
};

export default BookingList



// import React, { useState, useEffect } from "react";
// import { Form, Button, Row, Col, Card, Alert } from "react-bootstrap";
// import { Formik } from "formik";
// import * as Yup from "yup";
// import ComponentCard from "@/components/ComponentCard";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import "@/global.css";

// interface BookingListProps {
//   mode: "add" | "edit";
//   data?: any;
//   onCancel: () => void;
//   onDataChanged: () => void;
// }

// const bookingValidationSchema = Yup.object({
//   booking_con_name: Yup.string().required("Consumer name is required"),
//   booking_con_mobile: Yup.string()
//     .required("Consumer mobile is required")
//     .matches(/^[0-9]{10}$/, "Mobile number must be 10 digits"),
//   booking_type: Yup.number().required("Booking type is required"),
//   booking_category: Yup.number().required("Category is required"),
//   booking_schedule_time: Yup.string().required("Schedule time is required"),
//   booking_pickup: Yup.string().required("Pickup location is required"),
//   booking_drop: Yup.string().required("Drop location is required"),
//   booking_pickup_city: Yup.string().required("Pickup city is required"),
//   booking_drop_city: Yup.string().required("Drop city is required"),
//   booking_distance: Yup.string().required("Distance is required"),
//   booking_duration: Yup.string().required("Duration is required"),
//   booking_amount: Yup.number().required("Booking amount is required"),
//   booking_payment_method: Yup.string().required("Payment method is required"),
//   booking_payment_type: Yup.string().required("Payment type is required"),
// });

// const BookingList: React.FC<BookingListProps> = ({
//   mode,
//   data,
//   onCancel,
//   onDataChanged,
// }) => {
//   console.log("BookingList Props:", { mode, data, onCancel, onDataChanged });

//   const navigate = useNavigate();
//   const baseURL = (import.meta as any).env?.VITE_PATH ?? "";
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [categories, setCategories] = useState<any[]>([]);

//   const [initialValues, setInitialValues] = useState({
//     // Consumer Information
//     booking_con_name: "",
//     booking_con_mobile: "",
//     booking_by_cid: "",

//     // Booking Information
//     booking_type: "",
//     booking_source: "web",
//     booking_category: "",
//     booking_schedule_time: "",

//     // Location Information
//     booking_pickup: "",
//     booking_drop: "",
//     booking_pickup_city: "",
//     booking_drop_city: "",
//     booking_pick_lat: "",
//     booking_pick_long: "",
//     booking_drop_lat: "",
//     booking_drop_long: "",
//     booking_distance: "",
//     booking_duration: "",
//     booking_duration_in_sec: "",
//     booking_radius: "",

//     // Payment Information
//     booking_amount: "",
//     booking_adv_amount: "",
//     booking_payment_method: "",
//     booking_payment_type: "",
//     booking_payment_status: "0",

//     // Additional fields
//     booking_status: "0",
//     booking_type_for_rental: "",
//     booking_bulk_master_key: "",
//     booking_no_of_bulk: "",
//     booking_bulk_total: "",
//   });

//   useEffect(() => {
//     fetchCategories();
//     if (mode === "edit" && data) {
//       populateEditData();
//     }
//   }, [mode, data]);

//   const fetchCategories = async () => {
//     try {
//       const response = await axios.get(
//         `${baseURL}/ambulance/get_category_list`
//       );
//       setCategories(response.data.jsonData?.category_list || []);
//     } catch (err) {
//       console.error("Error fetching categories:", err);
//     }
//   };

//   const populateEditData = () => {
//     if (!data) return;

//     setInitialValues({
//       booking_con_name: data.booking_con_name || "",
//       booking_con_mobile: data.booking_con_mobile || "",
//       booking_by_cid: data.booking_by_cid?.toString() || "",
//       booking_type: data.booking_type?.toString() || "",
//       booking_source: data.booking_source || "web",
//       booking_category: data.booking_category?.toString() || "",
//       booking_schedule_time: data.booking_schedule_time || "",
//       booking_pickup: data.booking_pickup || "",
//       booking_drop: data.booking_drop || "",
//       booking_pickup_city: data.booking_pickup_city || "",
//       booking_drop_city: data.booking_drop_city || "",
//       booking_pick_lat: data.booking_pick_lat || "",
//       booking_pick_long: data.booking_pick_long || "",
//       booking_drop_lat: data.booking_drop_lat || "",
//       booking_drop_long: data.booking_drop_long || "",
//       booking_distance: data.booking_distance || "",
//       booking_duration: data.booking_duration || "",
//       booking_duration_in_sec: data.booking_duration_in_sec || "",
//       booking_radius: data.booking_radius || "",
//       booking_amount: data.booking_amount || "",
//       booking_adv_amount: data.booking_adv_amount || "",
//       booking_payment_method: data.booking_payment_method || "",
//       booking_payment_type: data.booking_payment_type || "",
//       booking_payment_status: data.booking_payment_status?.toString() || "0",
//       booking_status: data.booking_status?.toString() || "0",
//       booking_type_for_rental: data.booking_type_for_rental?.toString() || "",
//       booking_bulk_master_key: data.booking_bulk_master_key || "",
//       booking_no_of_bulk: data.booking_no_of_bulk?.toString() || "",
//       booking_bulk_total: data.booking_bulk_total?.toString() || "",
//     });
//   };

//   const handleSubmit = async (values: typeof initialValues) => {
//     setSubmitting(true);
//     setError(null);

//     try {
//       const payload = {
//         ...values,
//         booking_type: parseInt(values.booking_type),
//         booking_category: parseInt(values.booking_category),
//         booking_payment_status: parseInt(values.booking_payment_status),
//         booking_status: parseInt(values.booking_status),
//         booking_amount: parseFloat(values.booking_amount),
//         booking_adv_amount: values.booking_adv_amount
//           ? parseFloat(values.booking_adv_amount)
//           : 0,
//       };

//       let response;
//       if (mode === "edit" && data?.booking_id) {
//         response = await axios.put(
//           `${baseURL}/ambulance/edit_booking/${data.booking_id}`,
//           payload
//         );
//       } else {
//         response = await axios.post(
//           `${baseURL}/ambulance/add_booking`,
//           payload
//         );
//       }

//       if (response.data.status === 201 || response.data.status === 200) {
//         onDataChanged();
//         onCancel();
//       }
//     } catch (err: any) {
//       console.error(`Error ${mode === "edit" ? "updating" : "adding"} booking:`, err);
//       setError(
//         err.response?.data?.message ||
//           `Failed to ${mode === "edit" ? "update" : "add"} booking`
//       );
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <ComponentCard
//       title={mode === "edit" ? "Edit Ambulance Booking" : "Add New Booking"}
//       className="m-2"
//     >
//       {error && (
//         <Alert variant="danger" dismissible onClose={() => setError(null)}>
//           {error}
//         </Alert>
//       )}

//       <Formik
//         initialValues={initialValues}
//         validationSchema={bookingValidationSchema}
//         onSubmit={handleSubmit}
//         enableReinitialize
//       >
//         {({
//           values,
//           errors,
//           touched,
//           handleChange,
//           handleBlur,
//           handleSubmit,
//           setFieldValue,
//         }) => (
//           <Form onSubmit={handleSubmit}>
//             <Row className="g-3">
//               {/* Consumer Information */}
//               <Col lg={12}>
//                 <Card className="border">
//                   <Card.Header className="bg-light">
//                     <h6 className="mb-0">Consumer Information</h6>
//                   </Card.Header>
//                   <Card.Body>
//                     <Row className="g-3">
//                       <Col md={4}>
//                         <Form.Group>
//                           <Form.Label className="fs-6 fw-semibold">
//                             Consumer Name <span className="text-danger">*</span>
//                           </Form.Label>
//                           <Form.Control
//                             type="text"
//                             name="booking_con_name"
//                             value={values.booking_con_name}
//                             onChange={handleChange}
//                             onBlur={handleBlur}
//                             isInvalid={
//                               touched.booking_con_name &&
//                               !!errors.booking_con_name
//                             }
//                             placeholder="Enter consumer name"
//                           />
//                           <Form.Control.Feedback type="invalid">
//                             {errors.booking_con_name}
//                           </Form.Control.Feedback>
//                         </Form.Group>
//                       </Col>

//                       <Col md={4}>
//                         <Form.Group>
//                           <Form.Label className="fs-6 fw-semibold">
//                             Consumer Mobile{" "}
//                             <span className="text-danger">*</span>
//                           </Form.Label>
//                           <Form.Control
//                             type="tel"
//                             name="booking_con_mobile"
//                             value={values.booking_con_mobile}
//                             onChange={handleChange}
//                             onBlur={handleBlur}
//                             isInvalid={
//                               touched.booking_con_mobile &&
//                               !!errors.booking_con_mobile
//                             }
//                             placeholder="Enter 10-digit mobile number"
//                             maxLength={10}
//                           />
//                           <Form.Control.Feedback type="invalid">
//                             {errors.booking_con_mobile}
//                           </Form.Control.Feedback>
//                         </Form.Group>
//                       </Col>

//                       <Col md={4}>
//                         <Form.Group>
//                           <Form.Label className="fs-6 fw-semibold">
//                             Consumer ID
//                           </Form.Label>
//                           <Form.Control
//                             type="text"
//                             name="booking_by_cid"
//                             value={values.booking_by_cid}
//                             onChange={handleChange}
//                             onBlur={handleBlur}
//                             placeholder="Consumer ID (optional)"
//                           />
//                         </Form.Group>
//                       </Col>
//                     </Row>
//                   </Card.Body>
//                 </Card>
//               </Col>

//               {/* Booking Information */}
//               <Col lg={12}>
//                 <Card className="border">
//                   <Card.Header className="bg-light">
//                     <h6 className="mb-0">Booking Information</h6>
//                   </Card.Header>
//                   <Card.Body>
//                     <Row className="g-3">
//                       <Col md={3}>
//                         <Form.Group>
//                           <Form.Label className="fs-6 fw-semibold">
//                             Booking Type <span className="text-danger">*</span>
//                           </Form.Label>
//                           <Form.Select
//                             name="booking_type"
//                             value={values.booking_type}
//                             onChange={handleChange}
//                             onBlur={handleBlur}
//                             isInvalid={
//                               touched.booking_type && !!errors.booking_type
//                             }
//                           >
//                             <option value="">Select Type</option>
//                             <option value="0">Regular</option>
//                             <option value="1">Rental</option>
//                             <option value="2">Bulk</option>
//                           </Form.Select>
//                           <Form.Control.Feedback type="invalid">
//                             {errors.booking_type}
//                           </Form.Control.Feedback>
//                         </Form.Group>
//                       </Col>

//                       <Col md={3}>
//                         <Form.Group>
//                           <Form.Label className="fs-6 fw-semibold">
//                             Booking Source
//                           </Form.Label>
//                           <Form.Control
//                             type="text"
//                             name="booking_source"
//                             value={values.booking_source}
//                             onChange={handleChange}
//                             onBlur={handleBlur}
//                             placeholder="e.g., web, mobile, app"
//                           />
//                         </Form.Group>
//                       </Col>

//                       <Col md={3}>
//                         <Form.Group>
//                           <Form.Label className="fs-6 fw-semibold">
//                             Category <span className="text-danger">*</span>
//                           </Form.Label>
//                           <Form.Select
//                             name="booking_category"
//                             value={values.booking_category}
//                             onChange={handleChange}
//                             onBlur={handleBlur}
//                             isInvalid={
//                               touched.booking_category &&
//                               !!errors.booking_category
//                             }
//                           >
//                             <option value="">Select Category</option>
//                             {categories.map((cat) => (
//                               <option
//                                 key={cat.category_id}
//                                 value={cat.category_id}
//                               >
//                                 {cat.category_name}
//                               </option>
//                             ))}
//                           </Form.Select>
//                           <Form.Control.Feedback type="invalid">
//                             {errors.booking_category}
//                           </Form.Control.Feedback>
//                         </Form.Group>
//                       </Col>

//                       <Col md={3}>
//                         <Form.Group>
//                           <Form.Label className="fs-6 fw-semibold">
//                             Schedule Time <span className="text-danger">*</span>
//                           </Form.Label>
//                           <Form.Control
//                             type="datetime-local"
//                             name="booking_schedule_time"
//                             value={values.booking_schedule_time}
//                             onChange={handleChange}
//                             onBlur={handleBlur}
//                             isInvalid={
//                               touched.booking_schedule_time &&
//                               !!errors.booking_schedule_time
//                             }
//                           />
//                           <Form.Control.Feedback type="invalid">
//                             {errors.booking_schedule_time}
//                           </Form.Control.Feedback>
//                         </Form.Group>
//                       </Col>
//                     </Row>
//                   </Card.Body>
//                 </Card>
//               </Col>

//               {/* Location Information */}
//               <Col lg={12}>
//                 <Card className="border">
//                   <Card.Header className="bg-light">
//                     <h6 className="mb-0">Location Information</h6>
//                   </Card.Header>
//                   <Card.Body>
//                     <Row className="g-3">
//                       <Col md={6}>
//                         <Form.Group>
//                           <Form.Label className="fs-6 fw-semibold">
//                             Pickup Location{" "}
//                             <span className="text-danger">*</span>
//                           </Form.Label>
//                           <Form.Control
//                             as="textarea"
//                             rows={2}
//                             name="booking_pickup"
//                             value={values.booking_pickup}
//                             onChange={handleChange}
//                             onBlur={handleBlur}
//                             isInvalid={
//                               touched.booking_pickup && !!errors.booking_pickup
//                             }
//                             placeholder="Enter pickup location"
//                           />
//                           <Form.Control.Feedback type="invalid">
//                             {errors.booking_pickup}
//                           </Form.Control.Feedback>
//                         </Form.Group>
//                       </Col>

//                       <Col md={6}>
//                         <Form.Group>
//                           <Form.Label className="fs-6 fw-semibold">
//                             Drop Location <span className="text-danger">*</span>
//                           </Form.Label>
//                           <Form.Control
//                             as="textarea"
//                             rows={2}
//                             name="booking_drop"
//                             value={values.booking_drop}
//                             onChange={handleChange}
//                             onBlur={handleBlur}
//                             isInvalid={
//                               touched.booking_drop && !!errors.booking_drop
//                             }
//                             placeholder="Enter drop location"
//                           />
//                           <Form.Control.Feedback type="invalid">
//                             {errors.booking_drop}
//                           </Form.Control.Feedback>
//                         </Form.Group>
//                       </Col>

//                       <Col md={3}>
//                         <Form.Group>
//                           <Form.Label className="fs-6 fw-semibold">
//                             Pickup City <span className="text-danger">*</span>
//                           </Form.Label>
//                           <Form.Control
//                             type="text"
//                             name="booking_pickup_city"
//                             value={values.booking_pickup_city}
//                             onChange={handleChange}
//                             onBlur={handleBlur}
//                             isInvalid={
//                               touched.booking_pickup_city &&
//                               !!errors.booking_pickup_city
//                             }
//                             placeholder="Enter pickup city"
//                           />
//                           <Form.Control.Feedback type="invalid">
//                             {errors.booking_pickup_city}
//                           </Form.Control.Feedback>
//                         </Form.Group>
//                       </Col>

//                       <Col md={3}>
//                         <Form.Group>
//                           <Form.Label className="fs-6 fw-semibold">
//                             Drop City <span className="text-danger">*</span>
//                           </Form.Label>
//                           <Form.Control
//                             type="text"
//                             name="booking_drop_city"
//                             value={values.booking_drop_city}
//                             onChange={handleChange}
//                             onBlur={handleBlur}
//                             isInvalid={
//                               touched.booking_drop_city &&
//                               !!errors.booking_drop_city
//                             }
//                             placeholder="Enter drop city"
//                           />
//                           <Form.Control.Feedback type="invalid">
//                             {errors.booking_drop_city}
//                           </Form.Control.Feedback>
//                         </Form.Group>
//                       </Col>

//                       <Col md={3}>
//                         <Form.Group>
//                           <Form.Label className="fs-6 fw-semibold">
//                             Pickup Latitude
//                           </Form.Label>
//                           <Form.Control
//                             type="number"
//                             step="any"
//                             name="booking_pick_lat"
//                             value={values.booking_pick_lat}
//                             onChange={handleChange}
//                             onBlur={handleBlur}
//                             placeholder="Pickup latitude"
//                           />
//                         </Form.Group>
//                       </Col>

//                       <Col md={3}>
//                         <Form.Group>
//                           <Form.Label className="fs-6 fw-semibold">
//                             Pickup Longitude
//                           </Form.Label>
//                           <Form.Control
//                             type="number"
//                             step="any"
//                             name="booking_pick_long"
//                             value={values.booking_pick_long}
//                             onChange={handleChange}
//                             onBlur={handleBlur}
//                             placeholder="Pickup longitude"
//                           />
//                         </Form.Group>
//                       </Col>

//                       <Col md={3}>
//                         <Form.Group>
//                           <Form.Label className="fs-6 fw-semibold">
//                             Drop Latitude
//                           </Form.Label>
//                           <Form.Control
//                             type="number"
//                             step="any"
//                             name="booking_drop_lat"
//                             value={values.booking_drop_lat}
//                             onChange={handleChange}
//                             onBlur={handleBlur}
//                             placeholder="Drop latitude"
//                           />
//                         </Form.Group>
//                       </Col>

//                       <Col md={3}>
//                         <Form.Group>
//                           <Form.Label className="fs-6 fw-semibold">
//                             Drop Longitude
//                           </Form.Label>
//                           <Form.Control
//                             type="number"
//                             step="any"
//                             name="booking_drop_long"
//                             value={values.booking_drop_long}
//                             onChange={handleChange}
//                             onBlur={handleBlur}
//                             placeholder="Drop longitude"
//                           />
//                         </Form.Group>
//                       </Col>

//                       <Col md={3}>
//                         <Form.Group>
//                           <Form.Label className="fs-6 fw-semibold">
//                             Distance (KM) <span className="text-danger">*</span>
//                           </Form.Label>
//                           <Form.Control
//                             type="text"
//                             name="booking_distance"
//                             value={values.booking_distance}
//                             onChange={handleChange}
//                             onBlur={handleBlur}
//                             isInvalid={
//                               touched.booking_distance &&
//                               !!errors.booking_distance
//                             }
//                             placeholder="e.g., 15.5"
//                           />
//                           <Form.Control.Feedback type="invalid">
//                             {errors.booking_distance}
//                           </Form.Control.Feedback>
//                         </Form.Group>
//                       </Col>

//                       <Col md={3}>
//                         <Form.Group>
//                           <Form.Label className="fs-6 fw-semibold">
//                             Duration <span className="text-danger">*</span>
//                           </Form.Label>
//                           <Form.Control
//                             type="text"
//                             name="booking_duration"
//                             value={values.booking_duration}
//                             onChange={handleChange}
//                             onBlur={handleBlur}
//                             isInvalid={
//                               touched.booking_duration &&
//                               !!errors.booking_duration
//                             }
//                             placeholder="e.g., 30 mins"
//                           />
//                           <Form.Control.Feedback type="invalid">
//                             {errors.booking_duration}
//                           </Form.Control.Feedback>
//                         </Form.Group>
//                       </Col>

//                       <Col md={3}>
//                         <Form.Group>
//                           <Form.Label className="fs-6 fw-semibold">
//                             Duration (Seconds)
//                           </Form.Label>
//                           <Form.Control
//                             type="text"
//                             name="booking_duration_in_sec"
//                             value={values.booking_duration_in_sec}
//                             onChange={handleChange}
//                             onBlur={handleBlur}
//                             placeholder="e.g., 1800"
//                           />
//                         </Form.Group>
//                       </Col>

//                       <Col md={3}>
//                         <Form.Group>
//                           <Form.Label className="fs-6 fw-semibold">
//                             Radius
//                           </Form.Label>
//                           <Form.Control
//                             type="text"
//                             name="booking_radius"
//                             value={values.booking_radius}
//                             onChange={handleChange}
//                             onBlur={handleBlur}
//                             placeholder="Search radius"
//                           />
//                         </Form.Group>
//                       </Col>
//                     </Row>
//                   </Card.Body>
//                 </Card>
//               </Col>

//               {/* Payment Information */}
//               <Col lg={12}>
//                 <Card className="border">
//                   <Card.Header className="bg-light">
//                     <h6 className="mb-0">Payment Information</h6>
//                   </Card.Header>
//                   <Card.Body>
//                     <Row className="g-3">
//                       <Col md={4}>
//                         <Form.Group>
//                           <Form.Label className="fs-6 fw-semibold">
//                             Booking Amount{" "}
//                             <span className="text-danger">*</span>
//                           </Form.Label>
//                           <Form.Control
//                             type="number"
//                             step="0.01"
//                             name="booking_amount"
//                             value={values.booking_amount}
//                             onChange={handleChange}
//                             onBlur={handleBlur}
//                             isInvalid={
//                               touched.booking_amount && !!errors.booking_amount
//                             }
//                             placeholder="Enter amount"
//                           />
//                           <Form.Control.Feedback type="invalid">
//                             {errors.booking_amount}
//                           </Form.Control.Feedback>
//                         </Form.Group>
//                       </Col>

//                       <Col md={4}>
//                         <Form.Group>
//                           <Form.Label className="fs-6 fw-semibold">
//                             Advance Amount
//                           </Form.Label>
//                           <Form.Control
//                             type="number"
//                             step="0.01"
//                             name="booking_adv_amount"
//                             value={values.booking_adv_amount}
//                             onChange={handleChange}
//                             onBlur={handleBlur}
//                             placeholder="Advance amount (optional)"
//                           />
//                         </Form.Group>
//                       </Col>

//                       <Col md={4}>
//                         <Form.Group>
//                           <Form.Label className="fs-6 fw-semibold">
//                             Payment Method{" "}
//                             <span className="text-danger">*</span>
//                           </Form.Label>
//                           <Form.Select
//                             name="booking_payment_method"
//                             value={values.booking_payment_method}
//                             onChange={handleChange}
//                             onBlur={handleBlur}
//                             isInvalid={
//                               touched.booking_payment_method &&
//                               !!errors.booking_payment_method
//                             }
//                           >
//                             <option value="">Select Method</option>
//                             <option value="cash">Cash</option>
//                             <option value="online">Online</option>
//                             <option value="card">Card</option>
//                             <option value="wallet">Wallet</option>
//                           </Form.Select>
//                           <Form.Control.Feedback type="invalid">
//                             {errors.booking_payment_method}
//                           </Form.Control.Feedback>
//                         </Form.Group>
//                       </Col>

//                       <Col md={4}>
//                         <Form.Group>
//                           <Form.Label className="fs-6 fw-semibold">
//                             Payment Type <span className="text-danger">*</span>
//                           </Form.Label>
//                           <Form.Select
//                             name="booking_payment_type"
//                             value={values.booking_payment_type}
//                             onChange={handleChange}
//                             onBlur={handleBlur}
//                             isInvalid={
//                               touched.booking_payment_type &&
//                               !!errors.booking_payment_type
//                             }
//                           >
//                             <option value="">Select Type</option>
//                             <option value="prepaid">Prepaid</option>
//                             <option value="postpaid">Postpaid</option>
//                           </Form.Select>
//                           <Form.Control.Feedback type="invalid">
//                             {errors.booking_payment_type}
//                           </Form.Control.Feedback>
//                         </Form.Group>
//                       </Col>

//                       <Col md={4}>
//                         <Form.Group>
//                           <Form.Label className="fs-6 fw-semibold">
//                             Payment Status
//                           </Form.Label>
//                           <Form.Select
//                             name="booking_payment_status"
//                             value={values.booking_payment_status}
//                             onChange={handleChange}
//                             onBlur={handleBlur}
//                           >
//                             <option value="0">Pending</option>
//                             <option value="1">Paid</option>
//                             <option value="2">Failed</option>
//                             <option value="3">Refunded</option>
//                           </Form.Select>
//                         </Form.Group>
//                       </Col>

//                       <Col md={4}>
//                         <Form.Group>
//                           <Form.Label className="fs-6 fw-semibold">
//                             Booking Status
//                           </Form.Label>
//                           <Form.Select
//                             name="booking_status"
//                             value={values.booking_status}
//                             onChange={handleChange}
//                             onBlur={handleBlur}
//                           >
//                             <option value="0">Pending</option>
//                             <option value="1">Accepted</option>
//                             <option value="2">On the Way</option>
//                             <option value="3">Arrived</option>
//                             <option value="4">Started</option>
//                             <option value="5">Completed</option>
//                             <option value="6">Cancelled</option>
//                           </Form.Select>
//                         </Form.Group>
//                       </Col>
//                     </Row>
//                   </Card.Body>
//                 </Card>
//               </Col>

//               {/* Bulk Booking Information - Show only if booking type is Bulk (2) */}
//               {values.booking_type === "2" && (
//                 <Col lg={12}>
//                   <Card className="border">
//                     <Card.Header className="bg-light">
//                       <h6 className="mb-0">Bulk Booking Information</h6>
//                     </Card.Header>
//                     <Card.Body>
//                       <Row className="g-3">
//                         <Col md={4}>
//                           <Form.Group>
//                             <Form.Label className="fs-6 fw-semibold">
//                               Bulk Master Key
//                             </Form.Label>
//                             <Form.Control
//                               type="text"
//                               name="booking_bulk_master_key"
//                               value={values.booking_bulk_master_key}
//                               onChange={handleChange}
//                               onBlur={handleBlur}
//                               placeholder="Enter bulk master key"
//                             />
//                           </Form.Group>
//                         </Col>

//                         <Col md={4}>
//                           <Form.Group>
//                             <Form.Label className="fs-6 fw-semibold">
//                               Number of Bulk
//                             </Form.Label>
//                             <Form.Control
//                               type="number"
//                               name="booking_no_of_bulk"
//                               value={values.booking_no_of_bulk}
//                               onChange={handleChange}
//                               onBlur={handleBlur}
//                               placeholder="Number of bookings"
//                             />
//                           </Form.Group>
//                         </Col>

//                         <Col md={4}>
//                           <Form.Group>
//                             <Form.Label className="fs-6 fw-semibold">
//                               Bulk Total
//                             </Form.Label>
//                             <Form.Control
//                               type="number"
//                               step="0.01"
//                               name="booking_bulk_total"
//                               value={values.booking_bulk_total}
//                               onChange={handleChange}
//                               onBlur={handleBlur}
//                               placeholder="Total bulk amount"
//                             />
//                           </Form.Group>
//                         </Col>
//                       </Row>
//                     </Card.Body>
//                   </Card>
//                 </Col>
//               )}

//               {/* Rental Booking Information - Show only if booking type is Rental (1) */}
//               {values.booking_type === "1" && (
//                 <Col lg={12}>
//                   <Card className="border">
//                     <Card.Header className="bg-light">
//                       <h6 className="mb-0">Rental Booking Information</h6>
//                     </Card.Header>
//                     <Card.Body>
//                       <Row className="g-3">
//                         <Col md={6}>
//                           <Form.Group>
//                             <Form.Label className="fs-6 fw-semibold">
//                               Rental Type
//                             </Form.Label>
//                             <Form.Select
//                               name="booking_type_for_rental"
//                               value={values.booking_type_for_rental}
//                               onChange={handleChange}
//                               onBlur={handleBlur}
//                             >
//                               <option value="">Select Rental Type</option>
//                               <option value="1">Hourly</option>
//                               <option value="2">Daily</option>
//                               <option value="3">Weekly</option>
//                               <option value="4">Monthly</option>
//                             </Form.Select>
//                           </Form.Group>
//                         </Col>
//                       </Row>
//                     </Card.Body>
//                   </Card>
//                 </Col>
//               )}

//               {/* Action Buttons */}
//               <Col lg={12}>
//                 <div className="d-flex gap-2 justify-content-end">
//                   <button
//                     className="px-3 rounded text-black"
//                     onClick={onCancel}
//                     disabled={submitting}
//                     type="button"
//                   >
//                     Cancel
//                   </button>
//                   <Button variant="primary" type="submit" disabled={submitting}>
//                     {submitting
//                       ? mode === "edit"
//                         ? "Updating..."
//                         : "Saving..."
//                       : mode === "edit"
//                       ? "Update Booking"
//                       : "Save Booking"}
//                   </Button>
//                 </div>
//               </Col>
//             </Row>
//           </Form>
//         )}
//       </Formik>
//     </ComponentCard>
//   );
// };

// export default BookingList;