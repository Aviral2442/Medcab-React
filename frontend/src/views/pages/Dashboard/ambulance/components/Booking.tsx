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
// import { formatDate } from "@/components/DateFormat";

const BookingList = () => {
  const basePath = (import.meta as any).env?.VITE_PATH ?? "";

  interface Booking {
    booking_id: string;
    booking_con_name: string;
    booking_con_mobile: string;
    booking_type: string;
    booking_category: string;
    booking_schedule_time: string;
    booking_pickup_city: string;
    booking_drop: string;
    booking_total_amount: string;
    booking_status: string;
    created_at: string;
  }

  const headers = [
    "ID",
    "Consumer",
    "Type & Ctg",
    "Pickup",
    // "Drop",
    "Amount",
    "Status",
    "Schedule Time",
    // "Date",
  ];

  const [data, setData] = useState<Booking[]>([]);

  const bookingList = async () => {
    try {
      const response = await axios.get(
        `${basePath}/ambulance/dashboard_ambulance_bookings`
      );
      console.log("Bookings Data", response.data);
      const rows = response.data?.jsonData?.dashboard_ambulance_bookings || [];
      setData(rows);
      // console.log("Booking Trans", rows);

      return rows;
    } catch (error) {
      console.error("Error fetching booking transactions:", error);
      throw error;
    }
  };

  useEffect(() => {
    bookingList();
  }, []);

  const handleBookingType = (type: string) => {
    switch (type) {
      case "0":
        return "Regular";
      case "1":
        return "Rental";
      case "2":
        return "Bulk";
      case "3":
        return "Hospital";
      default:
        return " ";
    }
  };

  const handleBookingStatus = (status: string) => {
    switch (status) {
        //0 for enquiry, 1 for booking done, 2 for driver assigned,3 for invoice, 4 for complete, 5 for Cancel Booking
        case "0":
            return "Enquiry";
        case "1":
            return "Confirm Booking";
        case "2":
            return "Driver Assign";
        case "3":
            return "Invoice";
        case "4":
            return "Complete";
        case "5":
            return "Cancel";
        default:
            return " ";
    }
  }

  return (
    <Card>
      <CardHeader className="border-dashed">
        <CardTitle as="h4" className="mb-0">
          Bookings
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
            {data.map((row, idx) => (
              <tr key={idx}>
                <td>{row.booking_id}</td>
                <td>
                  {row.booking_con_name} <br /> ({row.booking_con_mobile})
                </td>
                <td>{handleBookingType(row.booking_type)} <br /> {row.booking_category} </td>
                {/* <td></td> */}
                <td>{row.booking_pickup_city}</td>
                {/* <td>{row.booking_drop}</td> */}
                <td>₹{row.booking_total_amount}</td>
                <td>{handleBookingStatus(row.booking_status)}</td>
                <td>{row.booking_schedule_time}</td>
                {/* <td>{formatDate(row.created_at)}</td> */}
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

export default BookingList;
