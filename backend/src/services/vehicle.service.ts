import { db } from '../config/db';
import { ApiError } from '../utils/api-error';
import { buildFilters } from '../utils/filters';
import { currentUnixTime } from '../utils/current_unixtime';
import { uploadFileCustom } from '../utils/file_uploads';

interface VehicleData {
    vehicle_added_type?: number; // 0 self, 1 partner
    vehicle_added_by?: number;

    vehicle_category_type?: number;
    vehicle_category_type_service_id?: string; // comma separated

    v_vehicle_name?: string;
    v_vehicle_name_id?: number;

    vehicle_front_image?: Express.Multer.File;
    vehicle_back_image?: Express.Multer.File;
    vehicle_rc_image?: Express.Multer.File;

    vehicle_rc_number?: string;
    vehicle_exp_date?: string; // normal datetime

    // DETAILS TABLE
    vehicle_details_added_type?: number;
    vehicle_details_added_by?: number;
    vehicle_details_fitness_certi_img?: Express.Multer.File;
    vehicle_details_fitness_exp_date?: string;

    vehicle_details_insurance_img?: Express.Multer.File;
    vehicle_details_insurance_exp_date?: string;
    vehicle_details_insurance_holder_name?: string;

    vehicle_details_pollution_img?: Express.Multer.File;
    vehicle_details_pollution_exp_date?: string;
}

