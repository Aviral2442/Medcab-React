import axios from 'axios';
import React from 'react';
import { Container, Spinner, Card, Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import DateConversion from '@/components/DateConversion';
import DetailPage from '@/components/DetailPage';

type BookingDetailsProps = {
    booking_id?: string;
    bookingStatus?: string;
    booking_a_t_p_duration_in_sec?: number | null;
    booking_acpt_driver_id?: string | null;
    booking_acpt_time?: string | null;
    booking_acpt_vehicle_id?: string | null;
    booking_adv_amount?: number | null;
    booking_amount?: number | null;
    booking_ap_distance?: number | null;
    booking_ap_duration?: number | null;
    booking_ap_polilyne?: string | null;
    booking_bulk_master_key?: string | null;
    booking_bulk_total?: number | null;
    booking_by_cid?: string | null;
    booking_category?: string | null;
    booking_con_mobile?: string | null;
    booking_con_name?: string | null;
    booking_distance?: number | null;
    booking_drop?: string | null;
    booking_drop_city?: string | null;
    booking_drop_lat?: number | null;
    booking_drop_long?: number | null;
    booking_duration?: string | null;
    booking_duration_in_sec?: number | null;
    booking_generate_source?: string | null;
    booking_no_of_bulk?: number | null;
    booking_payment_method?: string | null;
    booking_payment_status?: string | null;
    booking_payment_type?: string | null;
    booking_pick_lat?: number | null;
    booking_pick_long?: number | null;
    booking_pickup?: string | null;
    booking_pickup_city?: string | null;
    booking_polyline?: string | null;
    booking_radius?: number | null;
    booking_schedule_time?: string | null;
    booking_source?: string | null;
    booking_status?: string | null;
    booking_total_amount?: number | null;
    booking_type?: string | null;
    booking_type_for_rental?: string | null;
    booking_user_id?: string | null;
    booking_view_arrival_time?: string | null;
    booking_view_base_rate?: number | null;
    booking_view_category_icon?: string | null;
    booking_view_category_name?: string | null;
    booking_view_dropped_time?: string | null;
    booking_view_includes?: string | null;
    booking_view_km_rate?: number | null;
    booking_view_km_till?: number | null;
    booking_view_otp?: string | null;
    booking_view_per_ext_km_rate?: number | null;
    booking_view_per_ext_min_rate?: number | null;
    booking_view_per_km_rate?: number | null;
    booking_view_pickup_time?: string | null;
    booking_view_rating_c_to_d_status?: boolean | null;
    booking_view_rating_status?: boolean | null;
    booking_view_service_charge_rate?: number | null;
    booking_view_service_charge_rate_discount?: number | null;
    booking_view_status_otp?: boolean | null;
    booking_view_total_fare?: number | null;
    bv_cloud_con_crid?: string | null;
    bv_cloud_con_crid_c_to_d?: string | null;
    bv_shoot_time?: string | null;
    bv_virtual_number?: string | null;
    bv_virtual_number_status?: boolean | null;
    created_at?: string | null;
    created_at_unix?: number | null;
};

const bookingStatusOptions = [
  { value: "0", label: "Active" },
  { value: "1", label: "Inactive" },
];

const paymentStatusOptions = [
  { value: "1", label: "Not Paid" },
  { value: "2", label: "Paid" },
  { value: "3", label: "Advance" },
];

const bookingTypeOptions = [
  { value: "0", label: "Regular" },
  { value: "1", label: "Rental" },
  { value: "2", label: "Bulk" },
];

const BookingDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [bookingDetails, setBookingDetails] = React.useState<BookingDetailsProps | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);

  const baseURL = (import.meta as any).env?.VITE_PATH ?? "";

  const fetchAmbulanceBookingDetails = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${baseURL}/ambulance/ambulance_booking_detail/${id}`);
      console.log("Ambulance Booking Details:", res.data);
      setBookingDetails(res.data.jsonData?.booking_detail);
    } catch (error) {
      console.error("Error fetching ambulance booking details:", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchAmbulanceBookingDetails();
  }, [id]);

  const handleFieldUpdate = (field: string, value: string) => {
    console.log(`Update ${field} to:`, value);
    // Implement your update logic here
    // You can make an API call to update the field
  };

  const formatDate = (value: string | number | null | undefined) => {
    if (!value && value !== 0) return "N/A";
    const valStr = value.toString();

    try {
      const date = /^\d+$/.test(valStr)
        ? new Date(parseInt(valStr) * 1000)
        : new Date(valStr);

      if (isNaN(date.getTime())) return valStr;
      return DateConversion(date.toISOString());
    } catch {
      return valStr;
    }
  };

    const isBulkBooking = () => {
    if (!bookingDetails) return false;
    const type = bookingDetails.booking_type?.toString().toLowerCase();
    const category = bookingDetails.booking_category?.toString();
    console.log("Checking bulk:", { type, category });
    return type === "bulk" || type === "2" || category === "2";
  };

  const isRentalBooking = () => {
    if (!bookingDetails) return false;
    const type = bookingDetails.booking_type?.toString().toLowerCase();
    const category = bookingDetails.booking_category?.toString();
    console.log("Checking rental:", { type, category });
    return type === "rental" || type === "1" || category === "1";
  };

  // Define sections with field configurations
  const sections = [
    {
      title: "Consumer Information",
      fields: [
        { label: "Consumer Name", name: "booking_con_name", editable: false, cols: 4 },
        { label: "Consumer Mobile", name: "booking_con_mobile", type: "tel" as const, editable: false, cols: 4 },
        { label: "Consumer ID", name: "booking_by_cid", editable: false, cols: 4 },
      ],
    },
    {
      title: "Booking Information",
      fields: [
        { label: "Booking Type", name: "booking_type", type: "select" as const, options: bookingTypeOptions, editable: false, cols: 4 },
        { label: "Booking Source", name: "booking_source", editable: false, cols: 4 },
        { label: "Generate Source", name: "booking_generate_source", editable: false, cols: 4 },
        { label: "Category", name: "booking_view_category_name", editable: false, cols: 4 },
        { label: "Schedule Time", name: "booking_schedule_time", type: "datetime-local" as const, editable: false, cols: 4 },
        { label: "Created At", name: "created_at", type: "datetime-local" as const, editable: false, cols: 4 },
      ],
    },
    {
      title: "Location Information",
      fields: [
        { label: "Pickup Location", name: "booking_pickup", type: "textarea" as const, rows: 2, cols: 6 },
        { label: "Pickup City", name: "booking_pickup_city", cols: 3 },
        { label: "Pickup Latitude", name: "booking_pick_lat", type: "number" as const, editable: false, cols: 3 },
        { label: "Pickup Longitude", name: "booking_pick_long", type: "number" as const, editable: false, cols: 3 },
        { label: "Drop Location", name: "booking_drop", type: "textarea" as const, rows: 2, cols: 6 },
        { label: "Drop City", name: "booking_drop_city", cols: 3 },
        { label: "Drop Latitude", name: "booking_drop_lat", type: "number" as const, editable: false, cols: 3 },
        { label: "Drop Longitude", name: "booking_drop_long", type: "number" as const, editable: false, cols: 3 },
        { label: "Distance (KM)", name: "booking_distance", cols: 3 },
        { label: "Duration", name: "booking_duration", cols: 3 },
        { label: "Duration (Sec)", name: "booking_duration_in_sec", editable: false, cols: 3 },
        { label: "Radius", name: "booking_radius", cols: 3 },
      ],
    },
    {
      title: "Payment Information",
      fields: [
        { label: "Total Amount", name: "booking_total_amount", type: "number" as const, editable: false, cols: 3 },
        { label: "Booking Amount", name: "booking_amount", type: "number" as const, editable: false, cols: 3 },
        { label: "Advance Amount", name: "booking_adv_amount", type: "number" as const, cols: 3 },
        { label: "Payment Method", name: "booking_payment_method", editable: false, cols: 3 },
        { label: "Payment Type", name: "booking_payment_type", editable: false, cols: 3 },
        { label: "Payment Status", name: "booking_payment_status", type: "select" as const, options: paymentStatusOptions, cols: 3 },
      ],
    },
    {
      title: "Vehicle & Driver Information",
      fields: [
        { label: "Vehicle ID", name: "booking_acpt_vehicle_id", editable: false, cols: 4 },
        { label: "Driver ID", name: "booking_acpt_driver_id", editable: false, cols: 4 },
        { label: "Accept Time", name: "booking_acpt_time", type: "datetime-local" as const, editable: false, cols: 4 },
        { label: "Arrival to Pickup Duration (Sec)", name: "booking_a_t_p_duration_in_sec", editable: false, cols: 4 },
        { label: "Arrival to Pickup Distance", name: "booking_ap_distance", editable: false, cols: 4 },
        { label: "Arrival to Pickup Duration", name: "booking_ap_duration", editable: false, cols: 4 },
      ],
    },
    {
      title: "Rate Information",
      fields: [
        { label: "Base Rate", name: "booking_view_base_rate", type: "number" as const, editable: false, cols: 2 },
        { label: "Per KM Rate", name: "booking_view_per_km_rate", type: "number" as const, editable: false, cols: 2 },
        { label: "KM Rate", name: "booking_view_km_rate", type: "number" as const, editable: false, cols: 2 },
        { label: "KM Till", name: "booking_view_km_till", editable: false, cols: 2 },
        { label: "Per Extra KM Rate", name: "booking_view_per_ext_km_rate", type: "number" as const, editable: false, cols: 2 },
        { label: "Per Extra Min Rate", name: "booking_view_per_ext_min_rate", type: "number" as const, editable: false, cols: 2 },
        { label: "Service Charge", name: "booking_view_service_charge_rate", type: "number" as const, editable: false, cols: 2 },
        { label: "Service Charge Discount", name: "booking_view_service_charge_rate_discount", type: "number" as const, editable: false, cols: 2 },
        { label: "Total Fare", name: "booking_view_total_fare", type: "number" as const, editable: false, cols: 2 },
      ],
    },
    {
      title: "OTP & Verification",
      fields: [
        { label: "OTP", name: "booking_view_otp", editable: false, cols: 3 },
        { label: "OTP Status", name: "booking_view_status_otp", type: "boolean" as const, editable: false, cols: 3 },
        { label: "Rating Status", name: "booking_view_rating_status", type: "boolean" as const, editable: false, cols: 3 },
        { label: "Consumer to Driver Rating Status", name: "booking_view_rating_c_to_d_status", type: "boolean" as const, editable: false, cols: 3 },
      ],
    },
    {
      title: "Bulk Booking Information",
      show: isBulkBooking(),
      fields: [
        { label: "Bulk Master Key", name: "booking_bulk_master_key", editable: false, cols: 4 },
        { label: "No. of Bulk", name: "booking_no_of_bulk", editable: false, cols: 4 },
        { label: "Bulk Total", name: "booking_bulk_total", type: "number" as const, editable: false, cols: 4 },
      ],
    },
    {
      title: "Rental Booking Information",
      show: isRentalBooking(),
      fields: [
        { label: "Rental Type", name: "booking_type_for_rental", editable: false, cols: 6 },
      ],
    },
    {
      title: "Additional Information",
      fields: [
        { label: "Arrival Time", name: "booking_view_arrival_time", type: "datetime-local" as const, editable: false, cols: 4 },
        { label: "Pickup Time", name: "booking_view_pickup_time", type: "datetime-local" as const, editable: false, cols: 4 },
        { label: "Dropped Time", name: "booking_view_dropped_time", type: "datetime-local" as const, editable: false, cols: 4 },
        { label: "Shoot Time", name: "bv_shoot_time", type: "datetime-local" as const, editable: false, cols: 4 },
        { label: "Virtual Number", name: "bv_virtual_number", type: "tel" as const, editable: false, cols: 4 },
        { label: "Virtual Number Status", name: "bv_virtual_number_status", type: "boolean" as const, editable: false, cols: 4 },
        { label: "Cloud Consumer CRID", name: "bv_cloud_con_crid", editable: false, cols: 4 },
        { label: "Cloud Consumer CRID (C to D)", name: "bv_cloud_con_crid_c_to_d", editable: false, cols: 4 },
        { label: "Category Icon", name: "booking_view_category_icon", editable: false, cols: 4 },
        { label: "Includes", name: "booking_view_includes", type: "textarea" as const, rows: 3, cols: 6 },
      ],
    },
  ];

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (!bookingDetails) {
    return (
      <Container className="py-4">
        <Card>
          <Card.Body className="text-center">
            <p className="text-muted">No booking details found</p>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      {/* Booking Header */}
      <Card className="mb-4 detailPage-header">
        <Card.Body className="py-3 d-flex flex-wrap align-items-center gap-3 justify-content-center">
          <div>
            <span className="h4 fw-semibold fs-4">Booking ID:</span>{" "}
            <strong className="fs-4 text-muted">
              {bookingDetails?.booking_id || "N/A"}
            </strong>
          </div>
          <div>
            <span className="h4 fs-4 fw-semibold">Schedule Time:</span>{" "}
            <strong className="fs-4 text-muted">
              {formatDate(bookingDetails?.booking_schedule_time)}
            </strong>
          </div>
          <div>
            <span className="h4 fs-4 fw-semibold">Status:</span>{" "}
            <strong className="fs-4">
              {(() => {
                const status = bookingDetails?.booking_status;
                const statusOption = bookingStatusOptions.find(
                  (opt) => opt.value === status?.toString()
                );
                const statusText = statusOption?.label || "Unknown";
                const statusClass =
                  status === "0"
                    ? "text-secondary"
                    : status === "1"
                    ? "text-primary"
                    : status === "2"
                    ? "text-info"
                    : status === "3"
                    ? "text-warning"
                    : status === "4"
                    ? "text-success"
                    : status === "5"
                    ? "text-danger"
                    : "text-muted";
                return <span className={statusClass}>{statusText}</span>;
              })()}
            </strong>
          </div>
        </Card.Body>
      </Card>

      {/* Detail Sections */}
      <DetailPage
        data={bookingDetails}
        sections={sections}
        onUpdate={handleFieldUpdate}
        editable={true}
      />

      {/* Action Buttons */}
      <Card className="mb-4">
        <Card.Body>
          <div className="d-flex flex-wrap gap-2">
            <Button variant="" className="bg-light text-dark">
              Cancel Booking
            </Button>
            <Button variant="secondary">
              OTP Match
            </Button>
            <Button variant="success">
              Complete
            </Button>
            <Button variant="info">
              Assign Driver
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default BookingDetails;