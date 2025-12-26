import React from "react";
import { Container, Spinner, Nav } from "react-bootstrap";
import { useParams } from "react-router-dom";
import AmbulanceBookingDetails from "@/components/Ambulance/booking/BookingDetails";
import BookingDetailsApiData from "@/components/Ambulance/booking/BookingDetailsApiData";
import RemarkList from "@/components/Ambulance/booking/RemarkList";
import StateWiseDPList from "@/components/Ambulance/booking/StateWiseDPList";
import CityWiseDPList from "@/components/Ambulance/booking/CityWiseDPList";
import Map from "@/components/Ambulance/booking/Map";
import NearestDriver from "@/components/Ambulance/booking/NearestDriver";

const BookingDetails = () => {
  const api = BookingDetailsApiData();
  const { id } = useParams();
  const [bookingData, setBookingData] = React.useState<any>(null);

  const [remarkData, setRemarkData] = React.useState<any>(null);
  const [remarkPagination, setRemarkPagination] = React.useState<any>(null);

  const [stateWiseDPData, setStateWiseDPData] = React.useState<any>(null);
  const [stateWiseDPPagination, setStateWiseDPPagination] =
    React.useState<any>(null);

  const [cityWiseDPData, setCityWiseDPData] = React.useState<any>(null);
  const [cityWiseDPPagination, setCityWiseDPPagination] =
    React.useState<any>(null);

  const [nearestDriverAndVehicleData, setNearestDriverAndVehicleData] = React.useState<any>(null);
  const [nearestDriverAndVehiclePagination, setNearestDriverAndVehiclePagination] = React.useState<any>(null);

  const [acceptHistoryData, setAcceptHistoryData] = React.useState<any>(null);
  const [acceptHistoryPagination, setAcceptHistoryPagination] = React.useState<any>(null);

  const [rejectHistoryData, setRejectHistoryData] = React.useState<any>(null);
  const [rejectHistoryPagination, setRejectHistoryPagination] = React.useState<any>(null);

  const [mapData, setMapData] = React.useState<any>(null);

  const [loading, setLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState(1);

  const tabs = [
    { eventKey: 1, title: "Booking Details" },
    { eventKey: 2, title: "Nearest Driver/Partner" },
    { eventKey: 3, title: "City Wise" },
    { eventKey: 4, title: "State Wise" },
    { eventKey: 5, title: "Accept History" },
    { eventKey: 6, title: "Reject History" },
    { eventKey: 7, title: "Remark" },
    { eventKey: 8, title: "Map" },
  ];

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      const result = await api.fetchBookingDetails(id!);
      if (result.success) {
        console.log("Fetched booking details:", result.data);
        setBookingData(result.data);
      }
    } catch (error) {
      console.error("Error fetching booking details:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRemarkDetails = async () => {
    try {
      setLoading(true);
      const result = await api.fetchRemarkDetails(id!);
      if (result.success) {
        console.log("Fetched remark details:", result.data);
        setRemarkData(result.data);
        setRemarkPagination(result.pagination);
      }
    } catch (error) {
      console.error("Error fetching remark details:", error);
    }
  };

  const fetchStateWiseDPDetails = async () => {
    try {
      setLoading(true);
      const result = await api.fetchStateWiseDPDetails(id!);
      if (result.success) {
        console.log("Fetched state-wise DP details:", result);
        setStateWiseDPData(result.data);
        setStateWiseDPPagination(result.pagination);
      }
    } catch (error) {
      console.error("Error fetching state-wise DP details:", error);
    }
  };

  const fetchCityWiseDPDetails = async () => {
    try {
      setLoading(true);
      const result = await api.fetchCityWiseDPDetails(id!);
      if (result.success) {
        console.log("Fetched city-wise DP details:", result);
        setCityWiseDPData(result.data);
        setCityWiseDPPagination(result.pagination);
      }
    } catch (error) {
      console.error("Error fetching city-wise DP details:", error);
    }
  };

  const fetchMapData = async () => {
    try {
      setLoading(true);
      const result = await api.fetchMapData(id!);
      if (result.success) {
        // console.log("Fetched map data:", result.data[0]);
        setMapData(result.data[0]);
      }
    } catch (error) {
      console.error("Error fetching map data:", error);
    }
  };

  const fetchAcceptHistory = async () => {
    try {
      setLoading(true);
      const result = await api.fetchBookingAcceptHistory(id!);
      if (result.success) {
        console.log("Fetched accept history data:", result.data);
        setAcceptHistoryData(result.data);
        setAcceptHistoryPagination(result.pagination);
      } 
    } catch (error) {
      console.error("Error fetching accept history data:", error);
    }
  };

  const fetchRejectHistory = async () => {
    try {
      setLoading(true);
      const result = await api.fetchBookingRejectHistory(id!);
      if (result.success) {
        console.log("Fetched reject history data:", result.data);
        setRejectHistoryData(result.data);
        setRejectHistoryPagination(result.pagination);
      }
     } catch (error) {
      console.error("Error fetching reject history data:", error);
    }
  };

  const fetchNearestDriverAndVehicleData = async () => {
    try {
      setLoading(true);
      const result = await api.fetchNearestDriverAndVehicleData(id!);
      if (result.success) {
        console.log("Fetched nearest driver and vehicle data:", result.data);
        setNearestDriverAndVehicleData(result.data);
        setNearestDriverAndVehiclePagination(result.pagination);
      }
    } catch (error) {
      console.error("Error fetching nearest driver and vehicle data:", error);
    }
  };

  React.useEffect(() => {
    if (activeTab === 1 && !bookingData) {
      fetchBookingDetails();
    }
    if (activeTab === 2) {
      fetchNearestDriverAndVehicleData();
    }
    if (activeTab === 3) {
      fetchCityWiseDPDetails();
    }
    if (activeTab === 4) {
      fetchStateWiseDPDetails();
    }
    if (activeTab === 5) {
      fetchAcceptHistory();
    }
    if (activeTab === 6) {
      fetchRejectHistory();
    }
    if (activeTab === 7) {
      fetchRemarkDetails();
    }
    if (activeTab === 8) {
      fetchMapData();
    }
  }, [activeTab, id]);

  const handleFieldUpdate = async (field: string, value: string) => {
    setBookingData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const renderTabContent = (tabKey: number) => {
    switch (tabKey) {
      case 1:
        return bookingData ? (
          <AmbulanceBookingDetails
            data={bookingData}
            onUpdate={handleFieldUpdate}
            editable={true}
          />
        ) : loading ? (
          <div className="text-center p-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3">Loading booking details...</p>
          </div>
        ) : (
          <div className="text-center p-5">
            <p className="text-muted">No booking data found</p>
          </div>
        );
      case 2:
        return nearestDriverAndVehicleData ? (
          <NearestDriver
            data={nearestDriverAndVehicleData}
            pagination={nearestDriverAndVehiclePagination}
          />
        ) : (
          <div className="text-center p-5">
            <p className="text-muted">No nearest driver and vehicle data found</p>
          </div>
        );
      case 3:
        return cityWiseDPData ? (
          <CityWiseDPList
            data={cityWiseDPData}
            pagination={cityWiseDPPagination}
          />
        ) : (
          <div className="text-center p-5">
            <p className="text-muted">No city-wise DP data found</p>
          </div>
        );
      case 4:
        return stateWiseDPData ? (
          <StateWiseDPList
            data={stateWiseDPData}
            pagination={stateWiseDPPagination}
          />
        ) : (
          <div className="text-center p-5">
            <p className="text-muted">No state-wise DP data found</p>
          </div>
        );
      case 7:
        return remarkData ? (
          <RemarkList data={remarkData} pagination={remarkPagination} />
        ) : (
          <div className="text-center p-5">
            <p className="text-muted">No remark data found</p>
          </div>
        );
      case 8:
        return mapData ? (
          <Map data={mapData} />
        ) : (
          <div className="text-center p-5">
            <p className="text-muted">No map data found</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Container fluid className="p-2">
      {loading && activeTab === 1 && !bookingData ? (
        <div className="text-center p-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading booking details...</p>
        </div>
      ) : (
        <div className="m-3 ms-0">
          <Nav variant="tabs" className="mb-3">
            {tabs.map((tab) => (
              <Nav.Item key={tab.eventKey}>
                <Nav.Link
                  active={activeTab === tab.eventKey}
                  onClick={() => setActiveTab(tab.eventKey)}
                  style={{ cursor: "pointer" }}
                >
                  {tab.title}
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>
          <div className="tab-content">{renderTabContent(activeTab)}</div>
        </div>
      )}
    </Container>
  );
};

export default BookingDetails;
