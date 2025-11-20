import { db } from "../../config/db";
import { ApiError } from "../../utils/api-error";
import { buildFilters } from "../../utils/filters";
import { currentUnixTime } from "../../utils/current_unixtime";
import { generateSlug } from "../../utils/generate_sku";
import { uploadFileCustom } from "../../utils/file_uploads";

interface blogData {
    blogs_image?: Express.Multer.File;
    blogs_title: string;
    blogs_sku: string;
    blogs_short_desc: string;
    blogs_long_desc: string;
    blogs_category: number;
    blogs_meta_title: string;
    blogs_meta_desc: string;
    blogs_meta_keywords: string;
    blogs_force_keywords: string;
    blogs_schema: string;
};

// SERVICE TO GET BLOG LIST WITH FILTERS AND PAGINATION
export const getBlogListService = async (filters?: {
    date?: string;
    status?: string;
    fromDate?: string;
    toDate?: string;
    page?: number;
    limit?: number;
}) => {

    try {
        const page = filters?.page && filters.page > 0 ? filters.page : 1;
        const limit = filters?.limit && filters.limit > 0 ? filters.limit : 100;
        const offset = (page - 1) * limit;

        const { whereSQL, params } = buildFilters({
            ...filters,
            dateColumn: "blogs.blogs_created_at",
        });

        let finalWhereSQL = whereSQL;

        if (filters?.status) {
            const statusConditionMap: Record<string, string> = {
                active: "blogs.blogs_status = 0",
                inactive: "blogs.blogs_status = 1",
            };

            const condition = statusConditionMap[filters.status];

            if (condition) {
                if (/where\s+/i.test(finalWhereSQL)) {
                    finalWhereSQL += ` AND ${condition}`;
                } else {
                    finalWhereSQL = `WHERE ${condition}`;
                }
            }
        }

        const query = `
            SELECT 
                blogs.blogs_id,
                blogs.blogs_image,
                blogs.blogs_title,
                blogs.blogs_category,
                blogs.blogs_status,
                blogs.blogs_created_at
            FROM blogs
            ${finalWhereSQL}
            ORDER BY blogs.blogs_id DESC
            LIMIT ? OFFSET ?
        `;

        const queryParams = [...params, limit, offset];
        const [rows]: any = await db.query(query, queryParams);

        // console.log("Blog List Rows:", rows);


        const [countRows]: any = await db.query(
            `SELECT COUNT(*) as total FROM blogs ${finalWhereSQL}`,
            params
        );

        const total = countRows[0]?.total || 0;

        return {
            status: 200,
            message: "Blogs list fetched successfully",
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
            jsonData: {
                blogs_list: rows
            },
        };

    } catch (error) {
        console.log(error);

        throw new ApiError(500, "Get Blogs List Error On Fetching");
    }

};

// SERVICE TO ADD NEW BLOG
export const addBlogService = async (data: blogData) => {

    let imagePath = null;

    if (data.blogs_image) {
        const uploadedPath = uploadFileCustom(data.blogs_image, "/blogs");
        imagePath = uploadedPath;
    }

    try {
        const insertData = {
            blogs_image: imagePath,
            blogs_title: data.blogs_title,
            blogs_sku: generateSlug(data.blogs_sku),
            blogs_short_desc: data.blogs_short_desc,
            blogs_long_desc: data.blogs_long_desc,
            blogs_category: data.blogs_category,
            blogs_meta_title: data.blogs_meta_title,
            blogs_meta_desc: data.blogs_meta_desc,
            blogs_meta_keywords: data.blogs_meta_keywords,
            blogs_force_keywords: data.blogs_force_keywords,
            blogs_schema: data.blogs_schema,
            blogs_status: 0,
            blogs_created_at: currentUnixTime(),
        }

        const [result]: any = await db.query(
            `INSERT INTO blogs SET ?`,
            [insertData]
        );

        return {
            status: 201,
            message: "Blog added successfully",
        };

    } catch (error) {
        throw new ApiError(500, "Add Blog Error On Inserting");
    }

};

// SERVICE TO GET SINGLE BLOG
export const getBlogService = async (blogId: number) => {
    try {
        const [rows]: any = await db.query(
            `SELECT * FROM blogs WHERE blogs_id = ?`,
            [blogId]
        );

        if (!rows || rows.length === 0) {
            throw new ApiError(404, "Blog not found");
        }

        return {
            status: 200,
            message: "Blog fetched successfully",
            jsonData: {
                blog: rows[0]
            },
        };
    } catch (error) {
        console.log(error);
        throw new ApiError(500, "Get Blog Error On Fetching");
    }
};

