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

const DriverList = () => {
  const basePath = (import.meta as any).env?.VITE_PATH ?? "";
  const imgBasePath = (import.meta as any).env?.BASE_PATH ?? "";

  interface Driver {
    driver_id: number;
    driver_name: string;
    driver_last_name: string;
    driver_mobile: string;
    driver_wallet_amount: number;
    driver_city_id: number;
    driver_created_by: number;
    driver_profile_img: string;
    driver_registration_step: number;
    driver_duty_status: string;
    driver_status: number;
    created_at: string;
  }

  const headers = [
    "ID",
    "Profile",
    "Driver",
    "Wallet",
    "Created By",
    "Duty Status",
    "Status",
    "Date",
  ];

  const [data, setData] = useState<Driver[]>([]);

  const driverList = async () => {
    try {
      const response = await axios.get(
        `${basePath}/ambulance/dashboard_ambulance_drivers`
      );
      //   console.log("Drivers Data", response.data);
      const rows = response.data?.jsonData?.dashboard_ambulance_drivers || [];
      setData(rows);
      return rows;
    } catch (error) {
      console.error("Error fetching drivers:", error);
      throw error;
    }
  };

  useEffect(() => {
    driverList();
  }, []);

  const handleCreatedBy = (type: number) => {
    switch (type) {
      case 0:
        return "Self";
      case 1:
        return "Partner";
      default:
        return "-";
    }
  };

  const handleDutyStatus = (status: string) => {
    return status === "ON" ? (
      <span className="badge badge-soft-success">ON</span>
    ) : (
      <span className="badge badge-soft-danger">OFF</span>
    );
  };

  const handleDriverStatus = (status: number) => {
    const statusMap: Record<number, { label: string; class: string }> = {
      0: { label: "New", class: "info" },
      1: { label: "Active", class: "success" },
      2: { label: "Inactive", class: "warning" },
      3: { label: "Deleted", class: "danger" },
      4: { label: "Verification", class: "primary" },
    };
    const statusInfo = statusMap[status] || {
      label: "Unknown",
      class: "secondary",
    };
    return (
      <span className={`badge badge-soft-${statusInfo.class}`}>
        {statusInfo.label}
      </span>
    );
  };

  return (
    <Card>
      <CardHeader className="border-dashed">
        <CardTitle as="h4" className="mb-0">
          Drivers
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
                <td>{row.driver_id}</td>
                <td>
                  {row.driver_profile_img ? (
                    <img
                      src={`${imgBasePath}/${row.driver_profile_img}`}
                      alt={row.driver_name}
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        backgroundColor: "#e9ecef",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      N/A
                    </div>
                  )}
                </td>
                <td>
                  {row.driver_name} {row.driver_last_name} <br /> (
                  {row.driver_mobile})
                </td>
                <td>₹{row.driver_wallet_amount || 0}</td>
                <td>{handleCreatedBy(row.driver_created_by)}</td>
                <td>{handleDutyStatus(row.driver_duty_status)}</td>
                <td>{handleDriverStatus(row.driver_status)}</td>
                <td>{formatDate(row.created_at)}</td>
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

export default DriverList;
