import { formatDate } from "@/components/DateFormat";
import axios from "axios";
const baseURL = (import.meta as any).env?.VITE_PATH ?? "";

type DriverInfoType = {
    driver_id: number;
    driver_name: string;
    driver_last_name: string;
    driver_mobile: string;
    v_vehicle_name: string;
    vehicle_rc_number: string;
    driver_duty_status: string;
    created_at: string;
}

type TableType<T> = {
    header: string[];
    body: T[];
}

let driverRows: DriverInfoType[] = [];

export const getDriverList = async () => {
    try {
        const response = await axios.get(`${baseURL}/driver/driver_on_off_data`);
        driverRows = response.data.jsonData?.driverOnOffData || [];
        return driverRows;
    } catch (error) {
        console.error("Error fetching drivers:", error);
        throw error;
    }
}

export const driverColumns = [
    { data: 'driver_id' },
    { data: 'driver_name',
        defaultContent: '',
        render: (data: string, _type: any, row: DriverInfoType) => {
            return `${data} ${row.driver_last_name}`;
        }
    },
    { data: 'driver_mobile' },
    { data: 'v_vehicle_name' },
    { data: 'vehicle_rc_number' },
     {
        data: 'created_at',
        render: (data: string) => {
            return formatDate(data);
        }
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
    }
];

// Export table data structure
export const driverTableData: TableType<DriverInfoType> = {
    header: [
        "S.No.",
        "ID",
        "Name",
        "Mobile",
        "V Name",
        "VRC Number",
        "Created At",
        "Status"
    ],
    body: driverRows,
};