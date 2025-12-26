import { db } from '../config/db';
import { ApiError } from '../utils/api-error';
import { buildFilters } from "../utils/filters";
import { currentUnixTime } from "../utils/current_unixtime";
import { generateSlug } from "../utils/generate_sku";
import { uploadFileCustom } from "../utils/file_uploads";
import { FieldPacket, RowDataPacket } from 'mysql2';


// --------------------------------------------- AMBULANCE DASHBOARD SERVICES -------------------------------------------------- //


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
            LIMIT 20 OFFSET 0
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
                city.city_name,
                partner_status
            FROM partner
            LEFT JOIN city ON partner.partner_city_id = city.city_id
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
};




// --------------------------------------------- COUNT DASHBOARD AMBULANCE BOOKING -------------------------------------------------- //


// // DASHBOARD AMBULANCE BOOKINGS COUNT SERVICE
// export const countDashboardAmbulanceBookingService = async (filters: {
//     date?: string;
//     fromDate?: string;
//     toDate?: string;
//     status?: string;
//     stateId?: string;
//     cityId?: string;
// }) => {
//     try {

//         const { whereSQL, params } = buildFilters({
//             ...filters,
//             dateColumn: "booking_view.created_at_unix",
//         });

//         let finalWhereSQL = whereSQL;

//         const allBookingMasterQuery = `
//             SELECT 
//                 COUNT(booking_id) AS total_booking_count,
//                 COUNT(CASE WHEN booking_status = 0 THEN 1 END) AS enquiry_booking_count,
//                 COUNT(CASE WHEN booking_status = 1 THEN 1 END) AS new_booking_count,
//                 COUNT(CASE WHEN booking_status = 3 THEN 1 END) AS ongoing_booking_count,
//                 COUNT(CASE WHEN booking_status = 4 THEN 1 END) AS complete_booking_count,
//                 COUNT(CASE WHEN booking_status = 6 THEN 1 END) AS future_booking_count,
//             FROM booking_view
//             ${finalWhereSQL}
//         `;

//         const regularBookingMasterQuery = `
//             SELECT 
//                 COUNT(booking_id) AS total_booking_count,
//                 COUNT(CASE WHEN booking_status = 0 THEN 1 END) AS enquiry_booking_count,
//                 COUNT(CASE WHEN booking_status = 1 THEN 1 END) AS new_booking_count,
//                 COUNT(CASE WHEN booking_status = 3 THEN 1 END) AS ongoing_booking_count,
//                 COUNT(CASE WHEN booking_status = 4 THEN 1 END) AS complete_booking_count,
//                 COUNT(CASE WHEN booking_status = 6 THEN 1 END) AS future_booking_count,
//             FROM booking_view
//             WHERE booking_type = 0
//             ${finalWhereSQL}
//         `;

//         const rentalBookingMasterQuery = `
//             SELECT 
//                 COUNT(booking_id) AS total_booking_count,
//                 COUNT(CASE WHEN booking_status = 0 THEN 1 END) AS enquiry_booking_count,
//                 COUNT(CASE WHEN booking_status = 1 THEN 1 END) AS new_booking_count,
//                 COUNT(CASE WHEN booking_status = 3 THEN 1 END) AS ongoing_booking_count,
//                 COUNT(CASE WHEN booking_status = 4 THEN 1 END) AS complete_booking_count,
//                 COUNT(CASE WHEN booking_status = 6 THEN 1 END) AS future_booking_count,
//             FROM booking_view
//             WHERE booking_type = 1
//             ${finalWhereSQL}
//         `;

//         const bulkBookingMasterQuery = `
//             SELECT 
//                 COUNT(booking_id) AS total_booking_count,
//                 COUNT(CASE WHEN booking_status = 0 THEN 1 END) AS enquiry_booking_count,
//                 COUNT(CASE WHEN booking_status = 1 THEN 1 END) AS new_booking_count,
//                 COUNT(CASE WHEN booking_status = 3 THEN 1 END) AS ongoing_booking_count,
//                 COUNT(CASE WHEN booking_status = 4 THEN 1 END) AS complete_booking_count,
//                 COUNT(CASE WHEN booking_status = 6 THEN 1 END) AS future_booking_count,
//             FROM booking_view
//             WHERE booking_type = 2
//             ${finalWhereSQL}
//         `;

//         // ------------------------------------ PARTNER QUERY ------------------------------------ //

//         const wherePartnerSQL = buildFilters({
//             ...filters,
//             dateColumn: "partner.created_at",
//         });

//         let finalPartnerWhereSQL = wherePartnerSQL;

//         if(filters.stateId){
//             const stateCondition = `partner.partner_state_id = ${db.escape(filters.stateId)}`;
//             if (/where\s+/i.test(finalPartnerWhereSQL)) {
//                 finalPartnerWhereSQL += ` AND ${stateCondition}`;
//             } else {
//                 finalPartnerWhereSQL = `WHERE ${stateCondition}`;
//             }
//         }

//         if(filters.cityId){
//             const cityCondition = `partner.partner_city_id = ${db.escape(filters.cityId)}`;
//             if (/where\s+/i.test(finalPartnerWhereSQL)) {
//                 finalPartnerWhereSQL += ` AND ${cityCondition}`;
//             } else {
//                 finalPartnerWhereSQL = `WHERE ${cityCondition}`;
//             }
//         }

//         const partnerMasterQuery = `
//             SELECT 
//                 COUNT(*) AS total_partner_count,
//                 COUNT(CASE WHEN ambulance_faq_status = 0 THEN 1 END) AS new_partner_count,
//                 COUNT(CASE WHEN ambulance_faq_status = 0 THEN 1 END) AS unverified_partner_count,
//                 COUNT(CASE WHEN ambulance_faq_status = 0 THEN 1 END) AS verified_partner_count,
//                 COUNT(CASE WHEN ambulance_faq_status = 0 THEN 1 END) AS blocked_partner_count,
//             FROM partner
//             ${finalPartnerWhereSQL}
//         `;

//         // --------------------------------------------- DRIVER QUERY ------------------------------------ //

