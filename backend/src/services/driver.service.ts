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
        const limit = filters?.limit && filters.limit > 0 ? filters.limit : 10;
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