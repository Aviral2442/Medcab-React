import DashboardFilters from "@/components/table/DashboardFilter";
import { Card, CardBody, CardHeader, CardTitle, Row, Col } from "react-bootstrap";
import React from "react";
import axios from "axios";


interface CountItem {
  label: string;
  count: number | string;
}

interface BookingCategory {
  title: string;
  total: number | string;
  items: CountItem[];
}

interface PartnerCounts {
  total_partner_count: number;
  new_partner_count: number;
  unverified_partner_count: number;
  verified_partner_count: number;
  blocked_partner_count: number;
}


const CountsDashboard = () => {
const [partnerCounts, setPartnerCounts] = React.useState<PartnerCounts | null>(null);

  const baseURL = (import.meta as any).env.VITE_PATH ?? "";

  const fetchPartnerCountsData = async () => {
    try{
      const response = await axios(`${baseURL}/ambulance/partner_count_dashboard_ambulance`);
      console.log("Partner Counts Data:", response);
      setPartnerCounts(response.data?.jsonData?.ambulance_partner_counts);
    } catch (error) {
      console.error("Error fetching partner counts data:", error);
    }
  }

  React.useEffect(() => {
    fetchPartnerCountsData();
  }, []);

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
      title: "Regular Booking",
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
      title: "Bulk Booking",
      total: 159,
      items: [
        { label: "Enquiry", count: 136 },
        { label: "New Booking", count: 0 },
        { label: "Accepted", count: 0 },
        { label: "Complete Booking", count: 1 },
        { label: "Cancelled Booking", count: 22 },
      ],
    },
  ];

  // Static partner data
  const partnerData: BookingCategory[] = [
    {
        title: "Partner",
        total: partnerCounts?.total_partner_count || 0,
        items: [
          { label: "New", count: partnerCounts?.new_partner_count || 0 },
          { label: "Unverified", count: partnerCounts?.unverified_partner_count || 0 },
          { label: "Verified", count: partnerCounts?.verified_partner_count || 0 },
          { label: "Blocked", count: partnerCounts?.blocked_partner_count || 0 },
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
        // { label: "Subscription", count: 3 },
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
        // { label: "Under Reg.", count: 0 },
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
            <span className="badge badge-label text-dark fw-semibold ">{category.total}</span>
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
                <span className="badge badge-label text-dark fw-semibold ">
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
        <Col xs={12} className="mb-3">
          <DashboardFilters
            showDateFilter={true}
            showDateRange={true}
            showCityFilter={true}
            showStateFilter={true}
            onDateFilterChange={() => {}}
            onDateRangeChange={() => {}}
            onCityFilterChange={() => {}}
            onStateFilterChange={() => {}}
            dateRange={[null, null]}
            dateFilter={null}
            cityOptions={[]}
            stateOptions={[]}
          />
        </Col>

      </Row>

      <Row className="">
        {bookingData.map((category, idx) => (
          <CountCard key={idx} category={category} />
        ))}
      </Row>

      <Row className="">
        {partnerData.map((category, idx) => (
          <CountCard key={idx} category={category} />
        ))}
      </Row>
    </>
  );
};

export default CountsDashboard;