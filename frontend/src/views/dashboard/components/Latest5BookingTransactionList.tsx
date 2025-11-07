import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardTitle,
  Table,
} from "react-bootstrap";
import { modelUsageTable } from "@/views/dashboard/data";
import axios from "axios";
import { useEffect, useState } from "react";

const ModelUsageSummary = () => {


  const basePath = (import.meta as any).env?.VITE_PATH ?? "";


  interface BookingTransaction {
    consumer_transection_id: string;
    consumer_name: string;
    consumer_transection_new_amount: string;
    consumer_transection_note: string;
    consumer_transection_time: string;
  }

  const [data, setData] = useState<BookingTransaction[]>([]);

  const bookingTransactionList = async () => {
    try {
      const response = await axios.get(
    `${basePath}/dashboard/get_latest_5_booking_transaction_list`
      );
      const rows = response.data?.jsonData?.bookingTransList || [];
      setData(rows);
      // console.log("Booking Trans", rows);

      return rows;
    } catch (error) {
      console.error("Error fetching booking transactions:", error);
      throw error;
    }
  };

  useEffect(() => {
    bookingTransactionList();
  }, []);

  return (
    <Card>
      <CardHeader className="border-dashed">
        <CardTitle as="h4" className="mb-0">
          Bookings Transaction
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
              {modelUsageTable.headers.map((header) => (
                <th key={header}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx}>
                <td>{row.consumer_transection_id}</td>
                <td>{row.consumer_name}</td>
                <td>₹{row.consumer_transection_new_amount}</td>
                <td>{row.consumer_transection_note}</td>
                <td>
                  {(() => {
                    const ts = Number(row.consumer_transection_time);
                    if (!ts || Number.isNaN(ts)) return "-";
                    const date = new Date(ts < 1e12 ? ts * 1000 : ts); // handle seconds vs milliseconds
                    date.toLocaleString = () => {
                      const d = String(date.getDate()).padStart(2, "0");
                      const m = String(date.getMonth() + 1).padStart(2, "0");
                      const y = date.getFullYear();
                      return `${d}-${m}-${y}`;
                    };
                    return date.toLocaleString();
                  })()}
                </td>
              </tr>
            ))}
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

export default ModelUsageSummary;
