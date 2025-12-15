import { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Booking from "./components/Booking";
import Driver from "./components/Driver";
import Partner from "./components/Partner";
import Vehicle from "./components/Vehicle";
import DriverTransaction from "./components/DriverTransaction";
import PartnerTransaction from "./components/PartnerTransaction";
import TotalBookingCount from "@/views/dashboard/components/TotalBookingCount";
import TotalActiveOtherStatusVendor from "@/views/dashboard/components/TotalActiveOtherStatusVendorCounts";
import TotalCancelOngoingBooking from "@/views/dashboard/components/TotalCancelOngoingBookingCounts";
import GetConsumerCounts from "@/views/dashboard/components/GetConsumerCounts";
import RequestStatistics from "@/views/dashboard/components/RequestStatistics";
import CountsDashboard from "./components/CountsDashboard";

const Page = () => {
  const [activeTab, setActiveTab] = useState(1);

  const tabs = [
    { key: 1, title: "Graphical" },
    { key: 2, title: "Counts" },
  ];

  return (
    <Container fluid className="mt-3">
      <div className="mb-3">
        <ul className="nav nav-tabs">
          {tabs.map((tab) => (
            <li className="nav-item" key={tab.key}>
              <button
                className={`nav-link ${activeTab === tab.key ? "active" : ""}`}
                onClick={() => setActiveTab(tab.key)}
                type="button"
              >
                {tab.title}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {activeTab === 1 && (
        <>
          <Row className="row-cols-xxl-4 row-cols-md-2 row-cols-1">
            <Col>
              <TotalBookingCount />
            </Col>

            <Col>
              <TotalActiveOtherStatusVendor />
            </Col>

            <Col>
              <TotalCancelOngoingBooking />
            </Col>

            <Col>
              <GetConsumerCounts />
            </Col>
          </Row>

          <Row>
            <Col cols={12}>
              <RequestStatistics />
            </Col>
          </Row>

          <Row>
            <Col xxl={6}>
              <Partner />
            </Col>
            <Col xxl={6}>
              <Driver />
            </Col>
          </Row>
          <Row>
            <Col xxl={6}>
              <Booking />
            </Col>
            <Col xxl={6}>
              <Vehicle />
              <DriverTransaction />
              <PartnerTransaction />
            </Col>
          </Row>
        </>
      )}

      {activeTab === 2 && <CountsDashboard />}
    </Container>
  );
};

export default Page;