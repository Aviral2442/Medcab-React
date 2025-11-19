import { Router } from "express";
import { consumerTransactionList, getDriverTransactionListController, vendorTransactionList,  } from "../controllers/transaction.controller";

const router = Router();

router.get("/consumer_transaction_list", consumerTransactionList);
router.get("/vendor_transaction_list", vendorTransactionList);
router.get("/driver_transaction_list", getDriverTransactionListController);

export default router;