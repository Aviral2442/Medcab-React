import axios from "axios";
const baseURL = (import.meta as any).env?.VITE_PATH ?? "";
import { formatDate } from "@/components/DateFormat";
// const basePath = import.meta.env.VITE_PATH;

let bookRows: any[] = [];
const getBookings = async () => {
  try {
    const rows = await axios.get(`${baseURL}/booking/get_bookings`);
    bookRows = rows.data.bookings;
  } catch (error) {
    console.error("Error fetching categories:", error);
  }

}
await getBookings();

type TableType<T> = {
  header: string[]
  body: T[]
}

type BookingInfoType = {
  manpower_order_id: number
  consumer_name: string
  consumer_mobile_no: string
  mpo_address_id: number
  mpo_final_price: number
  mpo_payment_mode: string
  mpo_order_date: string
  mpo_status: number
}


export const bookingColumns = [
  { data: 'manpower_order_id' },
  { data: 'consumer_name' },
  { data: 'consumer_mobile_no' },
  { data: 'ua_address' },
  { data: 'mpo_final_price' },
  { data: 'mpo_order_date',
    render: (data: string) => {
      return formatDate(data);
    }
   },
   { data: 'remark_text'},
  {
    data: 'mpo_status', render: (data: number) => {
      // console.log(data);
      if (data == 1) {
        return `<span class="badge badge-label badge-soft-success">New</span>`;
      } else if (data == 2) {
        return `<span class="badge badge-label badge-soft-warning">Ongoing</span>`;
      } else if (data == 3) {
        return `<span class="badge badge-label badge-soft-danger">canceled</span>`;
      } else {
        return `<span class="badge badge-label badge-soft-secondary">completed</span>`;
      }
    }
  },
]




export const categoryTableData: TableType<BookingInfoType> = {
  header: ["S.No.","order id", "name", "mobile_no", "address", "Price","order_date", "Remark", "status"],
  body: bookRows,
}