import { Request, Response, NextFunction } from "express";
import { getCategoriesService } from "../services/manpower.service";
import { addCategoryService } from "../services/manpower.service";
import { editCategoryService } from "../services/manpower.service";
import { deleteCategoryService } from "../services/manpower.service";
import { addSubCategoryService } from "../services/manpower.service";
import { getSubCategoriesService } from "../services/manpower.service";
import { editSubCategoryService } from "../services/manpower.service";
import { deleteSubCategoryService } from "../services/manpower.service";
import { getCouponsService } from "../services/manpower.service";
import { addCouponService } from "../services/manpower.service";
import { editCouponService } from "../services/manpower.service";
import { deleteCouponService } from "../services/manpower.service";
import { getBannersService } from "../services/manpower.service";
import { addBannerService } from "../services/manpower.service";
import { editBannerService } from "../services/manpower.service";
import { deleteBannerService } from "../services/manpower.service";
import { getPriceMapperService } from "../services/manpower.service";
import { editPriceMapperService } from "../services/manpower.service";
import { deletePriceMapperService } from "../services/manpower.service";
import { getAllFaqsService } from "../services/manpower.service";
import { addFaqService } from "../services/manpower.service";
import { updateFaqService } from "../services/manpower.service";
import { deleteFaqService } from "../services/manpower.service";





// Get All Categories
export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await getCategoriesService();

    if (categories.length === 0) {
      return res.status(404).json({ message: "No Category Found", categories: [] });
    }

    res.status(200).json({ message: "Categories fetched", categories });
  } catch (error) {
    next(error);
  }
};

// Add Category
export const addCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Extract data from request body
    const { mp_cat_name, mp_cat_top_rated_status, mp_cat_status } = req.body;
    const file = req.file; // file uploaded via multer

    const category = await addCategoryService({
      mp_cat_name,
      mp_cat_top_rated_status,
      mp_cat_status,
      file,
    });

    res.status(201).json({ message: "Category added successfully!", category });
  } catch (error) {
    next(error);
  }
};


// Edit Category
export const editCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { mp_cat_name, mp_cat_top_rated_status, mp_cat_status } = req.body;
    const file = req.file;
    const mp_cat_id = req.params.id;

    if (!mp_cat_id) {
      return res.status(400).json({ message: "Category ID is required" });
    }

    const category = await editCategoryService({
      mp_cat_id: Number(mp_cat_id),
      mp_cat_name,
      mp_cat_top_rated_status,
      mp_cat_status,
      file,
    });

    res.status(200).json({ message: "Category updated successfully!", category });
  } catch (error) {
    next(error);
  }
};


// Delete Category
export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Category ID is required" });
    }
    console.log("ID", id);
    console.log("NumberID", Number(id));
    const deletedCategory = await deleteCategoryService(Number(id));

    res.status(200).json({
      message: "Category deleted successfully!",
      deletedCategory,
    });
  } catch (error) {
    next(error);
  }
};


// Get All SubCategories
export const getSubCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const subCategories = await getSubCategoriesService();

    res.status(200).json({
      message: "Subcategories fetched successfully",
      subCategories,
    });
  } catch (error) {
    next(error);
  }
};

// Add SubCategory
export const addSubCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // console.log(req.body);
    const {
      mpsc_category_id,
      mpsc_name,
      mpsc_overview,
      mpsc_description,
      mpsc_gst_percentage,
      mpsc_emergency_status,
      mpsc_popular_status,
      mpsc_status,
      mpsc_visit_rate,
      mpsc_day_rate,
      mpsc_month_rate,
      mpsc_gender,
      mpsc_city
    } = req.body;

    const file = req.file;

    if (!mpsc_category_id || !mpsc_name || !mpsc_gst_percentage) {
      return res.status(400).json({ message: "Required fields missing!" });
    }

    const subCategory = await addSubCategoryService({
      mpsc_category_id: Number(mpsc_category_id),
      mpsc_name,
      mpsc_overview,
      mpsc_description,
      mpsc_gst_percentage: Number(mpsc_gst_percentage),
      mpsc_emergency_status: mpsc_emergency_status,
      mpsc_popular_status: mpsc_popular_status,
      mpsc_status: mpsc_status,
      file,
      mpsc_visit_rate,
      mpsc_day_rate,
      mpsc_month_rate,
      mpsc_gender,
      mpsc_city
    });

    res.status(201).json({ message: "Sub Category added successfully!", subCategory });
  } catch (error) {
    next(error);
  }
};


