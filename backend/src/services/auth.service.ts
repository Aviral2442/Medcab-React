import { generateToken } from "../utils/jwt.util";
import { ApiError } from "../utils/api-error";
import { db } from "../config/db";
import { RowDataPacket, FieldPacket } from "mysql2";  // Added import for proper typing

interface User {
  id: number;
  email: string;
  password: string;
}

// In-memory users (replace with DB later)
const users: User[] = [];

export const registerUser = async (email: string, password: string): Promise<User> => {
  const existingUser = users.find(u => u.email === email);
  if (existingUser) throw new ApiError(409, "Email already exists");

  // const hashedPassword = await bcrypt.hash(password, 10);
  const user = { id: users.length + 1, email, password };
  users.push(user);
  return user;
};

export const loginUser = async (role: number, email: string, password: string): Promise<{ user: any; token: string }> => {
  const [rows]: [RowDataPacket[], FieldPacket[]] = await db.query('SELECT * FROM admin WHERE admin_id = ?', [email]);  // Added typing
  
  if (!Array.isArray(rows) || rows.length === 0) {
    throw new ApiError(404, "User not found");
  }
  
  const user = rows[0];
  
  // Check if role matches and password matches
  if (role !== user.user_type) {
    throw new ApiError(401, "Invalid role");
  }
  
  if (password !== user.admin_pass) {
    throw new ApiError(401, "Invalid credentials");
  }
  
  // Generate token with id, name, and email
  const token = generateToken({ 
    id: user.id, 
    name: user.admin_name, 
    email: user.admin_id,
    role: user.user_type
  }, "7d");
  
  // Return user without password
  const { admin_pass, ...userWithoutPassword } = user;
  
  return { user: userWithoutPassword, token };
};
