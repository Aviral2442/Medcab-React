import { Request, Response, NextFunction } from "express";
import { addAmbulanceCategoryService, addAmbulanceFacilitiesRateService, addAmbulanceFacilitiesService, addAmbulanceFaqService, ambulanceBookingDetailService, editAmbulanceCategoryService, editAmbulanceFacilitiesRateService, editAmbulanceFacilitiesService, editAmbulanceFaqService, getAmbulanceBookingListService, getAmbulanceCategoryListService, getAmbulanceCategoryService, getAmbulanceFacilitiesListService, getAmbulanceFacilitiesRateListService, getAmbulanceFacilitiesRateService, getAmbulanceFacilitiesService, getAmbulanceFaqListService, getAmbulanceFaqService, updateAmbulanceCategoryStatusService, updateAmbulanceFacilitiesRateStatusService, updateAmbulanceFacilitiesStatusService, updateAmbulanceFaqStatusService } from "../services/ambulance.service";

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

// CONTROLLER TO GET AMBULANCE FAQ LIST
export const getAmbulanceFaqListController = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const filters = {
            date: req.query.date as string,
            status: req.query.status as string,
            fromDate: req.query.fromDate as string,
            toDate: req.query.toDate as string,
            page: req.query.page ? parseInt(req.query.page as string) : 1,
            limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
        };

        const result = await getAmbulanceFaqListService(filters);
        res.status(200).json(result);

    } catch (error) {
        next(error);
    }

};

// CONTROLLER TO ADD NEW AMBULANCE FAQ
export const addAmbulanceFaqController = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const data = {
            ambulance_id: req.body.ambulance_id,
            ambulance_faq_que: req.body.ambulance_faq_que,
            ambulance_faq_ans: req.body.ambulance_faq_ans,
        };

        const result = await addAmbulanceFaqService(data);
        res.status(200).json(result);

    } catch (error) {
        next(error);
    }

};

// CONTROLLER TO GET SINGLE AMBULANCE FAQ
export const getAmbulanceFaqController = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const faqId = parseInt(req.params.id);
        const result = await getAmbulanceFaqService(faqId);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }

};

// CONTROLLER TO EDIT AMBULANCE FAQ
export const editAmbulanceFaqController = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const faqId = parseInt(req.params.id);

        const data = {
            ambulance_id: req.body.ambulance_id,
            ambulance_faq_que: req.body.ambulance_faq_que,
            ambulance_faq_ans: req.body.ambulance_faq_ans,
        };

        const result = await editAmbulanceFaqService(faqId, data);
        res.status(200).json(result);

    } catch (error) {
        next(error);
    }

};

// CONTROLLER TO UPDATE STATUS
export const updateAmbulanceFaqStatusController = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const faqId = parseInt(req.params.id);
        const status = req.body.status;

        const result = await updateAmbulanceFaqStatusService(faqId, status);
        res.status(200).json(result);

    } catch (error) {
        next(error);
    }

};

// CONTROLLER TO GET LIST
export const getAmbulanceFacilitiesListController = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const filters = {
            date: req.query.date as string,
            status: req.query.status as string,
            fromDate: req.query.fromDate as string,
            toDate: req.query.toDate as string,
            page: req.query.page ? parseInt(req.query.page as string) : 1,
            limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
        }

        const result = await getAmbulanceFacilitiesListService(filters);
        res.status(200).json(result);

    } catch (error) {
        next(error);
    }

};

// CONTROLLER TO ADD
export const addAmbulanceFacilitiesController = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const facilitiesData = {
            ambulance_facilities_image: req.file,
            ambulance_facilities_category_type: req.body.ambulance_facilities_category_type,
            ambulance_facilities_name: req.body.ambulance_facilities_name,
            ambulance_facilities_state: req.body.ambulance_facilities_state,
        }

        const result = await addAmbulanceFacilitiesService(facilitiesData);
        res.status(200).json(result);

    } catch (error) {
        next(error);
    }

};

// CONTROLLER TO GET SINGLE
export const getAmbulanceFacilitiesController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const facilityId = parseInt(req.params.id);
        const result = await getAmbulanceFacilitiesService(facilityId);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

