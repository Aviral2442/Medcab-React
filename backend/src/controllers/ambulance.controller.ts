import { Request, Response, NextFunction } from "express";
import { addAmbulanceCategoryService, addAmbulanceFacilitiesRateService, addAmbulanceFacilitiesService, addAmbulanceFaqService, ambulanceBookingDetailService, ambulanceBookingCountService, dashboardAmbulanceBookingService, dashboardAmbulanceDriverService, dashboardAmbulanceDriverTransService, dashboardAmbulancePartnerService, dashboardAmbulancePartnerTransService, dashboardAmbulanceVehicleService, editAmbulanceCategoryService, editAmbulanceFacilitiesRateService, editAmbulanceFacilitiesService, editAmbulanceFaqService, getAmbulanceBookingListService, getAmbulanceCategoryListService, getAmbulanceCategoryService, getAmbulanceFacilitiesListService, getAmbulanceFacilitiesRateListService, getAmbulanceFacilitiesRateService, getAmbulanceFacilitiesService, getAmbulanceFaqListService, getAmbulanceFaqService, getBulkAmbulanceBookingListService, getRegularAmbulanceBookingListService, getRentalAmbulanceBookingListService, updateAmbulanceBookingConsumerDetails, updateAmbulanceBookingScheduleTime, updateAmbulanceCategoryStatusService, updateAmbulanceFacilitiesRateStatusService, updateAmbulanceFacilitiesStatusService, updateAmbulanceFaqStatusService, ambulancePartnerCountService, ambulanceCompleteOngoingCancelReminderBookingCounts } from "../services/ambulance.service";

// CONTROLLER TO GET TOTAL AMBULANCE BOOKING COUNT
export const ambulanceBookingCountController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await ambulanceBookingCountService();
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

// CONTROLLER TO GET TOTAL AMBULANCE PARTNER COUNT
export const ambulancePartnerCountController = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const result = await ambulancePartnerCountService();
        res.status(200).json(result);

    } catch (error) {
        next(error);
    }
};

// CONTROLLER TO GET COMPLETE, ONGOING, CANCEL & REMINDER BOOKING COUNTS
export const ambulanceCompleteOngoingCancelReminderBookingCountsController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await ambulanceCompleteOngoingCancelReminderBookingCounts();
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

// DASHBOARD AMBULANCE BOOKING CONTROLLER
export const dashboardAmbulanceBookingController = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const result = await dashboardAmbulanceBookingService();
        res.status(result.status).json(result);

    } catch (error) {
        next(error);
    }
};

// DASHBOARD AMBULANCE PARTNER CONTROLLER
export const dashboardAmbulancePartnerController = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const result = await dashboardAmbulancePartnerService();
        res.status(result.status).json(result);

    } catch (error) {
        next(error);
    }
};

// DASHBOARD AMBULANCE DRIVER CONTROLLER
export const dashboardAmbulanceDriverController = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const result = await dashboardAmbulanceDriverService();
        res.status(result.status).json(result);
    } catch (error) {
        next(error);
    }
};

// DASHBOARD AMBULANCE VEHICLE CONTROLLER
export const dashboardAmbulanceVehicleController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await dashboardAmbulanceVehicleService();
        res.status(result.status).json(result);
    } catch (error) {
        next(error);
    }
};

// DASHBOARD AMBULANCE PARTNER TRANSACTION CONTROLLER
export const dashboardAmbulancePartnerTransController = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const result = await dashboardAmbulancePartnerTransService();
        res.status(result.status).json(result);

    } catch (error) {
        next(error);
    }
};

// DASHBOARD AMBULANCE DRIVER TRANSACTION CONTROLLER
export const dashboardAmbulanceDriverTransController = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const result = await dashboardAmbulanceDriverTransService();
        res.status(result.status).json(result);

    } catch (error) {
        next(error);
    }
};

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
};

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

// CONTROLLER TO GET REGULAR AMBULANCE BOOKING LIST
export const getRegularAmbulanceBookingListController = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const filters = {
            date: req.query.date as string,
            status: req.query.status as string,
            fromDate: req.query.fromDate as string,
            toDate: req.query.toDate as string,
            page: req.query.page ? parseInt(req.query.page as string) : 1,
            limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
        }

        const result = await getRegularAmbulanceBookingListService(filters);
        res.status(200).json(result);

    } catch (error) {
        next(error);
    }

};

// CONTROLLER TO GET RENTAL AMBULANCE BOOKING LIST
export const getRentalAmbulanceBookingListController = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const filters = {
            date: req.query.date as string,
            status: req.query.status as string,
            fromDate: req.query.fromDate as string,
            toDate: req.query.toDate as string,
            page: req.query.page ? parseInt(req.query.page as string) : 1,
            limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
        }

        const result = await getRentalAmbulanceBookingListService(filters);
        res.status(200).json(result);

    } catch (error) {
        next(error);
    }

};

// CONTROLLER TO GET RENTAL AMBULANCE BOOKING LIST
export const getBulkAmbulanceBookingListController = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const filters = {
            date: req.query.date as string,
            status: req.query.status as string,
            fromDate: req.query.fromDate as string,
            toDate: req.query.toDate as string,
            page: req.query.page ? parseInt(req.query.page as string) : 1,
            limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
        }

        const result = await getBulkAmbulanceBookingListService(filters);
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

// CONTROLLER TO UPDATE AMBULANCE BOOKING SCHEDULE TIME
export const updateAmbulanceBookingScheduleTimeController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const bookingId = parseInt(req.params.bookingId);
        const booking_schedule_time = req.body.booking_schedule_time;
        console.log(bookingId, booking_schedule_time);

        const result = await updateAmbulanceBookingScheduleTime(bookingId, booking_schedule_time);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

// CONTROLLER TO UPDATE AMBULANCE BOOKING CONSUMER DETAILS
export const updateAmbulanceBookingConsumerDetailsController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const bookingId = parseInt(req.params.bookingId);

        if (!bookingId) {
            return res.status(400).json({ status: 400, message: "Invalid booking ID" });
        }

        if (!req.body.booking_con_name) {
            return res.status(400).json({ status: 400, message: "Consumer name is required" });
        }

        if (!req.body.booking_con_mobile) {
            return res.status(400).json({ status: 400, message: "Consumer mobile number is required" });
        }

        const { booking_con_name, booking_con_mobile } = req.body;
        const result = await updateAmbulanceBookingConsumerDetails(bookingId, booking_con_name, booking_con_mobile);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};