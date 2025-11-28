import { Router } from 'express';
import multer from "multer";
import { addDriverController, driverDetailController, TotaldriverliveLocationController, driverOnOffDataController, driverLiveLocationController, fetchDriverController, getDriversController, updateDriverController } from '../controllers/driver.controller';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/get_drivers_list', getDriversController);

router.post(
    "/add_driver",
    upload.fields([
        { name: "driver_profile_img", maxCount: 1 },
        { name: "driver_details_dl_front_img", maxCount: 1 },
        { name: "driver_details_dl_back_image", maxCount: 1 },
        { name: "driver_details_aadhar_front_img", maxCount: 1 },
        { name: "driver_details_aadhar_back_img", maxCount: 1 },
        { name: "driver_details_pan_card_front_img", maxCount: 1 },
        { name: "driver_details_police_verification_image", maxCount: 1 }
    ]),
    addDriverController
);

router.put(
    "/update_driver/:driverId",
    upload.fields([
        { name: "driver_profile_img", maxCount: 1 },
        { name: "driver_details_dl_front_img", maxCount: 1 },
        { name: "driver_details_dl_back_image", maxCount: 1 },
        { name: "driver_details_aadhar_front_img", maxCount: 1 },
        { name: "driver_details_aadhar_back_img", maxCount: 1 },
        { name: "driver_details_pan_card_front_img", maxCount: 1 },
        { name: "driver_details_police_verification_image", maxCount: 1 }
    ]),
    updateDriverController
);

router.get("/get_driver/:driverId", fetchDriverController);

router.post('/driver_detail/:driverId', driverDetailController);
router.get('/driver_on_off_data', driverOnOffDataController);
router.get('/driver_live_location', TotaldriverliveLocationController);
router.post('/driver_live_location_on_map/:driverOnOffId', driverLiveLocationController);

export default router;