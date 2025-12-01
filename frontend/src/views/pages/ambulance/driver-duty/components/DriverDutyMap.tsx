import axios from "axios";
import React, { useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  LayersControl,
} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L, { type LatLngExpression } from "leaflet";
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Row,
  Col,
  Container,
  Spinner,
  Alert,
} from "react-bootstrap";
import { InputPicker, Input } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import "leaflet/dist/leaflet.css";
import ExportDataWithButtons from "@/views/tables/data-tables/ambulance/driver-location/components/DriverDutyMapList";

// You need to install: npm install react-leaflet-cluster
// And add this CSS for clusters
const clusterStyles = `
  .marker-cluster-small {
    background-color: rgba(181, 226, 140, 0.6);
  }
  .marker-cluster-small div {
    background-color: rgba(110, 204, 57, 0.6);
  }
  .marker-cluster-medium {
    background-color: rgba(241, 211, 87, 0.6);
  }
  .marker-cluster-medium div {
    background-color: rgba(240, 194, 12, 0.6);
  }
  .marker-cluster-large {
    background-color: rgba(253, 156, 115, 0.6);
  }
  .marker-cluster-large div {
    background-color: rgba(241, 128, 23, 0.6);
  }
`;

interface DriverMapItem {
  driver_live_location_d_id: number;
  driver_live_location_lat: number;
  driver_live_location_long: number;
  driver_name: string;
  driver_mobile: string;
  driver_live_location_updated_time: string;
  driver_duty_status: string;
  city_name?: string;
}

