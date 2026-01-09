const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const db = require('./config/db'); 
const transactionRoutes = require('./routes/transactions');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// --- Routes ---
// Inside server.js
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // 1. Search the database for the user
        // Note: Your screenshot shows the column is 'password_hash'
        const [rows] = await db.query(
            "SELECT * FROM users WHERE username = ?", 
            [username]
        );

        if (rows.length === 0) {
            return res.status(401).json({ success: false, message: "User not found" });
        }

        const user = rows[0];

        // 2. Temporary Plain-Text Check (Matches your DB 'admin123')
        // In a real app, you'd use bcrypt.compare() here
        if (password === user.password_hash) {
            res.json({ 
                success: true, 
                token: 'secure_session_' + Date.now(), 
                role: 'ADMIN' 
            });
        } else {
            res.status(401).json({ success: false, message: "Invalid Credentials" });
        }

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: "Database error" });
    }
});

// --- 2. DASHBOARD SUMMARY ROUTE (Updated to include Transfers) ---
app.get('/api/dashboard/summary', async (req, res) => {
    try {
        // 1. Get total purchased items (Incoming)
        const [purchaseRes] = await db.query(
            "SELECT IFNULL(SUM(qty), 0) as total FROM transactions WHERE type = 'PURCHASE'"
        );
        
        // 2. Get total of everything leaving or being moved
        // UPDATED: Added 'TRANSFER' to the list so it updates the dashboard cards
        const [outgoingRes] = await db.query(
            "SELECT IFNULL(SUM(qty), 0) as total FROM transactions WHERE type IN ('ASSIGNMENT', 'EXPENDITURE', 'TRANSFER')"
        );

        // Convert strings to numbers safely
        const movement = Number(purchaseRes[0].total) || 0;
        const assigned = Number(outgoingRes[0].total) || 0;
        const openingBalance = 1000; // Your base starting point

        // Send the exact object the Dashboard.jsx is looking for
        res.json({
            opening: openingBalance,
            movement: movement,
            assigned: assigned,
            closing: (openingBalance + movement) - assigned
        });
        
        console.log(">>> Dashboard Sync Completed:", { movement, assigned });
    } catch (err) {
        console.error(">>> DASHBOARD ERROR:", err.message);
        res.status(500).json({ success: false, error: err.message });
    }
});

// IMPORTANT: This line makes all routes in transactions.js start with /api/transactions
app.use('/api/transactions', transactionRoutes);

const PORT = 5000;
db.getConnection().then(connection => {
    console.log('✅ Connected to MySQL');
    connection.release();
    app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));
}).catch(err => console.error('❌ DB Error', err.message));