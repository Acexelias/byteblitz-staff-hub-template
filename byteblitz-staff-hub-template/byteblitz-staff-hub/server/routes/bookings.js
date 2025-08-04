const express = require('express');
const db = require('../config/db');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Get user's bookings
router.get('/', authMiddleware, async (req, res) => {
  try {
    const query = req.user.role === 'admin'
      ? 'SELECT b.*, u.name as user_name FROM bookings b JOIN users u ON b.user_id = u.id ORDER BY b.created_at DESC'
      : 'SELECT * FROM bookings WHERE user_id = $1 ORDER BY created_at DESC';
    
    const params = req.user.role === 'admin' ? [] : [req.user.id];
    const result = await db.query(query, params);
    
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create booking
router.post('/', authMiddleware, async (req, res) => {
  const { lead_id, client_name, booking_date, sale_amount } = req.body;
  const commission_amount = Math.max(sale_amount * 0.1, 30); // 10% with £30 minimum
  
  try {
    const result = await db.query(
      `INSERT INTO bookings (user_id, lead_id, client_name, booking_date, sale_amount, commission_amount) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [req.user.id, lead_id, client_name, booking_date, sale_amount, commission_amount]
    );
    
    // Create commission record
    await db.query(
      'INSERT INTO commissions (user_id, booking_id, amount) VALUES ($1, $2, $3)',
      [req.user.id, result.rows[0].id, commission_amount]
    );
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
