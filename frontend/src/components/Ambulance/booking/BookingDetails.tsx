import React, { useState } from "react";
import { Card, Row, Col, Form, Button, Modal, Spinner } from "react-bootstrap";
import { TbPencil, TbCheck, TbX, TbEye, TbSearch } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "@/global.css";
import DateConversion from "@/components/DateConversion";
import { formatDate } from "@/components/DateFormat";
import Swal from "sweetalert2";
import CancelBookingModal from "./CancelBookingModal";

const baseURL = (import.meta as any).env?.VITE_PATH ?? "";

interface AmbulanceBookingDetailsFormProps {
  data: any;
  onUpdate?: (field: string, value: string) => void;
  editable?: boolean;
}

interface SectionProps {
  title: string;
  children: React.ReactNode;
  titleColor?: string;
}

const Section: React.FC<SectionProps> = ({
  title,
  children,
  titleColor = "primary",
}) => (
  <div className="pb-0 pt-0 mb-0 mt-0">
    <h6 className={`text-${titleColor} mb-2`}>{title}</h6>
    {children}
  </div>
);

interface FieldProps {
  label: string;
  value: string | number | boolean;
  fieldName: string;
  editable?: boolean;
  onEdit?: (value: string) => void;
  type?:
    | "text"
    | "number"
    | "tel"
    | "email"
    | "date"
    | "datetime-local"
    | "textarea"
    | "select"
    | "boolean";
  rows?: number;
  options?: { value: string | number; label: string }[];
  showViewIcon?: boolean;
  consumerId?: number;
  showAssignDriver?: boolean;
  onAssignDriver?: () => void;
  showConsumerSearch?: boolean;
  onConsumerSearch?: () => void;
}

