import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Spinner, Alert } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";
import { TbAlertCircle } from "react-icons/tb";

const baseURL = (import.meta as any).env?.VITE_PATH ?? "";

interface CancelBookingModalProps {
  show: boolean;
  onHide: () => void;
  bookingId: string | number;
  onBookingCancelled: () => void;
}

interface CancelReason {
  id: number;
  booking_cancel_reasons_text: string;
}

const CancelBookingModal: React.FC<CancelBookingModalProps> = ({
  show,
  onHide,
  bookingId,
  onBookingCancelled,
}) => {
  const [cancelConsumerReasons, setCancelConsumerReasons] = useState<CancelReason[]>([]);
  const [cancelDriverReasons, setCancelDriverReasons] = useState<CancelReason[]>([]);
  const [loadingReasons, setLoadingReasons] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (show) {
      fetchCancelReasons();
    }
  }, [show]);

  const fetchCancelReasons = async () => {
    setLoadingReasons(true);
    setError(null);
    try {
      // Replace with your actual API endpoint
      const response = await axios.get(
        `${baseURL}/ambulance/cancel_booking_reasons_data`
      );
      
      const consumerReasons = response.data?.jsonData?.cancel_reasons_consumer || [];
      const driverReasons = response.data?.jsonData?.cancel_reasons_driver || [];
      console.log("driver reasons", driverReasons);
      console.log("consumer reasons", consumerReasons);
      setCancelConsumerReasons(consumerReasons);
      setCancelDriverReasons(driverReasons);
    } catch (err: any) {
      console.error("Error fetching cancel reasons:", err);
      setError("Failed to load cancel reasons. Please try again.");
    } finally {
      setLoadingReasons(false);
    }
  };

  const handleReasonChange = (reason: string) => {
    setSelectedReason(reason);
    // Clear other reason if user selects a predefined reason
    if (reason !== "other") {
      setOtherReason("");
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!selectedReason) {
      Swal.fire({
        icon: "warning",
        title: "Select a Reason",
        text: "Please select a cancellation reason",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    if (selectedReason === "other" && !otherReason.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Enter Reason",
        text: "Please enter your cancellation reason",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    try {
      const result = await Swal.fire({
        title: "Confirm Cancellation",
        html: `
          <div class="text-start">
            <p><strong>Reason:</strong> ${
              selectedReason === "other" ? otherReason : selectedReason
            }</p>
            <p class="text-danger mt-3">This action cannot be undone.</p>
          </div>
        `,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, Cancel Booking",
        cancelButtonText: "No, Keep Booking",
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        reverseButtons: true,
      });

      if (result.isConfirmed) {
        setSubmitting(true);

        Swal.fire({
          title: "Cancelling...",
          text: "Please wait while we cancel the booking.",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        // API call to cancel booking
        await axios.patch(
          `${baseURL}/ambulance/cancel_ambulance_booking/${bookingId}`,
          {
            cancelReason:
              selectedReason === "other" ? otherReason : selectedReason,
          }
        );

        // Close modal
        onHide();

        // Show success message
        Swal.fire({
          icon: "success",
          title: "Booking Cancelled",
          text: "The booking has been cancelled successfully.",
          confirmButtonColor: "#3085d6",
          timer: 2000,
          timerProgressBar: true,
        });

        // Notify parent component
        onBookingCancelled();

        // Reset form
        setSelectedReason("");
        setOtherReason("");
      }
    } catch (err: any) {
      console.error("Error cancelling booking:", err);
      Swal.fire({
        icon: "error",
        title: "Cancellation Failed",
        text:
          err.response?.data?.message ||
          "Failed to cancel booking. Please try again.",
        confirmButtonColor: "#d33",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!submitting) {
      setSelectedReason("");
      setOtherReason("");
      setError(null);
      onHide();
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      size="md" // Changed from default to md
    >
      <Modal.Header closeButton>
        <Modal.Title>Reason for Cancellation</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {loadingReasons ? (
          <div className="text-center py-4">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2 mb-0">Loading cancellation reasons...</p>
          </div>
        ) : (
          <>
            <div className="mb-3">
              <h6 className="mb-2">
                <TbAlertCircle className="me-2" />
                Customer-Side Reasons
              </h6>
              <div className="d-flex flex-wrap gap-2">
                {cancelConsumerReasons.map((reason) => (
                  <Button
                    key={reason.id}
                    variant={selectedReason === reason.booking_cancel_reasons_text ? "primary" : "outline-primary"}
                    size="sm"
                    onClick={() => setSelectedReason(reason.booking_cancel_reasons_text)}
                    className="text-nowrap py-0"
                  >
                    {reason.booking_cancel_reasons_text}
                  </Button>
                ))}
              </div>
            </div>

            <div className="mb-3">
              <h6 className=" mb-2">
                <TbAlertCircle className="me-2" />
                Driver-Side Reasons
              </h6>
              <div className="d-flex flex-wrap gap-2">
                {cancelDriverReasons.map((reason) => (
                  <Button
                    key={reason.id}
                    variant={selectedReason === reason.booking_cancel_reasons_text ? "primary" : "outline-primary"}
                    size="sm"
                    onClick={() => setSelectedReason(reason.booking_cancel_reasons_text)}
                    className="text-nowrap py-0"
                  >
                    {reason.booking_cancel_reasons_text}
                  </Button>
                ))}
              </div>
            </div>

            {/* Other Reason Option */}
            <Form.Check
              type="radio"
              id="reason-other"
              label="Other (Please specify)"
              name="cancelReason"
              value="other"
              checked={selectedReason === "other"}
              onChange={(e) => handleReasonChange(e.target.value)}
              className="mb-2"
            />

            {/* Other Reason Text Input */}
            {selectedReason === "other" && (
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">
                  Please specify your reason{" "}
                  <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter your reason for cancellation..."
                  value={otherReason}
                  onChange={(e) => setOtherReason(e.target.value)}
                  maxLength={500}
                />
                <Form.Text className="text-muted">
                  {otherReason.length}/500 characters
                </Form.Text>
              </Form.Group>
            )}
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="light"
          onClick={handleClose}
          disabled={submitting}
        >
          Close
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={submitting || loadingReasons || !selectedReason}
        >
          {submitting ? (
            <>
              <Spinner size="sm" animation="border" className="me-2" />
              Cancelling...
            </>
          ) : (
            "Cancel Booking"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CancelBookingModal;