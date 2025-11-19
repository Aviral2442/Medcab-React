import { db } from "../config/db";
import { ApiError } from "../utils/api-error";
import { RowDataPacket, FieldPacket } from "mysql2";
import { buildFilters } from "../utils/filters";

// Get Consumer Transaction List
export const getConsumerTransactionList = async () => {
    try {
        const query = `
            SELECT consumer_transection.*
            FROM consumer_transection 
            ORDER BY consumer_transection.consumer_transection_id DESC        
        `;

        const [rows]: [RowDataPacket[], FieldPacket[]] = await db.query(query);

        if (rows.length === 0 || !rows) {
            throw new ApiError(404, "No consumer transactions found");
        }

        return {
            transactions: rows,
        };
    } catch (error) {
        throw new ApiError(500, "Failed to fetch consumer transaction list");
    }
};

// Get Vendor Transaction List
export const getVendorTransactionList = async () => {
    try {
        const query = `
            SELECT vendor_transection.*
            FROM vendor_transection 
            ORDER BY vendor_transection.vendor_transection_id DESC        
        `;

        const [rows]: [RowDataPacket[], FieldPacket[]] = await db.query(query);

        if (rows.length === 0 || !rows) {
            throw new ApiError(404, "No vendor transactions found");
        }

        return {
            transactions: rows,
        };
    } catch (error) {
        throw new ApiError(500, "Failed to fetch vendor transaction list");
    }
};

// Get Driver Transaction List
export const getDriverTransactionListService = async (filters: {
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

        // Date Filters
        const { whereSQL, params } = buildFilters({
            ...filters,
            dateColumn: "driver_transection.created_at"
        });

        let finalWhereSQL = whereSQL;

        // Status Filter
        if (filters?.status) {
            const statusConditionMap: Record<string, string> = {
                default: "driver_transection.driver_transection_status = 0",
                pendingWithDrawalReq: "driver_transection.driver_transection_status = 1",
                refunded: "driver_transection.driver_transection_status = 2",
            };

            const condition = statusConditionMap[filters.status];

            if (condition) {
                if (/where\s+/i.test(finalWhereSQL)) {
                    finalWhereSQL += ` AND ${condition}`;
                } else {
                    finalWhereSQL = `WHERE ${condition}`;
                }
            }
        }


        // MAIN DATA QUERY
        const query = `
            SELECT 
                driver_transection.*,

                -- Unified ID
                CASE 
                    WHEN driver_transection.driver_transection_by_type = 0 THEN driver.driver_id
                    WHEN driver_transection.driver_transection_by_type = 1 THEN partner.partner_id
                    WHEN driver_transection.driver_transection_by_type = 3 THEN consumer.consumer_id
                    ELSE NULL
                END AS trans_by_id,

                -- Unified Name
                CASE 
                    WHEN driver_transection.driver_transection_by_type = 0 THEN driver.driver_name
                    WHEN driver_transection.driver_transection_by_type = 1 THEN partner.partner_f_name
                    WHEN driver_transection.driver_transection_by_type = 3 THEN consumer.consumer_name
                    ELSE NULL
                END AS trans_by_name,

                -- Unified Mobile
                CASE 
                    WHEN driver_transection.driver_transection_by_type = 0 THEN driver.driver_mobile
                    WHEN driver_transection.driver_transection_by_type = 1 THEN partner.partner_mobile
                    WHEN driver_transection.driver_transection_by_type = 3 THEN consumer.consumer_mobile_no
                    ELSE NULL
                END AS trans_by_mobile

            FROM driver_transection

            LEFT JOIN driver 
                ON driver_transection.driver_transection_by_type = 0 
                AND driver_transection.driver_transection_by = driver.driver_id

            LEFT JOIN partner 
                ON driver_transection.driver_transection_by_type = 1 
                AND driver_transection.driver_transection_by = partner.partner_id

            LEFT JOIN consumer 
                ON driver_transection.driver_transection_by_type = 3 
                AND driver_transection.driver_transection_by = consumer.consumer_id

            ${finalWhereSQL}

            ORDER BY driver_transection.driver_transection_id DESC
            LIMIT ? OFFSET ?;
        `;

        const queryParams = [...params, limit, offset];
        const [rows]: any = await db.query(query, queryParams);


        // COUNT QUERY
        const [countRows]: any = await db.query(
            `
            SELECT COUNT(*) AS total
            FROM driver_transection
            ${finalWhereSQL}
            `,
            params
        );

        const totalData = countRows[0]?.total || 0;
        const totalPages = Math.ceil(totalData / limit);


        // RESPONSE
        return {
            status: 200,
            message: "Driver Transactions List Fetch Successful",
            paginations: {
                page,
                limit,
                total: totalData,
                totalPages,
            },
            jsonData: {
                driverTransactions: rows,
            },
        };

    } catch (error) {
        console.error(error);
        throw new ApiError(500, "Failed to retrieve driver transactions");
    }

};

// Get Driver Transaction Data
export const driverTransDataService = async (driverId: number) => {

    try {

        const [rows]: any = await db.query(
            `
            SELECT 
                driver_transection.*,
                driver.driver_name, driver.driver_mobile 
            FROM driver_transection
            LEFT JOIN driver 
                ON driver_transection.driver_transection_by_type = 0 
                AND driver_transection.driver_transection_by = driver.driver_id
            WHERE driver_transection.driver_transection_by_type = 0
            AND driver_transection.driver_transection_by = ?
            ORDER BY driver_transection.driver_transection_id DESC;
            `, [driverId]
        );

        return {
            status: 200,
            message: 'Driver Transaction Data Fetch Successful',
            jsonData: {
                driverTransactions: rows
            }
        };

    } catch (error) {
        throw new ApiError(500, 'Failed to retrieve driver transaction data');
    }

};
