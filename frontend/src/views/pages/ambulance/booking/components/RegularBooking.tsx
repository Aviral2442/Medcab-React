interface RegularBookingProps {
  mode: "add" | "edit";
  data?: any;
  onCancel: () => void;
  onDataChanged: () => void;
}

const RegularBooking: React.FC<RegularBookingProps> = ({
  mode,
  data,
  onCancel,
  onDataChanged,
}) => {
    console.log("BulkBooking Props:", { mode, data, onCancel, onDataChanged });

  return (
    <div>RegularBooking</div>
  )
}

export default RegularBooking