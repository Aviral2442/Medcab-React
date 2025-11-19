import { db } from '../config/db';
import { ApiError } from '../utils/api-error';
import { buildFilters } from '../utils/filters';

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
        const limit = filters?.limit && filters.limit > 0 ? filters.limit : 100;
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
                partner_status
            FROM partner
            ${finalWhereSQL}
            ORDER BY partner_id DESC
            LIMIT ? OFFSET ?;
        `;

        const queryParams = [...params, limit, offset];
        const [rows]: any = await db.query(query, queryParams);

        const [countRows]: any = await db.query(
            `
            SELECT COUNT(*) as total
            FROM partner
            ${finalWhereSQL}
            `, params
        );

        const totalData = countRows[0]?.total || 0;
        const totalPages = Math.ceil(totalData / limit);

        return {
            status: 200,
            message: 'Partner List Fetch Successful',
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
        const limit = filters?.limit && filters.limit > 0 ? filters.limit : 100;
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
                partner_man_power_city_id,
                partner_man_power_registration_step,
                partner_man_power_referral,
                mp_referral_referral_by,
                partner_man_power_status,
                created_at
            FROM partner_man_power
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
    // status?: string;
    fromDate?: string;
    toDate?: string;
    page?: number;
    limit?: number;
}) => {

    try {

        const page = filters?.page && filters.page > 0 ? filters.page : 1;
        const limit = filters?.limit && filters.limit > 0 ? filters.limit : 100;
        const offset = (page - 1) * limit;

        const { whereSQL, params } = buildFilters({ ...filters, dateColumn: 'partner_transection.created_at' });

        let finalWhereSQL = whereSQL;

        // if (filters?.status) {
        //     const statusConsitionMap: Record<string, string> = {
        //         new: "partner_man_power_status = 0",
        //         active: "partner_man_power_status = 1",
        //         inActive: "partner_man_power_status = 2",
        //     };

        //     const condition = statusConsitionMap[filters.status];

        //     if (condition) {
        //         if (/where\s+/i.test(finalWhereSQL)) {
        //             finalWhereSQL += ` AND ${condition}`;
        //         } else {
        //             finalWhereSQL = `WHERE ${condition}`;
        //         }
        //     }
        // }

        const query = `

            SELECT *, partner.partner_f_name , partner.partner_mobile , partner.partner_id 
            FROM partner_transection
            LEFT JOIN partner ON partner_transection.partner_transection_by = partner.partner_id
            ${finalWhereSQL}
            ORDER BY partner_transection_id DESC
            LIMIT ? OFFSET ?;
        `;

        const queryParams = [...params, limit, offset];
        const [rows]: any = await db.query(query, queryParams);

        const [countRows]: any = await db.query(
            `
            SELECT COUNT(*) as total
            FROM partner_transection
            ${finalWhereSQL}
            `, params
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

        const partnerBasicDetail = `SELECT * FROM partner WHERE partner_id = ?`;

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