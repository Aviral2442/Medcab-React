import ComponentCard from "@/components/ComponentCard";
import {
  Col,
  Form,
  FormControl,
  FormLabel,
  Row,
  Button,
} from "react-bootstrap";
import React, { useEffect } from "react";
import axios from "axios";
import { LuTrash } from "react-icons/lu";

interface AddCityFAQProps {
  mode: "add" | "edit";
  data?: any;
  onCancel: () => void;
  onDataChanged: () => void;
  sectionId: number;
}

interface FAQItem {
  city_id: number;
  city_faq_que: string;
  city_faq_ans: string;
  city_faq_status: string;
}

const AddCityFAQ: React.FC<AddCityFAQProps> = ({
  mode,
  data,
  onCancel,
  onDataChanged,
  sectionId,
}) => {
  const [faqList, setFaqList] = React.useState<FAQItem[]>([
    {
      city_id: 0,
      city_faq_que: "",
      city_faq_ans: "",
      city_faq_status: "1",
    },
  ]);

  const baseURL = (import.meta as any).env?.VITE_PATH ?? "";
  const [cityData, setCityData] = React.useState<any[]>([]);
  const [selectedCityId, setSelectedCityId] = React.useState<number>(0);

  React.useEffect(() => {
    if (mode === "edit" && data) {
      // Handle pathology section differently
      if (sectionId === 4) {
        setSelectedCityId(data.city_pathology_id || 0);
        setFaqList([
          {
            city_id: data.city_pathology_id || 0,
            city_faq_que: data.city_pathology_faq_que || "",
            city_faq_ans: data.city_pathology_faq_ans || "",
            city_faq_status: String(data.city_pathology_faq_status ?? "1"),
          },
        ]);
      } else {
        setSelectedCityId(data.city_id || 0);
        setFaqList([
          {
            city_id: data.city_id || 0,
            city_faq_que: data.city_faq_que || "",
            city_faq_ans: data.city_faq_ans || "",
            city_faq_status: String(data.city_faq_status ?? "1"),
          },
        ]);
      }
    }
  }, [mode, data, sectionId]);

  const handleChange = (index: number, key: keyof FAQItem, value: string) => {
    setFaqList((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [key]: value };
      return updated;
    });
  };

  const handleCityChange = (cityId: string) => {
    const parsedCityId = parseInt(cityId);
    setSelectedCityId(parsedCityId);

    // Update all FAQs with the selected city ID
    setFaqList((prev) =>
      prev.map((faq) => ({
        ...faq,
        city_id: parsedCityId,
      }))
    );
  };

  const handleAddMore = () => {
    setFaqList((prev) => [
      ...prev,
      {
        city_id: selectedCityId,
        city_faq_que: "",
        city_faq_ans: "",
        city_faq_status: "1",
      },
    ]);
  };

  const handleRemove = (index: number) => {
    if (faqList.length > 1) {
      setFaqList((prev) => prev.filter((_, i) => i !== index));
    }
  };

  // Get the correct API endpoint based on sectionId - Updated to match backend routes
  const getApiEndpoints = () => {
    const endpoints: Record<number, { add: string; edit: string }> = {
      1: {
        add: "/content_writer/add_city_content_faq",
        edit: "/content_writer/edit_city_content_faq",
      },
      2: {
        add: "/content_writer/add_city_manpower_content_faq",
        edit: "/content_writer/edit_city_manpower_content_faq",
      },
      3: {
        add: "/content_writer/add_city_video_consult_content_faq",
        edit: "/content_writer/edit_city_video_consult_content_faq",
      },
      4: {
        add: "/content_writer/add_city_pathology_content_faq",
        edit: "/content_writer/edit_city_pathology_content_faq",
      },
    };
    return endpoints[sectionId] || endpoints[1];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const endpoints = getApiEndpoints();

      if (mode === "edit" && data) {
        // Handle pathology section differently
        if (sectionId === 4) {
          const payload = {
            city_pathology_id: selectedCityId,
            city_pathology_faq_que: faqList[0].city_faq_que,
            city_pathology_faq_ans: faqList[0].city_faq_ans,
          };
          await axios.put(
            `${baseURL}${endpoints.edit}/${data.city_pathology_faq_id}`,
            payload
          );
        } else {
          const payload = {
            city_id: selectedCityId,
            city_faq_que: faqList[0].city_faq_que,
            city_faq_ans: faqList[0].city_faq_ans,
          };
          await axios.put(
            `${baseURL}${endpoints.edit}/${data.city_faq_id}`,
            payload
          );
        }
        onDataChanged();
        onCancel();
      } else {
        // Handle add mode
        if (sectionId === 4) {
          // Pathology section uses different field names
          const payload = faqList.map((faq) => ({
            city_pathology_id: faq.city_id,
            city_pathology_faq_que: faq.city_faq_que,
            city_pathology_faq_ans: faq.city_faq_ans,
          }));
          await Promise.all(
            payload.map((faq) =>
              axios.post(`${baseURL}${endpoints.add}`, faq)
            )
          );
        } else {
          const payload = faqList.map((faq) => ({
            city_id: faq.city_id,
            city_faq_que: faq.city_faq_que,
            city_faq_ans: faq.city_faq_ans,
          }));
          await Promise.all(
            payload.map((faq) =>
              axios.post(`${baseURL}${endpoints.add}`, faq)
            )
          );
        }
        onDataChanged();
        onCancel();
        console.log("City FAQs added successfully");
      }
    } catch (err: any) {
      console.error("Error saving City FAQ:", err);
      console.error("Response data:", err.response?.data);
      alert(
        `Failed to save City FAQ: ${err.response?.data?.message || err.message}`
      );
    }
  };

  // Fetch city content based on sectionId
  const fetchCityContent = async () => {
    try {
      const endpointMap: Record<number, string> = {
        1: "/content_writer/get_city_content",
        2: "/content_writer/get_manpower_city_content",
        3: "/content_writer/get_video_consult_city_content",
        4: "/content_writer/get_pathology_city_content",
      };

      const endpoint = endpointMap[sectionId] || endpointMap[1];
      const res = await axios.get(`${baseURL}${endpoint}`);
      console.log("City Content in faq fetched:", res.data);

      // Map response based on sectionId
      let cityList: any[] = [];
      if (sectionId === 1) {
        cityList = res.data?.jsonData?.city_content_list || [];
      } else if (sectionId === 2) {
        cityList = res.data?.jsonData?.city_manpower_content_list || [];
      } else if (sectionId === 3) {
        cityList = res.data?.jsonData?.city_video_consultancy_content_list || [];
      } else if (sectionId === 4) {
        cityList = res.data?.jsonData?.pathology_city_content_list || [];
      }

      setCityData(cityList);
    } catch (err) {
      console.error("Error fetching City Content:", err);
      return [];
    }
  };

  useEffect(() => {
    fetchCityContent();
  }, [sectionId]);

  return (
    <ComponentCard
      title={
        <div className="d-flex justify-content-between align-items-center">
          <span>{mode === "edit" ? "Edit City FAQ" : "Add City FAQ"}</span>
        </div>
      }
    >
      <Form onSubmit={handleSubmit}>
        {/* City Select - Render only once */}
        <Row className="mb-3">
          <Col lg={12}>
            <Form.Group controlId="city_select" className="mb-0">
              <FormLabel className="fs-6 fw-semibold">
                Select City <span className="text-danger">*</span>
              </FormLabel>
              <FormControl
                as="select"
                value={selectedCityId}
                onChange={(e) => handleCityChange(e.target.value)}
                required
                disabled={mode === "edit"}
              >
                <option value="">Select City</option>
                {cityData.map((city) => (
                  <option
                    key={city.city_id || city.city_pathology_id}
                    value={city.city_id || city.city_pathology_id}
                  >
                    {city.city_name || city.city_pathology_name}
                  </option>
                ))}
              </FormControl>
            </Form.Group>
          </Col>
        </Row>

        {/* FAQ List */}
        {faqList.map((faq, index) => (
          <React.Fragment key={index}>
            <Row className="align-items-end g-1 mb-3">
              {/* Question */}
              <Col lg={12} className="mb-0 pb-0">
                <Form.Group
                  controlId={`city_faq_que_${index}`}
                  className="mb-0"
                >
                  <FormLabel className="fs-6 fw-semibold">
                    Question {index + 1}
                  </FormLabel>
                  <div className="d-flex gap-2 align-items-center">
                    <FormControl
                      type="text"
                      value={faq.city_faq_que}
                      onChange={(e) =>
                        handleChange(index, "city_faq_que", e.target.value)
                      }
                      required
                      placeholder="Enter question"
                    />
                    {faqList.length > 1 && (
                      <button
                        type="button"
                        className="p-2 rounded text-danger d-flex justify-content-center align-items-center border-0 bg-light"
                        onClick={() => handleRemove(index)}
                        title="Remove FAQ"
                        style={{ minWidth: "38px", height: "38px" }}
                      >
                        <LuTrash size={18} />
                      </button>
                    )}
                  </div>
                </Form.Group>
              </Col>

              {/* Answer */}
              <Col lg={12}>
                <Form.Group
                  controlId={`city_faq_ans_${index}`}
                  className="mb-0"
                >
                  <FormLabel className="fs-6 fw-semibold">
                    Answer {index + 1}
                  </FormLabel>
                  <FormControl
                    as="textarea"
                    rows={2}
                    value={faq.city_faq_ans}
                    onChange={(e) =>
                      handleChange(index, "city_faq_ans", e.target.value)
                    }
                    required
                    placeholder="Enter answer"
                  />
                </Form.Group>
              </Col>
            </Row>
            {index < faqList.length - 1 && <hr className="my-3" />}
          </React.Fragment>
        ))}

        {/* Action Buttons */}
        <Row className="mt-4">
          <Col lg={12} className="d-flex justify-content-end gap-2">
            <button
              type="button"
              className="px-3 rounded text-black"
              onClick={onCancel}
            >
              Cancel
            </button>
            {mode === "add" && (
              <button
                type="button"
                className="cancel-button px-3 rounded text-white"
                onClick={handleAddMore}
              >
                + Add More FAQ
              </button>
            )}
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
