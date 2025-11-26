import { db } from "../config/db";
import { ApiError } from "../utils/api-error";
import { buildFilters } from "../utils/filters";
import { RowDataPacket, FieldPacket } from "mysql2";

// GET ALL BOOKINGS LISTS 
export const getAllBookings = async (filters?: {
    date?: string;
    fromDate?: string;
    toDate?: string;
    status?: string;
    page?: number;
    limit?: number;
}) => {
    try {
        const page = filters?.page && filters.page > 0 ? filters.page : 1;
        const limit = filters?.limit && filters.limit > 0 ? filters.limit : 10;
        const offset = (page - 1) * limit;

        const { whereSQL, params } = buildFilters({
            ...filters,
            dateColumn: "manpower_order.mpo_order_date",
        });

        let finalWhereSQL = whereSQL;

        if (filters?.status) {
            finalWhereSQL += finalWhereSQL
                ? ` AND manpower_order.mpo_status = ?`
                : `WHERE manpower_order.mpo_status = ?`;
            params.push(filters.status);
        }

        const query = `
      SELECT 
        manpower_order.manpower_order_id,
        user_address.ua_address,
        manpower_order.mpo_order_date,
        manpower_order.mpo_created_at,
        manpower_order.mpo_final_price,
        manpower_order.mpo_payment_mode,
        manpower_order.mpo_status,
        consumer.consumer_name,
        consumer.consumer_mobile_no,
        vendor.vendor_name,
        vendor.vendor_mobile,
        (
            SELECT remark_text 
            FROM remark_data 
            WHERE remark_manpower_order_id = manpower_order.manpower_order_id 
            ORDER BY remark_id DESC 
            LIMIT 1
        ) AS remark_text
      FROM manpower_order
      LEFT JOIN consumer ON manpower_order.mpo_user_id = consumer.consumer_id
      LEFT JOIN vendor ON manpower_order.mpo_vendor_id = vendor.vendor_id
      LEFT JOIN user_address ON manpower_order.mpo_address_id = user_address.ua_id
      ${finalWhereSQL}
      ORDER BY manpower_order.mpo_order_date DESC
      LIMIT ? OFFSET ?
    `;

        const queryParams = [...params, limit, offset];
        const [rows]: any = await db.query(query, queryParams);

        // --- Count Query ---
        const [countRows]: any = await db.query(
            `SELECT COUNT(*) AS total FROM manpower_order ${finalWhereSQL}`,
            params
        );

        const total = countRows[0]?.total || 0;

        return {
            status: 200,
            message: "Bookings fetched successfully",
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
            jsonData: {
                bookingsLists: rows || []
            },
        };
    } catch (error) {
        console.error("❌ Error fetching bookings:", error);
        throw new ApiError(500, "Failed to fetch bookings");
    }
};

// BOOKING DETAIL BY ID
export const getBookingDetailById = async (bookingId: number) => {
    try {

        const query = `
            SELECT manpower_order.*, consumer.*, manpower_order_details.*, user_address.ua_address, manpower_sub_category.mpsc_name
            FROM manpower_order 
            LEFT JOIN manpower_order_details ON manpower_order.manpower_order_id = manpower_order_details.mpod_order_id
            LEFT JOIN consumer ON manpower_order.mpo_user_id = consumer.consumer_id
            LEFT JOIN user_address ON manpower_order.mpo_address_id = user_address.ua_id
            LEFT JOIN manpower_sub_category ON manpower_order_details.mpod_product_id = manpower_sub_category.mp_sub_category_id
            WHERE manpower_order_id = ? 
            ORDER BY mpo_created_at DESC
        `;

        const [rows]: [RowDataPacket[], FieldPacket[]] = await db.query(query, [bookingId]);  // Added typing

        if (rows.length === 0 || !rows) {
            throw new ApiError(404, "Booking not found");
        }

        return {
            booking: rows,
        };

    } catch (error) {
        throw new ApiError(500, "Failed to fetch booking detail");
    }
}

