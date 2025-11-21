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
        const limit = filters?.limit && filters.limit > 0 ? filters.limit : 100;
        const offset = (page - 1) * limit;

        const { whereSQL, params } = buildFilters({ ...filters, dateColumn: 'created_at' });

        let finalWhereSQL = whereSQL;

        if (filters?.status) {
            const statusConsitionMap: Record<string, string> = {
                new: "driver_status = 0",
                active: "driver_status = 1",
                inActive: "driver_status = 2",
                delete: "driver_status = 3",
                verification: "driver_status = 4",
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

        const query = `

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
            ${finalWhereSQL}
            ORDER BY driver_id DESC
            LIMIT ? OFFSET ?;
        `;

        const queryParams = [...params, limit, offset];
        const [rows]: any = await db.query(query, queryParams);

        const [countRows]: any = await db.query(
            `
            SELECT COUNT(*) as total
            FROM driver
            ${finalWhereSQL}
            `, params
        );

        const totalData = countRows[0]?.total || 0;
        const totalPages = Math.ceil(totalData / limit);

        return {
            status: 200,
            message: 'Drivers List Fetch Successful',
            paginations: {
                page,
                limit,
                total: totalData,
                totalPages
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
            driver.*, vehicle.v_vehicle_name, vehicle.vehicle_rc_number, vehicle.vehicle_category_type, city.city_name,
            partner.partner_f_name, partner.partner_l_name, partner.partner_mobile
            FROM driver 
            LEFT JOIN vehicle ON driver.driver_assigned_vehicle_id = vehicle.vehicle_id
            LEFT JOIN city ON driver.driver_city_id = city.city_id
            LEFT JOIN partner ON driver.driver_created_by > 0 AND driver.driver_created_partner_id = partner.partner_id
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
        const limit = filters?.limit && filters.limit > 0 ? filters.limit : 100;
        const offset = (page - 1) * limit;

        const { whereSQL, params } = buildFilters({ ...filters, dateColumn: 'driver_on_off_data.dood_time_unix' });

        let finalWhereSQL = whereSQL;

        if (filters?.status) {
            const statusConsitionMap: Record<string, string> = {
                on: "driver_on_off_data.dood_status = ON",
                off: "driver_on_off_data.dood_status = OFF",
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

        const query = `

            SELECT 
                driver_on_off_data.*,
                driver.driver_name,
                driver.driver_mobile,
                vehicle.v_vehicle_name,
                vehicle.vehicle_rc_number
            FROM driver_on_off_data
            LEFT JOIN driver ON driver_on_off_data.dood_by_did = driver.driver_id
            LEFT JOIN vehicle ON driver_on_off_data.dood_vehicle_id = vehicle.vehicle_id
            ${finalWhereSQL}
            ORDER BY driver_on_off_data.dood_id DESC
            LIMIT ? OFFSET ?;
        `;

        const queryParams = [...params, limit, offset];
        const [rows]: any = await db.query(query, queryParams);

        const [countRows]: any = await db.query(
            `
            SELECT COUNT(*) as total
            FROM driver_on_off_data
            ${finalWhereSQL}
            `, params
        );

        const totalData = countRows[0]?.total || 0;
        const totalPages = Math.ceil(totalData / limit);

        return {
            status: 200,
            message: 'Drivers On Off Data Fetch Successful',
            paginations: {
                page,
                limit,
                total: totalData,
                totalPages
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

// Get Driver On Off Map Location
export const driverOnOffMapLocationService = async (driverOnOffId: number) => {
    try {

        const [rows]: any = await db.query(
            `SELECT driver_on_off_data.dood_by_did, driver_on_off_data.dood_lat, driver_on_off_data.dood_long, driver_on_off_data.dood_status, driver_on_off_data.dood_time_unix, driver.driver_name, driver.driver_mobile
            FROM driver_on_off_data
            JOIN driver ON driver_on_off_data.dood_by_did = driver.driver_id
            WHERE dood_id = ?`, [driverOnOffId]
        );

        if (rows.length === 0) {
            throw new ApiError(404, 'Driver On Off Map Location not found');
        }

        return {
            status: 200,
            message: 'Driver On Off Map Location Fetch Successful',
            jsonData: {
                driverOnOffMapLocation: rows[0]
            }
        };

    } catch (error) {
        throw new ApiError(500, 'Failed to retrieve driver on off map location service');
    }
}