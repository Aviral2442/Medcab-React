import { Card, CardBody, CardFooter } from "react-bootstrap";
import { LuMessageSquare } from "react-icons/lu";
import { TbArrowUp } from "react-icons/tb";
import CustomChartJS from "@/components/CustomChartJS.tsx";
import {
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import CountUp from "react-countup";
import axios from "axios";
import React from "react";

const PromptsUsage = () => {
  const baseURL = (import.meta as any).env?.VITE_PATH ?? "";

  interface BookingCounts {
    today_bookings?: number;
    yesterday_bookings?: number;
    day_2_bookings?: number;
    day_3_bookings?: number;
    day_4_bookings?: number;
    day_5_bookings?: number;
    day_6_bookings?: number;
  }

  const [bookings, setBookings] = React.useState<BookingCounts>({});
  const [isLoading, setIsLoading] = React.useState(true);

  const fetchtotalBookingCounts = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${baseURL}/dashboard/get_total_booking_count`);
      // console.log("API Response of Prompts: ",res.data?.jsonData?.bookingTotalCount[0])
      setBookings(res.data?.jsonData?.bookingTotalCount[0] || {});
    } catch (error) {
      console.error("Error fetching booking counts: ", error);
      setBookings({});
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchtotalBookingCounts();
  }, []);

  const {
    today_bookings = 0,
    yesterday_bookings = 0,
    day_2_bookings = 0,
    day_3_bookings = 0,
    day_4_bookings = 0,
    day_5_bookings = 0,
    day_6_bookings = 0,
  } = bookings;
  // console.log("Prompts Data: ", day_6_bookings);

  // Prepare chart data from API response - useMemo to prevent recreation on every render
  const chartOptions = React.useMemo(
    () => ({
      type: "bar" as const,
      data: {
        datasets: [
          {
            data: [
              Number(day_6_bookings) || 0,
              Number(day_5_bookings) || 0,
              Number(day_4_bookings) || 0,
              Number(day_3_bookings) || 0,
              Number(day_2_bookings) || 0,
              Number(yesterday_bookings) || 0,
              Number(today_bookings) || 0,
            ],
            backgroundColor: "rgba(55, 68, 72, 1)",
            borderColor: "rgba(176, 201, 209, 1)",
            borderWidth: 1,
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: true,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
              precision: 0,
            },
          },
          x: {
            grid: {
              display: false,
            },
          },
        },
      },
    }),
    [
      day_6_bookings,
      day_5_bookings,
      day_4_bookings,
      day_3_bookings,
      day_2_bookings,
      yesterday_bookings,
      today_bookings,
    ]
  );

  const diff = Number(today_bookings || 0) - Number(yesterday_bookings || 0);

  // Calculate percentage change properly
  const totalPercentage =
    yesterday_bookings > 0
      ? Math.abs(Math.round((diff / Number(yesterday_bookings)) * 100))
      : 0;

  let upDownStatusToday = "";

  if (diff >= 0) {
    upDownStatusToday = "increased";
  } else {
    upDownStatusToday = "decreased";
  }

  let arrowIconT = null;
  let arrowIconY = null;

  if (upDownStatusToday === "increased") {
    arrowIconT = <TbArrowUp className="text-success ms-1" />;
    arrowIconY = (
      <TbArrowUp
        className="text-danger ms-1"
        style={{ transform: "rotate(180deg)" }}
      />
    );
  } else {
    arrowIconT = (
      <TbArrowUp
        className="text-danger ms-1"
        style={{ transform: "rotate(180deg)" }}
      />
    );
    arrowIconY = <TbArrowUp className="text-success ms-1" />;
  }

  if (isLoading) {
    return (
      <Card className="card-h-100">
        <CardBody>
          <div className="text-center">Loading...</div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="card" style={{ maxHeight: '230px' }}>
      <CardBody>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h5 className="text-uppercase mb-3">Booking Counts</h5>
          </div>
          <div>
            <LuMessageSquare className="text-muted fs-24 svg-sw-10" />
          </div>
        </div>

        <div className="mb-3" style={{ height: "57px" }}>
          <CustomChartJS
            key={JSON.stringify(bookings)}
            type="bar"
            getOptions={() => chartOptions}
            plugins={[BarController, BarElement, CategoryScale, LinearScale]}
            height={18}
          />
        </div>

        <div className="d-flex justify-content-between">
          <div>
            <span className="text-muted">Today</span>
            <div className="fw-semibold">
              <span>
                <CountUp
                  end={Number(today_bookings) || 0}
                  duration={2}
                  enableScrollSpy
                  scrollSpyOnce
                />
              </span>
              {arrowIconT}
            </div>
          </div>
          <div className="text-end">
            <span className="text-muted">Yesterday</span>
            <div className="fw-semibold">
              <span>
                <CountUp
                  end={Number(yesterday_bookings) || 0}
                  duration={2}
                  enableScrollSpy
                  scrollSpyOnce
                />
              </span>
              {arrowIconY}
            </div>
          </div>
        </div>
      </CardBody>
      <CardFooter className="text-muted text-center">
        Bookings {upDownStatusToday} by <strong>{totalPercentage}%</strong>{" "}
        {/* {diff >= 0 ? "from" : "compared to"} yesterday */}
      </CardFooter>
    </Card>
  );
};

export default PromptsUsage;