// SERVICE TO EDIT EXISTING BLOG
export const editBlogService = async (blogId: number, data: blogData) => {

    try {

        const updateData: any = {};

        if (data.blogs_title) updateData.blogs_title = data.blogs_title;
        if (data.blogs_sku) updateData.blogs_sku = generateSlug(data.blogs_sku);
        if (data.blogs_short_desc) updateData.blogs_short_desc = data.blogs_short_desc;
        if (data.blogs_long_desc) updateData.blogs_long_desc = data.blogs_long_desc;
        if (data.blogs_category) updateData.blogs_category = data.blogs_category;
        if (data.blogs_meta_title) updateData.blogs_meta_title = data.blogs_meta_title;
        if (data.blogs_meta_desc) updateData.blogs_meta_desc = data.blogs_meta_desc;
        if (data.blogs_meta_keywords) updateData.blogs_meta_keywords = data.blogs_meta_keywords;
        if (data.blogs_force_keywords) updateData.blogs_force_keywords = data.blogs_force_keywords;
        if (data.blogs_schema) updateData.blogs_schema = data.blogs_schema;

        if (data.blogs_image) {
            const uploadedPath = uploadFileCustom(data.blogs_image, "/blogs");
            updateData.blogs_image = uploadedPath;
        }

        if (Object.keys(updateData).length === 0) {
            return {
                status: 400,
                message: "No valid fields provided to update",
            };
        }

        const [result]: any = await db.query(
            `UPDATE blogs SET ? WHERE blogs_id = ?`,
            [updateData, blogId]
        );

        return {
            status: 200,
            message: "Blog updated successfully",
        };

    } catch (error) {
        throw new ApiError(500, "Edit Blog Error On Updating");
    }

};

// SERVICE TO UPDATE BLOG STATUS
export const updateBlogStatusService = async (blogId: number, status: number) => {
    try {

        const [result]: any = await db.query(
            `UPDATE blogs SET blogs_status = ? WHERE blogs_id = ?`,
            [status, blogId]
        );

        return {
            status: 200,
            message: "Blog status updated successfully",
        };

    } catch (error) {
        console.log(error);

        throw new ApiError(500, "Update Blog Status Error On Updating");
    }
};


interface cityContentData {
    city_name?: string;
    city_title_sku?: string;
    city_title?: string;
    city_heading?: string;
    city_body_desc?: string;
    city_why_choose_us?: string;
    why_choose_meta_desc?: string;
    city_block1_heading?: string;
    city_block1_body?: string;
    city_block2_heading?: string;
    city_block2_body?: string;
    city_block3_heading?: string;
    city_block3_body?: string;
    city_thumbnail?: Express.Multer.File;
    city_thumbnail_alt?: string;
    city_thumbnail_title?: string;
    city_meta_title?: string;
    city_meta_desc?: string;
    city_meta_keyword?: string;
    city_force_keyword?: string;
    city_faq_heading?: string;
    city_faq_desc?: string;
    city_emergency_heading?: string;
    city_emergency_desc?: string;
}

// SERVICE TO GET CITY CONTENT LIST WITH FILTERS AND PAGINATION
export const getCityContentService = async (filters?: {
    date?: string;
    status?: string;
    fromDate?: string;
    toDate?: string;
    page?: number;
    limit?: number;
}) => {

    try {

        const page = filters?.page && filters.page > 0 ? filters.page : 1;
        const limit = filters?.limit && filters.limit > 0 ? filters.limit : 100;
        const offset = (page - 1) * limit;

        const { whereSQL, params } = buildFilters({
            ...filters,
            dateColumn: "city_content.city_timestamp",
        });

        const query = `
            SELECT 
                city_content.city_id,
                city_content.city_name,
                city_content.city_title,
                city_content.city_status,
                city_content.city_timestamp
            FROM city_content
            ${whereSQL}
            ORDER BY city_content.city_id DESC
            LIMIT ? OFFSET ?
        `;

        const queryParams = [...params, limit, offset];
        const [rows]: any = await db.query(query, queryParams);

        const [countRows]: any = await db.query(
            `SELECT COUNT(*) as total FROM city_content ${whereSQL}`,
            params
        );

        const total = countRows[0]?.total || 0;

        return {
            status: 200,
            message: "City content list fetched successfully",
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
            jsonData: {
                city_content_list: rows
            },
        };

    } catch (error) {
        throw new ApiError(500, "Get City Content Error On Fetching");
    }

};

// SERVICE TO ADD NEW CITY CONTENT
export const addCityContentService = async (data: cityContentData) => {

    try {

        let imagePath: string | null = null;

        if (data.city_thumbnail) {
            imagePath = uploadFileCustom(data.city_thumbnail, "/city_content");
        }

        const insertData = {
            city_name: data.city_name,
            city_title_sku: generateSlug(data.city_title_sku || ""),
            city_title: data.city_title,
            city_heading: data.city_heading,
            city_body_desc: data.city_body_desc,
            city_why_choose_us: data.city_why_choose_us,
            why_choose_meta_desc: data.why_choose_meta_desc,
            city_block1_heading: data.city_block1_heading,
            city_block1_body: data.city_block1_body,
            city_block2_heading: data.city_block2_heading,
            city_block2_body: data.city_block2_body,
            city_block3_heading: data.city_block3_heading,
            city_block3_body: data.city_block3_body,
            city_thumbnail: imagePath,
            city_thumbnail_alt: data.city_thumbnail_alt,
            city_thumbnail_title: data.city_thumbnail_title,
            city_meta_title: data.city_meta_title,
            city_meta_desc: data.city_meta_desc,
            city_meta_keyword: data.city_meta_keyword,
            city_force_keyword: data.city_force_keyword,
            city_faq_heading: data.city_faq_heading,
            city_faq_desc: data.city_faq_desc,
            city_emergency_heading: data.city_emergency_heading,
            city_emergency_desc: data.city_emergency_desc,
            city_status: 0,
            city_timestamp: currentUnixTime(),
        };

        const [result]: any = await db.query(
            `INSERT INTO city_content SET ?`,
            [insertData]
        );

        return {
            status: 200,
            message: "City content added successfully",
        };

    } catch (error) {
        throw new ApiError(500, "Add City Content Error On Inserting");
    }

};

