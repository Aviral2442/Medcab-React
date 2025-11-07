import { Router } from 'express';
import { vendorDetailController, vendorList } from '../controllers/vendor.controller';

const router = Router();

// VENDOR LIST ROUTE
router.get('/vendors_list', vendorList);
router.post('/vendor_detail/:vendorId', vendorDetailController);

export default router;