import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiCalendar, FiDollarSign, FiExternalLink } from 'react-icons/fi';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    leadsContacted: 0,
    bookingsMade: 0,
    commissionEarned: 0
  });
  const [announcement, setAnnouncement] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, announcementRes] = await Promise.all([
        axios.get('/dashboard/stats'),
        axios.get('/announcements/latest')
      ]);
      
      setStats(statsRes.data);
      setAnnouncement(announcementRes.data?.message || '');
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Leads Contacted',
      value: stats.leadsContacted,
      icon: FiUsers,
      color: 'from-purple-600 to-purple-800'
    },
    {
      title: 'Bookings Made',
      value: stats.bookingsMade,
      icon: FiCalendar,
      color: 'from-blue-600 to-blue-800'
    },
    {
      title: 'Commission Earned',
      value: `£${stats.commissionEarned}`,
      icon: FiDollarSign,
      color: 'from-green-600 to-green-800'
    }
  ];

  const tools = [
    { name: 'AI Assistant', url: 'https://ai.byteblitz.co.uk', description: 'Internal GPT helper' },
    { name: 'Automation Hub', url: 'https://n8n.byteblitz.co.uk', description: 'Workflow automation' },
    { name: 'Email Campaigns', url: 'https://mautic.byteblitz.co.uk', description: 'Marketing automation' },
    { name: 'CRM System', url: 'https://crm.byteblitz.co.uk', description: 'Client tracking' },
    { name: 'Lead Portal', url: 'https://leads.byteblitz.co.uk', description: 'Coming soon' },
    { name: 'Booking System', url: 'https://cal.byteblitz.co.uk', description: 'Schedule meetings' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {user?.name}!</h1>
        <p className="text-gray-400 mt-2">Here's your performance overview</p>
      </div>

      {/* Announcement */}
      {announcement && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-lg p-4"
        >
          <p className="text-sm font-medium text-purple-300">Message from Elias</p>
          <p className="mt-1">{announcement}</p>
        </motion.div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card"
          >
            <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center mb-4`}>
              <stat.icon size={24} />
            </div>
            <p className="text-gray-400 text-sm">{stat.title}</p>
            <p className="text-3xl font-bold mt-1">{loading ? '...' : stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool, index) => (
            <motion.a
              key={tool.name}
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="card hover:border-purple-500/50 group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold group-hover:text-purple-400 transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">{tool.description}</p>
                </div>
                <FiExternalLink className="text-gray-500 group-hover:text-purple-400 transition-colors" />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
