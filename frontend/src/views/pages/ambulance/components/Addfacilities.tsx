import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import ComponentCard from '@/components/ComponentCard';

const AmbulanceFacilitiesSchema = Yup.object().shape({
  ambulance_facilities_category_type: Yup.string().required('Category Type is required'),
  ambulance_facilities_name: Yup.string().required('Name is required'),
  ambulance_facilities_state: Yup.string().required('State is required'),
  ambulance_facilities_image: Yup.mixed().nullable(),
});

interface AddfacilitiesProps {
  mode: 'add' | 'edit';
  data?: any;
  onCancel: () => void;
  onDataChanged: () => void;
}

const Addfacilities: React.FC<AddfacilitiesProps> = ({ mode, data, onCancel, onDataChanged }) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const baseURL = (import.meta as any).env?.VITE_PATH ?? '';

  const formik = useFormik({
    initialValues: {
      ambulance_facilities_category_type: data?.ambulance_facilities_category_type || '',
      ambulance_facilities_name: data?.ambulance_facilities_name || '',
      ambulance_facilities_state: data?.ambulance_facilities_state || '',
      ambulance_facilities_image: null as File | null,
    },
    validationSchema: AmbulanceFacilitiesSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setError(null);
      try {
        const formData = new FormData();
        formData.append('ambulance_facilities_category_type', values.ambulance_facilities_category_type);
        formData.append('ambulance_facilities_name', values.ambulance_facilities_name);
        formData.append('ambulance_facilities_state', values.ambulance_facilities_state);
        if (values.ambulance_facilities_image) {
          formData.append('ambulance_facilities_image', values.ambulance_facilities_image);
        }

        if (mode === 'add') {
          await axios.post(`${baseURL}/ambulance/add_ambulance_facilities`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
        } else if (mode === 'edit' && data?.ambulance_facilities_id) {
          await axios.put(`${baseURL}/ambulance/edit_ambulance_facilities/${data.ambulance_facilities_id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
        }

        onDataChanged();
        onCancel();
      } catch (err: any) {
        setError(err.response?.data?.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    if (mode === 'edit' && data) {
      formik.setValues({
        ambulance_facilities_category_type: data.ambulance_facilities_category_type || '',
        ambulance_facilities_name: data.ambulance_facilities_name || '',
        ambulance_facilities_state: data.ambulance_facilities_state || '',
        ambulance_facilities_image: null,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, data]);

  return (
    <ComponentCard title={mode === 'add' ? 'Add Ambulance Facilities' : 'Edit Ambulance Facilities'}>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={formik.handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Category Type</Form.Label>
              <Form.Control
                type="text"
                name="ambulance_facilities_category_type"
                value={formik.values.ambulance_facilities_category_type}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.ambulance_facilities_category_type && !!formik.errors.ambulance_facilities_category_type}
              />
              {formik.touched.ambulance_facilities_category_type && formik.errors.ambulance_facilities_category_type && (
                <div className="text-danger small mt-1">
                  {String(formik.errors.ambulance_facilities_category_type)}
                </div>
              )}
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="ambulance_facilities_name"
                value={formik.values.ambulance_facilities_name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.ambulance_facilities_name && !!formik.errors.ambulance_facilities_name}
              />
              {formik.touched.ambulance_facilities_name && formik.errors.ambulance_facilities_name && (
                <div className="text-danger small mt-1">
                  {String(formik.errors.ambulance_facilities_name)}
                </div>
              )}
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>State</Form.Label>
              <Form.Control
                type="text"
                name="ambulance_facilities_state"
                value={formik.values.ambulance_facilities_state}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.ambulance_facilities_state && !!formik.errors.ambulance_facilities_state}
              />
              {formik.touched.ambulance_facilities_state && formik.errors.ambulance_facilities_state && (
                <div className="text-danger small mt-1">
                  {String(formik.errors.ambulance_facilities_state)}
                </div>
              )}
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Image (Optional)</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const file = e.target.files?.[0] || null;
                  formik.setFieldValue('ambulance_facilities_image', file);
                }}
                isInvalid={formik.touched.ambulance_facilities_image && !!formik.errors.ambulance_facilities_image}
              />
              {formik.touched.ambulance_facilities_image && formik.errors.ambulance_facilities_image && (
                <div className="text-danger small mt-1">
                  {String(formik.errors.ambulance_facilities_image)}
                </div>
              )}
            </Form.Group>
          </Col>
        </Row>
        <div className="d-flex justify-content-end gap-2">
          <button  className="px-3 rounded text-black"
 onClick={onCancel}>
            Cancel
          </button>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? 'Saving...' : mode === 'add' ? 'Add' : 'Update'}
          </Button>
        </div>
      </Form>
    </ComponentCard>
  );
};

export default Addfacilities;