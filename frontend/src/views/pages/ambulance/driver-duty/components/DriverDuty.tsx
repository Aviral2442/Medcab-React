import React, { useMemo } from "react";
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
  Spinner,
} from "react-bootstrap";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L, { type LatLngExpression } from "leaflet";

const DriverDuty = () => {
  const { id } = useParams();
  const baseURL = (import.meta as any).env?.VITE_PATH ?? "";
  const [driverDutyData, setDriverDutyData] = React.useState({
    driver_live_location_lat: 0,
    driver_live_location_long: 0,
    driver_name: "",
    driver_mobile: "",
    driver_live_location_updated_time: "",
    driver_duty_status: "OFF",
  });
  const [noLocationMessage, setNoLocationMessage] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const fetchDriverDutyData = async () => {
    try {
      setLoading(true);
      setNoLocationMessage(null);

      const res = await axios.post(`${baseURL}/driver/driver_live_location_on_map/${id}`);

      const data = res.data?.jsonData?.driverOnOffMapLocation ?? null;
      const msg = res.data?.message ?? null;

      if (!data) {
        // Live location not available; show message (if backend included driver info we can set name)
        const fallbackDriver = res.data?.jsonData?.driver ?? {};
        setDriverDutyData({
          driver_live_location_lat: 0,
          driver_live_location_long: 0,
          driver_name: fallbackDriver.driver_name || "",
          driver_mobile: fallbackDriver.driver_mobile || "",
          driver_live_location_updated_time: "",
          driver_duty_status: fallbackDriver.driver_duty_status || "OFF",
        });
        setNoLocationMessage(msg || "Live location is not available for this driver.");
      } else {
        setDriverDutyData(data);
        setNoLocationMessage(null);
      }
    } catch (error) {
      console.error("Error fetching driver duty data:", error);
      // Show a generic error
      setNoLocationMessage("Failed to fetch driver live location. Please try again.");
    } finally {
      setLoading(false);
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

    // Format time (12-hour format)
    let hours = pastDate.getHours();
    let minutes: number | string = pastDate.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;
    if (hours === 0) hours = 12;

    minutes = minutes < 10 ? "0" + minutes : minutes;

    const formattedTime = `${hours}:${minutes} ${ampm}`;

    // Build output dynamically
    const parts: string[] = [];

    if (years > 0) parts.push(`${years}y`);
    if (months > 0) parts.push(`${months}m`);
    if (days > 0) parts.push(`${days}d`);

    // Always show time
    parts.push(formattedTime);

    return parts.join(" ") + " ago";
  }

  const PopupWithMarker = () => {
    const center: LatLngExpression = [
      driverDutyData.driver_live_location_lat || 0,
      driverDutyData.driver_live_location_long || 0,
    ];

    // use memoized icons so we match the multi-driver map colors
    const icons = useMemo(
      () => ({
        ON: L.icon({
          iconUrl:
            "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
          iconSize: [15, 25],
        }),
        OFF: L.icon({
          iconUrl:
            "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
          iconSize: [15, 25],
        }),
      }),
      []
    );

    const getCustomIcon = (status: string | undefined) => {
      const key = (status || "OFF").toUpperCase();
      return (icons as any)[key] || icons.ON;
    };

    return (
      <Card>
        <CardHeader className="d-block">
          <CardTitle as="h5" className="mb-1">Driver Duty Map Location</CardTitle>
          <p className="text-muted mb-0">A Leaflet map with a marker that shows a popup on click.</p>
        </CardHeader>
        <CardBody>
          {loading && (
            <div className="text-center py-5">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
              <p className="text-muted mt-2">Loading driver data...</p>
            </div>
          )}

          {!loading && noLocationMessage && (
            <div className="text-center py-5">
              <p className="text-muted">{noLocationMessage}</p>
            </div>
          )}

          {!loading && !noLocationMessage && (
            <MapContainer center={center} zoom={12} scrollWheelZoom={false} style={{ height: "460px" }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker
                icon={getCustomIcon(driverDutyData.driver_duty_status)}
                position={center}
              >
                <Popup>
                  {driverDutyData.driver_name} ({driverDutyData.driver_mobile})
                  <br />
                  {LastUpdated(driverDutyData.driver_live_location_updated_time)}
                </Popup>
              </Marker>
            </MapContainer>
          )}
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
