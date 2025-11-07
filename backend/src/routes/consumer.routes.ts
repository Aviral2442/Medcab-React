import { Router } from "express";
import { consumerDetailController, consumerListController, consumerTransactionList, consumerManpowerOrdersList, consumerAmbulanceBookingList, consumerLabBookingsList } from "../controllers/consumer.controller";

const router = Router();

router.get("/get_consumers_list", consumerListController);
router.post("/consumer_detail/:id", consumerDetailController);
router.post("/consumer_transaction_list/:id", consumerTransactionList);
router.post("/consumer_manpower_orders_list/:id", consumerManpowerOrdersList);
router.post("/consumer_ambulance_bookings_list/:id", consumerAmbulanceBookingList);
router.post("/consumer_lab_bookings_list/:id", consumerLabBookingsList);

export default router;