// Edit SubCategory
export const editSubCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const subCategoryId = parseInt(req.params.id);
    const updated = await editSubCategoryService(subCategoryId, {
      ...req.body,
      file: req.file, // multer handles file upload
    });

    res.status(200).json({
      message: "Subcategory updated successfully",
      subCategory: updated,
    });
  } catch (error) {
    next(error);
  }
};


// Delete SubCategory
export const deleteSubCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const subCategoryId = parseInt(req.params.id);
    const deleted = await deleteSubCategoryService(subCategoryId);

    res.status(200).json({
      message: "Subcategory deleted successfully",
      deleted,
    });
  } catch (error) {
    next(error);
  }
};


// Get Coupons
export const getCoupons = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const coupons = await getCouponsService();

    if (coupons.length === 0) {
      return res.status(404).json({ message: "No Coupons Found", coupons: [] });
    }

    res.status(200).json({ message: "Coupons fetched", coupons });
  } catch (error) {
    next(error);
  }
};

// Add Coupons
export const addCoupon = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const couponData = req.body;

    const newCoupon = await addCouponService(couponData);

    res.status(201).json({
      message: "Coupon added successfully!",
      coupon: newCoupon,
    });
  } catch (error) {
    next(error);
  }
};

// Edit Coupon
export const editCoupon = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params; // coupon id from URL
    const couponData = req.body;

    const updatedCoupon = await editCouponService(Number(id), couponData);

    if (!updatedCoupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    res.status(200).json({
      message: "Coupon updated successfully!",
      coupon: updatedCoupon,
    });
  } catch (error) {
    next(error);
  }
};


// Delete Coupon
export const deleteCoupon = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const deleted = await deleteCouponService(Number(id));

    if (!deleted) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    res.status(200).json({ message: "Coupon deleted successfully!" });
  } catch (error) {
    next(error);
  }
};

// Get Banners
export const getBanners = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const banners = await getBannersService();

    if (banners.length === 0) {
      return res.status(404).json({ message: "No Banners Found", banners: [] });
    }

    res.status(200).json({ message: "Banners fetched", banners });
  } catch (error) {
    next(error);
  }
};

// Add Banner
export const addBanner = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { banner_page, banner_status } = req.body;
    const file = req.file;

    if (!banner_page) {
      return res.status(400).json({ message: "Banner page is required" });
    }

    const banner = await addBannerService({
      banner_page,
      banner_status: Number(banner_status),
      file,
    });

    res.status(201).json({ message: "Banner added successfully!", banner });
  } catch (error) {
    next(error);
  }
};


// Edit Banner
export const editBanner = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { banner_page, banner_status } = req.body;
    const file = req.file;
    const banner_id = req.params.id;

    if (!banner_id) {
      return res.status(400).json({ message: "Banner ID is required" });
    }

    const banner = await editBannerService({
      banner_id: Number(banner_id),
      banner_page,
      banner_status,
      file,
    });

    res.status(200).json({ message: "Banner updated successfully!", banner });
  } catch (error) {
    next(error);
  }
};

// Delete Banner
export const deleteBanner = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const banner_id = req.params.id;

    if (!banner_id) {
      return res.status(400).json({ message: "Banner ID is required" });
    }

    await deleteBannerService(Number(banner_id));

    res.status(200).json({ message: "Banner deleted successfully!" });
  } catch (error) {
    next(error);
  }
};


