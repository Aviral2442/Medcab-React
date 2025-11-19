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
        const limit = filters?.limit && filters.limit > 0 ? filters.limit : 100;
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


interface ambulanceFaqData {
    ambulance_id: number;
    ambulance_faq_que: string;
    ambulance_faq_ans: string;
}

// SERVICE TO GET AMBULANCE FAQ LIST WITH FILTERS AND PAGINATION
export const getAmbulanceFaqListService = async (filters?: {
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
            dateColumn: "ambulance_faq.ambulance_faq_timestamp",
        });

        let finalWhereSQL = whereSQL;

        if (filters?.status) {
            const statusMap: Record<string, string> = {
                active: "ambulance_faq.ambulance_faq_status = 0",
                inactive: "ambulance_faq.ambulance_faq_status = 1",
            };

            const condition = statusMap[filters.status];

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
                ambulance_faq_id,
                ambulance_id,
                ambulance_faq_que,
                ambulance_faq_ans,
                ambulance_faq_status,
                ambulance_faq_timestamp
            FROM ambulance_faq
            ${finalWhereSQL}
            ORDER BY ambulance_faq_id DESC
            LIMIT ? OFFSET ?
        `;

        const queryParams = [...params, limit, offset];
        const [rows]: any = await db.query(query, queryParams);

        const [countRows]: any = await db.query(
            `SELECT COUNT(*) as total FROM ambulance_faq ${finalWhereSQL}`,
            params
        );

        const total = countRows[0]?.total || 0;

        return {
            status: 200,
            message: "Ambulance FAQ list fetched successfully",
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
            jsonData: {
                ambulance_faq_list: rows
            },
        };

    } catch (error) {
        console.log(error);
        throw new ApiError(500, "Get Ambulance FAQ List Error On Fetching");
    }

};

// SERVICE TO ADD NEW AMBULANCE FAQ
export const addAmbulanceFaqService = async (data: ambulanceFaqData) => {

    try {

        const insertData = {
            ambulance_id: data.ambulance_id,
            ambulance_faq_que: data.ambulance_faq_que,
            ambulance_faq_ans: data.ambulance_faq_ans,
            ambulance_faq_timestamp: currentUnixTime(),
            ambulance_faq_status: 0
        };

        await db.query(`INSERT INTO ambulance_faq SET ?`, [insertData]);

        return {
            status: 201,
            message: "Ambulance FAQ added successfully",
        };

    } catch (error) {
        console.log(error);
        throw new ApiError(500, "Add Ambulance FAQ Error On Inserting");
    }

};

// SERVICE TO GET SINGLE AMBULANCE FAQ
export const getAmbulanceFaqService = async (faqId: number) => {

    try {

        const [rows]: any = await db.query(
            `SELECT * FROM ambulance_faq WHERE ambulance_faq_id = ?`,
            [faqId]
        );

        if (!rows || rows.length === 0) {
            throw new ApiError(404, "Ambulance FAQ not found");
        }

        return {
            status: 200,
            message: "Ambulance FAQ fetched successfully",
            jsonData: {
                ambulance_faq: rows[0]
            },
        };

    } catch (error) {
        console.log(error);
        throw new ApiError(500, "Get Ambulance FAQ Error On Fetching");
    }

};

// SERVICE TO EDIT AMBULANCE FAQ
export const editAmbulanceFaqService = async (faqId: number, data: ambulanceFaqData) => {

    try {

        const updateData: any = {};

        if (data.ambulance_id) updateData.ambulance_id = data.ambulance_id;
        if (data.ambulance_faq_que) updateData.ambulance_faq_que = data.ambulance_faq_que;
        if (data.ambulance_faq_ans) updateData.ambulance_faq_ans = data.ambulance_faq_ans;

        if (Object.keys(updateData).length === 0) {
            return {
                status: 400,
                message: "No valid fields provided to update",
            };
        }

        await db.query(
            `UPDATE ambulance_faq SET ? WHERE ambulance_faq_id = ?`,
            [updateData, faqId]
        );

        return {
            status: 200,
            message: "Ambulance FAQ updated successfully",
        };

    } catch (error) {
        console.log(error);
        throw new ApiError(500, "Edit Ambulance FAQ Error On Updating");
    }

};

// SERVICE TO UPDATE AMBULANCE FAQ STATUS
export const updateAmbulanceFaqStatusService = async (faqId: number, status: number) => {

    try {

        await db.query(
            `UPDATE ambulance_faq SET ambulance_faq_status = ? WHERE ambulance_faq_id = ?`,
            [status, faqId]
        );

        return {
            status: 200,
            message: "Ambulance FAQ status updated successfully",
        };

    } catch (error) {
        console.log(error);
        throw new ApiError(500, "Update Ambulance FAQ Status Error On Updating");
    }

};

interface ambulanceFacilitiesData {
    ambulance_facilities_image?: Express.Multer.File;
    ambulance_facilities_category_type: string;
    ambulance_facilities_name: string;
    ambulance_facilities_state: string;
    ambulance_facilities_created_time?: number;
    ambulance_facilities_updated_time?: number;
}

// SERVICE TO GET AMBULANCE FACILITIES LIST WITH FILTERS AND PAGINATION
export const getAmbulanceFacilitiesListService = async (filters?: {
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
            dateColumn: "ambulance_facilities.ambulance_facilities_created_time",
        });

        let finalWhereSQL = whereSQL;

        if (filters?.status) {
            const statusConditionMap: Record<string, string> = {
                active: "ambulance_facilities.ambulance_facilities_state = 0",
                inactive: "ambulance_facilities.ambulance_facilities_state = 1",
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
                ambulance_facilities.ambulance_facilities_id,
                ambulance_facilities.ambulance_facilities_image,
                ambulance_facilities.ambulance_facilities_name,
                ambulance_facilities.ambulance_facilities_category_type,
                ambulance_facilities.ambulance_facilities_state,
                ambulance_facilities.ambulance_facilities_created_time
            FROM ambulance_facilities
            ${finalWhereSQL}
            ORDER BY ambulance_facilities.ambulance_facilities_id DESC
            LIMIT ? OFFSET ?
        `;

        const queryParams = [...params, limit, offset];
        const [rows]: any = await db.query(query, queryParams);

        const [countRows]: any = await db.query(
            `SELECT COUNT(*) as total FROM ambulance_facilities ${finalWhereSQL}`,
            params
        );

        const total = countRows[0]?.total || 0;

        return {
            status: 200,
            message: "Ambulance facilities list fetched successfully",
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
            jsonData: {
                ambulance_facilities_list: rows
            },
        };

    } catch (error) {
        console.log(error);
        throw new ApiError(500, "Get Ambulance Facilities List Error On Fetching");
    }

};

