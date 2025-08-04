import { useState } from 'react';
import { FiMail, FiPhone, FiGlobe, FiEdit2, FiCheck } from 'react-icons/fi';

const LeadCard = ({ lead, onStatusUpdate }) => {
  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState(lead.status);
  const [notes, setNotes] = useState(lead.notes || '');

  const statusColors = {
    new: 'bg-blue-500',
    contacted: 'bg-yellow-500',
    replied: 'bg-purple-500',
    booked: 'bg-green-500',
    no_answer: 'bg-red-500'
  };

  const handleSave = () => {
    onStatusUpdate(lead.id, status, notes);
    setEditing(false);
  };

  return (
    <div className="card">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold">{lead.company}</h3>
          <p className="text-gray-400">{lead.contact_name || 'No contact name'}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded text-xs text-white ${statusColors[lead.status]}`}>
            {lead.status.replace('_', ' ').toUpperCase()}
          </span>
          <button
            onClick={() => setEditing(!editing)}
            className="text-gray-400 hover:text-white"
          >
            {editing ? <FiCheck /> : <FiEdit2 />}
          </button>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        {lead.email && (
          <div className="flex items-center gap-2 text-gray-400">
            <FiMail /> {lead.email}
          </div>
        )}
        {lead.phone && (
          <div className="flex items-center gap-2 text-gray-400">
            <FiPhone /> {lead.phone}
          </div>
        )}
        {lead.website && (
          <div className="flex items-center gap-2 text-gray-400">
            <FiGlobe /> {lead.website}
          </div>
        )}
      </div>

      {editing && (
        <div className="mt-4 space-y-3">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-2 bg-byteblitz-dark border border-gray-700 rounded-lg focus:border-purple-500 focus:outline-none"
          >
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="replied">Replied</option>
            <option value="booked">Booked</option>
            <option value="no_answer">No Answer</option>
          </select>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add notes..."
            rows={3}
            className="w-full px-3 py-2 bg-byteblitz-dark border border-gray-700 rounded-lg focus:border-purple-500 focus:outline-none"
          />
          <button onClick={handleSave} className="btn-primary w-full">
            Save Changes
          </button>
        </div>
      )}

      {!editing && lead.notes && (
        <div className="mt-4 p-3 bg-byteblitz-dark rounded-lg">
          <p className="text-sm text-gray-400">{lead.notes}</p>
        </div>
      )}
    </div>
  );
};

export default LeadCard;
