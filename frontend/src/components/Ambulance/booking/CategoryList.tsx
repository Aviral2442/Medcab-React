import React, { useState, useEffect } from "react";
import { Modal, Button, Card, Row, Col, Spinner, Badge } from "react-bootstrap";
import BookingDetailsApiData from "./BookingDetailsApiData";
import Swal from "sweetalert2";

interface CategoryListModalProps {
  show: boolean;
  onHide: () => void;
  data: any;
}

interface Facility {
  facilities_name: string;
  facilities_image: string;
}

interface Category {
  category_name: string;
  category_icon: string;
  per_ext_km_rate: string | number;
  total_fare: string | number;
  advance_amount: string | number;
  facilities_list: Facility[];
}

const CategoryListModal: React.FC<CategoryListModalProps> = ({
  show,
  onHide,
  data,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const api = BookingDetailsApiData();

  useEffect(() => {
    if (show && data) {
      fetchCategories();
    }
  }, [show, data]);

  const fetchCategories = async () => {
    if (!data) return;

    setLoading(true);
    try {
      const result = await api.fetchCategoryList(
        data.booking_by_cid?.toString() || "0",
        data.booking_type?.toString() || "0",
        data.booking_pickup || "",
        data.booking_drop || "",
        data.booking_pickup_lat?.toString() || "",
        data.booking_pickup_long?.toString() || "",
        data.booking_drop_lat?.toString() || "",
        data.booking_drop_long?.toString() || "",
        data.booking_distance?.toString() || "0",
        data.booking_duration?.toString() || "0",
        data.booking_polyline || "",
        data.booking_schedule_time || "",
        data.consumer_auth_key || "medcab@123"
      );

      if (result.success && result.data) {
        console.log(result.data);
        setCategories(result.data.category_price_list || []);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: result.message || "Failed to fetch category list",
          confirmButtonColor: "#d33",
        });
      }
    } catch (error: any) {
      console.error("Error fetching categories:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load categories. Please try again.",
        confirmButtonColor: "#d33",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="xl" centered>
      <Modal.Header closeButton>
        <Modal.Title>Available Categories</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ maxHeight: "70vh", overflowY: "auto" }}>
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3">Loading categories...</p>
          </div>
        ) : categories.length > 0 ? (
          <Row>
            {categories.map((category, index) => (
              <Col lg={6} md={12} key={index} className="mb-3">
                <Card className="h-100 shadow-sm">
                  <Card.Body>
                    <div className="d-flex align-items-center mb-3">
                      <img
                        src={category.category_icon || "https://via.placeholder.com/50"}
                        alt={category.category_name}
                        className="me-3"
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "contain",
                        }}
                      />
                      <div className="flex-grow-1">
                        <h5 className="mb-1">{category.category_name}</h5>
                        <Badge bg="primary">₹{category.total_fare}</Badge>
                      </div>
                    </div>

                    <Row className="mb-3">
                      <Col xs={6}>
                        <small className="text-muted">Per Extra KM</small>
                        <div className="fw-bold">₹{category.per_ext_km_rate}</div>
                      </Col>
                      <Col xs={6}>
                        <small className="text-muted">Advance Amount</small>
                        <div className="fw-bold">₹{category.advance_amount}</div>
                      </Col>
                    </Row>

                    {category.facilities_list && category.facilities_list.length > 0 && (
                      <div>
                        <h6 className="text-muted mb-2">Facilities:</h6>
                        <div className="d-flex flex-wrap gap-2">
                          {category.facilities_list.map((facility, idx) => (
                            <div
                              key={idx}
                              className="d-flex align-items-center border rounded px-2 py-1"
                              style={{ fontSize: "0.85rem" }}
                            >
                              {facility.facilities_image && (
                                <img
                                  src={facility.facilities_image}
                                  alt={facility.facilities_name}
                                  className="me-1"
                                  style={{
                                    width: "20px",
                                    height: "20px",
                                    objectFit: "contain",
                                  }}
                                />
                              )}
                              <span>{facility.facilities_name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <div className="text-center py-5">
            <p className="text-muted">No categories available for this booking</p>
          </div>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CategoryListModal;
