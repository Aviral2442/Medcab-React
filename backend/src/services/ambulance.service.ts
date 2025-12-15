import { db } from '../config/db';
import { ApiError } from '../utils/api-error';
import { buildFilters } from "../utils/filters";
import { currentUnixTime } from "../utils/current_unixtime";
import { generateSlug } from "../utils/generate_sku";
import { uploadFileCustom } from "../utils/file_uploads";
import { FieldPacket, RowDataPacket } from 'mysql2';

// SERVICE TO GET TOTAL AMBULANCE BOOKING COUNT
export const ambulanceBookingCountService = async () => {
    try {
        const query = `
            SELECT 
            COUNT(booking_id) AS bookingTotalCount,
            COUNT(CASE WHEN DATE(FROM_UNIXTIME(booking_view.created_at_unix)) = CURDATE() THEN 1 END) AS today_bookings,
            COUNT(CASE WHEN DATE(FROM_UNIXTIME(booking_view.created_at_unix)) = CURDATE() - INTERVAL 1 DAY THEN 1 END) AS yesterday_bookings,
            COUNT(CASE WHEN DATE(FROM_UNIXTIME(booking_view.created_at_unix)) = CURDATE() - INTERVAL 2 DAY THEN 1 END) AS day_2_bookings,
            COUNT(CASE WHEN DATE(FROM_UNIXTIME(booking_view.created_at_unix)) = CURDATE() - INTERVAL 3 DAY THEN 1 END) AS day_3_bookings,
            COUNT(CASE WHEN DATE(FROM_UNIXTIME(booking_view.created_at_unix)) = CURDATE() - INTERVAL 4 DAY THEN 1 END) AS day_4_bookings,
            COUNT(CASE WHEN DATE(FROM_UNIXTIME(booking_view.created_at_unix)) = CURDATE() - INTERVAL 5 DAY THEN 1 END) AS day_5_bookings,
            COUNT(CASE WHEN DATE(FROM_UNIXTIME(booking_view.created_at_unix)) = CURDATE() - INTERVAL 6 DAY THEN 1 END) AS day_6_bookings
            FROM booking_view
        `;

        const [rows]: [RowDataPacket[], FieldPacket[]] = await db.query(query);

        if (rows.length === 0 || !rows) {
            throw new ApiError(404, 'Data Not Found');
        }

        return {
            result: 200,
            message: "Total booking count fetched successfully",
            jsonData: {
                total_booking_count: rows[0]
            }
        };

    } catch (error) {
        throw new ApiError(500, "Failed To Load Total Booking Count");
    }
};

// SERVICE TO GET TOTAL AMBULANCE PARTNER COUNT
export const ambulancePartnerCountService = async () => {
    try {

        let query = `
            SELECT 
            COUNT(partner_id) AS total_partners,
            COUNT(CASE WHEN partner_status = '1' THEN 1 END) AS active_partners,
            COUNT(CASE WHEN partner_status != '1' THEN 1 END) AS other_status_partners,
            COUNT(CASE WHEN DATE(FROM_UNIXTIME(created_at)) = CURDATE() THEN 1 END) AS today_new_partners
            FROM partner
        `;

        const [rows]: [RowDataPacket[], FieldPacket[]] = await db.query(query);

        if (rows.length === 0 || !rows) {
            throw new ApiError(404, 'Data Not Found');
        }

        return {
            result: 200,
            message: "Total partner count fetched successfully",
            jsonData: {
                total_partner_count: rows[0]
            }
        };

    } catch (error) {
        throw new ApiError(500, "Failed To Load Total Partner Count");
    }
};

// SERVICE TO GET COMPLETE, ONGOING, CANCEL & REMINDER BOOKING COUNTS
export const ambulanceCompleteOngoingCancelReminderBookingCounts = async () => {
    try {
        let query = `
            SELECT
            COUNT(CASE WHEN booking_status = 4 THEN 1 END) AS completed_bookings,
            COUNT(CASE WHEN booking_status = 3 THEN 1 END) AS ongoing_bookings,
            COUNT(CASE WHEN booking_status = 5 THEN 1 END) AS cancelled_bookings
            FROM booking_view
        `;

        const [rows]: [RowDataPacket[], FieldPacket[]] = await db.query(query);

        if (rows.length === 0 || !rows) {
            throw new ApiError(404, 'Data Not Found');
        }

        return {
            result: 200,
            message: "Booking status counts fetched successfully",
            jsonData: {
                completed_ongoing_cancelled_counts: rows[0]
            }
        };
    } catch (error) {
        console.log(error);

        throw new ApiError(500, "Failed To Load Booking Counts");
    }
};

