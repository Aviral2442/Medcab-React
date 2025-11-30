import { Request, Response, NextFunction } from 'express';
import { addDriverService, driverDetailService, driverOnOffDataService, driverLiveLocationService, fetchDriverService, getDriverService, TotalDriverLiveLocationService, updateDriverService } from '../services/driver.service';

// Get Drivers List
export const getDriversController = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const filters = {
            date: req.query.date as string,
            status: req.query.status as string,
            fromDate: req.query.fromDate as string,
            toDate: req.query.toDate as string,
            page: req.query.page ? parseInt(req.query.page as string) : 1,
            limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
        };

        const result = await getDriverService(filters);
        res.status(200).json(result);

    } catch (error) {
        next(error);
    }

};

// Add Driver
export const addDriverController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const files = req.files as any;

        const data = {
            ...req.body,

            driver_profile_img: files?.driver_profile_img?.[0],

            driver_details_dl_front_img: files?.driver_details_dl_front_img?.[0],
            driver_details_dl_back_image: files?.driver_details_dl_back_image?.[0],

            driver_details_aadhar_front_img: files?.driver_details_aadhar_front_img?.[0],
            driver_details_aadhar_back_img: files?.driver_details_aadhar_back_img?.[0],

            driver_details_pan_card_front_img: files?.driver_details_pan_card_front_img?.[0],

            driver_details_police_verification_image:
                files?.driver_details_police_verification_image?.[0],
        };

        const response = await addDriverService(data);
        return res.status(response.status).json(response);

    } catch (error) {
        next(error);
    }
};

// Fetch Driver By ID Controller
export const fetchDriverController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const driverId = parseInt(req.params.driverId);
        const response = await fetchDriverService(driverId);
        return res.status(response.status).json(response);

    } catch (error) {
        next(error);
    }
};

// Update Driver Controller
export const updateDriverController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const driverId = parseInt(req.params.driverId);

        const files = req.files as any;

        const data = {
            ...req.body,
            driver_profile_img: files?.driver_profile_img?.[0],
            driver_details_dl_front_img: files?.driver_details_dl_front_img?.[0],
            driver_details_dl_back_image: files?.driver_details_dl_back_image?.[0],
            driver_details_aadhar_front_img: files?.driver_details_aadhar_front_img?.[0],
            driver_details_aadhar_back_img: files?.driver_details_aadhar_back_img?.[0],
            driver_details_pan_card_front_img: files?.driver_details_pan_card_front_img?.[0],
            driver_details_police_verification_image:
                files?.driver_details_police_verification_image?.[0],
        };

        const response = await updateDriverService(driverId, data);
        return res.status(response.status).json(response);

    } catch (error) {
        next(error);
    }
};

// Get Driver Detail
export const driverDetailController = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const driverId = parseInt(req.params.driverId);

        if (isNaN(driverId)) {
            return res.status(400).json({ message: 'Invalid driver ID' });
        }

        const result = await driverDetailService(driverId);
        res.status(200).json(result);

    } catch (error) {
        next(error);
    }
}

// Get Driver On Off Data
export const driverOnOffDataController = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const filters = {
            date: req.query.date as string,
            status: req.query.status as string,
            fromDate: req.query.fromDate as string,
            toDate: req.query.toDate as string,
            page: req.query.page ? parseInt(req.query.page as string) : 1,
            limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
        };

        const result = await driverOnOffDataService(filters);
        res.status(200).json(result);

    } catch (error) {
        next(error);
    }
};

//Get Total Driver On Off Map Location
export const TotaldriverliveLocationController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const filters = {
            date: req.query.date as string,
            status: req.query.status as string,
            fromDate: req.query.fromDate as string,
            toDate: req.query.toDate as string,
            page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
            limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 10,
        };

        const result = await TotalDriverLiveLocationService(filters);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};


// Get Driver On Off Map Location
export const driverLiveLocationController = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const driverOnOffId = parseInt(req.params.driverOnOffId);

        if (isNaN(driverOnOffId)) {
            return res.status(400).json({ message: 'Invalid driver On Off ID' });
        }

        const result = await driverLiveLocationService(driverOnOffId);
        res.status(200).json(result);

    } catch (error) {
        next(error);
    }
};