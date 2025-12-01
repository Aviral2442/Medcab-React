import React from "react";

interface BookingListProps {
  mode: "add" | "edit";
  data?: any;
  onCancel: () => void;
  onDataChanged: () => void;
}

const BookingList: React.FC<BookingListProps> = ({
  mode,
  data,
  onCancel,
  onDataChanged,
}) => {
    console.log("BulkBooking Props:", { mode, data, onCancel, onDataChanged });

  return (
    <div>BookingList</div>
  )
};

export default BookingList