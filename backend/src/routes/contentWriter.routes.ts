import Router from "express";
import { getBlogListController, addBlogController } from "../controllers/contentWriter/contentWriter.controller"
import multer from "multer";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/get_blogs_list", getBlogListController);
router.post("/add_blog", upload.single("blogs_image"), addBlogController);

export default router;