import { Router } from 'express';
import { driverDetailController, getDriversController } from '../controllers/driver.controller';

const router = Router();

router.get('/get_drivers_list', getDriversController);
router.post('/driver_detail/:id', driverDetailController);

export default router;