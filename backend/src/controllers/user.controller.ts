import { Request, Response, NextFunction } from "express";
import { addRemarksById, getAllUsers } from "../services/user.service";
import { ApiError } from "../utils/api-error";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

export const addRemarks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const primaryId = parseInt(req.params.id);
    const { remarkType, remarks } = req.body;

    if (!remarkType || !remarks) {
      throw new ApiError(400, "remarkType and remarks are required");
    }

    const result = await addRemarksById(primaryId, remarkType, remarks);

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};