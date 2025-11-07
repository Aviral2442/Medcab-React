import { Request, Response, NextFunction } from "express";
import { getAllBookings, getBookingDetailById, getBookingTransactionListById, getBookingPickUpCityVendorListById, getBookingRejectListById, getBookingAcceptListById, insertBookingRemarksById, updateBookingDataById } from "../services/booking.service";
import { ApiError } from "../utils/api-error";

// GET ALL BOOKINGS LISTS CONTROLLER
export const getBookings = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { date, fromDate, toDate, status, page, limit } = req.query;

        const filters = {
            date: date as string,
            fromDate: fromDate as string,
            toDate: toDate as string,
            status: status as string,
            page: page ? parseInt(page as string, 10) : undefined,
            limit: limit ? parseInt(limit as string, 10) : undefined,
        };

        const bookings = await getAllBookings(filters);

        // ✅ Fixed: Check bookings.data.length instead of bookings.length
        if (!bookings.data || bookings.data.length === 0) {
            return res.status(404).json({
                status: 404,
                message: "No bookings found",
                total: 0,
                page: filters.page || 1,  // ✅ Fixed: Use filters.page (or default) instead of bookings.page
                limit: filters.limit || 12,  // ✅ Fixed: Use filters.limit (or default) instead of bookings.limit
                totalPages: 0,
                bookings: [],
            });
        }

        res.status(200).json({
            status: 200,
            message: "Bookings fetched successfully",
            total: bookings.total,
            page: bookings.page,
            limit: bookings.limit,
            totalPages: bookings.totalPages,
            bookings: bookings.data,  // ✅ Already correct, but ensured for clarity
        });
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