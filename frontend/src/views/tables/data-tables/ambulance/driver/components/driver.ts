import axios from "axios";
import { formatDate } from "@/components/DateFormat";
const baseURL = (import.meta as any).env?.VITE_PATH ?? "";

type DriverInfoType = {
    driver_id: number;
    driver_profile_img: string;
    driver_name: string;
    driver_mobile: string;
    driver_wallet_amount: number;
    created_partner_mobile: string;
    created_partner_name: string;
    driver_created_by: number; // 0: Self, 1: Partner
    driver_registration_step: number;
    driver_duty_status: string;
    driver_status: number;
    created_at: string;
}

type TableType<T> = {
    header: string[];
    body: T[];
}

let driverRows: DriverInfoType[] = [];

export const getDriverList = async () => {
    try {
        const response = await axios.get(`${baseURL}/driver/get_drivers_list`);
        driverRows = response.data.jsonData?.drivers || [];
        return driverRows;
    } catch (error) {
        console.error("Error fetching drivers:", error);
        throw error;
    }
}

export const driverColumns = [
    { data: 'driver_id' },
    {
        data: 'driver_profile_img',
        render: (data: string) => {
            if (data) {
                return `<img src="${data}" alt="Profile" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;" />`;
            }
            return '';
        }
    },
    { data: 'driver_name' },
    // { data: 'driver_last_name' },
    { data: 'driver_mobile' },
    {
        data: 'driver_wallet_amount',
        render: (data: number) => {
            return `₹${data || 0}`;
        }
    },
    // { data: 'driver_city_id' },
    {
        data: 'driver_created_by',
        render: (data: number) => {
            return data === 0 ? 'Self' : 'Partner';
        }
    },
    {
        data: 'created_partner_name',
        defaultContent: '',
        render: (_data: string, _type: any, row: any) => {
            const name = row['created_partner_name'] || '';
            const mobile = row['created_partner_mobile'] || '';
            if (!name && !mobile) return '';
            return `${name}${mobile ? ` <br/> (${mobile})` : ''}`;
        },
    },
    {
        data: 'driver_duty_status',
        render: (data: any) => {
            if (data == 'OFF') {
                return `<span class="badge badge-label badge-soft-danger">OFF</span>`;
            } else {
                return `<span class="badge badge-label badge-soft-success">ON</span>`;
            }
        }
    },
    {
        data: 'created_at',
        render: (data: string) => {
            return formatDate(data);
        }
    },
    // { data: 'remark_text',
    //     defaultContent: ' ',
    //  },
    {
        data: 'driver_status',
        render: (data: number) => {
            const statusMap: Record<number, { label: string; class: string }> = {
                0: { label: 'New', class: 'info' },
                1: { label: 'Active', class: 'success' },
                2: { label: 'Inactive', class: 'warning' },
                3: { label: 'Deleted', class: 'danger' },
                4: { label: 'Verification', class: 'primary' },
            };
            const status = statusMap[data] || { label: 'Unknown', class: 'secondary' };
            return `<span class="badge badge-label badge-soft-${status.class}">${status.label}</span>`;
        }
    },
];

// Export table data structure
export const driverTableData: TableType<DriverInfoType> = {
    header: [
        "S.No.",
        "ID",
        "Name",
        // "Last Name",
        "Mobile",
        "Wallet",
        // "City ID",
        "Created By",
        "Partner",
        "Profile",
        "Duty Status",
        "Created At",
        // "Remark",
        "Status"
    ],
    body: driverRows,
};