const Field: React.FC<FieldProps> = ({
  label,
  value,
  editable = true,
  onEdit,
  type = "text",
  rows = 3,
  options = [],
  showViewIcon = false,
  consumerId,
  showAssignDriver = false,
  onAssignDriver,
  showConsumerSearch = false,
  onConsumerSearch,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value?.toString() || "");
  const navigate = useNavigate();

  const formatDisplayValue = (val: string | number | boolean) => {
    if (val === null || val === undefined) return " ";

    if (type === "boolean") {
      return val ? "Yes" : "No";
    }

    const valStr = val.toString();

    if (type === "select" && options.length > 0) {
      const option = options.find((opt) => opt.value.toString() === valStr);
      return option ? option.label : valStr;
    }

    if (type === "date" || type === "datetime-local") {
      try {
        if (valStr === "0" || valStr === "" || valStr.trim() === "") {
          return " ";
        }

        const numVal = parseInt(valStr, 10);
        if (!isNaN(numVal) && numVal <= 0) {
          return " ";
        }

        const date = /^\d+$/.test(valStr)
          ? new Date(parseInt(valStr, 10) * 1000)
          : new Date(valStr);

        if (isNaN(date.getTime())) return " ";

        if (
          date.getFullYear() === 1970 &&
          date.getMonth() === 0 &&
          date.getDate() === 1
        ) {
          return " ";
        }

        return formatDate(date.toISOString());
      } catch {
        return "N/A";
      }
    }

    return valStr;
  };

  const displayValue = formatDisplayValue(value);

  const handleSave = () => {
    onEdit?.(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value?.toString() || "");
    setIsEditing(false);
  };

  const handleEditClick = () => {
    if (showConsumerSearch && onConsumerSearch) {
      onConsumerSearch();
    } else {
      setIsEditing(true);
    }
  };

  React.useEffect(() => {
    setEditValue(value?.toString() || "");
  }, [value]);

  return (
    <div className="mb-2">
      <div className="d-flex align-items-center mb-1">
        <Form.Label className="text-muted  mb-0 fs-6">{label}</Form.Label>
        {showAssignDriver && onAssignDriver && (
          <button
            onClick={onAssignDriver}
            className="text-decoration-none border-0 bg-transparent text-secondary p-0 fs-6"
            style={{ marginLeft: "8px" }}
          >
            (Assign Driver)
          </button>
        )}
      </div>
      <div className="d-flex align-items-center gap-2">
        {isEditing ? (
          <>
            {type === "select" ? (
              <Form.Select
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="flex-grow-1"
              >
                {options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Form.Select>
            ) : (
              <Form.Control
                as={type === "textarea" ? "textarea" : "input"}
                type={
                  type !== "textarea" && type !== "boolean" ? type : undefined
                }
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="flex-grow-1"
                {...(type === "textarea" ? { rows } : {})}
              />
            )}
            <button
              onClick={handleSave}
              className="p-1 rounded bg-black text-white"
            >
              <TbCheck size={18} />
            </button>
            <button onClick={handleCancel} className="p-1 rounded border-0">
              <TbX size={18} />
            </button>
          </>
        ) : (
          <div className="d-flex align-items-center flex-grow-1 border rounded">
            <Form.Control
              readOnly
              plaintext
              value={displayValue}
              as={type === "textarea" ? "textarea" : "input"}
              className="flex-grow-1 px-2 input-field"
            />
            {showViewIcon && consumerId && (
              <button
                onClick={() => navigate(`/consumer-details/${consumerId}`)}
                className="text-primary bg-transparent border-0 p-1"
                title="View Consumer Details"
              >
                <TbEye size={18} />
              </button>
            )}
            {editable && onEdit && (
              <button
                onClick={handleEditClick}
                className="text-muted bg-transparent border-0 p-1"
              >
                <TbPencil size={18} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const bookingStatusOptions = [
  { value: 0, label: "Enquiry" },
  { value: 1, label: "Booking Done" },
  { value: 2, label: "Driver Assigned" },
  { value: 3, label: "invoice" },
  { value: 4, label: "complete" },
  { value: 5, label: "Cancel" },
  { value: 6, label: "Future Booking" },
];

const bookingTypeOptions = [
  { value: 0, label: "Regular" },
  { value: 1, label: "Rental" },
  { value: 2, label: "Bulk" },
];

const paymentStatusOptions = [
  { value: 0, label: "Pending" },
  { value: 1, label: "Paid" },
  { value: 2, label: "Failed" },
  { value: 3, label: "Refunded" },
];

const ratingStatus = [
  { value: 0, label: "Rated" },
  { value: 1, label: "Rated Not Submitted" },
];

const ratingCtoDStatus = [
  { value: 0, label: "Rated" },
  { value: 1, label: "No Rating" },
];

// Define field configuration interface
interface FieldConfig {
  label: string;
  name: string;
  type?:
    | "text"
    | "number"
    | "tel"
    | "email"
    | "date"
    | "datetime-local"
    | "textarea"
    | "select"
    | "boolean";
  editable?: boolean;
  cols?: number;
  rows?: number;
  options?: { value: string | number; label: string }[];
  showViewIcon?: boolean;
  showAssignDriver?: boolean;
  showConsumerSearch?: boolean;
}

interface SectionConfig {
  title: string;
  fields: FieldConfig[];
  show?: boolean;
}

interface Consumer {
  consumer_id: number;
  consumer_name: string;
  consumer_mobile_no: string;
  consumer_email_id?: string;
}

interface Vehicle {
  vehicle_id: number;
  v_vehicle_name: string;
  vehicle_rc_number: string;
  vehicle_status: number;
}

const AmbulanceBookingDetailsForm: React.FC<
  AmbulanceBookingDetailsFormProps
> = ({ data, onUpdate, editable = true }) => {
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [selectedDriver, setSelectedDriver] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Consumer Search Modal State
  const [showConsumerSearchModal, setShowConsumerSearchModal] = useState(false);
  const [consumerSearchQuery, setConsumerSearchQuery] = useState("");
  const [consumerSearchResults, setConsumerSearchResults] = useState<
    Consumer[]
  >([]);
  const [searchingConsumer, setSearchingConsumer] = useState(false);

  // Vehicle Search Modal State
  const [vehicleSearchResults, setVehicleSearchResults] = useState<Vehicle[]>(
    []
  );
  const [vehicleSearchQuery, setVehicleSearchQuery] = useState("");
  const [searchingVehicle, setSearchingVehicle] = useState(false);
  const [selectedVehicleData, setSelectedVehicleData] =
    useState<Vehicle | null>(null);

  // Driver data based on selected vehicle
  const [driverData, setDriverData] = useState<any>(null);
  const [loadingDriverData, setLoadingDriverData] = useState(false);

  // Cancel Booking Modal State
  const [showCancelBookingModal, setShowCancelBookingModal] = useState(false);

  const handleFieldUpdate = async (field: string, value: string) => {
    if (data?.booking_id === undefined) {
      alert("Invalid booking ID");
      return;
    }
    if (field === "booking_schedule_time") {
      try {
        await axios.put(
          `${baseURL}/ambulance/update_ambulance_booking_schedule_time/${data?.booking_id}`,
          { booking_schedule_time: value }
        );
        console.log("Schedule time updated successfully");
      } catch (error) {
        console.error("Error updating schedule time:", error);
        alert("Failed to update schedule time");
        return;
      }
    }

    onUpdate?.(field, value);
  };

  const formatDate = (value: string | number) => {
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

  const isBulkBooking = () =>
    data?.booking_type === 2 || data?.booking_type === "2";
  const isRentalBooking = () =>
    data?.booking_type === 1 || data?.booking_type === "1";

  const handleAssignDriver = () => {
    setShowAssignModal(true);
  };

  const handleConsumerSearch = () => {
    setShowConsumerSearchModal(true);
    setConsumerSearchQuery("");
    setConsumerSearchResults([]);
  };

  const searchConsumers = async () => {
    if (!consumerSearchQuery.trim()) {
      alert("Please enter a search term");
      return;
    }

    setSearchingConsumer(true);
    try {
      const response = await axios.get(
        `${baseURL}/ambulance/get_ambulance_consumer_mobile?search=${encodeURIComponent(
          consumerSearchQuery
        )}`
      );
      console.log("Consumer search response:", response.data);
      setConsumerSearchResults(
        response.data?.jsonData?.ambulance_consumer_data || []
      );
    } catch (error) {
      console.error("Error searching consumers:", error);
      alert("Failed to search consumers");
    } finally {
      setSearchingConsumer(false);
    }
  };

  const handleSelectConsumer = async (consumer: Consumer) => {
    try {
      const result = await Swal.fire({
        title: "Update Consumer Details?",
        html: `
        <div class="text-start">
          <p><strong>Name:</strong> ${consumer.consumer_name}</p>
          <p><strong>Mobile:</strong> ${consumer.consumer_mobile_no}</p>
          <p class="text-muted mt-3">This will update the booking consumer details.</p>
        </div>
      `,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, Update",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#3e403e",
        cancelButtonColor: "#9da39e",
        reverseButtons: true,
      });

      if (result.isConfirmed) {
        // Show loading state
        Swal.fire({
          title: "Updating...",
          text: "Please wait while we update the consumer details.",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        // Update consumer details via API
        await axios.put(
          `${baseURL}/ambulance/update_ambulance_booking_consumer_details/${data?.booking_id}`,
          {
            booking_con_name: consumer.consumer_name,
            booking_con_mobile: consumer.consumer_mobile_no,
          }
        );

        // Update local state
        onUpdate?.("booking_con_name", consumer.consumer_name);
        onUpdate?.("booking_con_mobile", consumer.consumer_mobile_no);
        onUpdate?.("booking_by_cid", consumer.consumer_id.toString());

        // Close modal
        setShowConsumerSearchModal(false);
        setConsumerSearchQuery("");
        setConsumerSearchResults([]);

        // Show success message
        Swal.fire({
          title: "Updated!",
          text: "Consumer details have been updated successfully.",
          icon: "success",
          confirmButtonColor: "#3085d6",
          timer: 2000,
          timerProgressBar: true,
        });
      }
    } catch (error) {
      console.error("Error updating consumer details:", error);

      // Show error message
      Swal.fire({
        title: "Error!",
        text: "Failed to update consumer details. Please try again.",
        icon: "error",
        confirmButtonColor: "#d33",
      });
    }
  };

  const searchVehicles = async () => {
    if (!vehicleSearchQuery.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Search Required",
        text: "Please enter a vehicle RC number to search",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    setSearchingVehicle(true);
    try {
      const response = await axios.get(
        `${baseURL}/ambulance/get_ambulance_vehicle_number?search=${encodeURIComponent(
          vehicleSearchQuery
        )}`
      );
      console.log("Vehicle search response:", response.data);

      const vehicles =
        response.data?.jsonData?.ambulance_vehicle_name_number || [];

      if (vehicles.length === 0) {
        Swal.fire({
          icon: "info",
          title: "No Results",
          text: "No vehicles found matching your search",
          confirmButtonColor: "#3085d6",
        });
      }

      setVehicleSearchResults(vehicles);
    } catch (error) {
      console.error("Error searching vehicles:", error);
      Swal.fire({
        icon: "error",
        title: "Search Failed",
        text: "Failed to search vehicles. Please try again.",
        confirmButtonColor: "#d33",
      });
    } finally {
      setSearchingVehicle(false);
    }
  };

  const fetchDriverDataByVehicleId = async (vehicleId: number) => {
    setLoadingDriverData(true);
    try {
      const response = await axios.get(
        `${baseURL}/ambulance/ambulance_driver_partner_data_by_vehicleId/${vehicleId}`
      );
      console.log("Driver data response:", response.data);

      const driverInfo = response.data?.jsonData?.ambulance_driver_partner_data;

      if (driverInfo) {
        setDriverData(driverInfo);
        setSelectedDriver(driverInfo.assign_id?.toString() || "");
      } else {
        setDriverData(null);
        setSelectedDriver("");
        Swal.fire({
          icon: "warning",
          title: "No Driver Found",
          text: "No driver assigned to this vehicle",
          confirmButtonColor: "#3085d6",
        });
      }
    } catch (error) {
      console.error("Error fetching driver data:", error);
      setDriverData(null);
      setSelectedDriver("");
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch driver details",
        confirmButtonColor: "#d33",
      });
    } finally {
      setLoadingDriverData(false);
    }
  };

  const handleSelectVehicle = async (vehicle: Vehicle) => {
    try {
      const result = await Swal.fire({
        title: "Select Vehicle?",
        html: `
          <div class="text-start">
            <p><strong>Vehicle Name:</strong> ${vehicle.v_vehicle_name}</p>
            <p><strong>RC Number:</strong> ${vehicle.vehicle_rc_number}</p>
            <p class="text-muted mt-3">This will fetch the driver details for this vehicle.</p>
          </div>
        `,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, Select",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        reverseButtons: true,
      });

      if (result.isConfirmed) {
        setSelectedVehicleData(vehicle);
        setSelectedVehicle(vehicle.vehicle_id.toString());

        // Clear vehicle search results
        setVehicleSearchResults([]);
        setVehicleSearchQuery("");

        // Fetch driver data for this vehicle
        await fetchDriverDataByVehicleId(vehicle.vehicle_id);
      }
    } catch (error) {
      console.error("Error selecting vehicle:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to select vehicle",
        confirmButtonColor: "#d33",
      });
    }
  };

  const handleSubmitAssign = async () => {
    if (!selectedVehicle || !selectedDriver) {
      Swal.fire({
        icon: "warning",
        title: "Missing Information",
        text: "Please select both vehicle and driver",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    try {
      const result = await Swal.fire({
        title: "Confirm Assignment",
        html: `
          <div class="text-start">
            <p><strong>Vehicle:</strong> ${
              selectedVehicleData?.v_vehicle_name || "N/A"
            }</p>
            <p><strong>RC Number:</strong> ${
              selectedVehicleData?.vehicle_rc_number || "N/A"
            }</p>
            <p><strong>Driver:</strong> ${driverData?.assign_name || "N/A"} ${
          driverData?.assign_last_name || ""
        }</p>
            <p><strong>Driver Mobile:</strong> ${
              driverData?.assign_mobile || "N/A"
            }</p>
          </div>
        `,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, Assign",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        reverseButtons: true,
      });

      if (result.isConfirmed) {
        setSubmitting(true);

        // Show loading
        Swal.fire({
          title: "Assigning...",
          text: "Please wait while we assign the driver and vehicle.",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        // TODO: Replace with actual API call
        // await axios.put(
        //   `${baseURL}/ambulance/assign_driver_vehicle/${data?.booking_id}`,
        //   {
        //     vehicle_id: selectedVehicle,
        //     driver_id: selectedDriver,
        //   }
        // );

        console.log("Assigning:", {
          vehicle: selectedVehicle,
          driver: selectedDriver,
          booking_id: data?.booking_id,
          vehicleData: selectedVehicleData,
          driverData: driverData,
        });

        // Update local state
        if (onUpdate) {
          onUpdate("booking_acpt_vehicle_id", selectedVehicle);
          onUpdate("booking_acpt_driver_id", selectedDriver);
          onUpdate("v_vehicle_name", selectedVehicleData?.v_vehicle_name || "");
          onUpdate(
            "vehicle_rc_number",
            selectedVehicleData?.vehicle_rc_number || ""
          );
          onUpdate("driver_name", driverData?.assign_name || "");
          onUpdate("driver_last_name", driverData?.assign_last_name || "");
          onUpdate("driver_mobile", driverData?.assign_mobile || "");
        }

        // Close modal and reset
        setShowAssignModal(false);
        setSelectedVehicle("");
        setSelectedDriver("");
        setSelectedVehicleData(null);
        setDriverData(null);
        setVehicleSearchResults([]);
        setVehicleSearchQuery("");

        // Show success
        Swal.fire({
          icon: "success",
          title: "Assigned!",
          text: "Driver and vehicle have been assigned successfully.",
          confirmButtonColor: "#3085d6",
          timer: 2000,
          timerProgressBar: true,
        });
      }
    } catch (error) {
      console.error("Error assigning driver:", error);
      Swal.fire({
        icon: "error",
        title: "Assignment Failed",
        text: "Failed to assign driver and vehicle. Please try again.",
        confirmButtonColor: "#d33",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelBooking = () => {
    setShowCancelBookingModal(true);
  };

  const handleBookingCancelled = () => {
    // Refresh booking data or update status
    if (onUpdate) {
      onUpdate("booking_status", "5"); 
    }
    // You may want to reload the entire page or fetch fresh data
    window.location.reload();
  };

  const sections: SectionConfig[] = [
    {
      title: "Consumer Information",
      fields: [
        {
          label: "Consumer Name",
          name: "booking_con_name",
          editable: true,
          cols: 2,
          showViewIcon: true,
          showConsumerSearch: true,
        },
        {
          label: "Consumer Mobile",
          name: "booking_con_mobile",
          type: "tel",
          editable: true,
          cols: 2,
          showConsumerSearch: true,
        },
        { label: "OTP", name: "booking_view_otp", editable: false, cols: 2 },
        {
          label: "OTP Status",
          name: "booking_view_status_otp",
          type: "boolean",
          editable: false,
          cols: 2,
        },
        {
          label: "Rating Status (Driver to Consumer)",
          name: "booking_view_rating_status",
          type: "select",
          options: ratingStatus,
          editable: false,
          cols: 2,
        },
        {
          label: "Consumer to Driver Rating Status",
          name: "booking_view_rating_c_to_d_status",
          type: "select",
          options: ratingCtoDStatus,
          editable: false,
          cols: 2,
        },
      ],
    },
    {
      title: "Booking Information",
      fields: [
        {
          label: "Booking Type",
          name: "booking_type",
          type: "select",
          options: bookingTypeOptions,
          editable: false,
          cols: 2,
        },
        {
          label: "Booking Source",
          name: "booking_source",
          editable: false,
          cols: 2,
        },
        {
          label: "Generate Source",
          name: "booking_generate_source",
          editable: false,
          cols: 2,
        },
        {
          label: "Category",
          name: "booking_view_category_name",
          editable: false,
          cols: 2,
        },
        {
          label: "Schedule Time",
          name: "booking_schedule_time",
          type: "datetime-local",
          editable: true,
          cols: 2,
        },
        {
          label: "Created At",
          name: "created_at",
          type: "datetime-local",
          editable: false,
          cols: 2,
        },
      ],
    },
    {
      title: "Location Information",
      fields: [
        {
          label: "Pickup Location",
          name: "booking_pickup",
          type: "text",
          editable: false,
          cols: 6,
        },
        {
          label: "Drop Location",
          name: "booking_drop",
          type: "text",
          editable: false,
          cols: 6,
        },
        {
          label: "Pickup City",
          name: "booking_pickup_city",
          editable: false,
          cols: 3,
        },
        {
          label: "Drop City",
          name: "booking_drop_city",
          editable: false,
          cols: 3,
        },
        {
          label: "Distance (KM)",
          name: "booking_distance",
          editable: false,
          cols: 3,
        },
        {
          label: "Duration",
          name: "booking_duration",
          editable: false,
          cols: 3,
        },
        // {
        //   label: "Duration (Sec)",
        //   name: "booking_duration_in_sec",
        //   editable: false,
        //   cols: 3,
        // },
        // { label: "Radius", name: "booking_radius", editable: false, cols: 3 },
      ],
    },
    {
      title: "Payment Information",
      fields: [
        {
          label: "Total Amount",
          name: "booking_total_amount",
          type: "number",
          editable: true,
          cols: 2,
        },
        {
          label: "Booking Amount",
          name: "booking_amount",
          type: "number",
          editable: true,
          cols: 2,
        },
        {
          label: "Advance Amount",
          name: "booking_adv_amount",
          type: "number",
          editable: true,
          cols: 2,
        },
        {
          label: "Payment Method",
          name: "booking_payment_method",
          editable: true,
          cols: 2,
        },
        {
          label: "Payment Type",
          name: "booking_payment_type",
          editable: true,
          cols: 2,
        },
        {
          label: "Payment Status",
          name: "booking_payment_status",
          type: "select",
          options: paymentStatusOptions,
          cols: 2,
        },
        {
          label: "Base Rate",
          name: "booking_view_base_rate",
          type: "number",
          editable: false,
          cols: 2,
        },
        {
          label: "Per KM Rate",
          name: "booking_view_per_km_rate",
          type: "number",
          editable: false,
          cols: 2,
        },
        {
          label: "KM Rate",
          name: "booking_view_km_rate",
          type: "number",
          editable: false,
          cols: 2,
        },
        {
          label: "KM Till",
          name: "booking_view_km_till",
          editable: false,
          cols: 2,
        },
        {
          label: "Per Extra KM Rate",
          name: "booking_view_per_ext_km_rate",
          type: "number",
          editable: false,
          cols: 2,
        },
        {
          label: "Per Extra Min Rate",
          name: "booking_view_per_ext_min_rate",
          type: "number",
          editable: false,
          cols: 2,
        },
        {
          label: "Service Charge",
          name: "booking_view_service_charge_rate",
          type: "number",
          editable: false,
          cols: 2,
        },
        {
          label: "Service Charge Discount",
          name: "booking_view_service_charge_rate_discount",
          type: "number",
          editable: false,
          cols: 2,
        },
        {
          label: "Total Fare",
          name: "booking_view_total_fare",
          type: "number",
          editable: false,
          cols: 2,
        },
      ],
    },
    {
      title: "Vehicle & Driver Information",
      fields: [
        { label: "Vehicle", name: "v_vehicle_name", editable: false, cols: 3 },
        {
          label: "Vehicle RC",
          name: "vehicle_rc_number",
          editable: false,
          cols: 3,
        },
        {
          label: "Driver Name",
          name: "driver_full_name",
          editable: false,
          cols: 3,
          showAssignDriver: true,
        },
        {
          label: "Driver Mobile",
          name: "driver_mobile",
          editable: false,
          cols: 3,
        },
        {
          label: "Accept Time",
          name: "booking_acpt_time",
          type: "datetime-local",
          editable: false,
          cols: 3,
        },
        // {
        //   label: "Arrival to Pickup Duration (Sec)",
        //   name: "booking_a_t_p_duration_in_sec",
        //   editable: false,
        //   cols: 3,
        // },
        {
          label: "Arrival to Pickup Distance",
          name: "booking_ap_distance",
          editable: false,
          cols: 3,
        },
        {
          label: "Arrival to Pickup Duration",
          name: "booking_ap_duration",
          editable: false,
          cols: 3,
        },
      ],
    },
    {
      title: "Bulk Booking Information",
      show: isBulkBooking(),
      fields: [
        {
          label: "Bulk Master Key",
          name: "booking_bulk_master_key",
          editable: false,
          cols: 4,
        },
        {
          label: "No. of Bulk",
          name: "booking_no_of_bulk",
          editable: false,
          cols: 4,
        },
        {
          label: "Bulk Total",
          name: "booking_bulk_total",
          type: "number",
          editable: false,
          cols: 4,
        },
      ],
    },
    {
      title: "Rental Booking Information",
      show: isRentalBooking(),
      fields: [
        {
          label: "Rental Type",
          name: "booking_type_for_rental",
          editable: false,
          cols: 6,
        },
      ],
    },
    {
      title: "Additional Information",
      fields: [
        {
          label: "Arrival Time",
          name: "booking_view_arrival_time",
          type: "datetime-local",
          editable: false,
          cols: 3,
        },
        {
          label: "Pickup Time",
          name: "booking_view_pickup_time",
          type: "datetime-local",
          editable: false,
          cols: 3,
        },
        {
          label: "Dropped Time",
          name: "booking_view_dropped_time",
          type: "datetime-local",
          editable: false,
          cols: 3,
        },
        {
          label: "Shoot Time",
          name: "bv_shoot_time",
          type: "datetime-local",
          editable: false,
          cols: 3,
        },
        {
          label: "Virtual Number",
          name: "bv_virtual_number",
          type: "tel",
          editable: false,
          cols: 3,
        },
        {
          label: "Virtual Number Status",
          name: "bv_virtual_number_status",
          type: "boolean",
          editable: false,
          cols: 3,
        },
        {
          label: "Cloud Consumer CRID",
          name: "bv_cloud_con_crid",
          editable: false,
          cols: 3,
        },
        {
          label: "Cloud Consumer CRID (C to D)",
          name: "bv_cloud_con_crid_c_to_d",
          editable: false,
          cols: 3,
        },
        {
          label: "Includes",
          name: "booking_view_includes",
          type: "text",
          cols: 3,
        },
      ],
    },
  ];
  

  return (
    <div>
      <Card className="mb-4 detailPage-header">
        <Card.Body className="py-3 d-flex flex-wrap align-items-center gap-3 justify-content-center">
          <div>
            <span className="h4 fw-semibold fs-4">Booking ID:</span>{" "}
            <strong className="fs-4 text-muted">
              {data?.booking_id || "N/A"}
            </strong>
          </div>
          <div>
            <span className="h4 fs-4 fw-semibold">Schedule Date:</span>{" "}
            <strong className="fs-4 text-muted">
              {formatDate(data?.booking_schedule_time)}
            </strong>
          </div>
          <div>
            <span className="h4 fs-4 fw-semibold">Status:</span>{" "}
            <strong className="fs-4">
              {(() => {
                const status = data?.booking_status;
                const statusOption = bookingStatusOptions.find(
                  (opt) => opt.value.toString() === status?.toString()
                );
                const statusText = statusOption?.label || "Unknown";
                const statusClass =
                  status === 0 || status === "0"
                    ? "text-warning"
                    : status === 1 || status === "1"
                    ? "text-info"
                    : status === 2 || status === "2"
                    ? "text-primary"
                    : status === 3 || status === "3"
                    ? "text-secondary"
                    : status === 4 || status === "4"
                    ? "text-info"
                    : status === 5 || status === "5"
                    ? "text-success"
                    : status === 6 || status === "6"
                    ? "text-danger"
                    : "text-muted";
                return <span className={statusClass}>{statusText}</span>;
              })()}
            </strong>
          </div>
        </Card.Body>
      </Card>

      {sections.map((section, idx) => {
        if (section.show === false) return null;

        return (
          <Card className="mb-4" key={idx}>
            <Card.Body>
              <Section title={section.title}>
                <Row>
                  {section.fields.map((f) => (
                    <Col lg={f.cols || 4} md={6} key={f.name}>
                      <Field
                        label={f.label}
                        value={
                          f.name === "driver_full_name"
                            ? `${data?.driver_name || ""} ${
                                data?.driver_last_name || ""
                              }`.trim() || "N/A"
                            : data?.[f.name]
                        }
                        fieldName={f.name}
                        editable={editable && f.editable !== false}
                        onEdit={(value) => handleFieldUpdate(f.name, value)}
                        type={f.type}
                        rows={f.rows}
                        options={f.options}
                        showViewIcon={f.showViewIcon}
                        consumerId={
                          f.showViewIcon ? data?.booking_by_cid : undefined
                        }
                        showAssignDriver={f.showAssignDriver}
                        onAssignDriver={
                          f.showAssignDriver ? handleAssignDriver : undefined
                        }
                        showConsumerSearch={f.showConsumerSearch}
                        onConsumerSearch={
                          f.showConsumerSearch
                            ? handleConsumerSearch
                            : undefined
                        }
                      />
                    </Col>
                  ))}
                </Row>
              </Section>
            </Card.Body>
          </Card>
        );
      })}

      <Card className="mb-4">
        <Card.Body>
          <Section title="">
            <Button
              variant=""
              className="me-2 mb-2 bg-light"
              onClick={handleCancelBooking}
            >
              Cancel Booking
            </Button>
            <Button variant="" className="me-2 mb-2  bg-light">
              Verify OTP
            </Button>
            <Button variant="" className="me-2 mb-2  bg-light">
              Complete Booking
            </Button>
            <Button
              variant=""
              className="me-2 mb-2  bg-light"
              onClick={handleAssignDriver}
            >
              Assign Driver
            </Button>
          </Section>
        </Card.Body>
      </Card>

      {/* Consumer Search Modal */}
      <Modal
        show={showConsumerSearchModal}
        onHide={() => setShowConsumerSearchModal(false)}
        centered
        size="sm"
      >
        <Modal.Header closeButton>
          <Modal.Title>Search Consumer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              searchConsumers();
            }}
          >
            <div className="d-flex gap-2 mb-3">
              <Form.Control
                type="text"
                placeholder="Search by mobile number..."
                value={consumerSearchQuery}
                onChange={(e) => setConsumerSearchQuery(e.target.value)}
              />
            </div>
          </Form>

          {searchingConsumer ? (
            <div className="text-center py-4">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2">Searching...</p>
            </div>
          ) : consumerSearchResults.length > 0 ? (
            <div
              className="table-responsive"
              style={{ maxHeight: "300px", overflowY: "auto" }}
            >
              {consumerSearchResults.map((consumer) => (
                <div key={consumer.consumer_id}>
                  <div
                    className="d-flex justify-content-between align-items-center border px-2 rounded-2 mb-2 hover:shadow-sm cursor-pointer"
                    onClick={() => handleSelectConsumer(consumer)}
                    style={{ cursor: "pointer" }}
                  >
                    <Form.Control
                      readOnly
                      plaintext
                      value={consumer.consumer_name || ""}
                      className="flex-grow-1 mb-0"
                      title={consumer.consumer_name}
                    />
                    <Form.Control
                      readOnly
                      plaintext
                      value={consumer.consumer_mobile_no || ""}
                      className="ms-3 mb-0"
                      title={consumer.consumer_mobile_no}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : consumerSearchQuery && !searchingConsumer ? (
            <div className="text-center text-muted py-4">
              No consumers found. Try a different search term.
            </div>
          ) : (
            <div className="text-center text-muted py-4">
              Enter mobile number to search for consumers.
            </div>
          )}
        </Modal.Body>
      </Modal>

      {/* Assign Driver Modal */}
      <Modal
        show={showAssignModal}
        onHide={() => {
          setShowAssignModal(false);
          setVehicleSearchResults([]);
          setVehicleSearchQuery("");
          setSelectedVehicle("");
          setSelectedDriver("");
          setSelectedVehicleData(null);
          setDriverData(null);
        }}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Assign Vehicle & Driver</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Vehicle Search Section */}
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              searchVehicles();
            }}
          >
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">
                Enter Vehicle RC Number
              </Form.Label>
              <div className="d-flex gap-2">
                <Form.Control
                  type="text"
                  placeholder="Enter vehicle RC number..."
                  className="text-uppercase"
                  value={vehicleSearchQuery}
                  onChange={(e) => setVehicleSearchQuery(e.target.value)}
                  disabled={!!selectedVehicleData}
                />
                <Button
                  variant="primary"
                  onClick={searchVehicles}
                  disabled={searchingVehicle || !!selectedVehicleData}
                >
                  {searchingVehicle ? (
                    <Spinner size="sm" animation="border" />
                  ) : (
                    <TbSearch size={20} />
                  )}
                </Button>
              </div>
            </Form.Group>

            {/* Vehicle Search Results */}
            {searchingVehicle ? (
              <div className="text-center border border-2">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2 mb-0">Searching vehicles...</p>
              </div>
            ) : vehicleSearchResults.length > 0 ? (
              <div className="mb-3">
                <div style={{ maxHeight: "400px" }}>
                  <Row className="g-3">
                    {vehicleSearchResults.map((vehicle) => (
                      <Col md={12} key={vehicle.vehicle_id}>
                        <div
                          className="border-2 border-primary w-100 cursor-pointer"
                          onClick={() => handleSelectVehicle(vehicle)}
                        >
                          <div className="p-1 px-2 mb-1  hover-shadow rounded-2">
                            <div className="d-flex justify-content-between align-items-start">
                              <div>
                                <h5 className=" fw-bold">
                                  {vehicle.vehicle_rc_number} (
                                  {vehicle.v_vehicle_name})
                                </h5>
                              </div>
                              <span
                                className={`badge ${
                                  vehicle.vehicle_status === 1
                                    ? "text-success"
                                    : "text-danger"
                                }`}
                              >
                                {vehicle.vehicle_status === 1
                                  ? "Active"
                                  : "Inactive"}
                              </span>
                            </div>

                            <div className="">
                              <div className="d-flex justify-content-between">
                                <span className="text-muted small">
                                  Vehicle ID:
                                </span>
                                <span className="fw-semibold small">
                                  {vehicle.vehicle_id}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <hr className="mt-0" />
                      </Col>
                    ))}
                  </Row>
                </div>
              </div>
            ) : null}

            {/* Selected Vehicle Display */}
            {selectedVehicleData && (
              <div className="mb-2 bg-light p-2 rounded-2 d-flex justify-content-between align-items-start">
                <div className="">
                  <h6 className="mb-1">Selected Vehicle</h6>
                  <p className="mb-1">
                    <strong>Name:</strong> {selectedVehicleData.v_vehicle_name}
                  </p>
                  <p className="mb-0">
                    <strong>RC Number:</strong>{" "}
                    {selectedVehicleData.vehicle_rc_number}
                  </p>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  className="p-1 btn btn-out mt-3"
                  onClick={() => {
                    setSelectedVehicleData(null);
                    setSelectedVehicle("");
                    setDriverData(null);
                    setSelectedDriver("");
                  }}
                >
                  Change Vehicle
                </Button>
              </div>
            )}

            {/* Driver Information Display */}
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Assigned Driver</Form.Label>
              {loadingDriverData ? (
                <div className="text-center py-3">
                  <Spinner animation="border" variant="primary" size="sm" />
                  <p className="mt-2 mb-0 small">Loading driver details...</p>
                </div>
              ) : driverData ? (
                <div className="alert alert-success mb-0">
                  <p className="mb-1">
                    <strong>Name:</strong> {driverData.assign_name}{" "}
                    {driverData.assign_last_name}
                  </p>
                  <p className="mb-0">
                    <strong>Mobile:</strong> {driverData.assign_mobile}
                  </p>
                </div>
              ) : selectedVehicleData ? (
                <div className="alert alert-warning mb-0">
                  No driver assigned to this vehicle
                </div>
              ) : (
                <div className="text-muted small">
                  Select a vehicle to view driver details
                </div>
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setShowAssignModal(false);
              setVehicleSearchResults([]);
              setVehicleSearchQuery("");
              setSelectedVehicle("");
              setSelectedDriver("");
              setSelectedVehicleData(null);
              setDriverData(null);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmitAssign}
            disabled={submitting || !selectedVehicle || !selectedDriver}
          >
            {submitting ? (
              <>
                <Spinner size="sm" animation="border" className="me-2" />
                Assigning...
              </>
            ) : (
              "Assign Driver & Vehicle"
            )}
          </Button>
        </Modal.Footer>
      </Modal>



      <CancelBookingModal
        show={showCancelBookingModal}
        onHide={() => setShowCancelBookingModal(false)}
        bookingId={data?.booking_id || ""}
        onBookingCancelled={handleBookingCancelled}
      />
    </div>
  );
};

export default AmbulanceBookingDetailsForm;
