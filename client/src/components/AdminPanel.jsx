import React, { useEffect, useState } from 'react';
import api from '../utils/api.js';

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [leads, setLeads] = useState([]);
  const [supportRequests, setSupportRequests] = useState([]);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'rep' });
  const [announcement, setAnnouncement] = useState('');
  const fetchData = async () => {
    try {
      const [usersRes, leadsRes, supportRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/leads'),
        api.get('/support/requests'),
      ]);
      setUsers(usersRes.data);
      setLeads(leadsRes.data.filter((l) => l.status === 'Requested'));
      setSupportRequests(supportRes.data);
    } catch (err) {
      console.error('Failed to fetch admin data', err);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const createUser = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/users', newUser);
      setNewUser({ name: '', email: '', password: '', role: 'rep' });
      fetchData();
    } catch (err) {
      console.error('Failed to create user', err);
    }
  };

  const deleteUser = async (id) => {
    try {
      await api.delete(`/admin/users/${id}`);
      fetchData();
    } catch (err) {
      console.error('Failed to delete user', err);
    }
  };

  const postAnnouncement = async () => {
    if (!announcement) return;
    try {
      await api.post('/support/announcement', { content: announcement });
      setAnnouncement('');
      alert('Announcement posted');
    } catch (err) {
      console.error('Failed to post announcement', err);
    }
  };

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-semibold mb-4">Create User</h2>
        <form onSubmit={createUser} className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
          <input
            type="text"
            placeholder="Name"
            className="bg-bg-dark border border-bg-light/20 rounded px-3 py-2"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="bg-bg-dark border border-bg-light/20 rounded px-3 py-2"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="bg-bg-dark border border-bg-light/20 rounded px-3 py-2"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            required
          />
          <select
            className="bg-bg-dark border border-bg-light/20 rounded px-3 py-2"
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
          >
            <option value="rep">Sales Rep</option>
            <option value="admin">Admin</option>
          </select>
          <button
            type="submit"
            className="bg-primary-dark text-white px-4 py-2 rounded hover:bg-primary md:col-span-2"
          >
            Add User
          </button>
        </form>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-4">Users</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-text-dark/50">
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Role</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-bg-light/10">
                  <td className="px-4 py-2">{u.name}</td>
                  <td className="px-4 py-2">{u.email}</td>
                  <td className="px-4 py-2">{u.role}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => deleteUser(u.id)}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-4">Lead Requests</h2>
        {leads.length === 0 ? (
          <p className="text-sm text-text-dark/60">No lead requests pending.</p>
        ) : (
          <ul className="space-y-2">
            {leads.map((lead) => (
              <li key={lead.id} className="border border-bg-light/20 rounded p-3">
                <p className="font-medium">{lead.industry} / {lead.region} - {lead.quantity}</p>
                <p className="text-xs text-text-dark/60">Requested by: {lead.requested_by}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-4">Support Requests</h2>
        {supportRequests.length === 0 ? (
          <p className="text-sm text-text-dark/60">No support messages.</p>
        ) : (
          <ul className="space-y-2">
            {supportRequests.map((sr) => (
              <li key={sr.id} className="border border-bg-light/20 rounded p-3">
                <p className="font-medium">{sr.subject}</p>
                <p className="text-xs text-text-dark/60">{sr.body}</p>
                <p className="text-xs text-text-dark/40 mt-1">From: {sr.user_id} on {new Date(sr.created_at).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-4">Post Announcement</h2>
        <div className="flex flex-col md:flex-row gap-4 max-w-2xl">
          <input
            type="text"
            placeholder="Announcement message"
            className="flex-1 bg-bg-dark border border-bg-light/20 rounded px-3 py-2"
            value={announcement}
            onChange={(e) => setAnnouncement(e.target.value)}
          />
          <button
            onClick={postAnnouncement}
            className="bg-primary-dark text-white px-4 py-2 rounded hover:bg-primary"
          >
            Post
          </button>
        </div>
      </section>
    </div>
  );
}