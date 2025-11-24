import { Router } from "express";
import { addRemarks, getCityController, getConsumerEmergencyListController, getDriverEmergencyListController, getRazorpayTransactions, getStateController, getUsers } from "../controllers/user.controller";

const router = Router();

router.get("/", getUsers);
router.post("/add_remarks", addRemarks);

router.get("/driver_emergency_list", getDriverEmergencyListController);
router.get("/consumer_emergency_list", getConsumerEmergencyListController);

router.get("/get_states", getStateController);
router.get("/get_cities/:stateId", getCityController);

router.get("/razorpay_transactions", getRazorpayTransactions);

export default router;
