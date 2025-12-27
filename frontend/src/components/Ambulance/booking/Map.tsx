import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Container,
} from "react-bootstrap";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  Polyline,
} from "react-leaflet";
import markerShadowImg from "@/assets/images/leaflet/marker-shadow.png";
import L, { type LatLngExpression } from "leaflet";
import { decode } from "@googlemaps/polyline-codec";
import pickup from "@/assets/images/leaflet/pickup_marker.png";
import drop from "@/assets/images/leaflet/drop_marker.png";
import ambulance from "@/assets/images/leaflet/map_ambulance.png";

interface MapProps {
  data: {
    booking_id: string;
    booking_pick_lat: string;
    booking_pick_long: string;
    booking_drop_lat: string;
    booking_drop_long: string;
    booking_polyline: string;
    booking_acpt_driver_id: number;
    booking_acpt_vehicle_id: number;
    booking_pickup: string;
    booking_drop: string;
    driver_live_location_lat: string;
    driver_live_location_long: string;
    driver_name: string;
    driver_mobile: string;
    driver_profile_img: string;
    booking_status: string;
  };
}

const Map = ({ data }: MapProps) => {
  const pickupLocation: LatLngExpression = [
    parseFloat(data?.booking_pick_lat) || 0,
    parseFloat(data?.booking_pick_long) || 0,
  ];

  const dropLocation: LatLngExpression = [
    parseFloat(data?.booking_drop_lat) || 0,
    parseFloat(data?.booking_drop_long) || 0,
  ];

  const driverLocation: LatLngExpression = [
    parseFloat(data?.driver_live_location_lat) || 0,
    parseFloat(data?.driver_live_location_long) || 0,
  ];

  // Calculate center point between pickup and drop
  const centerLat =
    (parseFloat(data?.booking_pick_lat) + parseFloat(data?.booking_drop_lat)) /
    2;
  const centerLong =
    (parseFloat(data?.booking_pick_long) +
      parseFloat(data?.booking_drop_long)) /
    2;
  const center: LatLngExpression = [centerLat, centerLong];

  // Custom icons for pickup and drop
  const pickupIcon = L.icon({
    iconUrl: pickup,
    shadowUrl: markerShadowImg,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  const dropIcon = L.icon({
    iconUrl: drop,
    shadowUrl: markerShadowImg,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  const driverIcon = L.icon({
    iconUrl: ambulance,
    shadowUrl: markerShadowImg,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  // Decode polyline if available
  let polylineCoordinates: LatLngExpression[] = [];
  if (data?.booking_polyline) {
    try {
      const decoded = decode(data.booking_polyline, 5);
      polylineCoordinates = decoded.map(
        (coord) => [coord[0], coord[1]] as LatLngExpression
      );
    } catch (error) {
      console.error("Error decoding polyline:", error);
    }
  }

  console.log("Map data:", data);

  return (
    <div>
      <Container fluid>
        <Col xl={12}>
          <Card>
            <CardHeader className="d-block">
              <CardTitle as="h5" className="mb-1">
                Booking Route Map
              </CardTitle>
              <p className="text-muted mb-0">Booking ID: {data?.booking_id}</p>
            </CardHeader>
            <CardBody>
              <MapContainer
                center={center}
                zoom={6}
                scrollWheelZoom={true}
                style={{ height: "500px" }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Pickup Marker */}
                <Marker icon={pickupIcon} position={pickupLocation}>
                  <Popup>
                    <strong>Pickup Location</strong>
                    <br />
                    {data?.booking_pickup}
                    <br />
                  </Popup>
                </Marker>

                {/* Drop Marker */}
                <Marker icon={dropIcon} position={dropLocation}>
                  <Popup>
                    <strong>Drop Location</strong>
                    <br />
                    {data?.booking_drop}
                    <br />
                  </Popup>
                </Marker>

                {/* Driver Marker */}
                {data?.booking_status === "2" ||
                data?.booking_status === "3" ? (
                  <>
                    {data?.driver_live_location_lat &&
                      data?.driver_live_location_long && (
                        <Marker icon={driverIcon} position={driverLocation}>
                          <Popup>
                            <div style={{ minWidth: "200px" }}>
                              <strong>Driver Information</strong>
                              <br />
                              <div>
                                {data?.driver_name || ""}{" "}
                                {data?.driver_mobile || " "}
                              </div>
                            </div>
                          </Popup>
                        </Marker>
                      )}
                  </>
                ) : null}

                {/* Polyline Route */}
                {polylineCoordinates.length > 0 && (
                  <Polyline
                    positions={polylineCoordinates}
                    color="blue"
                    weight={4}
                    opacity={0.7}
                  />
                )}
              </MapContainer>
            </CardBody>
          </Card>
        </Col>
      </Container>
    </div>
  );
};

export default Map;
