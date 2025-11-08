import ComponentCard from '@/components/ComponentCard'
import {Col, Form, FormControl, FormLabel, Row, Button} from 'react-bootstrap'
import React from 'react'
import axios from "axios";
import { LuTrash } from 'react-icons/lu';

interface AddFAQProps {
  mode: "add" | "edit";
  data?: any;
  onCancel: () => void;
  onDataChanged: () => void;
}

interface FAQItem {
  manpower_faq_header: string;
  manpower_faq_description: string;
  manpower_faq_status: string;
}

const AddFAQ: React.FC<AddFAQProps> = ({mode, data, onCancel, onDataChanged}) => {
    const [faqList, setFaqList] = React.useState<FAQItem[]>([
        {
            manpower_faq_header: "",
            manpower_faq_description: "",
            manpower_faq_status: "0",
        }
    ]);

    const baseURL = (import.meta as any).env?.VITE_PATH ?? "";

    React.useEffect(() => {
        if (mode === "edit" && data) {
            setFaqList([{
                manpower_faq_header: data.manpower_faq_header || "",
                manpower_faq_description: data.manpower_faq_description || "",
                manpower_faq_status: String(data.manpower_faq_status ?? "0"),
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
            manpower_faq_header: "",
            manpower_faq_description: "",
            manpower_faq_status: "0",
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
                // Convert status to number for edit mode
                const payload = {
                    manpower_faq_header: faqList[0].manpower_faq_header,
                    manpower_faq_description: faqList[0].manpower_faq_description,
                    manpower_faq_status: parseInt(faqList[0].manpower_faq_status)
                };
                await axios.put(`${baseURL}/manpower/edit_faq/${data.manpower_faq_id}`, payload);
                onDataChanged();
                onCancel();
            } else {
                // Convert status to number for add mode
                const payload = faqList.map(faq => ({
                    manpower_faq_header: faq.manpower_faq_header,
                    manpower_faq_description: faq.manpower_faq_description,
                    manpower_faq_status: parseInt(faq.manpower_faq_status)
                }));
                await Promise.all(
                    payload.map(faq => axios.post(`${baseURL}/manpower/add_faq`, faq))
                );
                onDataChanged();
                onCancel();
                console.log("FAQs added successfully");
            }
        } catch (err: any) {
            console.error("Error saving FAQ:", err);
            console.error("Response data:", err.response?.data);
            alert(`Failed to save FAQ: ${err.response?.data?.message || err.message}`);
        }
    };

    return (
        <ComponentCard 
            title={
                <div className="d-flex justify-content-between align-items-center">
                    <span>{mode === "edit" ? "Edit FAQ" : "Add FAQ"}</span>
                </div>
            }
        >
            <Form onSubmit={handleSubmit}>
                {faqList.map((faq, index) => (
                    <React.Fragment key={index}>
                        <Row className="align-items-end g-3 mb-3">
                            {/* Question */}
                            <Col lg={5}>
                                <Form.Group controlId={`mpf_question_${index}`} className="mb-0">
                                    <FormLabel>Question {index + 1}</FormLabel>
                                    <FormControl
                                        type="text"
                                        value={faq.manpower_faq_header}
                                        onChange={(e) => handleChange(index, "manpower_faq_header", e.target.value)}
                                        required
                                        placeholder="Enter question"
                                    />
                                </Form.Group>
                            </Col>

                            {/* Answer */}
                            <Col lg={4}>
                                <Form.Group controlId={`mpf_answer_${index}`} className="mb-0">
                                    <FormLabel>Answer {index + 1}</FormLabel>
                                    <FormControl
                                        as="textarea"
                                        rows={1}
                                        value={faq.manpower_faq_description}
                                        onChange={(e) => handleChange(index, "manpower_faq_description", e.target.value)}
                                        required
                                        placeholder="Enter answer"
                                    />
                                </Form.Group>
                            </Col>

                            {/* Status */}
                            <Col lg={2}>
                                <Form.Group controlId={`mpf_status_${index}`} className="mb-0">
                                    <FormLabel>Status</FormLabel>
                                    <Form.Select
                                        value={faq.manpower_faq_status}
                                        onChange={(e) => handleChange(index, "manpower_faq_status", e.target.value)}
                                    >
                                        <option value="0">Active</option>
                                        <option value="1">Inactive</option>
                                    </Form.Select>
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
    )
}

export default AddFAQ
