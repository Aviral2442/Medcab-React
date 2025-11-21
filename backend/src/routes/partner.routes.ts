import { Router } from 'express';
import multer from "multer";
import { getPartnersController, getManpowerPartnersController, getPartnerTransactionsController, getPartnerDetailsController, addPartnerController, fetchPartnerByIdController, updatePartnerController } from '../controllers/partner.controller';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/get_partners_list', getPartnersController);
router.post("/add_partner", upload.fields([{ name: "partner_profile_img", maxCount: 1 }, { name: "partner_aadhar_front", maxCount: 1 }, { name: "partner_aadhar_back", maxCount: 1 },]), addPartnerController);
router.get('/fetch_partner_by_id/:partnerId', fetchPartnerByIdController);
router.put("/update_partner/:partnerId", upload.fields([{ name: "partner_profile_img", maxCount: 1 }, { name: "partner_aadhar_front", maxCount: 1 }, { name: "partner_aadhar_back", maxCount: 1 },]), updatePartnerController);

router.get('/get_partner_transactions_list', getPartnerTransactionsController);
router.post('/get_partner_details/:partnerId', getPartnerDetailsController);


router.get('/get_manpower_partners_list', getManpowerPartnersController);
export default router;