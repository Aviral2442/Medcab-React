import { Router } from 'express';
import multer from 'multer';
import { addAmbulanceCategoryController, addAmbulanceFaqController, editAmbulanceCategoryController, editAmbulanceFaqController, getAmbulanceCategoryController, getAmbulanceCategoryListController, getAmbulanceFaqController, getAmbulanceFaqListController, updateAmbulanceCategoryStatusController, updateAmbulanceFaqStatusController } from '../controllers/ambulance.controller';

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

export default router;