import { Router } from "express";
import { getCategories, addCategory, editCategory, deleteCategory, getSubCategories, addSubCategory, editSubCategory, deleteSubCategory, getCoupons, addCoupon, editCoupon, deleteCoupon, getBanners, addBanner, editBanner, deleteBanner, getPriceMapper, editPriceMapper, deletePriceMapper, getAllFaqs, addFaq, updateFaq, deleteFaq } from "../controllers/manpower.controller";
import multer from "multer";

const router = Router();

const upload = multer({ storage: multer.memoryStorage() });

router.get("/get-category", getCategories);
router.post("/add-category", upload.single("mp_cat_image"), addCategory);
router.put('/edit-category/:id', upload.single("mp_cat_image"), editCategory);
router.delete('/delete-category/:id', deleteCategory);

router.get("/get-subcategory", getSubCategories);
router.post("/add-subcategory", upload.single("mpsc_image"), addSubCategory);
router.put("/edit-subcategory/:id", upload.single("file"), editSubCategory);
router.delete("/delete-subcategory/:id", deleteSubCategory);

router.get("/get-coupon", getCoupons);
router.post("/add-coupon", addCoupon);
router.put("/edit-coupon/:id", editCoupon);
router.delete("/delete-coupon/:id", deleteCoupon);

router.get("/get-banner", getBanners);
router.post("/add-banner", upload.single("file"), addBanner);
router.put("/edit-banner/:id", upload.single("banner_image"), editBanner);
router.delete("/delete-banner/:id", deleteBanner);

router.get("/get-price-mapper", getPriceMapper);
router.put("/edit-price-mapper/:id", editPriceMapper);
router.delete("/delete-price-mapper/:id", deletePriceMapper);

router.get("/get_faq", getAllFaqs);
router.post("/add_faq", addFaq);
router.put("/edit_faq/:id", updateFaq);
router.delete("/delete_faq/:id", deleteFaq);

export default router;