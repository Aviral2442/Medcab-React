import { db } from '../config/db';
import { ApiError } from '../utils/api-error';
import { uploadFileCustom } from '../utils/file_uploads';
import { buildFilters } from '../utils/filters';

interface DriverData {
    driver_name?: string;
    driver_last_name?: string;
    driver_mobile?: string;
    driver_dob?: string;
    driver_gender?: string;
    driver_city_id?: number;
    driver_created_by?: number;
    driver_created_partner_id?: number | null;
    driver_auth_key?: string;
    partner_auth_key?: string;

    driver_profile_img?: Express.Multer.File;

    // Driver Details
    driver_details_dl_front_img?: Express.Multer.File;
    driver_details_dl_back_image?: Express.Multer.File;
    driver_details_dl_number?: string;

    driver_details_dl_exp_date?: string; // normal datetime
    driver_details_aadhar_front_img?: Express.Multer.File;
    driver_details_aadhar_back_img?: Express.Multer.File;
    driver_details_aadhar_number?: string;

    driver_details_pan_card_front_img?: Express.Multer.File;
    driver_details_pan_card_number?: string;

    driver_details_police_verification_image?: Express.Multer.File;
    driver_details_police_verification_date?: string; // normal datetime
}

// Get Driver List
export const getDriverService = async (filters: {
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

        const { whereSQL, params } = buildFilters({ ...filters, dateColumn: 'driver.created_at' });

        let finalWhereSQL = whereSQL;

        if (filters?.status) {
            const statusConsitionMap: Record<string, string> = {
                new: "driver.driver_status = 0",
                active: "driver.driver_status = 1",
                inActive: "driver.driver_status = 2",
                delete: "driver.driver_status = 3",
                verification: "driver.driver_status = 4",
            };

            const condition = statusConsitionMap[filters.status];

            if (condition) {
                if (/where\s+/i.test(finalWhereSQL)) {
                    finalWhereSQL += ` AND ${condition}`;
                } else {
                    finalWhereSQL = `WHERE ${condition}`;
                }
            }
        }

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
                driver.driver_id,
                driver.driver_name,
                driver.driver_last_name,
                driver.driver_mobile,
                driver.driver_wallet_amount,
                driver.driver_city_id,
                driver.driver_created_by, /* 0 for Self 1 for Partner */
                driver.driver_profile_img,
                driver.driver_registration_step,
                driver.driver_duty_status,
                driver.driver_status,
                driver.driver_duty_status,
                partner.partner_f_name AS created_partner_name,
                partner.partner_mobile AS created_partner_mobile,
                driver.created_at,
                (
                    SELECT remark_text
                    FROM remark_data
                    WHERE remark_driver_id = driver.driver_id
                    ORDER BY remark_id DESC
                    LIMIT 1
                ) AS remark_text
            FROM driver
            LEFT JOIN partner ON driver.driver_created_by = 1 AND driver.driver_created_partner_id = partner.partner_id
            ${finalWhereSQL}
            ORDER BY driver.driver_id DESC
            LIMIT ? OFFSET ?;
        `;

        const queryParams = [...params, effectiveLimit, effectiveOffset];
        const [rows]: any = await db.query(query, queryParams);

        let total;

        if (noFiltersApplied) {
            total = 100;
        } else {
            const [countRows]: any = await db.query(
                `SELECT COUNT(*) as total FROM driver ${finalWhereSQL}`,
                params
            );
            total = countRows[0]?.total || 0;
        }

        return {
            status: 200,
            message: 'Drivers List Fetch Successful',
            paginations: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            },
            jsonData: {
                drivers: rows
            }
        };

    } catch (error) {
        console.error(error);
        throw new ApiError(500, 'Failed to retrieve drivers services');
    }

};

// Add Driver Service
export const addDriverService = async (data: DriverData) => {
    try {

        let dobTimestamp: number | null = null;
        if (data.driver_dob) {
            const t = Math.floor(new Date(data.driver_dob).getTime() / 1000);
            dobTimestamp = Number.isFinite(t) && t > 0 ? t : null;
        }

        // Conditional partner id
        const createdPartnerId =
            data.driver_created_by === 1 ? data.driver_created_partner_id : null;

        // Upload files
        const profileImg = data.driver_profile_img
            ? uploadFileCustom(data.driver_profile_img, "/drivers")
            : null;

        // INSERT INTO driver
        const driverInsertQuery = `
            INSERT INTO driver (
                driver_name, driver_last_name, driver_mobile, driver_dob,
                driver_gender, driver_city_id, driver_created_by,
                driver_created_partner_id, driver_auth_key, driver_profile_img,
                partner_auth_key, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
        `;

        const driverResult = await db.query(driverInsertQuery, [
            data.driver_name,
            data.driver_last_name,
            data.driver_mobile,
            dobTimestamp,
            data.driver_gender,
            data.driver_city_id,
            data.driver_created_by,
            createdPartnerId || 0,
            data.driver_auth_key || ' ',
            profileImg,
            data.partner_auth_key || ' '
        ]);

        const insertResult: any = Array.isArray(driverResult) ? driverResult[0] : driverResult;
        const driverId = insertResult?.insertId;
        if (!driverId) throw new ApiError(500, 'Failed to retrieve inserted driver id');

        // Handle driver_details uploads
        const dlFrontImg = data.driver_details_dl_front_img
            ? uploadFileCustom(data.driver_details_dl_front_img, "/drivers/dl")
            : null;

        const dlBackImg = data.driver_details_dl_back_image
            ? uploadFileCustom(data.driver_details_dl_back_image, "/drivers/dl")
            : null;

        const aadharFront = data.driver_details_aadhar_front_img
            ? uploadFileCustom(data.driver_details_aadhar_front_img, "/drivers/aadhar")
            : null;

        const aadharBack = data.driver_details_aadhar_back_img
            ? uploadFileCustom(data.driver_details_aadhar_back_img, "/drivers/aadhar")
            : null;

        const panFront = data.driver_details_pan_card_front_img
            ? uploadFileCustom(data.driver_details_pan_card_front_img, "/drivers/pan")
            : null;

        const policeImg = data.driver_details_police_verification_image
            ? uploadFileCustom(
                data.driver_details_police_verification_image,
                "/drivers/police"
            )
            : null;

        // INSERT INTO driver_details table
        const driverDetailsQuery = `
            INSERT INTO driver_details (
                driver_details_driver_id,
                driver_details_dl_front_img,
                driver_details_dl_back_image,
                driver_details_dl_number,
                driver_details_dl_exp_date,
                driver_details_aadhar_front_img,
                driver_details_aadhar_back_img,
                driver_details_aadhar_number,
                driver_details_pan_card_front_img,
                driver_details_pan_card_number,
                driver_details_police_verification_image,
                driver_details_police_verification_date,
                created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
        `;

        await db.query(driverDetailsQuery, [
            driverId,
            dlFrontImg,
            dlBackImg,
            data.driver_details_dl_number,
            data.driver_details_dl_exp_date,
            aadharFront,
            aadharBack,
            data.driver_details_aadhar_number,
            panFront,
            data.driver_details_pan_card_number,
            policeImg,
            data.driver_details_police_verification_date
        ]);

        return { status: 200, message: "Driver created successfully", driverId };

    } catch (error) {
        console.log(error);

        throw new ApiError(500, "Failed to add driver");
    }
};

// Fetch Driver Service
export const fetchDriverService = async (driverId: number) => {
    try {
        const query = `
            SELECT d.*, dd.*
            FROM driver d
            LEFT JOIN driver_details dd
            ON d.driver_id = dd.driver_details_driver_id
            WHERE d.driver_id = ?
        `;

        const rows = await db.query(query, [driverId]);

        return { status: 200, message: "Driver fetched successfully", jsonData: { driver_fetch: rows[0] } };

    } catch (error) {
        throw new ApiError(500, "Failed to fetch driver");
    }
};

// Update Driver Service
export const updateDriverService = async (driverId: number, data: DriverData) => {
    try {
        if (!driverId) throw new ApiError(400, "Driver ID is required");

        // Convert DOB
        let dobTimestamp: number | null = null;
        if (data.driver_dob) {
            const t = Math.floor(new Date(data.driver_dob).getTime() / 1000);
            dobTimestamp = Number.isFinite(t) && t > 0 ? t : null;
        }

        const updateDriverData: any = {};

        if (data.driver_name !== undefined) updateDriverData.driver_name = data.driver_name;
        if (data.driver_last_name !== undefined) updateDriverData.driver_last_name = data.driver_last_name;
        if (data.driver_mobile !== undefined) updateDriverData.driver_mobile = data.driver_mobile;
        if (data.driver_dob !== undefined) updateDriverData.driver_dob = dobTimestamp;
        if (data.driver_gender !== undefined) updateDriverData.driver_gender = data.driver_gender;
        if (data.driver_city_id !== undefined) updateDriverData.driver_city_id = data.driver_city_id;

        if (data.driver_created_by !== undefined) {
            updateDriverData.driver_created_by = data.driver_created_by;
            updateDriverData.driver_created_partner_id =
                data.driver_created_by === 1 ? data.driver_created_partner_id : null;
        }

        if (data.driver_profile_img) {
            const uploaded = uploadFileCustom(data.driver_profile_img, "/drivers");
            updateDriverData.driver_profile_img = uploaded;
        }

        updateDriverData.updated_at = new Date();

        await db.query(`UPDATE driver SET ? WHERE driver_id = ?`, [
            updateDriverData,
            driverId
        ]);

        // Update driver_details
        const updateDetails: any = {};

        const dlFields = [
            "driver_details_dl_number",
            "driver_details_dl_exp_date",
            "driver_details_aadhar_number",
            "driver_details_pan_card_number",
            "driver_details_police_verification_date"
        ];

        dlFields.forEach((f) => {
            if ((data as any)[f] !== undefined) updateDetails[f] = (data as any)[f];
        });

        if (data.driver_details_dl_front_img) {
            updateDetails.driver_details_dl_front_img = uploadFileCustom(
                data.driver_details_dl_front_img,
                "/drivers/dl"
            );
        }

        if (data.driver_details_dl_back_image) {
            updateDetails.driver_details_dl_back_image = uploadFileCustom(
                data.driver_details_dl_back_image,
                "/drivers/dl"
            );
        }

        if (data.driver_details_aadhar_front_img) {
            updateDetails.driver_details_aadhar_front_img = uploadFileCustom(
                data.driver_details_aadhar_front_img,
                "/drivers/aadhar"
            );
        }

        if (data.driver_details_aadhar_back_img) {
            updateDetails.driver_details_aadhar_back_img = uploadFileCustom(
                data.driver_details_aadhar_back_img,
                "/drivers/aadhar"
            );
        }

        if (data.driver_details_pan_card_front_img) {
            updateDetails.driver_details_pan_card_front_img = uploadFileCustom(
                data.driver_details_pan_card_front_img,
                "/drivers/pan"
            );
        }

        if (data.driver_details_police_verification_image) {
            updateDetails.driver_details_police_verification_image = uploadFileCustom(
                data.driver_details_police_verification_image,
                "/drivers/police"
            );
        }

        updateDetails.updated_at = new Date();

        await db.query(
            `UPDATE driver_details SET ? WHERE driver_details_driver_id = ?`,
            [updateDetails, driverId]
        );

        return { status: 200, message: "Driver updated successfully" };

    } catch (error) {
        throw new ApiError(500, "Failed to update driver");
    }
};

// Get Driver Detail
export const driverDetailService = async (driverId: number) => {

    try {

        const [rows]: any = await db.query(
            `
            SELECT 
            driver.*, driver_details.*, vehicle.v_vehicle_name, vehicle.vehicle_rc_number, vehicle.vehicle_category_type, city.city_name,
            partner.partner_f_name, partner.partner_l_name, partner.partner_mobile
            FROM driver 
            LEFT JOIN vehicle ON driver.driver_assigned_vehicle_id = vehicle.vehicle_id
            LEFT JOIN city ON driver.driver_city_id = city.city_id
            LEFT JOIN partner ON driver.driver_created_by > 0 AND driver.driver_created_partner_id = partner.partner_id
            LEFT JOIN driver_details ON driver.driver_id = driver_details.driver_details_driver_id
            WHERE driver.driver_id = ?
            `, [driverId]
        );

        if (rows.length === 0) {
            throw new ApiError(404, 'Driver not found');
        }

        return {
            status: 200,
            message: 'Driver Detail Fetch Successful',
            jsonData: {
                driver: rows[0]
            }
        };

    } catch (error) {
        console.error(error);
        throw new ApiError(500, 'Failed to retrieve driver details service');
    }

};

// Get Driver On Off Data
export const driverOnOffDataService = async (filters: {
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

        const { whereSQL, params } = buildFilters({ ...filters, dateColumn: 'driver.created_at' });

        let finalWhereSQL = whereSQL;

        if (filters?.status) {
            const statusRaw = String(filters.status).trim();
            const statusUpper = statusRaw.toUpperCase();
            let condition: string | undefined = undefined;

            if (/^\d+$/.test(statusRaw)) {
                const statusNum = parseInt(statusRaw, 10);
                condition = `driver.driver_status = ${statusNum}`;
            } else {
                const statusMap: Record<string, number> = {
                    NEW: 0,
                    ACTIVE: 1,
                    INACTIVE: 2,
                    DELETE: 3,
                    VERIFICATION: 4,
                };

                if (statusMap[statusUpper] !== undefined) {
                    condition = `driver.driver_status = ${statusMap[statusUpper]}`;
                } else if (statusUpper === "ON" || statusUpper === "OFF") {
                    // Duty status
                    condition = `driver.driver_duty_status = '${statusUpper}'`;
                }
            }

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

        if (noFiltersApplied) {
            effectiveLimit = limit;              
            effectiveOffset = (page - 1) * limit;
        }

        const query = `

            SELECT
                driver.driver_id,
                driver.driver_name,
                driver.driver_last_name,
                driver.driver_mobile,
                driver.driver_duty_status,
                driver.driver_wallet_amount,
                driver.driver_status,
                driver.created_at,
                vehicle.v_vehicle_name,
                vehicle.vehicle_rc_number
            FROM driver
            LEFT JOIN vehicle ON driver.driver_assigned_vehicle_id = vehicle.vehicle_id
            ${finalWhereSQL}
            ORDER BY driver.driver_id DESC
            LIMIT ? OFFSET ?;

        `;

        const queryParams = [...params, effectiveLimit, effectiveOffset];
        const [rows]: any = await db.query(query, queryParams);


        let total;

        if (noFiltersApplied) {
            total = 100;
        } else {
            const [countRows]: any = await db.query(
                `SELECT COUNT(*) as total FROM driver ${finalWhereSQL}`,
                params
            );
            total = countRows[0]?.total || 0;
        }

        return {
            status: 200,
            message: 'Drivers On Off Data Fetch Successful',
            paginations: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            },
            jsonData: {
                driverOnOffData: rows
            }
        };

    } catch (error) {
        console.error(error);
        throw new ApiError(500, 'Failed to retrieve drivers on off data service');
    }

};

// Get Total Driver Live Location on Map
export const TotalDriverLiveLocationService = async (filters: {
    status?: string;
}) => {
    try {
        let finalWhereSQL = '';
        const params: any[] = [];

        // Status filter - FIXED to use proper SQL syntax
        if (filters?.status) {
            const statusConditionMap: Record<string, string> = {
                ON: "driver.driver_duty_status = 'ON'",
                OFF: "driver.driver_duty_status = 'OFF'",
            };

            const condition = statusConditionMap[filters.status];
            if (condition) {
                finalWhereSQL = `WHERE ${condition}`;
            }
        }

        // Query with city_name included - NO LIMIT
        const query = `
            SELECT
                driver_live_location.*,
                driver.driver_name,
                driver.driver_mobile,
                driver.driver_duty_status,
                city.city_name,
                vehicle.v_vehicle_name,
                vehicle.vehicle_rc_number
            FROM driver_live_location
            LEFT JOIN driver ON driver_live_location.driver_live_location_d_id = driver.driver_id
            LEFT JOIN city ON driver.driver_city_id = city.city_id
            LEFT JOIN vehicle ON driver.driver_assigned_vehicle_id = vehicle.vehicle_id
            ${finalWhereSQL}
            ORDER BY driver_live_location.driver_live_location_id DESC
        `;

        const [rows]: any = await db.query(query, params);

        return {
            status: 200,
            message: 'Driver Live Location Data Fetch Successful',
            jsonData: {
                driver_Live_Location_Data: rows
            }
        };
    } catch (error) {
        console.error(error);
        throw new ApiError(500, 'Failed to retrieve driver live location data service');
    }
};

// Get Driver On Off Map Location
export const driverLiveLocationService = async (driverOnOffId: number) => {
    try {
        if (!driverOnOffId || isNaN(driverOnOffId)) {
            throw new ApiError(400, 'Invalid driver location ID');
        }

        const [rows]: any = await db.query(
            `SELECT
                driver_live_location.*,
                driver.driver_name,
                driver.driver_mobile,
                driver.driver_duty_status
            FROM driver
            LEFT JOIN driver_live_location 
                ON driver.driver_id = driver_live_location.driver_live_location_d_id
            WHERE driver.driver_id = ?`,
            [driverOnOffId]
        );

        if (!rows || rows.length === 0) {
            throw new ApiError(404, 'Driver not found');
        }

        const row = rows[0];  // <--- Make your life easy

        // 🔥 FIXED: Check row instead of rows
        const noLocation =
            row.driver_live_location_id === null ||
            row.driver_live_location_lat === null ||
            row.driver_live_location_long === null;

        if (noLocation) {
            return {
                status: 200,
                message: 'Driver live location not available',
                jsonData: {
                    driverOnOffMapLocation: null,
                    driver: {
                        driver_id: row.driver_id,
                        driver_name: row.driver_name,
                        driver_mobile: row.driver_mobile,
                        driver_duty_status: row.driver_duty_status
                    }
                }
            };
        }

        // If location exists
        return {
            status: 200,
            message: 'Driver On Off Map Location Fetch Successful',
            jsonData: {
                driverOnOffMapLocation: row
            }
        };

    } catch (error) {
        console.error('driverLiveLocationService error:', error);
        if (error instanceof ApiError) throw error;
        throw new ApiError(500, 'Failed to retrieve driver live location');
    }
};
