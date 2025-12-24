import React, { useState } from "react";
import { Card, Row, Col, Form, Button, Modal, Spinner } from "react-bootstrap";
import { TbPencil, TbCheck, TbX, TbEye } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import "@/global.css";
import { formatDate } from "@/components/DateFormat";
import Swal from "sweetalert2";
import CancelBookingModal from "./CancelBookingModal";
import { jwtDecode } from "jwt-decode";
import BookingDetailsApiData from "./BookingDetailsApiData";
import { GoDotFill } from "react-icons/go";

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
            (
            {value && value.toString().trim() && value !== "N/A"
              ? "Update Assign Driver"
              : "Assign Driver"}
            )
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
                style={{ minWidth: 0 }}
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
                style={{
                  minWidth: 0,
                  ...(type === "datetime-local" && {
                    maxWidth: "calc(100% - 80px)",
                  }),
                }}
                {...(type === "textarea" ? { rows } : {})}
              />
            )}
            <button
              onClick={handleSave}
              className="p-1 rounded bg-black text-white flex-shrink-0"
              style={{ minWidth: "32px", height: "32px" }}
            >
              <TbCheck size={18} />
            </button>
            <button
              onClick={handleCancel}
              className="p-1 rounded border-0 flex-shrink-0"
              style={{ minWidth: "32px", height: "32px" }}
            >
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
              style={{ minWidth: 0 }}
            />
            {showViewIcon && consumerId && (
              <button
                onClick={() => navigate(`/consumer-details/${consumerId}`)}
                className="text-primary bg-transparent border-0 p-1 flex-shrink-0"
                title="View Consumer Details"
              >
                <TbEye size={18} />
              </button>
            )}
            {editable && onEdit && (
              <button
                onClick={handleEditClick}
                className="text-muted bg-transparent border-0 p-1 flex-shrink-0"
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

//1 for full payment ,2 for advance payment, 3 for Zero Pay
const paymentMethodOptions = [
  { value: 1, label: "Full Payment" },
  { value: 2, label: "Advance Payment" },
  { value: 3, label: "Zero Pay" },
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
  vehicle_added_type: number;
  assign_id: number;
  assign_name: string;
  assign_last_name: string;
  assign_mobile: string;
  assign_type: string;
}

const AmbulanceBookingDetailsForm: React.FC<
  AmbulanceBookingDetailsFormProps
> = ({ data, onUpdate, editable = true }) => {
  // Initialize API data
  const api = BookingDetailsApiData();

  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showConsumerSearchModal, setShowConsumerSearchModal] = useState(false);
  const [consumerSearchQuery, setConsumerSearchQuery] = useState("");
  const [consumerSearchResults, setConsumerSearchResults] = useState<
    Consumer[]
  >([]);
  const [searchingConsumer, setSearchingConsumer] = useState(false);
  const [vehicleSearchResults, setVehicleSearchResults] = useState<Vehicle[]>(
    []
  );
  const [vehicleSearchQuery, setVehicleSearchQuery] = useState("");
  const [searchingVehicle, setSearchingVehicle] = useState(false);
  const [selectedVehicleData, setSelectedVehicleData] =
    useState<Vehicle | null>(null);
  const [_driverData, setDriverData] = useState<any>(null);
  const [showCancelBookingModal, setShowCancelBookingModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [invoiceData, setInvoiceData] = useState<any>(null);
  const [loadingInvoice, setLoadingInvoice] = useState(false);

  const handleFieldUpdate = async (field: string, value: string) => {
    if (data?.booking_id === undefined) {
      alert("Invalid booking ID");
      return;
    }

    // Handle schedule time update
    if (field === "booking_schedule_time") {
      const result = await api.updateScheduleTime(data.booking_id, value);
      if (!result.success) {
        alert(result.message);
        return;
      }
    }

    // Handle payment fields update
    const paymentFields = [
      "booking_amount",
      "booking_adv_amount",
      "booking_total_amount",
      "booking_view_base_rate",
      "booking_view_km_till",
      "booking_view_per_km_rate",
      "booking_view_per_ext_km_rate",
      "booking_view_per_ext_min_rate",
      "booking_view_km_rate",
      "booking_view_total_fare",
      "booking_view_service_charge_rate",
      "booking_view_service_charge_rate_discount",
    ];

    if (paymentFields.includes(field)) {
      const result = await api.updatePaymentDetails(
        data.booking_id,
        value,
        field
      );
      if (!result.success) {
        alert(result.message);
        return;
      }
    }

    // Update local state
    onUpdate?.(field, value);
  };

  const searchConsumers = async (query: string) => {
    if (!query.trim()) {
      setConsumerSearchResults([]);
      return;
    }

    setSearchingConsumer(true);
    const result = await api.searchConsumers(query);
    setConsumerSearchResults(result.data);
    setSearchingConsumer(false);
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
        Swal.fire({
          title: "Updating...",
          text: "Please wait while we update the consumer details.",
          allowOutsideClick: false,
          didOpen: () => Swal.showLoading(),
        });

        const apiResult = await api.updateConsumerDetails(
          data?.booking_id,
          consumer.consumer_name,
          consumer.consumer_mobile_no
        );

        if (apiResult.success) {
          onUpdate?.("booking_con_name", consumer.consumer_name);
          onUpdate?.("booking_con_mobile", consumer.consumer_mobile_no);
          onUpdate?.("booking_by_cid", consumer.consumer_id.toString());

          setShowConsumerSearchModal(false);
          setConsumerSearchQuery("");
          setConsumerSearchResults([]);

          Swal.fire({
            title: "Updated!",
            text: "Consumer details have been updated successfully.",
            icon: "success",
            confirmButtonColor: "#3085d6",
            timer: 2000,
            timerProgressBar: true,
          });
        } else {
          throw new Error(apiResult.message);
        }
      }
    } catch (error: any) {
      console.error("Error updating consumer details:", error);
      Swal.fire({
        title: "Error!",
        text:
          error.message ||
          "Failed to update consumer details. Please try again.",
        icon: "error",
        confirmButtonColor: "#d33",
      });
    }
  };

  const searchVehicles = async (query: string) => {
    if (!query.trim()) {
      setVehicleSearchResults([]);
      return;
    }

    setSearchingVehicle(true);
    const result = await api.searchVehicles(query);
    setVehicleSearchResults(result.data);
    setSearchingVehicle(false);
  };

  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (vehicleSearchQuery) {
        searchVehicles(vehicleSearchQuery);
      } else {
        setVehicleSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [vehicleSearchQuery]);

  const handleSelectVehicle = async (vehicle: Vehicle) => {
    try {
      const result = await Swal.fire({
        title: "Assign Vehicle & Driver?",
        html: `
        <div class="text-start">
          <p><strong>Vehicle:</strong> ${vehicle.v_vehicle_name}</p>
          <p><strong>RC Number:</strong> ${vehicle.vehicle_rc_number}</p>
          <p><strong>${vehicle.assign_type}:</strong>
            ${vehicle.assign_name} ${vehicle.assign_last_name}
          </p>
          <p><strong>Mobile:</strong> ${vehicle.assign_mobile}</p>
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

      if (!result.isConfirmed) return;

      Swal.fire({
        title: "Assigning...",
        text: "Please wait while we assign the driver and vehicle.",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const adminId = 1; // TODO: Get from auth context

      const apiResult = await api.assignDriver(
        data?.booking_id,
        vehicle.assign_id,
        vehicle.vehicle_id,
        adminId
      );

      if (apiResult.success) {
        onUpdate?.("booking_acpt_vehicle_id", vehicle.vehicle_id.toString());
        onUpdate?.("booking_acpt_driver_id", vehicle.assign_id.toString());
        onUpdate?.("v_vehicle_name", vehicle.v_vehicle_name);
        onUpdate?.("vehicle_rc_number", vehicle.vehicle_rc_number);
        onUpdate?.("driver_name", vehicle.assign_name);
        onUpdate?.("driver_last_name", vehicle.assign_last_name);
        onUpdate?.("driver_mobile", vehicle.assign_mobile);
        onUpdate?.("booking_status", "2");

        setShowAssignModal(false);
        setVehicleSearchResults([]);
        setVehicleSearchQuery("");

        Swal.fire({
          icon: "success",
          title: "Assigned Successfully",
          text: "Driver and vehicle have been assigned.",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        throw new Error(apiResult.message);
      }
    } catch (error: any) {
      console.error("Assignment failed:", error);
      Swal.fire({
        icon: "error",
        title: "Assignment Failed",
        text: error.message || "Unable to assign vehicle and driver.",
      });
    }
  };

  const isBulkBooking = () =>
    data?.booking_type === 2 || data?.booking_type === "2";
  const isRentalBooking = () =>
    data?.booking_type === 1 || data?.booking_type === "1";

  const verifyOTP = async () => {
    if (!data?.booking_id) {
      Swal.fire({
        title: "Error",
        text: "Invalid booking ID",
        icon: "error",
        confirmButtonColor: "#d33",
      });
      return;
    }

    try {
      const result = await Swal.fire({
        title: "Verify OTP?",
        text: "Are you sure you want to verify the OTP for this booking?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, Verify",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        reverseButtons: true,
      });

      if (!result.isConfirmed) return;

      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token not found");

      const decodedToken = jwtDecode(token) as any;
      const adminId = decodedToken?.id;

      if (!adminId) throw new Error("Admin ID not found in token");

      Swal.fire({
        title: "Verifying OTP...",
        text: "Please wait",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const apiResult = await api.verifyOTP(data.booking_id, adminId);

      if (apiResult.success && apiResult.data.status == 200) {
        onUpdate?.("booking_view_status_otp", "1");

        Swal.fire({
          title: "Success",
          text: "OTP verified successfully.",
          icon: "success",
          confirmButtonColor: "#3085d6",
          timer: 2000,
          timerProgressBar: true,
        });
      } else {
        throw new Error(apiResult.message || "OTP verification failed");
      }
    } catch (error: any) {
      console.error("Error verifying OTP:", error);
      Swal.fire({
        title: "Error",
        text: error.message || "Failed to verify OTP. Please try again.",
        icon: "error",
        confirmButtonColor: "#d33",
      });
    }
  };

  const completeBooking = async () => {
    if (!data?.booking_id) {
      Swal.fire({
        title: "Error",
        text: "Invalid booking ID",
        icon: "error",
        confirmButtonColor: "#d33",
      });
      return;
    }

    try {
      const result = await Swal.fire({
        title: "Complete Booking?",
        text: "Are you sure you want to complete this booking?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, Complete",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        reverseButtons: true,
      });

      if (!result.isConfirmed) return;

      Swal.fire({
        title: "Completing Booking...",
        text: "Please wait",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const apiResult = await api.completeBooking(data.booking_id);

      if (apiResult.success && apiResult.data.status == 200) {
        onUpdate?.("booking_status", "4");
        onUpdate?.("booking_payment_status", "2");
        onUpdate?.("booking_payment_method", "2");

        Swal.fire({
          title: "Success",
          text: "Booking completed successfully.",
          icon: "success",
          confirmButtonColor: "#3085d6",
          timer: 2000,
          timerProgressBar: true,
        });
      } else {
        throw new Error(apiResult.message || "Booking completion failed");
      }
    } catch (error: any) {
      console.error("Error completing booking:", error);
      Swal.fire({
        title: "Error",
        text: error.message || "Failed to complete booking. Please try again.",
        icon: "error",
        confirmButtonColor: "#d33",
      });
    }
  };

  const handleAssignDriver = () => {
    setShowAssignModal(true);
  };

  const handlegenerateInvoice = async () => {
    if (!data?.booking_id) {
      Swal.fire({
        title: "Error",
        text: "Invalid booking ID",
        icon: "error",
        confirmButtonColor: "#d33",
      });
      return;
    }
    try {
      const result = await Swal.fire({
        title: "Generate Invoice?",
        text: "Are you sure you want to generate invoice for this booking?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, Generate",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        reverseButtons: true,
      });
      if (!result.isConfirmed) return;

      Swal.fire({
        title: "Generating Invoice...",
        text: "Please wait",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const totalAmounts = Number(data.booking_total_amount || 0);
      const advance_amounts = Number(data.booking_adv_amount || 0);
      const extra_km = Number(data?.booking_view_per_ext_km_rate || 0);
      const extra_hour = Number(data?.booking_view_per_ext_min_rate || 0);

      const apiResult = await api.generateInvoice(
        data.booking_id,
        totalAmounts,
        advance_amounts,
        extra_km,
        extra_hour
      );

      if (apiResult.success) {
        Swal.fire({
          title: "Success!",
          text: "Invoice generated successfully",
          icon: "success",
          confirmButtonColor: "#3085d6",
          timer: 2000,
          timerProgressBar: true,
        });
        // Optionally refresh booking data or open invoice
        if (onUpdate) {
          onUpdate("booking_status", "3"); // Update to invoice status
        }
      } else {
        Swal.fire({
          title: "Error!",
          text: apiResult.message || "Failed to generate invoice",
          icon: "error",
          confirmButtonColor: "#d33",
        });
      }
    } catch (error: any) {
      console.error("Error in handlegenerateInvoice:", error);
      Swal.fire({
        title: "Error!",
        text: error.message || "Failed to generate invoice. Please try again.",
        icon: "error",
        confirmButtonColor: "#d33",
      });
    }
  };

  const handleRemoveAssignDriver = async () => {
    if (!data?.booking_id) {
      Swal.fire({
        title: "Error",
        text: "Invalid booking ID",
        icon: "error",
        confirmButtonColor: "#d33",
      });
      return;
    }
    try {
      const result = await Swal.fire({
        title: "Remove Assigned Driver?",
        text: "Are you sure you want to remove the assigned driver from this booking?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, Remove",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        reverseButtons: true,
      });
      if (!result.isConfirmed) return;

      Swal.fire({
        title: "Removing Assigned Driver...",
        text: "Please wait",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });
      const apiResult = await api.cancelAssignDriver(data.booking_id);
      if (apiResult.success && apiResult.data.status == 200) {
        onUpdate?.("booking_acpt_vehicle_id", "");
        onUpdate?.("booking_acpt_driver_id", "");
        onUpdate?.("v_vehicle_name", "");
        onUpdate?.("vehicle_rc_number", "");
        onUpdate?.("driver_name", "");
        onUpdate?.("driver_last_name", "");
        onUpdate?.("driver_mobile", "");
        onUpdate?.("booking_status", "1");
        Swal.fire({
          title: "Success",
          text: "Assigned driver has been removed successfully.",
          icon: "success",
          confirmButtonColor: "#3085d6",
          timer: 2000,
          timerProgressBar: true,
        });
      }
    } catch (error: any) {
      console.error("Error removing assigned driver:", error);
      Swal.fire({
        title: "Error",
        text:
          error.message ||
          "Failed to remove assigned driver. Please try again.",
        icon: "error",
        confirmButtonColor: "#d33",
      });
    }
  };

  const handleInvoiceData = async () => {
    if (!data?.booking_id) {
      Swal.fire({
        title: "Error!",
        text: "Invalid booking ID",
        icon: "error",
        confirmButtonColor: "#d33",
      });
      return;
    }
    try {
      setLoadingInvoice(true);
      const result = await api.fetchInvoiceData(data.booking_id);

      if (result.success && result.data) {
        console.log("Fetched Invoice Data:", result.data[0]);
        setInvoiceData(result.data[0]);
        setShowInvoiceModal(true);
      } else {
        Swal.fire({
          title: "Error!",
          text: result.message || "Failed to fetch invoice data",
          icon: "error",
          confirmButtonColor: "#d33",
        });
      }
    } catch (error: any) {
      console.error("Error fetching invoice data:", error);
      Swal.fire({
        title: "Error!",
        text: error.message || "Failed to fetch invoice data",
        icon: "error",
        confirmButtonColor: "#d33",
      });
    } finally {
      setLoadingInvoice(false);
    }
  };

  const handleConsumerSearch = () => {
    setShowConsumerSearchModal(true);
    setConsumerSearchQuery("");
    setConsumerSearchResults([]);
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



  const handlePrint = () => {
    const content = document.getElementById("invoice-content");
    if (!content) return;

    // Create a new window for printing
    const printWindow = window.open("", "", "width=800,height=600");

    if (!printWindow) {
      alert("Please allow popups to print the invoice");
      return;
    }

    // Get all stylesheets from the current page
    const styles = Array.from(document.styleSheets)
      .map((styleSheet) => {
        try {
          return Array.from(styleSheet.cssRules)
            .map((rule) => rule.cssText)
            .join("\n");
        } catch (e) {
          // Handle CORS issues with external stylesheets
          return "";
        }
      })
      .join("\n");

    // Write the content to the new window
    printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Invoice</title>
        <link 
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" 
          rel="stylesheet"
        >
        <style>
          ${styles}
          
          @page {
            size: A4;
            margin: 12mm;
            margin-top: 0;
            margin-bottom: 0;
          }

          body {
            margin: 0;
            padding: 20px;
            background: #fff;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          }

          .watermark-container {
            position: relative;
            min-height: 100vh;
          }

          .invoice-watermark {
            position: fixed;
            top: 50%;
            left: 50%;
            width: 400px;
            opacity: 0.08;
            transform: translate(-50%, -50%);
            z-index: 0;
            pointer-events: none;
          }

          .invoice-pdf > *:not(.invoice-watermark) {
            position: relative;
            z-index: 1;
          }

          @media print {
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
              padding: 0;
            }

            /* Hide browser print headers/footers */
            @page {
              margin-top: 0;
              margin-bottom: 0;
            }

            /* Remove default browser header/footer content */
            body::before,
            body::after {
              content: none !important;
              display: none !important;
            }

            html::before,
            html::after {
              content: none !important;
              display: none !important;
            }

            .invoice-watermark {
              position: fixed;
              top: 45%;
              left: 50%;
              transform: translate(-50%, -50%);
              opacity: 0.08;
              width: 300px;
              z-index: -1;
            }

            /* Ensure table borders print */
            table {
              border-collapse: collapse !important;
            }

            th, td {
              border: 1px solid #dee2e6 !important;
            }

            .table-bordered {
              border: 1px solid #dee2e6 !important;
            }

            /* Ensure backgrounds print */
            .table-light {
              background-color: #f8f9fa !important;
            }

            /* Page breaks */
            .invoice-pdf {
              page-break-inside: avoid;
            }
          }
        </style>
      </head>
      <body>
        ${content.innerHTML}
      </body>
    </html>
  `);

    printWindow.document.close();

    // Wait for images to load before printing
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      }, 250);
    };

    // Fallback if onload doesn't fire
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }, 500);
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
          label: "Rating Status (D-C)",
          name: "booking_view_rating_status",
          type: "select",
          options: ratingStatus,
          editable: false,
          cols: 2,
        },
        {
          label: "Rating Status (C-D)",
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
          label: "Created At",
          name: "created_at",
          type: "datetime-local",
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
          editable: false,
          type: "select",
          options: [
            { value: 1, label: "Cash" },
            { value: 2, label: "Online" },
          ],
          cols: 2,
        },
        {
          label: "Payment Type",
          name: "booking_payment_type",
          editable: false,
          type: "select",
          options: paymentMethodOptions,
          cols: 2,
        },
        {
          label: "Payment Status",
          name: "booking_payment_status",
          type: "select",
          editable: false,
          options: paymentStatusOptions,
          cols: 2,
        },
        {
          label: "Base Rate",
          name: "booking_view_base_rate",
          type: "number",
          editable: true,
          cols: 2,
        },
        {
          label: "Per KM Rate",
          name: "booking_view_per_km_rate",
          type: "number",
          editable: true,
          cols: 2,
        },
        {
          label: "KM Rate",
          name: "booking_view_km_rate",
          type: "number",
          editable: true,
          cols: 2,
        },
        {
          label: "KM Till",
          name: "booking_view_km_till",
          editable: true,
          cols: 2,
        },
        {
          label: "Per Extra KM Rate",
          name: "booking_view_per_ext_km_rate",
          type: "number",
          editable: true,
          cols: 2,
        },
        {
          label: "Per Extra Min Rate",
          name: "booking_view_per_ext_min_rate",
          type: "number",
          editable: true,
          cols: 2,
        },
        {
          label: "Service Charge",
          name: "booking_view_service_charge_rate",
          type: "number",
          editable: true,
          cols: 2,
        },
        {
          label: "Service Charge Discount",
          name: "booking_view_service_charge_rate_discount",
          type: "number",
          editable: true,
          cols: 2,
        },
        {
          label: "Total Fare",
          name: "booking_view_total_fare",
          type: "number",
          editable: true,
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
                    ? "text-secondary"
                    : status === 1 || status === "1"
                    ? "text-primary"
                    : status === 2 || status === "2"
                    ? "text-info"
                    : status === 3 || status === "3"
                    ? "text-warning"
                    : status === 4 || status === "4"
                    ? "text-success"
                    : status === 5 || status === "5"
                    ? "text-danger"
                    : status === 6 || status === "6"
                    ? "text-dark"
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

      {/* buttons  */}
      <Card className="mb-4">
        <Card.Body>
          <Section title="">
            <Button
              variant=""
              className="me-2 mb-2 bg-light"
              onClick={handleCancelBooking}
              disabled={
                data?.booking_status === "5" &&
                data?.booking_status === "0" &&
                data?.booking_status === "4"
              }
            >
              {data?.booking_status == 5
                ? "Booking Cancelled"
                : "Cancel Booking"}
            </Button>
            <Button
              variant=""
              className="me-2 mb-2 bg-light"
              onClick={verifyOTP}
              disabled={data?.booking_view_status_otp === "0"}
            >
              {data?.booking_view_status_otp === "0"
                ? "OTP Verified"
                : "Verify OTP"}
            </Button>
            <Button
              variant=""
              className="me-2 mb-2 bg-light"
              onClick={completeBooking}
              disabled={data?.booking_status === "4"}
            >
              {data?.booking_status === "4"
                ? "Booking Completed"
                : "Complete Booking"}
            </Button>
            <Button
              variant=""
              className="me-2 mb-2  bg-light"
              onClick={handleAssignDriver}
            >
              {data?.booking_acpt_driver_id === "0"
                ? "Assign Driver"
                : "Reassign Driver"}
            </Button>
            <Button
              variant=""
              className="me-2 mb-2  bg-light"
              onClick={handleRemoveAssignDriver}
              disabled={data?.booking_acpt_driver_id === "0"}
            >
              {data?.booking_acpt_driver_id !== "0"
                ? "Remove Assigned Driver"
                : "No Driver Assigned"}
            </Button>
            <Button
              variant=""
              className="me-2 mb-2  bg-light"
              onClick={handlegenerateInvoice}
              // disabled={!data?.booking_id}
            >
              Generate Invoice
            </Button>
            <Button
              variant=""
              className="me-2 mb-2  bg-light"
              onClick={handleInvoiceData}
              disabled={loadingInvoice}
            >
              {loadingInvoice ? "Loading..." : "View Invoice"}
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
              searchConsumers(consumerSearchQuery);
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
          setSelectedVehicleData(null);
          setDriverData(null);
        }}
        centered
        size="sm"
      >
        <Modal.Header closeButton>
          <Modal.Title>Assign Vehicle & Driver</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Vehicle Search Section */}
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              searchVehicles(vehicleSearchQuery);
            }}
          >
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">
                Search by Driver/Partner Mobile Number
              </Form.Label>
              <div className="d-flex gap-2">
                <Form.Control
                  type="text"
                  placeholder="Enter RC number..."
                  value={vehicleSearchQuery}
                  onChange={(e) => setVehicleSearchQuery(e.target.value)}
                  disabled={!!selectedVehicleData}
                  className="text-uppercase"
                />
              </div>
            </Form.Group>

            {/* Vehicle Search Results */}
            {searchingVehicle ? (
              <div className="text-center">
                <Spinner animation="border" variant="primary" />
                <p className="mb-0">Searching...</p>
              </div>
            ) : vehicleSearchResults.length > 0 ? (
              <div className="">
                <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                  <Row className="">
                    {vehicleSearchResults.map((vehicle) => (
                      <Col md={12} key={vehicle.vehicle_id}>
                        <div
                          className="border-2 border-primary w-100 cursor-pointer"
                          onClick={() => handleSelectVehicle(vehicle)}
                        >
                          <div className="py-1 px-0 hover-shadow rounded-2">
                            <div className="d-flex justify-content-between align-items-start">
                              <div>
                                <h5 className="fw-bold mb-0">
                                  {vehicle.vehicle_rc_number}{" "}
                                  {vehicle.v_vehicle_name !== "unknown" &&
                                    `(${vehicle.v_vehicle_name})`}
                                </h5>
                                <div className="small text-muted">
                                  <p className="mb-0">
                                    {vehicle.assign_name ? (
                                      <>
                                        <strong>{vehicle.assign_type}:</strong>{" "}
                                        {vehicle.assign_name}{" "}
                                        {vehicle.assign_last_name} (
                                        {vehicle.assign_mobile})
                                      </>
                                    ) : (
                                      <span>No Driver/Partner</span>
                                    )}
                                  </p>
                                </div>
                              </div>
                              <span
                                className={`badge ${
                                  vehicle.vehicle_status === 1
                                    ? "text-success"
                                    : "text-danger"
                                }`}
                              >
                                {vehicle.vehicle_status === 1 ? (
                                  <GoDotFill />
                                ) : (
                                  <GoDotFill />
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                        <hr className="m-0 p-0" />
                      </Col>
                    ))}
                  </Row>
                </div>
              </div>
            ) : null}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={() => {
              setShowAssignModal(false);
              setVehicleSearchResults([]);
              setVehicleSearchQuery("");
            }}
            className="m-0"
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Invoice Modal */}
      <Modal
        show={showInvoiceModal}
        onHide={() => setShowInvoiceModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Booking Invoice</Modal.Title>
        </Modal.Header>
        <Modal.Body id="invoice-content">
          {invoiceData ? (
            <div className="invoice-pdf watermark-container">
              <img
                src="https://madmin.medcab.in/site_img/logo.png"
                className="invoice-watermark"
                alt="watermark"
              />

              {/* HEADER */}
              <div className="d-flex justify-content-between align-items-start border-bottom pb-2 mb-2">
                <div>
                  <img
                    src="https://madmin.medcab.in/site_img/logo.png"
                    alt="medcab"
                    height={20}
                    className=""
                  />
                  <p className="mb-0 small">
                    FairDeal Bhawan, Vibhuti Khand, Gomti Nagar
                    <br />
                    Lucknow, Uttar Pradesh, India - 226010
                    <br />
                    Phone: +91 7905-715-156
                    <br />
                    Email: info@medcab.in
                  </p>
                </div>

                <div className="text-end">
                  <h5 className="fw-bold">INVOICE</h5>
                  <p className="mb-0 small">
                    <strong>Invoice No:</strong>{" "}
                    {invoiceData.bi_invoice_no || "N/A"}
                    <br />
                    <strong>Bill Date:</strong>{" "}
                    {new Date(invoiceData.created_at).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* CUSTOMER & BOOKING */}
              <div className="row mb-2 border-bottom">
                <div className="col-md-6">
                  <h6 className="fw-bold mb-0">Customer Details</h6>
                  <p className="mb-0">
                    {invoiceData.consumer_name} (
                    {invoiceData.consumer_mobile_no})
                  </p>
                  <p className="mb-1">{/* <strong>Mobile:</strong>  */}</p>
                </div>

                <div className="col-md-6 text-end">
                  <h6 className="fw-bold mb-0">Category</h6>
                  <p className="mb-0">
                    {invoiceData.booking_view_category_name}
                  </p>
                </div>
              </div>

              {/* TRIP DETAILS */}
              <div className="mb-2 border-bottom">
                <h6 className="fw-bold mb-0">Booking Details</h6>
                <p className="mb-0">
                  <strong>Pickup:</strong> {invoiceData.booking_pickup}
                </p>
                <p className="mb-0">
                  <strong>Drop:</strong> {invoiceData.booking_drop}
                </p>
                <p className="mb-1">
                  <strong>Schedule:</strong> {invoiceData.booking_schedule_time}
                </p>
              </div>

              {data?.booking_acpt_driver_id &&
              data?.booking_acpt_driver_id !== "0" ? (
                <>
                  <h6 className="fw-bold mb-0">Driver & Vehicle</h6>
                  <div className="mb-2 border-bottom d-flex justify-content-between">
                  <p className="mb-0">
                    <strong>Driver:</strong>{" "}
                    {invoiceData.driver_name
                      ? `${invoiceData.driver_name} ${invoiceData.driver_last_name} (${invoiceData.driver_mobile}) `
                      : "N/A"}
                  </p>
                  <p className="mb-1">
                    <strong>Vehicle No:</strong>{" "}
                    {invoiceData.vehicle_rc_number || "N/A"} {invoiceData.v_vehicle_name !== "unknown" && `(${invoiceData.v_vehicle_name})`}
                  </p>
                </div>
                </>
              ) : (
                <div className="mb-2 border-bottom">
                  <h6 className="fw-bold">Driver & Vehicle</h6>
                  <p className="mb-1"> No Driver Assigned</p>
                </div>
              )}

              {/* CHARGES TABLE */}
              <table className="table table-bordered mt-3">
                <thead className="table-light">
                  <tr>
                    <th>Description</th>
                    <th className="text-end">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Base Fare</td>
                    <td className="text-end">{invoiceData.bi_base_rate}</td>
                  </tr>
                  <tr>
                    <td>KM Charges</td>
                    <td className="text-end">{invoiceData.bi_km_rate}</td>
                  </tr>
                  <tr>
                    <td>Addons</td>
                    <td className="text-end">{invoiceData.bi_addons_rate}</td>
                  </tr>
                  <tr>
                    <td>Service Charge</td>
                    <td className="text-end">
                      {invoiceData.bi_service_charge}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong className="text-dark">Total</strong>
                    </td>
                    <td className="text-end text-dark fw-bold">
                      ₹{invoiceData.bi_total_amount_with_sc}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* FOOTER */}
              <div className="text-center d-flex justify-content-between mt-4">
                <p className="mb-1">
                  Payment Status:{" "}
                  <strong>
                    {invoiceData.bi_payment_status === "1" ? "PAID" : "PENDING"}
                  </strong>
                </p>
                <img src="" alt="" />
                <p className="fw-bold mt-1">Authorized Signatory</p>
              </div>
            </div>
          ) : (
            <p className="text-center">No invoice data available</p>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowInvoiceModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handlePrint}>
            Print
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
