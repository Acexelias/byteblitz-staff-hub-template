const express = require('express');
const supabase = require('../config/supabase');
const authorize = require('../middleware/role');

const router = express.Router();

// Utility: calculate commission (10% of sale amount, minimum £30)
function calculateCommission(amount) {
  const percentage = amount * 0.1;
  return percentage < 30 ? 30 : percentage;
}

// GET /api/bookings
// Returns bookings (admin sees all, rep sees their own)
router.get('/', async (req, res) => {
  try {
    let query = supabase.from('bookings').select('*');
    if (req.user.role !== 'admin') {
      query = query.eq('user_id', req.user.id);
    }
    const { data, error } = await query.order('meeting_date', { ascending: false });
    if (error) throw error;
    return res.json(data);
  } catch (err) {
    console.error('Error fetching bookings', err);
    return res.status(500).json({ message: 'Failed to fetch bookings' });
  }
});

// POST /api/bookings
// Create a new booking and commission record
router.post('/', async (req, res) => {
  const { client_name, meeting_date, sale_amount, user_id } = req.body;
  if (!client_name || !meeting_date || !sale_amount) {
    return res.status(400).json({ message: 'client_name, meeting_date and sale_amount are required' });
  }
  // Determine which rep gets credit: admin can specify; rep uses own id
  const repId = req.user.role === 'admin' && user_id ? user_id : req.user.id;
  // Viewers are read‑only and cannot create bookings
  if (req.user.role === 'viewer') {
    return res.status(403).json({ message: 'Viewers cannot create bookings' });
  }
  try {
    // Insert booking
    const { data: booking, error } = await supabase
      .from('bookings')
      .insert({ user_id: repId, client_name, meeting_date, sale_amount })
      .select('*')
      .single();
    if (error) throw error;
    // Calculate commission
    const commissionAmount = calculateCommission(parseFloat(sale_amount));
    // Insert commission
    const { data: commission, error: commErr } = await supabase
      .from('commissions')
      .insert({ booking_id: booking.id, user_id: repId, commission_amount: commissionAmount })
      .select('*')
      .single();
    if (commErr) throw commErr;
    return res.status(201).json({ booking, commission });
  } catch (err) {
    console.error('Error creating booking', err);
    return res.status(500).json({ message: 'Failed to create booking' });
  }
});

// GET /api/bookings/commissions
// Returns commission records (admin sees all, rep sees their own)
router.get('/commissions', async (req, res) => {
  try {
    let query = supabase.from('commissions').select('*');
    if (req.user.role !== 'admin') {
      query = query.eq('user_id', req.user.id);
    }
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return res.json(data);
  } catch (err) {
    console.error('Error fetching commissions', err);
    return res.status(500).json({ message: 'Failed to fetch commissions' });
  }
});

// PUT /api/bookings/commissions/:id/pay
// Admin marks a commission as paid
router.put('/commissions/:id/pay', authorize('admin'), async (req, res) => {
  const { id } = req.params;
  try {
    const { data, error } = await supabase
      .from('commissions')
      .update({ is_paid: true })
      .eq('id', id)
      .select('*')
      .single();
    if (error) throw error;
    return res.json(data);
  } catch (err) {
    console.error('Error marking commission as paid', err);
    return res.status(500).json({ message: 'Failed to update commission' });
  }
});

module.exports = router;