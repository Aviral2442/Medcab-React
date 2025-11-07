import { Router } from "express";
import { addRemarks, getUsers } from "../controllers/user.controller";

const router = Router();

router.get("/", getUsers);
router.post("/add_remarks/:id", addRemarks);

export default router;