// SERVICE TO FETCH SINGLE CITY CONTENT
export const fetchCityContentService = async (cityId: number) => {
    try {

        const [rows]: any = await db.query(
            `SELECT * FROM city_content WHERE city_content.city_id = ?`,
            [cityId]
        )

        return {
            status: 200,
            message: "City content fetched successfully",
            jsonData: {
                city_content: rows[0] || null
            }
        };

    } catch (error) {
        throw new ApiError(500, "Fetch City Content Error On Fetching");
    }
};

// SERVICE TO EDIT EXISTING CITY CONTENT
export const editCityContentService = async (cityId: number, data: cityContentData) => {
    try {

        const updateData: any = {};

        if (data.city_name) updateData.city_name = data.city_name;
        if (data.city_title_sku) updateData.city_title_sku = generateSlug(data.city_title_sku);
        if (data.city_title) updateData.city_title = data.city_title;
        if (data.city_heading) updateData.city_heading = data.city_heading;
        if (data.city_body_desc) updateData.city_body_desc = data.city_body_desc;
        if (data.city_why_choose_us) updateData.city_why_choose_us = data.city_why_choose_us;
        if (data.why_choose_meta_desc) updateData.why_choose_meta_desc = data.why_choose_meta_desc;
        if (data.city_block1_heading) updateData.city_block1_heading = data.city_block1_heading;
        if (data.city_block1_body) updateData.city_block1_body = data.city_block1_body;
        if (data.city_block2_heading) updateData.city_block2_heading = data.city_block2_heading;
        if (data.city_block2_body) updateData.city_block2_body = data.city_block2_body;
        if (data.city_block3_heading) updateData.city_block3_heading = data.city_block3_heading;
        if (data.city_block3_body) updateData.city_block3_body = data.city_block3_body;
        if (data.city_thumbnail) {
            const uploadedPath = uploadFileCustom(data.city_thumbnail, "/city_content");
            updateData.city_thumbnail = uploadedPath;
        }
        if (data.city_thumbnail_alt) updateData.city_thumbnail_alt = data.city_thumbnail_alt;
        if (data.city_thumbnail_title) updateData.city_thumbnail_title = data.city_thumbnail_title;
        if (data.city_meta_title) updateData.city_meta_title = data.city_meta_title;
        if (data.city_meta_desc) updateData.city_meta_desc = data.city_meta_desc;
        if (data.city_meta_keyword) updateData.city_meta_keyword = data.city_meta_keyword;
        if (data.city_force_keyword) updateData.city_force_keyword = data.city_force_keyword;
        if (data.city_faq_heading) updateData.city_faq_heading = data.city_faq_heading;
        if (data.city_faq_desc) updateData.city_faq_desc = data.city_faq_desc;
        if (data.city_emergency_heading) updateData.city_emergency_heading = data.city_emergency_heading;
        if (data.city_emergency_desc) updateData.city_emergency_desc = data.city_emergency_desc;

        const [result]: any = await db.query(
            `UPDATE city_content SET ? WHERE city_id = ?`,
            [updateData, cityId]
        );

        return {
            status: 200,
            message: "City content updated successfully",
        };

    } catch (error) {
        throw new ApiError(500, "Edit City Content Error On Updating");
    }
};

// SERVICE TO UPDATE CITY CONTENT STATUS
export const updateCityContentStatusService = async (cityId: number, status: number) => {
    try {

        const [result]: any = await db.query(`
            UPDATE city_content SET city_status = ? WHERE city_id = ?
        `, [status, cityId]);

        return {
            status: 200,
            message: "City content status updated successfully",
        };

    } catch (error) {
        throw new ApiError(500, "Update City Content Status Error On Updating");
    }
};


interface cityContentFaqData {
    city_id?: number;
    city_faq_que?: string;
    city_faq_ans?: string;
}

// CITY CONTENT FAQ LIST SERVICE
export const getCityContentFaqListService = async (filters?: {
    date?: string;
    status?: string;
    fromDate?: string;
    toDate?: string;
    page?: number;
    limit?: number;
}) => {
    try {

        const page = filters?.page && filters.page > 0 ? filters.page : 1;
        const limit = filters?.limit && filters.limit > 0 ? filters.limit : 100;
        const offset = (page - 1) * limit;

        const { whereSQL, params } = buildFilters({
            ...filters,
            dateColumn: "city_faq.city_faq_timestamp",
        });

        const query = `
        
        SELECT city_faq.*, city_content.city_name
        FROM city_faq
        LEFT JOIN city_content ON city_faq.city_id = city_content.city_id
        ${whereSQL}
        ORDER BY city_faq.city_faq_id DESC
        LIMIT ? OFFSET ?

        `;

        const queryParams = [...params, limit, offset];
        const [rows]: any = await db.query(query, queryParams);

        const [countRows]: any = await db.query(
            `SELECT COUNT(*) as total FROM city_faq ${whereSQL}`,
            params
        );

        const total = countRows[0]?.total || 0;

        return {
            status: 200,
            message: "City Content FAQ list fetched successfully",
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
            jsonData: {
                city_content_faq_list: rows
            },
        };

    } catch (error) {
        throw new ApiError(500, "Get City Content FAQ List Error On Fetching");
    }
};

