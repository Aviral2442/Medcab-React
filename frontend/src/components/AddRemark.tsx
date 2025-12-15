import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, ModalTitle, Form, Alert, Table, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { getAdminIdFromToken, isAuthenticated } from '@/utils/auth';
import { format } from 'date-fns';
import { formatDate } from './DateFormat';

export const REMARK_CATEGORY_TYPES = {
  AMBULANCE_BOOKING: 1,
  AIR_AMBULANCE: 2,
  CONSUMER: 3,
  PARTNER: 4,
  DRIVER: 5,
  VEHICLE: 6,
  HOSPITAL: 7,
  CONSUMER_DIAL: 8,
  CONSUMER_ENQUIRY_RECORDS: 9,
  AMBULANCE_ENQUIRY: 10,
  MANPOWER_VENDOR: 11,
  MANPOWER_ORDER: 12,
  EMERGENCY_DRIVER: 13,
  EMERGENCY_CONSUMER: 14,
  PATHOLOGY_VENDOR: 15,
  PATHOLOGY_ORDER: 16,
  PATHOLOGY_COLLECTION_BOY: 17,
  VIDEO_CONSULTANCY_ORDER: 18,
  VIDEO_CONSULTANCY_PATIENT: 19,
} as const;

export type RemarkCategoryType = typeof REMARK_CATEGORY_TYPES[keyof typeof REMARK_CATEGORY_TYPES];

// Mapping category types to column names
const CATEGORY_COLUMN_MAP: Record<number, string> = {
  1: "remark_booking_id",
  2: "remark_airbooking_id",
  3: "remark_consumer_id",
  4: "remark_partner_id",
  5: "remark_driver_id",
  6: "remark_vehicle_id",
  7: "remark_hospital_id",
  8: "remark_consumer_dial_id",
  9: "remark_consumer_enquiry_records_id",
  10: "ambulance_enquire_id",
  11: "remark_manpower_vendor_id",
  12: "remark_manpower_order_id",
  13: "remark_driver_emergency_id",
  14: "remark_consumer_emergency_id",
  15: "remark_pathology_vendor_id",
  16: "remark_pathology_order_id",
  17: "remark_pathology_collection_boy_id",
  18: "remark_video_consultancy_order_id",
  19: "remark_video_consultancy_patient_id",
};

interface Remark {
  remark_id: number;
  remark_text: string;
  remark_add_unix_time: string;
  admin_name?: string;
  admin_email?: string;
  created_at: string;
}

interface AddRemarkProps {
  isOpen: boolean;
  onClose: () => void;
  remarkCategoryType: RemarkCategoryType;
  primaryKeyId: number | null;
  onSuccess?: () => void;
}