// Get Price Mapper
export const getPriceMapper = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const priceMapper = await getPriceMapperService();

    if (!priceMapper || priceMapper.length === 0) {
      return res.status(404).json({ message: "No Price Mapper Found", priceMapper: [] });
    }

    res.status(200).json({ message: "Price Mapper fetched", priceMapper });
  } catch (error) {
    next(error);
  }
};



// Edit Price Mapper
export const editPriceMapper = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const mppm_id = req.params.id;
    const {
      mppm_sub_cat_id,
      mppm_visit_rate,
      mppm_days_rate,
      mppm_month_rate,
      mppm_gender,
      mppm_city_id,
      mppm_status
    } = req.body;

    if (!mppm_id) {
      return res.status(400).json({ message: "Price Mapper ID is required" });
    }

    const updated = await editPriceMapperService({
      mppm_id: Number(mppm_id),
      mppm_sub_cat_id,
      mppm_visit_rate,
      mppm_days_rate,
      mppm_month_rate,
      mppm_gender,
      mppm_city_id,
      mppm_status,
    });

    res.status(200).json({ message: "Price Mapper updated successfully!", priceMapper: updated });
  } catch (error) {
    next(error);
  }
};



// Delete Price Mapper
export const deletePriceMapper = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const mppm_id = req.params.id;

    if (!mppm_id) {
      return res.status(400).json({ message: "Price Mapper ID is required" });
    }

    await deletePriceMapperService(Number(mppm_id));

    res.status(200).json({ message: "Price Mapper deleted successfully!" });
  } catch (error) {
    next(error);
  }
};


// ✅ Add FAQ(s)
export const addFaq = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { manpower_faq_header, manpower_faq_description, manpower_faq_status } = req.body;
    let faqs: any[] = [];

    const currentTimestamp = Math.floor(Date.now() / 1000);

    if (Array.isArray(req.body)) {
      faqs = req.body.map((f: any) => ({
        manpower_faq_header: f.manpower_faq_header,
        manpower_faq_description: f.manpower_faq_description,
        manpower_faq_status: f.manpower_faq_status || "1",
        manpower_faq_createdAt: currentTimestamp,
      }));
    } else if (Array.isArray(manpower_faq_header) && Array.isArray(manpower_faq_description)) {
      faqs = manpower_faq_header.map((q: string, i: number) => ({
        manpower_faq_header: q,
        manpower_faq_description: manpower_faq_description[i],
        manpower_faq_status: manpower_faq_status?.[i] || "1",
        manpower_faq_createdAt: currentTimestamp,
      }));
    } else {
      if (!manpower_faq_header || !manpower_faq_description)
        return res.status(400).json({ message: "Header and Description are required" });

      faqs = [
        {
          manpower_faq_header,
          manpower_faq_description,
          manpower_faq_status: manpower_faq_status || "1",
        },
      ];
    }

    const insertedFaqs = await addFaqService(faqs);

    res.status(201).json({
      status: 200,
      message: `${insertedFaqs.length} FAQ${insertedFaqs.length > 1 ? "s" : ""} added successfully!`,
      jsonData: {
        faqs: insertedFaqs,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ✅ Get all FAQs
export const getAllFaqs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { date, fromDate, toDate, status, page, limit } = req.query;

    const filters = {
      date: date as string,
      fromDate: fromDate as string,
      toDate: toDate as string,
      status: status as string,
      page: page ? parseInt(page as string, 10) : 1,
      limit: limit ? parseInt(limit as string, 10) : 10,
    };

    const result = await getAllFaqsService(filters);

    res.status(200).json({
      status: 200,
      message: "FAQs fetched successfully",
      pagination: result.pagination,
      jsonData: {
        faqs: result.faqs,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ✅ Update FAQ
export const updateFaq = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const { manpower_faq_header, manpower_faq_description, manpower_faq_status } = req.body;

    const result = await updateFaqService(id, {
      manpower_faq_header,
      manpower_faq_description,
      manpower_faq_status,
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// ✅ Delete FAQ
export const deleteFaq = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const result = await deleteFaqService(id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};