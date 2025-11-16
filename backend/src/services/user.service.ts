import { db } from "../config/db";
import { ApiError } from "../utils/api-error";
import { buildFilters } from "../utils/filters";

export const getAllUsers = async (): Promise<any[]> => {
  const [rows] = await db.query("SELECT id, username, email FROM users");
  return rows as any[];
};

// Add Remarks by ID
export const addRemarksById = async (
  primaryId: number,
  remarkType: string,
  remarks: string
) => {
  try {
    // ✅ Validation
    if (!remarks || remarks.trim() === "") {
      throw new ApiError(400, "Remarks cannot be empty");
    }

    if (isNaN(primaryId)) {
      throw new ApiError(400, "Invalid ID");
    }

    if (!remarkType || !["BOOKING", "VENDOR", "CONSUMER"].includes(remarkType)) {
      throw new ApiError(400, "Invalid remark type");
    }

    // ✅ Current timestamps
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const now = new Date();

    // ✅ Dynamic column based on remarkType
    let column = "";
    if (remarkType === "BOOKING") column = "remark_manpower_order_id";
    else if (remarkType === "VENDOR") column = "remark_manpower_vendor_id";
    else if (remarkType === "CONSUMER") column = "remark_consumer_id";

    // ✅ Build dynamic query safely
    const query = `
      INSERT INTO remark_data (${column}, remark_text, remark_add_unix_time, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?)
    `;

    const params = [primaryId, remarks.trim(), currentTimestamp, now, now];

    // ✅ Execute query
    const [result]: any = await db.query(query, params);

    if (result?.affectedRows > 0) {
      return {
        status: 200,
        message: "Remark added successfully",
      };
    } else {
      throw new ApiError(500, "Failed to insert remark");
    }
  } catch (error) {
    console.error("Error in addRemarksById:", error);
    throw new ApiError(500, "Failed to insert remark");
  }
};

// Driver Emergency List with Filters and Pagination
export const getDriverEmergencyList = async (filters?: {
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

    const { whereSQL, params } = buildFilters({
      ...filters,
      dateColumn: "driver_emergency.created_at",
    });

    let finalWhereSQL = whereSQL;

    if (filters?.status) {
      const statusConditionMap: Record<string, string> = {
        active: "driver_emergency.driver_emergency_status = 0",
        inactive: "driver_emergency.driver_emergency_status = 1",
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
        SELECT 
            driver_emergency.*, driver.driver_name, driver.driver_mobile, booking_view.booking_category, booking_view.booking_schedule_time, booking_view.booking_pickup, booking_view.booking_drop, booking_view.booking_total_amount, booking_view.booking_con_name, booking_view.booking_con_mobile
        FROM driver_emergency
        LEFT JOIN driver ON driver.driver_id = driver_emergency.driver_emergency_driver_id
        LEFT JOIN booking_view ON booking_view.booking_id = driver_emergency.driver_emergency_booking_id
        ${finalWhereSQL}
        ORDER BY driver_emergency.driver_emergency_id DESC
        LIMIT ? OFFSET ?
    `;

    const queryParams = [...params, limit, offset];
    const [rows]: any = await db.query(query, queryParams);

    const [countRows]: any = await db.query(
      `SELECT COUNT(*) as total FROM driver_emergency ${finalWhereSQL}`,
      params
    );

    const total = countRows[0]?.total || 0;

    return {
      status: 200,
      message: "Driver emergency list fetched successfully",
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      jsonData: {
        driver_emergency_list: rows
      },
    };

  } catch (error) {
    console.log(error);

    throw new ApiError(500, "Get Driver Emergency List Error On Fetching");
  }

};

// Consumer Emergency List with Filters and Pagination
export const getConsumerEmergencyList = async (filters?: {
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

    const { whereSQL, params } = buildFilters({
      ...filters,
      dateColumn: "consumer_emergency.created_at",
    });

    let finalWhereSQL = whereSQL;

    if (filters?.status) {
      const statusConditionMap: Record<string, string> = {
        active: "consumer_emergency.consumer_emergency_status = 0",
        inactive: "consumer_emergency.consumer_emergency_status = 1",
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
        SELECT 
            consumer_emergency.*, driver.driver_name, driver.driver_mobile, booking_view.booking_category, booking_view.booking_schedule_time, booking_view.booking_pickup, booking_view.booking_drop, booking_view.booking_total_amount, booking_view.booking_con_name, booking_view.booking_con_mobile, consumer.consumer_name, consumer.consumer_mobile_no
        FROM consumer_emergency
        LEFT JOIN consumer ON consumer.consumer_id = consumer_emergency.consumer_emergency_consumer_id
        LEFT JOIN booking_view ON booking_view.booking_id = consumer_emergency.consumer_emergency_booking_id
        LEFT JOIN driver ON driver.driver_id = booking_view.booking_acpt_driver_id
        ${finalWhereSQL}
        ORDER BY consumer_emergency.consumer_emergency_id DESC
        LIMIT ? OFFSET ?
    `;

    const queryParams = [...params, limit, offset];
    const [rows]: any = await db.query(query, queryParams);

    const [countRows]: any = await db.query(
      `SELECT COUNT(*) as total FROM consumer_emergency ${finalWhereSQL}`,
      params
    );

    const total = countRows[0]?.total || 0;

    return {
      status: 200,
      message: "Consumer emergency list fetched successfully",
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      jsonData: {
        consumer_emergency_list: rows
      },
    };

  } catch (error) {
    console.log(error);

    throw new ApiError(500, "Get Consumer Emergency List Error On Fetching");
  }

};