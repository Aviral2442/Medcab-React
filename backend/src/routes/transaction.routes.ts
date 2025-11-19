import { Router } from "express";
import { consumerTransactionList, driverTransDataController, getDriverTransactionListController, vendorTransactionList,  } from "../controllers/transaction.controller";

const router = Router();

// CONSUMER TRANSACTION ROUTES
router.get("/consumer_transaction_list", consumerTransactionList);

// VENDOR TRANSACTION ROUTES
router.get("/vendor_transaction_list", vendorTransactionList);

// DRIVER TRANSACTION ROUTES
router.get("/driver_transaction_list", getDriverTransactionListController);
router.get("/driver_transaction_data/:id", driverTransDataController);

export default router;