const express = require('express');
const supabase = require('../config/supabase');
const authorize = require('../middleware/role');

const router = express.Router();

// GET /api/support/messages
// Return the most recent announcement from Elias
router.get('/messages', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1);
    if (error) throw error;
    const message = data && data.length > 0 ? data[0] : null;
    return res.json(message);
  } catch (err) {
    console.error('Error fetching messages', err);
    return res.status(500).json({ message: 'Failed to fetch messages' });
  }
});

// POST /api/support/contact
// Create a support request from a rep
router.post('/contact', async (req, res) => {
  const { subject, body } = req.body;
  if (!subject || !body) {
    return res.status(400).json({ message: 'Subject and body are required' });
  }
  try {
    const { data, error } = await supabase
      .from('support_requests')
      .insert({ user_id: req.user.id, subject, body })
      .select('*')
      .single();
    if (error) throw error;
    return res.status(201).json(data);
  } catch (err) {
    console.error('Error creating support request', err);
    return res.status(500).json({ message: 'Failed to create support request' });
  }
});

// GET /api/support/requests
// Admin can view all support requests
router.get('/requests', authorize('admin'), async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('support_requests')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return res.json(data);
  } catch (err) {
    console.error('Error fetching support requests', err);
    return res.status(500).json({ message: 'Failed to fetch support requests' });
  }
});

// POST /api/support/announcement
// Admin posts a new message/announcement for the dashboard
router.post('/announcement', authorize('admin'), async (req, res) => {
  const { content } = req.body;
  if (!content) {
    return res.status(400).json({ message: 'Content is required' });
  }
  try {
    const { data, error } = await supabase
      .from('messages')
      .insert({ content })
      .select('*')
      .single();
    if (error) throw error;
    return res.status(201).json(data);
  } catch (err) {
    console.error('Error posting announcement', err);
    return res.status(500).json({ message: 'Failed to post announcement' });
  }
});

module.exports = router;