// SERVICE TO ADD NEW AMBULANCE FACILITY
export const addAmbulanceFacilitiesService = async (data: ambulanceFacilitiesData) => {

    let imagePath = null;

    if (data.ambulance_facilities_image) {
        const uploadedPath = uploadFileCustom(data.ambulance_facilities_image, "/ambulance_facilities");
        imagePath = uploadedPath;
    }

    try {
        const insertData = {
            ambulance_facilities_image: imagePath,
            ambulance_facilities_category_type: data.ambulance_facilities_category_type,
            ambulance_facilities_name: data.ambulance_facilities_name,
            ambulance_facilities_state: data.ambulance_facilities_state,
            ambulance_facilities_created_time: currentUnixTime(),
            ambulance_facilities_updated_time: currentUnixTime(),
        }

        const [result]: any = await db.query(
            `INSERT INTO ambulance_facilities SET ?`,
            [insertData]
        );

        return {
            status: 201,
            message: "Ambulance facility added successfully",
        };

    } catch (error) {
        throw new ApiError(500, "Add Ambulance Facilities Error On Inserting");
    }

};

// SERVICE TO GET SINGLE AMBULANCE FACILITY
export const getAmbulanceFacilitiesService = async (facilityId: number) => {
    try {
        const [rows]: any = await db.query(
            `SELECT * FROM ambulance_facilities WHERE ambulance_facilities_id = ?`,
            [facilityId]
        );

        if (!rows || rows.length === 0) {
            throw new ApiError(404, "Ambulance facility not found");
        }

        return {
            status: 200,
            message: "Ambulance facility fetched successfully",
            jsonData: {
                ambulance_facility: rows[0]
            },
        };
    } catch (error) {
        console.log(error);
        throw new ApiError(500, "Get Ambulance Facilities Error On Fetching");
    }
};

