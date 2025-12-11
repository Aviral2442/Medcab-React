import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardTitle,
  Table,
} from "react-bootstrap";
import axios from "axios";
import { useEffect, useState, type JSX } from "react";
import { formatDate } from "@/components/DateFormat";
import { FaUser } from "react-icons/fa";
import { FaUserGroup } from "react-icons/fa6";

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
    driver_created_by: string;
    driver_profile_img: string;
    driver_registration_step: number;
    driver_duty_status: string;
    driver_status: number;
    created_at: string;
  }

  const headers = [
    "ID",
    "By",
    "Profile",
    "Driver",
    // "Wallet",
    // "Duty Status",
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


    const getTransactionByType = (type: number | string): JSX.Element => {
      const typeNum = Number(type);
      switch (typeNum) {
        case 0:
          return <FaUser title="Driver" />;
        case 1:
          return <FaUserGroup title="By Partner" />;
        default:
          return <span>{type || "N/A"}</span>;
      }
    };

  // const handleDutyStatus = (status: string) => {
  //   return status === "ON" ? (
  //     <span className="badge badge-soft-success">ON</span>
  //   ) : (
  //     <span className="badge badge-soft-danger">OFF</span>
  //   );
  // };

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
                <td>{getTransactionByType(row.driver_created_by)}</td>
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
                    <img
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTdZViE66j-NjGxox1Yz2JCNB7cP_byawE3w&s"
                      alt=""
                      style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                      }}
                    />
                  )}
                </td>
                <td>
                  {row.driver_name} {row.driver_last_name} <br /> (
                  {row.driver_mobile})
                </td>
                {/* <td>₹{row.driver_wallet_amount || 0}</td> */}
                {/* <td>{handleDutyStatus(row.driver_duty_status)}</td> */}
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
