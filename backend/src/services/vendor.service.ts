import { db } from '../config/db';
import { ApiError } from '../utils/api-error';
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
    let query = `
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
        manpower_category.mp_cat_name
      FROM vendor
      LEFT JOIN vendor_address ON vendor.vendor_address_details_id = vendor_address.vendor_address_id
      LEFT JOIN city ON vendor_address.vendor_address_city_id = city.city_id
      LEFT JOIN vendor_manpower_mapper ON vendor.vendor_category_details_id = vendor_manpower_mapper.vmm_id
      LEFT JOIN manpower_category ON vendor_manpower_mapper.vmm_category_id = manpower_category.mp_cat_id
      WHERE 1=1
    `;

    const params: any[] = [];

    if (filters?.date) {
      query += " AND DATE(vendor.vendor_created_at) = ?";
      params.push(filters.date);
    }

    if (filters?.fromDate && filters?.toDate) {
      query += " AND DATE(vendor.vendor_created_at) BETWEEN ? AND ?";
      params.push(filters.fromDate, filters.toDate);
    }

    if (filters?.status) {
      query += " AND vendor.vendor_status = ?";
      params.push(filters.status);
    }

    const page = filters?.page && filters.page > 0 ? filters.page : 1;
    const limit = filters?.limit && filters.limit > 0 ? filters.limit : 12;
    const offset = (page - 1) * limit;

    // --- Count total ---
    const countQuery = `
      SELECT COUNT(*) as total
      FROM vendor
      WHERE 1=1
      ${filters?.date ? " AND DATE(vendor.vendor_created_at) = ?" : ""}
      ${filters?.fromDate && filters?.toDate ? " AND DATE(vendor.vendor_created_at) BETWEEN ? AND ?" : ""}
      ${filters?.status ? " AND vendor.vendor_status = ?" : ""}
    `;

    const [countRows]: any = await db.query(countQuery, params);
    const total = countRows?.[0]?.total || 0;

    // --- Pagination ---
    query += " ORDER BY vendor.vendor_created_at DESC LIMIT ? OFFSET ?";
    params.push(limit, offset);

    const [rows] = await db.query(query, params);

    // ✅ Return success even if no vendors
    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      vendors: rows || [],
    };
  } catch (error) {
    console.error("Error fetching vendor list:", error);
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
        manpower_category.mp_cat_name
      FROM vendor
      LEFT JOIN vendor_address ON vendor.vendor_address_details_id = vendor_address.vendor_address_id
      LEFT JOIN city ON vendor_address.vendor_address_city_id = city.city_id
      LEFT JOIN vendor_manpower_mapper ON vendor.vendor_category_details_id = vendor_manpower_mapper.vmm_id
      LEFT JOIN manpower_category ON vendor_manpower_mapper.vmm_category_id = manpower_category.mp_cat_id
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