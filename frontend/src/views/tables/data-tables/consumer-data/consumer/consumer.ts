import axios from "axios";
const baseURL = (import.meta as any).env?.VITE_PATH ?? "";
import { formatDate } from "@/components/DateFormat";

type ConsumerInfoType = {
    consumer_id: number
    consumer_name: string
    consumer_mobile_no: string
    // consumer_email_id: string
    consumer_wallet_amount: number
    consumer_city_id: string
    consumer_registred_date: number
    consumer_status: number
}

type TableType<T> = {
    header: string[]
    body: T[]
}

let consumerRows: ConsumerInfoType[] = [];

export const getConsumerList = async () => {
    try {
        const response = await axios.get(`${baseURL}/consumer/get_consumers_list`);
        consumerRows = response.data.consumers || [];
        return consumerRows;
    } catch (error) {
        console.error("Error fetching consumers:", error);
        throw error;
    }
}

export const consumerColumns = [
    { data: 'consumer_id' },
    { data: 'consumer_name' },
    { data: 'consumer_mobile_no' },
    // { data: 'consumer_email_id' },
    { data: 'consumer_wallet_amount' ,
        render: (data: number) => {
            return `₹${data}`;
        }

    },
    { data: 'consumer_my_referal_code' },
    { data: 'referer_name' },
    {
        data: 'consumer_registred_date',
        render: (data: string) => {
            return formatDate(data) || ' ';
        }
    },
    {
        data: 'consumer_status',
        render: (data: number) => {
            const statusMap: Record<number, { label: string; class: string }> = {
                0: { label: 'New User', class: 'warning' },
                1: { label: 'Active', class: 'success' },
                2: { label: 'inactive', class: 'info' },
            };

            const status = statusMap[data] || { label: 'Unknown', class: 'secondary' };
            return `<span class="badge badge-label badge-soft-${status.class}">${status.label}</span>`;
        }
    },
];

// Export table data structure
export const consumerTableData: TableType<ConsumerInfoType> = {
    header: ["S.No." ,"ID", "Name", "Mobile", "Email", "Wallet", "Ref Code", "Ref By", "Register","Status"],
    body: consumerRows,
};
