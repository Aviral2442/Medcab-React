import Router from "express";
import { getBlogListController, getBlogController, addBlogController, editBlogController, updateBlogStatusController, getCityContentController, addCityContentController, fetchCityContentController, editCityContentController, updateCityContentStatusController, getCityContentFaqListController, addCityContentFaqController, fetchCityContentFaqController, editCityContentFaqController, updateCityContentFaqStatusController, updateCityContentVideoConsultStatusController, editCityContentVideoConsultController, fetchCityContentVideoConsultController, addCityContentVideoConsultController, getCityContentVideoConsultController, updateCityContentManpowerStatusController, editCityContentManpowerController, fetchCityContentManpowerController, addCityContentManpowerController, getCityContentManpowerController, updateCityContentPathologyStatusController, editCityContentPathologyController, fetchCityContentPathologyController, addCityContentPathologyController, getCityContentPathologyController } from "../controllers/contentWriter/contentWriter.controller"
import multer from "multer";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// ----------------------------------------------- BLOGS ROUTER's ------------------------------------------------- //
router.get("/get_blogs_list", getBlogListController);
router.post("/add_blog", upload.single("blogs_image"), addBlogController);
router.get("/get_blog/:id", getBlogController);
router.put("/edit_blog/:id", upload.single("blogs_image"), editBlogController);
router.patch("/update_blog_status/:id", updateBlogStatusController);

// ----------------------------------------- AMBULANCE CITY CONTENT ROUTER's ------------------------------------------ //
router.get("/get_city_content", getCityContentController);
router.post("/add_city_content", upload.single("city_thumbnail"), addCityContentController);
router.get("/fetch_city_content/:id", fetchCityContentController);
router.put("/edit_city_content/:id", upload.single("city_thumbnail"), editCityContentController);
router.patch("/update_city_content_status/:id", updateCityContentStatusController);

// CITY CONTENT FAQ ROUTER's
router.get("/get_city_content_faq_list", getCityContentFaqListController);
router.post("/add_city_content_faq", addCityContentFaqController);
router.get("/fetch_city_content_faq/:id", fetchCityContentFaqController);
router.put("/edit_city_content_faq/:id", editCityContentFaqController);
router.patch("/update_city_content_faq_status/:id", updateCityContentFaqStatusController);

// ----------------------------------------- MANPOWER CITY CONTENT ROUTER's ------------------------------------------ //


router.get("/get_manpower_city_content", getCityContentManpowerController);
router.post("/add_manpower_city_content", upload.single("city_thumbnail"), addCityContentManpowerController);
router.get("/fetch_manpower_city_content/:id", fetchCityContentManpowerController);
router.put("/edit_manpower_city_content/:id", upload.single("city_thumbnail"), editCityContentManpowerController);
router.patch("/update_manpower_city_content_status/:id", updateCityContentManpowerStatusController);


// ----------------------------------------- VIDEO CONSULTANCY CITY CONTENT ROUTER's ---------------------------------- //


router.get("/get_video_consult_city_content", getCityContentVideoConsultController);
router.post("/add_video_consult_city_content", upload.single("city_thumbnail"), addCityContentVideoConsultController);
router.get("/fetch_video_consult_city_content/:id", fetchCityContentVideoConsultController);
router.put("/edit_video_consult_city_content/:id", upload.single("city_thumbnail"), editCityContentVideoConsultController);
router.patch("/update_video_consult_city_content_status/:id", updateCityContentVideoConsultStatusController);


// ----------------------------------------- PATHOLOGY CITY CONTENT ROUTER's ------------------------------------------ //


router.get("/get_pathology_city_content", getCityContentPathologyController);
router.post("/add_pathology_city_content", upload.single("city_thumbnail"), addCityContentPathologyController);
router.get("/fetch_pathology_city_content/:id", fetchCityContentPathologyController);
router.put("/edit_pathology_city_content/:id", upload.single("city_thumbnail"), editCityContentPathologyController);
router.patch("/update_pathology_city_content_status/:id", updateCityContentPathologyStatusController);



export default router;