// SERVICE TO ADD NEW CITY CONTENT FAQ
export const addCityContentFaqService = async (data: cityContentFaqData) => {

    try {

        const insertData = {
            city_id: data.city_id,
            city_faq_que: data.city_faq_que,
            city_faq_ans: data.city_faq_ans,
            city_faq_status: 0,
            city_faq_timestamp: currentUnixTime(),
        }

        const [result]: any = await db.query(
            `INSERT INTO city_faq SET ?`,
            [insertData]
        );

        return {
            status: 200,
            message: "City Content FAQ added successfully",
            insert_id: result.insertId,
        };

    } catch (error) {
        throw new ApiError(500, "Add City Content FAQ Error On Inserting");
    }

};

// SERVICE TO FETCH SINGLE CITY CONTENT FAQ
export const fetchCityContentFaqService = async (faqId: number) => {

    try {

        const [rows]: any = await db.query(
            `SELECT * FROM city_faq WHERE city_faq.city_faq_id = ?`,
            [faqId]
        );

        return {
            status: 200,
            message: "City Content FAQ fetched successfully",
            jsonData: {
                city_content_faq: rows[0] || null
            }
        };

    } catch (error) {
        throw new ApiError(500, "Fetch City Content FAQ Error On Fetching");
    }

};

// SERVICE TO EDIT EXISTING CITY CONTENT FAQ
export const editCityContentFaqService = async (faqId: number, data: cityContentFaqData) => {
    try {

        const updateData: any = {};

        if (data.city_id) updateData.city_id = data.city_id;
        if (data.city_faq_que) updateData.city_faq_que = data.city_faq_que;
        if (data.city_faq_ans) updateData.city_faq_ans = data.city_faq_ans;

        const [result]: any = await db.query(
            `UPDATE city_faq SET ? WHERE city_faq_id = ?`,
            [updateData, faqId]
        );

        return {
            status: 200,
            message: "City Content FAQ updated successfully",
        };

    } catch (error) {
        throw new ApiError(500, "Edit City Content FAQ Error On Updating");
    }
};

// SERVICE TO UPDATE CITY CONTENT FAQ STATUS
export const updateCityContentFaqStatusService = async (faqId: number, status: number) => {
    try {

        const [rows]: any = await db.query(
            `UPDATE city_faq SET city_faq_status = ? WHERE city_faq_id = ?`,
            [status, faqId]
        );

        return {
            status: 200,
            message: "City Content FAQ status updated successfully",
        };
    } catch (error) {
        throw new ApiError(500, "Update City Content FAQ Status Error On Updating");
    }
};


// ------------------------------------------- MANPOWER CITY CONTENT SERVICES ------------------------------------------- //


interface cityContentManpowerData {
    city_name?: string;
    city_title_sku?: string;
    city_title?: string;
    city_heading?: string;
    city_body_desc?: string;
    city_why_choose_us?: string;
    why_choose_meta_desc?: string;
    city_block1_heading?: string;
    city_block1_body?: string;
    city_block2_heading?: string;
    city_block2_body?: string;
    city_block3_heading?: string;
    city_block3_body?: string;
    city_thumbnail?: Express.Multer.File;
    city_thumbnail_alt?: string;
    city_thumbnail_title?: string;
    city_meta_title?: string;
    city_meta_desc?: string;
    city_meta_keyword?: string;
    city_force_keyword?: string;
    city_faq_heading?: string;
    city_faq_desc?: string;
    city_emergency_heading?: string;
    city_emergency_desc?: string;
}

// MANPOWER CITY CONSTENT LIST SERVICE
export const getCityContentManpowerService = async (filters?: {
    date?: string;
    status?: string;
    fromDate?: string;
    toDate?: string;
    page?: number;
    limit?: number;
}) => {

    try {

        const page = filters?.page && filters.page > 0 ? filters.page : 1;
        const limit = filters?.limit && filters.limit > 0 ? filters.limit : 100;
        const offset = (page - 1) * limit;

        const { whereSQL, params } = buildFilters({
            ...filters,
            dateColumn: "city_manpower_content.city_timestamp",
        });

        const query = `
            SELECT 
                city_manpower_content.city_id,
                city_manpower_content.city_name,
                city_manpower_content.city_title,
                city_manpower_content.city_status,
                city_manpower_content.city_timestamp
            FROM city_manpower_content
            ${whereSQL}
            ORDER BY city_manpower_content.city_id DESC
            LIMIT ? OFFSET ?
        `;

        const queryParams = [...params, limit, offset];
        const [rows]: any = await db.query(query, queryParams);

        const [countRows]: any = await db.query(
            `SELECT COUNT(*) as total FROM city_manpower_content ${whereSQL}`,
            params
        );

        const total = countRows[0]?.total || 0;

        return {
            status: 200,
            message: "Manpower City content list fetched successfully",
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
            jsonData: {
                city_manpower_content_list: rows
            },
        };

    } catch (error) {
        throw new ApiError(500, "Get City Content Error On Fetching");
    }

};

