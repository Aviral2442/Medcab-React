import { Router } from "express";
import { addRemarks, getConsumerEmergencyListController, getDriverEmergencyListController, getUsers } from "../controllers/user.controller";

const router = Router();

router.get("/", getUsers);
router.post("/add_remarks/:id", addRemarks);

router.get("/driver_emergency_list", getDriverEmergencyListController);
router.get("/consumer_emergency_list", getConsumerEmergencyListController);

export default router;