// DASHBOARD AMBULANCE BOOKINGS SERVICE
export const dashboardAmbulanceBookingService = async () => {
    try {

        const [rows]: any = await db.query(
            `
            SELECT 
                booking_view.booking_id,
                booking_view.booking_source,
                booking_view.booking_type,
                booking_view.booking_con_name,
                booking_view.booking_con_mobile,
                booking_view.booking_category,
                booking_view.booking_schedule_time,
                booking_view.booking_pickup_city,
                booking_view.booking_status,
                booking_view.booking_total_amount
            FROM booking_view
            ORDER BY booking_view.booking_id DESC
            LIMIT 17 OFFSET 0
            `
        )

        return {
            status: 200,
            message: "Dashboard ambulance bookings fetched successfully",
            jsonData: {
                dashboard_ambulance_bookings: rows
            },
        };

    } catch (error) {
        throw new ApiError(500, "Dashboard Ambulance Booking Error On Fetching");
    }
};

// DASHBOARD AMBULANCE PARTNERS SERVICE
export const dashboardAmbulancePartnerService = async () => {
    try {
        const [rows]: any = await db.query(
            `
            SELECT 
                partner_id,
                partner_f_name,
                partner_l_name,
                partner_mobile,
                partner_wallet,
                partner_profile_img,
                partner_created_by,
                partner_city_id,
                partner_registration_step,
                created_at,
                partner_status
            FROM partner
            ORDER BY partner_id DESC
            LIMIT 5 OFFSET 0;   
            `
        );

        return {
            status: 200,
            message: "Dashboard ambulance partners fetched successfully",
            jsonData: {
                dashboard_ambulance_partners: rows
            },
        };

    } catch (error) {
        throw new ApiError(500, "Dashboard Ambulance Partner Error On Fetching");
    }
};

// DASHBOARD AMBULANCE DRIVERS SERVICE
export const dashboardAmbulanceDriverService = async () => {
    try {

        const [rows]: any = await db.query(
            `
            SELECT 
                driver_id,
                driver_name,
                driver_last_name,
                driver_mobile,
                driver_wallet_amount,
                driver_city_id,
                driver_created_by, /* 0 for Self 1 for Partner */
                driver_profile_img,
                driver_registration_step,
                driver_duty_status,
                driver_status,
                driver_duty_status,
                created_at
            FROM driver
            ORDER BY driver_id DESC
            LIMIT 5 OFFSET 0;
            `
        );

        return {
            status: 200,
            message: "Dashboard ambulance drivers fetched successfully",
            jsonData: {
                dashboard_ambulance_drivers: rows
            },
        };

    } catch (error) {
        throw new ApiError(500, "Dashboard Ambulance Driver Error On Fetching");
    }
};

// DASHBOARD AMBULANCE VEHICLES SERVICE
export const dashboardAmbulanceVehicleService = async () => {
    try {
        const [rows]: any = await db.query(
            `
            SELECT 
                vehicle.vehicle_id,
                vehicle.vehicle_added_type,
                vehicle.vehicle_added_by,
                vehicle.v_vehicle_name,
                vehicle.v_vehicle_name_id,
                vehicle.vehicle_category_type,
                vehicle.vehicle_category_type_service_id,
                vehicle.vehicle_exp_date,
                vehicle.vehicle_verify_date,
                vehicle.verify_type,
                vehicle.created_at,
                driver.driver_name,
                driver.driver_mobile,
                partner.partner_f_name,
                partner.partner_l_name,
                partner.partner_mobile
            FROM vehicle
            LEFT JOIN driver ON vehicle.vehicle_added_type = 0 AND vehicle.vehicle_added_by = driver.driver_id
            LEFT JOIN partner ON vehicle.vehicle_added_type = 1 AND vehicle.vehicle_added_by = partner.partner_id
            ORDER BY vehicle.vehicle_id DESC
            LIMIT 5 OFFSET 0;
            `
        );

        return {
            status: 200,
            message: "Dashboard ambulance vehicles fetched successfully",
            jsonData: {
                dashboard_ambulance_vehicles: rows
            },
        };

    } catch (error) {
        throw new ApiError(500, "Dashboard Ambulance Vehicle Error On Fetching");
    }
};

