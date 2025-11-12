import { db } from '../config/db';
import { ApiError } from '../utils/api-error';
import { RowDataPacket, FieldPacket } from "mysql2";

// Total Booking Count Service 
export const getTotalBookingCount = async () => {
    try {
        const query = `
            SELECT 
            COUNT(manpower_order_id) AS bookingTotalCount,
            COUNT(CASE WHEN DATE(FROM_UNIXTIME(mpo_order_date)) = CURDATE() THEN 1 END) AS today_bookings,
            COUNT(CASE WHEN DATE(FROM_UNIXTIME(mpo_order_date)) = CURDATE() - INTERVAL 1 DAY THEN 1 END) AS yesterday_bookings,
            COUNT(CASE WHEN DATE(FROM_UNIXTIME(mpo_order_date)) = CURDATE() - INTERVAL 2 DAY THEN 1 END) AS day_2_bookings,
            COUNT(CASE WHEN DATE(FROM_UNIXTIME(mpo_order_date)) = CURDATE() - INTERVAL 3 DAY THEN 1 END) AS day_3_bookings,
            COUNT(CASE WHEN DATE(FROM_UNIXTIME(mpo_order_date)) = CURDATE() - INTERVAL 4 DAY THEN 1 END) AS day_4_bookings,
            COUNT(CASE WHEN DATE(FROM_UNIXTIME(mpo_order_date)) = CURDATE() - INTERVAL 5 DAY THEN 1 END) AS day_5_bookings,
            COUNT(CASE WHEN DATE(FROM_UNIXTIME(mpo_order_date)) = CURDATE() - INTERVAL 6 DAY THEN 1 END) AS day_6_bookings
            FROM manpower_order
        `;

        const [rows]: [RowDataPacket[], FieldPacket[]] = await db.query(query);

        if (rows.length === 0 || !rows) {
            throw new ApiError(404, 'Data Not Found');
        }

        return {
            bookingTotalCount: rows,
        };

    } catch (error) {
        throw new ApiError(500, "Failed To Load Total Booking Count");
    }
};

// Get Total, Cancelled and Ongoing Booking Counts Service
export const getTotalCancelOngoingBookingCounts = async () => {
    try {
        let query = `
            SELECT
            COUNT(manpower_order_id) AS total_bookings,
            COUNT(CASE WHEN mpo_status = 3 THEN 1 END) AS cancelled_bookings,
            COUNT(CASE WHEN mpo_status = 2 THEN 1 END) AS ongoing_bookings
            FROM manpower_order
        `;

        const [rows]: [RowDataPacket[], FieldPacket[]] = await db.query(query);

        if (rows.length === 0 || !rows) {
            throw new ApiError(404, 'Data Not Found');
        }

        return {
            bookingCounts: rows,
        };
    } catch (error) {
        throw new ApiError(500, "Failed To Load Booking Counts");
    }
};

// Get Total, Active and Other Status Vendor Counts Service
export const getTotalActiveOtherStatusVendorCounts = async () => {
    try {
        let query = `
            SELECT 
            COUNT(vendor_id) AS total_vendors,
            COUNT(CASE WHEN vendor_status = '0' THEN 1 END) AS active_vendors,
            COUNT(CASE WHEN vendor_status != '0' THEN 1 END) AS other_status_vendors,
            COUNT(CASE WHEN DATE(FROM_UNIXTIME(vendor_created_at)) = CURDATE() THEN 1 END) AS today_new_vendors
            FROM vendor
        `;

        const [rows]: [RowDataPacket[], FieldPacket[]] = await db.query(query);

        if (rows.length === 0 || !rows) {
            throw new ApiError(404, 'Data Not Found');
        }

        return {
            vendorCounts: rows[0],
        };

    } catch (error) {
        throw new ApiError(500, "Failed To Load Vendor Counts");
    }
};