// MANPOWER CITY CONTENT ADD SERVICE
export const addCityContentManpowerService = async (data: cityContentManpowerData) => {

    try {

        let imagePath: string | null = null;

        if (data.city_thumbnail) {
            imagePath = uploadFileCustom(data.city_thumbnail, "/city_manpower_content");
        }

        const insertData = {
            city_name: data.city_name,
            city_title_sku: generateSlug(data.city_title_sku || ""),
            city_title: data.city_title,
            city_heading: data.city_heading,
            city_body_desc: data.city_body_desc,
            city_why_choose_us: data.city_why_choose_us,
            why_choose_meta_desc: data.why_choose_meta_desc,
            city_block1_heading: data.city_block1_heading,
            city_block1_body: data.city_block1_body,
            city_block2_heading: data.city_block2_heading,
            city_block2_body: data.city_block2_body,
            city_block3_heading: data.city_block3_heading,
            city_block3_body: data.city_block3_body,
            city_thumbnail: imagePath,
            city_thumbnail_alt: data.city_thumbnail_alt,
            city_thumbnail_title: data.city_thumbnail_title,
            city_meta_title: data.city_meta_title,
            city_meta_desc: data.city_meta_desc,
            city_meta_keyword: data.city_meta_keyword,
            city_force_keyword: data.city_force_keyword,
            city_faq_heading: data.city_faq_heading,
            city_faq_desc: data.city_faq_desc,
            city_emergency_heading: data.city_emergency_heading,
            city_emergency_desc: data.city_emergency_desc,
            city_status: 0,
            city_timestamp: currentUnixTime(),
        };

        const [result]: any = await db.query(
            `INSERT INTO city_manpower_content SET ?`,
            [insertData]
        );

        return {
            status: 200,
            message: "Manpower City content added successfully",
        };

    } catch (error) {
        throw new ApiError(500, "Add Manpower City Content Error On Inserting");
    }

};

// MANPOWER CITY CONTENT FETCH SERVICE
export const fetchCityContentManpowerService = async (cityId: number) => {
    try {

        const [rows]: any = await db.query(
            `SELECT * FROM city_manpower_content WHERE city_manpower_content.city_id = ?`,
            [cityId]
        )

        return {
            status: 200,
            message: "Manpower City content fetched successfully",
            jsonData: {
                city_manpower_content: rows[0] || null
            }
        };

    } catch (error) {
        throw new ApiError(500, "Fetch Manpower City Content Error On Fetching");
    }
};

// MANPOWER CITY CONTENT EDIT SERVICE
export const editCityContentManpowerService = async (cityId: number, data: cityContentManpowerData) => {
    try {

        const updateData: any = {};

        if (data.city_name) updateData.city_name = data.city_name;
        if (data.city_title_sku) updateData.city_title_sku = generateSlug(data.city_title_sku);
        if (data.city_title) updateData.city_title = data.city_title;
        if (data.city_heading) updateData.city_heading = data.city_heading;
        if (data.city_body_desc) updateData.city_body_desc = data.city_body_desc;
        if (data.city_why_choose_us) updateData.city_why_choose_us = data.city_why_choose_us;
        if (data.why_choose_meta_desc) updateData.why_choose_meta_desc = data.why_choose_meta_desc;
        if (data.city_block1_heading) updateData.city_block1_heading = data.city_block1_heading;
        if (data.city_block1_body) updateData.city_block1_body = data.city_block1_body;
        if (data.city_block2_heading) updateData.city_block2_heading = data.city_block2_heading;
        if (data.city_block2_body) updateData.city_block2_body = data.city_block2_body;
        if (data.city_block3_heading) updateData.city_block3_heading = data.city_block3_heading;
        if (data.city_block3_body) updateData.city_block3_body = data.city_block3_body;
        if (data.city_thumbnail) {
            const uploadedPath = uploadFileCustom(data.city_thumbnail, "/city_manpower_content");
            updateData.city_thumbnail = uploadedPath;
        }
        if (data.city_thumbnail_alt) updateData.city_thumbnail_alt = data.city_thumbnail_alt;
        if (data.city_thumbnail_title) updateData.city_thumbnail_title = data.city_thumbnail_title;
        if (data.city_meta_title) updateData.city_meta_title = data.city_meta_title;
        if (data.city_meta_desc) updateData.city_meta_desc = data.city_meta_desc;
        if (data.city_meta_keyword) updateData.city_meta_keyword = data.city_meta_keyword;
        if (data.city_force_keyword) updateData.city_force_keyword = data.city_force_keyword;
        if (data.city_faq_heading) updateData.city_faq_heading = data.city_faq_heading;
        if (data.city_faq_desc) updateData.city_faq_desc = data.city_faq_desc;
        if (data.city_emergency_heading) updateData.city_emergency_heading = data.city_emergency_heading;
        if (data.city_emergency_desc) updateData.city_emergency_desc = data.city_emergency_desc;

        const [result]: any = await db.query(
            `UPDATE city_manpower_content SET ? WHERE city_id = ?`,
            [updateData, cityId]
        );

        return {
            status: 200,
            message: "Manpower City content updated successfully",
        };

    } catch (error) {
        throw new ApiError(500, "Edit Manpower City Content Error On Updating");
    }
};

// MANPOWER CITY CONTENT STATUS UPDATE SERVICE
export const updateCityContentManpowerStatusService = async (cityId: number, status: number) => {
    try {

        const [result]: any = await db.query(`
            UPDATE city_manpower_content SET city_status = ? WHERE city_id = ?
        `, [status, cityId]);

        return {
            status: 200,
            message: "Manpower City content status updated successfully",
        };

    } catch (error) {
        throw new ApiError(500, "Update Manpower City Content Status Error On Updating");
    }
};


// ------------------------------------------- VIDEO CONSULTENCY CITY CONTENT SERVICES ------------------------------------------- //