//         const driverMasterQuery = `
//             SELECT 
//                 COUNT(*) AS total_driver_count,
//                 COUNT(CASE WHEN ambulance_faq_status = 0 THEN 1 END) AS new_driver_count,
//                 COUNT(CASE WHEN ambulance_faq_status = 0 THEN 1 END) AS unverified_driver_count,
//                 COUNT(CASE WHEN ambulance_faq_status = 0 THEN 1 END) AS verified_driver_count,
//                 COUNT(CASE WHEN ambulance_faq_status = 0 THEN 1 END) AS blocked_driver_count,
//             FROM driver
//             ${finalWhereSQL}
//         `;

//         // --------------------------------------------- VEHICLE QUERY ------------------------------------ //

//         const vehicleMasterQuery = `
//             SELECT 
//                 COUNT(*) AS total_vehicle_count,
//                 COUNT(CASE WHEN ambulance_faq_status = 0 THEN 1 END) AS new_vehicle_count,
//                 COUNT(CASE WHEN ambulance_faq_status = 0 THEN 1 END) AS unverified_vehicle_count,
//                 COUNT(CASE WHEN ambulance_faq_status = 0 THEN 1 END) AS verified_vehicle_count,
//                 COUNT(CASE WHEN ambulance_faq_status = 0 THEN 1 END) AS blocked_vehicle_count,
//             FROM vehicle
//             ${finalWhereSQL}
//         `;

//         // --------------------------------------------- CONSUMER QUERY ------------------------------------ //

//         const consumerMasterQuery = `
//             SELECT 
//                 COUNT(*) AS total_consumer_count,
//                 COUNT(CASE WHEN ambulance_faq_status = 0 THEN 1 END) AS new_consumer_count,
//                 COUNT(CASE WHEN ambulance_faq_status = 0 THEN 1 END) AS verified_consumer_count,
//                 COUNT(CASE WHEN ambulance_faq_status = 0 THEN 1 END) AS app_consumer_count,
//                 COUNT(CASE WHEN ambulance_faq_status = 0 THEN 1 END) AS website_consumer_count,
//                 COUNT(CASE WHEN ambulance_faq_status = 0 THEN 1 END) AS call_consumer_count,
//             FROM consumer
//             ${finalWhereSQL}
//         `;

//         // --------------------------------------------- TRANSACTION QUERY ------------------------------------ //

//         const transactionMasterQuery = `
//             SELECT 
//                 COUNT(*) AS total_transaction_count,
//                 COUNT(CASE WHEN ambulance_faq_status = 0 THEN 1 END) AS recharge_transaction_count,
//                 COUNT(CASE WHEN ambulance_faq_status = 0 THEN 1 END) AS neg_wallet_transaction_count,
//                 COUNT(CASE WHEN ambulance_faq_status = 0 THEN 1 END) AS pos_wallet_transaction_count,
//                 COUNT(CASE WHEN ambulance_faq_status = 0 THEN 1 END) AS widrawl_transaction_count,
//             FROM transaction
//             ${finalWhereSQL}
//         `;

//         return {
//             status: 200,
//             message: "Ambulance FAQ list fetched successfully",
//             pagination: {
//             },
//             jsonData: {

//             },
//         };

//     } catch (error) {
//         throw new ApiError(500, "Count Dashboard Ambulance Booking Error On Fetching");
//     }
// };


// PARTNER COUNT DASHBOARD AMBULANCE SERVICE
export const partnerDashboardCountService = async (filters: {
    date?: string;
    fromDate?: string;
    toDate?: string;
    status?: string;
    stateId?: string;
    cityId?: string;
}) => {
    try {

        const { whereSQL, params } = buildFilters({
            ...filters,
            dateColumn: "partner.created_at",
        });

        let finalWhereSQL = whereSQL;

        const queryParams: any[] = [...params];

        let joinSQL = "";

        if (filters.cityId) {
            if (/where\s+/i.test(finalWhereSQL)) {
                finalWhereSQL += " AND partner.partner_city_id = ?";
            } else {
                finalWhereSQL = "WHERE partner.partner_city_id = ?";
            }
            queryParams.push(filters.cityId);
        }

        if (filters.stateId) {
            joinSQL = `
                LEFT JOIN city 
                    ON city.city_id = partner.partner_city_id
            `;

            if (/where\s+/i.test(finalWhereSQL)) {
                finalWhereSQL += " AND city.city_state = ?";
            } else {
                finalWhereSQL = "WHERE city.city_state = ?";
            }
            queryParams.push(filters.stateId);
        }

        const partnerMasterQuery = `
            SELECT 
                COUNT(partner_id) AS total_partner_count,
                COUNT(CASE WHEN partner_status = 0 THEN 1 END) AS new_partner_count,
                COUNT(CASE WHEN partner_status = 1 THEN 1 END) AS unverified_partner_count,
                COUNT(CASE WHEN partner_status = 2 THEN 1 END) AS verified_partner_count,
                COUNT(CASE WHEN partner_status = 3 THEN 1 END) AS blocked_partner_count
            FROM partner
            ${joinSQL}
            ${finalWhereSQL}
        `;

        const [rows]: any = await db.query(partnerMasterQuery, queryParams);

        return {
            status: 200,
            message: "Ambulance Partner's count fetched successfully",
            jsonData: {
                ambulance_partner_counts: rows[0]
            },
        };

    } catch (error) {
        console.log(error);
        throw new ApiError(500, "Ambulance Partner's Count Error On Fetching");
    }
};

