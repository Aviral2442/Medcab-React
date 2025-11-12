import { Request, Response, NextFunction } from 'express';
import {
  getConsumersCounts,
  getLatest5BookingTransList,
  getLatest5VendorTransList,
  getLatestNewOngoingBookingList,
  getNewAndOngoingBookingList,
  getTotalActiveOtherStatusVendorCounts,
  getTotalBookingCount,
  getTotalCancelOngoingBookingCounts,
  getVendorTodayYesterdayCountService
} from '../services/dashboard.service';

// Helper to check if data is empty
const isEmpty = (data: any): boolean => {
  if (!data) return true;
  if (Array.isArray(data)) return data.length === 0;
  if (typeof data === 'object') return Object.keys(data).length === 0;
  return false;
};

// Total Booking Count
export const totalBookingCount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bookingCounts = await getTotalBookingCount();
    res.status(200).json({
      status: 200,
      message: 'Total Booking Count Fetch Successful',
      jsonData: bookingCounts
    });
  } catch (error) {
    next(error);
  }
};

// Total, Cancelled and Ongoing Booking Counts
export const totalCancelOngoingBookingCounts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bookingCounts = await getTotalCancelOngoingBookingCounts();
    if (isEmpty(bookingCounts)) {
      return res.status(404).json({ status: 404, message: 'No Data Found' });
    }
    res.status(200).json({
      status: 200,
      message: 'Total, Cancelled and Ongoing Booking Counts Fetch Successful',
      jsonData: bookingCounts
    });
  } catch (error) {
    next(error);
  }
};

// Total, Active and Other Status Vendor Counts
export const totalActiveOtherStatusVendorCounts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const vendorStatusCounts = await getTotalActiveOtherStatusVendorCounts();
    if (isEmpty(vendorStatusCounts)) {
      return res.status(404).json({ status: 404, message: 'No Data Found' });
    }
    res.status(200).json({
      status: 200,
      message: 'Total, Active and Other Status Vendor Counts Fetch Successful',
      jsonData: vendorStatusCounts
    });
  } catch (error) {
    next(error);
  }
};

// Latest 5 Vendor Transaction List
export const latestVendorTransList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const vendorTransList = await getLatest5VendorTransList();
    if (isEmpty(vendorTransList)) {
      return res.status(404).json({ status: 404, message: 'No Data Found' });
    }
    res.status(200).json({
      status: 200,
      message: 'Latest 5 Vendor Transaction List Fetch Successful',
      jsonData: vendorTransList
    });
  } catch (error) {
    next(error);
  }
};

// Latest 5 Booking Transaction List
export const latestBookingTransactionList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bookingTransList = await getLatest5BookingTransList();
    if (isEmpty(bookingTransList)) {
      return res.status(404).json({ status: 404, message: 'No Data Found' });
    }
    res.status(200).json({
      status: 200,
      message: 'Latest 5 Booking Transaction List Fetch Successful',
      jsonData: bookingTransList
    });
  } catch (error) {
    next(error);
  }
};

// Latest Booking List of New and Ongoing
export const latestBookingListOfNewOngoing = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bookingList = await getLatestNewOngoingBookingList();
    if (isEmpty(bookingList)) {
      return res.status(404).json({ status: 404, message: 'No Data Found' });
    }
    res.status(200).json({
      status: 200,
      message: 'Latest Booking List of New and Ongoing Fetch Successful',
      jsonData: bookingList
    });
  } catch (error) {
    next(error);
  }
};

// Consumer Counts
export const consumerCount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const consumerCounts = await getConsumersCounts();
    if (isEmpty(consumerCounts)) {
      return res.status(404).json({ status: 404, message: 'No Data Found' });
    }
    res.status(200).json({
      status: 200,
      message: 'Consumer Counts Fetch Successful',
      jsonData: consumerCounts
    });
  } catch (error) {
    next(error);
  }
};

// New and Ongoing Booking List
export const newOngoingBookingList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bookingList = await getNewAndOngoingBookingList();
    if (isEmpty(bookingList)) {
      return res.status(404).json({ status: 404, message: 'No Data Found' });
    }
    res.status(200).json({
      status: 200,
      message: 'New and Ongoing Booking List Fetch Successful',
      jsonData: bookingList
    });
  } catch (error) {
    next(error);
  }
};

// Consumer Today and Yesterday Counts
export const getVendorTodayYesterdayCountController = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const result = await getVendorTodayYesterdayCountService();
    res.status(200).json(result);

  } catch (error) {
    next(error);
  }
};
