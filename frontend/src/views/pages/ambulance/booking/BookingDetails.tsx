import axios from 'axios';
import React from 'react';
import { Container, Spinner, Nav } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import AmbulanceBookingDetailsForm from '@/components/Ambulance/booking/BookingDetails';

const BookingDetails = () => {
  const baseURL = (import.meta as any).env?.VITE_PATH ?? "";

  const { id } = useParams();
  const [bookingData, setBookingData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState(1);

  const tabs = [
    { eventKey: 1, title: 'Booking Details' },
  ];

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseURL}/ambulance/ambulance_booking_detail/${id}`);
      setBookingData(response.data.jsonData.booking_detail);
      console.log(response.data.jsonData.booking_detail);
    } catch (error) {
      console.error("Error fetching booking details:", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (activeTab === 1 && !bookingData) {
      fetchBookingDetails();
    }
  }, [activeTab, id]);

  const handleFieldUpdate = async (field: string, value: string) => {
    try {
      await axios.put(`${baseURL}/ambulance/ambulance_booking_update/${id}`, {
        [field]: value
      });
      
      setBookingData((prev: any) => ({
        ...prev,
        [field]: value
      }));
      
      console.log(`Updated ${field} to ${value}`);
    } catch (error) {
      console.error("Error updating booking:", error);
    }
  };

  const renderTabContent = (tabKey: number) => {
    switch(tabKey) {
      case 1:
        return bookingData ? (
          <AmbulanceBookingDetailsForm
            data={bookingData}
            onUpdate={handleFieldUpdate}
            editable={true}
          />
        ) : (
          loading ? (
            <div className="text-center p-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3">Loading booking details...</p>
            </div>
          ) : (
            <div className="text-center p-5">
              <p className="text-muted">No booking data found</p>
            </div>
          )
        );
      case 2:
        return (
          <div className='text-center p-5'>
            <p className="text-muted">Transaction List - Coming Soon</p>
          </div>
        );
      case 3:
        return (
          <div className='text-center p-5'>
            <p className="text-muted">Accept/Reject History - Coming Soon</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Container fluid className="p-2">
      {loading && activeTab === 1 && !bookingData ? (
        <div className="text-center p-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading booking details...</p>
        </div>
      ) : (
        <div className="m-3 ms-0">
          <Nav variant="tabs" className="mb-3">
            {tabs.map(tab => (
              <Nav.Item key={tab.eventKey}>
                <Nav.Link
                  active={activeTab === tab.eventKey}
                  onClick={() => setActiveTab(tab.eventKey)}
                  style={{ cursor: 'pointer' }}
                >
                  {tab.title}
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>
          <div className="tab-content">
            {renderTabContent(activeTab)}
          </div>
        </div>
      )}
    </Container>
  );
};

export default BookingDetails;