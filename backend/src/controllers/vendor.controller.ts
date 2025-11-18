import { Request, Response, NextFunction } from 'express';
import { getVendorList, vendorDetailService } from '../services/vendor.service';

// GET VENDOR LIST CONTROLLER
export const vendorListController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const filters = {
            date: req.query.date as string,
            fromDate: req.query.fromDate as string,
            toDate: req.query.toDate as string,
            status: req.query.status as string,
            page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
            limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 10,
        };

        const result = await getVendorList(filters);
        res.status(200).json(result);
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

    res.status(200).json(vendorDetails);
  } catch (error) {
    next(error);
  }
};
