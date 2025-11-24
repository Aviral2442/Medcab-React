import { Request, Response, NextFunction } from 'express';
import { consumerDetailService, getConsumerList, getConsumerTransactionList, getConsumerManpowerOrdersList, getConsumerAmbulanceBookingsList, getConsumerLabBookingsList } from '../services/consumer.service';
import { parse } from 'path';

// CONTROLLER TO GET CONSUMER LIST WITH FILTERS AND PAGINATION
export const consumerListController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const filters = {
            date: req.query.date as string,
            status: req.query.status as string,
            fromDate: req.query.fromDate as string,
            toDate: req.query.toDate as string,
            page: req.query.page ? parseInt(req.query.page as string) : 1,
            limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
        };

        const result = await getConsumerList(filters);
        res.status(200).json(result);

    } catch (error) {
        next(error);
    }
};

// CONTROLLER TO GET CONSUMER DETAIL BY ID
export const consumerDetailController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const consumerId = parseInt(req.params.id);
        const result = await consumerDetailService(consumerId);
        res.status(200).json(result);

    } catch (error) {
        next(error);
    }
};

// CONSUMER TRANSACTION LIST CONTROLLER
export const consumerTransactionList = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const consumerId = parseInt(req.params.id);
        const transList = await getConsumerTransactionList(consumerId);
        res.status(200).json(transList);

    } catch (error) {
        next(error);
    }
}

// CONSUMER MANPOWER ORDERS LIST CONTROLLER
export const consumerManpowerOrdersList = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const consumerId = parseInt(req.params.id);
        const ordersList = await getConsumerManpowerOrdersList(consumerId);
        res.status(200).json(ordersList);

    } catch (error) {
        next(error);
    }

}

// CONSUMER AMBULANCE BOOKING LIST CONTROLLER
export const consumerAmbulanceBookingList = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const consumerId = parseInt(req.params.id);
        const bookingList = await getConsumerAmbulanceBookingsList(consumerId);
        res.status(200).json(bookingList);

    } catch (error) {
        next(error);
    }

};

// CONSUMER LAB BOOKINGS LIST CONTROLLER
export const consumerLabBookingsList = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const consumerId = parseInt(req.params.id);
        const bookingList = await getConsumerLabBookingsList(consumerId);
        res.status(200).json(bookingList);

    } catch (error) {
        next(error);
    }
};