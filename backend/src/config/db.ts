import mysql from "mysql2";
require("dotenv").config();

export const db = mysql
  .createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "",
    database: process.env.DB_NAME || "medcabdb",
  })
  .promise(); // ✅ Works perfectly with async/await

console.log("✅ MySQL Pool connected");
