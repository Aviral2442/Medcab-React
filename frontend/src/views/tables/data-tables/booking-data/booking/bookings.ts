import axios from "axios";
const baseURL = (import.meta as any).env?.VITE_PATH ?? "";
// const basePath = import.meta.env.VITE_PATH;

let bookRows: any[] = [];
const getBookings = async () => {
  try {
    const rows = await axios.get(`${baseURL}/booking/get_bookings`);
    // console.log(rows);
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
  { data: 'mpo_address_id' },
  { data: 'mpo_final_price' },
  { data: 'mpo_payment_mode' },
  { data: 'mpo_order_date',
    render: (data: string) => {
      const date = new Date(parseInt(data) * 1000);
      const time = date.getHours() + ':' + date.getMinutes() ;
      return date.toLocaleDateString() + ' ' + time;
    }
   },
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
  header: ["S.No.","order id", "name", "mobile_no", "address_id", "Price", "payment_mode","order_date", "status"],
  body: bookRows,
}