import { Router } from 'express';
import { getPartnersController, getManpowerPartnersController, getPartnerTransactionsController, getPartnerDetailsController } from '../controllers/partner.controller';

const router = Router();

router.get('/get_partners_list', getPartnersController);
router.get('/get_manpower_partners_list', getManpowerPartnersController);
router.get('/get_partner_transactions_list', getPartnerTransactionsController);
router.post('/get_partner_details/:partnerId', getPartnerDetailsController);
export default router;