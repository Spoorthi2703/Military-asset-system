const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const db = require('./config/db'); 
const transactionRoutes = require('./routes/transactions');
require('dotenv').config();

const app = express();

app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Military Asset Backend is Running 🚀');
});

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const [rows] = await db.query(
            "SELECT * FROM users WHERE username = ?", 
            [username]
        );

        if (rows.length === 0) {
            return res.status(401).json({ success: false, message: "User not found" });
        }

        const user = rows[0];

        if (password === user.password_hash) {
            const token = jwt.sign(
                { id: user.id, role: user.role }, 
                process.env.JWT_SECRET || 'fallback_secret', 
                { expiresIn: '24h' }
            );

            res.json({ 
                success: true, 
                token: token, 
                role: user.role || 'ADMIN' 
            });
        } else {
            res.status(401).json({ success: false, message: "Invalid Credentials" });
        }

    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ success: false, error: "Database error during login" });
    }
});

app.get('/api/dashboard/summary', async (req, res) => {
    try {
        const [purchaseRes] = await db.query(
            "SELECT IFNULL(SUM(qty), 0) as total FROM transactions WHERE type = 'PURCHASE'"
        );
        
        const [outgoingRes] = await db.query(
            "SELECT IFNULL(SUM(qty), 0) as total FROM transactions WHERE type IN ('ASSIGNMENT', 'EXPENDITURE', 'TRANSFER')"
        );

        const movement = Number(purchaseRes[0].total) || 0;
        const assigned = Number(outgoingRes[0].total) || 0;
        const openingBalance = 1000; 

        res.json({
            opening: openingBalance,
            movement: movement,
            assigned: assigned,
            closing: (openingBalance + movement) - assigned
        });
        
    } catch (err) {
        console.error(">>> DASHBOARD ERROR:", err.message);
        res.status(500).json({ success: false, error: err.message });
    }
});

app.use('/api/transactions', transactionRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server live on port ${PORT}`);
});