// SERVICE TO EDIT AMBULANCE FACILITIES
export const editAmbulanceFacilitiesService = async (facilityId: number, data: ambulanceFacilitiesData) => {

    try {

        const updateData: any = {};

        if (data.ambulance_facilities_category_type)
            updateData.ambulance_facilities_category_type = data.ambulance_facilities_category_type;

        if (data.ambulance_facilities_name)
            updateData.ambulance_facilities_name = data.ambulance_facilities_name;

        if (data.ambulance_facilities_state)
            updateData.ambulance_facilities_state = data.ambulance_facilities_state;

        updateData.ambulance_facilities_updated_time = currentUnixTime();

        if (data.ambulance_facilities_image) {
            const uploadedPath = uploadFileCustom(data.ambulance_facilities_image, "/ambulance_facilities");
            updateData.ambulance_facilities_image = uploadedPath;
        }

        if (Object.keys(updateData).length === 0) {
            return {
                status: 400,
                message: "No valid fields provided to update",
            };
        }

        const [result]: any = await db.query(
            `UPDATE ambulance_facilities SET ? WHERE ambulance_facilities_id = ?`,
            [updateData, facilityId]
        );

        return {
            status: 200,
            message: "Ambulance facility updated successfully",
        };

    } catch (error) {
        console.log(error);
        throw new ApiError(500, "Edit Ambulance Facilities Error On Updating");
    }

};

// SERVICE TO UPDATE AMBULANCE FACILITIES STATUS
export const updateAmbulanceFacilitiesStatusService = async (facilityId: number, status: number) => {
    try {

        const [result]: any = await db.query(
            `UPDATE ambulance_facilities SET ambulance_facilities_state = ? WHERE ambulance_facilities_id = ?`,
            [status, facilityId]
        );

        return {
            status: 200,
            message: "Ambulance facility status updated successfully",
        };

    } catch (error) {
        console.log(error);
        throw new ApiError(500, "Update Ambulance Facilities Status Error On Updating");
    }
};


interface ambulanceFacilitiesRateData {
    ambulance_facilities_rate_f_id?: number;
    ambulance_facilities_rate_amount?: string;
    ambulance_facilities_rate_increase_per_km?: string;
    ambulance_facilities_rate_from?: string;
    ambulance_facilities_rate_to?: string;
    ambulance_facilities_rate_status?: string;
}

