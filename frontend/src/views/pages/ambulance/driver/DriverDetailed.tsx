import React, { useEffect, useState } from "react";
import { Container, Nav, Spinner, Alert, Card, Table } from "react-bootstrap";
import { useParams } from "react-router-dom";
import axios from "axios";
import DriverDetails from "@/components/Ambulance/driver/DriverDetails";
import TransactionList from "@/components/Ambulance/driver/TransactionList";

const baseURL = (import.meta as any).env?.VITE_PATH ?? "";

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const DriverDetailed: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const [activeTab, setActiveTab] = useState<number>(1);

  // Driver state
  const [loading, setLoading] = useState<boolean>(true);
  const [driverData, setDriverData] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Transaction state
  const [transLoading, setTransLoading] = useState<boolean>(false);
  const [transactions, setTransactions] = useState<any[] | null>(null);
  const [transError, setTransError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  // Fetch driver detail
  const fetchDriver = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const resp = await axios.post(`${baseURL}/driver/driver_detail/${id}`);
      const driver = resp.data?.jsonData?.driver;
      if (!driver) {
        setError("Driver not found");
        setDriverData(null);
      } else {
        setDriverData(driver);
      }
    } catch (err: any) {
      console.error("Failed to fetch driver:", err);
      setError(err?.message || "Failed to fetch driver details");
      setDriverData(null);
    } finally {
      setLoading(false);
    }
  };

  // Fetch transactions with pagination
  const fetchTransactions = async (page: number = 1) => {
    try {
      setTransLoading(true);
      setTransError(null);
      if (!id) return;

      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
      });

      const resp = await axios.get(
        `${baseURL}/transaction/driver_transaction_list?${params.toString()}`
      );
      console.log("Transaction Response:", resp.data);

      const transactionsData = resp.data?.jsonData?.driverTransactions;
      setTransactions(transactionsData || []);

      if (resp.data?.paginations) {
        setPagination({
          page: resp.data.paginations.page,
          limit: resp.data.paginations.limit,
          total: resp.data.paginations.total,
          totalPages: resp.data.paginations.totalPages,
        });
      }
    } catch (err: any) {
      console.error("Failed to fetch transactions:", err);
      setTransError(err?.message || "Failed to fetch transactions");
      setTransactions(null);
    } finally {
      setTransLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    fetchTransactions(newPage + 1);
  };

  useEffect(() => {
    if (activeTab === 1 && !driverData && !loading) {
      fetchDriver();
    }
  }, [activeTab, id]);

  useEffect(() => {
    if (activeTab === 1) {
      fetchDriver();
    }
  }, [id]);

  useEffect(() => {
    if (activeTab === 2 && transactions === null && !transLoading) {
      fetchTransactions(currentPage + 1);
    }
  }, [activeTab, id]);

  const tabs = [
    { eventKey: 1, title: "Driver" },
    { eventKey: 2, title: "Transactions" },
  ];

  return (
    <Container fluid className="p-0">
      {loading && activeTab === 1 ? (
        <div className="text-center p-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading driver details...</p>
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

          <div className="tab-content">
            {activeTab === 1 && (
              <div>
                <DriverDetails data={driverData} loading={loading} error={error} />
              </div>
            )}

            {activeTab === 2 && (
              <div>
                <TransactionList
                  data={transactions}
                  loading={transLoading}
                  error={transError}
                  pagination={pagination}
                  currentPage={currentPage}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </Container>
  );
};

export default DriverDetailed;