const AddRemark: React.FC<AddRemarkProps> = ({ 
  isOpen, 
  onClose, 
  remarkCategoryType, 
  primaryKeyId,
  onSuccess 
}) => {
  const [remark, setRemark] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingRemarks, setFetchingRemarks] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remarks, setRemarks] = useState<Remark[]>([]);

  const baseURL = (import.meta as any).env?.VITE_PATH ?? "";

  // Fetch existing remarks when modal opens
  useEffect(() => {
    if (isOpen && primaryKeyId) {
      fetchRemarks();
    }
  }, [isOpen, primaryKeyId]);

  const fetchRemarks = async () => {
    if (!primaryKeyId) return;

    setFetchingRemarks(true);
    try {
      const token = localStorage.getItem("token");
      const columnName = CATEGORY_COLUMN_MAP[remarkCategoryType];

      const response = await axios.get(
        `${baseURL}/get_remarks/${columnName}/${primaryKeyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Fetched remarks:", response.data?.jsonData?.remarks_list[0]);
      setRemarks(response.data?.jsonData?.remarks_list || []);
    } catch (err: any) {
      console.error("Error fetching remarks:", err);
      setError("Failed to load existing remarks.");
    } finally {
      setFetchingRemarks(false);
    }
  };

  const handleSave = async () => {
    if (!isAuthenticated()) {
      setError("You are not authenticated. Please login again.");
      return;
    }

    const adminId = getAdminIdFromToken();
    if (!adminId) {
      setError("Unable to get admin information from token.");
      return;
    }

    if (!primaryKeyId) {
      setError("Invalid record ID.");
      return;
    }

    if (!remark.trim()) {
      setError("Please enter a remark.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      
      await axios.post(
        `${baseURL}/add_remarks`,
        {
          remark_type: adminId,
          remark_category_type: remarkCategoryType,
          remark_text: remark.trim(),
          remark_list_primary_key: primaryKeyId, 
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Remark saved successfully");
      setRemark('');
      
      // Refresh remarks list
      await fetchRemarks();
      
      onSuccess?.();
    } catch (err: any) {
      console.error("Error saving remark:", err);
      setError(err.response?.data?.message || "Failed to save remark. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setRemark('');
    setError(null);
    setRemarks([]);
    onClose();
  };

  const formatRemarkDate = (dateValue: number | string) => {
    try {
      if (typeof dateValue === 'number') {
        // handle unix timestamps in seconds or milliseconds
        const ts = dateValue > 1e12 ? dateValue : dateValue * 1000;
        return format(new Date(ts), 'dd/MM/yyyy hh:mm a');
      }
      // delegate to imported helper for string dates
      return formatDate(dateValue);
    } catch {
      return 'N/A';
    }
  };

  return (
    <Modal show={isOpen} onHide={handleClose} size="lg" className='mt-5'>
      <ModalHeader closeButton>
        <ModalTitle as={'h4'}>Remarks</ModalTitle>
      </ModalHeader>
      <ModalBody style={{ maxHeight: '70vh', overflowY: 'auto' }}>
        {error && (
          <Alert variant="danger" onClose={() => setError(null)} dismissible>
            {error}
          </Alert>
        )}

        {/* Existing Remarks Section */}
        <div className="mb-4">
          <h5 className="mb-3">Previous Remarks</h5>
          {fetchingRemarks ? (
            <div className="text-center py-3">
              <Spinner animation="border" size="sm" />
              <span className="ms-2">Loading remarks...</span>
            </div>
          ) : remarks.length > 0 ? (
            <div className="table-responsive" style={{ maxHeight: '300px', overflowY: 'auto' }}>
              <Table striped bordered hover size="sm">
                <thead style={{ position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 1 }}>
                  <tr>
                    <th style={{ width: '50px' }}>S.No.</th>
                    <th style={{ width: '180px' }}>Date & Time</th>
                    <th style={{ width: '150px' }}>Added By</th>
                    <th>Remark</th>
                  </tr>
                </thead>
                <tbody>
                  {remarks.map((remarkItem, index) => (
                    <tr key={remarkItem.remark_id}>
                      <td>{index + 1}</td>
                      <td>{formatRemarkDate(remarkItem.remark_add_unix_time || remarkItem.created_at)}</td>
                      <td>
                        <div className="text-truncate" title={remarkItem.admin_email || 'N/A'}>
                          {remarkItem.admin_name || 'Unknown'}
                        </div>
                      </td>
                      <td>
                        <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                          {remarkItem.remark_text}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          ) : (
            <Alert variant="info">No remarks found.</Alert>
          )}
        </div>

        <hr />

        {/* Add New Remark Section */}
        <div>
          <h5 className="mb-3">Add New Remark</h5>
          <Form.Group>
            <Form.Label>Remark</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              placeholder="Enter your remark here..."
              disabled={loading}
            />
          </Form.Group>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button variant="light" onClick={handleClose} disabled={loading}>
          Close
        </Button>
        <Button 
          variant="primary" 
          onClick={handleSave} 
          disabled={!remark.trim() || loading}
        >
          {loading ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Saving...
            </>
          ) : (
            "Add Remark"
          )}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default AddRemark;