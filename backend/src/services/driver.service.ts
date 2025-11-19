import { db } from '../config/db';
import { ApiError } from '../utils/api-error';
import { buildFilters } from '../utils/filters';

// Get Driver List
export const getDriverService = async (filters: {
    date?: string;
    status?: string;
    fromDate?: string;
    toDate?: string;
    page?: number;
    limit?: number;
}) => {

    try {

        const page = filters?.page && filters.page > 0 ? filters.page : 1;
        const limit = filters?.limit && filters.limit > 0 ? filters.limit : 100;
        const offset = (page - 1) * limit;

        const { whereSQL, params } = buildFilters({ ...filters, dateColumn: 'created_at' });

        let finalWhereSQL = whereSQL;

        if (filters?.status) {
            const statusConsitionMap: Record<string, string> = {
                new: "driver_status = 0",
                active: "driver_status = 1",
                inActive: "driver_status = 2",
                delete: "driver_status = 3",
                verification: "driver_status = 4",
            };

            const condition = statusConsitionMap[filters.status];

            if (condition) {
                if (/where\s+/i.test(finalWhereSQL)) {
                    finalWhereSQL += ` AND ${condition}`;
                } else {
                    finalWhereSQL = `WHERE ${condition}`;
                }
            }
        }

        const query = `

            SELECT 
                driver_id,
                driver_name,
                driver_last_name,
                driver_mobile,
                driver_wallet_amount,
                driver_city_id,
                driver_created_by, /* 0 for Self 1 for Partner */
                driver_profile_img,
                driver_registration_step,
                driver_duty_status,
                driver_status,
                driver_duty_status,
                created_at
            FROM driver
            ${finalWhereSQL}
            ORDER BY driver_id DESC
            LIMIT ? OFFSET ?;
        `;

        const queryParams = [...params, limit, offset];
        const [rows]: any = await db.query(query, queryParams);

        const [countRows]: any = await db.query(
            `
            SELECT COUNT(*) as total
            FROM driver
            ${finalWhereSQL}
            `, params
        );

        const totalData = countRows[0]?.total || 0;
        const totalPages = Math.ceil(totalData / limit);

        return {
            status: 200,
            message: 'Drivers List Fetch Successful',
            paginations: {
                page,
                limit,
                total: totalData,
                totalPages
            },
            jsonData: {
                drivers: rows
            }
        };

    } catch (error) {
        console.error(error);
        throw new ApiError(500, 'Failed to retrieve drivers services');
    }

};

// Get Driver Detail
export const driverDetailService = async (driverId: number) => {

    try {

        const [rows]: any = await db.query(
            `
            SELECT 
            driver.*, vehicle.v_vehicle_name, vehicle.vehicle_rc_number, vehicle.vehicle_category_type, city.city_name,
            partner.partner_f_name, partner.partner_l_name, partner.partner_mobile
            FROM driver 
            LEFT JOIN vehicle ON driver.driver_assigned_vehicle_id = vehicle.vehicle_id
            LEFT JOIN city ON driver.driver_city_id = city.city_id
            LEFT JOIN partner ON driver.driver_created_by > 0 AND driver.driver_created_partner_id = partner.partner_id
            WHERE driver.driver_id = ?
            `, [driverId]
        );

        if (rows.length === 0) {
            throw new ApiError(404, 'Driver not found');
        }

        return {
            status: 200,
            message: 'Driver Detail Fetch Successful',
            jsonData: {
                driver: rows[0]
            }
        };

    } catch (error) {
        console.error(error);
        throw new ApiError(500, 'Failed to retrieve driver details service');
    }

};

// Get Driver On Off Data
export const driverOnOffDataService = async (filters: {
    date?: string;
    status?: string;
    fromDate?: string;
    toDate?: string;
    page?: number;
    limit?: number;
}) => {

    try {

        const page = filters?.page && filters.page > 0 ? filters.page : 1;
        const limit = filters?.limit && filters.limit > 0 ? filters.limit : 100;
        const offset = (page - 1) * limit;

        const { whereSQL, params } = buildFilters({ ...filters, dateColumn: 'driver_on_off_data.dood_time_unix' });

        let finalWhereSQL = whereSQL;

        if (filters?.status) {
            const statusConsitionMap: Record<string, string> = {
                on: "driver_on_off_data.dood_status = ON",
                off: "driver_on_off_data.dood_status = OFF",
            };

            const condition = statusConsitionMap[filters.status];

            if (condition) {
                if (/where\s+/i.test(finalWhereSQL)) {
                    finalWhereSQL += ` AND ${condition}`;
                } else {
                    finalWhereSQL = `WHERE ${condition}`;
                }
            }
        }

        const query = `

            SELECT 
                driver_on_off_data.*,
                driver.driver_name,
                driver.driver_mobile,
                vehicle.v_vehicle_name,
                vehicle.vehicle_rc_number
            FROM driver_on_off_data
            LEFT JOIN driver ON driver_on_off_data.dood_by_did = driver.driver_id
            LEFT JOIN vehicle ON driver_on_off_data.dood_vehicle_id = vehicle.vehicle_id
            ${finalWhereSQL}
            ORDER BY driver_on_off_data.dood_id DESC
            LIMIT ? OFFSET ?;
        `;

        const queryParams = [...params, limit, offset];
        const [rows]: any = await db.query(query, queryParams);

        const [countRows]: any = await db.query(
            `
            SELECT COUNT(*) as total
            FROM driver_on_off_data
            ${finalWhereSQL}
            `, params
        );

        const totalData = countRows[0]?.total || 0;
        const totalPages = Math.ceil(totalData / limit);

        return {
            status: 200,
            message: 'Drivers On Off Data Fetch Successful',
            paginations: {
                page,
                limit,
                total: totalData,
                totalPages
            },
            jsonData: {
                driverOnOffData: rows
            }
        };

    } catch (error) {
        console.error(error);
        throw new ApiError(500, 'Failed to retrieve drivers on off data service');
    }

};

// Get Driver On Off Map Location
export const driverOnOffMapLocationService = async (driverOnOffId: number) => {
    try {

        const [rows]: any = await db.query(
            `SELECT driver_on_off_data.dood_by_did, driver_on_off_data.dood_lat, driver_on_off_data.dood_long, driver_on_off_data.dood_status, driver_on_off_data.dood_time_unix, driver.driver_name, driver.driver_mobile
            FROM driver_on_off_data
            JOIN driver ON driver_on_off_data.dood_by_did = driver.driver_id
            WHERE dood_id = ?`, [driverOnOffId]
        );

        if (rows.length === 0) {
            throw new ApiError(404, 'Driver On Off Map Location not found');
        }

        return {
            status: 200,
            message: 'Driver On Off Map Location Fetch Successful',
            jsonData: {
                driverOnOffMapLocation: rows[0]
            }
        };

    } catch (error) {
        throw new ApiError(500, 'Failed to retrieve driver on off map location service');
    }
}