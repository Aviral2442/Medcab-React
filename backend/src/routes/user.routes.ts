import { Router } from "express";
import { addRemarks, getCityController, getConsumerEmergencyListController, getDriverEmergencyListController, getRazorpayTransactions, getRemarksByIdController, getStateController, getUsers } from "../controllers/user.controller";

const router = Router();

// USER ROUTES
router.get("/", getUsers);

// REMARKS ROUTES
router.post("/add_remarks", addRemarks);
router.get("/get_remarks/:columnName/:primaryKey", getRemarksByIdController);

// DRIVER AND CONSUMER EMERGENCY LIST ROUTES
router.get("/driver_emergency_list", getDriverEmergencyListController);
router.get("/consumer_emergency_list", getConsumerEmergencyListController);

// STATE AND CITY ROUTES
router.get("/get_states", getStateController);
router.get("/get_cities/:stateId", getCityController);

// RAZORPAY TRANSACTIONS ROUTE
router.get("/razorpay_transactions", getRazorpayTransactions);

export default router;
