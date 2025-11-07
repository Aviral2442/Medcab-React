import { Request, Response, NextFunction } from 'express';
import { getVendorList, vendorDetailService } from '../services/vendor.service';

// GET VENDOR LIST CONTROLLER
export const vendorList = async (req: Request, res: Response, next: NextFunction) => {
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

    const vendorsList = await getVendorList(filters);

    // ✅ Safely check if vendors exist and are an array
    const vendorsArray = Array.isArray(vendorsList?.vendors) ? vendorsList.vendors : [];

    if (vendorsArray.length === 0) {
      return res.status(200).json({
        status: 200,
        message: "No vendors found",
        total: 0,
        page: vendorsList?.page ?? 1,
        limit: vendorsList?.limit ?? 10,
        totalPages: 0,
        jsonData: { vendors: [] },
      });
    }

    res.status(200).json({
      status: 200,
      message: "Vendor list fetched successfully",
      jsonData: {
        ...vendorsList,
        vendors: vendorsArray, // ensure it's an array
      },
    });
  } catch (error) {
    next(error);
  }
};

// VENDOR DETAIL CONTROLLER
export const vendorDetailController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const vendorId = parseInt(req.params.vendorId, 10);

    if (isNaN(vendorId)) {
      return res.status(400).json({
        status: 400,
        message: "Invalid vendor ID",
      });
    }

    const vendorDetails = await vendorDetailService(vendorId);

    if (!vendorDetails) {
      return res.status(404).json({
        status: 404,
        message: "Vendor not found",
      });
    }

    res.status(200).json({
      status: 200,
      message: "Vendor details fetched successfully",
      jsonData: vendorDetails,
    });
  } catch (error) {
    next(error);
  }
};
