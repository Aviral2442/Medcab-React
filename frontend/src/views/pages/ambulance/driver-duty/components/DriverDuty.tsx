import React from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Container,
  Row,
} from "react-bootstrap";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L, { type LatLngExpression } from "leaflet";

const DriverDuty = () => {
  const { id } = useParams();
  const baseURL = (import.meta as any).env?.VITE_PATH ?? "";
  const [driverDutyData, setDriverDutyData] = React.useState({
    dood_lat: 0,
    dood_long: 0,
    driver_name: "",
    driver_mobile: "",
    dood_time_unix: "",
  });

  const fetchDriverDutyData = async () => {
    try {
      const res = await axios.post(
        `${baseURL}/driver/driver_on_off_map_location/${id}`
      );
      console.log(
        "Driver Duty Data:",
        res.data?.jsonData?.driverOnOffMapLocation
      );
      const data = res.data?.jsonData?.driverOnOffMapLocation || [];
      console.log("driver lat ", data.dood_lat);
      console.log("driver long ", data.dood_long);
      setDriverDutyData(data);
    } catch (error) {
      console.error("Error fetching driver duty data:", error);
    }
  };

  React.useEffect(() => {
    fetchDriverDutyData();
  }, [id]);

  function LastUpdated(unixTime: string): string {
    const past = parseInt(unixTime) * 1000;
    const pastDate = new Date(past);
    const now = new Date();

    // Calculate years, months, days
    let years = now.getFullYear() - pastDate.getFullYear();
    let months = now.getMonth() - pastDate.getMonth();
    let days = now.getDate() - pastDate.getDate();

    // Fix negative days
    if (days < 0) {
      months--;
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += prevMonth.getDate();
    }

    // Fix negative months
    if (months < 0) {
      years--;
      months += 12;
    }

    // Build output dynamically
    const parts: string[] = [];

    if (years > 0) parts.push(`${years}y`);
    if (months > 0) parts.push(`${months}m`);
    if (days > 0) parts.push(`${days}d`);

    return parts.join(" ") + " ago";
  }

  const PopupWithMarker = () => {
    const center: LatLngExpression = [
      driverDutyData.dood_lat,
      driverDutyData.dood_long,
    ];

    const customIcon = L.icon({
      iconUrl:
        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
      iconSize: [15, 25],
    });

    return (
      <Card>
        <CardHeader className="d-block">
          <CardTitle as="h5" className="mb-1">
            Driver Duty Map Location
          </CardTitle>
          <p className="text-muted mb-0">
            A Leaflet map with a marker that shows a popup on click.
          </p>
        </CardHeader>
        <CardBody>
          <MapContainer
            center={center}
            zoom={12}
            scrollWheelZoom={false}
            style={{ height: "460px" }}
            className=""
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker icon={customIcon} position={center}>
              <Popup>
                {driverDutyData.driver_name} ({driverDutyData.driver_mobile})
                <br />
                <strong>Last Updated:</strong> {LastUpdated(driverDutyData.dood_time_unix)}
              </Popup>
            </Marker>
          </MapContainer>
        </CardBody>
      </Card>
    );
  };

  return (
    <div>
      <Container fluid className="p-0 mt-2">
        <Row>
          <Col lg="12">
            <PopupWithMarker />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default DriverDuty;
