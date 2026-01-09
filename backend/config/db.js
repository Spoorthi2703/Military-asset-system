const mysql = require('mysql2/promise');
require('dotenv').config();

// This tells MySQL to use the long URI string you just pasted
const db = mysql.createPool({
    uri: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // This is required for Aiven's encrypted connection
    }
});

module.exports = db;