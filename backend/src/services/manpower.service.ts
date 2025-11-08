import { db } from "../config/db";
import { ApiError } from "../utils/api-error";
import path from "path";
import fs from "fs";
import { RowDataPacket, FieldPacket } from "mysql2";
import { buildFilters } from "../utils/filters";

// Get All Categories
export const getCategoriesService = async () => {
  try {
    const [rows]: [RowDataPacket[], FieldPacket[]] = await db.query(
      "SELECT mp_cat_id, mp_cat_name, mp_cat_image, mp_cat_top_rated_status, mp_cat_status FROM manpower_category"
    );

    if (!rows || rows.length === 0) {
      return [];
    }

    return rows;
  } catch (error) {
    throw new ApiError(500, "Failed to fetch categories");
  }
};

// Add Category
interface AddCategoryInput {
  mp_cat_name: string;
  mp_cat_top_rated_status: number;  // Changed to number
  mp_cat_status: number;  // Changed to number
  file?: Express.Multer.File;
}

export const addCategoryService = async (data: AddCategoryInput) => {
  try {
    let imagePath = "";

    // If image was uploaded
    if (data.file) {
      const uploadDir = path.join(__dirname, "../../public/assets/manpower");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const fileName = `${Date.now()}-${data.file.originalname}`;
      const filePath = path.join(uploadDir, fileName);

      // Save file to disk
      fs.writeFileSync(filePath, data.file.buffer);
      imagePath = `assets/manpower/${fileName}`;
    }

    const [result]: any = await db.query(
      `INSERT INTO manpower_category 
      (mp_cat_name, mp_cat_image, mp_cat_top_rated_status, mp_cat_status, mp_cat_createdAt)
      VALUES (?, ?, ?, ?, ?)`,
      [
        data.mp_cat_name,
        imagePath,
        data.mp_cat_top_rated_status,
        data.mp_cat_status,
        Math.floor(Date.now() / 1000), // UNIX timestamp
      ]
    );

    return { id: result.insertId, ...data, mp_cat_image: imagePath };
  } catch (error) {
    throw new ApiError(500, "Failed to add category");
  }
};

// Edit Category
interface EditCategoryInput {
  mp_cat_id: number;
  mp_cat_name: string;
  mp_cat_top_rated_status: number;
  mp_cat_status: number;
  file?: Express.Multer.File;
}

