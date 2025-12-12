import axios from "axios";
import { formatDate } from "@/components/DateFormat";
const baseURL = (import.meta as any).env?.VITE_IMAGE_PATH ?? "";

let bookingRows: any[] = [];
const getAmbulanceBooking = async () => {
    try {
        const rows = await axios.get(`${baseURL}/ambulance/get_ambulance_booking_list`);
        // console.log("Bookings fetched:", rows);
        bookingRows = rows.data.jsonData?.booking_list || [];
    } catch (error) {
        console.error("Error fetching bookings:", error);
    }
}
await getAmbulanceBooking();

type TableType<T> = {
    header: string[]
    body: T[]
}

type AmbulanceBookingInfoType = {
    booking_id: number
    booking_source: string
    booking_type: string
    booking_con_name: string
    booking_con_mobile: string
    booking_view_category_name: string
    booking_schedule_time: string
    booking_pickup: string
    booking_drop: string
    booking_status: number
    booking_total_amount: string
    created_at: string
}

// Status map for ambulance bookings (matches backend)
const statusMap: Record<number, [string, string]> = {
    0: ["secondary", "Enquery"],
    1: ["primary", "Confirm Booking"],
    2: ["info", "Driver Assign"],
    3: ["warning", "Invoice"],
    4: ["success", "Complete"],
    5: ["danger", "Cancel"],
};

// BOOKING COLUMNS
export const bookingColumns = [
    {
        data: null,
        orderable: false,
        searchable: false,
        render: (_data: any, _type: any, _row: any, meta: any) => {
            return meta.row + 1;
        }
    },
    {
        data: 'booking_id',
        defaultContent: '-'  // Make sure this is a string
    },
    {
        data: 'booking_type',
        defaultContent: '-',  // Change from '' or 0 to '-' or '0'
        render: (data: any) => {
            const typeMap: Record<number, string> = { 0: "Regular", 1: "Rental", 2: "Bulk" };
            return typeMap[data] || data;
        }
    },
    {
        data: 'booking_con_name',
        defaultContent: '-',
        render: (_data: any, _type: any, row: any) => {
            const name = row['booking_con_name'] || '-';
            const mobile = row['booking_con_mobile'] || '-';
            return `${name} <br/> (${mobile})`;
        }
    },
    {
        data: 'booking_view_category_name',
        defaultContent: '-',
    },
    {
        data: 'booking_schedule_time',
        defaultContent: '-',
        render: (data: any) => formatDate(data),
    },
    {
        data: 'booking_pickup',
        defaultContent: '-',
    },
    {
        data: 'booking_drop',
        defaultContent: '-',
    },
    {
        data: 'booking_total_amount',
        defaultContent: '-',  // Change from 0 to '-' or '0'
    },
    {
        data: 'created_at',
        defaultContent: '-',
        render: (data: any) => formatDate(data),
    },
    // { data: 'remark_text',
    //     defaultContent: ' ',
    //  },
    {
        data: 'booking_status',
        defaultContent: '0',  // Changed from 0 to '0'
        render: (data: number) => {
            const [variant, text] = statusMap[data] || ["secondary", "Unknown"];
            return `<span class="badge badge-label badge-soft-${variant}">${text}</span>`;
        }
    },
];

export const bookingTableData: TableType<AmbulanceBookingInfoType> = {
    header: ["S.No.", 'ID', 'Type', 'Consumer', 'Category', 'Schedule', 'Pickup', 'Drop', ' Amount', 'Created', 'Status'],
    body: bookingRows,
};