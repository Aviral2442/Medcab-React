import { db } from '../config/db';
import { ApiError } from '../utils/api-error';
import path from 'path';
import fs from 'fs';

// 🧩 GET CONSUMER LIST WITH FILTERS AND PAGINATION SERVICE
export const getConsumerList = async (filters?: {
    date?: string;
    status?: string;
    fromDate?: string;
    toDate?: string;
    page?: number;
    limit?: number;
}) => {
    try {
        // ✅ Pagination defaults
        const page = filters?.page && filters.page > 0 ? filters.page : 1;
        const limit = filters?.limit && filters.limit > 0 ? filters.limit : 10;
        const offset = (page - 1) * limit;

        // ✅ Extract filters + default date = "today"
        let { date, status, fromDate, toDate } = filters || {};
        if (!date) date = "today";

        // 🧮 Query builder variables
        let whereClauses: string[] = [];
        let params: any[] = [];

        // 🗓️ Date filters (based on consumer_registred_date)
        const now = new Date();
        let startTimestamp: number | null = null;
        let endTimestamp: number | null = null;

        switch (date) {
            case "today": {
                const todayStart = new Date();
                todayStart.setHours(0, 0, 0, 0);
                startTimestamp = Math.floor(todayStart.getTime() / 1000);
                endTimestamp = Math.floor(Date.now() / 1000);
                break;
            }

            case "yesterday": {
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                startTimestamp = Math.floor(new Date(yesterday.setHours(0, 0, 0, 0)).getTime() / 1000);
                endTimestamp = Math.floor(new Date(yesterday.setHours(23, 59, 59, 999)).getTime() / 1000);
                break;
            }

            case "this week": {
                const day = now.getDay();
                const diffToMonday = now.getDate() - day + (day === 0 ? -6 : 1);
                const monday = new Date(now.setDate(diffToMonday));
                startTimestamp = Math.floor(new Date(monday.setHours(0, 0, 0, 0)).getTime() / 1000);
                endTimestamp = Math.floor(Date.now() / 1000);
                break;
            }

            case "this month": {
                const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
                startTimestamp = Math.floor(firstDay.getTime() / 1000);
                endTimestamp = Math.floor(Date.now() / 1000);
                break;
            }

            case "custom": {
                if (fromDate && toDate) {
                    startTimestamp = Math.floor(new Date(fromDate).getTime() / 1000);
                    endTimestamp = Math.floor(new Date(toDate).getTime() / 1000);
                }
                break;
            }
        }

        // ✅ Apply date filter
        if (startTimestamp && endTimestamp) {
            whereClauses.push("consumer_registred_date BETWEEN ? AND ?");
            params.push(startTimestamp, endTimestamp);
        }

        // 🔘 Status filter
        if (status) {
            if (status === "newUser") {
                whereClauses.push("consumer_status = 0");
            } else if (status === "active") {
                whereClauses.push("consumer_status = 1");
            } else if (status === "inactive") {
                whereClauses.push("consumer_status = 2");
            }
        }

        // 🏗️ Build final WHERE clause
        const whereSQL = whereClauses.length ? `WHERE ${whereClauses.join(" AND ")}` : "";

        // ⚡ Main Query
        const query = `
            SELECT 
                consumer_id,
                consumer_name,
                consumer_mobile_no,
                consumer_email_id,
                consumer_wallet_amount,
                consumer_city_id,
                consumer_status,
                consumer_registred_date
            FROM consumer
            ${whereSQL}
            ORDER BY consumer_id DESC
            LIMIT ? OFFSET ?
        `;

        params.push(limit, offset);

        // 🧠 Execute data query
        const [rows]: any = await db.query(query, params);

        // 🔢 Get total count (for pagination)
        // console.log(rows);
        const countParams = whereClauses.length ? params.slice(0, -2) : [];
        const [countRows]: any = await db.query(
            `SELECT COUNT(*) as total FROM consumer ${whereSQL}`,
            countParams
        );

        const total = countRows[0]?.total || 0;

        // ✅ Final response
        return {
            status: 200,
            message: "Consumer list fetched successfully",
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
            data: rows,
        };

    } catch (error) {
        console.error("❌ Error in getConsumerList:", error);
        throw new ApiError(500, "Failed to fetch consumer list");
    }
};

// 🧩 GET CONSUMER DETAIL SERVICE
export const consumerDetailService = async (
    consumerId: number
) => {

    try {

        const query = `
            SELECT 
            consumer_id,consumer_mobile_no,consumer_name,consumer_wallet_amount,consumer_email_id, consumer_registred_date, consumer_my_referal_code, consumer_refered_by, consumer_city_id, consumer_status
            FROM consumer
            WHERE consumer_id = ?
        `;

        const [rows]: any = await db.query(query, [consumerId]);

        if (rows.length === 0) {
            throw new ApiError(404, "Consumer not found");
        }

        return {
            status: 200,
            message: "Consumer details fetched successfully",
            jsonData: rows[0],
        };

    } catch (error) {
        console.error("❌ Error in consumerDetailService:", error);
        throw new ApiError(500, "Failed to fetch consumer details");
    }

};