// DASHBOARD AMBULANCE PARTNER TRANSACTIONS SERVICE
export const dashboardAmbulancePartnerTransService = async () => {
    try {

        const [rows]: any = await db.query(
            `
            SELECT *, partner.partner_f_name , partner.partner_mobile , partner.partner_id 
            FROM partner_transection
            LEFT JOIN partner ON partner_transection.partner_transection_by = partner.partner_id
            ORDER BY partner_transection_id DESC
            LIMIT 5 OFFSET 0;
            `
        );

        return {
            status: 200,
            message: "Dashboard ambulance partner transactions fetched successfully",
            jsonData: {
                dashboard_ambulance_partner_transactions: rows
            },
        };

    } catch (error) {
        throw new ApiError(500, "Dashboard Ambulance Partner Transactions Error On Fetching");
    }
};

// DASHBOARD AMBULANCE DRIVER TRANSACTIONS SERVICE
export const dashboardAmbulanceDriverTransService = async () => {
    try {
        const [rows]: any = await db.query(
            `
            SELECT 
                driver_transection.*,

                -- Unified ID
                CASE 
                    WHEN driver_transection.driver_transection_by_type = 0 THEN driver.driver_id
                    WHEN driver_transection.driver_transection_by_type = 1 THEN partner.partner_id
                    WHEN driver_transection.driver_transection_by_type = 3 THEN consumer.consumer_id
                    ELSE NULL
                END AS trans_by_id,

                -- Unified Name
                CASE 
                    WHEN driver_transection.driver_transection_by_type = 0 THEN driver.driver_name
                    WHEN driver_transection.driver_transection_by_type = 1 THEN partner.partner_f_name
                    WHEN driver_transection.driver_transection_by_type = 3 THEN consumer.consumer_name
                    ELSE NULL
                END AS trans_by_name,

                -- Unified Mobile
                CASE 
                    WHEN driver_transection.driver_transection_by_type = 0 THEN driver.driver_mobile
                    WHEN driver_transection.driver_transection_by_type = 1 THEN partner.partner_mobile
                    WHEN driver_transection.driver_transection_by_type = 3 THEN consumer.consumer_mobile_no
                    ELSE NULL
                END AS trans_by_mobile

            FROM driver_transection

            LEFT JOIN driver 
                ON driver_transection.driver_transection_by_type = 0 
                AND driver_transection.driver_transection_by = driver.driver_id

            LEFT JOIN partner 
                ON driver_transection.driver_transection_by_type = 1 
                AND driver_transection.driver_transection_by = partner.partner_id

            LEFT JOIN consumer 
                ON driver_transection.driver_transection_by_type = 3 
                AND driver_transection.driver_transection_by = consumer.consumer_id

            ORDER BY driver_transection.driver_transection_id DESC
            LIMIT 5 OFFSET 0;
            `
        );

        return {
            status: 200,
            message: "Dashboard ambulance driver transactions fetched successfully",
            jsonData: {
                dashboard_ambulance_driver_transactions: rows
            },
        };

    } catch (error) {
        throw new ApiError(500, "Dashboard Ambulance Driver Transactions Error On Fetching");
    }
}

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
        const limit = filters?.limit && filters.limit > 0 ? filters.limit : 10;
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
        const limit = filters?.limit && filters.limit > 0 ? filters.limit : 10;
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
        const limit = filters?.limit && filters.limit > 0 ? filters.limit : 10;
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
        const limit = filters?.limit && filters.limit > 0 ? filters.limit : 10;
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

        // Detect filters
        const isDateFilterApplied = !!filters?.date || !!filters?.fromDate || !!filters?.toDate;
        const isStatusFilterApplied = !!filters?.status;
        const noFiltersApplied = !isDateFilterApplied && !isStatusFilterApplied;

        let effectiveLimit = limit;
        let effectiveOffset = offset;

        // If NO FILTERS applied → force fixed 100-record window
        if (noFiltersApplied) {
            effectiveLimit = limit;              // per page limit (e.g., 10)
            effectiveOffset = (page - 1) * limit; // correct pagination
        }

        const query = `
            SELECT 
                booking_view.booking_id,
                booking_view.booking_source,
                booking_view.booking_type,
                booking_view.booking_con_name,
                booking_view.booking_con_mobile,
                booking_view.booking_view_category_name,
                booking_view.booking_schedule_time,
                booking_view.booking_pickup,
                booking_view.booking_drop,
                booking_view.booking_status,
                booking_view.booking_total_amount,
                booking_view.created_at,
                (
                    SELECT remark_text 
                    FROM remark_data 
                    WHERE remark_booking_id = booking_view.booking_id 
                    ORDER BY remark_id DESC 
                    LIMIT 1
                ) AS remark_text
            FROM booking_view
            ${finalWhereSQL}
            ORDER BY booking_view.booking_id DESC
            LIMIT ? OFFSET ?
        `;

        const queryParams = [...params, effectiveLimit, effectiveOffset];
        const [rows]: any = await db.query(query, queryParams);

        let total;

        if (noFiltersApplied) {
            total = 100;
        } else {
            const [countRows]: any = await db.query(
                `SELECT COUNT(*) as total FROM booking_view ${finalWhereSQL}`,
                params
            );
            total = countRows[0]?.total || 0;
        }

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
        const limit = filters?.limit && filters.limit > 0 ? filters.limit : 10;
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


        // Detect filters
        const isDateFilterApplied = !!filters?.date || !!filters?.fromDate || !!filters?.toDate;
        const isStatusFilterApplied = !!filters?.status;
        const noFiltersApplied = !isDateFilterApplied && !isStatusFilterApplied;

        let effectiveLimit = limit;
        let effectiveOffset = offset;

        // If NO FILTERS applied → force fixed 100-record window
        if (noFiltersApplied) {
            effectiveLimit = limit;              // per page limit (e.g., 10)
            effectiveOffset = (page - 1) * limit; // correct pagination
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

        const queryParams = [...params, effectiveLimit, effectiveOffset];
        const [rows]: any = await db.query(query, queryParams);

        let total;

        if (noFiltersApplied) {
            const [countAllRows]: any = await db.query(`SELECT COUNT(*) as total FROM booking_view`);
            const actualTotal = countAllRows[0]?.total || 0;

            if (actualTotal < 100) {
                total = actualTotal;
            } else {
                total = 100;
            }
        } else {
            const [countRows]: any = await db.query(
                `SELECT COUNT(*) as total FROM booking_view ${finalWhereSQL}`,
                params
            );
            total = countRows[0]?.total || 0;
        }

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
        const limit = filters?.limit && filters.limit > 0 ? filters.limit : 10;
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

        // Detect filters
        const isDateFilterApplied = !!filters?.date || !!filters?.fromDate || !!filters?.toDate;
        const isStatusFilterApplied = !!filters?.status;
        const noFiltersApplied = !isDateFilterApplied && !isStatusFilterApplied;

        let effectiveLimit = limit;
        let effectiveOffset = offset;

        // If NO FILTERS applied → force fixed 100-record window
        if (noFiltersApplied) {
            effectiveLimit = limit;              // per page limit (e.g., 10)
            effectiveOffset = (page - 1) * limit; // correct pagination
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

        const queryParams = [...params, effectiveLimit, effectiveOffset];
        const [rows]: any = await db.query(query, queryParams);

        let total;

        if (noFiltersApplied) {
            const [countAllRows]: any = await db.query(`SELECT COUNT(*) as total FROM booking_view`);
            const actualTotal = countAllRows[0]?.total || 0;

            if (actualTotal < 100) {
                total = actualTotal;
            } else {
                total = 100;
            }
        } else {
            const [countRows]: any = await db.query(
                `SELECT COUNT(*) as total FROM booking_view ${finalWhereSQL}`,
                params
            );
            total = countRows[0]?.total || 0;
        }
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
        const limit = filters?.limit && filters.limit > 0 ? filters.limit : 10;
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

        // Detect filters
        const isDateFilterApplied = !!filters?.date || !!filters?.fromDate || !!filters?.toDate;
        const isStatusFilterApplied = !!filters?.status;
        const noFiltersApplied = !isDateFilterApplied && !isStatusFilterApplied;

        let effectiveLimit = limit;
        let effectiveOffset = offset;

        // If NO FILTERS applied → force fixed 100-record window
        if (noFiltersApplied) {
            effectiveLimit = limit;              // per page limit (e.g., 10)
            effectiveOffset = (page - 1) * limit; // correct pagination
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

        let total;

        if (noFiltersApplied) {
            const [countAllRows]: any = await db.query(`SELECT COUNT(*) as total FROM booking_view`);
            const actualTotal = countAllRows[0]?.total || 0;

            if (actualTotal < 100) {
                total = actualTotal;
            } else {
                total = 100;
            }
        } else {
            const [countRows]: any = await db.query(
                `SELECT COUNT(*) as total FROM booking_view ${finalWhereSQL}`,
                params
            );
            total = countRows[0]?.total || 0;
        }

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
            `SELECT
            booking_view.*,
            driver.driver_name,
            driver.driver_last_name,
            driver.driver_mobile,
            vehicle.v_vehicle_name,
            vehicle.vehicle_rc_number
            FROM booking_view
            LEFT JOIN driver ON booking_view.booking_acpt_driver_id > 0 AND booking_view.booking_acpt_driver_id = driver.driver_id
            LEFT JOIN vehicle ON booking_view.booking_acpt_vehicle_id > 0 AND booking_view.booking_acpt_vehicle_id = vehicle.vehicle_id
            WHERE booking_view.booking_id = ?`,
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

interface AmbulanceBookingData {
    booking_source: string;
    booking_type: number;
    booking_type_for_rental: number;
    booking_bulk_master_key: string;
    booking_no_of_bulk: number;
    booking_bulk_total: number;
    booking_by_cid: number;
    booking_view_otp: string;
    booking_view_status_otp: number;
    booking_con_name: string;
    booking_con_mobile: string;
    booking_category: number;
    booking_schedule_time: string;
    booking_pickup: string;
    booking_drop: string;
    booking_pickup_city: string;
    booking_drop_city: string;
    booking_pick_lat: string;
    booking_pick_long: string;
    booking_drop_lat: string;
    booking_drop_long: string;
    booking_amount: string;
    booking_adv_amount: string;
    booking_payment_type: string;
    booking_payment_method: string;
    booking_status: number;
    booking_distance: string;
    booking_duration: string;
    booking_duration_in_sec: string;
    booking_total_amount: string;
    booking_payment_status: number;
    booking_polyline: string;
    booking_acpt_driver_id: number;
    booking_acpt_vehicle_id: number;
    booking_acpt_time: string;
    booking_ap_polilyne: string;
    booking_ap_duration: string;
    booking_a_t_p_duration_in_sec: string;
    booking_ap_distance: string;
    booking_view_category_name: string;
    booking_view_category_icon: string;
    booking_view_base_rate: string;
    booking_view_km_till: string;
    booking_view_per_km_rate: string;
    booking_view_per_ext_km_rate: string;
    booking_view_per_ext_min_rate: string;
    booking_view_km_rate: string;
    booking_view_total_fare: string;
    booking_view_service_charge_rate: string;
    booking_view_service_charge_rate_discount: string;
    // booking_view_includes: string;
    // booking_view_pickup_time: string;
    // booking_view_arrival_time: string;
    // booking_view_dropped_time: string;
    // booking_view_rating_status: number;
    // booking_view_rating_c_to_d_status: number;
    // booking_radius: string;
    // created_at: string;
    // created_at_unix: number;
    // updated_at: string;
    booking_user_id: number;
    // bookingStatus: string;
    booking_generate_source: string; // -- IVR, app, web , whatsapp, live chat , direct call 
    // bv_virtual_number_status: number;
    // bv_virtual_number: string;
    // bv_cloud_con_crid: string;
    // bv_cloud_con_crid_c_to_d: string;
    // bv_shoot_time: string;
}

// SERVICE TO CREATE AMBULANCE BOOKING
export const createAmbulanceBookingService = async (data: AmbulanceBookingData) => {
    try {

        const insertData = {
            booking_source: data.booking_source,
            booking_type: data.booking_type,
            booking_type_for_rental: data.booking_type_for_rental,
            booking_bulk_master_key: data.booking_bulk_master_key,
            booking_no_of_bulk: data.booking_no_of_bulk,
            booking_bulk_total: data.booking_bulk_total,
            booking_by_cid: data.booking_by_cid,
            booking_view_otp: data.booking_view_otp,
            booking_view_status_otp: data.booking_view_status_otp,
            booking_con_name: data.booking_con_name,
            booking_con_mobile: data.booking_con_mobile,
            booking_category: data.booking_category,
            booking_schedule_time: data.booking_schedule_time,
            booking_pickup: data.booking_pickup,
            booking_drop: data.booking_drop,
            booking_pickup_city: data.booking_pickup_city,
            booking_drop_city: data.booking_drop_city,
            booking_pick_lat: data.booking_pick_lat,
            booking_pick_long: data.booking_pick_long,
            booking_drop_lat: data.booking_drop_lat,
            booking_drop_long: data.booking_drop_long,
            booking_amount: data.booking_amount,
            booking_adv_amount: data.booking_adv_amount,
            booking_payment_type: data.booking_payment_type,
            booking_payment_method: data.booking_payment_method,
            booking_status: data.booking_status,
            booking_distance: data.booking_distance,
            booking_duration: data.booking_duration,
            booking_duration_in_sec: data.booking_duration_in_sec,
            booking_total_amount: data.booking_total_amount,
            booking_payment_status: data.booking_payment_status,
            booking_polyline: data.booking_polyline,
            booking_acpt_driver_id: data.booking_acpt_driver_id,
            booking_acpt_vehicle_id: data.booking_acpt_vehicle_id,
            booking_acpt_time: data.booking_acpt_time,
            booking_ap_polilyne: data.booking_ap_polilyne,
            booking_ap_duration: data.booking_ap_duration,
            booking_a_t_p_duration_in_sec: data.booking_a_t_p_duration_in_sec,
            booking_ap_distance: data.booking_ap_distance,
            created_at: new Date(),
            created_at_unix: currentUnixTime(),
            updated_at: new Date(),
            bookingStatus: 0,
            booking_user_id: data.booking_user_id || 0,
            booking_radius: 0,
            booking_generate_source: data.booking_generate_source,
            booking_view_dropped_time: "",
            booking_view_arrival_time: "",
            booking_view_includes: "", // category list from another table 
        };

    } catch (error) {
        throw new ApiError(500, "Create Ambulance Booking Error On Inserting");
    }
};

// SERVICE TO UPDATE AMBULANCE BOOKING SCHEDULE TIME
export const updateAmbulanceBookingScheduleTime = async (bookingId: number, booking_schedule_time: string) => {
    try {

        console.log(bookingId, booking_schedule_time);


        if (!bookingId) {
            throw new ApiError(400, "Invalid booking ID");
        }

        const [result]: any = await db.query(
            `UPDATE booking_view SET booking_schedule_time = ? WHERE booking_id = ?`,
            [booking_schedule_time, bookingId]
        );

        return {
            status: 200,
            message: "Ambulance booking schedule time updated successfully",
        };

    } catch (error) {
        console.log(error);
        throw new ApiError(500, "Update Ambulance Booking Schedule Time Error On Updating");
    }
};

// SERVICE TO UPDATE AMBULANCE BOOKING CONSUMER DETAILS
export const updateAmbulanceBookingConsumerDetails = async (bookingId: number, booking_con_name: string, booking_con_mobile: number) => {
    try {

        const [result]: any = await db.query(
            `UPDATE booking_view SET booking_con_name = ?, booking_con_mobile = ? WHERE booking_id = ?`,
            [booking_con_name, booking_con_mobile, bookingId]
        );

        return {
            status: 200,
            message: "Ambulance booking consumer details updated successfully",
        };

    } catch (error) {
        throw new ApiError(500, "Update Ambulance Booking Consumer Details Error On Updating");
    }
};