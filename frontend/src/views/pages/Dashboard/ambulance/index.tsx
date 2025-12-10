import { Col, Container, Row } from "react-bootstrap";
import Booking from "./components/Booking";
import Driver from "./components/Driver";
import Partner from "./components/Partner";
import Vehicle from "./components/Vehicle";
import DriverTransaction from "./components/DriverTransaction";
import PartnerTransaction from "./components/PartnerTransaction";

const Page = () => {
  return (
    <Container fluid className="mt-3">
      {/* <PageTitle
                title="The Ultimate Admin & Dashboard Theme"
                subtitle="A premium collection of elegant, accessible components and a powerful codebase. Built for modern frameworks. Developer Friendly. Production Ready."
                badge={{
                    title: 'Medium and Large Business',
                    icon: LuSparkles,
                }}
            /> */}

      <Row>
        <Col xxl={6}>
          <Booking />
        </Col>
        <Col xxl={6}>
          <Driver />
        </Col>
      </Row>
      <Row>
        <Col xxl={6}>
          <Partner />
        </Col>
        <Col xxl={6}>
          <Vehicle />
        </Col>
      </Row>
      <Row>
        <Col cols={6}>
          <DriverTransaction />
        </Col>
        <Col cols={6}>
          <PartnerTransaction />
        </Col>
      </Row>
    </Container>
  );
};

export default Page;
