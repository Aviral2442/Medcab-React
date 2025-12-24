import axios from "axios";

const BookingDetailsApiData = () => {
  const baseURL = (import.meta as any).env?.VITE_PATH ?? "";

  const updatePaymentDetails = async (
    bookingId: string,
    newAmount: string,
    amountColumnName: string
  ) => {
    try {
      const response = await axios.patch(
        `${baseURL}/ambulance/update_ambulance_booking_amount/${bookingId}`,
        {
          newAmount,
          amountColumnName,
        }
      );

      if (response.data.status === 200) {
        console.log("Booking amount updated successfully");
        return { success: true, data: response.data };
      } else {
        console.error(
          "Failed to update booking amount:",
          response.data.message
        );
        return { success: false, message: response.data.message };
      }
    } catch (error: any) {
      console.error("Error updating booking amount:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update amount",
      };
    }
  };

  const updateScheduleTime = async (
    bookingId: string,
    scheduleTime: string
  ) => {
    try {
      const response = await axios.put(
        `${baseURL}/ambulance/update_ambulance_booking_schedule_time/${bookingId}`,
        { booking_schedule_time: scheduleTime }
      );
      console.log("Schedule time updated successfully");
      return { success: true, data: response.data };
    } catch (error: any) {
      console.error("Error updating schedule time:", error);
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to update schedule time",
      };
    }
  };

  const searchConsumers = async (query: string) => {
    try {
      const response = await axios.get(
        `${baseURL}/ambulance/get_ambulance_consumer_mobile?search=${encodeURIComponent(
          query
        )}`
      );
      return {
        success: true,
        data: response.data?.jsonData?.ambulance_consumer_data || [],
      };
    } catch (error: any) {
      console.error("Error searching consumers:", error);
      return { success: false, data: [], message: error.message };
    }
  };

  const updateConsumerDetails = async (
    bookingId: string,
    consumerName: string,
    consumerMobile: string
  ) => {
    try {
      const response = await axios.put(
        `${baseURL}/ambulance/update_ambulance_booking_consumer_details/${bookingId}`,
        {
          booking_con_name: consumerName,
          booking_con_mobile: consumerMobile,
        }
      );
      return { success: true, data: response.data };
    } catch (error: any) {
      console.error("Error updating consumer details:", error);
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to update consumer details",
      };
    }
  };

  const searchVehicles = async (query: string) => {
    try {
      const response = await axios.get(
        `${baseURL}/ambulance/get_vehicle_and_assign_data?search=${encodeURIComponent(
          query
        )}`
      );
      return {
        success: true,
        data: response.data?.jsonData?.vehicle_and_assign_data || [],
      };
    } catch (error: any) {
      console.error("Error searching vehicles:", error);
      return { success: false, data: [], message: error.message };
    }
  };

  const assignDriver = async (
    bookingId: string,
    driverId: number,
    vehicleId: number,
    adminId: number
  ) => {
    try {
      const response = await axios.post(
        `${baseURL}/ambulance/assign_driver/${bookingId}`,
        { driverId, vehicleId, adminId }
      );
      return { success: true, data: response.data };
    } catch (error: any) {
      console.error("Error assigning driver:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to assign driver",
      };
    }
  };

  const verifyOTP = async (bookingId: string, adminId: number) => {
    try {
      const response = await axios.post(
        `${baseURL}/ambulance/verify_otp/${bookingId}`,
        { adminId }
      );
      return { success: true, data: response.data };
    } catch (error: any) {
      console.error("Error verifying OTP:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to verify OTP",
      };
    }
  };

  const completeBooking = async (bookingId: string) => {
    try {
      const response = await axios.post(
        `${baseURL}/ambulance/complete_ambulance_booking/${bookingId}`
      );
      return { success: true, data: response.data };
    } catch (error: any) {
      console.error("Error completing booking:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to complete booking",
      };
    }
  };

  const fetchBookingDetails = async (bookingId: string) => {
    try {
      const response = await axios.get(
        `${baseURL}/ambulance/ambulance_booking_detail/${bookingId}`
      );
      return {
        success: true,
        data: response.data.jsonData.booking_detail,
      };
    } catch (error: any) {
      console.error("Error fetching booking details:", error);
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to fetch booking details",
      };
    }
  };

  const cancelAssignDriver = async (bookingId: string) => {
    try {
      const response = await axios.post(
        `${baseURL}/ambulance/cancel_driver_from_ambulance_booking/${bookingId}`
      );
      return { success: true, data: response.data };
    } catch (error: any) {
      console.error("Error cancelling assigned driver:", error);
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to cancel assigned driver",
      };
    }
  };

  const cancelBooking = async (
    bookingId: string,
    cancelReasonId: number,
    cancelReason: string,
    cancelUserType: number,
    adminId: number
  ) => {
    try {
      const response = await axios.patch(
        `${baseURL}/ambulance/cancel_ambulance_booking/${bookingId}`,
        { cancelReasonId, cancelReason, cancelUserType, adminId }
      );
      return { success: true, data: response.data };
    } catch (error: any) {
      console.error("Error cancelling booking:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to cancel booking",
      };
    }
  };

  const generateInvoice = async (
    bookingId: string,
    totalAmounts: number,
    advance_amounts: number,
    extra_km: number,
    extra_hour: number
  ) => {
    try {
      const response = await axios.post(
        `${baseURL}/ambulance/generate_ambulance_booking_invoice/${bookingId}`,
        { totalAmounts, advance_amounts, extra_km, extra_hour }
      );
      return { success: true, data: response.data };
    } catch (error: any) {
      console.error("Error generating invoice:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to generate invoice",
      };
    }
  };


  const fetchInvoiceData = async (bookingId: string) => {
    try {
      const response = await axios.get(`${baseURL}/ambulance/ambulance_booking_invoice/${bookingId}`);
      return {
        success: true,
        data: response.data?.jsonData?.booking_invoice_data,
      };
    }
    catch (error: any) {
      console.error("Error fetching invoice data:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch invoice data",
      };
    }
  };

  return {
    updatePaymentDetails,
    updateScheduleTime,
    searchConsumers,
    updateConsumerDetails,
    searchVehicles,
    assignDriver,
    verifyOTP,
    completeBooking,
    fetchBookingDetails,
    cancelAssignDriver,
    cancelBooking,
    generateInvoice,
    fetchInvoiceData
  };
};

export default BookingDetailsApiData;

