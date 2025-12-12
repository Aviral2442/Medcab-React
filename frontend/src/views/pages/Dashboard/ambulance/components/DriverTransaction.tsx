import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardTitle,
  Table,
} from "react-bootstrap";
import axios from "axios";
import { useEffect, useState } from "react";
import { formatDate } from "@/components/DateFormat";

const DriverTransaction = () => {
  const basePath = (import.meta as any).env?.VITE_PATH ?? "";

  interface DriverTransaction {
    driver_transection_id: number;
    driver_transection_by: number;
    driver_transection_by_type: string;
    driver_transection_type: string;
    driver_transection_amount: number;
    driver_transection_wallet_previous_amount: number;
    driver_transection_wallet_new_amount: number;
    driver_transection_note: string;
    driver_transection_status: string;
    driver_transection_by_partner_wallet_status: number;
    driver_transection_time_unix: number;
    trans_by_id: number;
    trans_by_name: string;
    trans_by_mobile: string;
    created_at: string;
  }

  const headers = [
    "ID",
    "Name",
    "Mobile",
    "Type",
    // "Note",
    // "Prev Amt",
    "Amount",
    // "New Amt",
    // "Status",
    "Date",
  ];

  const [data, setData] = useState<DriverTransaction[]>([]);

  const fetchDriverTransactions = async () => {
    try {
      const response = await axios.get(
        `${basePath}/ambulance/dashboard_ambulance_driver_transactions`
      );
    //   console.log("Driver Transactions Data", response.data);
      const rows = response.data?.jsonData?.dashboard_ambulance_driver_transactions || [];
      setData(rows);
      return rows;
    } catch (error) {
      console.error("Error fetching driver transactions:", error);
      throw error;
    }
  };

  useEffect(() => {
    fetchDriverTransactions();
  }, []);

  const getTransactionType = (type: string): string => {
    switch (type) {
      case "1":
        return "Add in Wallet (A)";
      case "2":
        return "Cancellation Charge (W)";
      case "3":
        return "Cash Collect (W)";
      case "4":
        return "Online Booking Payment (A)";
      case "5":
        return "Transfer to Bank (W)";
      case "6":
        return "Fetched by Partner (W)";
      case "7":
        return "Incentive from Company (A)";
      case "15":
        return "Tip from Consumer";
      default:
        return "N/A";
    }
  };

  const getTransactionByType = (type: string): string => {
    switch (type) {
      case "0":
        return "Direct Driver";
      case "1":
        return "By Partner";
      case "2":
        return "By Company";
      case "3":
        return "Tip From Consumer";
      default:
        return "N/A";
    }
  };

  // const getTransactionStatus = (status: string): JSX.Element => {
  //   switch (status) {
  //     case "0":
  //       return <span className="badge bg-success">Success</span>;
  //     case "1":
  //       return <span className="badge bg-warning">Pending</span>;
  //     case "2":
  //       return <span className="badge bg-danger">Refunded</span>;
  //     default:
  //       return <span className="badge bg-secondary">N/A</span>;
  //   }
  // };

  const formatValue = (value: number | string | null | undefined): string => {
    if (value === null || value === undefined) return "0.00";
    const num = parseFloat(String(value));
    if (isNaN(num)) return "0.00";
    return num.toFixed(2);
  };

  return (
    <Card>
      <CardHeader className="border-dashed">
        <CardTitle as="h4" className="mb-0">
          Driver Transactions
        </CardTitle>
      </CardHeader>

      <CardBody className="p-0">
        <Table
          size="sm"
          responsive
          className="table-centered table-custom table-nowrap mb-0"
        >
          <thead className="bg-light-subtle thead-sm">
            <tr className="text-uppercase fs-xxs">
              {headers.map((header) => (
                <th key={header}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((row, idx) => (
                <tr key={idx}>
                  <td>{row.driver_transection_id}</td>
                  <td>
                    {row.trans_by_name || " "}
                    </td>
                    <td>
                    {row.trans_by_mobile && `${row.trans_by_mobile}`}
                  </td>
                  <td>
                    <div>{getTransactionByType(row.driver_transection_by_type)}</div>
                    <small className="text-muted">
                      {getTransactionType(row.driver_transection_type)}
                    </small>
                  </td>
                  {/* <td>{row.driver_transection_note || " "}</td> */}
                    {/* <td>₹{formatValue(row.driver_transection_wallet_previous_amount)}</td> */}
                  <td>
                    {row.driver_transection_type === "1" ||
                    row.driver_transection_type === "4" ||
                    row.driver_transection_type === "7" ||
                    row.driver_transection_type === "15" ? (
                      <span className="text-success">
                        ₹{formatValue(row.driver_transection_amount)}
                      </span>
                    ) : (
                      <span className="text-danger">
                        ₹{formatValue(row.driver_transection_amount)}
                      </span>
                    )}
                  </td>
                  {/* <td>₹{formatValue(row.driver_transection_wallet_new_amount)}</td> */}
                  {/* <td>{getTransactionStatus(row.driver_transection_status)}</td> */}
                  <td>{formatDate(row.created_at)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={headers.length} className="text-center">
                  No transactions found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </CardBody>

      <CardFooter className="border-top-0 text-end">
        <div className="text-muted">
          Last update:{" "}
          {new Date()
            .toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
            .replace(/ /g, " ")}
        </div>
      </CardFooter>
    </Card>
  );
};

export default DriverTransaction;




/*





*/