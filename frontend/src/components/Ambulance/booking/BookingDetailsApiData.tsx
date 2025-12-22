import axios from 'axios';

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
          amountColumnName
        }
      );

      if (response.data.status === 200) {
        console.log("Booking amount updated successfully");
        return { success: true, data: response.data };
      } else {
        console.error("Failed to update booking amount:", response.data.message);
        return { success: false, message: response.data.message };
      }
    } catch (error: any) {
      console.error("Error updating booking amount:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update amount"
      };
    }
  };

  return {
    updatePaymentDetails
  };
};

export default BookingDetailsApiData;