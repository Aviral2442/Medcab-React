import axios from "axios";

type ConsumerInfoType = {
    consumer_id: number
    consumer_name: string
    consumer_mobile_no: string
    consumer_email_id: string
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
        const response = await axios.get(`${process.env.VITE_PATH}/consumer/get_consumers_list`);
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
    { data: 'consumer_email_id' },
    { data: 'consumer_wallet_amount' },
    { data: 'consumer_city_id' },
    { data: 'consumer_city_id' },
    {
        data: 'consumer_registred_date',
        render: (data: string) => {
            const date = new Date(parseInt(data) * 1000);
            return date.toLocaleDateString();
        }
    },
    {
        data: 'consumer_status',
        render: (data: number) => {
            const statusMap: Record<number, { label: string; class: string }> = {
                0: { label: 'New User', class: 'success' },
                1: { label: 'Active', class: 'warning' },
                2: { label: 'inactive', class: 'info' },
            };

            const status = statusMap[data] || { label: 'Unknown', class: 'secondary' };
            return `<span class="badge badge-label badge-soft-${status.class}">${status.label}</span>`;
        }
    },
];

// Export table data structure
export const consumerTableData: TableType<ConsumerInfoType> = {
    header: ["S.No." ,"ID", "Name", "Mobile", "Email", "Wallet", "Ref Code", "Ref By", "Register", "Status"],
    body: consumerRows,
};
