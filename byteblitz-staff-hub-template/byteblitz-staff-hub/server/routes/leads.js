const express = require('express');
const db = require('../config/db');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

// Get leads for current user
router.get('/', authMiddleware, async (req, res) => {
    try {
        const query = req.user.role === 'admin' 
            ? 'SELECT l.*, u.name as assigned_to_name FROM leads l LEFT JOIN users u ON l.assigned_to = u.id ORDER BY l.created_at DESC'
            : 'SELECT * FROM leads WHERE assigned_to = $1 ORDER BY created_at DESC';
        
        const params = req.user.role === 'admin' ? [] : [req.user.id];
        const result = await db.query(query, params);
        
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Request leads
router.post('/request', authMiddleware, async (req, res) => {
    const { industry, region, quantity } = req.body;
    
    try {
        const result = await db.query(
            'INSERT INTO lead_requests (user_id, industry, region, quantity) VALUES ($1, $2, $3, $4) RETURNING *',
            [req.user.id, industry, region, quantity]
        );
        
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update lead status
router.patch('/:id/status', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { status, notes } = req.body;
    
    try {
        const result = await db.query(
            'UPDATE leads SET status = $1, notes = $2, updated_at = NOW() WHERE id = $3 AND assigned_to = $4 RETURNING *',
            [status, notes, id, req.user.id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Lead not found or not assigned to you' });
        }
        
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Assign lead (admin only)
router.post('/:id/assign', authMiddleware, adminMiddleware, async (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;
    
    try {
        const result = await db.query(
            'UPDATE leads SET assigned_to = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
            [userId, id]
        );
        
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
