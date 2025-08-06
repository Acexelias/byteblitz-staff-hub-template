const express = require('express');
const supabase = require('../config/supabase');
const authorize = require('../middleware/role');

const router = express.Router();

// GET /api/leads
// Admins see all leads; reps see leads assigned to or requested by them.
router.get('/', async (req, res) => {
  try {
    let query = supabase.from('leads').select('*');
    if (req.user.role !== 'admin') {
      query = query.or(`assigned_to.eq.${req.user.id},requested_by.eq.${req.user.id}`);
    }
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return res.json(data);
  } catch (err) {
    console.error('Error fetching leads', err);
    return res.status(500).json({ message: 'Failed to fetch leads' });
  }
});

// POST /api/leads/request
// Request new leads (industry, region, quantity).  Creates a placeholder
// record indicating the request.  Admins will allocate real leads later.
router.post('/request', async (req, res) => {
  const { industry, region, quantity } = req.body;
  if (!industry || !region || !quantity) {
    return res.status(400).json({ message: 'Industry, region and quantity are required' });
  }
  // Viewers are read‑only users and cannot request leads
  if (req.user.role === 'viewer') {
    return res.status(403).json({ message: 'Viewers cannot request leads' });
  }
  try {
    const { data, error } = await supabase
      .from('leads')
      .insert({
        name: 'Lead request',
        contact: null,
        industry,
        region,
        quantity,
        status: 'Requested',
        requested_by: req.user.id,
      })
      .select('*')
      .single();
    if (error) throw error;
    return res.status(201).json(data);
  } catch (err) {
    console.error('Error requesting leads', err);
    return res.status(500).json({ message: 'Failed to request leads' });
  }
});

// POST /api/leads/assign
// Admin assigns one or more leads to a rep.  Expects { leadIds: [], userId }
router.post('/assign', authorize('admin'), async (req, res) => {
  const { leadIds, userId } = req.body;
  if (!Array.isArray(leadIds) || !userId) {
    return res.status(400).json({ message: 'leadIds array and userId are required' });
  }
  try {
    const updates = leadIds.map((id) => {
      return supabase
        .from('leads')
        .update({ assigned_to: userId, status: 'Assigned' })
        .eq('id', id);
    });
    const results = await Promise.all(updates);
    // Check for errors
    for (const r of results) {
      if (r.error) throw r.error;
    }
    return res.json({ message: 'Leads assigned' });
  } catch (err) {
    console.error('Error assigning leads', err);
    return res.status(500).json({ message: 'Failed to assign leads' });
  }
});

// POST /api/leads/:id/update
// Update lead status, notes or tags.  Only assigned rep or admin can update.
router.post('/:id/update', async (req, res) => {
  const { id } = req.params;
  const { status, notes, tags } = req.body;
  try {
    // Fetch lead to check permission
    const { data: lead, error } = await supabase
      .from('leads')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    // Only admin or the assigned rep can update
    // Viewers cannot update leads under any circumstances
    if (req.user.role === 'viewer') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    if (req.user.role !== 'admin' && lead.assigned_to !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    // Build update object
    const updateFields = {};
    if (status) updateFields.status = status;
    if (notes !== undefined) updateFields.notes = notes;
    if (tags !== undefined) updateFields.tags = tags;
    const { data: updated, error: updateErr } = await supabase
      .from('leads')
      .update(updateFields)
      .eq('id', id)
      .select('*')
      .single();
    if (updateErr) throw updateErr;
    return res.json(updated);
  } catch (err) {
    console.error('Error updating lead', err);
    return res.status(500).json({ message: 'Failed to update lead' });
  }
});

module.exports = router;