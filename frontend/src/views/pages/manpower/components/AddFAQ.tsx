import ComponentCard from '@/components/ComponentCard'
import {Col, Form, FormControl, FormLabel, Row, Button} from 'react-bootstrap'
import React from 'react'
import axios from "axios";

interface AddFAQProps {
  mode: "add" | "edit";
  data?: any;
  onCancel: () => void;
  onDataChanged: () => void;
}

const AddFAQ: React.FC<AddFAQProps> = ({mode, data, onCancel, onDataChanged}) => {
    const [formValues, setFormValues] = React.useState({
        mpf_question: "",
        mpf_answer: "",
        mpf_status: "0", // 0 = Active, 1 = Inactive
    });

    React.useEffect(() => {
        if (mode === "edit" && data) {
            setFormValues({
                mpf_question: data.mpf_question || "",
                mpf_answer: data.mpf_answer || "",
                mpf_status: String(data.mpf_status ?? "0"),
            });
        }
    }, [mode, data]);

    const handleChange = (key: string, value: any) => {
        setFormValues(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (mode === "edit" && data) {
                await axios.put(`${process.env.VITE_PATH}/manpower/update-faq/${data.mpf_id}`, formValues);
            } else {
                await axios.post(`${process.env.VITE_PATH}/manpower/add-faq`, formValues);
            }
            onDataChanged();
            onCancel();
        } catch (err) {
            console.error("Error saving FAQ:", err);
            alert("Failed to save FAQ");
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
                <Row className="align-items-end g-3">
                    {/* Question */}
                    <Col lg={4}>
                        <Form.Group controlId="mpf_question" className="mb-0">
                            <FormLabel>Question</FormLabel>
                            <FormControl
                                type="text"
                                value={formValues.mpf_question}
                                onChange={(e) => handleChange("mpf_question", e.target.value)}
                                required
                            />
                        </Form.Group>
                    </Col>

                    {/* Answer */}
                    <Col lg={4}>
                        <Form.Group controlId="mpf_answer" className="mb-0">
                            <FormLabel>Answer</FormLabel>
                            <FormControl
                                as="textarea"
                                rows={3}
                                value={formValues.mpf_answer}
                                onChange={(e) => handleChange("mpf_answer", e.target.value)}
                                required
                            />
                        </Form.Group>
                    </Col>

                    {/* Status */}
                    <Col lg={2}>
                        <Form.Group controlId="mpf_status" className="mb-0">
                            <FormLabel>Status</FormLabel>
                            <Form.Select
                                value={formValues.mpf_status}
                                onChange={(e) => handleChange("mpf_status", e.target.value)}
                            >
                                <option value="0">Active</option>
                                <option value="1">Inactive</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>

                    {/* Buttons */}
                    <Col lg={2}>
                        <div className="d-flex gap-2 mb-0">
                            <Button variant="secondary" onClick={onCancel} className="flex-fill">
                                Cancel
                            </Button>
                            <Button variant="primary" type="submit" className="flex-fill">
                                {mode === "edit" ? "Update" : "Save"}
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Form>
        </ComponentCard>
    )
}

export default AddFAQ
