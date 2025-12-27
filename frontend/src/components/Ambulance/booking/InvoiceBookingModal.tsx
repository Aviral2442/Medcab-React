import React from "react";
import { Modal, Button } from "react-bootstrap";

interface InvoiceBookingModalProps {
  show: boolean;
  onHide: () => void;
  invoiceData: any;
  data: any;
  handlePrint: () => void;
}

const InvoiceBookingModal: React.FC<InvoiceBookingModalProps> = ({
  show,
  onHide,
  invoiceData,
  data,
  handlePrint,
}) => {
  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
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
                  {invoiceData.consumer_name} ({invoiceData.consumer_mobile_no})
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
                    {invoiceData.vehicle_rc_number || "N/A"}{" "}
                    {invoiceData.v_vehicle_name !== "unknown" &&
                      `(${invoiceData.v_vehicle_name})`}
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
        <Button variant="primary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handlePrint}>
          Print
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default InvoiceBookingModal;
