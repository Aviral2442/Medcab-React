import { Router } from "express";
import { consumerTransactionList, vendorTransactionList,  } from "../controllers/transaction.controller";

const router = Router();

router.get("/consumer_transaction_list", consumerTransactionList);
router.get("/vendor_transaction_list", vendorTransactionList);

export default router;