// PARTNER COUNT DASHBOARD AMBULANCE SERVICE
export const driverDashboardCountService = async (filters: {
    date?: string;
    fromDate?: string;
    toDate?: string;
    status?: string;
    stateId?: string;
    cityId?: string;
}) => {
    try {

        const { whereSQL, params } = buildFilters({
            ...filters,
            dateColumn: "driver.created_at",
        });

        let finalWhereSQL = whereSQL;

        const queryParams: any[] = [...params];

        let joinSQL = "";

        if (filters.cityId) {
            if (/where\s+/i.test(finalWhereSQL)) {
                finalWhereSQL += " AND driver.driver_city_id = ?";
            } else {
                finalWhereSQL = "WHERE driver.driver_city_id = ?";
            }
            queryParams.push(filters.cityId);
        }

        if (filters.stateId) {
            joinSQL = `
                LEFT JOIN city 
                    ON city.city_id = driver.driver_city_id
            `;

            if (/where\s+/i.test(finalWhereSQL)) {
                finalWhereSQL += " AND city.city_state = ?";
            } else {
                finalWhereSQL = "WHERE city.city_state = ?";
            }
            queryParams.push(filters.stateId);
        }

        const driverMasterQuery = `
            SELECT 
                COUNT(driver_id) AS total_driver_count,
                COUNT(CASE WHEN driver_status = 0 THEN 1 END) AS new_driver_count,
                COUNT(CASE WHEN driver_status = 2 THEN 1 END) AS unverified_driver_count,
                COUNT(CASE WHEN driver_status = 1 THEN 1 END) AS verified_driver_count,
                COUNT(CASE WHEN driver_status = 4 THEN 1 END) AS verification_applied_driver_count
            FROM driver
            ${joinSQL}
            ${finalWhereSQL}
        `;

        const [rows]: any = await db.query(driverMasterQuery, queryParams);
        return {
            status: 200,
            message: "Ambulance Driver's count fetched successfully",
            jsonData: {
                ambulance_driver_counts: rows[0]
            },
        };

    } catch (error) {
        throw new ApiError(500, "Ambulance Driver's Count Error On Fetching");
    }
};



// --------------------------------------------- AMBULANCE CATEGORY SERVICES -------------------------------------------------- //

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
            ambulance_category_sku: generateSlug(data.ambulance_category_name),
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


// --------------------------------------------- AMBULANCE FAQ SERVICES -------------------------------------------------- //


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


// --------------------------------------------- AMBULANCE FACILITIES SERVICES -------------------------------------------------- //


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


// --------------------------------------------- AMBULANCE FACILITIES RATE SERVICES -------------------------------------------------- //


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
                ambulance_facilities_rate.ambulance_facilities_rate_date,
                ambulance_facilities.ambulance_facilities_name,
                ambulance_facilities.ambulance_facilities_category_type
            FROM ambulance_facilities_rate
            LEFT JOIN ambulance_facilities ON ambulance_facilities_rate.ambulance_facilities_rate_f_id = ambulance_facilities.ambulance_facilities_id
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


// --------------------------------------------- AMBULANCE BOOKING SERVICES -------------------------------------------------- //


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
                futureBooking: "booking_view.booking_status = 6",
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
                futureBooking: "booking_view.booking_status = 6",
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
                futureBooking: "booking_view.booking_status = 6",
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
                futureBooking: "booking_view.booking_status = 6",
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


// ---------------------------------------------- AMBULANCE BOOKING DETAIL SERVICE -------------------------------------------------- //


