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

const Partner = () => {
  const basePath = (import.meta as any).env?.VITE_PATH ?? "";
  const imgBasePath = (import.meta as any).env?.BASE_PATH ?? "";

  interface Partner {
    partner_id: number;
    partner_f_name: string;
    partner_l_name: string;
    partner_mobile: string;
    partner_wallet: number;
    partner_profile_img: string;
    partner_created_by: number;
    partner_city_id: number;
    partner_registration_step: number;
    created_at: string;
    partner_status: number;
    city_name: string;
  }

  const headers = [
    "ID",
    "Profile",
    "Name",
    // "Mobile",
    // "Wallet",
    "City",
    // "Reg Step",
    "Status",
    "Date",
  ];

  const [data, setData] = useState<Partner[]>([]);

  const fetchPartners = async () => {
    try {
      const response = await axios.get(
        `${basePath}/ambulance/dashboard_ambulance_partners`
      );
    //   console.log("Partners Data", response.data);
      const rows = response.data?.jsonData?.dashboard_ambulance_partners || [];
      setData(rows);
      return rows;
    } catch (error) {
      console.error("Error fetching partners:", error);
      throw error;
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const getPartnerStatus = (status: number): JSX.Element => {
    switch (status) {
      case 0:
        return <span className="badge bg-info">New</span>;
      case 1:
        return <span className="badge bg-success">Active</span>;
      case 2:
        return <span className="badge bg-warning">Inactive</span>;
      default:
        return <span className="badge bg-secondary">Unknown</span>;
    }
  };


  return (
    <Card>
      <CardHeader className="border-dashed">
        <CardTitle as="h4" className="mb-0">
          Partners
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
                  <td>{row.partner_id}</td>
                  <td>
                    {row.partner_profile_img ? (
                      <img
                        src={`${imgBasePath}/${row.partner_profile_img}` || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTdZViE66j-NjGxox1Yz2JCNB7cP_byawE3w&s"}
                        alt={row.partner_f_name}
                        style={{
                          width: "24px",
                          height: "24px",
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
                    {row.partner_f_name} {row.partner_l_name} <br />
                    ({row.partner_mobile})
                  </td>
                  {/* <td>{row.partner_mobile}</td> */}
                  {/* <td className="text-success fw-semibold">
                    ₹{formatValue(row.partner_wallet)}
                  </td> */}
                  <td>{row.city_name || "N/A"}</td>
                  {/* <td>{row.partner_registration_step}</td> */}
                  <td>{getPartnerStatus(row.partner_status)}</td>
                  <td>{formatDate(row.created_at)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={headers.length} className="text-center">
                  No partners found
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

export default Partner;