// Get Latest 5 Vendor Transaction List Service
export const getLatest5VendorTransList = async () => {
    try {
        let query = `
            SELECT vendor.vendor_name, vendor_transection.vendor_transection_id , vendor_transection.vendor_transection_amount, vendor_transection.vendor_transection_time_unix, vendor_transection.vendor_transection_note
            FROM vendor_transection
            LEFT JOIN vendor ON vendor_transection.vendor_transection_by = vendor.vendor_id
            ORDER BY vendor_transection_id DESC
            LIMIT 5
        `;

        const [rows]: [RowDataPacket[], FieldPacket[]] = await db.query(query);

        if (rows.length === 0 || !rows) {
            throw new ApiError(404, 'Data Not Found');
        }

        return {
            vendorTransList: rows,
        };

    } catch (error) {
        throw new ApiError(500, "Failed To Load Latest 5 Vendor Transaction List");
    }
};

// Get Latest 5 Booking Transaction List Service
export const getLatest5BookingTransList = async () => {
    try {
        let query = `
            SELECT consumer.consumer_name, consumer_transection.*
            FROM consumer_transection
            LEFT JOIN consumer ON consumer_transection.consumer_transection_done_by = consumer.consumer_id
            ORDER BY consumer_transection_id DESC
            LIMIT 5
        `;

        const [rows]: [RowDataPacket[], FieldPacket[]] = await db.query(query);

        if (rows.length === 0 || !rows) {
            throw new ApiError(404, 'Data Not Found');
        }

        return {
            bookingTransList: rows,
        };

    } catch (error) {
        throw new ApiError(500, "Failed To Load Latest 5 Booking Transaction List");
    }
};

// Get Latest New Ongoing Booking Lists Service
export const getLatestNewOngoingBookingList = async () => {
    try {
        let query = ` 
            SELECT manpower_order.* , consumer.consumer_name, consumer.consumer_email_id, consumer.consumer_mobile_no
            FROM manpower_order
            LEFT JOIN consumer ON manpower_order.mpo_user_id = consumer.consumer_id
            WHERE mpo_status IN (1, 2)
        `;

        const [rows]: [RowDataPacket[], FieldPacket[]] = await db.query(query);

        if (rows.length === 0 || !rows) {
            throw new ApiError(404, 'Data Not Found');
        }

        return {
            bookingList: rows,
        };
    } catch (error) {
        throw new ApiError(500, "Failed To Load Latest New Ongoing Booking Lists");
    }
};

// GET CONSUMERS COUNT SERVICE
export const getConsumersCounts = async () => {
    try {
        const totalConsumersTodayYesterday = `
            SELECT
            SUM(CASE WHEN DATE(FROM_UNIXTIME(consumer_registred_date)) = CURDATE() THEN 1 ELSE 0 END) AS total_consumers_today,
            SUM(CASE WHEN DATE(FROM_UNIXTIME(consumer_registred_date)) = DATE_SUB(CURDATE(), INTERVAL 1 DAY) THEN 1 ELSE 0 END) AS total_consumers_yesterday
            FROM consumer
        `;

        const [totalConsumerBothCount]: [RowDataPacket[], FieldPacket[]] = await db.query(totalConsumersTodayYesterday);

        if (totalConsumerBothCount.length === 0 || !totalConsumerBothCount) {
            throw new ApiError(404, 'Data Not Found');
        }

        const allConsumerCounts = totalConsumerBothCount[0];

        return {
            consumerCounts: allConsumerCounts,
        };

    } catch (error) {
        throw new ApiError(500, "Failed To Load Consumers Counts");
    }
};

