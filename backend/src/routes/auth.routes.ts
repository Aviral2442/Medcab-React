import { Router } from "express";
import { register, login } from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);

// Protected route example
router.get("/profile", authMiddleware, (req, res) => {
  res.json({ message: "Protected route", user: (req as any).user });
});

export default router;
