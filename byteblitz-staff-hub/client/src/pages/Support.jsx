import React, { useEffect, useState } from 'react';
import api from '../utils/api.js';
import SupportForm from '../components/SupportForm.jsx';

export default function Support() {
  const [message, setMessage] = useState(null);

  const fetchMessage = async () => {
    try {
      const res = await api.get('/support/messages');
      setMessage(res.data);
    } catch (err) {
      console.error('Failed to fetch message', err);
    }
  };
  useEffect(() => {
    fetchMessage();
  }, []);

  return (
    <div className="space-y-8">
      {message && (
        <div className="bg-primary-dark/30 border-l-4 border-primary-dark p-4 rounded">
          <p className="text-sm text-primary-dark font-medium">Message from Elias</p>
          <p className="mt-1 text-text-dark">{message.content}</p>
        </div>
      )}
      <div>
        <h2 className="text-lg font-semibold mb-3">Contact Elias</h2>
        <p className="text-sm mb-2">For urgent matters call <strong>07359 735508</strong> or send a message below.</p>
        <SupportForm />
      </div>
    </div>
  );
}