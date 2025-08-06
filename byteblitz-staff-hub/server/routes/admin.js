const express = require('express');
const bcrypt = require('bcryptjs');
const supabase = require('../config/supabase');
const authorize = require('../middleware/role');

const router = express.Router();

// Ensure only admins can access these routes
router.use(authorize('admin'));

// GET /api/admin/users
// List all users
router.get('/users', async (req, res) => {
  try {
    const { data, error } = await supabase.from('users').select('id, name, email, role, created_at');
    if (error) throw error;
    return res.json(data);
  } catch (err) {
    console.error('Error fetching users', err);
    return res.status(500).json({ message: 'Failed to fetch users' });
  }
});

// POST /api/admin/users
// Create a new user (admin or rep)
router.post('/users', async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'name, email, password and role are required' });
  }
  if (!['rep', 'admin'].includes(role)) {
    return res.status(400).json({ message: 'Role must be rep or admin' });
  }
  try {
    const { data: existing, error: fetchErr } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle();
    if (fetchErr) throw fetchErr;
    if (existing) {
      return res.status(409).json({ message: 'Email already exists' });
    }
    const hashed = await bcrypt.hash(password, 10);
    const { data: user, error } = await supabase
      .from('users')
      .insert({ name, email, password_hash: hashed, role })
      .select('id, name, email, role')
      .single();
    if (error) throw error;
    return res.status(201).json(user);
  } catch (err) {
    console.error('Error creating user', err);
    return res.status(500).json({ message: 'Failed to create user' });
  }
});

// DELETE /api/admin/users/:id
// Remove a user
router.delete('/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // Optionally: remove related leads/bookings.  For simplicity, just delete user.
    const { error } = await supabase.from('users').delete().eq('id', id);
    if (error) throw error;
    return res.json({ message: 'User deleted' });
  } catch (err) {
    console.error('Error deleting user', err);
    return res.status(500).json({ message: 'Failed to delete user' });
  }
});

// GET /api/admin/leads
// Return all leads
router.get('/leads', async (req, res) => {
  try {
    const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return res.json(data);
  } catch (err) {
    console.error('Error fetching leads', err);
    return res.status(500).json({ message: 'Failed to fetch leads' });
  }
});

// PUT /api/admin/commissions/:id
// Manually update commission amount or mark as paid
router.put('/commissions/:id', async (req, res) => {
  const { id } = req.params;
  const { commission_amount, is_paid } = req.body;
  try {
    const updateFields = {};
    if (commission_amount !== undefined) updateFields.commission_amount = commission_amount;
    if (is_paid !== undefined) updateFields.is_paid = is_paid;
    const { data, error } = await supabase
      .from('commissions')
      .update(updateFields)
      .eq('id', id)
      .select('*')
      .single();
    if (error) throw error;
    return res.json(data);
  } catch (err) {
    console.error('Error updating commission', err);
    return res.status(500).json({ message: 'Failed to update commission' });
  }
});

module.exports = router;