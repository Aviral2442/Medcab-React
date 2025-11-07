import React from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import VendorDetails from "@/components/Vendor/VendorDetails";
import { Container, Nav, Spinner } from "react-bootstrap";

const vendorDetails = () => {
  const { id } = useParams();
  const [loading, setLoading] = React.useState(true);
  const [VendorData, setVendorData] = React.useState<any>(null);
  const [activeTab, setActiveTab] = React.useState(1);

  const tabs = [
    { eventKey: 1, title: "Vendor Details" },
    { eventKey: 2, title: "Transaction List" },
    { eventKey: 3, title: "PickUp City Vendor List" },
    { eventKey: 4, title: "Reject List" },
    { eventKey: 5, title: "Accept List" },
  ];

  const fetchVendorDetails = async () => {
    try {
      setLoading(true);
      const res = await axios.post(`${process.env.VITE_PATH}/vendor/vendor_detail/${id}`);
      console.log("Vendor Details:", res.data);
      setVendorData(res.data?.jsonData);
    } catch (error) {
      console.error("Error fetching vendor details:", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchVendorDetails();
  }, [id]);

  const handleFieldUpdate = async (field: string, value: string) => {
    try {
      // Update API call
      await axios.put(`${process.env.VITE_PATH}/vendor/vendor_data_update/${id}`, {
        [field]: value,
      });

      // Update local state
      setVendorData((prev: any) => ({
        ...prev,
        [field]: value,
      }));

      console.log(`Updated ${field} to ${value}`);
    } catch (error) {
      console.error("Error updating booking:", error);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 1:
        return VendorData ? (
          <VendorDetails
            data={VendorData}
            onUpdate={handleFieldUpdate}
            editable={true}
          />
        ) : (
          <div className="text-center p-5">
            <p className="text-muted">No Vendor Data Found</p>
          </div>
        );
      case 2:
        return <div>Transaction List Content</div>;
      case 3:
        return <div>PickUp City Vendor List Content</div>;
      case 4:
        return <div>Reject List Content</div>;
      case 5:
        return <div>Accept List Content</div>;
      default:
        return null;
    }
  };

  return (
    <Container fluid className="p-2">
      {loading ? (
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
            {renderTabContent()}
          </div>
        </div>
      )}
    </Container>
  )
};

export default vendorDetails;
