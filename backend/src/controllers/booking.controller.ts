import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/api-error";
import { getAllBookings, getBookingDetailById, getBookingTransactionListById, getBookingPickUpCityVendorListById, getBookingRejectListById, getBookingAcceptListById, insertBookingRemarksById, updateBookingDataById } from "../services/booking.service";

// GET ALL BOOKINGS LISTS CONTROLLER
export const getBookings = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const filters = {
            date: req.query.date as string,
            fromDate: req.query.fromDate as string,
            toDate: req.query.toDate as string,
            status: req.query.status as string,
            page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
            limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 10,
        };

        const result = await getAllBookings(filters);

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

// BOOKING DETAIL CONTROLLER
export const bookingDetail = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const bookingId = parseInt(req.params.id);

        const bookingDetail = await getBookingDetailById(bookingId);

        res.status(200).json({
            status: 200,
            message: "Booking detail fetched successfully",
            jsonData: bookingDetail,
        });

    } catch (error) {
        next(error);
    }

};

// BOOKING TRANSACTION LIST CONTROLLER
export const bookingTransactionList = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const bookingId = parseInt(req.params.id);
        const bookingTransList = await getBookingTransactionListById(bookingId);

        res.status(200).json({
            status: 200,
            message: "Booking transaction list fetched successfully",
            jsonData: bookingTransList,
        });

    } catch (error) {
        next(error);
    }
}

// BOOKING PICKUP CITY VENDOR LIST CONTROLLER
export const bookingPickUpCityVendorList = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const bookingId = parseInt(req.params.id);
        const vendorList = await getBookingPickUpCityVendorListById(bookingId);

        res.status(200).json({
            status: 200,
            message: "Booking pickup city vendor list fetched successfully",
            jsonData: vendorList,
        });

    } catch (error) {
        next(error);
    }
}

// BOOKING REJECT LIST CONTROLLER 
export const bookingRejectList = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const bookingId = parseInt(req.params.id);
        const rejectList = await getBookingRejectListById(bookingId);

        res.status(200).json({
            status: 200,
            message: "Booking reject list fetched successfully",
            jsonData: rejectList,
        });
    } catch (error) {
        next(error);
    }
}

// BOOKING ACCEPT LIST CONTROLLER
export const bookingAcceptList = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const bookingId = parseInt(req.params.id);
        const bookingAcceptList = await getBookingAcceptListById(bookingId);

        res.status(200).json({
            status: 200,
            message: "Booking accept list fetched successfully",
            jsonData: bookingAcceptList,
        });

    } catch (error) {
        next(error);
    }
}

// INSERT BOOKING REMARKS CONTROLLER 
export const insertBookingRemarks = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const bookingId = parseInt(req.params.id);
        const { remarkType, remarks } = req.body;

        const result = await insertBookingRemarksById(bookingId, remarkType, remarks);

        res.status(200).json({
            status: 200,
            message: "Booking remarks inserted successfully",
        });

    } catch (error) {
        next(error);
    }
};

// BOOKING DATA UPDATE CONTROLLER
export const bookingDataUpdateController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const manpower_order_id = Number(req.params.bookingId); // ✅ match with route param
        const updates = req.body;

        if (!manpower_order_id) throw new ApiError(400, "manpower_order_id is required");
        if (!updates || Object.keys(updates).length === 0)
            throw new ApiError(400, "No fields provided for update");

        const result = await updateBookingDataById(manpower_order_id, updates);

        res.status(200).json({
            status: 200,
            message: "Booking updated successfully",
            updatedFields: result.updatedFields,
        });
    } catch (error: any) {
        console.error("❌ Error in bookingDataUpdateController:", error);
        next(new ApiError(500, error.message || "Failed to update booking"));
    }
};