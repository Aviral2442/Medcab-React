import { Request, Response, NextFunction } from "express";
import { addAmbulanceCategoryService, editAmbulanceCategoryService, getAmbulanceCategoryListService, getAmbulanceCategoryService, updateAmbulanceCategoryStatusService } from "../services/ambulance.service";

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

// CONTROLLER TO ADD NEW AMBULANCE CATEGORY
export const addAmbulanceCategoryController = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const data = {
            ambulance_category_type: req.body.ambulance_category_type,
            ambulance_category_service_type: req.body.ambulance_category_service_type,
            ambulance_category_state_id: req.body.ambulance_category_state_id,
            ambulance_category_name: req.body.ambulance_category_name,
            ambulance_category_icon: req.file,
            ambulance_catagory_desc: req.body.ambulance_catagory_desc,
            ambulance_category_sku: req.body.ambulance_category_sku,
        };

        const result = await addAmbulanceCategoryService(data);
        res.status(200).json(result);

    } catch (error) {
        next(error);
    }

};

// CONTROLLER TO GET SINGLE AMBULANCE CATEGORY
export const getAmbulanceCategoryController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const categoryId = parseInt(req.params.id);
        const result = await getAmbulanceCategoryService(categoryId);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

// CONTROLLER TO EDIT AMBULANCE CATEGORY
export const editAmbulanceCategoryController = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const categoryId = parseInt(req.params.id);

        const data = {
            ambulance_category_type: req.body.ambulance_category_type,
            ambulance_category_service_type: req.body.ambulance_category_service_type,
            ambulance_category_state_id: req.body.ambulance_category_state_id,
            ambulance_category_name: req.body.ambulance_category_name,
            ambulance_category_icon: req.file,
            ambulance_catagory_desc: req.body.ambulance_catagory_desc,
            ambulance_category_sku: req.body.ambulance_category_sku,
        };

        const result = await editAmbulanceCategoryService(categoryId, data);
        res.status(200).json(result);

    } catch (error) {
        next(error);
    }

};

// CONTROLLER TO UPDATE AMBULANCE CATEGORY STATUS
export const updateAmbulanceCategoryStatusController = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const categoryId = parseInt(req.params.id);
        const status = req.body.status;

        const result = await updateAmbulanceCategoryStatusService(categoryId, status);
        res.status(200).json(result);

    } catch (error) {
        next(error);
    }
};