interface cityContentVideoConsultData {
    city_name?: string;
    city_title_sku?: string;
    city_title?: string;
    city_heading?: string;
    city_body_desc?: string;
    city_why_choose_us?: string;
    why_choose_meta_desc?: string;
    city_block1_heading?: string;
    city_block1_body?: string;
    city_block2_heading?: string;
    city_block2_body?: string;
    city_block3_heading?: string;
    city_block3_body?: string;
    city_thumbnail?: Express.Multer.File;
    city_thumbnail_alt?: string;
    city_thumbnail_title?: string;
    city_meta_title?: string;
    city_meta_desc?: string;
    city_meta_keyword?: string;
    city_force_keyword?: string;
    city_faq_heading?: string;
    city_faq_desc?: string;
    city_emergency_heading?: string;
    city_emergency_desc?: string;
}

// VideoConsult CITY CONSTENT LIST SERVICE
export const getCityContentVideoConsultService = async (filters?: {
    date?: string;
    status?: string;
    fromDate?: string;
    toDate?: string;
    page?: number;
    limit?: number;
}) => {

    try {

        const page = filters?.page && filters.page > 0 ? filters.page : 1;
        const limit = filters?.limit && filters.limit > 0 ? filters.limit : 100;
        const offset = (page - 1) * limit;

        const { whereSQL, params } = buildFilters({
            ...filters,
            dateColumn: "city_video_consultancy_content.city_timestamp",
        });

        const query = `
            SELECT 
                city_video_consultancy_content.city_id,
                city_video_consultancy_content.city_name,
                city_video_consultancy_content.city_title,
                city_video_consultancy_content.city_status,
                city_video_consultancy_content.city_timestamp
            FROM city_video_consultancy_content
            ${whereSQL}
            ORDER BY city_video_consultancy_content.city_id DESC
            LIMIT ? OFFSET ?
        `;

        const queryParams = [...params, limit, offset];
        const [rows]: any = await db.query(query, queryParams);

        const [countRows]: any = await db.query(
            `SELECT COUNT(*) as total FROM city_video_consultancy_content ${whereSQL}`,
            params
        );

        const total = countRows[0]?.total || 0;

        return {
            status: 200,
            message: "Video Consult City content list fetched successfully",
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
            jsonData: {
                city_video_consultancy_content_list: rows
            },
        };

    } catch (error) {
        throw new ApiError(500, "Get Video Consult City Content Error On Fetching");
    }

};

// VideoConsult CITY CONTENT ADD SERVICE
export const addCityContentVideoConsultService = async (data: cityContentVideoConsultData) => {

    try {

        let imagePath: string | null = null;

        if (data.city_thumbnail) {
            imagePath = uploadFileCustom(data.city_thumbnail, "/city_video_consult_content");
        }

        const insertData = {
            city_name: data.city_name,
            city_title_sku: generateSlug(data.city_title_sku || ""),
            city_title: data.city_title,
            city_heading: data.city_heading,
            city_body_desc: data.city_body_desc,
            city_why_choose_us: data.city_why_choose_us,
            why_choose_meta_desc: data.why_choose_meta_desc,
            city_block1_heading: data.city_block1_heading,
            city_block1_body: data.city_block1_body,
            city_block2_heading: data.city_block2_heading,
            city_block2_body: data.city_block2_body,
            city_block3_heading: data.city_block3_heading,
            city_block3_body: data.city_block3_body,
            city_thumbnail: imagePath,
            city_thumbnail_alt: data.city_thumbnail_alt,
            city_thumbnail_title: data.city_thumbnail_title,
            city_meta_title: data.city_meta_title,
            city_meta_desc: data.city_meta_desc,
            city_meta_keyword: data.city_meta_keyword,
            city_force_keyword: data.city_force_keyword,
            city_faq_heading: data.city_faq_heading,
            city_faq_desc: data.city_faq_desc,
            city_emergency_heading: data.city_emergency_heading,
            city_emergency_desc: data.city_emergency_desc,
            city_status: 0,
            city_timestamp: currentUnixTime(),
        };

        const [result]: any = await db.query(
            `INSERT INTO city_video_consultancy_content SET ?`,
            [insertData]
        );

        return {
            status: 200,
            message: "Video Consult City content added successfully",
        };

    } catch (error) {
        throw new ApiError(500, "Add Video Consult City Content Error On Inserting");
    }

};

// VideoConsult CITY CONTENT FETCH SERVICE
export const fetchCityContentVideoConsultService = async (cityId: number) => {
    try {

        const [rows]: any = await db.query(
            `SELECT * FROM city_video_consultancy_content WHERE city_video_consultancy_content.city_id = ?`,
            [cityId]
        )

        return {
            status: 200,
            message: "Video Consult City content fetched successfully",
            jsonData: {
                city_video_consultancy_content: rows[0] || null
            }
        };

    } catch (error) {
        throw new ApiError(500, "Fetch Video Consult City Content Error On Fetching");
    }
};

