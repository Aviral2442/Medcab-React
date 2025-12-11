import { db } from "../config/db";
import { ApiError } from "../utils/api-error";
import { RowDataPacket, FieldPacket } from "mysql2";
import { buildFilters } from "../utils/filters";

// Get Consumer Transaction List with Filters and Pagination
export const getConsumerTransactionList = async (filters?: {
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

        // Date Filters
        const { whereSQL, params } = buildFilters({
            ...filters,
            dateColumn: "consumer_transection.consumer_transection_time"
        });

        let finalWhereSQL = whereSQL;

        // Status Filter
        if (filters?.status) {
            const statusConditionMap: Record<string, string> = {
                default: "consumer_transection.consumer_transection_status = 0",
                pending: "consumer_transection.consumer_transection_status = 1",
                completed: "consumer_transection.consumer_transection_status = 2",
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

        const query = `
            SELECT consumer_transection.*,
            consumer.consumer_name, 
            consumer.consumer_mobile_no
            FROM consumer_transection 
            LEFT JOIN consumer ON consumer_transection.consumer_transection_done_by = consumer.consumer_id
            ${finalWhereSQL}
            ORDER BY consumer_transection.consumer_transection_id DESC
            LIMIT ? OFFSET ?
        `;

        const queryParams = [...params, limit, offset];
        const [rows]: any = await db.query(query, queryParams);

        // Count Query
        const [countRows]: any = await db.query(
            `SELECT COUNT(*) AS total FROM consumer_transection ${finalWhereSQL}`,
            params
        );

        const total = countRows[0]?.total || 0;
        const totalPages = Math.ceil(total / limit);

        return {
            status: 200,
            message: "Consumer Transactions List Fetch Successful",
            pagination: {
                page,
                limit,
                total,
                totalPages,
            },
            jsonData: {
                consumerTransactions: rows,
            },
        };
    } catch (error) {
        console.error(error);
        throw new ApiError(500, "Failed to fetch consumer transaction list");
    }
};

// Get Vendor Transaction List with Filters and Pagination
export const getVendorTransactionList = async (filters?: {
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

        // Date Filters
        const { whereSQL, params } = buildFilters({
            ...filters,
            dateColumn: "vendor_transection.vendor_transection_time_unix"
        });

        let finalWhereSQL = whereSQL;

        // Status Filter
        if (filters?.status) {
            const statusConditionMap: Record<string, string> = {
                default: "vendor_transection.vendor_transection_status = 0",
                pending: "vendor_transection.vendor_transection_status = 1",
                completed: "vendor_transection.vendor_transection_status = 2",
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

        const query = `
            SELECT vendor_transection.*, vendor.vendor_name, vendor.vendor_mobile
            FROM vendor_transection 
            LEFT JOIN vendor ON vendor_transection.vendor_transection_by = vendor.vendor_id
            ${finalWhereSQL}
            ORDER BY vendor_transection.vendor_transection_id DESC
            LIMIT ? OFFSET ?
        `;

        const queryParams = [...params, limit, offset];
        const [rows]: any = await db.query(query, queryParams);

        // Count Query
        const [countRows]: any = await db.query(
            `SELECT COUNT(*) AS total FROM vendor_transection ${finalWhereSQL}`,
            params
        );

        const total = countRows[0]?.total || 0;
        const totalPages = Math.ceil(total / limit);

        return {
            status: 200,
            message: "Vendor Transactions List Fetch Successful",
            pagination: {
                page,
                limit,
                total,
                totalPages,
            },
            jsonData: {
                vendorTransactions: rows,
            },
        };
    } catch (error) {
        console.error(error);
        throw new ApiError(500, "Failed to fetch vendor transaction list");
    }
};

// Get Vendor Transaction Data
export const vendorTransDataService = async (vendorId: number) => {

    try {

        const checkVendorExist = `
            SELECT vendor_transection FROM vendor WHERE vendor_transection_by = ?;
        `;

        if(!checkVendorExist){
            throw new ApiError(404, "Vendor not found");
        }

        const [rows]: any = await db.query(
            `
            SELECT vendor_transection.*, vendor.vendor_name, vendor.vendor_mobile
            FROM vendor_transection
            LEFT JOIN vendor 
                ON vendor_transection.vendor_transection_by_type = 0 
                AND vendor_transection.vendor_transection_by = vendor.vendor_id
            WHERE vendor_transection.vendor_transection_by = ?
            ORDER BY vendor_transection.vendor_transection_id DESC;
            `,
            [vendorId]
        );

        if (rows.length === 0 || !rows) {
            throw new ApiError(404, "No vendor transactions found for the given vendor ID");
        }

        return {
            status: 200,
            message: "Vendor Transaction Data Fetch Successful",
            jsonData: {
                vendorTransactions: rows
            }
        };
    } catch (error) {
        throw new ApiError(500, "Failed to fetch vendor transaction data");
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
        const limit = filters?.limit && filters.limit > 0 ? filters.limit : 10;
        const offset = (page - 1) * limit;

        // Date Filters
        const { whereSQL, params } = buildFilters({
            ...filters,
            dateColumn: "driver_transection.driver_transection_time_unix"
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
