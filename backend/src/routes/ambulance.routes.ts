import { Router } from 'express';
import { getAmbulanceCategoryListController } from '../controllers/ambulance.controller';

const router = Router();

// AMBULANCE CATEGORY ROUTER
router.get('/get_ambulance_categories_list', getAmbulanceCategoryListController);

export default router;