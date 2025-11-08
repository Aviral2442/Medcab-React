import { Router } from 'express';
import { getBookings, bookingDetail, bookingTransactionList, bookingPickUpCityVendorList, bookingRejectList, bookingAcceptList, insertBookingRemarks, bookingDataUpdateController } from '../controllers/booking.controller';

const router = Router();

router.get('/get_bookings', getBookings);
router.post('/booking_detail/:id', bookingDetail);
router.post('/booking_transaction_list/:id', bookingTransactionList);
router.post('/booking_pickup_city_vendor_list/:id', bookingPickUpCityVendorList);
router.post('/booking_reject_list/:id', bookingRejectList);
router.post('/booking_accept_list/:id', bookingAcceptList);
router.post('/insert_booking_remarks/:id', insertBookingRemarks);
router.put('/booking_data_update/:bookingId', bookingDataUpdateController);

export default router;