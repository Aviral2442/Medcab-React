import { Router } from 'express';
import { getPartnersController } from '../controllers/partner.controller';

const router = Router();

router.get('/get_partners_list', getPartnersController);

export default router;