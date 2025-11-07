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
    total_bookings: 0,
    cancelled_bookings: 0,
    ongoing_bookings: 0,
  });

  const fetchtotalCancelOngoingBookingCounts = async () => {
    try {
      const res = await axios.get(
        `${baseURL}/dashboard/get_total_cancel_ongoing_booking_counts`
      );
      console.log(`dekho: ${baseURL}`)
      if (res.status !== 200) {
        throw new Error("Failed to fetch data");
      }
    //   console.log("API Response:", res.data);
      
      // Assuming the API returns data in jsonData.bookingCounts[0]
      if (res.data.jsonData?.bookingCounts?.[0]) {
        const data = res.data.jsonData.bookingCounts[0];
        setBookingData({
          total_bookings: data.total_bookings || 0,
          cancelled_bookings: data.cancelled_bookings || 0,
          ongoing_bookings: data.ongoing_bookings || 0,
        });
        // console.log("Booking Data Set:", data);
      }
    } catch (error) {
      console.error("Error fetching booking counts:", error);
    }
  };

  React.useEffect(() => {
    fetchtotalCancelOngoingBookingCounts();
  }, []);

  const getBookingPieChart = React.useCallback((): ChartJSOptionsType => {
    const completedBookings = 
      bookingData.total_bookings - 
      bookingData.cancelled_bookings - 
      bookingData.ongoing_bookings;

    return {
      data: {
        labels: ['Completed', 'Ongoing', 'Cancelled'],
        datasets: [
          {
            data: [
              Math.max(completedBookings, 0),
              bookingData.ongoing_bookings,
              bookingData.cancelled_bookings,
            ],
            backgroundColor: [
              getColor('chart-primary'),
              getColor('chart-secondary'),
              getColor('chart-dark'),
            ],
            borderColor: '#ffffff',
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { 
            display: true, 
            position: 'bottom',
            labels: {
              padding: 4,
              usePointStyle: true,
            }
          },
          tooltip: {
            enabled: true,
            callbacks: {
              label: function (ctx) {
                const label = ctx.label || '';
                const value = ctx.parsed || 0;
                const total = bookingData.total_bookings;
                const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
                return `${label}: ${value} (${percentage}%)`;
              },
            },
          },
        },
      },
    };
  }, [bookingData]);

  // const accuracyPercentage = bookingData.total_bookings > 0
  //   ? (((bookingData.total_bookings - bookingData.cancelled_bookings) / bookingData.total_bookings) * 100).toFixed(1)
  //   : '0';

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

        <div className="d-flex align-items-center justify-content-center" style={{ height: '200px' }}>
          {bookingData.total_bookings > 0 ? (
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
          <strong>Total Bookings: {bookingData.total_bookings}</strong>
        </div>
        {/* <div className="mt-1">
          Success Rate: <strong>{accuracyPercentage}%</strong>
        </div> */}
      </CardFooter>
    </Card>
  );
};

export default ResponseAccuracy;