// SERVICE TO GET AMBULANCE FACILITIES RATE LIST WITH FILTERS AND PAGINATION
export const getAmbulanceFacilitiesRateListService = async (filters?: {
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
            dateColumn: "ambulance_facilities_rate.ambulance_facilities_rate_date",
        });

        let finalWhereSQL = whereSQL;

        if (filters?.status) {

            const statusConditionMap: Record<string, string> = {
                active: "ambulance_facilities_rate.ambulance_facilities_rate_status = 0",
                inactive: "ambulance_facilities_rate.ambulance_facilities_rate_status = 1",
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
                ambulance_facilities_rate.ambulance_facilities_rate_id,
                ambulance_facilities_rate.ambulance_facilities_rate_f_id,
                ambulance_facilities_rate.ambulance_facilities_rate_amount,
                ambulance_facilities_rate.ambulance_facilities_rate_increase_per_km,
                ambulance_facilities_rate.ambulance_facilities_rate_from,
                ambulance_facilities_rate.ambulance_facilities_rate_to,
                ambulance_facilities_rate.ambulance_facilities_rate_status,
                ambulance_facilities_rate.ambulance_facilities_rate_date
            FROM ambulance_facilities_rate
            ${finalWhereSQL}
            ORDER BY ambulance_facilities_rate.ambulance_facilities_rate_id DESC
            LIMIT ? OFFSET ?
        `;

        const queryParams = [...params, limit, offset];
        const [rows]: any = await db.query(query, queryParams);

        const [countRows]: any = await db.query(
            `SELECT COUNT(*) as total FROM ambulance_facilities_rate ${finalWhereSQL}`,
            params
        );

        const total = countRows[0]?.total || 0;

        return {
            status: 200,
            message: "Ambulance facilities rate list fetched successfully",
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
            jsonData: {
                ambulance_facilities_rate_list: rows
            },
        };

    } catch (error) {
        console.log(error);
        throw new ApiError(500, "Get Ambulance Facilities Rate List Error On Fetching");
    }

};

// SERVICE TO ADD NEW AMBULANCE FACILITIES RATE
export const addAmbulanceFacilitiesRateService = async (data: ambulanceFacilitiesRateData) => {

    try {

        const insertData = {
            ambulance_facilities_rate_f_id: data.ambulance_facilities_rate_f_id,
            ambulance_facilities_rate_amount: data.ambulance_facilities_rate_amount,
            ambulance_facilities_rate_increase_per_km: data.ambulance_facilities_rate_increase_per_km,
            ambulance_facilities_rate_from: data.ambulance_facilities_rate_from,
            ambulance_facilities_rate_to: data.ambulance_facilities_rate_to,
            ambulance_facilities_rate_status: data.ambulance_facilities_rate_status,
        };

        const [result]: any = await db.query(
            `INSERT INTO ambulance_facilities_rate SET ?`,
            [insertData]
        );

        return {
            status: 201,
            message: "Ambulance facilities rate added successfully",
        };

    } catch (error) {
        throw new ApiError(500, "Add Ambulance Facilities Rate Error On Inserting");
    }

};

// SERVICE TO GET SINGLE AMBULANCE FACILITIES RATE
export const getAmbulanceFacilitiesRateService = async (rateId: number) => {
    try {

        const [rows]: any = await db.query(
            `SELECT * FROM ambulance_facilities_rate WHERE ambulance_facilities_rate_id = ?`,
            [rateId]
        );

        if (!rows || rows.length === 0) {
            throw new ApiError(404, "Ambulance facilities rate not found");
        }

        return {
            status: 200,
            message: "Ambulance facilities rate fetched successfully",
            jsonData: {
                ambulance_facilities_rate: rows[0]
            },
        };

    } catch (error) {
        console.log(error);
        throw new ApiError(500, "Get Ambulance Facilities Rate Error On Fetching");
    }
};

// SERVICE TO EDIT AMBULANCE FACILITIES RATE
export const editAmbulanceFacilitiesRateService = async (rateId: number, data: ambulanceFacilitiesRateData) => {

    try {

        const updateData: any = {};

        if (data.ambulance_facilities_rate_f_id)
            updateData.ambulance_facilities_rate_f_id = data.ambulance_facilities_rate_f_id;

        if (data.ambulance_facilities_rate_amount)
            updateData.ambulance_facilities_rate_amount = data.ambulance_facilities_rate_amount;

        if (data.ambulance_facilities_rate_increase_per_km)
            updateData.ambulance_facilities_rate_increase_per_km = data.ambulance_facilities_rate_increase_per_km;

        if (data.ambulance_facilities_rate_from)
            updateData.ambulance_facilities_rate_from = data.ambulance_facilities_rate_from;

        if (data.ambulance_facilities_rate_to)
            updateData.ambulance_facilities_rate_to = data.ambulance_facilities_rate_to;

        if (data.ambulance_facilities_rate_status)
            updateData.ambulance_facilities_rate_status = data.ambulance_facilities_rate_status;

        if (Object.keys(updateData).length === 0) {
            return {
                status: 400,
                message: "No valid fields provided to update",
            };
        }

        const [result]: any = await db.query(
            `UPDATE ambulance_facilities_rate SET ? WHERE ambulance_facilities_rate_id = ?`,
            [updateData, rateId]
        );

        return {
            status: 200,
            message: "Ambulance facilities rate updated successfully",
        };

    } catch (error) {
        console.log(error);
        throw new ApiError(500, "Edit Ambulance Facilities Rate Error On Updating");
    }

};

// SERVICE TO UPDATE AMBULANCE FACILITIES RATE STATUS
export const updateAmbulanceFacilitiesRateStatusService = async (rateId: number, status: number) => {

    try {

        const [result]: any = await db.query(
            `UPDATE ambulance_facilities_rate SET ambulance_facilities_rate_status = ? WHERE ambulance_facilities_rate_id = ?`,
            [status, rateId]
        );

        return {
            status: 200,
            message: "Ambulance facilities rate status updated successfully",
        };

    } catch (error) {
        console.log(error);
        throw new ApiError(500, "Update Ambulance Facilities Rate Status Error On Updating");
    }

};

// SERVICE TO GET AMBULANCE BOOKING LIST WITH FILTERS AND PAGINATION
export const getAmbulanceBookingListService = async (filters?: {
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
            dateColumn: "booking_view.created_at",
        });

        let finalWhereSQL = whereSQL;

        if (filters?.status) {
            const statusConditionMap: Record<string, string> = {
                enquery: "booking_view.booking_status = 0",
                confirmBooking: "booking_view.booking_status = 1",
                driverAssign: "booking_view.booking_status = 2",
                invoice: "booking_view.booking_status = 3",
                complete: "booking_view.booking_status = 4",
                cancel: "booking_view.booking_status = 5",
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
                booking_view.booking_id,
                booking_view.booking_source,
                booking_view.booking_type,
                booking_view.booking_con_name,
                booking_view.booking_con_mobile,
                booking_view.booking_category,
                booking_view.booking_schedule_time,
                booking_view.booking_pickup,
                booking_view.booking_drop,
                booking_view.booking_status,
                booking_view.booking_total_amount,
                booking_view.created_at
            FROM booking_view
            ${finalWhereSQL}
            ORDER BY booking_view.booking_id DESC
            LIMIT ? OFFSET ?
        `;

        const queryParams = [...params, limit, offset];
        const [rows]: any = await db.query(query, queryParams);

        const [countRows]: any = await db.query(
            `SELECT COUNT(*) as total FROM booking_view ${finalWhereSQL}`,
            params
        );

        const total = countRows[0]?.total || 0;

        return {
            status: 200,
            message: "Ambulance booking list fetched successfully",
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
            jsonData: {
                booking_list: rows
            },
        };

    } catch (error) {
        console.log(error);

        throw new ApiError(500, "Get Ambulance Booking List Error On Fetching");
    }

};

