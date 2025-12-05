import React from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import VendorDetails from "@/components/Vendor/VendorDetails";
import { Container, Nav, Spinner } from "react-bootstrap";
import TransactionList from "@/components/Vendor/TransactionList";

const vendorDetails = () => {
  const { id } = useParams();
  const [loading, setLoading] = React.useState(true);
  const [VendorData, setVendorData] = React.useState<any>(null);
  const [transactions, setTransactions] = React.useState<any[]>([]);
  const [activeTab, setActiveTab] = React.useState(1);
  const baseURL = (import.meta as any).env?.VITE_PATH ?? "";

  const tabs = [
    { eventKey: 1, title: "Vendor Details" },
    { eventKey: 2, title: "Transaction List" },
    // { eventKey: 3, title: "PickUp City Vendor List" },
    // { eventKey: 4, title: "Reject List" },
    // { eventKey: 5, title: "Accept List" },
  ];

  const fetchVendorDetails = async () => {
    try {
      setLoading(true);
      const res = await axios.post(`${baseURL}/vendor/vendor_detail/${id}`);
      console.log("Vendor:", res.data?.jsonData);
      setVendorData(res.data?.jsonData);
    } catch (error) {
      console.error("Error fetching vendor details:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactionsList = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${baseURL}/transaction/vendor_transaction_data/${id}`
      );
      console.log("Transactions List:", res.data);
      setTransactions(res.data?.jsonData?.vendorTransactions || []);
    } catch (error) {
      console.error("Error fetching transactions list:", error);
    } finally {
      setLoading(false);
    }
  };
  // fetch data on active tab change
  React.useEffect(() => {
    if (activeTab === 1) fetchVendorDetails();
    else if (activeTab === 2) {
      fetchTransactionsList();
    }
  }, [activeTab, id]);

  const handleFieldUpdate = async (field: string, value: string) => {
    try {
      // Update API call
      await axios.put(`${baseURL}/vendor/vendor_data_update/${id}`, {
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
        return transactions ? (
          <TransactionList data={transactions} />
        ) : (
          <div className="text-center p-5">
            <p className="text-muted">No Transactions Data Found</p>
          </div>
        );
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
            {tabs.map((tab) => (
              <Nav.Item key={tab.eventKey}>
                <Nav.Link
                  active={activeTab === tab.eventKey}
                  onClick={() => setActiveTab(tab.eventKey)}
                  style={{ cursor: "pointer" }}
                >
                  {tab.title}
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>
          <div className="tab-content">{renderTabContent()}</div>
        </div>
      )}
    </Container>
  );
};

export default vendorDetails;
