import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import SnowEditor from '@/views/forms/editors';
import ComponentCard from '@/components/ComponentCard';

const AmbulanceFAQSchema = Yup.object().shape({
  ambulance_id: Yup.number().required('Ambulance ID is required'),
  ambulance_faq_que: Yup.string().required('Question is required'),
  ambulance_faq_ans: Yup.string().required('Answer is required'),
});

interface AddAmbulanceFAQProps {
  mode: 'add' | 'edit';
  data?: any;
  onCancel: () => void;
  onDataChanged: () => void;
}

const AddAmbulanceFAQ: React.FC<AddAmbulanceFAQProps> = ({ mode, data, onCancel, onDataChanged }) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const baseURL = (import.meta as any).env?.VITE_PATH ?? '';

  const formik = useFormik({
    initialValues: {
      ambulance_id: data?.ambulance_id || '',
      ambulance_faq_que: data?.ambulance_faq_que || '',
      ambulance_faq_ans: data?.ambulance_faq_ans || '',
    },
    validationSchema: AmbulanceFAQSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setError(null);
      try {
        const payload = {
          ambulance_id: values.ambulance_id,
          ambulance_faq_que: values.ambulance_faq_que,
          ambulance_faq_ans: values.ambulance_faq_ans,
        };

        if (mode === 'add') {
          await axios.post(`${baseURL}/ambulance/add_ambulance_faq`, payload);
        } else if (mode === 'edit' && data?.ambulance_faq_id) {
          await axios.put(`${baseURL}/ambulance/edit_ambulance_faq/${data.ambulance_faq_id}`, payload);
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
        ambulance_id: data.ambulance_id || '',
        ambulance_faq_que: data.ambulance_faq_que || '',
        ambulance_faq_ans: data.ambulance_faq_ans || '',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, data]);

  return (
    <ComponentCard title={mode === 'add' ? 'Add Ambulance FAQ' : 'Edit Ambulance FAQ'}>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={formik.handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Ambulance ID</Form.Label>
              <Form.Control
                type="number"
                name="ambulance_id"
                value={formik.values.ambulance_id}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.ambulance_id && !!formik.errors.ambulance_id}
              />
              {formik.touched.ambulance_id && formik.errors.ambulance_id && (
                <div className="text-danger small mt-1">
                  {typeof formik.errors.ambulance_id === 'string'
                    ? formik.errors.ambulance_id
                    : 'Invalid Ambulance ID'}
                </div>
              )}
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Question</Form.Label>
              <Form.Control
                type="text"
                name="ambulance_faq_que"
                value={formik.values.ambulance_faq_que}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.ambulance_faq_que && !!formik.errors.ambulance_faq_que}
              />
              {formik.touched.ambulance_faq_que && formik.errors.ambulance_faq_que && (
                <div className="text-danger small mt-1">
                  {typeof formik.errors.ambulance_faq_que === 'string' 
                    ? formik.errors.ambulance_faq_que 
                    : 'Invalid question'}
                </div>
              )}
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <Form.Group className="mb-3">
              <Form.Label>Answer</Form.Label>
              <SnowEditor
                value={formik.values.ambulance_faq_ans}
                onChange={(value: string) => formik.setFieldValue('ambulance_faq_ans', value)}  
              />
              {formik.touched.ambulance_faq_ans && formik.errors.ambulance_faq_ans && (
                <div className="text-danger small mt-1">
                  {typeof formik.errors.ambulance_faq_ans === 'string' 
                    ? formik.errors.ambulance_faq_ans 
                    : 'Invalid answer'}
                </div>
              )}
            </Form.Group>
          </Col>
        </Row>
        <div className="d-flex justify-content-end gap-2">
          <button className="px-3 rounded text-black"
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

export default AddAmbulanceFAQ;