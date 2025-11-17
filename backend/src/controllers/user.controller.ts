import { Request, Response, NextFunction } from "express";
import { addRemarksById, getAllUsers, getCityService, getConsumerEmergencyList, getDriverEmergencyList, getStateService } from "../services/user.service";
import { ApiError } from "../utils/api-error";

// Get All Users
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

// Add Remarks Controller
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

// Driver Emergency List Controller
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

// Consumer Emergency List Controller
export const getConsumerEmergencyListController = async (req: Request, res: Response, next: NextFunction) => {

  try {

    const filters = {
      date: req.query.date as string,
      status: req.query.status as string,
      fromDate: req.query.fromDate as string,
      toDate: req.query.toDate as string,
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
    }

    const result = await getConsumerEmergencyList(filters);
    res.status(200).json(result);

  } catch (error) {
    next(error);
  }

};

// Get State Controller
export const getStateController = async (req: Request, res: Response) => {
  try {
    const states = await getStateService();
    res.json(states);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch states" });
  }
};

// Get City Controller
export const getCityController = async (req: Request, res: Response) => {
  try {
    const stateId = parseInt(req.params.stateId);
    const cities = await getCityService(stateId);
    res.json(cities);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch cities" });
  }
};