// SERVICE TO GET REGULAR AMBULANCE BOOKING LIST WITH FILTERS AND PAGINATION
export const getRegularAmbulanceBookingListService = async (filters?: {
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
            dateColumn: "booking_view.created_at",
        });

        let finalWhereSQL = "WHERE booking_view.booking_type = 0";

        if (whereSQL) {
            finalWhereSQL += whereSQL.replace(/^\s*WHERE/i, " AND");
        }

        if (filters?.status) {
            const statusConditionMap: Record<string, string> = {
                enquery: "booking_view.booking_status = 0",
                confirmBooking: "booking_view.booking_status = 1",
                driverAssign: "booking_view.booking_status = 2",
                invoice: "booking_view.booking_status = 3",
                complete: "booking_view.booking_status = 4",
                cancel: "booking_view.booking_status = 5",
            };

            const condition = statusConditionMap[filters.status];

            if (condition) {
                finalWhereSQL += ` AND ${condition}`;
            }
        }

        const query = `
            SELECT 
                booking_view.booking_id,
                booking_view.booking_source,
                booking_view.booking_type,
                booking_view.booking_con_name,
                booking_view.booking_con_mobile,
                booking_view.booking_category,
                booking_view.booking_schedule_time,
                booking_view.booking_pickup,
                booking_view.booking_drop,
                booking_view.booking_status,
                booking_view.booking_total_amount,
                booking_view.created_at
            FROM booking_view
            ${finalWhereSQL}
            ORDER BY booking_view.booking_id DESC
            LIMIT ? OFFSET ?
        `;

        const queryParams = [...params, limit, offset];
        const [rows]: any = await db.query(query, queryParams);

        const [countRows]: any = await db.query(
            `SELECT COUNT(*) as total FROM booking_view ${finalWhereSQL}`,
            params
        );

        const total = countRows[0]?.total || 0;

        return {
            status: 200,
            message: "Regular Ambulance booking list fetched successfully",
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
            jsonData: {
                regular_ambulance_booking_list: rows
            },
        };

    } catch (error) {
        console.log(error);

        throw new ApiError(500, "Get Regular Ambulance Booking List Error On Fetching");
    }
};

