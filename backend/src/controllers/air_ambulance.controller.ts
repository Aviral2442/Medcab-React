import { Request, Response, NextFunction } from "express";
import { addAirAmbulanceCategoryService, editAirAmbulanceCategoryService, getAirAmbulanceCategoryListService, getAirAmbulanceCategoryService, updateAirAmbulanceCategoryStatusService } from "../services/air_ambulance.service";

// CONTROLLER TO GET LIST
export const getAirAmbulanceCategoryListController = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const filters = {
            date: req.query.date as string,
            status: req.query.status as string,
            fromDate: req.query.fromDate as string,
            toDate: req.query.toDate as string,
            page: req.query.page ? parseInt(req.query.page as string) : 1,
            limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
        }

        const result = await getAirAmbulanceCategoryListService(filters);
        res.status(200).json(result);

    } catch (error) {
        next(error);
    }

};

// CONTROLLER TO ADD
export const addAirAmbulanceCategoryController = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const airData = {
            air_ambulance_icon: req.file,
            air_ambulance_type: req.body.air_ambulance_type,
            air_ambulance_name: req.body.air_ambulance_name,
            air_ambulance_base_rate: req.body.air_ambulance_base_rate,
        }

        const result = await addAirAmbulanceCategoryService(airData);
        res.status(200).json(result);

    } catch (error) {
        next(error);
    }

};

// CONTROLLER TO GET SINGLE
export const getAirAmbulanceCategoryController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);
        const result = await getAirAmbulanceCategoryService(id);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

// CONTROLLER TO EDIT
export const editAirAmbulanceCategoryController = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const id = parseInt(req.params.id);

        const airData = {
            air_ambulance_icon: req.file,
            air_ambulance_type: req.body.air_ambulance_type,
            air_ambulance_name: req.body.air_ambulance_name,
            air_ambulance_base_rate: req.body.air_ambulance_base_rate,
        };

        const result = await editAirAmbulanceCategoryService(id, airData);
        res.status(200).json(result);

    } catch (error) {
        next(error);
    }

};

// CONTROLLER TO UPDATE STATUS
export const updateAirAmbulanceCategoryStatusController = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const id = parseInt(req.params.id);
        const status = req.body.status;

        const result = await updateAirAmbulanceCategoryStatusService(id, status);
        res.status(200).json(result);

    } catch (error) {
        next(error);
    }
};
