import React from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Container, Spinner, Nav } from "react-bootstrap";
import PartnerDetails from "@/components/Ambulance/partner/PartnerDetails";
import ManpowerList from "@/components/Ambulance/partner/ManpowerList";

const PartnerDetailed: React.FC = () => {
  const baseURL = (import.meta as any).env?.VITE_PATH ?? "";
  const { id } = useParams<{ id?: string }>();

  const [partnerData, setPartnerData] = React.useState<any>(null);
  const [transactions, setTransactions] = React.useState<any[] | null>(null);
  const [manpower, setManpower] = React.useState<any[] | null>(null);

  const [loading, setLoading] = React.useState<boolean>(true);
  const [activeTab, setActiveTab] = React.useState<number>(1);

  const tabs = [
    { eventKey: 1, title: "Partner" },
    { eventKey: 2, title: "Transactions" },
    { eventKey: 3, title: "Manpower Partners" },
  ];

  const fetchPartner = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const resp = await axios.post(
        `${baseURL}/partner/get_partner_details/${id}`
      );
      const partnerAccountDetail = resp.data?.jsonData?.partnerAccountDetail;
      const partnerBasicDetail = resp.data?.jsonData?.partnerBasicDetail;
      console.log("Fetched partner basic detail:", partnerBasicDetail);
      console.log(
        "Fetched partner account detail:",
        partnerAccountDetail
      );

      const partner = {
        ...partnerBasicDetail[0],
        ...partnerAccountDetail[0],
      };

      setPartnerData(partner);
    } catch (err) {
      console.error("Error fetching partner:", err);
      setPartnerData(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchPartnerTransactions = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const resp = await axios.get(
        `${baseURL}/partner/get_partner_transactions_list`
      );
      // Expecting resp.data.jsonData.partnerTransactions
      setTransactions(resp.data?.jsonData?.partnerTransactions || []);
    } catch (err) {
      console.error("Error fetching partner transactions:", err);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchPartnerManpower = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const resp = await axios.get(
        `${baseURL}/partner/get_manpower_partners_list`
      );
      setManpower(resp.data?.jsonData?.partners || []);
    } catch (err) {
      console.error("Error fetching partner manpower :", err);
      setManpower([]);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (id) fetchPartner();
  }, [id]);

  React.useEffect(() => {
    switch (activeTab) {
      case 2:
        if (!transactions) fetchPartnerTransactions();
        break;
      case 3:
        if (!manpower) fetchPartnerManpower();
        break;
      default:
        break;
    }
  }, [activeTab, id]);

  const renderTabContent = (tabKey: number) => {
    if (loading) {
      return (
        <div className="text-center p-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading...</p>
        </div>
      );
    }

    switch (tabKey) {
      case 1:
        return <PartnerDetails data={partnerData} />;
      case 2:
        return transactions && transactions.length ? (
          <div>
            <h6>Transactions ({transactions.length})</h6>
            <pre style={{ whiteSpace: "pre-wrap" }}>
              {JSON.stringify(transactions, null, 2)}
            </pre>
          </div>
        ) : (
          <div className="text-muted">No Transactions Found</div>
        );
      case 3:
        return manpower && manpower.length ? (
          <div>
            <ManpowerList data={manpower} />
          </div>
        ) : (
          <div className="text-muted">No Manpower Partners Found</div>
        );
      default:
        return null;
    }
  };

  return (
    <Container fluid className="p-2">
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

        <div className="tab-content">{renderTabContent(activeTab)}</div>
      </div>
    </Container>
  );
};

export default PartnerDetailed;
