import React, { useEffect, useState } from "react";
import { Container, Nav, Spinner, Alert, Card, Table } from "react-bootstrap";
import { useParams } from "react-router-dom";
import axios from "axios";
import DriverDetails from "@/components/Ambulance/DriverDetails";
import DateConversion from "@/components/DateConversion";

const baseURL = (import.meta as any).env?.VITE_PATH ?? "";

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

  // Fetch transactions (attempt common list of urls used across project)
  const fetchTransactions = async () => {
    if (!id) return;
    // don't re-fetch if already loaded
    if (transactions !== null) return;

    setTransLoading(true);
    setTransError(null);

    const candidateUrls = [
      `${baseURL}/transaction/driver_trans_data/${id}`,
      `${baseURL}/transaction/driverTransData/${id}`,
      `${baseURL}/transaction/get_driver_transaction/${id}`,
      `${baseURL}/transaction/driver_transactions/${id}`,
    ];

    let found = false;
    let lastErr: any = null;
    for (const url of candidateUrls) {
      try {
        const resp = await axios.get(url);
        // common shapes: resp.data.jsonData.driverTransactions or resp.data.jsonData (array)
        const rows = resp.data?.jsonData?.driverTransactions ?? resp.data?.jsonData?.driverTransactionsList ?? resp.data?.jsonData;
        if (rows && Array.isArray(rows)) {
          setTransactions(rows);
          found = true;
          break;
        }
        if (Array.isArray(resp.data?.jsonData)) {
          setTransactions(resp.data.jsonData);
          found = true;
          break;
        }
      } catch (err) {
        lastErr = err;
        // try next endpoint in list
      }
    }

    if (!found) {
      console.error("Failed to fetch driver transactions:", lastErr);
      setTransError("Unable to fetch transactions. Check endpoint availability.");
      setTransactions([]);
    }
    setTransLoading(false);
  };

  // Build a union of keys across all transaction rows to render table headers
  const buildTransactionHeaders = (rows: any[]) => {
    const headersSet = new Set<string>();
    rows.forEach((r) => {
      Object.keys(r || {}).forEach((k) => headersSet.add(k));
    });
    return Array.from(headersSet);
  };

  const renderTransactionCell = (row: any, key: string) => {
    const value = row[key];
    if (value === null || value === undefined || value === "") return "N/A";
    const lc = key.toLowerCase();
    if (lc.includes("date") || lc.includes("time") || lc.includes("created_at")) {
      try {
        const date = /^\d+$/.test(String(value)) ? new Date(parseInt(String(value)) * 1000) : new Date(value);
        if (!isNaN(date.getTime())) return DateConversion(date.toISOString());
      } catch {}
      return String(value);
    }
    return String(value);
  };

  // Trigger fetches based on tab change
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
      fetchTransactions();
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
                <Card className="mb-4">
                  <Card.Body>
                    <h6 className="mb-3">Driver Transactions</h6>

                    {transLoading ? (
                      <div className="text-center py-3">
                        <Spinner animation="border" />
                      </div>
                    ) : transError ? (
                      <Alert variant="danger">{transError}</Alert>
                    ) : !transactions || transactions.length === 0 ? (
                      <Alert variant="warning">No transactions found</Alert>
                    ) : (
                      <div className="overflow-auto">
                        <Table bordered hover size="sm" responsive>
                          <thead className="table-dark">
                            <tr>
                              {buildTransactionHeaders(transactions).map((h) => (
                                <th key={h}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {transactions.map((row, idx) => (
                              <tr key={idx}>
                                {buildTransactionHeaders(transactions).map((h) => (
                                  <td key={`${idx}-${h}`}>{renderTransactionCell(row, h)}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </div>
            )}
          </div>
        </div>
      )}
    </Container>
  );
};

export default DriverDetailed;