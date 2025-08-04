import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiSearch, FiDownload } from 'react-icons/fi';
import axios from 'axios';
import toast from 'react-hot-toast';
import LeadRequestModal from '../components/LeadRequestModal';
import LeadCard from '../components/LeadCard';

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showRequestModal, setShowRequestModal] = useState(false);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await axios.get('/leads');
      setLeads(response.data);
    } catch (error) {
      toast.error('Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (leadId, status, notes) => {
    try {
      await axios.patch(`/leads/${leadId}/status`, { status, notes });
      toast.success('Lead updated successfully');
      fetchLeads();
    } catch (error) {
      toast.error('Failed to update lead');
    }
  };

  const handleLeadRequest = async (data) => {
    try {
      await axios.post('/leads/request', data);
      toast.success('Lead request submitted!');
      setShowRequestModal(false);
    } catch (error) {
      toast.error('Failed to submit request');
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.contact_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || lead.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const exportLeads = () => {
    const csv = [
      ['Company', 'Contact', 'Email', 'Phone', 'Status', 'Notes'],
      ...filteredLeads.map(lead => [
        lead.company,
        lead.contact_name,
        lead.email,
        lead.phone,
        lead.status,
        lead.notes
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Leads</h1>
          <p className="text-gray-400 mt-2">Manage your assigned leads</p>
        </div>
        <button
          onClick={() => setShowRequestModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <FiPlus /> Request Leads
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-byteblitz-dark border border-gray-700 rounded-lg focus:border-purple-500 focus:outline-none"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-byteblitz-dark border border-gray-700 rounded-lg focus:border-purple-500 focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="replied">Replied</option>
            <option value="booked">Booked</option>
            <option value="no_answer">No Answer</option>
          </select>
          <button
            onClick={exportLeads}
            className="btn-secondary flex items-center gap-2"
          >
            <FiDownload /> Export
          </button>
        </div>
      </div>

      {/* Leads Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>
      ) : filteredLeads.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400">No leads found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredLeads.map((lead, index) => (
            <motion.div
              key={lead.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <LeadCard lead={lead} onStatusUpdate={handleStatusUpdate} />
            </motion.div>
          ))}
        </div>
      )}

      {/* Request Modal */}
      {showRequestModal && (
        <LeadRequestModal
          onClose={() => setShowRequestModal(false)}
          onSubmit={handleLeadRequest}
        />
      )}
    </div>
  );
};

export default Leads;
