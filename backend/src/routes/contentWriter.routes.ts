import Router from "express";
import { getBlogListController, getBlogController, addBlogController, editBlogController, updateBlogStatusController, getCityContentController, addCityContentController, fetchCityContentController } from "../controllers/contentWriter/contentWriter.controller"
import multer from "multer";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/get_blogs_list", getBlogListController);
router.post("/add_blog", upload.single("blogs_image"), addBlogController);
router.get("/get_blog/:id", getBlogController);
router.put("/edit_blog/:id", upload.single("blogs_image"), editBlogController);
router.patch("/update_blog_status/:id", updateBlogStatusController);

router.get("/get_city_content", getCityContentController);
router.post("/add_city_content", upload.single("city_thumbnail"), addCityContentController);
router.get("/fetch_city_content/:id", fetchCityContentController);

export default router;