// SERVICE TO GET RENTAL AMBULANCE BOOKING LIST WITH FILTERS AND PAGINATION
export const getRentalAmbulanceBookingListService = async (filters?: {
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
            dateColumn: "booking_view.created_at",
        });

        let finalWhereSQL = "WHERE booking_view.booking_type = 1";

        if (whereSQL) {
            finalWhereSQL += whereSQL.replace(/^\s*WHERE/i, " AND");
        }

        if (filters?.status) {
            const statusConditionMap: Record<string, string> = {
                enquery: "booking_view.booking_status = 0",
                confirmBooking: "booking_view.booking_status = 1",
                driverAssign: "booking_view.booking_status = 2",
                invoice: "booking_view.booking_status = 3",
                complete: "booking_view.booking_status = 4",
                cancel: "booking_view.booking_status = 5",
            };

            const condition = statusConditionMap[filters.status];

            if (condition) {
                finalWhereSQL += ` AND ${condition}`;
            }
        }

        const query = `
            SELECT 
                booking_view.booking_id,
                booking_view.booking_source,
                booking_view.booking_type,
                booking_view.booking_con_name,
                booking_view.booking_con_mobile,
                booking_view.booking_category,
                booking_view.booking_schedule_time,
                booking_view.booking_pickup,
                booking_view.booking_drop,
                booking_view.booking_status,
                booking_view.booking_total_amount,
                booking_view.created_at
            FROM booking_view
            ${finalWhereSQL}
            ORDER BY booking_view.booking_id DESC
            LIMIT ? OFFSET ?
        `;

        const queryParams = [...params, limit, offset];
        const [rows]: any = await db.query(query, queryParams);

        const [countRows]: any = await db.query(
            `SELECT COUNT(*) as total FROM booking_view ${finalWhereSQL}`,
            params
        );

        const total = countRows[0]?.total || 0;

        return {
            status: 200,
            message: "Rental Ambulance booking list fetched successfully",
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
            jsonData: {
                rental_ambulance_booking_list: rows
            },
        };

    } catch (error) {
        console.log(error);

        throw new ApiError(500, "Get Rental Ambulance Booking List Error On Fetching");
    }
};

// SERVICE TO GET BULK AMBULANCE BOOKING LIST WITH FILTERS AND PAGINATION
export const getBulkAmbulanceBookingListService = async (filters?: {
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
            dateColumn: "booking_view.created_at",
        });

        let finalWhereSQL = "WHERE booking_view.booking_type = 2";

        if (whereSQL) {
            finalWhereSQL += whereSQL.replace(/^\s*WHERE/i, " AND");
        }

        if (filters?.status) {
            const statusConditionMap: Record<string, string> = {
                enquery: "booking_view.booking_status = 0",
                confirmBooking: "booking_view.booking_status = 1",
                driverAssign: "booking_view.booking_status = 2",
                invoice: "booking_view.booking_status = 3",
                complete: "booking_view.booking_status = 4",
                cancel: "booking_view.booking_status = 5",
            };

            const condition = statusConditionMap[filters.status];

            if (condition) {
                finalWhereSQL += ` AND ${condition}`;
            }
        }

        const query = `
            SELECT 
                booking_view.booking_id,
                booking_view.booking_source,
                booking_view.booking_type,
                booking_view.booking_con_name,
                booking_view.booking_con_mobile,
                booking_view.booking_category,
                booking_view.booking_schedule_time,
                booking_view.booking_pickup,
                booking_view.booking_drop,
                booking_view.booking_status,
                booking_view.booking_total_amount,
                booking_view.created_at
            FROM booking_view
            ${finalWhereSQL}
            ORDER BY booking_view.booking_id DESC
            LIMIT ? OFFSET ?
        `;

        const queryParams = [...params, limit, offset];
        const [rows]: any = await db.query(query, queryParams);

        const [countRows]: any = await db.query(
            `SELECT COUNT(*) as total FROM booking_view ${finalWhereSQL}`,
            params
        );

        const total = countRows[0]?.total || 0;

        return {
            status: 200,
            message: "Bulk Ambulance booking list fetched successfully",
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
            jsonData: {
                bulk_ambulance_booking_list: rows
            },
        };

    } catch (error) {
        console.log(error);

        throw new ApiError(500, "Get Bulk Ambulance Booking List Error On Fetching");
    }
};

// SERVICE TO GET AMBULANCE BOOKING DETAIL
export const ambulanceBookingDetailService = async (bookingId: number) => {
    try {

        const [rows]: any = await db.query(
            `SELECT * FROM booking_view WHERE booking_id = ?`,
            [bookingId]
        );

        if (!rows || rows.length === 0) {
            throw new ApiError(404, "Ambulance booking not found");
        }

        return {
            status: 200,
            message: "Ambulance booking detail fetched successfully",
            jsonData: {
                booking_detail: rows[0]
            },
        };

    } catch (error) {
        throw new ApiError(500, "Get Ambulance Booking Detail Error On Fetching");
    }
}