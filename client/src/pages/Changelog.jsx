import React, { useEffect, useState } from 'react';
import api from '../utils/api.js';
import { useAuth } from '../context/AuthContext.jsx';

/**
 * Changelog page
 *
 * Displays a list of bulletin entries (task updates, feature
 * releases, etc.) in reverse chronological order. Admins and
 * team leads can add new entries via the form at the top.
 */
export default function Changelog() {
  const { user } = useAuth();
  const [entries, setEntries] = useState([]);
  const [newEntry, setNewEntry] = useState({ title: '', description: '' });
  const [status, setStatus] = useState(null);

  const fetchEntries = async () => {
    try {
      const res = await api.get('/changelog');
      setEntries(res.data || []);
    } catch (err) {
      console.error('Failed to fetch changelog entries', err);
    }
  };
  useEffect(() => {
    fetchEntries();
  }, []);

  const addEntry = async (e) => {
    e.preventDefault();
    setStatus(null);
    if (!newEntry.title || !newEntry.description) return;
    try {
      await api.post('/changelog', newEntry);
      setNewEntry({ title: '', description: '' });
      setStatus('Posted');
      fetchEntries();
    } catch (err) {
      console.error('Failed to post entry', err);
      setStatus('Failed');
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-lg font-semibold mb-2">Staff Bulletin</h2>
      {(user.role === 'admin' || user.role === 'team_lead') && (
        <form onSubmit={addEntry} className="space-y-3 max-w-2xl">
          <input
            type="text"
            placeholder="Title"
            className="w-full bg-bg-dark border border-bg-light/20 rounded px-3 py-2"
            value={newEntry.title}
            onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
            required
          />
          <textarea
            placeholder="Description"
            rows="3"
            className="w-full bg-bg-dark border border-bg-light/20 rounded px-3 py-2"
            value={newEntry.description}
            onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })}
            required
          />
          <button
            type="submit"
            className="bg-primary-dark text-white px-4 py-2 rounded hover:bg-primary"
          >
            Post
          </button>
          {status && <p className="text-sm mt-1">{status}</p>}
        </form>
      )}
      <div className="space-y-4">
        {entries.length === 0 ? (
          <p className="text-sm text-text-dark/60">No entries yet.</p>
        ) : (
          entries.map((entry) => (
            <div key={entry.id} className="bg-bg-dark border border-bg-light/20 rounded p-4">
              <h3 className="font-medium text-text-dark">{entry.title}</h3>
              <p className="text-sm text-text-dark/80 mt-1 whitespace-pre-line">{entry.description}</p>
              <p className="text-xs text-text-dark/50 mt-2">{new Date(entry.created_at).toLocaleString()}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}