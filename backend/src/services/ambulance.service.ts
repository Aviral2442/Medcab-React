import { db } from '../config/db';
import { ApiError } from '../utils/api-error';
import { buildFilters } from "../utils/filters";
import { currentUnixTime } from "../utils/current_unixtime";
import { generateSlug } from "../utils/generate_sku";
import { uploadFileCustom } from "../utils/file_uploads";

interface AmbulanceData {
    ambulance_category_type?: string;
    ambulance_category_service_type?: string; // enum('0', '1')  1 for human and 0 for animal
    ambulance_category_state_id?: number;
    ambulance_category_name?: string;
    ambulance_category_icon?: Express.Multer.File;
    ambulance_catagory_desc?: string;
}

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
}