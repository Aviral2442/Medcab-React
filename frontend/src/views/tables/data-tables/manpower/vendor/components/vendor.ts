import axios from "axios";
const baseURL = (import.meta as any).env?.VITE_PATH ?? ""; 
import { formatDate } from "@/components/DateFormat";

type VendorInfoType = {
    vendor_id: number
    vendor_picture: string
    vendor_name: string
    vendor_mobile: string
    vendor_gender: number
    city_name: string
    mp_cat_name: number
    vendor_created_at: string
    vendor_status: number
}

type TableType<T> = {
    header: string[]
    body: T[]
}

let vendorRows: VendorInfoType[] = [];

export const getVendorList = async () => {
    try {
        const response = await axios.get(`${baseURL}/vendor/vendors_list`);
        vendorRows = response.data.vendors || [];
        return vendorRows;
    } catch (error) {
        console.error("Error fetching vendors:", error);
        throw error;
    }
}

export const vendorColumns = [
    { data: 'vendor_id' },
    {
        data: 'vendor_picture',
        render: (data: string | "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-photo-image-illustration-285843601.jpg") => {
            return data ? `<img src="${data} " alt="vendor" class="rounded-circle" width="40" height="40" />` : '';
        }
    },
    { data: 'vendor_name' },
    { data: 'vendor_mobile' },
    {
        data: 'vendor_gender',
        render: (data: number) => {
            if (data == 1) {
                return '<span class="badge badge-label badge-soft-success">Male</span>';
            } else {
                return '<span class="badge badge-label badge-soft-secondary">Female</span>';
            }
        }
    },
    { data: 'city_name' },
    { data: 'mp_cat_name' },
    {
        data: 'vendor_created_at',
        render: (data: string) => {
            return formatDate(data) || ' ';
        }
    },
    { data: 'remark_text' },
    {
        data: 'vendor_status',
        render: (data: number) => {
            const statusMap: Record<number, { label: string; class: string }> = {
                0: { label: 'Active', class: 'success' },
                1: { label: 'Blocked', class: 'warning' },
                2: { label: 'New', class: 'info' },
                3: { label: 'Pending Approval', class: 'warning' },
                4: { label: 'Assigned', class: 'primary' },
                5: { label: 'Free', class: 'success' },
                6: { label: 'On Duty', class: 'primary' },
                7: { label: 'OFF Duty', class: 'secondary' }
            };

            const status = statusMap[data] || { label: 'Unknown', class: 'secondary' };
            return `<span class="badge badge-label badge-soft-${status.class}">${status.label}</span>`;
        }
    },
];

// Export table data structure
export const vendorTableData: TableType<VendorInfoType> = {
    header: ["S.No.","ID", "Picture", "Name", "Mobile", "Gender", "City", "Category", "Date", "Remark","Status"],
    body: vendorRows,
};
