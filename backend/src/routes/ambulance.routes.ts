import { Router } from 'express';
import multer from 'multer';
import { addAmbulanceCategoryController, addAmbulanceFacilitiesRateController, addAmbulanceFaqController, ambulanceBookingDetailController, ambulanceBookingCountController, dashboardAmbulanceBookingController, dashboardAmbulanceDriverController, dashboardAmbulanceDriverTransController, dashboardAmbulancePartnerController, dashboardAmbulancePartnerTransController, dashboardAmbulanceVehicleController, editAmbulanceCategoryController, editAmbulanceFacilitiesRateController, editAmbulanceFaqController, getAmbulanceBookingListController, getAmbulanceCategoryController, getAmbulanceCategoryListController, getAmbulanceFacilitiesRateController, getAmbulanceFacilitiesRateListController, getAmbulanceFaqController, getAmbulanceFaqListController, getBulkAmbulanceBookingListController, getRegularAmbulanceBookingListController, getRentalAmbulanceBookingListController, updateAmbulanceBookingConsumerDetailsController, updateAmbulanceBookingScheduleTimeController, updateAmbulanceCategoryStatusController, updateAmbulanceFacilitiesRateStatusController, updateAmbulanceFaqStatusController, ambulancePartnerCountController, ambulanceCompleteOngoingCancelReminderBookingCountsController } from '../controllers/ambulance.controller';

const upload = multer({ storage: multer.memoryStorage() });

const router = Router();

// DASHBOARD AMBULANCE ROUTE
router.get('/ambulance_bookings_count', ambulanceBookingCountController);
router.get('/ambulance_partners_count', ambulancePartnerCountController);
router.get('/ambulance_booking_count', ambulanceCompleteOngoingCancelReminderBookingCountsController);
router.get('/dashboard_ambulance_bookings', dashboardAmbulanceBookingController);
router.get('/dashboard_ambulance_partners', dashboardAmbulancePartnerController);
router.get('/dashboard_ambulance_drivers', dashboardAmbulanceDriverController);
router.get('/dashboard_ambulance_vehicles', dashboardAmbulanceVehicleController);
router.get('/dashboard_ambulance_partner_transactions', dashboardAmbulancePartnerTransController);
router.get('/dashboard_ambulance_driver_transactions', dashboardAmbulanceDriverTransController);

// AMBULANCE CATEGORY ROUTER
router.get('/get_ambulance_categories_list', getAmbulanceCategoryListController);
router.post("/add_ambulance_category", upload.single("ambulance_category_icon"), addAmbulanceCategoryController);
router.get("/get_ambulance_category/:id", getAmbulanceCategoryController);
router.put("/edit_ambulance_category/:id", upload.single("ambulance_category_icon"), editAmbulanceCategoryController);
router.patch("/update_ambulance_category_status/:id", updateAmbulanceCategoryStatusController);

// AMBULANCE FAQ ROUTES
router.get("/get_ambulance_faq_list", getAmbulanceFaqListController);
router.post("/add_ambulance_faq", addAmbulanceFaqController);
router.get("/get_ambulance_faq/:id", getAmbulanceFaqController);
router.put("/edit_ambulance_faq/:id", editAmbulanceFaqController);
router.patch("/update_ambulance_faq_status/:id", updateAmbulanceFaqStatusController);

// AMBULANCE FACILITIES RATE ROUTES
router.get("/get_ambulance_facilities_rate_list", getAmbulanceFacilitiesRateListController);
router.post("/add_ambulance_facilities_rate", addAmbulanceFacilitiesRateController);
router.get("/get_ambulance_facilities_rate/:id", getAmbulanceFacilitiesRateController);
router.put("/edit_ambulance_facilities_rate/:id", editAmbulanceFacilitiesRateController);
router.patch("/update_ambulance_facilities_rate_status/:id", updateAmbulanceFacilitiesRateStatusController);

// Booking Routes
router.get('/get_ambulance_booking_list', getAmbulanceBookingListController);
router.get('/get_regular_ambulance_booking_list', getRegularAmbulanceBookingListController);
router.get('/get_rental_ambulance_booking_list', getRentalAmbulanceBookingListController);
router.get('/get_bulk_ambulance_booking_list', getBulkAmbulanceBookingListController);
router.get('/ambulance_booking_detail/:id', ambulanceBookingDetailController);
router.post('/create_ambulance_booking', ambulanceBookingDetailController);

// Booking Details Routes
router.put('/update_ambulance_booking_schedule_time/:bookingId', updateAmbulanceBookingScheduleTimeController);
router.put('/update_ambulance_booking_consumer_details/:bookingId', updateAmbulanceBookingConsumerDetailsController);

export default router;