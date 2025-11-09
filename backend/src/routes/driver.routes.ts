import { Router } from 'express';
import { getDriversController } from '../controllers/driver.controller';

const router = Router();

router.get('/get_drivers_list', getDriversController);

export default router;