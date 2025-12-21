import { db } from '../config/db';
import { ApiError } from '../utils/api-error';
import { buildFilters } from '../utils/filters';
import { currentUnixTime } from '../utils/current_unixtime';
import { uploadFileCustom } from '../utils/file_uploads';

interface PartnerData {
    partner_f_name?: string;
    partner_l_name?: string;
    partner_mobile?: string;
    partner_dob?: string;
    partner_gender?: string;
    partner_city_id?: number;
    partner_profile_img?: Express.Multer.File;
    partner_aadhar_front?: Express.Multer.File;
    partner_aadhar_back?: Express.Multer.File;
    partner_created_by?: string;
    partner_created_by_id?: number;
    partner_wallet?: number;
    partner_pending_wallet_to_comp?: number;
    partner_registration_step?: number;
    partner_aadhar_no?: string;
    referral_referral_by?: string;
}

// Get Partners List
export const getPartnerServices = async (filters?: {
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

        const { whereSQL, params } = buildFilters({ ...filters, dateColumn: 'created_at' });

        let finalWhereSQL = whereSQL;

        if (filters?.status) {
            const statusConsitionMap: Record<string, string> = {
                new: "partner_status = 0",
                active: "partner_status = 1",
                inActive: "partner_status = 2",
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
                partner_status,
                (
                    SELECT remark_text 
                    FROM remark_data 
                    WHERE remark_partner_id = partner.partner_id 
                    ORDER BY remark_id DESC 
                    LIMIT 1
                ) AS remark_text
            FROM partner
            ${finalWhereSQL}
            ORDER BY partner_id DESC
            LIMIT ? OFFSET ?;
        `;

        const queryParams = [...params, effectiveLimit, effectiveOffset];
        const [rows]: any = await db.query(query, queryParams);

        let total;

        if (noFiltersApplied) {
            total = 100;
        } else {
            const [countRows]: any = await db.query(
                `SELECT COUNT(*) as total FROM partner ${finalWhereSQL}`,
                params
            );
            total = countRows[0]?.total || 0;
        }

        return {
            status: 200,
            message: 'Partner List Fetch Successful',
            paginations: {
                page,
                limit,
                total,
                totalPages : Math.ceil(total / limit)
            },
            jsonData: {
                partners: rows
            }
        };

    } catch (error) {
        console.error(error);
        throw new ApiError(500, 'Failed to retrieve partner services');
    }

};

// Add Partner Service
export const addPartnerService = async (data: PartnerData) => {

    try {

        let dobTimestamp: number | null = null;
        if (data.partner_dob) {
            const t = Math.floor(new Date(data.partner_dob).getTime() / 1000);
            dobTimestamp = Number.isFinite(t) && t > 0 ? t : null;
        }

        let profile, aadharFrontPath, aadharBackPath = null;

        // profile image
        if (data.partner_profile_img) {
            const uploadedPath = uploadFileCustom(data.partner_profile_img, "/partners");
            profile = uploadedPath;
        }

        // aadhar front
        if (data.partner_aadhar_front) {
            const uploadedPath = uploadFileCustom(data.partner_aadhar_front, "/partners");
            aadharFrontPath = uploadedPath;
        }

        // aadhar back
        if (data.partner_aadhar_back) {
            const uploadedPath = uploadFileCustom(data.partner_aadhar_back, "/partners");
            aadharBackPath = uploadedPath;
        }

        const partnerData = {
            partner_f_name: data.partner_f_name,
            partner_l_name: data.partner_l_name,
            partner_mobile: data.partner_mobile,
            partner_dob: dobTimestamp,
            partner_gender: data.partner_gender,
            partner_city_id: data.partner_city_id,
            partner_created_by: data.partner_created_by,
            partner_created_by_id: data.partner_created_by_id,
            partner_profile_img: profile,
            partner_aadhar_front: aadharFrontPath,
            partner_aadhar_back: aadharBackPath,
            partner_aadhar_no: data.partner_aadhar_no,
            partner_wallet: data.partner_wallet || 0,
            partner_pending_wallet_to_comp: data.partner_pending_wallet_to_comp || 0,
            partner_registration_step: data.partner_registration_step || 1,
            referral_referral_by: data.referral_referral_by || 0,
            created_at: new Date(),
            updated_at: new Date(),
        };

        const [result]: any = await db.query('INSERT INTO partner SET ?', partnerData);

        return {
            status: 201,
            message: 'Partner added successfully',
            jsonData: {
                partner_id: result.insertId
            }
        };

    } catch (error) {
        console.error(error);
        throw new ApiError(500, 'Failed to add partner');
    }
};

// Fetch Partner By ID Service
export const fetchPartnerByIdService = async (partnerId: number) => {
    try {
        const [rows]: any = await db.query(
            `SELECT 
                partner.*,
                city.city_state as partner_state,
                city.city_name,
                state.state_name
            FROM partner
            LEFT JOIN city ON partner.partner_city_id = city.city_id
            LEFT JOIN state ON city.city_state = state.state_id
            WHERE partner.partner_id = ?`,
            [partnerId]
        );

        if (rows.length === 0) {
            throw new ApiError(404, 'Partner not found');
        }

        return {
            status: 200,
            message: 'Partner fetched successfully',
            jsonData: {
                partner: rows[0]
            }
        };

    } catch (error) {
        console.error(error);
        throw new ApiError(500, 'Failed to fetch partner');
    }
};

// Update Partner Service
export const updatePartnerService = async (partnerId: number, data: PartnerData) => {
    try {
        let dobTimestamp: number | null = null;
        if (data.partner_dob) {
            const t = Math.floor(new Date(data.partner_dob).getTime() / 1000);
            dobTimestamp = Number.isFinite(t) && t > 0 ? t : null;
        }

        const updateData: any = {
            partner_f_name: data.partner_f_name,
            partner_l_name: data.partner_l_name,
            partner_mobile: data.partner_mobile,
            partner_dob: dobTimestamp,
            partner_gender: data.partner_gender,
            partner_city_id: data.partner_city_id,
            // Remove partner_state
            partner_created_by: data.partner_created_by,
            partner_created_by_id: data.partner_created_by_id,
            partner_aadhar_no: data.partner_aadhar_no,
            partner_wallet: data.partner_wallet,
            partner_pending_wallet_to_comp: data.partner_pending_wallet_to_comp,
            partner_registration_step: data.partner_registration_step,
            referral_referral_by: data.referral_referral_by || 0,
            updated_at: new Date(),
        };

        // Handle file uploads
        if (data.partner_profile_img) {
            const uploadedPath = uploadFileCustom(data.partner_profile_img, "/partners");
            updateData.partner_profile_img = uploadedPath;
        }

        if (data.partner_aadhar_front) {
            const uploadedPath = uploadFileCustom(data.partner_aadhar_front, "/partners");
            updateData.partner_aadhar_front = uploadedPath;
        }

        if (data.partner_aadhar_back) {
            const uploadedPath = uploadFileCustom(data.partner_aadhar_back, "/partners");
            updateData.partner_aadhar_back = uploadedPath;
        }

        await db.query('UPDATE partner SET ? WHERE partner_id = ?', [updateData, partnerId]);

        return {
            status: 200,
            message: 'Partner updated successfully'
        };

    } catch (error) {
        console.error(error);
        throw new ApiError(500, 'Failed to update partner');
    }
};

// Get Manpower Partners List
export const getManpowerPartnerServices = async (filters?: {
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

        const { whereSQL, params } = buildFilters({ ...filters, dateColumn: 'created_at' });

        let finalWhereSQL = whereSQL;

        if (filters?.status) {
            const statusConsitionMap: Record<string, string> = {
                new: "partner_man_power_status = 0",
                active: "partner_man_power_status = 1",
                inActive: "partner_man_power_status = 2",
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
                partner_man_power_id,
                partner_man_power_f_name,
                partner_man_power_l_name,
                partner_man_power_mobile,
                partner_man_power_wallet,
                partner_man_power_profile_img,
                partner_man_power_created_by,
                city.city_name,
                partner_man_power_registration_step,
                partner_man_power_referral,
                mp_referral_referral_by,
                partner_man_power_status,
                created_at
            FROM partner_man_power
            LEFT JOIN city ON partner_man_power.partner_man_power_city_id = city.city_id
            ${finalWhereSQL}
            ORDER BY partner_man_power_id DESC
            LIMIT ? OFFSET ?;
        `;

        const queryParams = [...params, limit, offset];
        const [rows]: any = await db.query(query, queryParams);

        const [countRows]: any = await db.query(
            `
            SELECT COUNT(*) as total
            FROM partner_man_power
            ${finalWhereSQL}
            `, params
        );

        const totalData = countRows[0]?.total || 0;
        const totalPages = Math.ceil(totalData / limit);

        return {
            status: 200,
            message: 'Manpower Partner List Fetch Successful',
            paginations: {
                page,
                limit,
                total: totalData,
                totalPages
            },
            jsonData: {
                partners: rows
            }
        };

    } catch (error) {
        console.error(error);
        throw new ApiError(500, 'Failed to retrieve partner services');
    }

};

// Get Partner Transactions List
export const getPartnerTransactionServices = async (filters?: {
    date?: string;
    fromDate?: string;
    toDate?: string;
    partnerId?: number;
    page?: number;
    limit?: number;
}) => {

    try {

        const page = filters?.page && filters.page > 0 ? filters.page : 1;
        const limit = filters?.limit && filters.limit > 0 ? filters.limit : 10;
        const offset = (page - 1) * limit;

        const { whereSQL, params } = buildFilters({ ...filters, dateColumn: 'partner_transection.partner_transection_time_unix' });

        let finalWhereSQL = whereSQL;
        let finalParams = [...params];

        // Add partner_id filter if provided
        if (filters?.partnerId) {
            const condition = "partner_transection.partner_transection_by = ?";
            if (/where\s+/i.test(finalWhereSQL)) {
                finalWhereSQL += ` AND ${condition}`;
            } else {
                finalWhereSQL = `WHERE ${condition}`;
            }
            finalParams.push(filters.partnerId);
        }

        const query = `
            SELECT *, partner.partner_f_name , partner.partner_mobile , partner.partner_id 
            FROM partner_transection
            LEFT JOIN partner ON partner_transection.partner_transection_by = partner.partner_id
            ${finalWhereSQL}
            ORDER BY partner_transection_id DESC
            LIMIT ? OFFSET ?;
        `;

        const queryParams = [...finalParams, limit, offset];
        const [rows]: any = await db.query(query, queryParams);

        const [countRows]: any = await db.query(
            `
            SELECT COUNT(*) as total
            FROM partner_transection
            ${finalWhereSQL}
            `, finalParams
        );

        const totalData = countRows[0]?.total || 0;
        const totalPages = Math.ceil(totalData / limit);

        return {
            status: 200,
            message: 'Partner Transaction List Fetch Successful',
            paginations: {
                page,
                limit,
                total: totalData,
                totalPages
            },
            jsonData: {
                partnerTransactions: rows
            }
        };

    } catch (error) {
        console.error(error);
        throw new ApiError(500, 'Failed to retrieve partner transaction services');
    }

};

// Get Partner Detail Services
export const getPartnerDetailServices = async (partnerId: number) => {

    try {

        const partnerBasicDetail = `
        SELECT partner.*, city.city_name, admin.admin_name AS partner_created_by_name
        FROM 
        partner 
        LEFT JOIN city ON partner.partner_city_id = city.city_id
        LEFT JOIN admin ON partner.partner_created_by_id = admin.id
        WHERE partner_id = ?`;

        const partnerAccountDetail = `SELECT * FROM partner_acc_dtl WHERE partner_acc_dtl_p_id = ?`;

        const [basicData]: any = await db.query(partnerBasicDetail, [partnerId]);
        const [accountData]: any = await db.query(partnerAccountDetail, [partnerId]);

        return {
            status: 200,
            message: 'Partner Details Fetch Successful',
            jsonData: {
                partnerBasicDetail: basicData,
                partnerAccountDetail: accountData
            }
        };

    } catch (error) {
        console.error(error);
        throw new ApiError(500, 'Failed to retrieve partner detail services');
    }

};