// CONTROLLER TO EDIT
export const editAmbulanceFacilitiesController = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const facilityId = parseInt(req.params.id);

        const facilitiesData = {
            ambulance_facilities_image: req.file,
            ambulance_facilities_category_type: req.body.ambulance_facilities_category_type,
            ambulance_facilities_name: req.body.ambulance_facilities_name,
            ambulance_facilities_state: req.body.ambulance_facilities_state,
        };

        const result = await editAmbulanceFacilitiesService(facilityId, facilitiesData);
        res.status(200).json(result);

    } catch (error) {
        next(error);
    }

};

// CONTROLLER TO UPDATE STATUS
export const updateAmbulanceFacilitiesStatusController = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const facilityId = parseInt(req.params.id);
        const status = req.body.status;

        const result = await updateAmbulanceFacilitiesStatusService(facilityId, status);
        res.status(200).json(result);

    } catch (error) {
        next(error);
    }
};

// CONTROLLER TO GET AMBULANCE FACILITIES RATE LIST
export const getAmbulanceFacilitiesRateListController = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const filters = {
            date: req.query.date as string,
            status: req.query.status as string,
            fromDate: req.query.fromDate as string,
            toDate: req.query.toDate as string,
            page: req.query.page ? parseInt(req.query.page as string) : 1,
            limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
        };

        const result = await getAmbulanceFacilitiesRateListService(filters);
        res.status(200).json(result);

    } catch (error) {
        next(error);
    }

};

// CONTROLLER TO ADD AMBULANCE FACILITIES RATE
export const addAmbulanceFacilitiesRateController = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const rateData = {
            ambulance_facilities_rate_f_id: req.body.ambulance_facilities_rate_f_id,
            ambulance_facilities_rate_amount: req.body.ambulance_facilities_rate_amount,
            ambulance_facilities_rate_increase_per_km: req.body.ambulance_facilities_rate_increase_per_km,
            ambulance_facilities_rate_from: req.body.ambulance_facilities_rate_from,
            ambulance_facilities_rate_to: req.body.ambulance_facilities_rate_to,
            ambulance_facilities_rate_status: req.body.ambulance_facilities_rate_status,
        };

        const result = await addAmbulanceFacilitiesRateService(rateData);
        res.status(200).json(result);

    } catch (error) {
        next(error);
    }

};

// CONTROLLER TO GET SINGLE AMBULANCE FACILITIES RATE
export const getAmbulanceFacilitiesRateController = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const rateId = parseInt(req.params.id);
        const result = await getAmbulanceFacilitiesRateService(rateId);
        res.status(200).json(result);

    } catch (error) {
        next(error);
    }

};

// CONTROLLER TO EDIT AMBULANCE FACILITIES RATE
export const editAmbulanceFacilitiesRateController = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const rateId = parseInt(req.params.id);

        const rateData = {
            ambulance_facilities_rate_f_id: req.body.ambulance_facilities_rate_f_id,
            ambulance_facilities_rate_amount: req.body.ambulance_facilities_rate_amount,
            ambulance_facilities_rate_increase_per_km: req.body.ambulance_facilities_rate_increase_per_km,
            ambulance_facilities_rate_from: req.body.ambulance_facilities_rate_from,
            ambulance_facilities_rate_to: req.body.ambulance_facilities_rate_to,
            ambulance_facilities_rate_status: req.body.ambulance_facilities_rate_status,
        };

        const result = await editAmbulanceFacilitiesRateService(rateId, rateData);
        res.status(200).json(result);

    } catch (error) {
        next(error);
    }

};

// CONTROLLER AMBULANCE FACILITIES RATE STATUS TO UPDATE STATUS
export const updateAmbulanceFacilitiesRateStatusController = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const rateId = parseInt(req.params.id);
        const status = req.body.status;

        const result = await updateAmbulanceFacilitiesRateStatusService(rateId, status);
        res.status(200).json(result);

    } catch (error) {
        next(error);
    }

};

// CONTROLLER TO GET AMBULANCE BOOKING LIST
export const getAmbulanceBookingListController = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const filters = {
            date: req.query.date as string,
            status: req.query.status as string,
            fromDate: req.query.fromDate as string,
            toDate: req.query.toDate as string,
            page: req.query.page ? parseInt(req.query.page as string) : 1,
            limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
        }

        const result = await getAmbulanceBookingListService(filters);
        res.status(200).json(result);

    } catch (error) {
        next(error);
    }

};

// CONTROLLER TO GET AMBULANCE BOOKING DETAIL
export const ambulanceBookingDetailController = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const bookingId = parseInt(req.params.id);
        const result = await ambulanceBookingDetailService(bookingId);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};