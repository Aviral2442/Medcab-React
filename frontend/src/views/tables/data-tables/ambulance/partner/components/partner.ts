import axios from "axios";
import { formatDate } from "@/components/DateFormat";
const baseURL = (import.meta as any).env?.VITE_PATH ?? "";
const basePath = (import.meta as any).env?.base_Path ?? "http://localhost:4000";

type PartnerInfoType = {
    partner_id: number;
    partner_profile_img: string;
    partner_f_name: string;
    // partner_l_name: string;
    partner_mobile: string;
    partner_wallet: Number;
    partner_registration_step: string;
    partner_created_by: string;
    partner_status: number;
}

type TableType<T> = {
    header: string[];
    body: T[];
}

let partnerRows: PartnerInfoType[] = [];

export const getPartnerList = async () => {
    try {
        const response = await axios.get(`${baseURL}/partner/get_partners_list`);
        partnerRows = response.data.jsonData?.partners || [];
        return partnerRows;
    } catch (error) {
        console.error("Error fetching partners:", error);
        throw error;
    }
}

export const partnerColumns = [
    { data: 'partner_id' },
    {
        data: 'partner_profile_img',
        render: (data: string) => {
            if (data) {
                return `<img src="${basePath}/${data}" alt="Profile" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;" />`;
            }
            return 'N/A';
        }
    },
    { data: 'partner_f_name' },
    // { data: 'partner_l_name' },
    { data: 'partner_mobile' },
    {
        data: 'partner_wallet',
        render: (data: number) => {
            return `₹${data || 0}`;
        }
    },
    // { data: 'partner_city_id' },
    {
        data: 'partner_registration_step',
        render: (data: string) => {
            if (data === '0') return 'New';
            else if (data === '1') return 'Active';
            else return '';
        }
    },
    {
        data: 'created_at',
        render: (data: string) => {
            return formatDate(data);
        }
    },
    // { data: 'remark_text' },
    {
        data: 'partner_status',
        render: (data: number) => {
            const statusMap: Record<number, { label: string; class: string }> = {
                0: { label: 'New', class: 'info' },
                1: { label: 'Active', class: 'success' },
                2: { label: 'Inactive', class: 'warning' },
            };

            const status = statusMap[data] || { label: 'Unknown', class: 'secondary' };
            return `<span class="badge badge-label badge-soft-${status.class}">${status.label}</span>`;
        }
    },
];

// Export table data structure
export const partnerTableData: TableType<PartnerInfoType> = {
    header: [
        "S.No.",
        "ID",
        "Name",
        "Mobile",
        "Img",
        "Wallet",
        "City",
        "Created At",
        // "Remark",
        "Status"
    ],
    body: partnerRows,
};