import { db } from "../config/db";
import Razorpay from "razorpay";
import { ApiError } from "../utils/api-error";
import { buildFilters } from "../utils/filters";
import { currentUnixTime } from "../utils/current_unixtime";

// Get All Users
export const getAllUsers = async (): Promise<any[]> => {
  const [rows] = await db.query("SELECT id, username, email FROM users");
  return rows as any[];
};

// remark.service.ts
interface RemarkData {
  remark_type: number;
  remark_category_type: number;
  remark_text: string;
  remark_list_primary_key: number;
}

// CATEGORY → COLUMN MAPPING
const remarkColumnMap: Record<number, string> = {
  1: "remark_booking_id",
  2: "remark_airbooking_id",
  3: "remark_consumer_id",
  4: "remark_partner_id",
  5: "remark_driver_id",
  6: "remark_vehicle_id",
  7: "remark_hospital_id",
  8: "remark_consumer_dial_id",
  9: "remark_consumer_enquiry_records_id",
  10: "ambulance_enquire_id",
  11: "remark_manpower_vendor_id",
  12: "remark_manpower_order_id",
  13: "remark_driver_emergency_id",
  14: "remark_consumer_emergency_id",
  15: "remark_pathology_vendor_id",
  16: "remark_pathology_order_id",
  17: "remark_pathology_collection_boy_id",
  18: "remark_video_consultancy_order_id",
  19: "remark_video_consultancy_patient_id",
};

// ADD REMARK SERVICE
export const addRemarksById = async (remarkData: RemarkData) => {
  try {
    const columnName = remarkColumnMap[remarkData.remark_category_type];

    if (!columnName) {
      throw new ApiError(400, "Invalid remark category type");
    }

    // Prepare final insert object
    const remarkInsertData: any = {
      remark_type: remarkData.remark_type,
      remark_category_type: remarkData.remark_category_type,
      remark_text: remarkData.remark_text,
      remark_add_unix_time: currentUnixTime(),
      created_at: new Date(),
      updated_at: new Date(),
    };

    // Set only the target column
    remarkInsertData[columnName] = remarkData.remark_list_primary_key;

    // Insert
    const query = `INSERT INTO remark_data SET ?`;
    await db.query(query, remarkInsertData);

    return {
      status: 200,
      message: "Remark added successfully"
    };

  } catch (error) {
    console.error("Error in addRemarksById:", error);
    throw new ApiError(500, "Failed to insert remark");
  }
};

