import { db } from '../config/db';
import { ApiError } from '../utils/api-error';
import { buildFilters } from "../utils/filters";
import { currentUnixTime } from "../utils/current_unixtime";
import { generateSlug } from "../utils/generate_sku";
import { uploadFileCustom } from "../utils/file_uploads";

interface airAmbulanceData {
    air_ambulance_icon?: Express.Multer.File;
    air_ambulance_type: string;
    air_ambulance_name: string;
    air_ambulance_base_rate: string;
    created_at?: number;
    updated_at?: number;
};

// SERVICE TO GET AIR AMBULANCE CATEGORY LIST WITH FILTERS AND PAGINATION
export const getAirAmbulanceCategoryListService = async (filters?: {
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
            dateColumn: "air_ambulance_category.created_at",
        });

        let finalWhereSQL = whereSQL;

        if (filters?.status) {
            const statusConditionMap: Record<string, string> = {
                active: "air_ambulance_category.air_ambulance_status = 0",
                inactive: "air_ambulance_category.air_ambulance_status = 1",
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
                air_ambulance_id,
                air_ambulance_type,
                air_ambulance_name,
                air_ambulance_icon,
                air_ambulance_base_rate,
                created_at,
                updated_at
            FROM air_ambulance_category
            ${finalWhereSQL}
            ORDER BY air_ambulance_id DESC
            LIMIT ? OFFSET ?
        `;

        const queryParams = [...params, limit, offset];
        const [rows]: any = await db.query(query, queryParams);

        const [countRows]: any = await db.query(
            `SELECT COUNT(*) as total FROM air_ambulance_category ${finalWhereSQL}`,
            params
        );

        const total = countRows[0]?.total || 0;

        return {
            status: 200,
            message: "Air ambulance category list fetched successfully",
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
            jsonData: {
                air_ambulance_category_list: rows
            },
        };

    } catch (error) {
        console.log(error);
        throw new ApiError(500, "Get Air Ambulance Category List Error On Fetching");
    }

};

// SERVICE TO ADD NEW AIR AMBULANCE CATEGORY
export const addAirAmbulanceCategoryService = async (data: airAmbulanceData) => {

    let iconPath = null;

    if (data.air_ambulance_icon) {
        const uploadedPath = uploadFileCustom(data.air_ambulance_icon, "/air_ambulance_category");
        iconPath = uploadedPath;
    }

    try {
        const insertData = {
            air_ambulance_type: data.air_ambulance_type,
            air_ambulance_name: data.air_ambulance_name,
            air_ambulance_icon: iconPath,
            air_ambulance_base_rate: data.air_ambulance_base_rate,
            created_at: currentUnixTime(),
            updated_at: currentUnixTime(),
            air_ambulance_status: 0
        };

        const [result]: any = await db.query(
            `INSERT INTO air_ambulance_category SET ?`,
            [insertData]
        );

        return {
            status: 201,
            message: "Air ambulance category added successfully",
        };

    } catch (error) {
        console.log(error);
        throw new ApiError(500, "Add Air Ambulance Category Error On Inserting");
    }

};

// SERVICE TO GET SINGLE AIR AMBULANCE CATEGORY
export const getAirAmbulanceCategoryService = async (id: number) => {
    try {
        const [rows]: any = await db.query(
            `SELECT * FROM air_ambulance_category WHERE air_ambulance_id = ?`,
            [id]
        );

        if (!rows || rows.length === 0) {
            throw new ApiError(404, "Air ambulance category not found");
        }

        return {
            status: 200,
            message: "Air ambulance category fetched successfully",
            jsonData: {
                air_ambulance_category: rows[0]
            },
        };
    } catch (error) {
        console.log(error);
        throw new ApiError(500, "Get Air Ambulance Category Error On Fetching");
    }
};

// SERVICE TO EDIT EXISTING AIR AMBULANCE CATEGORY
export const editAirAmbulanceCategoryService = async (id: number, data: airAmbulanceData) => {

    try {

        const updateData: any = {};

        if (data.air_ambulance_type) updateData.air_ambulance_type = data.air_ambulance_type;
        if (data.air_ambulance_name) updateData.air_ambulance_name = data.air_ambulance_name;
        if (data.air_ambulance_base_rate) updateData.air_ambulance_base_rate = data.air_ambulance_base_rate;
        updateData.updated_at = currentUnixTime();

        if (data.air_ambulance_icon) {
            const uploadedPath = uploadFileCustom(data.air_ambulance_icon, "/air_ambulance_category");
            updateData.air_ambulance_icon = uploadedPath;
        }

        if (Object.keys(updateData).length === 0) {
            return {
                status: 400,
                message: "No valid fields provided to update",
            };
        }

        const [result]: any = await db.query(
            `UPDATE air_ambulance_category SET ? WHERE air_ambulance_id = ?`,
            [updateData, id]
        );

        return {
            status: 200,
            message: "Air ambulance category updated successfully",
        };

    } catch (error) {
        console.log(error);
        throw new ApiError(500, "Edit Air Ambulance Category Error On Updating");
    }

};

// SERVICE TO UPDATE AIR AMBULANCE CATEGORY STATUS
export const updateAirAmbulanceCategoryStatusService = async (id: number, status: number) => {
    try {

        const [result]: any = await db.query(
            `UPDATE air_ambulance_category SET air_ambulance_status = ? WHERE air_ambulance_id = ?`,
            [status, id]
        );

        return {
            status: 200,
            message: "Air ambulance category status updated successfully",
        };

    } catch (error) {
        console.log(error);
        throw new ApiError(500, "Update Air Ambulance Category Status Error On Updating");
    }
};
