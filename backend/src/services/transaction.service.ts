import { db } from "../config/db";
import { ApiError } from "../utils/api-error";
import path from "path";
import fs from "fs";
import { RowDataPacket, FieldPacket } from "mysql2";

export const getConsumerTransactionList = async () => {
    try {
        const query = `
            SELECT consumer_transection.*
            FROM consumer_transection 
            ORDER BY consumer_transection.consumer_transection_id DESC        
        `;

        const [rows]: [RowDataPacket[], FieldPacket[]] = await db.query(query);

        if (rows.length === 0 || !rows) {
            throw new ApiError(404, "No consumer transactions found");
        }

        return {
            transactions: rows,
        };
    } catch (error) {
        throw new ApiError(500, "Failed to fetch consumer transaction list");
    }
}

export const getVendorTransactionList = async () => {
    try {
        const query = `
            SELECT vendor_transection.*
            FROM vendor_transection 
            ORDER BY vendor_transection.vendor_transection_id DESC        
        `;

        const [rows]: [RowDataPacket[], FieldPacket[]] = await db.query(query);

        if (rows.length === 0 || !rows) {
            throw new ApiError(404, "No vendor transactions found");
        }

        return {
            transactions: rows,
        };
    } catch (error) {
        throw new ApiError(500, "Failed to fetch vendor transaction list");
    }
}