// Booking Transaction List by Booking ID
export const getBookingTransactionListById = async (bookingId: number) => {
    try {

        const query = `
            SELECT 
            consumer_transection.consumer_transection_id,
            consumer_transection.consumer_transection_order_id,
            consumer_transection.consumer_transection_payment_id,
            consumer_transection.consumer_transection_type_cr_db,
            consumer_transection.consumer_transection_flow,
            consumer_transection.consumer_transection_amount,
            consumer_transection.consumer_transection_previous_amount,
            consumer_transection.consumer_transection_new_amount,
            consumer_transection.consumer_transection_done_by,
            consumer_transection.consumer_transection_status,
            consumer_transection.consumer_transection_note,
            consumer_transection.consumer_transection_time
            FROM manpower_order
            LEFT JOIN consumer_transection ON manpower_order.mpo_transection_id = consumer_transection.consumer_transection_id
            WHERE manpower_order.manpower_order_id = ?
            ORDER BY consumer_transection.consumer_transection_id DESC
        `;

        const [rows]: [RowDataPacket[], FieldPacket[]] = await db.query(query, [bookingId]);  // Added typing

        if (rows.length === 0 || !rows) {
            throw new ApiError(404, "No transactions found");
        }

        return {
            transactions: rows,
        };
    } catch (error) {
        throw new ApiError(500, "Failed to fetch booking transactions");
    }
}

// BOOKING PICKUP CITY VENDOR LIST BY BOOKING ID
export const getBookingPickUpCityVendorListById = async (bookingId: number) => {
    try {
        const query = `
            SELECT vendor.vendor_id, vendor.vendor_name, vendor.vendor_mobile
            FROM manpower_order
            LEFT JOIN user_address ON manpower_order.mpo_address_id = user_address.ua_user_id
            LEFT JOIN city ON user_address.ua_city_name = city.city_name
            LEFT JOIN vendor_address ON city.city_id = vendor_address.vendor_address_city_id
            LEFT JOIN vendor ON vendor_address.vendor_address_id = vendor.vendor_address_details_id
            WHERE manpower_order.manpower_order_id = ?
            ORDER BY vendor.vendor_id DESC
        `;

        const [rows]: [RowDataPacket[], FieldPacket[]] = await db.query(query, [bookingId]);  // Added typing

        if (rows.length === 0 || !rows) {
            throw new ApiError(404, "No vendors found");
        }

        return {
            vendors: rows,
        };

    } catch (error) {
        throw new ApiError(500, "Failed to fetch pickup city vendors");
    }
}

// BOOKING REJECT LIST BY BOOKING ID
export const getBookingRejectListById = async (bookingId: number) => {
    try {

        const query = `
            SELECT vendor.vendor_id, vendor.vendor_name, vendor.vendor_mobile
            FROM manpower_order 
            LEFT JOIN vendor_reject_order ON manpower_order.manpower_order_id = vendor_reject_order.vro_order_id
            LEFT JOIN vendor ON vendor_reject_order.vro_vendor_id = vendor.vendor_id
            WHERE manpower_order.manpower_order_id = ?
            ORDER BY vendor_reject_order.vro_id DESC
         `;

        const [rows]: [RowDataPacket[], FieldPacket[]] = await db.query(query, [bookingId]);  // Added typing

        if (rows.length === 0 || !rows || rows == null) {
            throw new ApiError(404, "No rejects found");
        }

        return {
            rejects: rows,
        }

    } catch (error) {
        throw new ApiError(500, "Failed to fetch booking rejects");
    }
}

// BOOKING ACCEPT LIST BY BOOKING ID
export const getBookingAcceptListById = async (bookingId: number) => {
    try {

        const query = `
            SELECT vendor.vendor_id, vendor.vendor_name, vendor.vendor_mobile
            FROM manpower_order
            LEFT JOIN manpower_order_details ON manpower_order.manpower_order_id = manpower_order_details.mpod_order_id
            LEFT JOIN vendor ON manpower_order_details.mpod_vendor_id = vendor.vendor_id
            WHERE manpower_order.manpower_order_id = ?
            ORDER BY vendor.vendor_id DESC
        `;

        const [rows]: [RowDataPacket[], FieldPacket[]] = await db.query(query, [bookingId]);  // Added typing

        if (rows.length === 0 || !rows) {
            throw new ApiError(404, "No accepts found");
        }

        return {
            accept: rows,
        }

    } catch (error) {
        throw new ApiError(500, "Failed to fetch booking accepts");
    }
}

