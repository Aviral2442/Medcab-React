import { Request, Response, NextFunction } from "express";
import { getConsumerTransactionList, getVendorTransactionList } from "../services/transaction.service";

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