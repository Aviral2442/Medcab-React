import { Router } from 'express';
import { getPartnersController, getManpowerPartnersController } from '../controllers/partner.controller';

const router = Router();

router.get('/get_partners_list', getPartnersController);
router.get('/get_manpower_partners_list', getManpowerPartnersController);
export default router;