// INSERT BOOKING REMARKS BY BOOKING ID 
export const insertBookingRemarksById = async (bookingId: number, remarkType: string, remarks: string) => {

    try {
        let query = `
            INSERT INTO manpower_order_remarks (mpo_remark_order_id, mpo_remark_text, mpo_remark_createdAt)
            VALUES (?, ?, ?)
        `;

        const currentTimestamp = Math.floor(Date.now() / 1000);

        if (!remarks || remarks.trim() === "") {
            throw new ApiError(400, "Remarks cannot be empty");
        }
        if (isNaN(bookingId)) {
            throw new ApiError(400, "Invalid booking ID");
        }

        const params = [bookingId, remarks, currentTimestamp];

        const [result]: any = await db.query(query, params);  // Added typing for OkPacket

        if (result.affectedRows > 0) {  // Improved check for successful insert
            return {
                status: 200,
                message: "Remark inserted successfully",
            };
        }
    } catch (error) {
        throw new ApiError(500, "Failed to insert booking remarks");
    }

};

// UPDATE BOOKING DATA BY BOOKING ID
export const updateBookingDataById = async (manpower_order_id: number, updates: any) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // Fields in manpower_order table
        const manpowerOrderFields = [
            "mpo_user_id",
            "mpo_order_date",
            "mpo_address_id",
            "mpo_gst_percentage",
            "mpo_gst_amount",
            "mpo_coupon_discount",
            "mpo_health_card_discount",
            "mpo_health_card_charges",
            "mpo_final_price",
            "mpo_transection_id",
            "mpo_bank_ref_no",
            "mpo_payment_mode",
            "mpo_payment_mobile",
            "mpo_transfer_amount",
            "mpo_payment_type",
            "mpo_vendor_id",
            "mpo_vendor_name",
            "mpo_vendor_mobile",
            "mpo_vender_picture",
            "mpo_otp",
            "mpo_status",
        ];

        // Fields in manpower_order_details table
        const manpowerOrderDetailsFields = [
            "mpod_order_id",
            "mpod_product_id",
            "mpod_price",
            "mpod_offer_amount",
            "mpod_tax",
            "mpod_company_charge",
            "mpod_period_type",
            "mpod_product_quantity",
            "mpod_period_duration",
            "mpod_from_date",
            "mpod_till_date",
            "mpod_vendor_id",
            "mpod_vendor_name",
            "mpod_vendor_number",
            "mpod_assign_time",
            "mpod_verify_otp",
            "mpod_status",
            "mpod_instruction",
        ];

        // Separate updates by table
        const manpowerOrderData: Record<string, any> = {};
        const manpowerOrderDetailsData: Record<string, any> = {};

        for (const key in updates) {
            if (manpowerOrderFields.includes(key)) {
                manpowerOrderData[key] = updates[key];
            } else if (manpowerOrderDetailsFields.includes(key)) {
                manpowerOrderDetailsData[key] = updates[key];
            }
        }

        // Update manpower_order
        if (Object.keys(manpowerOrderData).length > 0) {
            const setClause = Object.keys(manpowerOrderData)
                .map((key) => `${key} = ?`)
                .join(", ");
            const values = Object.values(manpowerOrderData);

            const query = `
        UPDATE manpower_order
        SET ${setClause}
        WHERE manpower_order_id = ?
      `;
            await connection.query(query, [...values, manpower_order_id]);
        }

        // Update manpower_order_details
        if (Object.keys(manpowerOrderDetailsData).length > 0) {
            const mpod_id = updates.mpod_id;
            if (!mpod_id) throw new ApiError(400, "mpod_id is required to update manpower_order_details");

            const setClause = Object.keys(manpowerOrderDetailsData)
                .map((key) => `${key} = ?`)
                .join(", ");
            const values = Object.values(manpowerOrderDetailsData);

            const query = `
        UPDATE manpower_order_details
        SET ${setClause}
        WHERE mpod_id = ?
      `;
            await connection.query(query, [...values, mpod_id]);
        }

        await connection.commit();
        return { updatedFields: updates };
    } catch (error) {
        await connection.rollback();
        console.error("❌ Error in updateBookingDataById:", error);
        throw new ApiError(500, "Failed to update booking");
    } finally {
        connection.release();
    }
};