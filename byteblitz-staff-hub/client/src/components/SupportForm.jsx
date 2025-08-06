import React, { useState } from 'react';
import api from '../utils/api.js';

export default function SupportForm() {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject || !body) return;
    try {
      await api.post('/support/contact', { subject, body });
      setStatus('Sent!');
      setSubject('');
      setBody('');
    } catch (err) {
      setStatus('Failed to send');
      console.error('Failed to send support request', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
      <div>
        <label className="block text-sm mb-1" htmlFor="subject">Subject</label>
        <input
          id="subject"
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full bg-bg-dark border border-bg-light/20 rounded px-3 py-2 text-text-dark"
          required
        />
      </div>
      <div>
        <label className="block text-sm mb-1" htmlFor="body">Message</label>
        <textarea
          id="body"
          rows="4"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="w-full bg-bg-dark border border-bg-light/20 rounded px-3 py-2 text-text-dark"
          required
        ></textarea>
      </div>
      <button
        type="submit"
        className="bg-primary-dark text-white px-4 py-2 rounded hover:bg-primary"
      >
        Send
      </button>
      {status && <p className="text-sm mt-2">{status}</p>}
    </form>
  );
}