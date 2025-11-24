import { Request, Response, NextFunction } from 'express';
import { addVehicleService, fetchVehicleService, getVehicleListService, updateVehicleService } from '../services/vehicle.service';

// Get Vehicle List Controller
export const getVehicleListController = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const filters = {
            date: req.query.date as string,
            status: req.query.status as string,
            fromDate: req.query.fromDate as string,
            toDate: req.query.toDate as string,
            page: req.query.page ? parseInt(req.query.page as string) : 1,
            limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
        }

        const result = await getVehicleListService(filters);
        res.status(200).json(result);

    } catch (error) {
        next(error);
    }

};

// Add Vehicle Controller
export const addVehicleController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const files = req.files as any;

        const data = {
            ...req.body,
            vehicle_front_image: files?.vehicle_front_image?.[0],
            vehicle_back_image: files?.vehicle_back_image?.[0],
            vehicle_rc_image: files?.vehicle_rc_image?.[0],
            vehicle_details_fitness_certi_img: files?.vehicle_details_fitness_certi_img?.[0],
            vehicle_details_insurance_img: files?.vehicle_details_insurance_img?.[0],
            vehicle_details_pollution_img: files?.vehicle_details_pollution_img?.[0],
        };

        const response = await addVehicleService(data);
        return res.status(response.status).json(response);
    } catch (error) {
        next(error);
    }
};

// Get Vehicle Controller
export const getVehicleController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const vehicleId = parseInt(req.params.vehicleId);
        const response = await fetchVehicleService(vehicleId);
        return res.status(response.status).json(response);
    } catch (error) {
        next(error);
    }
};

// Update Vehicle Controller
export const updateVehicleController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const vehicleId = parseInt(req.params.vehicleId);
        const files = req.files as any;

        const data = {
            ...req.body,
            vehicle_front_image: files?.vehicle_front_image?.[0],
            vehicle_back_image: files?.vehicle_back_image?.[0],
            vehicle_rc_image: files?.vehicle_rc_image?.[0],
            vehicle_details_fitness_certi_img: files?.vehicle_details_fitness_certi_img?.[0],
            vehicle_details_insurance_img: files?.vehicle_details_insurance_img?.[0],
            vehicle_details_pollution_img: files?.vehicle_details_pollution_img?.[0],
        };

        const response = await updateVehicleService(vehicleId, data);
        return res.status(response.status).json(response);
    } catch (error) {
        next(error);
    }
};

