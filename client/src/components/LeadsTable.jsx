import React, { useState } from 'react';
import api from '../utils/api.js';
import { useAuth } from '../context/AuthContext.jsx';

const STATUS_OPTIONS = ['New', 'Contacted', 'Replied', 'Booked', 'No Answer', 'Requested', 'Assigned'];

export default function LeadsTable({ leads, refresh }) {
  const { user } = useAuth();
  const [updatingId, setUpdatingId] = useState(null);

  const handleChange = async (leadId, field, value) => {
    setUpdatingId(leadId);
    try {
      const payload = { [field]: value };
      await api.post(`/leads/${leadId}/update`, payload);
      if (refresh) refresh();
    } catch (err) {
      console.error('Failed to update lead', err);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left text-xs uppercase tracking-wider text-text-dark/50">
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Contact</th>
            <th className="px-4 py-2">Industry</th>
            <th className="px-4 py-2">Region</th>
            <th className="px-4 py-2">Qty</th>
            <th className="px-4 py-2">Status</th>
            {user.role === 'admin' && <th className="px-4 py-2">Assigned To</th>}
            <th className="px-4 py-2">Notes</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id} className="border-b border-bg-light/10">
              <td className="px-4 py-2">{lead.name || '-'}</td>
              <td className="px-4 py-2">{lead.contact || '-'}</td>
              <td className="px-4 py-2">{lead.industry || '-'}</td>
              <td className="px-4 py-2">{lead.region || '-'}</td>
              <td className="px-4 py-2">{lead.quantity || '-'}</td>
              <td className="px-4 py-2">
                <select
                  value={lead.status}
                  className="bg-bg-dark border border-bg-light/20 rounded px-2 py-1 text-sm focus:outline-none"
                  onChange={(e) => handleChange(lead.id, 'status', e.target.value)}
                  disabled={updatingId === lead.id}
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </td>
              {user.role === 'admin' && <td className="px-4 py-2">{lead.assigned_to || '-'}</td>}
              <td className="px-4 py-2">
                <input
                  type="text"
                  defaultValue={lead.notes || ''}
                  className="bg-bg-dark border border-bg-light/20 rounded px-2 py-1 text-sm w-full"
                  onBlur={(e) => handleChange(lead.id, 'notes', e.target.value)}
                  disabled={updatingId === lead.id}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}