interface BulkBookingProps {
  mode: "add" | "edit";
  data?: any;
  onCancel: () => void;
  onDataChanged: () => void;
}

const BulkBooking: React.FC<BulkBookingProps> = ({
  mode,
  data,
  onCancel,
  onDataChanged,
}) => {

  console.log("BulkBooking Props:", { mode, data, onCancel, onDataChanged });
  return (
    <div>
      
    </div>
  )
}

export default BulkBooking