// VideoConsult CITY CONTENT EDIT SERVICE
export const editCityContentVideoConsultService = async (cityId: number, data: cityContentVideoConsultData) => {
    try {

        const updateData: any = {};

        if (data.city_name) updateData.city_name = data.city_name;
        if (data.city_title_sku) updateData.city_title_sku = generateSlug(data.city_title_sku);
        if (data.city_title) updateData.city_title = data.city_title;
        if (data.city_heading) updateData.city_heading = data.city_heading;
        if (data.city_body_desc) updateData.city_body_desc = data.city_body_desc;
        if (data.city_why_choose_us) updateData.city_why_choose_us = data.city_why_choose_us;
        if (data.why_choose_meta_desc) updateData.why_choose_meta_desc = data.why_choose_meta_desc;
        if (data.city_block1_heading) updateData.city_block1_heading = data.city_block1_heading;
        if (data.city_block1_body) updateData.city_block1_body = data.city_block1_body;
        if (data.city_block2_heading) updateData.city_block2_heading = data.city_block2_heading;
        if (data.city_block2_body) updateData.city_block2_body = data.city_block2_body;
        if (data.city_block3_heading) updateData.city_block3_heading = data.city_block3_heading;
        if (data.city_block3_body) updateData.city_block3_body = data.city_block3_body;
        if (data.city_thumbnail) {
            const uploadedPath = uploadFileCustom(data.city_thumbnail, "/city_content");
            updateData.city_thumbnail = uploadedPath;
        }
        if (data.city_thumbnail_alt) updateData.city_thumbnail_alt = data.city_thumbnail_alt;
        if (data.city_thumbnail_title) updateData.city_thumbnail_title = data.city_thumbnail_title;
        if (data.city_meta_title) updateData.city_meta_title = data.city_meta_title;
        if (data.city_meta_desc) updateData.city_meta_desc = data.city_meta_desc;
        if (data.city_meta_keyword) updateData.city_meta_keyword = data.city_meta_keyword;
        if (data.city_force_keyword) updateData.city_force_keyword = data.city_force_keyword;
        if (data.city_faq_heading) updateData.city_faq_heading = data.city_faq_heading;
        if (data.city_faq_desc) updateData.city_faq_desc = data.city_faq_desc;
        if (data.city_emergency_heading) updateData.city_emergency_heading = data.city_emergency_heading;
        if (data.city_emergency_desc) updateData.city_emergency_desc = data.city_emergency_desc;

        const [result]: any = await db.query(
            `UPDATE city_video_consultancy_content SET ? WHERE city_id = ?`,
            [updateData, cityId]
        );

        return {
            status: 200,
            message: "Video Consult City content updated successfully",
        };

    } catch (error) {
        throw new ApiError(500, "Edit Video Consult City Content Error On Updating");
    }
};

// VideoConsult CITY CONTENT STATUS UPDATE SERVICE
export const updateCityContentVideoConsultStatusService = async (cityId: number, status: number) => {
    try {

        const [result]: any = await db.query(`
            UPDATE city_video_consultancy_content SET city_status = ? WHERE city_id = ?
        `, [status, cityId]);

        return {
            status: 200,
            message: "Video Consult City content status updated successfully",
        };

    } catch (error) {
        throw new ApiError(500, "Update Video Consult City Content Status Error On Updating");
    }
};


// ------------------------------------------- Pathology CITY CONTENT SERVICES ------------------------------------------- //


interface cityContentPathologyData {
    city_name?: string;
    city_title_sku?: string;
    city_title?: string;
    city_heading?: string;
    city_body_desc?: string;
    city_why_choose_us?: string;
    why_choose_meta_desc?: string;
    city_block1_heading?: string;
    city_block1_body?: string;
    city_block2_heading?: string;
    city_block2_body?: string;
    city_block3_heading?: string;
    city_block3_body?: string;
    city_thumbnail?: Express.Multer.File;
    city_thumbnail_alt?: string;
    city_thumbnail_title?: string;
    city_meta_title?: string;
    city_meta_desc?: string;
    city_meta_keyword?: string;
    city_force_keyword?: string;
    city_faq_heading?: string;
    city_faq_desc?: string;
    city_emergency_heading?: string;
    city_emergency_desc?: string;
}

// PATHOLOGY CITY CONSTENT LIST SERVICE
export const getCityContentPathologyService = async (filters?: {
    date?: string;
    status?: string;
    fromDate?: string;
    toDate?: string;
    page?: number;
    limit?: number;
}) => {

    try {

        const page = filters?.page && filters.page > 0 ? filters.page : 1;
        const limit = filters?.limit && filters.limit > 0 ? filters.limit : 100;
        const offset = (page - 1) * limit;

        const { whereSQL, params } = buildFilters({
            ...filters,
            dateColumn: "city_content.city_timestamp",
        });

        const query = `
            SELECT 
                city_content.city_id,
                city_content.city_name,
                city_content.city_title,
                city_content.city_status,
                city_content.city_timestamp
            FROM city_content
            ${whereSQL}
            ORDER BY city_content.city_id DESC
            LIMIT ? OFFSET ?
        `;

        const queryParams = [...params, limit, offset];
        const [rows]: any = await db.query(query, queryParams);

        const [countRows]: any = await db.query(
            `SELECT COUNT(*) as total FROM city_content ${whereSQL}`,
            params
        );

        const total = countRows[0]?.total || 0;

        return {
            status: 200,
            message: "City content list fetched successfully",
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
            jsonData: {
                city_content_list: rows
            },
        };

    } catch (error) {
        throw new ApiError(500, "Get City Content Error On Fetching");
    }

};

