import { db } from "../../config/db";
import { ApiError } from "../../utils/api-error";
import { buildFilters } from "../../utils/filters";
import { currentUnixTime } from "../../utils/current_unixtime";
import { generateSlug } from "../../utils/generate_sku";
import path from "path";
import fs from "fs";

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
        const uploadDir = path.join(__dirname, "../../public/assets/blogs");

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const fileName = `${Date.now()}-${data.blogs_image.originalname}`;
        const filePath = path.join(uploadDir, fileName);

        fs.writeFileSync(filePath, data.blogs_image.buffer);
        imagePath = `assets/blogs/${fileName}`;
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