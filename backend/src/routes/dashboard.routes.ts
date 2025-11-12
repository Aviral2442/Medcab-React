import { Router } from 'express';
import { consumerCount, latestBookingListOfNewOngoing, latestBookingTransactionList, latestVendorTransList, newOngoingBookingList, totalActiveOtherStatusVendorCounts, totalBookingCount, totalCancelOngoingBookingCounts, getVendorTodayYesterdayCountController } from '../controllers/dashboard.controller';
const router = Router();

router.get('/get_total_booking_count', totalBookingCount);
router.get('/get_total_cancel_ongoing_booking_counts', totalCancelOngoingBookingCounts);
router.get('/get_total_active_other_status_vendor_counts', totalActiveOtherStatusVendorCounts);
router.get('/get_latest_5_vendor_transaction_list', latestVendorTransList);
router.get('/get_latest_5_booking_transaction_list', latestBookingTransactionList);
router.get('/latest_new_ongoing_booking_lists', latestBookingListOfNewOngoing);
router.get('/get_consumer_counts', consumerCount);
router.get('/get_new_ongoing_booking_list', newOngoingBookingList);
router.get('/get_vendor_today_yesterday_counts', getVendorTodayYesterdayCountController);

export default router;