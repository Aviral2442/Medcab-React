import axios from 'axios';
import { formatDate } from '@/components/DateFormat';
const baseURL = (import.meta as any).env?.VITE_PATH ?? '';

type VehicleInfoType = {
    vehicle_id: number;
    vehicle_added_type: string; 
    driver_name: string;
    driver_last_name: string;
    driver_mobile: string;
    v_vehicle_name: string;
    vehicle_name_id: number;
    vehicle_category_type: string; 
    vehicle_category_type_service_id: number;
    vehicle_exp_date: string;
    vehicle_verify_date: string;
    verify_type: string;
    created_at: string;
    vehicle_status: number;
};

type TableType<T> = {
    header: string[];
    body: T[];
}

let vehicleRows: VehicleInfoType[] = [];

export const getVehicleList = async () => {
    try {
        const res = await axios.get(`${baseURL}/vehicle/get_vehicle_list`);
        // Accept either 'vehicle_list' or 'vehicles' depending on backend response shape
        vehicleRows = res.data.jsonData?.vehicle_list || res.data.jsonData?.vehicles || [];
        return vehicleRows;
    } catch (error) {
        console.error('Error fetching vehicles:', error);
        throw error;
    }
}


export const vehicleColumns = [
    { data: 'vehicle_id' },
    {
        data: 'driver_name',
        defaultContent: '',
        render: (_data: any, _type: any, row: any) => {
            const name = row['driver_name'] || '';
            const lastName = row['driver_last_name'] || '';
            const mobile = row['driver_mobile'] || '';
            if(name === '' && lastName === '' && mobile === '') {
                return '';
            }
            return `${name} ${lastName} (${mobile})`;
        }
    },
    { data: 'vehicle_added_type',
        render: (data: string) => {
            if (data === '0') return 'Self';
            else if (data === '1') return 'Partner';  
        }
     },
    { data: 'v_vehicle_name' },
    { data: 'ambulance_category_vehicle_name' },
    // { data: 'verify_type' },
    {
        data: 'vehicle_verify_date',
        render: (data: string) => {
            if (data === '') return '';
            return formatDate(data);
        }
    },
    { 
        data: 'vehicle_exp_date',
        render: (data: string) => {
            if (data === '') return '';
            return formatDate(data);
        }
    },
    {
        data: 'created_at',
        render: (data: string) => {
            return formatDate(data);
        }
    },
    {
        data: 'vehicle_status',
        render: (data: number) => {
            switch (data) {
                case 0:
                    return `<span class="badge badge-label badge-soft-secondary">Unverified</span>`;
                case 1:
                    return `<span class="badge badge-label badge-soft-success">Verified</span>`;
                case 2:
                    return `<span class="badge badge-label badge-soft-warning">Inactive</span>`;
                case 3:
                    return `<span class="badge badge-label badge-soft-danger">Deleted</span>`;
                case 4:
                    return `<span class="badge badge-label badge-soft-info">Verification</span>`;
                default:
                    return `<span class="badge badge-label badge-soft-dark">Unknown</span>`;
            }
        }
    }
];


export const vehicleTableData: TableType<VehicleInfoType> = {
    header: ['ID', 'Added By', 'Added Type', 'Name', 'Category', 'Verify Date','Exp Date', 'Created At', 'Status'],
    body: vehicleRows,
};