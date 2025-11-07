import React, { useState } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, ModalTitle, Form } from 'react-bootstrap';

interface AddRemarkProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId?: number;
  onSave?: (remark: string) => void;
}

const AddRemark: React.FC<AddRemarkProps> = ({ isOpen, onClose, onSave }) => {
  const [remark, setRemark] = useState('');

  const handleSave = () => {
    if (onSave) {
      onSave(remark);
    }
    setRemark('');
    onClose();
  };

  const handleClose = () => {
    setRemark('');
    onClose();
  };

  return (
    <Modal show={isOpen} onHide={handleClose} className='mt-5 '>
      <ModalHeader closeButton>
        <ModalTitle as={'h4'}>Add Remark</ModalTitle>
      </ModalHeader>
      <ModalBody>
        <Form.Group>
          <Form.Label>Remark</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            placeholder="Enter your remark here..."
          />
        </Form.Group>
      </ModalBody>
      <ModalFooter>
        <Button variant="light" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSave} disabled={!remark.trim()}>
          Save changes
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default AddRemark;