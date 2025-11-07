import { Request, Response } from "express";
import { generateToken } from "../utils/jwt.util";
import { findAdminByEmail, createAdmin, verifyPassword } from "../services/auth.service";

// 🟩 Register Admin
export const registerAdmin = async (req: Request, res: Response) => {
  try {
    const { admin_name, user_type, admin_id, admin_pass } = req.body;
    if (!admin_name || !user_type || !admin_id || !admin_pass)
      return res.status(400).json({ message: "All fields required" });

    const existing = await findAdminByEmail(admin_id);
    if (existing) return res.status(400).json({ message: "Admin already exists" });

    await createAdmin(admin_name, user_type, admin_id, admin_pass);
    res.status(201).json({ message: "Admin registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🟦 Login Admin
export const loginAdmin = async (req: Request, res: Response) => {
  try {
    const { admin_id, admin_pass } = req.body;
    if (!admin_id || !admin_pass)
      return res.status(400).json({ message: "Email and password required" });

    const admin = await findAdminByEmail(admin_id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const match = await verifyPassword(admin_pass, admin.admin_pass);
    if (!match) return res.status(401).json({ message: "Invalid password" });

    const token = generateToken({
      id: admin.id,
      email: admin.admin_id,
      user_type: admin.user_type,
    });

    res.json({
      message: "Login successful",
      token,
      admin: {
        id: admin.id,
        admin_name: admin.admin_name,
        admin_id: admin.admin_id,
        user_type: admin.user_type,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
