const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/history/:type', async (req, res) => {
    try {
        const { type } = req.params;
        const [rows] = await db.query(
            `SELECT t.*, a.name as asset_name 
             FROM transactions t 
             JOIN assets a ON t.asset_id = a.id 
             WHERE t.type = ? 
             ORDER BY t.created_at DESC`, 
            [type]
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.post('/purchase', async (req, res) => {
    const { asset_id, qty } = req.body;
    try {
        await db.query("INSERT INTO transactions (asset_id, qty, type) VALUES (?, ?, 'PURCHASE')", [asset_id, qty]);
        await db.query(
            `INSERT INTO inventory (base_id, asset_id, quantity) VALUES (1, ?, ?) 
             ON DUPLICATE KEY UPDATE quantity = quantity + ?`, 
            [asset_id, qty, qty]
        );
        res.json({ success: true, message: "Purchase logged" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

router.post('/transfer', async (req, res) => {
    const { asset_id, from_base_id, to_base_id, qty } = req.body;
    try {
        await db.query(
            "INSERT INTO transactions (asset_id, from_base_id, to_base_id, qty, type) VALUES (?, ?, ?, ?, 'TRANSFER')",
            [asset_id, from_base_id, to_base_id, qty]
        );
        await db.query("UPDATE inventory SET quantity = quantity - ? WHERE base_id = ? AND asset_id = ?", [qty, from_base_id, asset_id]);
        await db.query(
            "INSERT INTO inventory (base_id, asset_id, quantity) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE quantity = quantity + ?",
            [to_base_id, asset_id, qty, qty]
        );
        res.json({ success: true, message: "Transfer completed" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

router.post('/assign', async (req, res) => {
    const { asset_id, qty, type, personnel_name } = req.body;
    try {
        await db.query(
            "INSERT INTO transactions (asset_id, qty, type, personnel_name) VALUES (?, ?, ?, ?)",
            [asset_id, qty, type, personnel_name || null]
        );
        await db.query(
            "UPDATE inventory SET quantity = quantity - ? WHERE asset_id = ? AND base_id = 1",
            [qty, asset_id]
        );
        res.json({ success: true, message: "Assignment/Expenditure logged" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