// PATHOLOGY CITY CONTENT ADD SERVICE
export const addCityContentPathologyService = async (data: cityContentPathologyData) => {

    try {

        let imagePath: string | null = null;

        if (data.city_thumbnail) {
            imagePath = uploadFileCustom(data.city_thumbnail, "/city_content");
        }

        const insertData = {
            city_name: data.city_name,
            city_title_sku: generateSlug(data.city_title_sku || ""),
            city_title: data.city_title,
            city_heading: data.city_heading,
            city_body_desc: data.city_body_desc,
            city_why_choose_us: data.city_why_choose_us,
            why_choose_meta_desc: data.why_choose_meta_desc,
            city_block1_heading: data.city_block1_heading,
            city_block1_body: data.city_block1_body,
            city_block2_heading: data.city_block2_heading,
            city_block2_body: data.city_block2_body,
            city_block3_heading: data.city_block3_heading,
            city_block3_body: data.city_block3_body,
            city_thumbnail: imagePath,
            city_thumbnail_alt: data.city_thumbnail_alt,
            city_thumbnail_title: data.city_thumbnail_title,
            city_meta_title: data.city_meta_title,
            city_meta_desc: data.city_meta_desc,
            city_meta_keyword: data.city_meta_keyword,
            city_force_keyword: data.city_force_keyword,
            city_faq_heading: data.city_faq_heading,
            city_faq_desc: data.city_faq_desc,
            city_emergency_heading: data.city_emergency_heading,
            city_emergency_desc: data.city_emergency_desc,
            city_status: 0,
            city_timestamp: currentUnixTime(),
        };

        const [result]: any = await db.query(
            `INSERT INTO city_content SET ?`,
            [insertData]
        );

        return {
            status: 200,
            message: "City content added successfully",
        };

    } catch (error) {
        throw new ApiError(500, "Add City Content Error On Inserting");
    }

};

// PATHOLOGY CITY CONTENT FETCH SERVICE
export const fetchCityContentPathologyService = async (cityId: number) => {
    try {

        const [rows]: any = await db.query(
            `SELECT * FROM city_content WHERE city_content.city_id = ?`,
            [cityId]
        )

        return {
            status: 200,
            message: "City content fetched successfully",
            jsonData: {
                city_content: rows[0] || null
            }
        };

    } catch (error) {
        throw new ApiError(500, "Fetch City Content Error On Fetching");
    }
};

// PATHOLOGY CITY CONTENT EDIT SERVICE
export const editCityContentPathologyService = async (cityId: number, data: cityContentPathologyData) => {
    try {

        const updateData: any = {};

        if (data.city_name) updateData.city_name = data.city_name;
        if (data.city_title_sku) updateData.city_title_sku = generateSlug(data.city_title_sku);
        if (data.city_title) updateData.city_title = data.city_title;
        if (data.city_heading) updateData.city_heading = data.city_heading;
        if (data.city_body_desc) updateData.city_body_desc = data.city_body_desc;
        if (data.city_why_choose_us) updateData.city_why_choose_us = data.city_why_choose_us;
        if (data.why_choose_meta_desc) updateData.why_choose_meta_desc = data.why_choose_meta_desc;
        if (data.city_block1_heading) updateData.city_block1_heading = data.city_block1_heading;
        if (data.city_block1_body) updateData.city_block1_body = data.city_block1_body;
        if (data.city_block2_heading) updateData.city_block2_heading = data.city_block2_heading;
        if (data.city_block2_body) updateData.city_block2_body = data.city_block2_body;
        if (data.city_block3_heading) updateData.city_block3_heading = data.city_block3_heading;
        if (data.city_block3_body) updateData.city_block3_body = data.city_block3_body;
        if (data.city_thumbnail) {
            const uploadedPath = uploadFileCustom(data.city_thumbnail, "/city_content");
            updateData.city_thumbnail = uploadedPath;
        }
        if (data.city_thumbnail_alt) updateData.city_thumbnail_alt = data.city_thumbnail_alt;
        if (data.city_thumbnail_title) updateData.city_thumbnail_title = data.city_thumbnail_title;
        if (data.city_meta_title) updateData.city_meta_title = data.city_meta_title;
        if (data.city_meta_desc) updateData.city_meta_desc = data.city_meta_desc;
        if (data.city_meta_keyword) updateData.city_meta_keyword = data.city_meta_keyword;
        if (data.city_force_keyword) updateData.city_force_keyword = data.city_force_keyword;
        if (data.city_faq_heading) updateData.city_faq_heading = data.city_faq_heading;
        if (data.city_faq_desc) updateData.city_faq_desc = data.city_faq_desc;
        if (data.city_emergency_heading) updateData.city_emergency_heading = data.city_emergency_heading;
        if (data.city_emergency_desc) updateData.city_emergency_desc = data.city_emergency_desc;

        const [result]: any = await db.query(
            `UPDATE city_content SET ? WHERE city_id = ?`,
            [updateData, cityId]
        );

        return {
            status: 200,
            message: "City content updated successfully",
        };

    } catch (error) {
        throw new ApiError(500, "Edit City Content Error On Updating");
    }
};

// PATHOLOGY CITY CONTENT STATUS UPDATE SERVICE
export const updateCityContentPathologyStatusService = async (cityId: number, status: number) => {
    try {

        const [result]: any = await db.query(`
            UPDATE city_content SET city_status = ? WHERE city_id = ?
        `, [status, cityId]);

        return {
            status: 200,
            message: "City content status updated successfully",
        };

    } catch (error) {
        throw new ApiError(500, "Update City Content Status Error On Updating");
    }
};