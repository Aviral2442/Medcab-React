import { Request, Response, NextFunction } from "express";
import { addRemarksById, getAllUsers, getDriverEmergencyList } from "../services/user.service";
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

export const getDriverEmergencyListController = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const filters = {
            date: req.query.date as string,
            status: req.query.status as string,
            fromDate: req.query.fromDate as string,
            toDate: req.query.toDate as string,
            page: req.query.page ? parseInt(req.query.page as string) : 1,
            limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
        }

        const result = await getDriverEmergencyList(filters);
        res.status(200).json(result);

    } catch (error) {
        next(error);
    }

};