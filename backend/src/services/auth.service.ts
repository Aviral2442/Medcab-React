import bcrypt from "bcryptjs";
import { db } from "../config/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";

// 🟦 FIND ADMIN BY EMAIL
export const findAdminByEmail = async (admin_id: string): Promise<any> => {
  const [rows] = await db.query<RowDataPacket[]>(
    "SELECT * FROM admin WHERE admin_id = ?",
    [admin_id]
  );
  return rows[0];
};

// 🟩 CREATE ADMIN
export const createAdmin = async (
  admin_name: string,
  user_type: string,
  admin_id: string,
  admin_pass: string
): Promise<void> => {
  const hashed = await bcrypt.hash(admin_pass, 10);

  await db.query<ResultSetHeader>(
    "INSERT INTO admin (admin_name, user_type, admin_id, admin_pass) VALUES (?, ?, ?, ?)",
    [admin_name, user_type, admin_id, hashed]
  );
};

// 🟨 VERIFY PASSWORD
export const verifyPassword = async (plain: string, hashed: string): Promise<boolean> => {
  return bcrypt.compare(plain, hashed);
};
