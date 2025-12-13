import { Card, CardBody, CardHeader, CardTitle, Row, Col } from "react-bootstrap";

interface CountItem {
  label: string;
  count: number;
  color: string;
}

interface BookingCategory {
  title: string;
  total: number;
  items: CountItem[];
}

const CountsDashboard = () => {
  // Static booking data
  const bookingData: BookingCategory[] = [
    {
      title: "All Booking",
      total: 4529,
      items: [
        { label: "Enquiry", count: 4221, color: "primary" },
        { label: "New Booking", count: 9, color: "warning" },
        { label: "Accepted", count: 9, color: "success" },
        { label: "Complete Booking", count: 65, color: "info" },
        { label: "Cancelled Booking", count: 225, color: "danger" },
      ],
    },
    {
      title: "One-Way Booking",
      total: 3066,
      items: [
        { label: "Enquiry", count: 2879, color: "primary" },
        { label: "New Booking", count: 2, color: "warning" },
        { label: "Accepted", count: 5, color: "success" },
        { label: "Complete Booking", count: 49, color: "info" },
        { label: "Cancelled Booking", count: 131, color: "danger" },
      ],
    },
    {
      title: "Local Booking",
      total: 159,
      items: [
        { label: "Enquiry", count: 136, color: "primary" },
        { label: "New Booking", count: 0, color: "warning" },
        { label: "Accepted", count: 0, color: "success" },
        { label: "Complete Booking", count: 1, color: "info" },
        { label: "Cancelled Booking", count: 22, color: "danger" },
      ],
    },
    {
      title: "Rental Booking",
      total: 348,
      items: [
        { label: "Enquiry", count: 320, color: "primary" },
        { label: "New Booking", count: 2, color: "warning" },
        { label: "Accepted", count: 0, color: "success" },
        { label: "Complete Booking", count: 4, color: "info" },
        { label: "Cancelled Booking", count: 22, color: "danger" },
      ],
    },
    {
      title: "Round Trip Booking",
      total: 927,
      items: [
        { label: "Enquiry", count: 886, color: "primary" },
        { label: "New Booking", count: 4, color: "warning" },
        { label: "Accepted", count: 4, color: "success" },
        { label: "Complete Booking", count: 11, color: "info" },
        { label: "Cancelled Booking", count: 22, color: "danger" },
      ],
    },
    {
      title: "Stand By Booking",
      total: 29,
      items: [
        { label: "Enquiry", count: 0, color: "primary" },
        { label: "New Booking", count: 1, color: "warning" },
        { label: "Accepted", count: 0, color: "success" },
        { label: "Complete Booking", count: 0, color: "info" },
        { label: "Cancelled Booking", count: 28, color: "danger" },
      ],
    },
    {
      title: "B2B Booking",
      total: 63,
      items: [
        { label: "Enquiry", count: 59, color: "primary" },
        { label: "New Booking", count: 0, color: "warning" },
        { label: "Accepted", count: 0, color: "success" },
        { label: "Complete Booking", count: 0, color: "info" },
        { label: "Cancelled Booking", count: 4, color: "danger" },
      ],
    },
    {
      title: "Return Trip Booking",
      total: 52,
      items: [
        { label: "Enquiry", count: 0, color: "primary" },
        { label: "New Booking", count: 17, color: "warning" },
        { label: "Accepted", count: 2, color: "success" },
        { label: "Complete Booking", count: 0, color: "info" },
        { label: "Cancelled Booking", count: 33, color: "danger" },
      ],
    },
  ];

  // Static partner data
  const partnerData: BookingCategory[] = [
    {
      title: "Partner",
      total: 441,
      items: [
        { label: "Active", count: 92, color: "success" },
        { label: "Under Reg.", count: 347, color: "primary" },
        { label: "Blocked", count: 0, color: "danger" },
        { label: "No Working Area", count: 2, color: "secondary" },
      ],
    },
    {
      title: "Partner's Vehicle",
      total: 192,
      items: [
        { label: "New", count: 0, color: "info" },
        { label: "Active", count: 184, color: "success" },
        { label: "Reject", count: 2, color: "danger" },
        { label: "Unverified", count: 3, color: "warning" },
        { label: "Subscription", count: 3, color: "primary" },
      ],
    },
    {
      title: "Partner's Driver",
      total: 51,
      items: [
        { label: "Active", count: 40, color: "success" },
        { label: "Pending", count: 9, color: "warning" },
        { label: "Blocked", count: 0, color: "danger" },
        { label: "Unverified", count: 2, color: "secondary" },
        { label: "Under Reg.", count: 0, color: "primary" },
      ],
    },
    {
      title: "Self Drivers",
      total: 567,
      items: [
        { label: "Active", count: 102, color: "success" },
        { label: "Blocked", count: 0, color: "danger" },
        { label: "Unverified", count: 1, color: "warning" },
        { label: "Under Reg.", count: 464, color: "primary" },
      ],
    },
  ];

  const CountCard = ({ category }: { category: BookingCategory }) => (
    <Col xl={3} lg={4} md={6} className="mb-3">
      <Card className="border">
        <CardHeader className="border-bottom bg-light">
          <CardTitle as="h6" className="mb-0 fw-semibold">
            {category.title}{" "}
            <span className="badge bg-secondary ms-2">{category.total}</span>
          </CardTitle>
        </CardHeader>
        <CardBody className="p-0">
          <div className="list-group list-group-flush">
            {category.items.map((item, idx) => (
              <div
                key={idx}
                className="list-group-item d-flex justify-content-between align-items-center py-2"
              >
                <span className={`text-${item.color}`}>{item.label}</span>
                <span className="badge bg-light text-dark fw-semibold">
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </Col>
  );

  return (
    <>
      <Row>
        <Col xs={12}>
          <h5 className="mb-3">Booking Statistics</h5>
        </Col>
        {bookingData.map((category, idx) => (
          <CountCard key={idx} category={category} />
        ))}
      </Row>

      <Row className="mt-4">
        <Col xs={12}>
          <h5 className="mb-3">Partner & Driver Statistics</h5>
        </Col>
        {partnerData.map((category, idx) => (
          <CountCard key={idx} category={category} />
        ))}
      </Row>
    </>
  );
};

export default CountsDashboard;