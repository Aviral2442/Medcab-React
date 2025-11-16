import { Router } from "express";
import { addRemarks, getDriverEmergencyListController, getUsers } from "../controllers/user.controller";

const router = Router();

router.get("/", getUsers);
router.post("/add_remarks/:id", addRemarks);

router.get("/driver_emergency_list", getDriverEmergencyListController);

export default router;
