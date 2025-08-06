const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const supabase = require('../config/supabase');
const authorize = require('../middleware/role');
const authenticate = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/register
// Admins can create new users.  Reps are always registered as role 'rep'.
router.post('/register', authenticate, authorize('admin'), async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email and password are required' });
  }
  // Accept additional roles beyond 'admin' and 'rep'. If an unknown role
  // is provided, default to 'rep'. Allowed roles include:
  //   - admin: full privileges
  //   - rep: standard sales rep
  //   - team_lead: manages a subset of reps and can post announcements
  //   - part_time: limited editing rights, similar to rep but cannot assign leads
  //   - viewer: read‑only access across the app
  const allowedRoles = ['admin', 'rep', 'team_lead', 'part_time', 'viewer'];
  let userRole = 'rep';
  if (role && allowedRoles.includes(role)) {
    userRole = role;
  }
  try {
    // Check if email already exists
    const { data: existing, error: fetchErr } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle();
    if (fetchErr) throw fetchErr;
    if (existing) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);
    // Insert user
    const { data: user, error } = await supabase
      .from('users')
      .insert({ name, email, password_hash: hashed, role: userRole })
      .select('*')
      .single();
    if (error) throw error;
    return res.json({ message: 'User created', user });
  } catch (err) {
    console.error('Error registering user', err);
    return res.status(500).json({ message: 'Failed to register user' });
  }
});

// POST /api/auth/login
// Authenticate a user and return JWT
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  try {
    // Find user by email
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle();
    if (error) throw error;
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    // Compare password
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    // Generate token
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '12h',
    });
    return res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error('Error logging in', err);
    return res.status(500).json({ message: 'Failed to login' });
  }
});

module.exports = router;