import { Router } from 'express';
import multer from "multer";
import { addVehicleController, getVehicleController, getVehicleListController, updateVehicleController } from '../controllers/vehicle.controller';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/get_vehicle_list", getVehicleListController);

router.post(
    "/add_vehicle",
    upload.fields([
        { name: "vehicle_front_image", maxCount: 1 },
        { name: "vehicle_back_image", maxCount: 1 },
        { name: "vehicle_rc_image", maxCount: 1 },
        { name: "vehicle_details_fitness_certi_img", maxCount: 1 },
        { name: "vehicle_details_insurance_img", maxCount: 1 },
        { name: "vehicle_details_pollution_img", maxCount: 1 }
    ]),
    addVehicleController
);

router.get("/get_vehicle/:vehicleId", getVehicleController);

router.put(
    "/update_vehicle/:vehicleId",
    upload.fields([
        { name: "vehicle_front_image", maxCount: 1 },
        { name: "vehicle_back_image", maxCount: 1 },
        { name: "vehicle_rc_image", maxCount: 1 },
        { name: "vehicle_details_fitness_certi_img", maxCount: 1 },
        { name: "vehicle_details_insurance_img", maxCount: 1 },
        { name: "vehicle_details_pollution_img", maxCount: 1 }
    ]),
    updateVehicleController
);


export default router;