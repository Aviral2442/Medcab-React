import { Card, CardBody, CardFooter } from "react-bootstrap";
import { LuActivity } from "react-icons/lu";
import CustomChartJS from "@/components/CustomChartJS.tsx";
import { ArcElement, PieController } from "chart.js";
import axios from "axios";
import React from "react";
import { getColor } from "@/helpers/chart";
import type { ChartJSOptionsType } from "@/types";

const ResponseAccuracy = () => {

    const baseURL = (import.meta as any).env?.VITE_PATH ?? "";

  const [bookingData, setBookingData] = React.useState({
    completed_bookings: 0,
    cancelled_bookings: 0,
    ongoing_bookings: 0,
  });

  const fetchtotalCancelOngoingBookingCounts = async () => {
    try {
      const res = await axios.get(
        `${baseURL}/ambulance/ambulance_booking_count`
      );
      if (res.status !== 200) {
        throw new Error("Failed to fetch data");
      }
      
      if (res.data.jsonData?.completed_ongoing_cancelled_counts) {
        const data = res.data?.jsonData?.completed_ongoing_cancelled_counts;
        // console.log("API Response of Booking Statistics: ", data);
        setBookingData({
          completed_bookings: data.completed_bookings || 0,
          cancelled_bookings: data.cancelled_bookings || 0,
          ongoing_bookings: data.ongoing_bookings || 0,
        });
      }
    } catch (error) {
      console.error("Error fetching booking counts:", error);
    }
  };

  React.useEffect(() => {
    fetchtotalCancelOngoingBookingCounts();
  }, []);

  const getBookingPieChart = React.useCallback((): ChartJSOptionsType => {

    return {
      data: {
        labels: ['Completed', 'Ongoing', 'Cancelled'],
        datasets: [
          {
            data: [
              bookingData.completed_bookings,
              bookingData.ongoing_bookings,
              bookingData.cancelled_bookings,
            ],
            backgroundColor: [
              getColor('chart-primary'),
              getColor('chart-secondary'),
              '#D0D3D5', // Changed from getColor('chart-dark') to custom grey color
            ],
            borderColor: '#ffffff',
            borderWidth: 0,
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
            callbacks: {
              label: function (ctx) {
                const label = ctx.label || '';
                const value = ctx.parsed || 0;
                const total = bookingData.completed_bookings;
                const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
                return `${label}: ${value} (${percentage}%)`;
              },
            },
          },
        },
        scales: {
          x: {
            display: false,
          },
          y: {
            display: false,
          },
        },
      },
    };
  }, [bookingData]);

  return (
    <Card className="card-h-100">
      <CardBody>
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <h5 className="text-uppercase">Booking Statistics</h5>
          </div>
          <div>
            <LuActivity className="text-muted fs-24 svg-sw-10" />
          </div>
        </div>

        <div className="d-flex align-items-center justify-content-center" style={{ height: '100px' }}>
          {bookingData.completed_bookings > 0 ? (
            <CustomChartJS
              type="pie"
              getOptions={getBookingPieChart}
              plugins={[PieController, ArcElement]}
              style={{ maxHeight: "200px", maxWidth: "200px" }}
            />
          ) : (
            <div className="text-muted">No booking data available</div>
          )}
        </div>
      </CardBody>
      <CardFooter className="text-muted text-center">
        <div>
          <strong>Total Bookings: {bookingData.completed_bookings}</strong>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ResponseAccuracy;