import { Request, Response, NextFunction } from 'express';
import { getPartnerServices, getManpowerPartnerServices, getPartnerTransactionServices } from '..//services/partner.service';

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
            // status: req.query.status as string,
            fromDate: req.query.fromDate as string,
            toDate: req.query.toDate as string,
            page: req.query.page ? parseInt(req.query.page as string) : 1,
            limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
        }

        const result = await getPartnerTransactionServices(filters);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};