// Get Vehicle List Service
export const getVehicleListService = async (filters?: {
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
            dateColumn: "vehicle.created_at",
        });

        let finalWhereSQL = whereSQL;

        if (filters?.status) {
            const statusConditionMap: Record<string, string> = {
                unverified: "vehicle.vehicle_status = 0",
                verified: "vehicle.vehicle_status = 1",
                inactive: "vehicle.vehicle_status = 2",
                deleted: "vehicle.vehicle_status = 3",
                verification: "vehicle.vehicle_status = 4",
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
                vehicle.vehicle_id,
                vehicle.vehicle_added_type,
                driver.driver_name,
                driver.driver_last_name,
                driver.driver_mobile,
                vehicle.v_vehicle_name,
                vehicle.v_vehicle_name_id,
                vehicle.vehicle_category_type,
                vehicle.vehicle_category_type_service_id,
                vehicle.vehicle_exp_date,
                vehicle.vehicle_verify_date,
                vehicle.verify_type,
                vehicle.created_at,
                vehicle.vehicle_status,
                ambulance_category_vehicle.ambulance_category_vehicle_name
            FROM vehicle
            LEFT JOIN driver ON vehicle.vehicle_added_by = driver.driver_id
            LEFT JOIN ambulance_category_vehicle ON vehicle.vehicle_category_type = ambulance_category_vehicle.ambulance_category_vehicle_cat_type
            ${finalWhereSQL}
            ORDER BY vehicle.vehicle_id DESC
            LIMIT ? OFFSET ?
        `;

        const queryParams = [...params, effectiveLimit, effectiveOffset];
        const [rows]: any = await db.query(query, queryParams);

        let total;

        if (noFiltersApplied) {
            const [countAllRows]: any = await db.query(`SELECT COUNT(*) as total FROM vehicle`);
            const actualTotal = countAllRows[0]?.total || 0;

            if (actualTotal < 100) {
                total = actualTotal;
            } else {
                total = 100;
            }
        } else {
            const [countRows]: any = await db.query(
                `SELECT COUNT(*) as total FROM vehicle ${finalWhereSQL}`,
                params
            );
            total = countRows[0]?.total || 0;
        }

        return {
            status: 200,
            message: "Vehicle list fetched successfully",
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
            jsonData: {
                vehicle_list: rows
            },
        };

    } catch (error) {
        throw new ApiError(500, "Get Vehicle List Error On Fetching");
    }

};

// Add Vehicle Service
export const addVehicleService = async (data: VehicleData) => {
    try {
        const addedBy = data.vehicle_added_type === 1 ? data.vehicle_added_by : data.vehicle_added_by;

        // Upload images
        const frontImage = data.vehicle_front_image
            ? uploadFileCustom(data.vehicle_front_image, "/vehicles")
            : null;

        const backImage = data.vehicle_back_image
            ? uploadFileCustom(data.vehicle_back_image, "/vehicles")
            : null;

        const rcImage = data.vehicle_rc_image
            ? uploadFileCustom(data.vehicle_rc_image, "/vehicles/rc")
            : null;

        // Insert into vehicle table
        const insertVehicleQuery = `
            INSERT INTO vehicle (
                vehicle_added_type, vehicle_added_by, vehicle_category_type,
                vehicle_category_type_service_id, v_vehicle_name, v_vehicle_name_id,
                vehicle_front_image, vehicle_back_image, vehicle_rc_image,
                vehicle_rc_number, vehicle_exp_date,
                vehicle_verify_date, verify_type, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, " ", " ", NOW(), NOW())
        `;

        const vehicleResult = await db.query(insertVehicleQuery, [
            data.vehicle_added_type,
            addedBy,
            data.vehicle_category_type,
            data.vehicle_category_type_service_id,
            data.v_vehicle_name,
            data.v_vehicle_name_id,
            frontImage,
            backImage,
            rcImage,
            data.vehicle_rc_number,
            data.vehicle_exp_date
        ]);

        const insertResult: any = Array.isArray(vehicleResult) ? vehicleResult[0] : vehicleResult;
        const vehicleId = insertResult?.insertId;
        if (!vehicleId) throw new ApiError(500, 'Failed to retrieve inserted vehicle id');

        // Upload details files
        const fitnessImg = data.vehicle_details_fitness_certi_img
            ? uploadFileCustom(data.vehicle_details_fitness_certi_img, "/vehicles/fitness")
            : null;

        const insuranceImg = data.vehicle_details_insurance_img
            ? uploadFileCustom(data.vehicle_details_insurance_img, "/vehicles/insurance")
            : null;

        const pollutionImg = data.vehicle_details_pollution_img
            ? uploadFileCustom(data.vehicle_details_pollution_img, "/vehicles/pollution")
            : null;

        // Insert into vehicle_details
        const insertDetailsQuery = `
            INSERT INTO vehicle_details (
                vehicle_details_added_type, vehicle_details_added_by,
                vehicle_details_vheicle_id,
                vehicle_details_fitness_certi_img, vehicle_details_fitness_exp_date,
                vehicle_details_insurance_img, vehicle_details_insurance_exp_date,
                vehicle_details_insurance_holder_name,
                vehicle_details_pollution_img, vehicle_details_pollution_exp_date,
                created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
        `;

        await db.query(insertDetailsQuery, [
            data.vehicle_details_added_type,
            data.vehicle_details_added_by,
            vehicleId,
            fitnessImg,
            data.vehicle_details_fitness_exp_date,
            insuranceImg,
            data.vehicle_details_insurance_exp_date,
            data.vehicle_details_insurance_holder_name,
            pollutionImg,
            data.vehicle_details_pollution_exp_date
        ]);

        return { status: 200, message: "Vehicle added successfully", vehicleId };
    } catch (error) {
        console.log(error);

        throw new ApiError(500, "Failed to add vehicle");
    }
};

// Get Vehicle Service
export const fetchVehicleService = async (vehicleId: number) => {
    try {
        const query = `
            SELECT v.*, vd.*
            FROM vehicle v
            LEFT JOIN vehicle_details vd
            ON v.vehicle_id = vd.vehicle_details_vheicle_id
            WHERE v.vehicle_id = ?
        `;

        const rows = await db.query(query, [vehicleId]);

        return { status: 200, message: "Vehicle fetched successfully", jsonData: { vehicle_data: rows[0] } };
    } catch (error) {
        throw new ApiError(500, "Failed to fetch vehicle");
    }
};

// Update Vehicle Service
export const updateVehicleService = async (vehicleId: number, data: VehicleData) => {
    try {
        if (!vehicleId) throw new ApiError(400, "Vehicle ID is required");

        const updateVehicle: any = {};

        const updatableFields = [
            "vehicle_added_type",
            "vehicle_added_by",
            "vehicle_category_type",
            "vehicle_category_type_service_id",
            "v_vehicle_name",
            "v_vehicle_name_id",
            "vehicle_rc_number",
            "vehicle_exp_date"
        ];

        updatableFields.forEach(f => {
            if ((data as any)[f] !== undefined) updateVehicle[f] = (data as any)[f];
        });

        // Handle images
        if (data.vehicle_front_image)
            updateVehicle.vehicle_front_image = uploadFileCustom(data.vehicle_front_image, "/vehicles");

        if (data.vehicle_back_image)
            updateVehicle.vehicle_back_image = uploadFileCustom(data.vehicle_back_image, "/vehicles");

        if (data.vehicle_rc_image)
            updateVehicle.vehicle_rc_image = uploadFileCustom(data.vehicle_rc_image, "/vehicles/rc");

        updateVehicle.updated_at = new Date();

        await db.query(`UPDATE vehicle SET ? WHERE vehicle_id = ?`, [updateVehicle, vehicleId]);

        // Update details
        const updateDetails: any = {};

        const detailFields = [
            "vehicle_details_fitness_exp_date",
            "vehicle_details_insurance_exp_date",
            "vehicle_details_insurance_holder_name",
            "vehicle_details_pollution_exp_date"
        ];

        detailFields.forEach(f => {
            if ((data as any)[f] !== undefined) updateDetails[f] = (data as any)[f];
        });

        if (data.vehicle_details_fitness_certi_img)
            updateDetails.vehicle_details_fitness_certi_img =
                uploadFileCustom(data.vehicle_details_fitness_certi_img, "/vehicles/fitness");

        if (data.vehicle_details_insurance_img)
            updateDetails.vehicle_details_insurance_img =
                uploadFileCustom(data.vehicle_details_insurance_img, "/vehicles/insurance");

        if (data.vehicle_details_pollution_img)
            updateDetails.vehicle_details_pollution_img =
                uploadFileCustom(data.vehicle_details_pollution_img, "/vehicles/pollution");

        updateDetails.updated_at = new Date();

        await db.query(
            `UPDATE vehicle_details SET ? WHERE vehicle_details_vheicle_id = ?`,
            [updateDetails, vehicleId]
        );

        return { status: 200, message: "Vehicle updated successfully" };

    } catch (error) {
        throw new ApiError(500, "Failed to update vehicle");
    }
};
