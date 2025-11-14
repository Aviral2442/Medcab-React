import ComponentCard from '@/components/ComponentCard';
import { Col, Form, FormControl, FormLabel, Row, Button } from 'react-bootstrap';
import React, { useEffect } from "react";
import axios from "axios";
import { LuTrash } from 'react-icons/lu';

interface AddCityFAQProps {
  mode: "add" | "edit";
  data?: any;
  onCancel: () => void;
  onDataChanged: () => void;
}

interface FAQItem {
  city_faq_id: number;
  city_faq_que: string;
  city_faq_ans: string;
  city_faq_status: string;
}

const AddCityFAQ: React.FC<AddCityFAQProps> = ({
  mode,
  data,
  onCancel,
  onDataChanged,
}) => {
  const [faqList, setFaqList] = React.useState<FAQItem[]>([
    {
      city_faq_id: 0,
      city_faq_que: "",
      city_faq_ans: "",
      city_faq_status: "1",
    }
  ]);

  const baseURL = (import.meta as any).env?.VITE_PATH ?? "";
  const [cityData, setCityData] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (mode === "edit" && data) {
      setFaqList([{
        city_faq_id: data.city_faq_id || 0,
        city_faq_que: data.city_faq_que || "",
        city_faq_ans: data.city_faq_ans || "",
        city_faq_status: String(data.city_faq_status ?? "1"),
      }]);
    }
  }, [mode, data]);

  const handleChange = (index: number, key: keyof FAQItem, value: string) => {
    setFaqList(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [key]: value };
      return updated;
    });
  };

  const handleAddMore = () => {
    setFaqList(prev => [...prev, {
      city_faq_id: 0,
      city_faq_que: "",
      city_faq_ans: "",
      city_faq_status: "1",
    }]);
  };

  const handleRemove = (index: number) => {
    if (faqList.length > 1) {
      setFaqList(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (mode === "edit" && data) {
        const payload = {
          city_faq_id: data.city_faq_id,
          city_faq_que: faqList[0].city_faq_que,
          city_faq_ans: faqList[0].city_faq_ans,
          city_faq_status: parseInt(faqList[0].city_faq_status)
        };
        await axios.put(`${baseURL}/content_writer/edit_city_content_faq/${data.city_faq_id}`, payload);
        onDataChanged();
        onCancel();
      } else {
        const payload = faqList.map(faq => ({
          city_faq_id: faq.city_faq_id,
          city_faq_que: faq.city_faq_que,
          city_faq_ans: faq.city_faq_ans,
          city_faq_status: parseInt(faq.city_faq_status)
        }));
        await Promise.all(
          payload.map(faq => axios.post(`${baseURL}/content_writer/add_city_content_faq`, faq))
        );
        onDataChanged();
        onCancel();
        console.log("City FAQs added successfully");
      }
    } catch (err: any) {
      console.error("Error saving City FAQ:", err);
      console.error("Response data:", err.response?.data);
      alert(`Failed to save City FAQ: ${err.response?.data?.message || err.message}`);
    }
  };


  const fetchCityContent = async () => {
    try{
        const res = await axios.get(`${baseURL}/content_writer/get_city_content_faq_list`);
        console.log("City Content in faq fetched:", res.data);
        setCityData(res.data?.jsonData?.city_content_list || []);
    } catch (err) {
        console.error("Error fetching City Content:", err);
        return [];
    }
  };

  useEffect(() => {
    fetchCityContent()
  }, []);

  return (
    <ComponentCard 
      title={
        <div className="d-flex justify-content-between align-items-center">
          <span>{mode === "edit" ? "Edit City FAQ" : "Add City FAQ"}</span>
        </div>
      }
    >
      <Form onSubmit={handleSubmit}>
        {faqList.map((faq, index) => (
          <React.Fragment key={index}>
            <Row className="align-items-end g-3 mb-3">

                {/* City Select */}
                <Col lg={2}>
                    <Form.Group controlId={`city_faq_id_${index}`} className="mb-0">
                        <FormLabel>City {index + 1}</FormLabel>
                        <FormControl
                            as="select"
                            value={faq.city_faq_id}
                            onChange={(e) => handleChange(index, "city_faq_id", e.target.value)}
                            required
                        >
                            <option value="">Select City</option>
                            {cityData.map((city) => (
                                <option key={city.city_faq_id} value={city.city_faq_id}>
                                    {city.city_name}
                                </option>
                            ))}
                        </FormControl>
                    </Form.Group>
                </Col>

              {/* Question */}
              <Col lg={5}>
                <Form.Group controlId={`city_faq_que_${index}`} className="mb-0">
                  <FormLabel>Question {index + 1}</FormLabel>
                  <FormControl
                    type="text"
                    value={faq.city_faq_que}
                    onChange={(e) => handleChange(index, "city_faq_que", e.target.value)}
                    required
                    placeholder="Enter question"
                  />
                </Form.Group>
              </Col>

              {/* Answer */}
              <Col lg={4}>
                <Form.Group controlId={`city_faq_ans_${index}`} className="mb-0">
                  <FormLabel>Answer {index + 1}</FormLabel>
                  <FormControl
                    as="textarea"
                    rows={1}
                    value={faq.city_faq_ans}
                    onChange={(e) => handleChange(index, "city_faq_ans", e.target.value)}
                    required
                    placeholder="Enter answer"
                  />
                </Form.Group>
              </Col>

              {/* Remove Button */}
              <Col lg={1}>
                {faqList.length > 1 && (
                  <Button 
                    variant="danger" 
                    onClick={() => handleRemove(index)} 
                    className="w-100"
                    title="Remove FAQ"
                  >
                    <LuTrash className='my-1'/>
                  </Button>
                )}
              </Col>
            </Row>
            {index < faqList.length - 1 && <hr className="my-3" />}
          </React.Fragment>
        ))}

        {/* Action Buttons */}
        <Row className="mt-4">
          <Col lg={12} className="d-flex justify-content-end gap-2">
            {mode === "add" && (
              <Button variant="success" onClick={handleAddMore}>
                + Add More FAQ
              </Button>
            )}
            <Button variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {mode === "edit" ? "Update" : "Save All"}
            </Button>
          </Col>
        </Row>
      </Form>
    </ComponentCard>
  );
};

export default AddCityFAQ;