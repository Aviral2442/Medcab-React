import { db } from '../config/db';
import { ApiError } from '../utils/api-error';
import { buildFilters } from "../utils/filters";
import path from 'path';
import fs from 'fs';

// VENDOR LIST SERVICE
export const getVendorList = async (filters?: {
  date?: string;
  fromDate?: string;
  toDate?: string;
  status?: string;
  page?: number;
  limit?: number;
}) => {
  try {
    const page = filters?.page && filters.page > 0 ? filters.page : 1;
    const limit = filters?.limit && filters.limit > 0 ? filters.limit : 12;
    const offset = (page - 1) * limit;

    const { whereSQL, params } = buildFilters({
      ...filters,
      dateColumn: "vendor.vendor_created_at",
    });

    let finalWhereSQL = whereSQL;
    const finalParams = [...params];

    if (filters?.status) {
      const statusConditionMap: Record<string, number> = {
        new: 0,
        active: 1,
        inactive: 2,
      };

      const statusValue = statusConditionMap[filters.status];
      if (statusValue !== undefined) {
        finalWhereSQL += finalWhereSQL ? ` AND vendor.vendor_status = ?` : `WHERE vendor.vendor_status = ?`;
        finalParams.push(statusValue);
      }
    }

    const query = `
      SELECT 
        vendor.vendor_id,
        vendor.vendor_name,
        vendor.vendor_gender,
        vendor.vendor_picture,
        vendor.vendor_mobile,
        vendor.vendor_category_details_id,
        vendor.vendor_status,
        vendor.vendor_created_at,
        city.city_name,
        manpower_category.mp_cat_name,
                        (
                    SELECT remark_text 
                    FROM remark_data 
                    WHERE remark_manpower_vendor_id = vendor.vendor_id 
                    ORDER BY remark_id DESC 
                    LIMIT 1
                ) AS remark_text
      FROM vendor
      LEFT JOIN vendor_address 
        ON vendor.vendor_address_details_id = vendor_address.vendor_address_id
      LEFT JOIN city 
        ON vendor_address.vendor_address_city_id = city.city_id
      LEFT JOIN vendor_manpower_mapper 
        ON vendor.vendor_category_details_id = vendor_manpower_mapper.vmm_id
      LEFT JOIN manpower_category 
        ON vendor_manpower_mapper.vmm_category_id = manpower_category.mp_cat_id
      
      ${finalWhereSQL}
      ORDER BY vendor.vendor_created_at DESC
      LIMIT ? OFFSET ?
    `;

    const queryParams = [...finalParams, limit, offset];
    const [rows]: any = await db.query(query, queryParams);

    const [countRows]: any = await db.query(
      `SELECT COUNT(*) AS total FROM vendor ${finalWhereSQL}`,
      finalParams
    );

    const total = countRows?.[0]?.total || 0;

    return {
      status: 200,
      message: "Vendor list fetched successfully",
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      jsonData: rows || [],
    };
  } catch (error) {
    console.error("❌ Error fetching vendor list:", error);
    throw new ApiError(500, "Failed to fetch vendor list");
  }
};


// Vendor Details Service
export const vendorDetailService = async (vendorId: number) => {

  try {

    const query = `
      SELECT 
        vendor.*,
        city.city_name,
        vendor_account_details.*,
        vendor_professional_details.*,
        vendor_address.vendor_address_full,
        ambulance_category.ambulance_category_name,
        manpower_category.mp_cat_name,
        work_location_city.city_name as work_location_city_name,
        partner.partner_f_name + ' ' + partner.partner_l_name AS partner_full_name
      FROM vendor
      LEFT JOIN vendor_address ON vendor.vendor_address_details_id = vendor_address.vendor_address_id
      LEFT JOIN city ON vendor_address.vendor_address_city_id = city.city_id
      LEFT JOIN vendor_manpower_mapper ON vendor.vendor_category_details_id = vendor_manpower_mapper.vmm_id
      LEFT JOIN manpower_category ON vendor_manpower_mapper.vmm_category_id = manpower_category.mp_cat_id
      LEFT JOIN vendor_account_details ON vendor.vendor_account_details_id = vendor_account_details.vad_id
      LEFT JOIN vendor_professional_details ON vendor.vendor_professional_details_id = vendor_professional_details.vpd_id
      LEFT JOIN ambulance_category ON vendor.vendor_category_details_id = ambulance_category.ambulance_category_id
      LEFT JOIN vendor_work_location ON vendor.vendor_prefer_location_id = vendor_work_location.vwlp_id
      LEFT JOIN city AS work_location_city ON vendor_work_location.vwlp_city_id = work_location_city.city_id
      LEFT JOIN partner ON vendor.vendor_mp_partner_id != 0 AND vendor.vendor_mp_partner_id = partner.partner_id
      WHERE vendor.vendor_id = ?
    `;

    const [rows]: any = await db.query(query, [vendorId]);

    if (rows.length === 0) {
      throw new ApiError(404, "Vendor not found");
    }

    return {
      status: 200,
      message: "Vendor details fetched successfully",
      jsonData: rows[0],
    }

  } catch (error) {
    console.error("Error fetching vendor details:", error);
    throw new ApiError(500, "Failed to fetch vendor details");
  }

};