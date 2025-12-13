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

const PartnerTransaction = () => {
  const basePath = (import.meta as any).env?.VITE_PATH ?? "";

  interface PartnerTransaction {
    partner_transection_id: number;
    partner_f_name: string;
    partner_l_name: string;
    partner_mobile: string;
    partner_transection_type: string;
    partner_transection_amount: number;
    partner_transection_wallet_previous_amount: number;
    partner_transection_wallet_new_amount: number;
    partner_transection_note: string;
    partner_transection_status: string;
    created_at: string;
  }

  const headers = [
    "ID",
    "Partner Name",
    "Mobile",
    "Type",
    // "Prev Amt",
    "Amount",
    // "New Amt",
    // "Note",
    // "Status",
    "Date",
  ];

  const [data, setData] = useState<PartnerTransaction[]>([]);

  const fetchPartnerTransactions = async () => {
    try {
      const response = await axios.get(
        `${basePath}/ambulance/dashboard_ambulance_partner_transactions`
      );
      // console.log("Partner Transactions Data", response.data);
      const rows = response.data?.jsonData?.dashboard_ambulance_partner_transactions || [];
      setData(rows);
      return rows;
    } catch (error) {
      console.error("Error fetching partner transactions:", error);
      throw error;
    }
  };

  useEffect(() => {
    fetchPartnerTransactions();
  }, []);

  const getTransactionType = (type: string): string => {
    switch (type) {
      case "1":
        return "Add in Wallet";
      case "2":
        return "Transfer to Bank";
      case "3":
        return "Fetch from Driver";
      default:
        return "N/A";
    }
  };

  // const getTransactionStatus = (status: string): JSX.Element => {
  //   switch (status) {
  //     case "0":
  //       return <span className="badge bg-secondary">Default</span>;
  //     case "1":
  //       return <span className="badge bg-warning">Pending Withdrawal</span>;
  //     case "2":
  //       return <span className="badge bg-success">Refunded</span>;
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

  const getAmountColor = (type: string): string => {
    switch (type) {
      case "1": // Add in Wallet
        return "text-success";
      case "2": // Transfer to Bank
        return "text-danger";
      case "3": // Fetch from Driver
        return "text-primary";
      default:
        return "";
    }
  };

  return (
    <Card>
      <CardHeader className="border-dashed">
        <CardTitle as="h4" className="mb-0">
          Partner Transactions
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
                  <td>{row.partner_transection_id}</td>
                  <td>
                    {row.partner_f_name} {row.partner_l_name}
                  </td>
                  <td>{row.partner_mobile}</td>
                  <td>
                      {getTransactionType(row.partner_transection_type)}
                  </td>
                  {/* <td>₹{formatValue(row.partner_transection_wallet_previous_amount)}</td> */}
                  <td>
                    <span className={`fw-semibold ${getAmountColor(row.partner_transection_type)}`}>
                      {row.partner_transection_type === "2" ? "-" : ""}₹
                      {formatValue(row.partner_transection_amount)}
                    </span>
                  </td>
                  {/* <td>₹{formatValue(row.partner_transection_wallet_new_amount)}</td> */}
                  {/* <td>{row.partner_transection_note || "-"}</td> */}
                  {/* <td>{getTransactionStatus(row.partner_transection_status)}</td> */}
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

export default PartnerTransaction;
