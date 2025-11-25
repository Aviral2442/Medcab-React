interface RentalBookingProps {
  mode: "add" | "edit";
  data?: any;
  onCancel: () => void;
  onDataChanged: () => void;
}

const RentalBooking: React.FC<RentalBookingProps> = ({
  mode,
  data,
  onCancel,
  onDataChanged,
}) => {
    console.log("BulkBooking Props:", { mode, data, onCancel, onDataChanged });

  return (
    <div>RentalBooking</div>
  )
}

export default RentalBooking