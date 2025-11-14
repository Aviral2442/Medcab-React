import { db } from '../config/db';
import { ApiError } from '../utils/api-error';
import { buildFilters } from "../utils/filters";
import { currentUnixTime } from "../utils/current_unixtime";
import { generateSlug } from "../utils/generate_sku";
import { uploadFileCustom } from "../utils/file_uploads";

interface ambulanceCategoryData {
    ambulance_category_type: string;
    ambulance_category_service_type: string; // enum('0','1')
    ambulance_category_state_id: number;
    ambulance_category_name: string;
    ambulance_category_icon?: Express.Multer.File;
    ambulance_catagory_desc: string;
    ambulance_category_sku: string;
};

// Get Ambulance Category List Service
export const getAmbulanceCategoryListService = async (filters?: {
    // date?: string;
    // fromDate?: string;
    // toDate?: string;
    status?: string;
    page?: number;
    limit?: number;
}) => {

    try {
        const page = filters?.page && filters.page > 0 ? filters.page : 1;
        const limit = filters?.limit && filters.limit > 0 ? filters.limit : 10;
        const offset = (page - 1) * limit;

        // const { whereSQL, params } = buildFilters({
        //     ...filters,
        //     dateColumn: "ambulance_category.ambulance_category_added_date",
        // });

        let finalWhereSQL = "";

        if (filters?.status) {
            const statusConditionMap: Record<string, string> = {
                active: "ambulance_category.ambulance_category_status = 0",
                inactive: "ambulance_category.ambulance_category_status = 1",
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
                ambulance_category.ambulance_category_id,
                ambulance_category.ambulance_category_type,
                ambulance_category.ambulance_category_service_type,
                ambulance_category.ambulance_category_name,
                ambulance_category.ambulance_category_icon,
                ambulance_category.ambulance_category_added_date,
                ambulance_category.ambulance_category_status
            FROM ambulance_category
            ${finalWhereSQL}
            ORDER BY ambulance_category.ambulance_category_id DESC
            LIMIT ? OFFSET ?
        `;

        const queryParams = [limit, offset];
        const [rows]: any = await db.query(query, queryParams);

        const [countRows]: any = await db.query(
            `SELECT COUNT(*) as total FROM ambulance_category ${finalWhereSQL}`,
            []
        );

        const total = countRows[0]?.total || 0;

        return {
            status: 200,
            message: "Ambulance categories list fetched successfully",
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
            jsonData: {
                ambulance_categories_list: rows
            },
        };

    } catch (error) {
        console.log(error);

        throw new ApiError(500, "Get Ambulance Categories List Error On Fetching");
    }
};

// SERVICE TO ADD NEW AMBULANCE CATEGORY
export const addAmbulanceCategoryService = async (data: ambulanceCategoryData) => {

    let iconPath = null;

    if (data.ambulance_category_icon) {
        const uploadedPath = uploadFileCustom(data.ambulance_category_icon, "/ambulance_category");
        iconPath = uploadedPath;
    }

    try {

        const insertData = {
            ambulance_category_type: data.ambulance_category_type,
            ambulance_category_service_type: data.ambulance_category_service_type,
            ambulance_category_state_id: data.ambulance_category_state_id,
            ambulance_category_name: data.ambulance_category_name,
            ambulance_category_icon: iconPath,
            ambulance_catagory_desc: data.ambulance_catagory_desc,
            ambulance_category_sku: generateSlug(data.ambulance_category_sku),
            ambulance_category_added_date: currentUnixTime(),
            ambulance_category_status: 0
        };

        const [result]: any = await db.query(
            `INSERT INTO ambulance_category SET ?`,
            [insertData]
        );

        return {
            status: 201,
            message: "Ambulance Category added successfully",
        };

    } catch (error) {
        console.log(error);
        throw new ApiError(500, "Add Ambulance Category Error On Inserting");
    }

};

// SERVICE TO GET SINGLE AMBULANCE CATEGORY
export const getAmbulanceCategoryService = async (categoryId: number) => {
    try {

        const [rows]: any = await db.query(
            `SELECT * FROM ambulance_category WHERE ambulance_category_id = ?`,
            [categoryId]
        );

        if (!rows || rows.length === 0) {
            throw new ApiError(404, "Ambulance Category not found");
        }

        return {
            status: 200,
            message: "Ambulance Category fetched successfully",
            jsonData: {
                ambulance_category: rows[0]
            },
        };

    } catch (error) {
        console.log(error);
        throw new ApiError(500, "Get Ambulance Category Error On Fetching");
    }
};

// SERVICE TO EDIT EXISTING AMBULANCE CATEGORY
export const editAmbulanceCategoryService = async (categoryId: number, data: ambulanceCategoryData) => {

    try {

        const updateData: any = {};

        if (data.ambulance_category_type) updateData.ambulance_category_type = data.ambulance_category_type;
        if (data.ambulance_category_service_type) updateData.ambulance_category_service_type = data.ambulance_category_service_type;
        if (data.ambulance_category_state_id) updateData.ambulance_category_state_id = data.ambulance_category_state_id;
        if (data.ambulance_category_name) updateData.ambulance_category_name = data.ambulance_category_name;
        if (data.ambulance_catagory_desc) updateData.ambulance_catagory_desc = data.ambulance_catagory_desc;
        if (data.ambulance_category_sku) updateData.ambulance_category_sku = generateSlug(data.ambulance_category_sku);

        if (data.ambulance_category_icon) {
            const uploadedPath = uploadFileCustom(data.ambulance_category_icon, "/ambulance_category");
            updateData.ambulance_category_icon = uploadedPath;
        }

        if (Object.keys(updateData).length === 0) {
            return {
                status: 400,
                message: "No valid fields provided to update",
            };
        }

        const [result]: any = await db.query(
            `UPDATE ambulance_category SET ? WHERE ambulance_category_id = ?`,
            [updateData, categoryId]
        );

        return {
            status: 200,
            message: "Ambulance Category updated successfully",
        };

    } catch (error) {
        console.log(error);
        throw new ApiError(500, "Edit Ambulance Category Error On Updating");
    }

};

// SERVICE TO UPDATE AMBULANCE CATEGORY STATUS
export const updateAmbulanceCategoryStatusService = async (categoryId: number, status: number) => {
    try {

        const [result]: any = await db.query(
            `UPDATE ambulance_category SET ambulance_category_status = ? WHERE ambulance_category_id = ?`,
            [status, categoryId]
        );

        return {
            status: 200,
            message: "Ambulance Category status updated successfully",
        };

    } catch (error) {
        console.log(error);
        throw new ApiError(500, "Update Ambulance Category Status Error On Updating");
    }
};