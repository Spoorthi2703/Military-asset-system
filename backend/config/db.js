const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 27798,
  ssl: {
    rejectUnauthorized: false
  },
  
  enableKeepAlive: true,
  dateStrings: true,
  connectTimeout: 20000 
});

module.exports = pool;
