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

const Vehicle = () => {
  const basePath = (import.meta as any).env?.VITE_PATH ?? "";

  interface Vehicle {
    vehicle_id: number;
    vehicle_added_type: string;
    vehicle_added_by: number;
    v_vehicle_name: string;
    v_vehicle_name_id: number;
    vehicle_category_type: number;
    vehicle_category_type_service_id: string;
    vehicle_exp_date: string;
    vehicle_verify_date: string;
    verify_type: string;
    created_at: string;
    ambulance_category_vehicle_name: string;
    driver_name: string;
    driver_mobile: string;
    partner_f_name: string;
    partner_l_name: string;
    partner_mobile: string;
  }

  const headers = [
    "ID",
    "By",
    "Vehicle Name",
    "Added",
    // "Category",
    // "Service ID",
    // "Verify Type",
    // "Verify Date",
    // "Exp Date",
    "Date",
  ];

  const [data, setData] = useState<Vehicle[]>([]);

  const fetchVehicles = async () => {
    try {
      const response = await axios.get(
        `${basePath}/ambulance/dashboard_ambulance_vehicles`
      );
        // console.log("Vehicles Data", response.data);
      const rows = response.data?.jsonData?.dashboard_ambulance_vehicles || [];
      setData(rows);
      return rows;
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      throw error;
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  // const getAddedType = (type: string): string => {
  //   switch (type) {
  //     case "0":
  //       return "Self";
  //     case "1":
  //       return "Partner";
  //     default:
  //       return "N/A";
  //   }
  // };

  const getTransactionByType = (type: string): JSX.Element => {
    switch (type) {
      case "0":
        return <FaUser title="Driver" />;
      case "1":
        return <FaUserGroup title="By Partner" />;
      default:
        return <span>{type || "N/A"}</span>;
    }
  };

  //   const getCategoryType = (type: number): string => {
  //     switch (type) {
  //       case 1:
  //         return "Type 1";
  //       case 2:
  //         return "Type 2";
  //       default:
  //         return "N/A";
  //     }
  //   };

  //   const getVerifyType = (type: string): JSX.Element => {
  //     if (!type) return <span className="badge bg-secondary">Not Set</span>;

  //     switch (type.toLowerCase()) {
  //       case "manual":
  //         return <span className="badge bg-primary">Manual</span>;
  //       case "automated":
  //         return <span className="badge bg-success">Automated</span>;
  //       default:
  //         return <span className="badge bg-secondary">{type}</span>;
  //     }
  //   };

  return (
    <Card>
      <CardHeader className="border-dashed">
        <CardTitle as="h4" className="mb-0">
          Vehicles
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
                  <td>{row.vehicle_id}</td>
                    <td>{getTransactionByType(row.vehicle_added_type)}</td>
                  <td>
                    {row.v_vehicle_name}
                    {/* <br />
                    <small className="text-muted">
                      ID: {row.v_vehicle_name_id}
                    </small> */}
                  </td>
                  <td>{
                    //also handle null values
                    getTransactionByType(row.vehicle_added_type) === <FaUser title="Driver" />
                      ? `${row.driver_name} (${row.driver_mobile})` || " "
                      : `${row.partner_f_name} ${row.partner_l_name} (${row.partner_mobile})` || " "
                    }</td>
                  {/* <td>{row.ambulance_category_vehicle_name}</td> */}
                  {/* <td>
                    <small className="text-muted">
                      {row.vehicle_category_type_service_id || "N/A"}
                    </small>
                  </td> */}
                  {/* <td>{getVerifyType(row.verify_type)}</td> */}
                  {/* <td>
                    {row.vehicle_verify_date
                      ? formatDate(row.vehicle_verify_date)
                      : ""}
                  </td>
                  <td>
                    {row.vehicle_exp_date ? formatDate(row.vehicle_exp_date) : ""}
                  </td> */}
                  <td>{formatDate(row.created_at)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={headers.length} className="text-center">
                  No vehicles found
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

export default Vehicle;
