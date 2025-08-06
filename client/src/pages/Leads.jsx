import React, { useEffect, useState } from 'react';
import api from '../utils/api.js';
import LeadsTable from '../components/LeadsTable.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Leads() {
  const { user } = useAuth();
  const [leads, setLeads] = useState([]);
  const [requestParams, setRequestParams] = useState({ industry: '', region: '', quantity: 1 });
  const [status, setStatus] = useState(null);

  const fetchLeads = async () => {
    try {
      const res = await api.get('/leads');
      setLeads(res.data);
    } catch (err) {
      console.error('Failed to fetch leads', err);
    }
  };
  useEffect(() => {
    fetchLeads();
  }, []);

  const requestLeads = async (e) => {
    e.preventDefault();
    setStatus(null);
    if (!requestParams.industry || !requestParams.region || !requestParams.quantity) return;
    try {
      await api.post('/leads/request', requestParams);
      setRequestParams({ industry: '', region: '', quantity: 1 });
      setStatus('Requested!');
      fetchLeads();
    } catch (err) {
      console.error('Failed to request leads', err);
      setStatus('Failed');
    }
  };

  return (
    <div className="space-y-8">
      {user.role === 'rep' && (
        <section>
          <h2 className="text-lg font-semibold mb-3">Request Leads</h2>
          <form onSubmit={requestLeads} className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-3xl">
            <input
              type="text"
              placeholder="Industry"
              className="bg-bg-dark border border-bg-light/20 rounded px-3 py-2"
              value={requestParams.industry}
              onChange={(e) => setRequestParams({ ...requestParams, industry: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Region"
              className="bg-bg-dark border border-bg-light/20 rounded px-3 py-2"
              value={requestParams.region}
              onChange={(e) => setRequestParams({ ...requestParams, region: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Quantity"
              className="bg-bg-dark border border-bg-light/20 rounded px-3 py-2"
              value={requestParams.quantity}
              onChange={(e) => setRequestParams({ ...requestParams, quantity: Number(e.target.value) })}
              min="1"
              required
            />
            <button
              type="submit"
              className="bg-primary-dark text-white px-4 py-2 rounded hover:bg-primary"
            >
              Request
            </button>
            {status && <p className="md:col-span-4 text-sm mt-2">{status}</p>}
          </form>
        </section>
      )}
      <section>
        <h2 className="text-lg font-semibold mb-3">Your Leads</h2>
        <LeadsTable leads={leads} refresh={fetchLeads} />
      </section>
    </div>
  );
}