// SERVICE TO GET AMBULANCE BOOKING DETAIL
export const ambulanceBookingDetailService = async (bookingId: number) => {
    try {

        const [rows]: any = await db.query(
            `SELECT
            booking_view.*,
            driver.driver_name,
            driver.driver_last_name,
            driver.driver_mobile,
            partner.partner_id,
            partner.partner_f_name,
            partner.partner_l_name,
            partner.partner_mobile,
            vehicle.v_vehicle_name,
            vehicle.vehicle_rc_number
            FROM booking_view
            LEFT JOIN driver ON booking_view.booking_acpt_driver_id > 0 AND booking_view.booking_acpt_driver_id = driver.driver_id
            LEFT JOIN vehicle ON booking_view.booking_acpt_vehicle_id > 0 AND booking_view.booking_acpt_vehicle_id = vehicle.vehicle_id
            LEFT JOIN partner ON driver.driver_created_by = 1 AND driver.driver_created_partner_id = partner.partner_id
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

// SERVICE TO GET AMBULANCE CONSUMER NAME & MOBILE (SEARCHABLE)
export const getAmbulanceConsumerMobileService = async (search?: string) => {
    try {

        if (search) {
            let query = `
            SELECT consumer_id, consumer_name, consumer_mobile_no
            FROM consumer
        `;

            const params: any[] = [];

            if (search && search.trim().length > 0) {
                query += `
                WHERE consumer_mobile_no LIKE ?
            `;
                const term = `%${search.trim()}%`;
                params.push(term);
            }

            const [rows]: any = await db.query(query, params);

            return {
                status: 200,
                message: "Ambulance consumer mobile fetched successfully",
                jsonData: {
                    ambulance_consumer_data: rows
                },
            };
        } else {
            return {
                status: 200,
                message: "No search term provided",
                jsonData: {
                    ambulance_consumer_data: []
                },
            };
        }

    } catch (error) {
        throw new ApiError(
            500,
            "Get Ambulance Consumer Mobile Error On Fetching"
        );
    }
};

// SERVICE: GET VEHICLE + DRIVER/PARTNER USING RC NUMBER
export const getAmbulanceVehicleAndAssignDataService = async (search?: string) => {
    try {

        if (!search || !search.trim()) {
            return {
                status: 200,
                message: "No search term provided",
                jsonData: []
            };
        }

        const query = `
            SELECT
                v.vehicle_id,
                v.v_vehicle_name,
                v.vehicle_rc_number,
                v.vehicle_status,
                v.vehicle_added_type,

                CASE 
                    WHEN v.vehicle_added_type = 0 THEN d.driver_id
                    WHEN v.vehicle_added_type = 1 THEN p.partner_id
                END AS assign_id,

                CASE 
                    WHEN v.vehicle_added_type = 0 THEN d.driver_name
                    WHEN v.vehicle_added_type = 1 THEN p.partner_f_name
                END AS assign_name,

                CASE 
                    WHEN v.vehicle_added_type = 0 THEN d.driver_last_name
                    WHEN v.vehicle_added_type = 1 THEN p.partner_l_name
                END AS assign_last_name,

                CASE 
                    WHEN v.vehicle_added_type = 0 THEN d.driver_mobile
                    WHEN v.vehicle_added_type = 1 THEN p.partner_mobile
                END AS assign_mobile,

                CASE
                    WHEN v.vehicle_added_type = 0 THEN 'DRIVER'
                    WHEN v.vehicle_added_type = 1 THEN 'PARTNER'
                END AS assign_type

            FROM vehicle v
            LEFT JOIN driver d 
                ON v.vehicle_added_type = 0 
                AND v.vehicle_added_by = d.driver_id

            LEFT JOIN partner p 
                ON v.vehicle_added_type = 1 
                AND v.vehicle_added_by = p.partner_id

            WHERE v.vehicle_rc_number LIKE ?
        `;

        const [rows]: any = await db.query(query, [`%${search.trim()}%`]);

        return {
            status: 200,
            message: "Vehicle and driver/partner data fetched successfully",
            jsonData: {
                vehicle_and_assign_data: rows
            }
        };

    } catch (error) {
        throw new ApiError(
            500,
            "Get Vehicle And Assign Data Error On Fetching"
        );
    }
};

// SERVICE TO ASSIGN DRIVER AND VEHICLE TO AMBULANCE BOOKING
export const assignDriverService = async (bookingId: number, driverId: number, vehicleId: number, adminId: number) => {
    try {

        const [rows]: any = await db.query(
            `SELECT booking_status FROM booking_view WHERE booking_id = ?`,
            [bookingId]
        );

        if (!rows || rows.length === 0) {
            return {
                status: 404,
                message: "Booking not found",
            };
        }

        const currentStatus = rows[0].booking_status;

        const notAllowedStatuses = [0, 2, 3, 4, 5, 6];

        if (notAllowedStatuses.includes(currentStatus)) {
            return {
                status: 400,
                message:
                    "Driver can only be assigned to bookings with status Enquiry, Completed, or Cancelled",
                booking_status: currentStatus,
            };
        }

        const assignDriverBookingData = {
            booking_status: 2,
            booking_acpt_driver_id: driverId,
            booking_acpt_vehicle_id: vehicleId,
            booking_acpt_time: currentUnixTime(),
        };

        await db.query(
            `UPDATE booking_view SET ? WHERE booking_id = ?`,
            [assignDriverBookingData, bookingId]
        );

        await db.query(
            `UPDATE driver SET driver_on_booking_status = 1 WHERE driver_id = ?`,
            [driverId]
        );

        const [driverLatlong]: any = await db.query(
            `SELECT driver_live_location_lat, driver_live_location_long 
            FROM driver_live_location
            WHERE driver_live_location_d_id = ?`
            , [driverId]
        );

        const booking_a_c_history_data = {
            bah_booking_id: bookingId,
            bah_driver_id: driverId,
            bah_vehicle_id: vehicleId,
            bah_driver_latitude: driverLatlong[0]?.driver_live_location_lat || 0,
            bah_driver_longitude: driverLatlong[0]?.driver_live_location_long || 0,
            bah_consumer_id: rows[0]?.booking_by_cid || 0,
            bah_time: currentUnixTime(),
            bah_user_type: 1,
            bah_admin_id: adminId,
            created_at: new Date(),
            bah_status: 1,
        };

        await db.query(
            `INSERT INTO booking_a_c_history SET ?`,
            [booking_a_c_history_data]
        );

        return {
            status: 200,
            message: "Driver and vehicle assigned successfully",
        };
    } catch (error) {
        console.error(error);
        throw new ApiError(500, "Assign Driver Service Error On Updating");
    }
};

// SERVICE TO GET CANCEL REASON LIST
export const cancelReasonService = async () => {
    try {

        const [rows]: any = await db.query(
            `
            SELECT booking_cancel_reasons_id, booking_cancel_reasons_text
            FROM booking_cancel_reasons 
            WHERE cancel_reason_type = 1
            ORDER BY booking_cancel_reasons_text ASC`
        );

        const [rows2]: any = await db.query(
            `
            SELECT booking_cancel_reasons_id, booking_cancel_reasons_text
            FROM booking_cancel_reasons 
            WHERE cancel_reason_type = 2
            ORDER BY booking_cancel_reasons_text ASC`
        );

        return {
            status: 200,
            message: "Cancel reasons fetched successfully",
            jsonData: {
                cancel_reasons_consumer: rows,
                cancel_reasons_driver: rows2,
            },
        };

    } catch (error) {
        throw new ApiError(500, "Get Cancel Reason Service Error On Fetching");
    }
};

// SERVICE TO CANCEL AMBULANCE BOOKING
export const cancelAmbulanceBookingService = async (bookingId: number, cancelReasonId: number, cancelReason: string, cancelUserType: number, adminId: number) => {
    try {

        const [rows]: any = await db.query(
            `SELECT booking_status FROM booking_view WHERE booking_id = ?`,
            [bookingId]
        );

        if (!rows || rows.length === 0) {
            return {
                status: 404,
                message: "Booking not found",
            };
        }

        if (!adminId) {
            return {
                status: 400,
                message: "Admin Id is required to cancel booking",
            }
        }

        await db.query(
            `UPDATE booking_view SET booking_status = 5 WHERE booking_id = ?`,
            [bookingId]
        );

        const assignedDriverId = rows[0].booking_acpt_driver_id || 0;

        if (assignedDriverId && assignedDriverId > 0) {
            await db.query(
                `UPDATE driver SET driver_on_booking_status = 0 WHERE driver_id = ?`,
                [assignedDriverId]
            );
        }

        const [driverLatlong]: any = await db.query(
            `SELECT driver_live_location_lat, driver_live_location_long 
            FROM driver_live_location
            WHERE driver_live_location_d_id = ?`
            , [assignedDriverId]
        );

        const booking_a_c_history_data = {
            bah_booking_id: bookingId,
            bah_driver_id: assignedDriverId,
            bah_vehicle_id: rows[0].booking_acpt_vehicle_id || 0,
            bah_driver_latitude: driverLatlong[0]?.driver_live_location_lat || 0,
            bah_driver_longitude: driverLatlong[0]?.driver_live_location_long || 0,
            bah_consumer_id: rows[0]?.booking_by_cid || 0,
            bah_time: currentUnixTime(),
            bah_user_type: cancelUserType, // 0 for Driver, 1 for Consumer
            bah_cancel_reason_id: cancelReasonId,
            bah_cancel_reason_text: cancelReason,
            bah_admin_id: adminId,
            created_at: new Date(),
            bah_status: 2,
        };

        await db.query(
            `INSERT INTO booking_a_c_history SET ?`,
            [booking_a_c_history_data]
        );

        return {
            status: 200,
            message: "Ambulance booking cancelled successfully",
        };

    } catch (error) {
        throw new ApiError(500, "Cancel Ambulance Booking Service Error On Updating");
    }
};

// SERVICE TO VERIFY OTP FOR AMBULANCE BOOKING
export const verifyOTPAmbulanceBookingService = async (bookingId: number, adminId: number) => {
    try {

        const [rows]: any = await db.query(
            `
            SELECT 
                booking_view_status_otp, 
                booking_status,
                booking_view_pickup_time,
                booking_acpt_driver_id,
                booking_acpt_vehicle_id,
                booking_by_cid
            FROM booking_view 
            WHERE booking_id = ?`,
            [bookingId]
        );

        if (!rows || rows.length === 0) {
            return {
                status: 404,
                message: "Booking not found",
            };
        }

        const currentBookingStatus = rows[0].booking_status;

        if (currentBookingStatus === "2") {

            const arrivalTime = rows[0].booking_view_pickup_time;
            const currentTime = currentUnixTime();
            const timeDifference = Math.floor((currentTime - arrivalTime) / 60000); // Convert milliseconds to minutes

            await db.query(
                `UPDATE booking_view SET booking_view_status_otp = 0, booking_view_arrival_time = ? WHERE booking_id = ?`,
                [timeDifference, bookingId]
            );

            const [driverLatlong]: any = await db.query(
                `SELECT driver_live_location_lat, driver_live_location_long 
                FROM driver_live_location
                WHERE driver_live_location_d_id = ?`
                , [rows[0].booking_acpt_driver_id]
            );

            const booking_a_c_history_data = {
                bah_booking_id: bookingId,
                bah_driver_id: rows[0].booking_acpt_driver_id,
                bah_vehicle_id: rows[0].booking_acpt_vehicle_id || 0,
                bah_driver_latitude: driverLatlong[0]?.driver_live_location_lat || 0,
                bah_driver_longitude: driverLatlong[0]?.driver_live_location_long || 0,
                bah_consumer_id: rows[0]?.booking_by_cid || 0,
                bah_time: currentUnixTime(),
                bah_user_type: 0,
                bah_admin_id: adminId,
                created_at: new Date(),
                bah_status: 1,
            };

            await db.query(
                `INSERT INTO booking_a_c_history SET ?`,
                [booking_a_c_history_data]
            );

            return {
                status: 200,
                message: "OTP verified successfully for ambulance booking",
            };

        } else {
            return {
                status: 400,
                message: "OTP can only be verified If Booking Assigned To Driver",
            };
        }

    } catch (error) {
        console.log(error);

        throw new ApiError(500, "Verify OTP Ambulance Booking Service Error On Verifying");
    }
};

// SERVICE TO CANCEL DRIVER FROM AMBULANCE BOOKING
export const cancelDriverFromAmbulanceBookingService = async (bookingId: number) => {
    try {

        const [rows]: any = await db.query(
            `SELECT booking_acpt_driver_id, booking_acpt_vehicle_id FROM booking_view WHERE booking_id = ?`,
            [bookingId]
        );

        if (!rows || rows.length === 0) {
            return {
                status: 404,
                message: "Booking not found",
            };
        }

        await db.query(
            `UPDATE booking_view SET booking_acpt_driver_id = 0, booking_acpt_vehicle_id = 0, booking_status = 1 WHERE booking_id = ?`,
            [bookingId]
        );

        const assignedDriverId = rows[0].booking_acpt_driver_id;

        if (assignedDriverId && assignedDriverId > 0) {
            await db.query(
                `UPDATE driver SET driver_on_booking_status = 0 WHERE driver_id = ?`,
                [assignedDriverId]
            );
        }

        return {
            status: 200,
            message: "Driver cancelled from ambulance booking successfully",
        };

    } catch (error) {
        throw new ApiError(500, "Cancel Driver From Ambulance Booking Service Error On Updating");
    }
};

// SERVICE TO UPDATE AMBULANCE BOOKING AMOUNT
export const updateAmbulanceBookingAmountService = async (bookingId: number, newAmount: number, amountColumnName: string) => {
    try {

        const [rows]: any = await db.query(
            `SELECT booking_id FROM booking_view WHERE booking_id = ?`,
            [bookingId]
        );

        if (!rows || rows.length === 0) {
            return {
                status: 404,
                message: "Booking not found",
            };
        }

        if (rows[0].booking_status == 3 || rows[0].booking_status == 4 || rows[0].booking_status == 5 || rows[0].booking_status == 6) {
            return {
                status: 400,
                message: "Cannot update amount for ongoing, completed, cancelled or future bookings",
            };
        }

        const validColumns = ['booking_amount', 'booking_adv_amount', 'booking_total_amount', 'booking_view_base_rate', 'booking_view_km_till', 'booking_view_per_km_rate', 'booking_view_per_ext_km_rate', 'booking_view_per_ext_min_rate', 'booking_view_km_rate', 'booking_view_total_fare', 'booking_view_service_charge_rate', 'booking_view_service_charge_rate_discount'];

        if (!validColumns.includes(amountColumnName)) {
            return {
                status: 400,
                message: "Invalid amount column name",
            }
        }

        const [result]: any = await db.query(
            `UPDATE booking_view SET ${amountColumnName} = ? WHERE booking_id = ?`,
            [newAmount, bookingId]
        );

        return {
            status: 200,
            message: "Ambulance booking amount updated successfully ` " + amountColumnName + " " + newAmount + " ` ",
        };

    } catch (error) {
        throw new ApiError(500, "Update Ambulance Booking Amount Service Error On Updating");
    }
};

// SERVICE TO COMPLETE AMBULANCE BOOKING
export const completeAmbulanceBookingService = async (bookingId: number) => {
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        const [bookingRows]: any = await connection.query(
            `SELECT * FROM booking_view WHERE booking_id = ?`,
            [bookingId]
        );

        if (!bookingRows.length) {
            throw new ApiError(404, "Booking not found");
        }

        const bookingData = bookingRows[0];
        console.log("bookingData:", bookingData);
        const driverId = Number(bookingData.booking_acpt_driver_id);
        const consumerId = Number(bookingData.booking_by_cid);

        if (!driverId) {
            return { status: 400, message: "Please Choose the driver !!" };
        }

        if (!consumerId) {
            return { status: 400, message: "Please Choose the consumer !!" };
        }

        const [detailsRows]: any = await connection.query(
            `
      SELECT *
      FROM booking_invoice
      LEFT JOIN consumer ON booking_invoice.bi_consumer_id = consumer.consumer_id
      LEFT JOIN driver ON driver.driver_id = booking_invoice.bi_driver_id
      LEFT JOIN driver_live_location 
        ON driver.driver_id = driver_live_location.driver_live_location_d_id
      WHERE bi_booking_id = ?
      `,
            [bookingId]
        );

        if (!detailsRows.length) {
            throw new ApiError(404, "Booking invoice not found");
        }

        const bookingDetails = detailsRows[0];

        const totalAmounts = Number(bookingDetails.bi_total_amount_with_sc);
        const bookingAdvAmount = Number(bookingDetails.bi_service_charge);
        const driverWalletAmount = Number(bookingDetails.driver_wallet_amount || 0);
        const biConsumerId = Number(bookingDetails.bi_consumer_id);
        const biDriverId = Number(bookingDetails.bi_driver_id);

        /* =======================
           3. SUM PAYMENTS
        ======================= */
        const [paymentRows]: any = await connection.query(
            `
      SELECT amount 
      FROM booking_payments
      WHERE booking_id = ? AND consumer_id = ?
      `,
            [bookingId, biConsumerId]
        );

        const bookingSum =
            paymentRows.reduce((sum: number, p: any) => sum + Number(p.amount), 0) || 0;

        /* =======================
           CASE 1: bookingSum == advance
        ======================= */
        if (bookingSum === bookingAdvAmount) {
            await connection.query(
                `UPDATE driver SET driver_on_booking_status = 0 WHERE driver_id = ?`,
                [biDriverId]
            );

            await connection.query(
                `
        UPDATE booking_view
        SET booking_payment_status = 2,
            booking_payment_method = 2,
            booking_status = 4
        WHERE booking_id = ?
        `,
                [bookingId]
            );

            await connection.query(
                `
        UPDATE booking_invoice
        SET bi_payment_status = 0,
            bi_cash_pay_amount = ?,
            bi_online_pay_amount = ?
        WHERE bi_booking_id = ?
        `,
                [totalAmounts - bookingSum, bookingSum, bookingId]
            );

            await connection.commit();
            return { status: 200, message: "Booking successfully completed" };
        }

        /* =======================
           CASE 2: bookingSum > advance
        ======================= */
        if (bookingSum > bookingAdvAmount) {
            const payDriverAmount = bookingSum - bookingAdvAmount;
            const newWallet = driverWalletAmount + payDriverAmount;
            const txnId = `BOOKING_CHARGE_${bookingId}_${Date.now()}`;

            await connection.query(
                `
        INSERT INTO driver_transection (
          driver_transection_by,
          driver_transection_by_type,
          driver_transection_by_type_pid,
          driver_transection_amount,
          driver_transection_pay_id,
          driver_transection_type,
          driver_transection_wallet_new_amount,
          driver_transection_wallet_previous_amount,
          driver_transection_note,
          driver_transection_time_unix,
          driver_transection_order_id,
          driver_transection_bank_ref_no,
          driver_transection_order_status,
          driver_transection_payment_mode,
          driver_transection_payment_mobile,
          driver_transection_cc_time,
          created_at,
          updated_at
        )
        VALUES (?, 0, 0, ?, ?, 4, ?, ?, ?, ?, 0, '', '', '', '', '', NOW(), NOW())
        `,
                [
                    biDriverId,
                    payDriverAmount,
                    txnId,
                    newWallet,
                    driverWalletAmount,
                    `Booking Charge: ${bookingId}`,
                    Math.floor(Date.now() / 1000),
                ]
            );

            await connection.query(
                `
        UPDATE driver
        SET driver_wallet_amount = ?, driver_on_booking_status = 0
        WHERE driver_id = ?
        `,
                [newWallet, biDriverId]
            );

            await connection.query(
                `
        UPDATE booking_view
        SET booking_payment_status = 1,
            booking_payment_method = 2,
            booking_status = 4
        WHERE booking_id = ?
        `,
                [bookingId]
            );

            await connection.query(
                `
        UPDATE booking_invoice
        SET bi_payment_status = 0,
            bi_cash_pay_amount = ?,
            bi_online_pay_amount = ?
        WHERE bi_booking_id = ?
        `,
                [totalAmounts - bookingSum, bookingSum, bookingId]
            );

            await connection.commit();
            return { status: 200, message: "Booking successfully completed" };
        }

        /* =======================
           CASE 3: bookingSum < advance
        ======================= */
        const payDriverAmount = bookingAdvAmount - bookingSum;
        const newWallet = driverWalletAmount - payDriverAmount;
        const txnId = `BOOKING_CHARGE_${bookingId}_${Date.now()}`;

        await connection.query(
            `
      INSERT INTO driver_transection (
        driver_transection_by,
        driver_transection_by_type,
        driver_transection_by_type_pid,
        driver_transection_amount,
        driver_transection_pay_id,
        driver_transection_type,
        driver_transection_wallet_new_amount,
        driver_transection_wallet_previous_amount,
        driver_transection_note,
        driver_transection_time_unix,
        driver_transection_order_id,
        driver_transection_bank_ref_no,
        driver_transection_order_status,
        driver_transection_payment_mode,
        driver_transection_payment_mobile,
        driver_transection_cc_time,
        created_at,
        updated_at
      )
      VALUES (?, 0, 0, ?, ?, 3, ?, ?, ?, ?, 0, '', '', '', '', '', NOW(), NOW())
      `,
            [
                biDriverId,
                payDriverAmount,
                txnId,
                newWallet,
                driverWalletAmount,
                `Booking Charge: ${bookingId}`,
                Math.floor(Date.now() / 1000),
            ]
        );

        await connection.query(
            `
      UPDATE driver
      SET driver_wallet_amount = ?, driver_on_booking_status = 0
      WHERE driver_id = ?
      `,
            [newWallet, biDriverId]
        );

        const payType = bookingSum > 1 ? 2 : 3;
        const paymentMethod = bookingSum > 1 ? 2 : 1;

        await connection.query(
            `
      UPDATE booking_view
      SET booking_payment_status = 2,
          booking_payment_type = ?,
          booking_payment_method = ?,
          booking_status = 4
      WHERE booking_id = ?
      `,
            [payType, paymentMethod, bookingId]
        );

        await connection.query(
            `
      UPDATE booking_invoice
      SET bi_payment_status = 0,
          bi_cash_pay_amount = ?,
          bi_online_pay_amount = ?
      WHERE bi_booking_id = ?
      `,
            [totalAmounts - bookingSum, bookingSum, bookingId]
        );

        await connection.commit();
        return { status: 200, message: "Booking successfully completed" };
    } catch (error) {
        await connection.rollback();
        console.error(error);
        throw new ApiError(500, "Complete Ambulance Booking Error");
    } finally {
        connection.release();
    }
};

// SERVICE TO GENERATE BOOKING INVOICE
export const generateAmbulanceBookingInvoiceService = async (
    bookingId: number,
    totalAmounts: number,
    advance_amounts: number,
    extra_km: number = 0,
    extra_minute: number = 0
) => {
    try {

        const [bookingRows]: any = await db.query(
            `SELECT * FROM booking_view WHERE booking_id = ?`,
            [bookingId]
        );

        if (!bookingRows || bookingRows.length === 0) {
            throw new ApiError(404, "Booking not found");
        }

        const bookingData = bookingRows[0];

        const bookingcustomerId = bookingData.booking_by_cid;
        const bookingdriverId = bookingData.booking_acpt_driver_id;

        const bi_base_rate = bookingData.booking_view_base_rate;
        const bi_base_km = bookingData.booking_view_km_rate;
        const bi_km_rate = bookingData.booking_view_per_ext_km_rate;
        const bi_ext_min = bookingData.booking_view_per_ext_min_rate;

        const discount_mrp = totalAmounts * 0.10;

        const discount_prices =
            discount_mrp > advance_amounts
                ? discount_mrp - advance_amounts
                : 0;

        const discount_amount_with_services =
            totalAmounts - advance_amounts;

        const bi_ext_km_rate =
            Number(extra_km) * Number(bi_km_rate);

        const bi_ext_min_rate =
            Number(extra_minute) * Number(bi_ext_min);

        const bi_total_amount_with_sc =
            totalAmounts + bi_ext_km_rate + bi_ext_min_rate;

        const [invoiceResult]: any = await db.query(
            `
            INSERT INTO booking_invoice
            (
                bi_booking_id,
                bi_driver_id,
                bi_consumer_id,
                bi_base_rate,
                bi_km_rate,
                bi_addons_rate,
                bi_ext_km,
                bi_ext_km_rate,
                bi_ext_min,
                bi_ext_min_rate,
                bi_total_amount_without_SC,
                bi_discount_in_sc,
                bi_service_charge,
                bi_total_amount_with_sc,
                bi_payment_status,
                bi_cash_pay_amount,
                bi_online_pay_amount,
                bi_status,
                bi_invoice_genrated_time_unix,
                created_at,
                updated_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
            `,
            [
                bookingId,
                bookingdriverId,
                bookingcustomerId,
                bi_base_rate,
                bi_base_km,
                0,
                extra_km,
                bi_ext_km_rate,
                extra_minute,
                bi_ext_min_rate,
                discount_amount_with_services,
                Number(discount_prices.toFixed(2)),
                advance_amounts,
                bi_total_amount_with_sc,
                1,
                0,
                0,
                2,
                Math.floor(Date.now() / 1000)
            ]
        );

        await db.query(
            `
            UPDATE booking_view
            SET booking_status = 3,
                booking_payment_status = ''
            WHERE booking_id = ?
            `,
            [bookingId]
        );

        if (invoiceResult.affectedRows > 0) {
            return {
                success: true,
                message: "Invoice Generate Receive Successfully"
            };
        } else {
            return {
                error: true,
                message: "Something went wrong !!"
            };
        }

    } catch (error) {
        throw new ApiError(
            500,
            "Generate Ambulance Booking Invoice Service Error"
        );
    }
};

// SERVICE TO GET AMBULANCE BOOKING INVOICE DATA
export const ambulanceBookingInvoiceSerive = async (bookingId: number) => {
    try {
        const [rows]: any = await db.query(
            `SELECT 
                booking_invoice.*, 
                consumer.consumer_name,
                consumer.consumer_mobile_no,
                driver.driver_name,
                driver.driver_last_name,
                driver.driver_mobile,
                booking_view.booking_acpt_vehicle_id,
                vehicle.v_vehicle_name,
                vehicle.vehicle_rc_number,
                booking_view.booking_pickup,
                booking_view.booking_drop,
                booking_view.booking_schedule_time,
                booking_view.booking_view_category_name
            FROM booking_invoice
            LEFT JOIN booking_view ON booking_view.booking_id = booking_invoice.bi_booking_id
            LEFT JOIN consumer ON booking_invoice.bi_consumer_id = consumer.consumer_id
            LEFT JOIN driver ON driver.driver_id = booking_invoice.bi_driver_id
            LEFT JOIN vehicle ON vehicle.vehicle_id = booking_view.booking_acpt_vehicle_id
            WHERE bi_booking_id = ?`,
            [bookingId]
        );
        return {
            status: 200,
            message: "Booking invoice data fetched successfully",
            jsonData: {
                booking_invoice_data: rows
            }
        };
    } catch (error) {
        throw new ApiError(500, "Get Booking Invoice Data Error On Fetching");
    }
};

// SERVICE TO GET AMBULANCE BOOKING REMARK LIST
export const ambulanceBookingRemarkListService = async (bookingID: number, filters?: {
    page?: number;
    limit?: number;
}) => {
    try {
        const page = filters?.page && filters.page > 0 ? filters.page : 1;
        const limit = filters?.limit && filters.limit > 0 ? filters.limit : 10;
        const offset = (page - 1) * limit;

        if (!bookingID) {
            throw new ApiError(400, "Invalid booking ID");
        }

        const [rows]: any = await db.query(
            `SELECT 
                remark_id,
                remark_type,
                remark_text,
                remark_add_unix_time,
                admin.admin_name AS remark_added_by_admin_name
            FROM remark_data
            LEFT JOIN admin ON remark_data.remark_type = admin.id
            WHERE remark_data.remark_booking_id = ?
            ORDER BY remark_data.remark_id DESC
            LIMIT ? OFFSET ?`,
            [bookingID, limit, offset]
        );

        const [countRows]: any = await db.query(
            `SELECT COUNT(*) as total FROM remark_data WHERE remark_data.remark_booking_id = ?`,
            [bookingID]
        );

        const total = countRows[0]?.total || 0;


        return {
            status: 200,
            message: "Ambulance booking remarks fetched successfully",
            pagination: {
                total: total,
                page: page,
                limit: limit,
                totalPages: Math.ceil(total / limit)
            },
            jsonData: {
                ambulance_booking_remarks: rows
            }
        };
    } catch (error) {
        throw new ApiError(500, "Get Ambulance Booking Remarks Error On Fetching");
    }
}

// SERVICE TO GET AMBULANCE BOOKING STATE WISE LIST
export const ambulanceBookingStateWiseListService = async (bookingID: number, filters?: { 
    page?: number;
    limit?: number 
}) => {
    try {
        const page = filters?.page && filters.page > 0 ? filters.page : 1;
        const limit = filters?.limit && filters.limit > 0 ? filters.limit : 10;
        const offset = (page - 1) * limit;

        const [stateRows]: any = await db.query(
            `SELECT c.city_state
            FROM booking_view b
            JOIN city c ON booking_pickup_city != 'NA' AND c.city_name = b.booking_pickup_city
            WHERE b.booking_id = ?
            LIMIT 1`,
            [bookingID]
        );

        if (!stateRows.length || !stateRows[0].city_state) {
            return {
                status: 404,
                message: "State not found for the given booking ID",
                jsonData: {}
            }
        }

        const stateId = stateRows[0].city_state;

        const [rows]: any = await db.query(
            `SELECT 
                c.city_id,
                c.city_name,
                state.state_name,
                vd.vehicle_id,
                vd.v_vehicle_name,
                vd.vehicle_rc_number,
                vd.vehicle_added_type,
                vd.vehicle_added_by,
                acv.ambulance_category_vehicle_name,
                d.driver_id as assign_id,
                d.driver_name as name,
                d.driver_last_name as last_name,
                d.driver_mobile as mobile,
                d.driver_wallet_amount as wallet_amount,
                d.driver_duty_status,
                p.partner_id as assign_id,
                p.partner_f_name as name,
                p.partner_l_name as last_name,
                p.partner_mobile as mobile,
                p.partner_wallet as wallet_amount
            FROM city c
            LEFT JOIN driver d 
                ON c.city_id = d.driver_city_id

            LEFT JOIN partner p 
                ON c.city_id = p.partner_city_id

            LEFT JOIN state ON c.city_state = state.state_id

            LEFT JOIN vehicle vd 
                ON vd.vehicle_added_by = d.driver_id 
                AND vd.vehicle_added_type = 0

            LEFT JOIN vehicle vp 
                ON vp.vehicle_added_by = p.partner_id 
                AND vp.vehicle_added_type = 1

            LEFT JOIN ambulance_category_vehicle acv
                ON vd.vehicle_category_type = acv.ambulance_category_vehicle_cat_type

            WHERE c.city_state = ?
            LIMIT ? OFFSET ?`,
            [stateId, limit, offset]
        );

        const [countRows]: any = await db.query(
            `SELECT COUNT(*) AS total FROM city WHERE city.city_state = ?`,
            [stateId]
        );

        const total = countRows[0]?.total || 0;

        return {
            status: 200,
            message: "State-wise data fetched successfully",
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            },
            jsonData: {
                state_wise: rows
            }
        };
    } catch (error) {
        console.error(error);
        throw new ApiError(500, "Get State Wise Data Error");
    }
};

// SERVICE TO GET AMBULANCE BOOKING CITY WISE LIST
export const ambulanceBookingCityWiseListService = async (bookingID: number, filters: {
    page?: number;
    limit?: number;
}) => {
    try {
        const page = filters?.page && filters.page > 0 ? filters.page : 1;
        const limit = filters?.limit && filters.limit > 0 ? filters.limit : 10;
        const offset = (page - 1) * limit;

        const [cityRows]: any = await db.query(
            `SELECT c.city_id
             FROM booking_view b
             JOIN city c ON booking_pickup_city != 'NA' AND c.city_name = b.booking_pickup_city
             WHERE b.booking_id = ?
             LIMIT 1`,
            [bookingID]
        );

        if (!cityRows.length || !cityRows[0].city_id) {
            return {
                status: 404,
                message: "City not found for the given booking ID",
                jsonData: {}
            }
        }

        const cityId = cityRows[0].city_id;

        const [rows]: any = await db.query(
            `SELECT
                c.city_id,
                c.city_name,
                state.state_name,
                vd.vehicle_id,
                vd.v_vehicle_name,
                vd.vehicle_rc_number,
                vd.vehicle_added_type,
                d.driver_id as assign_id,
                d.driver_name as name,
                d.driver_last_name as last_name,
                d.driver_mobile as mobile,
                p.partner_id as assign_id,
                p.partner_f_name as name,
                p.partner_l_name as last_name,
                p.partner_mobile as mobile
            FROM city c
            LEFT JOIN driver d
                ON c.city_id = d.driver_city_id
            LEFT JOIN partner p
                ON c.city_id = p.partner_city_id
            LEFT JOIN state ON c.city_state = state.state_id
            LEFT JOIN vehicle vd
                ON vd.vehicle_added_by = d.driver_id
                AND vd.vehicle_added_type = 0
            LEFT JOIN vehicle vp
                ON vp.vehicle_added_by = p.partner_id
                AND vp.vehicle_added_type = 1
            WHERE c.city_id = ?
            LIMIT ? OFFSET ?`,
            [cityId, limit, offset]
        );
        const [countRows]: any = await db.query(
            `SELECT COUNT(DISTINCT c.city_id) AS total
             FROM city c
             WHERE c.city_id = ?`,
            [cityId]
        );
        const total = countRows[0]?.total || 0;

        return {
            status: 200,
            message: "City-wise data fetched successfully",
            pagination: {
                total: total,
                page: page,
                limit: limit,
                totalPages: Math.ceil(total / limit)
            },
            jsonData: {
                city_wise: rows
            }
        };


    } catch (error) {
        console.error(error);
        throw new ApiError(500, "Get City Wise Data Error");
    }
};