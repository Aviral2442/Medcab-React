import { Request, Response, NextFunction } from 'express';
import { getPartnerServices, getManpowerPartnerServices, getPartnerTransactionServices, getPartnerDetailServices, addPartnerService, fetchPartnerByIdService, updatePartnerService } from '..//services/partner.service';

// Get Partners List
export const getPartnersController = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const filters = {
            date: req.query.date as string,
            status: req.query.status as string,
            fromDate: req.query.fromDate as string,
            toDate: req.query.toDate as string,
            page: req.query.page ? parseInt(req.query.page as string) : 1,
            limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
        }

        const result = await getPartnerServices(filters);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }

};

// Add Partner Controller
export const addPartnerController = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const files = req.files as {
            [fieldname: string]: Express.Multer.File[];
        };

        const partnerData = {
            partner_f_name: req.body.partner_f_name as string | undefined,
            partner_l_name: req.body.partner_l_name as string | undefined,
            partner_mobile: req.body.partner_mobile as string | undefined,
            partner_dob: req.body.partner_dob as string | undefined,
            partner_gender: req.body.partner_gender as string | undefined,
            partner_city_id: req.body.partner_city_id !== undefined ? Number(req.body.partner_city_id) : undefined,
            partner_profile_img: files?.partner_profile_img?.[0] || undefined,
            partner_aadhar_front: files?.partner_aadhar_front?.[0] || undefined,
            partner_aadhar_back: files?.partner_aadhar_back?.[0] || undefined,
            partner_aadhar_no: req.body.partner_aadhar_no as string | undefined,
            referral_referral_by: req.body.referral_referral_by as string | undefined,
        };

        const response = await addPartnerService(partnerData);

        return res.status(response.status).json(response);

    } catch (error) {
        next(error);
    }
};

// Fetch Partner By ID Controller
export const fetchPartnerByIdController = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const partnerId = parseInt(req.params.partnerId);
        const response = await fetchPartnerByIdService(partnerId);

        return res.status(200).json(response);

    } catch (error) {
        next(error);
    }
};

// Update Partner Controller
export const updatePartnerController = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const partnerId = parseInt(req.params.partnerId);

        const files = req.files as {
            [fieldname: string]: Express.Multer.File[];
        };

        const updateData = {
            partner_f_name: req.body.partner_f_name as string | undefined,
            partner_l_name: req.body.partner_l_name as string | undefined,
            partner_mobile: req.body.partner_mobile as string | undefined,
            partner_dob: req.body.partner_dob as string | undefined,
            partner_gender: req.body.partner_gender as string | undefined,
            partner_city_id: req.body.partner_city_id !== undefined ? Number(req.body.partner_city_id) : undefined,
            partner_aadhar_no: req.body.partner_aadhar_no as string | undefined,
            referral_referral_by: req.body.referral_referral_by as string | undefined,
            partner_profile_img: files?.partner_profile_img?.[0] || undefined,
            partner_aadhar_front: files?.partner_aadhar_front?.[0] || undefined,
            partner_aadhar_back: files?.partner_aadhar_back?.[0] || undefined,
        };

        const response = await updatePartnerService(partnerId, updateData);

        return res.status(response.status).json(response);

    } catch (error) {
        next(error);
    }
};

// Get Manpower Partners List
export const getManpowerPartnersController = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const filters = {
            date: req.query.date as string,
            status: req.query.status as string,
            fromDate: req.query.fromDate as string,
            toDate: req.query.toDate as string,
            page: req.query.page ? parseInt(req.query.page as string) : 1,
            limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
        }

        const result = await getManpowerPartnerServices(filters);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

// Get Partner Transactions List
export const getPartnerTransactionsController = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const filters = {
            date: req.query.date as string,
            fromDate: req.query.fromDate as string,
            toDate: req.query.toDate as string,
            partnerId: req.query.partner_id ? parseInt(req.query.partner_id as string) : undefined,
            page: req.query.page ? parseInt(req.query.page as string) : 1,
            limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
        }

        const result = await getPartnerTransactionServices(filters);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

// Get Partner Details
export const getPartnerDetailsController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const partnerId = parseInt(req.params.partnerId);
        const result = await getPartnerDetailServices(partnerId);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};