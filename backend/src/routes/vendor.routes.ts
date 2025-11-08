import { Router } from 'express';
import { vendorDetailController, vendorListController } from '../controllers/vendor.controller';

const router = Router();

// VENDOR LIST ROUTE
router.get('/vendors_list', vendorListController);
router.post('/vendor_detail/:vendorId', vendorDetailController);

export default router;