// GET REMARKS SERVICE BY ID
export const getRemarksById = async (columnName: string, primaryKey: number) => {
  try {

    const [rows]: any = await db.query(
      `SELECT * FROM remark_data 
         WHERE ${columnName} = ? 
         ORDER BY remark_id DESC`,
      [primaryKey]
    );

    return {
      status: 200,
      message: "Remarks fetched successfully",
      jsonData: {
        remarks_list: rows
      }
    };

  } catch (error) {
    throw new ApiError(500, "Failed to fetch remarks");
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

    // Detect filters
    const isDateFilterApplied = !!filters?.date || !!filters?.fromDate || !!filters?.toDate;
    const isStatusFilterApplied = !!filters?.status;
    const noFiltersApplied = !isDateFilterApplied && !isStatusFilterApplied;

    let effectiveLimit = limit;
    let effectiveOffset = offset;

    // If NO FILTERS applied → force fixed 100-record window
    if (noFiltersApplied) {
      effectiveLimit = limit;              // per page limit (e.g., 10)
      effectiveOffset = (page - 1) * limit; // correct pagination
    }

    const query = `
        SELECT 
            driver_emergency.*, 
            driver.driver_name, 
            driver.driver_mobile, 
            booking_view.booking_view_category_name, 
            booking_view.booking_schedule_time, 
            booking_view.booking_pickup,
            booking_view.booking_drop, 
            booking_view.booking_total_amount, 
            booking_view.booking_con_name, 
            booking_view.booking_con_mobile,
            (
              SELECT remark_text
              FROM remark_data
              WHERE remark_driver_emergency_id = driver_emergency.driver_emergency_id
              ORDER BY remark_id DESC
              LIMIT 1
            ) AS remark_text
        FROM driver_emergency
        LEFT JOIN driver ON driver.driver_id = driver_emergency.driver_emergency_driver_id
        LEFT JOIN booking_view ON booking_view.booking_id = driver_emergency.driver_emergency_booking_id
        ${finalWhereSQL}
        ORDER BY driver_emergency.driver_emergency_id DESC
        LIMIT ? OFFSET ?
    `;

    const queryParams = [...params, effectiveLimit, effectiveOffset];
    const [rows]: any = await db.query(query, queryParams);

    let total;

    if (noFiltersApplied) {
      const [countAllRows]: any = await db.query(`SELECT COUNT(*) as total FROM driver_emergency`);
      const actualTotal = countAllRows[0]?.total || 0;

      if (actualTotal < 100) {
        total = actualTotal;
      } else {
        total = 100;
      }
    } else {
      const [countRows]: any = await db.query(
        `SELECT COUNT(*) as total FROM driver_emergency ${finalWhereSQL}`,
        params
      );
      total = countRows[0]?.total || 0;
    }
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
            consumer_emergency.*,
            driver.driver_name, 
            driver.driver_mobile, 
            booking_view.booking_category, 
            booking_view.booking_schedule_time, 
            booking_view.booking_pickup, 
            booking_view.booking_drop, 
            booking_view.booking_total_amount, 
            booking_view.booking_con_name, 
            booking_view.booking_con_mobile, 
            consumer.consumer_name, 
            consumer.consumer_mobile_no,
            (
              SELECT remark_text
              FROM remark_data
              WHERE remark_consumer_emergency_id = consumer_emergency.consumer_emergency_id
              ORDER BY remark_id DESC
              LIMIT 1
            ) AS remark_text
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

// Get State Service
export const getStateService = async () => {
  try {

    const [rows]: any = await db.query(
      `SELECT state_id, state_name FROM state ORDER BY state_name ASC`
    )

    return ({
      status: 200,
      message: "State list fetched successfully",
      jsonData: {
        state_list: rows
      }
    });

  } catch (error) {
    console.log(error);
    throw new ApiError(500, "Get State Service Error On Fetching");
  }
};

// Get City Service by State ID
export const getCityService = async (stateId: number) => {
  try {

    if (isNaN(stateId)) {
      throw new ApiError(400, "Invalid State ID");
    }

    const [rows]: any = await db.query(
      `SELECT city_id, city_name FROM city WHERE city_state = ? ORDER BY city_name ASC`,
      [stateId]
    )

    return ({
      status: 200,
      message: "City list fetched successfully",
      jsonData: {
        city_list: rows
      }
    });

  } catch (error) {
    console.log(error);
    throw new ApiError(500, "Get City Service Error On Fetching");
  }
};

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY!,
  key_secret: process.env.RAZORPAY_SECRET!,
});

// Get Razorpay Transactions Service
export const getRazorpayTransService = async (filters?: {
  fromDate?: string;
  toDate?: string;
  page?: number;
  limit?: number;
}) => {
  try {
    const page = filters?.page && filters.page > 0 ? filters.page : 1;
    const limit = filters?.limit && filters.limit > 0 ? filters.limit : 50;
    const skip = (page - 1) * limit;

    // Convert dates to UNIX timestamps
    const from = filters?.fromDate
      ? Math.floor(new Date(filters.fromDate).getTime() / 1000)
      : undefined;

    const to = filters?.toDate
      ? Math.floor(new Date(filters.toDate).getTime() / 1000)
      : undefined;

    const response = await razorpay.payments.all({
      from: from,
      to: to,
      count: limit,
      skip: skip,
    });

    return {
      status: 200,
      message: "Razorpay transactions fetched successfully",
      pagination: {
        page,
        limit,
        // Razorpay does NOT provide total count → we show only current list
        totalFetched: response.items.length,
      },
      jsonData: {
        razorpay_transactions_list: response.items,
      },
    };
  } catch (error: any) {
    console.error("Razorpay API Error:", error);
    throw new ApiError(500, "Failed to fetch Razorpay transactions");
  }
};
