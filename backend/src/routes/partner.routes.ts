import { Router } from 'express';
import { getPartnersController, getManpowerPartnersController, getPartnerTransactionsController } from '../controllers/partner.controller';

const router = Router();

router.get('/get_partners_list', getPartnersController);
router.get('/get_manpower_partners_list', getManpowerPartnersController);
router.get('/get_partner_transactions_list', getPartnerTransactionsController);
export default router;