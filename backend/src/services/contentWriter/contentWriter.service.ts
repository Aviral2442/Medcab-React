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
        const limit = filters?.limit && filters.limit > 0 ? filters.limit : 10;
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

// SERVICE TO EDIT EXISTING BLOG
export const editBlogService = async (blogId: number, data: blogData) => {

    try {

        // const updateData: any = {
        //     blogs_title: data.blogs_title,
        //     blogs_sku: generateSlug(data.blogs_sku),
        //     blogs_short_desc: data.blogs_short_desc,
        //     blogs_long_desc: data.blogs_long_desc,
        //     blogs_category: data.blogs_category,
        //     blogs_meta_title: data.blogs_meta_title,
        //     blogs_meta_desc: data.blogs_meta_desc,
        //     blogs_meta_keywords: data.blogs_meta_keywords,
        //     blogs_force_keywords: data.blogs_force_keywords,
        //     blogs_schema: data.blogs_schema,
        // };

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
        console.log(error);

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


interface city_content_Data {
    city_name: string;
    city_title_sku: string;
    city_title: string;
    city_heading: string;
    city_body_desc: string;
    city_why_choose_us: string;
    why_choose_meta_desc: string;
    city_block1_heading: string;
    city_block1_body: string;
    city_block2_heading: string;
    city_block2_body: string;
    city_thumbnail: Express.Multer.File;
    city_thumbnail_alt: string;
    city_meta_title: string;
    city_meta_desc: string;
    city_meta_keyword: string;
    city_force_keyword: string;
    city_faq_heading: string;
    city_status: number;
    city_emergency_desc: string;
    city_timestamp: number;
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
        const limit = filters?.limit && filters.limit > 0 ? filters.limit : 10;
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