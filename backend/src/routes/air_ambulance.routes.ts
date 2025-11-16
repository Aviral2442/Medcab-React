import { Router } from 'express';
import multer from 'multer';
import { addAirAmbulanceCategoryController, editAirAmbulanceCategoryController, getAirAmbulanceCategoryController, getAirAmbulanceCategoryListController, updateAirAmbulanceCategoryStatusController } from '../controllers/air_ambulance.controller';

const upload = multer({ storage: multer.memoryStorage() });

const router = Router();

router.get("/get_air_ambulance_category_list", getAirAmbulanceCategoryListController);
router.post("/add_air_ambulance_category", upload.single("air_ambulance_icon"), addAirAmbulanceCategoryController);
router.get("/get_air_ambulance_category/:id", getAirAmbulanceCategoryController);
router.put("/edit_air_ambulance_category/:id", upload.single("air_ambulance_icon"), editAirAmbulanceCategoryController);
router.patch("/update_air_ambulance_category_status/:id", updateAirAmbulanceCategoryStatusController);

export default router;