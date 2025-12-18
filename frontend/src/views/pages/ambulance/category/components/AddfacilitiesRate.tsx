import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import ComponentCard from '@/components/ComponentCard';

const AmbulanceFacilitiesRateSchema = Yup.object().shape({
  ambulance_facilities_rate_f_id: Yup.string().required('Facility is required'),
  ambulance_facilities_rate_amount: Yup.string().required('Amount is required'),
  ambulance_facilities_rate_increase_per_km: Yup.string().required('Increase per KM is required'),
  ambulance_facilities_rate_from: Yup.string().required('From is required'),
  ambulance_facilities_rate_to: Yup.string().required('To is required'),
  ambulance_facilities_rate_status: Yup.string().required('Status is required'),
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
  const [facilities, setFacilities] = useState<any[]>([]);
  const baseURL = (import.meta as any).env?.VITE_PATH ?? '';

  // Fetch facilities list for dropdown
  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const response = await axios.get(`${baseURL}/ambulance/get_ambulance_facilities_list`);
        setFacilities(response.data.jsonData?.ambulance_facilities_list || []);
      } catch (err) {
        console.error('Failed to fetch facilities:', err);
      }
    };
    fetchFacilities();
  }, [baseURL]);

  const formik = useFormik({
    initialValues: {
      ambulance_facilities_rate_f_id: data?.ambulance_facilities_rate_f_id || '',
      ambulance_facilities_rate_amount: data?.ambulance_facilities_rate_amount || '',
      ambulance_facilities_rate_increase_per_km: data?.ambulance_facilities_rate_increase_per_km || '',
      ambulance_facilities_rate_from: data?.ambulance_facilities_rate_from || '',
      ambulance_facilities_rate_to: data?.ambulance_facilities_rate_to || '',
      ambulance_facilities_rate_status: data?.ambulance_facilities_rate_status || '0',
    },
    validationSchema: AmbulanceFacilitiesRateSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setError(null);
      try {
        const payload = {
          ambulance_facilities_rate_f_id: values.ambulance_facilities_rate_f_id,
          ambulance_facilities_rate_amount: values.ambulance_facilities_rate_amount,
          ambulance_facilities_rate_increase_per_km: values.ambulance_facilities_rate_increase_per_km,
          ambulance_facilities_rate_from: values.ambulance_facilities_rate_from,
          ambulance_facilities_rate_to: values.ambulance_facilities_rate_to,
          ambulance_facilities_rate_status: values.ambulance_facilities_rate_status,
        };

        if (mode === 'add') {
          await axios.post(`${baseURL}/ambulance/add_ambulance_facilities_rate`, payload);
        } else if (mode === 'edit' && data?.ambulance_facilities_rate_id) {
          await axios.put(`${baseURL}/ambulance/edit_ambulance_facilities_rate/${data.ambulance_facilities_rate_id}`, payload);
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
        ambulance_facilities_rate_f_id: data.ambulance_facilities_rate_f_id || '',
        ambulance_facilities_rate_amount: data.ambulance_facilities_rate_amount || '',
        ambulance_facilities_rate_increase_per_km: data.ambulance_facilities_rate_increase_per_km || '',
        ambulance_facilities_rate_from: data.ambulance_facilities_rate_from || '',
        ambulance_facilities_rate_to: data.ambulance_facilities_rate_to || '',
        ambulance_facilities_rate_status: data.ambulance_facilities_rate_status || '0',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, data]);

  return (
    <ComponentCard title={mode === 'add' ? 'Add Ambulance Facilities Rate' : 'Edit Ambulance Facilities Rate'}>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={formik.handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Facility <span className="text-danger">*</span></Form.Label>
              <Form.Select
                name="ambulance_facilities_rate_f_id"
                value={formik.values.ambulance_facilities_rate_f_id}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.ambulance_facilities_rate_f_id && !!formik.errors.ambulance_facilities_rate_f_id}
              >
                <option value="">Select Facility</option>
                {facilities.map((facility: any) => (
                  <option key={facility.ambulance_facilities_id} value={facility.ambulance_facilities_id}>
                    {facility.ambulance_facilities_name} ({facility.ambulance_facilities_category_type})
                  </option>
                ))}
              </Form.Select>
              {formik.touched.ambulance_facilities_rate_f_id && formik.errors.ambulance_facilities_rate_f_id && (
                <div className="text-danger small mt-1">
                  {String(formik.errors.ambulance_facilities_rate_f_id)}
                </div>
              )}
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Amount <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="number"
                name="ambulance_facilities_rate_amount"
                value={formik.values.ambulance_facilities_rate_amount}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter amount"
                isInvalid={formik.touched.ambulance_facilities_rate_amount && !!formik.errors.ambulance_facilities_rate_amount}
              />
              {formik.touched.ambulance_facilities_rate_amount && formik.errors.ambulance_facilities_rate_amount && (
                <div className="text-danger small mt-1">
                  {String(formik.errors.ambulance_facilities_rate_amount)}
                </div>
              )}
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Increase Per KM <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="number"
                name="ambulance_facilities_rate_increase_per_km"
                value={formik.values.ambulance_facilities_rate_increase_per_km}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter increase per km"
                isInvalid={formik.touched.ambulance_facilities_rate_increase_per_km && !!formik.errors.ambulance_facilities_rate_increase_per_km}
              />
              {formik.touched.ambulance_facilities_rate_increase_per_km && formik.errors.ambulance_facilities_rate_increase_per_km && (
                <div className="text-danger small mt-1">
                  {String(formik.errors.ambulance_facilities_rate_increase_per_km)}
                </div>
              )}
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>From <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                name="ambulance_facilities_rate_from"
                value={formik.values.ambulance_facilities_rate_from}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter from location"
                isInvalid={formik.touched.ambulance_facilities_rate_from && !!formik.errors.ambulance_facilities_rate_from}
              />
              {formik.touched.ambulance_facilities_rate_from && formik.errors.ambulance_facilities_rate_from && (
                <div className="text-danger small mt-1">
                  {String(formik.errors.ambulance_facilities_rate_from)}
                </div>
              )}
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>To <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                name="ambulance_facilities_rate_to"
                value={formik.values.ambulance_facilities_rate_to}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter to location"
                isInvalid={formik.touched.ambulance_facilities_rate_to && !!formik.errors.ambulance_facilities_rate_to}
              />
              {formik.touched.ambulance_facilities_rate_to && formik.errors.ambulance_facilities_rate_to && (
                <div className="text-danger small mt-1">
                  {String(formik.errors.ambulance_facilities_rate_to)}
                </div>
              )}
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Status <span className="text-danger">*</span></Form.Label>
              <Form.Select
                name="ambulance_facilities_rate_status"
                value={formik.values.ambulance_facilities_rate_status}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.ambulance_facilities_rate_status && !!formik.errors.ambulance_facilities_rate_status}
              >
                <option value="0">Active</option>
                <option value="1">Inactive</option>
              </Form.Select>
              {formik.touched.ambulance_facilities_rate_status && formik.errors.ambulance_facilities_rate_status && (
                <div className="text-danger small mt-1">
                  {String(formik.errors.ambulance_facilities_rate_status)}
                </div>
              )}
            </Form.Group>
          </Col>
        </Row>
        <div className="d-flex justify-content-end gap-2">
          <button className="px-3 rounded text-black" onClick={onCancel}>
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