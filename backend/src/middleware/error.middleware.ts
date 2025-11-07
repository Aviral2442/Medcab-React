import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/api-error";

export const errorMiddleware = (err: ApiError, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  const status = (err.status || 500);
  const message = err.message || "Something went wrong";
  res.status(status).json({ status, message });
};
