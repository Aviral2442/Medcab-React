import { Card, CardBody, CardHeader, CardTitle, Row, Col } from "react-bootstrap";

interface CountItem {
  label: string;
  count: number;
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
        { label: "Enquiry", count: 4221 },
        { label: "New Booking", count: 9 },
        { label: "Accepted", count: 9 },
        { label: "Complete Booking", count: 65 },
        { label: "Cancelled Booking", count: 225 },
      ],
    },
    {
      title: "One-Way Booking",
      total: 3066,
      items: [
        { label: "Enquiry", count: 2879 },
        { label: "New Booking", count: 2 },
        { label: "Accepted", count: 5 },
        { label: "Complete Booking", count: 49 },
        { label: "Cancelled Booking", count: 131 },
      ],
    },
    {
      title: "Local Booking",
      total: 159,
      items: [
        { label: "Enquiry", count: 136 },
        { label: "New Booking", count: 0 },
        { label: "Accepted", count: 0 },
        { label: "Complete Booking", count: 1 },
        { label: "Cancelled Booking", count: 22 },
      ],
    },
    {
      title: "Rental Booking",
      total: 348,
      items: [
        { label: "Enquiry", count: 320 },
        { label: "New Booking", count: 2 },
        { label: "Accepted", count: 0 },
        { label: "Complete Booking", count: 4 },
        { label: "Cancelled Booking", count: 22 },
      ],
    },
    {
      title: "Round Trip Booking",
      total: 927,
      items: [
        { label: "Enquiry", count: 886 },
        { label: "New Booking", count: 4 },
        { label: "Accepted", count: 4 },
        { label: "Complete Booking", count: 11 },
        { label: "Cancelled Booking", count: 22 },
      ],
    },
    {
      title: "Stand By Booking",
      total: 29,
      items: [
        { label: "Enquiry", count: 0 },
        { label: "New Booking", count: 1 },
        { label: "Accepted", count: 0 },
        { label: "Complete Booking", count: 0 },
        { label: "Cancelled Booking", count: 28 },
      ],
    },
    {
      title: "B2B Booking",
      total: 63,
      items: [
        { label: "Enquiry", count: 59 },
        { label: "New Booking", count: 0 },
        { label: "Accepted", count: 0 },
        { label: "Complete Booking", count: 0 },
        { label: "Cancelled Booking", count: 4 },
      ],
    },
    {
      title: "Return Trip Booking",
      total: 52,
      items: [
        { label: "Enquiry", count: 0 },
        { label: "New Booking", count: 17 },
        { label: "Accepted", count: 2 },
        { label: "Complete Booking", count: 0 },
        { label: "Cancelled Booking", count: 33 },
      ],
    },
  ];

  // Static partner data
  const partnerData: BookingCategory[] = [
    {
      title: "Partner",
      total: 441,
      items: [
        { label: "Active", count: 92 },
        { label: "Under Reg.", count: 347 },
        { label: "Blocked", count: 0 },
        { label: "No Working Area", count: 2 },
      ],
    },
    {
      title: "Partner's Vehicle",
      total: 192,
      items: [
        { label: "New", count: 0 },
        { label: "Active", count: 184 },
        { label: "Reject", count: 2 },
        { label: "Unverified", count: 3 },
        { label: "Subscription", count: 3 },
      ],
    },
    {
      title: "Partner's Driver",
      total: 51,
      items: [
        { label: "Active", count: 40 },
        { label: "Pending", count: 9 },
        { label: "Blocked", count: 0 },
        { label: "Unverified", count: 2 },
        { label: "Under Reg.", count: 0 },
      ],
    },
    {
      title: "Self Drivers",
      total: 567,
      items: [
        { label: "Active", count: 102 },
        { label: "Blocked", count: 0 },
        { label: "Unverified", count: 1 },
        { label: "Under Reg.", count: 464 },
      ],
    },
  ];

  const CountCard = ({ category }: { category: BookingCategory }) => (
    <Col xl={3} lg={4} md={6} className="">
      <Card className="card overflow-hidden" style={{ maxHeight: '250px' }}>
        <CardHeader className="">
          <div className="d-flex justify-content-between align-items-center w-100">
            <CardTitle as="h6" className="mb-0 fs-5 text-uppercase fw-semibold">
              {category.title}
            </CardTitle>
            <span className="badge badge-label badge-soft-secondary">{category.total}</span>
          </div>
        </CardHeader>
        <CardBody className="p-0">
          <div className="list-group list-group-flush">
            {category.items.map((item, idx) => (
              <div
                key={idx}
                className="list-group-item d-flex justify-content-between align-items-center py-1 px-3"
              >
                <span className="text-muted">{item.label}</span>
                <span className="badge badge-label badge-soft-light text-dark fw-semibold ">
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
        <Col xs={12} className="">
          <h5 className="fs-5">Booking Statistics</h5>
        </Col>
        {bookingData.map((category, idx) => (
          <CountCard key={idx} category={category} />
        ))}
      </Row>

      <Row className="">
        <Col xs={12} className="">
          <h5 className="fs-5">Partner & Driver Statistics</h5>
        </Col>
        {partnerData.map((category, idx) => (
          <CountCard key={idx} category={category} />
        ))}
      </Row>
    </>
  );
};

export default CountsDashboard;