// New and Ongoing Booking List Service
export const getNewAndOngoingBookingList = async () => {
    try {
        let query = ` 
            SELECT manpower_order.* , consumer.consumer_name, consumer.consumer_email_id, consumer.consumer_mobile_no
            FROM manpower_order
            LEFT JOIN consumer ON manpower_order.mpo_user_id = consumer.consumer_id
            WHERE mpo_status IN (1, 2)
            ORDER BY manpower_order_id DESC
        `;

        const [rows]: [RowDataPacket[], FieldPacket[]] = await db.query(query);

        if (rows.length === 0) {
            throw new ApiError(404, 'No Data Found');
        }

        return {
            newAndOngoingBookings: rows,
        };

    } catch (error) {
        throw new ApiError(500, "Failed To Load New and Ongoing Bookings");
    }
};


export const getVendorTodayYesterdayCountService = async () => {
  try {
    // ✅ 1. Vendor count grouped by 3-hour intervals (Today vs Yesterday)
    const vendorCountQuery = `
      SELECT 
        FLOOR(HOUR(FROM_UNIXTIME(vendor_created_at)) / 3) * 3 AS hour_group,
        COUNT(*) AS count,
        CASE 
          WHEN DATE(FROM_UNIXTIME(vendor_created_at)) = CURDATE() THEN 'today'
          WHEN DATE(FROM_UNIXTIME(vendor_created_at)) = CURDATE() - INTERVAL 1 DAY THEN 'yesterday'
        END AS day_type
      FROM vendor
      WHERE DATE(FROM_UNIXTIME(vendor_created_at)) IN (CURDATE(), CURDATE() - INTERVAL 1 DAY)
      GROUP BY day_type, hour_group
      ORDER BY hour_group;
    `;

    // ✅ 2. Last 30 days total wallet transactions
    const last30DaysWalletQuery = `
      SELECT
          SUM(vendor_wallet) AS total_amount_last_30_days
      FROM vendor
      WHERE DATE(FROM_UNIXTIME(vendor_created_at)) >= CURDATE() - INTERVAL 30 DAY;
    `;

    // ✅ 3. Overall wallet amount (all time)
    const overallWalletQuery = `
      SELECT
          SUM(vendor_wallet) AS overall_wallet_amount
      FROM vendor;
    `;

    // ✅ 4. Last transaction date/time (most recent)
    const lastTransactionQuery = `
      SELECT
          vendor_transection_time_unix
      FROM vendor_transection
      ORDER BY vendor_transection_time_unix DESC
      LIMIT 1;
    `;

    // ✅ Execute all queries
    const [vendorRows]: any = await db.query(vendorCountQuery);
    const [last30DaysRows]: any = await db.query(last30DaysWalletQuery);
    const [overallWalletRows]: any = await db.query(overallWalletQuery);
    const [lastTransRows]: any = await db.query(lastTransactionQuery);

    // ✅ Initialize arrays for 3-hour groups
    const todayData = Array(8).fill(0);
    const yesterdayData = Array(8).fill(0);

    vendorRows.forEach((row: any) => {
      const index = row.hour_group / 3; // convert group to array index (0–7)
      if (row.day_type === "today") {
        todayData[index] = row.count;
      } else if (row.day_type === "yesterday") {
        yesterdayData[index] = row.count;
      }
    });

    // ✅ Prepare response data
    const responseData = {
      today: todayData,
      yesterday: yesterdayData,
      labels: [
        "0–3h",
        "3–6h",
        "6–9h",
        "9–12h",
        "12–15h",
        "15–18h",
        "18–21h",
        "21–24h"
      ],
      total_amount_last_30_days: last30DaysRows[0]?.total_amount_last_30_days || 0,
      overall_wallet_amount: overallWalletRows[0]?.overall_wallet_amount || 0,
      last_transaction_unix_time: lastTransRows[0]?.vendor_transection_time_unix || null
    };

    return {
      status: 200,
      message: "Vendor Today and Yesterday Counts Fetch Successful",
      jsonData: responseData
    };
  } catch (error) {
    console.error("Error fetching vendor graph data:", error);
    throw new ApiError(500, "Failed To Load Vendor Today and Yesterday Counts");
  }
};
