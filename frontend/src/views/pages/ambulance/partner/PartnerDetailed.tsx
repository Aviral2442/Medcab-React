import React from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Container, Spinner, Nav } from "react-bootstrap";
import PartnerDetails from "@/components/Ambulance/partner/PartnerDetails";
import ManpowerList from "@/components/Ambulance/partner/ManpowerList";
import TransactionList from "@/components/Ambulance/partner/TransactionList";
import { useTableFilters } from "@/hooks/useTableFilters";

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const PartnerDetailed: React.FC = () => {
  const baseURL = (import.meta as any).env?.VITE_PATH ?? "";
  const { id } = useParams<{ id?: string }>();

  const [partnerData, setPartnerData] = React.useState<any>(null);
  const [transactions, setTransactions] = React.useState<any[] | null>(null);
  const [pagination, setPagination] = React.useState<PaginationData>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [manpower, setManpower] = React.useState<any[] | null>(null);

  const [loading, setLoading] = React.useState<boolean>(true);
  const [transactionsLoading, setTransactionsLoading] = React.useState<boolean>(false);
  const [activeTab, setActiveTab] = React.useState<number>(1);

  // Use the custom hook for transaction filters
  const {
    dateFilter,
    dateRange,
    currentPage,
    handleDateFilterChange,
    handleDateRangeChange,
    handlePageChange,
    getFilterParams,
  } = useTableFilters({
    defaultDateFilter: "",
  });

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

  const fetchPartnerTransactions = async (page: number = 1) => {
    if (!id) return;
    try {
      setTransactionsLoading(true);

      const filterParams = getFilterParams(10);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        partner_id: id,
        ...(filterParams.date && { date: filterParams.date }),
        ...(filterParams.fromDate && { fromDate: filterParams.fromDate }),
        ...(filterParams.toDate && { toDate: filterParams.toDate }),
      });

      const resp = await axios.get(
        `${baseURL}/partner/get_partner_transactions_list?${params.toString()}`
      );

      setTransactions(resp.data?.jsonData?.partnerTransactions || []);
      setPagination(resp.data?.pagination || {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      });
    } catch (err) {
      console.error("Error fetching partner transactions:", err);
      setTransactions([]);
    } finally {
      setTransactionsLoading(false);
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
        fetchPartnerTransactions(currentPage + 1);
        break;
      case 3:
        if (!manpower) fetchPartnerManpower();
        break;
      default:
        break;
    }
  }, [activeTab, id, currentPage, dateFilter, dateRange]);

  const handleTransactionPageChange = (newPage: number) => {
    handlePageChange(newPage);
  };

  const renderTabContent = (tabKey: number) => {
    if (loading && tabKey !== 2) {
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
        return (
          <TransactionList
            data={transactions}
            loading={transactionsLoading}
            pagination={pagination}
            currentPage={currentPage}
            dateFilter={dateFilter}
            dateRange={dateRange}
            onDateFilterChange={handleDateFilterChange}
            onDateRangeChange={handleDateRangeChange}
            onPageChange={handleTransactionPageChange}
          />
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
