import { Request, Response, NextFunction } from "express";
import { getAmbulanceCategoryListService } from "../services/ambulance.service";

// Get Ambulance Category List Controller
export const getAmbulanceCategoryListController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const filters = {
            // date: req.query.date as string,
            status: req.query.status as string,
            // fromDate: req.query.fromDate as string,
            // toDate: req.query.toDate as string,
            page: req.query.page ? parseInt(req.query.page as string, 10) : undefined,
            limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
        };
        const serviceResponse = await getAmbulanceCategoryListService(filters);
        res.status(serviceResponse.status).json(serviceResponse);
    } catch (error) {
        next(error);
    }
}