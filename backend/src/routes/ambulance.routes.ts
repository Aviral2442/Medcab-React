import { Router } from 'express';
import multer from 'multer';
import { addAmbulanceCategoryController, addAmbulanceFacilitiesRateController, addAmbulanceFaqController, editAmbulanceCategoryController, editAmbulanceFacilitiesRateController, editAmbulanceFaqController, getAmbulanceCategoryController, getAmbulanceCategoryListController, getAmbulanceFacilitiesRateController, getAmbulanceFacilitiesRateListController, getAmbulanceFaqController, getAmbulanceFaqListController, updateAmbulanceCategoryStatusController, updateAmbulanceFacilitiesRateStatusController, updateAmbulanceFaqStatusController } from '../controllers/ambulance.controller';

const upload = multer({ storage: multer.memoryStorage() });

const router = Router();

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

export default router;