const DriverDutyLocation = () => {
  // 1 = List, 2 = Map (default)
  const [activeTab, setActiveTab] = React.useState<number>(2);
  const [driverMapData, setDriverMapData] = React.useState<DriverMapItem[]>([]);
  const [filteredData, setFilteredData] = React.useState<DriverMapItem[]>([]);
  // Use null to mean "no filter / all" (rather than forcing ON)
  const [statusFilter, setStatusFilter] = React.useState<string | null>("ON");
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [useClustering, setUseClustering] = React.useState(true);
  const baseURL = (import.meta as any).env?.VITE_PATH ?? "";

  const statusFilterOptions = [
    { label: "On", value: "ON" },
    { label: "Off", value: "OFF" },
  ];

  const fetchDriverMapData = async () => {
    try {
      setLoading(true);
      setError(null);

      const params: Record<string, any> = {
        status: statusFilter,
      };

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout for large data

      const res = await axios.get(`${baseURL}/driver/driver_live_location`, {
        params,
        signal: controller.signal,
        headers: {
          "Accept-Encoding": "gzip, deflate, br",
        },
      });

      clearTimeout(timeoutId);

      const data = res.data?.jsonData?.driver_Live_Location_Data || [];
      console.log(data);

      console.log(`✅ Loaded ${data.length} drivers`);

      setDriverMapData(data);

      // Auto-enable clustering for large datasets
      if (data.length > 1000) {
        setUseClustering(true);
      }
    } catch (error: any) {
      if (error.name === "AbortError" || error.code === "ECONNABORTED") {
        setError("Request timeout. Server took too long to respond.");
      } else {
        setError("Failed to load driver data. Please try again.");
      }
      console.error("Error fetching driver map data:", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchDriverMapData();
  }, [statusFilter]);

  // Debounced search
  const debouncedSearch = React.useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  React.useEffect(() => {
    if (debouncedSearch.current) {
      clearTimeout(debouncedSearch.current);
    }

    debouncedSearch.current = setTimeout(() => {
      if (!searchQuery.trim()) {
        setFilteredData(driverMapData);
      } else {
        const searchLower = searchQuery.toLowerCase();
        const filtered = driverMapData.filter((driver) => {
          return (
            driver.city_name?.toLowerCase().includes(searchLower) ||
            driver.driver_name?.toLowerCase().includes(searchLower) ||
            driver.driver_mobile?.toLowerCase().includes(searchLower)
          );
        });
        setFilteredData(filtered);
      }
    }, 300);

    return () => {
      if (debouncedSearch.current) {
        clearTimeout(debouncedSearch.current);
      }
    };
  }, [searchQuery, driverMapData]);

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

  // Handler: accept null to clear filter; pass the value as-is
  const handleStatusFilterChange = (value: string | null) => {
    setStatusFilter(value);
  };

  // Memoized icons
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

  const getCustomIcon = (status: string) => {
    return icons[status as keyof typeof icons] || icons.ON;
  };

  // Custom cluster icon
  const createClusterCustomIcon = (cluster: any) => {
    const count = cluster.getChildCount();
    let size = "small";

    if (count > 100) size = "large";
    else if (count > 10) size = "medium";

    return L.divIcon({
      html: `<div><span>${count}</span></div>`,
      className: `marker-cluster marker-cluster-${size}`,
      iconSize: L.point(40, 40, true),
    });
  };

  const center: LatLngExpression = [26.8467, 80.9462];

  return (
    <div>
      <style>{clusterStyles}</style>
      <Container fluid className="p-0 mt-2">
        <Row>
          <Col>
            <div className="">
              <ul className="nav nav-tabs">
                <li className="nav-item">
                  <button
                    type="button"
                    className={`nav-link ${
                      activeTab === 1 ? "active" : ""
                    }`}
                    onClick={() => setActiveTab(1)}
                  >
                    List
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    type="button"
                    className={`nav-link ${
                      activeTab === 2 ? "active" : ""
                    }`}
                    onClick={() => setActiveTab(2)}
                  >
                    Map
                  </button>
                </li>
              </ul>
            </div>
          </Col>
        </Row>

        {/* List tab: use the existing driver duty table */}
        {activeTab === 1 && (
          <Row>
            <Col lg="12">
              <ExportDataWithButtons
                tabKey={1}
                refreshFlag={0}
                statusFilter={statusFilter}
                onStatusFilterChange={(v) => {
                  if (v !== statusFilter) setStatusFilter(v);
                }}
                filterParams={statusFilter ? { status: statusFilter } : {}}
                onDataChanged={() => {}}
              />
            </Col>
          </Row>
        )}

        {/* Map tab */}
        {activeTab === 2 && (
          <Row>
            <Col lg="12">
              <Card className="mt-2">
                <CardHeader className="d-flex justify-content-between align-items-center">
                  <div>
                    <CardTitle as="h5" className="mb-1">
                      Driver Duty Map
                    </CardTitle>
                    <p className="text-muted mb-0">
                      View driver locations. Green = ON, Red = OFF
                    </p>
                  </div>
                  <div className="d-flex gap-2 align-items-center flex-wrap z-1">
                    <Input
                      placeholder="Search driver/city/mobile..."
                      value={searchQuery}
                      onChange={setSearchQuery}
                      style={{ width: 220 }}
                      size="sm"
                    />

                    <InputPicker
                      data={statusFilterOptions}
                      value={statusFilter}
                      onChange={handleStatusFilterChange}
                      placeholder="Status"
                      style={{ width: 120 }}
                      cleanable={false}
                      size="sm"
                      searchable={false}
                      menuStyle={{ zIndex: 9999 }}
                    />
                    <label
                      className="border py-1 px-3 rounded d-flex align-items-center gap-1"
                      style={{ cursor: "pointer", fontSize: "0.875rem" }}
                    >
                      <input
                        type="checkbox"
                        checked={useClustering}
                        onChange={(e) => setUseClustering(e.target.checked)}
                      />
                      Cluster
                    </label>
                    <span className="border px-3 py-1 rounded">
                      {filteredData.length} drivers
                    </span>
                    {loading && <Spinner animation="border" size="sm" />}
                  </div>
                </CardHeader>
                <CardBody>
                  {error && (
                    <Alert
                      variant="danger"
                      dismissible
                      onClose={() => setError(null)}
                    >
                      {error}
                    </Alert>
                  )}

                  {loading && (
                    <div className="text-center py-5">
                      <Spinner animation="border" role="status">
                        <span className="visually-hidden">
                          Loading drivers...
                        </span>
                      </Spinner>
                      <p className="text-muted mt-2">
                        Loading {statusFilter === "ON" ? "active" : "inactive"}{" "}
                        driver data...
                      </p>
                    </div>
                  )}

                  {!loading && filteredData.length > 0 && (
                    <MapContainer
                      center={center}
                      zoom={5}
                      scrollWheelZoom={false}
                      style={{ height: "460px" }}
                    >
                      <LayersControl position="topright">
                        <LayersControl.BaseLayer checked name="Street">
                          <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                          />
                        </LayersControl.BaseLayer>

                        <LayersControl.BaseLayer name="CartoDB Dark">
                          <TileLayer
                            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                          />
                        </LayersControl.BaseLayer>
                      </LayersControl>

                      {useClustering ? (
                        <MarkerClusterGroup
                          chunkedLoading
                          iconCreateFunction={createClusterCustomIcon}
                          maxClusterRadius={50}
                          spiderfyOnMaxZoom={true}
                          showCoverageOnHover={false}
                        >
                          {filteredData.map((driver) => (
                            <Marker
                              key={driver.driver_live_location_d_id}
                              position={[
                                driver.driver_live_location_lat,
                                driver.driver_live_location_long,
                              ]}
                              icon={getCustomIcon(driver.driver_duty_status)}
                            >
                              <Popup>
                                {driver.driver_live_location_d_id}{" "}
                                {driver.driver_name} ({driver.driver_mobile})
                                {driver.city_name && (
                                  <>
                                    <br />
                                    <strong>City:</strong> {driver.city_name}
                                  </>
                                )}
                                <br />
                                {LastUpdated(
                                  driver.driver_live_location_updated_time
                                )}{" "}
                                <br />
                              </Popup>
                            </Marker>
                          ))}
                        </MarkerClusterGroup>
                      ) : (
                        filteredData.map((driver) => (
                          <Marker
                            key={driver.driver_live_location_d_id}
                            position={[
                              driver.driver_live_location_lat,
                              driver.driver_live_location_long,
                            ]}
                            icon={getCustomIcon(driver.driver_duty_status)}
                          >
                            <Popup>
                              {driver.driver_live_location_d_id}{" "}
                              {driver.driver_name} ({driver.driver_mobile})
                              {driver.city_name && (
                                <>
                                  <br />
                                  <strong>City:</strong> {driver.city_name}
                                </>
                              )}
                              <br />
                              {LastUpdated(
                                driver.driver_live_location_updated_time
                              )}{" "}
                              <br />
                            </Popup>
                          </Marker>
                        ))
                      )}
                    </MapContainer>
                  )}

                  {!loading && filteredData.length === 0 && !error && (
                    <div className="text-center py-5">
                      <p className="text-muted">
                        No drivers found matching your criteria.
                      </p>
                    </div>
                  )}

                  {/* Info about clustering */}
                  {filteredData.length > 500 && !useClustering && (
                    <Alert variant="info" className="mt-2 mb-0">
                      <small>
                        💡 Tip: Enable clustering for better performance with{" "}
                        {filteredData.length} markers.
                      </small>
                    </Alert>
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
};

export default DriverDutyLocation;