export const editCategoryService = async (data: EditCategoryInput) => {
  try {
    const [rows]: [RowDataPacket[], FieldPacket[]] = await db.query(
      "SELECT * FROM manpower_category WHERE mp_cat_id = ?",
      [data.mp_cat_id]
    );

    if (!rows || rows.length === 0) {
      throw new ApiError(404, "Category not found");
    }

    let imagePath = rows[0].mp_cat_image;

    if (data.file) {
      const uploadDir = path.join(__dirname, "../../public/assets/manpower");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const fileName = `${Date.now()}-${data.file.originalname}`;
      const filePath = path.join(uploadDir, fileName);

      fs.writeFileSync(filePath, data.file.buffer);
      imagePath = `assets/manpower/${fileName}`;

      if (rows[0].mp_cat_image) {
        const oldFilePath = path.join(
          __dirname,
          "../../public",
          rows[0].mp_cat_image
        );
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
    }

    await db.query(
      `UPDATE manpower_category 
       SET mp_cat_name=?, mp_cat_image=?, mp_cat_top_rated_status=?, mp_cat_status=? 
       WHERE mp_cat_id=?`,
      [
        data.mp_cat_name,
        imagePath,
        data.mp_cat_top_rated_status,
        data.mp_cat_status,
        data.mp_cat_id,
      ]
    );

    return { ...data, mp_cat_image: imagePath };
  } catch (error) {
    throw new ApiError(500, "Failed to update category");
  }
};

// Delete Category
export const deleteCategoryService = async (id: number) => {
  try {
    const [rows]: [RowDataPacket[], FieldPacket[]] = await db.query(
      "SELECT * FROM manpower_category WHERE mp_cat_id = ?",
      [id]
    );

    if (!rows || rows.length === 0) {
      throw new ApiError(404, "Category not found");
    }

    const category = rows[0];

    if (category.mp_cat_image) {
      const imagePath = path.join(
        __dirname,
        "../../public",
        category.mp_cat_image
      );
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await db.query("DELETE FROM manpower_category WHERE mp_cat_id = ?", [id]);

    return category;
  } catch (error) {
    throw new ApiError(500, "Failed to delete category");
  }
};

// Get All SubCategories
export const getSubCategoriesService = async () => {
  try {
    const [rows]: [RowDataPacket[], FieldPacket[]] = await db.query(
      `SELECT 
         mpsc.*,
         mc.mp_cat_name,
         pm.mppm_visit_rate,
         pm.mppm_days_rate,
         pm.mppm_month_rate,
         pm.mppm_gender,
        pm.mppm_city_id
       FROM manpower_sub_category mpsc
       LEFT JOIN manpower_category mc 
         ON mc.mp_cat_id = mpsc.mpsc_category_id
        LEFT JOIN manpower_price_mapper pm
          ON pm.mppm_sub_cat_id = mpsc.mp_sub_category_id
       WHERE mpsc.mpsc_status != ?
       ORDER BY mpsc.mp_sub_category_id ASC`,
      [2]
    );

    return rows;
  } catch (error) {
    throw new ApiError(500, "Failed to fetch subcategories");
  }
};

// Add SubCategory
interface AddSubCategoryInput {
  mpsc_category_id: number;
  mpsc_name: string;
  mpsc_overview?: string;
  mpsc_description?: string;
  mpsc_gst_percentage: number;
  mpsc_emergency_status: number;
  mpsc_popular_status: number;
  mpsc_status: number;
  mpsc_visit_rate: number;
  mpsc_day_rate: number;
  mpsc_month_rate: number;
  mpsc_gender: string;
  mpsc_city: number;
  file?: Express.Multer.File;
}

export const addSubCategoryService = async (data: AddSubCategoryInput) => {
  try {
    let imagePath = "";

    if (data.file) {
      const uploadDir = path.join(
        __dirname,
        "../../public/assets/sub_category"
      );
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const fileName = `${Date.now()}-${data.file.originalname}`;
      const filePath = path.join(uploadDir, fileName);

      fs.writeFileSync(filePath, data.file.buffer);
      imagePath = `assets/sub_category/${fileName}`;
    }

    const [subcategoryResult]: any = await db.query(
      `INSERT INTO manpower_sub_category 
      (mpsc_category_id, mpsc_name, mpsc_image, mpsc_overview, mpsc_description,
       mpsc_gst_percentage, mpsc_emergency_status, mpsc_popular_status, mpsc_status, mpsc_cat_createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.mpsc_category_id,
        data.mpsc_name,
        imagePath,
        data.mpsc_overview ?? null,
        data.mpsc_description ?? null,
        data.mpsc_gst_percentage,
        data.mpsc_emergency_status,
        data.mpsc_popular_status,
        data.mpsc_status,
        Math.floor(Date.now() / 1000),
      ]
    );

    const subCategoryId = subcategoryResult.insertId;

    await db.query(
      `INSERT INTO manpower_price_mapper
      (mppm_sub_cat_id, mppm_visit_rate, mppm_days_rate, mppm_month_rate, mppm_gender,
       mppm_city_id, mppm_status, mppm_created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        subCategoryId,
        data.mpsc_visit_rate,
        data.mpsc_day_rate,
        data.mpsc_month_rate,
        data.mpsc_gender,
        data.mpsc_city,
        '0',
        Math.floor(Date.now() / 1000),
      ]
    );

    return {
      id: subCategoryId,
      ...data,
      mpsc_image: imagePath,
    };
  } catch (error) {
    throw new ApiError(500, "Failed to add subcategory");
  }
};

// Edit SubCategory
interface UpdateSubCategoryInput {
  mpsc_category_id?: number;
  mpsc_name?: string;
  mpsc_overview?: string;
  mpsc_description?: string;
  mpsc_gst_percentage?: number;
  mpsc_emergency_status?: number;
  mpsc_popular_status?: number;
  mpsc_status?: number;
  mpsc_visit_rate?: number;
  mpsc_day_rate?: number;
  mpsc_month_rate?: number;
  mpsc_gender?: string;
  mpsc_city?: number;
  file?: Express.Multer.File;
}

export const editSubCategoryService = async (
  id: number,
  data: UpdateSubCategoryInput
) => {
  try {
    const [existingRows]: [RowDataPacket[], FieldPacket[]] = await db.query(
      `SELECT mpsc_image FROM manpower_sub_category WHERE mp_sub_category_id = ?`,
      [id]
    );

    if (!existingRows || existingRows.length === 0) {
      throw new ApiError(404, "Subcategory not found");
    }

    let imagePath = existingRows[0].mpsc_image;

    if (data.file) {
      const uploadDir = path.join(
        __dirname,
        "../../public/assets/sub_category"
      );
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const fileName = `${Date.now()}-${data.file.originalname}`;
      const filePath = path.join(uploadDir, fileName);

      fs.writeFileSync(filePath, data.file.buffer);
      imagePath = `assets/sub_category/${fileName}`;

      if (
        existingRows[0].mpsc_image &&
        fs.existsSync(
          path.join(__dirname, "../../public", existingRows[0].mpsc_image)
        )
      ) {
        fs.unlinkSync(
          path.join(__dirname, "../../public", existingRows[0].mpsc_image)
        );
      }
    }

    const [result]: any = await db.query(
      `UPDATE manpower_sub_category 
       SET mpsc_category_id = ?, mpsc_name = ?, mpsc_image = ?, 
           mpsc_overview = ?, mpsc_description = ?, mpsc_gst_percentage = ?, 
           mpsc_emergency_status = ?, mpsc_popular_status = ?, mpsc_status = ?
       WHERE mp_sub_category_id = ?`,
      [
        data.mpsc_category_id,
        data.mpsc_name,
        imagePath,
        data.mpsc_overview ?? null,
        data.mpsc_description ?? null,
        data.mpsc_gst_percentage,
        data.mpsc_emergency_status,
        data.mpsc_popular_status,
        data.mpsc_status,
        id,
      ]
    );

    const [resultPM]: any = await db.query(
      `UPDATE manpower_price_mapper
       SET mppm_visit_rate = ?, mppm_days_rate = ?, mppm_month_rate = ?,
       mppm_gender = ?, mppm_city_id = ?
       WHERE mppm_sub_cat_id = ?`,
      [
        data.mpsc_visit_rate,
        data.mpsc_day_rate,
        data.mpsc_month_rate,
        data.mpsc_gender,
        data.mpsc_city,
        id,
      ]
    );

    if (result.affectedRows === 0) {
      throw new ApiError(500, "Failed to update subcategory");
    }

    return {
      id,
      ...data,
      mpsc_image: imagePath,
    };
  } catch (error) {
    throw new ApiError(500, "Failed to update subcategory");
  }
};

// Delete SubCategory
export const deleteSubCategoryService = async (id: number) => {
  try {
    const [rows]: [RowDataPacket[], FieldPacket[]] = await db.query(
      "SELECT * FROM manpower_sub_category WHERE mp_sub_category_id = ?",
      [id]
    );

    if (!rows || rows.length === 0) {
      throw new ApiError(404, "Subcategory not found",);
    }

    const subCategory = rows[0];

    if (subCategory.mpsc_image) {
      const imagePath = path.join(
        __dirname,
        "../../public",
        subCategory.mpsc_image
      );
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await db.query(
      "DELETE FROM manpower_price_mapper WHERE mppm_sub_cat_id = ?",
      [id]
    );

    await db.query(
      "DELETE FROM manpower_sub_category WHERE mp_sub_category_id = ?",
      [id]
    );

    return subCategory;
  } catch (error) {
    throw new ApiError(404, "Failed to delete subcategory");
  }
};

// Get Coupons
export const getCouponsService = async () => {
  try {
    const [rows]: [RowDataPacket[], FieldPacket[]] = await db.query(
      `SELECT *
       FROM manpower_coupon
       WHERE mpc_coupon_id != 2
       ORDER BY mpc_coupon_id ASC`
    );

    if (!rows || rows.length === 0) {
      return [];
    }

    return rows;
  } catch (error) {
    throw new ApiError(500, "Failed to fetch coupons");
  }
};

// Add Coupon
interface CouponInput {
  mpc_coupon_code: string;
  mpc_coupon_description: string;
  mpc_coupon_min_cart_value: number;
  mpc_coupon_discount_percent: number;
  mpc_coupon_discount_amount: number;
  mpc_coupon_max_discount_value: number;
  mpc_coupon_visible: number;  // Changed to number
  mpc_coupon_status: number;  // Changed to number
}

export const addCouponService = async (data: CouponInput) => {
  try {
    const [result]: any = await db.query(
      `INSERT INTO manpower_coupon 
        (mpc_coupon_code, mpc_coupon_description, mpc_coupon_min_cart_value,
         mpc_coupon_discount_percent, mpc_coupon_discount_amount, mpc_coupon_max_discount_value,
         mpc_coupon_visible, mpc_coupon_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.mpc_coupon_code,
        data.mpc_coupon_description,
        data.mpc_coupon_min_cart_value,
        data.mpc_coupon_discount_percent,
        data.mpc_coupon_discount_amount,
        data.mpc_coupon_max_discount_value,
        data.mpc_coupon_visible,
        data.mpc_coupon_status
      ]
    );

    return { id: result.insertId, ...data };
  } catch (error) {
    throw new ApiError(500, "Failed to add coupon");
  }
};

// Edit Coupon
export const editCouponService = async (id: number, data: Partial<CouponInput>) => {
  try {
    const [result]: any = await db.query(
      `UPDATE manpower_coupon
       SET mpc_coupon_code = ?, 
           mpc_coupon_description = ?, 
           mpc_coupon_min_cart_value = ?, 
           mpc_coupon_discount_percent = ?, 
           mpc_coupon_discount_amount = ?, 
           mpc_coupon_max_discount_value = ?, 
           mpc_coupon_visible = ?, 
           mpc_coupon_status = ?
       WHERE mpc_coupon_id = ?`,
      [
        data.mpc_coupon_code,
        data.mpc_coupon_description,
        data.mpc_coupon_min_cart_value,
        data.mpc_coupon_discount_percent,
        data.mpc_coupon_discount_amount,
        data.mpc_coupon_max_discount_value,
        data.mpc_coupon_visible,
        data.mpc_coupon_status,
        id,
      ]
    );

    if (result.affectedRows === 0) {
      return null;
    }

    return { id, ...data };
  } catch (error) {
    throw new ApiError(500, "Failed to update coupon");
  }
};

// Delete Coupon
export const deleteCouponService = async (id: number) => {
  try {
    const [result]: any = await db.query(
      `DELETE FROM manpower_coupon WHERE mpc_coupon_id = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return false;
    }

    return true;
  } catch (error) {
    throw new ApiError(500, "Failed to delete coupon");
  }
};

// Get Banners
export const getBannersService = async () => {
  try {
    const [rows]: [RowDataPacket[], FieldPacket[]] = await db.query(
      "SELECT * FROM manpower_banner WHERE banner_id != ? ORDER BY banner_id ASC",
      [2]
    );

    if (!rows || rows.length === 0) {
      return [];
    }

    return rows;
  } catch (error) {
    throw new ApiError(500, "Failed to fetch banners");
  }
};

interface AddBannerInput {
  banner_page: string;
  banner_status: number;
  file?: Express.Multer.File;
}

export const addBannerService = async (data: AddBannerInput) => {
  try {
    let imagePath = "";

    if (data.file) {
      const uploadDir = path.join(__dirname, "../../public/assets/manpower");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const fileName = `${Date.now()}-${data.file.originalname}`;
      const filePath = path.join(uploadDir, fileName);

      fs.writeFileSync(filePath, data.file.buffer);
      imagePath = `assets/manpower/${fileName}`;
    }

    const [result]: any = await db.query(
      `INSERT INTO manpower_banner (banner_image, banner_page, banner_status) 
       VALUES (?, ?, ?)`,
      [imagePath, data.banner_page, data.banner_status]
    );

    return {
      banner_id: result.insertId,
      banner_image: imagePath,
      banner_page: data.banner_page,
      banner_status: data.banner_status,
    };
  } catch (error) {
    throw new ApiError(500, "Failed to add banner");
  }
};

// Edit Banner
interface EditBannerInput {
  banner_id: number;
  banner_page: string;
  banner_status: number;  // Changed to number
  file?: Express.Multer.File;
}

export const editBannerService = async (data: EditBannerInput) => {
  try {
    const [rows]: [RowDataPacket[], FieldPacket[]] = await db.query(
      "SELECT * FROM manpower_banner WHERE banner_id = ?",
      [data.banner_id]
    );

    if (!rows || rows.length === 0) {
      throw new ApiError(404, "Banner not found");
    }

    let imagePath = rows[0].banner_image;

    if (data.file) {
      const uploadDir = path.join(__dirname, "../../public/assets/app_banner");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const fileName = `${Date.now()}-${data.file.originalname}`;
      const filePath = path.join(uploadDir, fileName);

      fs.writeFileSync(filePath, data.file.buffer);
      imagePath = `assets/app_banner/${fileName}`;

      if (rows[0].banner_image) {
        const oldFilePath = path.join(__dirname, "../../public", rows[0].banner_image);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
    }

    await db.query(
      `UPDATE manpower_banner 
       SET banner_image=?, banner_page=?, banner_status=? 
       WHERE banner_id=?`,
      [imagePath, data.banner_page, data.banner_status, data.banner_id]
    );

    return { ...data, banner_image: imagePath };
  } catch (error) {
    throw new ApiError(500, "Failed to update banner");
  }
};

// Delete Banner
export const deleteBannerService = async (banner_id: number) => {
  try {
    const [rows]: [RowDataPacket[], FieldPacket[]] = await db.query(
      "SELECT * FROM manpower_banner WHERE banner_id = ?",
      [banner_id]
    );

    if (!rows || rows.length === 0) {
      throw new ApiError(404, "Banner not found");
    }

    const banner = rows[0];

    // Delete file from disk if exists
    if (banner.banner_image) {
      const oldFilePath = path.join(__dirname, "../../public", banner.banner_image);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    // Delete from DB
    await db.query("DELETE FROM manpower_banner WHERE banner_id = ?", [banner_id]);

    return true;
  } catch (error) {
    throw new ApiError(500, "Failed to delete banner");
  }
};

// Get Price Mapper
export const getPriceMapperService = async () => {
  try {
    const [rows]: [RowDataPacket[], FieldPacket[]] = await db.query(
      `SELECT manpower_price_mapper.*, manpower_sub_category.mpsc_name
       FROM manpower_price_mapper
       RIGHT JOIN manpower_sub_category 
         ON manpower_sub_category.mp_sub_category_id = manpower_price_mapper.mppm_sub_cat_id
       WHERE mppm_status != "2"
       ORDER BY mppm_id ASC`
    );

    return rows || [];
  } catch (error) {
    throw new ApiError(500, "Failed to fetch price mapper");
  }
};

// Edit Price Mapper
interface EditPriceMapperInput {
  mppm_id: number;
  mppm_sub_cat_id: number;
  mppm_visit_rate: number;
  mppm_days_rate: number;
  mppm_month_rate: number;
  mppm_gender: string;
  mppm_city_id: number;
  mppm_status: number;
}

export const editPriceMapperService = async (data: EditPriceMapperInput) => {
  try {
    const [rows]: [RowDataPacket[], FieldPacket[]] = await db.query(
      "SELECT * FROM manpower_price_mapper WHERE mppm_id = ?",
      [data.mppm_id]
    );

    if (!rows || rows.length === 0) {
      throw new ApiError(404, "Price Mapper not found");
    }

    await db.query(
      `UPDATE manpower_price_mapper 
       SET mppm_sub_cat_id=?, mppm_visit_rate=?, mppm_days_rate=?, mppm_month_rate=?, 
           mppm_gender=?, mppm_city_id=?, mppm_status=? 
       WHERE mppm_id=?`,
      [
        data.mppm_sub_cat_id,
        data.mppm_visit_rate,
        data.mppm_days_rate,
        data.mppm_month_rate,
        data.mppm_gender,
        data.mppm_city_id,
        data.mppm_status,
        data.mppm_id,
      ]
    );

    return data;
  } catch (error) {
    throw new ApiError(500, "Failed to update Price Mapper");
  }
};

// Delete Price Mapper
export const deletePriceMapperService = async (mppm_id: number) => {
  try {
    const [rows]: [RowDataPacket[], FieldPacket[]] = await db.query(
      "SELECT * FROM manpower_price_mapper WHERE mppm_id = ?",
      [mppm_id]
    );

    if (!rows || rows.length === 0) {
      throw new ApiError(404, "Price Mapper not found");
    }

    await db.query(
      "UPDATE manpower_price_mapper SET mppm_status = 2 WHERE mppm_id = ?",
      [mppm_id]
    );

    return true;
  } catch (error) {
    throw new ApiError(500, "Failed to delete Price Mapper");
  }
};

// ✅ Add one or multiple FAQs
export const addFaqService = async (
  faqs: { manpower_faq_header: string; manpower_faq_description: string; manpower_faq_status?: string }[]
) => {
  try {
    const insertedFaqs: any[] = [];

    for (const faq of faqs) {
      const [result]: any = await db.query(
        `INSERT INTO manpower_faq 
        (manpower_faq_header, manpower_faq_description, manpower_faq_status, manpower_faq_createdAt) 
        VALUES (?, ?, ?, NOW())`,
        [faq.manpower_faq_header, faq.manpower_faq_description, faq.manpower_faq_status || "1"]
      );

      insertedFaqs.push({
        // manpower_faq_id: result.insertId,
        manpower_faq_header: faq.manpower_faq_header,
        manpower_faq_description: faq.manpower_faq_description,
        manpower_faq_status: faq.manpower_faq_status || "1",
      });
    }

    return insertedFaqs;
  } catch (error) {
    throw new ApiError(500, "Failed to add FAQs");
  }
};

export const getAllFaqsService = async (filters?: {
  date?: string;
  fromDate?: string;
  toDate?: string;
  status?: string;
  page?: number;
  limit?: number;
}) => {
  try {
    // ✅ Pagination defaults
    const page = filters?.page && filters.page > 0 ? filters.page : 1;
    const limit = filters?.limit && filters.limit > 0 ? filters.limit : 10;
    const offset = (page - 1) * limit;

    // ✅ Generate WHERE clause from filters util
    const { whereSQL, params } = buildFilters({
      ...filters,
      dateColumn: "manpower_faq_createdAt",
    });

    // ✅ Status filter (0=new, 1=active, 2=inactive)
    let finalWhereSQL = whereSQL;
    if (filters?.status) {
      const statusConditionMap: Record<string, string> = {
        "0": "manpower_faq_status = '0'",
        "1": "manpower_faq_status = '1'",
        "2": "manpower_faq_status = '2'",
      };
      const condition = statusConditionMap[filters.status];
      if (condition) {
        finalWhereSQL += finalWhereSQL ? ` AND ${condition}` : `WHERE ${condition}`;
      }
    }

    // ✅ Main query
    const query = `
      SELECT 
        manpower_faq_id,
        manpower_faq_header,
        manpower_faq_description,
        manpower_faq_status,
        manpower_faq_createdAt
      FROM manpower_faq
      ${finalWhereSQL}
      ORDER BY manpower_faq_createdAt DESC
      LIMIT ? OFFSET ?
    `;

    const queryParams = [...params, limit, offset];
    const [rows]: any = await db.query(query, queryParams);

    // ✅ Count query
    const [countRows]: any = await db.query(
      `SELECT COUNT(*) AS total FROM manpower_faq ${finalWhereSQL}`,
      params
    );

    const total = countRows[0]?.total || 0;

    // ✅ Return structured response
    return {
      status: 200,
      message: "FAQs fetched successfully",
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      faqs: rows || [],
    };
  } catch (error) {
    console.error("❌ Error fetching FAQs:", error);
    throw new ApiError(500, "Failed to fetch FAQs");
  }
};

// ✅ Update FAQ
export const updateFaqService = async (
  id: number,
  data: { manpower_faq_header?: string; manpower_faq_description?: string; manpower_faq_status?: string }
) => {
  try {
    const [result]: any = await db.query(
      `UPDATE manpower_faq 
       SET manpower_faq_header = COALESCE(?, manpower_faq_header),
           manpower_faq_description = COALESCE(?, manpower_faq_description),
           manpower_faq_status = COALESCE(?, manpower_faq_status)
       WHERE manpower_faq_id = ?`,
      [data.manpower_faq_header, data.manpower_faq_description, data.manpower_faq_status, id]
    );

    if (result.affectedRows === 0) throw new ApiError(404, "FAQ not found");

    return { message: "FAQ updated successfully" };
  } catch (error) {
    throw new ApiError(500, "Failed to update FAQ");
  }
};

// ✅ Delete FAQ
export const deleteFaqService = async (id: number) => {
  try {
    const [result]: any = await db.query(`DELETE FROM manpower_faq WHERE manpower_faq_id = ?`, [id]);
    if (result.affectedRows === 0) throw new ApiError(404, "FAQ not found");

    return { message: "FAQ deleted successfully" };
  } catch (error) {
    throw new ApiError(500, "Failed to delete FAQ");
  }
};