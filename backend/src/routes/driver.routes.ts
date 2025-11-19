import { Router } from 'express';
import { driverDetailController, driverOnOffDataController, driverOnOffMapLocationController, getDriversController } from '../controllers/driver.controller';

const router = Router();

router.get('/get_drivers_list', getDriversController);
router.post('/driver_detail/:driverId', driverDetailController);
router.get('/driver_on_off_data', driverOnOffDataController);
router.post('/driver_on_off_map_location/:driverOnOffId', driverOnOffMapLocationController);

export default router;