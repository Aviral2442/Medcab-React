import { Request, Response, NextFunction } from "express";
import { driverTransDataService, getConsumerTransactionList, getDriverTransactionListService, getVendorTransactionList, vendorTransDataService } from "../services/transaction.service";

// GET CONSUMER TRANSACTION LIST CONTROLLER
export const consumerTransactionList = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await getConsumerTransactionList();

        res.status(200).json({
            status: 200,
            message: "Consumer transaction list fetched successfully",
            jsonData: result,
        });

    } catch (error) {
        next(error);
    }
};

// GET VENDOR TRANSACTION LIST CONTROLLER
export const vendorTransactionList = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await getVendorTransactionList();
        res.status(200).json({
            status: 200,
            message: "Vendor transaction list fetched successfully",
            jsonData: result,
        });
    } catch (error) {
        next(error);
    }
};

// GET VENDOR TRANSACTION DATA CONTROLLER
export const vendorTransDataController = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const vendorId = parseInt(req.params.id);
        if (isNaN(vendorId)) {
            return res.status(400).json({ message: 'Invalid vendor ID' });
        }

        const result = await vendorTransDataService(vendorId);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

// GET DRIVER TRANSACTION LIST CONTROLLER
export const getDriverTransactionListController = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const filters = {
            date: req.query.date as string,
            status: req.query.status as string,
            fromDate: req.query.fromDate as string,
            toDate: req.query.toDate as string,
            page: req.query.page ? parseInt(req.query.page as string) : 1,
            limit: req.query.limit ? parseInt(req.query.limit as string) : 100,
        };

        const result = await getDriverTransactionListService(filters);
        res.status(200).json(result);

    } catch (error) {
        next(error);
    }
};

// GET DRIVER TRANSACTION DATA CONTROLLER
export const driverTransDataController = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const driverId = parseInt(req.params.id);
        if (isNaN(driverId)) {
            return res.status(400).json({ message: 'Invalid driver ID' });
        }
        const result = await driverTransDataService(driverId);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};