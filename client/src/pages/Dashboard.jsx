import React, { useEffect, useState } from 'react';
import StatsCard from '../components/StatsCard.jsx';
import ChartDashboard from '../components/ChartDashboard.jsx';
import api from '../utils/api.js';

export default function Dashboard() {
  const [metrics, setMetrics] = useState({ leadsContacted: 0, bookingsMade: 0, commission: 0 });
  const [message, setMessage] = useState(null);

  const fetchData = async () => {
    try {
      const [leadsRes, bookingsRes, commissionsRes, messageRes] = await Promise.all([
        api.get('/leads'),
        api.get('/bookings'),
        api.get('/bookings/commissions'),
        api.get('/support/messages'),
      ]);
      const leads = leadsRes.data;
      const bookings = bookingsRes.data;
      const commissions = commissionsRes.data;
      // Count leads contacted (status not New or Requested or Assigned)
      const contactedCount = leads.filter((l) => ['Contacted', 'Replied', 'Booked', 'No Answer'].includes(l.status)).length;
      const bookingsCount = bookings.length;
      let commissionTotal = 0;
      commissions.forEach((c) => {
        commissionTotal += parseFloat(c.commission_amount || 0);
      });
      setMetrics({ leadsContacted: contactedCount, bookingsMade: bookingsCount, commission: commissionTotal.toFixed(2) });
      setMessage(messageRes.data);
    } catch (err) {
      console.error('Failed to fetch dashboard data', err);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const tools = [
    { name: 'AI Assistant', url: 'https://ai.byteblitz.co.uk' },
    { name: 'n8n Automations', url: 'https://n8n.byteblitz.co.uk' },
    { name: 'Mautic Campaigns', url: 'https://mautic.byteblitz.co.uk' },
    { name: 'EspoCRM', url: 'https://crm.byteblitz.co.uk' },
    { name: 'Lead Hub', url: 'https://leads.byteblitz.co.uk' },
    { name: 'Booking System', url: 'https://cal.byteblitz.co.uk' },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard title="Leads Contacted" value={metrics.leadsContacted} />
        <StatsCard title="Bookings Made" value={metrics.bookingsMade} />
        <StatsCard title="Commission (£)" value={metrics.commission} />
      </div>
      {message && (
        <div className="bg-primary-dark/30 border-l-4 border-primary-dark p-4 rounded">
          <p className="text-sm text-primary-dark font-medium">Message from Elias</p>
          <p className="mt-1 text-text-dark">{message.content}</p>
        </div>
      )}

      {/* Charts section */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Performance Overview</h2>
        <ChartDashboard />
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-3">Quick Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tools.map((tool) => (
            <a
              key={tool.name}
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-bg-dark border border-bg-light/20 rounded p-4 hover:border-primary transition-colors duration-200"
            >
              {tool.name}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}