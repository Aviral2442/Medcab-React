import React, { useState } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, ModalTitle, Form, Alert } from 'react-bootstrap';
import axios from 'axios';
import { getAdminIdFromToken, isAuthenticated } from '@/utils/auth';

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

interface AddRemarkProps {
  isOpen: boolean;
  onClose: () => void;
  remarkCategoryType: RemarkCategoryType;
  primaryKeyId: number | null; // The ID of the entity (consumer_id, booking_id, etc.)
  onSuccess?: () => void; // Callback after successful save
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
  const [error, setError] = useState<string | null>(null);

  const baseURL = (import.meta as any).env?.VITE_PATH ?? "";

  const handleSave = async () => {
    // Check authentication
    if (!isAuthenticated()) {
      setError("You are not authenticated. Please login again.");
      return;
    }

    // Get admin ID from token
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
          remark_type: adminId, // Admin ID who added the remark
          remark_category_type: remarkCategoryType, // Category type (1-19)
          remark_text: remark.trim(), // The remark text
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
      onClose();
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
    onClose();
  };

  return (
    <Modal show={isOpen} onHide={handleClose} className='mt-5'>
      <ModalHeader closeButton>
        <ModalTitle as={'h4'}>Add Remark</ModalTitle>
      </ModalHeader>
      <ModalBody>
        {error && (
          <Alert variant="danger" onClose={() => setError(null)} dismissible>
            {error}
          </Alert>
        )}
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
          {loading ? "Saving..." : "Save changes"}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default AddRemark;