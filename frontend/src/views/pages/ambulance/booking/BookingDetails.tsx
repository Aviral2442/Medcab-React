import React from 'react';
import { Container, Spinner, Nav } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import AmbulanceBookingDetails from '@/components/Ambulance/booking/BookingDetails';
import BookingDetailsApiData from '@/components/Ambulance/booking/BookingDetailsApiData';

const BookingDetails = () => {
  const api = BookingDetailsApiData();
  const { id } = useParams();
  const [bookingData, setBookingData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState(1);

  const tabs = [
    { eventKey: 1, title: 'Booking Details' },
    { eventKey: 2, title: 'Nearest Driver/Partner' },
    { eventKey: 3, title: 'City Wise' },
    { eventKey: 4, title: 'State Wise' },
    { eventKey: 5, title: 'Accept History' },
    { eventKey: 6, title: 'Remark' },
  ];

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      const result = await api.fetchBookingDetails(id!);
      if (result.success) {
        console.log("Fetched booking details:", result.data);
        setBookingData(result.data);
      }
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
    setBookingData((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  const renderTabContent = (tabKey: number) => {
    switch(tabKey) {
      case 1:
        return bookingData ? (
          <AmbulanceBookingDetails
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