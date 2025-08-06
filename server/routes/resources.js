const express = require('express');
const supabase = require('../config/supabase');
const authorize = require('../middleware/role');

const router = express.Router();

// GET /api/resources
// Returns all resources or filtered by category
router.get('/', async (req, res) => {
  const { category } = req.query;
  try {
    let query = supabase.from('resources').select('*');
    if (category) {
      query = query.eq('category', category);
    }
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return res.json(data);
  } catch (err) {
    console.error('Error fetching resources', err);
    return res.status(500).json({ message: 'Failed to fetch resources' });
  }
});

// POST /api/resources
// Admin adds a new resource
router.post('/', authorize('admin'), async (req, res) => {
  const { category, title, description, url } = req.body;
  if (!category || !title || !url) {
    return res.status(400).json({ message: 'Category, title and URL are required' });
  }
  try {
    const { data, error } = await supabase
      .from('resources')
      .insert({ category, title, description, url })
      .select('*')
      .single();
    if (error) throw error;
    return res.status(201).json(data);
  } catch (err) {
    console.error('Error adding resource', err);
    return res.status(500).json({ message: 'Failed to add resource' });
  }
});

module.exports = router;