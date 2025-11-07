import { Request, Response, NextFunction } from "express";
import { registerUser, loginUser } from "../services/auth.service";

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const user = await registerUser(email, password);
    res.status(201).json({ message: "User registered", user });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { role, email, password } = req.body;
    const { user, token } = await loginUser(role, email, password);
    res.status(200).json({ message: "Login successful", user, token });
  } catch (error) {
    next(error);
  }
};
