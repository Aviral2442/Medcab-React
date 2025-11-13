import Router from "express";
import { getBlogListController, addBlogController, editBlogController } from "../controllers/contentWriter/contentWriter.controller"
import multer from "multer";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/get_blogs_list", getBlogListController);
router.post("/add_blog", upload.single("blogs_image"), addBlogController);
router.put("/edit_blog/:id", upload.single("blogs_image"), editBlogController);

export default router;