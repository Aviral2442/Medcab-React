import { db } from "../config/db";

import { ApiError } from "../utils/api-error";

export const getAllUsers = async (): Promise<any[]> => {
  const [rows] = await db.query("SELECT id, username, email FROM users");
  return rows as any[];
};

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