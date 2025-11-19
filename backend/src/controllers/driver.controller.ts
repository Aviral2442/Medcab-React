import { Request, Response, NextFunction } from 'express';
import { driverDetailService, getDriverService } from '../services/driver.service';

// Get Drivers List
export const getDriversController = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const filters = {
            date: req.query.date as string,
            status: req.query.status as string,
            fromDate: req.query.fromDate as string,
            toDate: req.query.toDate as string,
            page: req.query.page ? parseInt(req.query.page as string) : 1,
            limit: req.query.limit ? parseInt(req.query.limit as string) : 100,
        };

        const result = await getDriverService(filters);
        res.status(200).json(result);

    } catch (error) {
        next(error);
    }

};

// Get Driver Detail
export const driverDetailController = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const driverId = parseInt(req.params.id);

        if (isNaN(driverId)) {
            return res.status(400).json({ message: 'Invalid driver ID' });
        }

        const result = await driverDetailService(driverId);
        res.status(200).json(result);

    } catch (error) {
        next(error);
    }
}