// 🧩 GET CONSUMER TRANSACTION LIST SERVICE
export const getConsumerTransactionList = async (consumerId: number) => {
    try {
        const query = `
            SELECT 
            consumer.consumer_name,
            consumer.consumer_mobile_no,
            consumer_transection.consumer_transection_id,
            consumer_transection.consumer_transection_amount,
            consumer_transection.consumer_transection_payment_id,
            consumer_transection.consumer_transection_note,
            consumer_transection.consumer_transection_time,
            consumer_transection.consumer_transection_type_cr_db,
            consumer_transection.consumer_transection_order_id,
            consumer_transection.consumer_transection_flow,
            consumer_transection.consumer_transection_previous_amount,
            consumer_transection.consumer_transection_new_amount,
            consumer_transection.consumer_transection_status
            FROM consumer_transection
            LEFT JOIN consumer ON consumer.consumer_id = consumer_transection.consumer_transection_done_by
            WHERE consumer_transection.consumer_transection_done_by = ?
            ORDER BY consumer_transection.consumer_transection_id DESC
        `;

        const [rows]: any = await db.query(query, [consumerId]);

        if (!rows) {
            return {
                status: 200,
                message: "No transactions found for this consumer",
            }
        } else {
            return {
                status: 200,
                message: "Consumer transactions fetched successfully",
                data: rows,
            }
        }
    } catch (error) {
        console.error("❌ Error in getConsumerTransactionList:", error);
        throw new ApiError(500, "Failed to fetch consumer transactions");
    }
}

// 🧩 GET CONSUMER MANPOWER ORDERS LIST SERVICE
export const getConsumerManpowerOrdersList = async (consumerId: number) => {
    try {

        const query = `
        SELECT 
        manpower_order.mpo_order_date,
        manpower_order.mpo_final_price,
        manpower_order.mpo_transection_id,
        manpower_order.mpo_vendor_id,
        manpower_order_details.mpod_product_id,
        manpower_order_details.mpod_price,
        manpower_order_details.mpod_period_type,
        manpower_order_details.mpod_product_quantity,
        manpower_order_details.mpod_from_date,
        manpower_order_details.mpod_till_date,
        manpower_order_details.mpod_vendor_id,
        manpower_order_details.mpod_verify_otp,
        manpower_order_details.mpod_status
        FROM manpower_order
        LEFT JOIN manpower_order_details ON manpower_order.manpower_order_id = manpower_order_details.mpod_order_id
        WHERE manpower_order.mpo_user_id = ?
        ORDER BY manpower_order.manpower_order_id DESC
        `;

        const [rows]: any = await db.query(query, [consumerId]);

        if (!rows) {
            return {
                status: 200,
                message: "No manpower orders found for this consumer",
            }
        } else {
            return {
                status: 200,
                message: "Consumer manpower orders fetched successfully",
                data: rows,
            }
        }

    } catch (error) {
        console.error("❌ Error in getConsumerManpowerOrdersList:", error);
        throw new ApiError(500, "Failed to fetch consumer manpower orders");
    }
}

// 🧩 GET CONSUMER AMBULANCE BOOKINGS LIST SERVICE
export const getConsumerAmbulanceBookingsList = async (consumerId: number) => {

    try {

        const query = `
        SELECT 
        consumer.consumer_name,
        booking_view.booking_source,
        booking_view.booking_type,
        booking_view.booking_category,
        booking_view.booking_schedule_time,
        booking_view.booking_pickup,
        booking_view.booking_drop,
        booking_view.booking_amount,
        booking_view.booking_distance,
        booking_view.booking_duration,
        booking_view.bookingStatus
        FROM booking_view
        LEFT JOIN consumer ON consumer.consumer_id = booking_view.booking_by_cid
        WHERE booking_view.booking_by_cid = ?
        ORDER BY booking_view.booking_id DESC
        `;

        const [consumer_ambulance_booking]: any = await db.query(query, [consumerId]);

        if (!consumer_ambulance_booking) {
            return {
                status: 200,
                message: "No ambulance bookings found for this consumer",
            }
        } else {
            return {
                status: 200,
                message: "Consumer ambulance bookings fetched successfully",
                jsonData: consumer_ambulance_booking,
            }
        }

    } catch (error) {
        console.error("❌ Error in getConsumerAmbulanceBookingsList:", error);
        throw new ApiError(500, "Failed to fetch consumer ambulance bookings");
    }

}

// 🧩 GET CONSUMER LAB BOOKINGS LIST SERVICE
export const getConsumerLabBookingsList = async (consumerId: number) => {

    try {

        const query = `
            SELECT * FROM booking_view
        `;

        const [consumer_lab_booking]: any = await db.query(query, [consumerId]);

        if (!consumer_lab_booking) {
            return {
                status: 200,
                message: "No lab bookings found for this consumer",
            }
        } else {
            return {
                status: 200,
                message: "Consumer lab bookings fetched successfully",
                jsonData: consumer_lab_booking,
            }
        }

    } catch (error) {
        console.error("❌ Error in getConsumerLabBookingsList:", error);
        throw new ApiError(500, "Failed to fetch consumer lab bookings");
    }

};