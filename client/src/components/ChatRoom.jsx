import React, { useEffect, useState, useRef } from 'react';
import api from '../utils/api.js';
import { useAuth } from '../context/AuthContext.jsx';

/**
 * ChatRoom implements a simple polling based chat interface. It
 * periodically fetches the latest messages from the server and
 * allows the user to post new messages. Messages are displayed
 * chronologically with the sender name when available.
 */
export default function ChatRoom() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState(null);
  const bottomRef = useRef(null);

  const fetchMessages = async () => {
    try {
      const res = await api.get('/chat/messages');
      setMessages(res.data || []);
    } catch (err) {
      console.error('Failed to fetch messages', err);
    }
  };
  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    setStatus(null);
    const content = input.trim();
    if (!content) return;
    try {
      await api.post('/chat/messages', { content });
      setInput('');
      fetchMessages();
    } catch (err) {
      console.error('Failed to send message', err);
      setStatus('Failed to send');
    }
  };

  return (
    <div className="flex flex-col h-[60vh] max-h-[60vh] border border-bg-light/20 rounded">
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-bg-dark">
        {messages.map((m) => (
          <div key={m.id} className="flex flex-col">
            <span className="text-xs text-text-dark/60 mb-1">
              {m.user_id === user.id ? 'You' : m.user_id}
            </span>
            <span className="bg-bg-light/10 px-3 py-2 rounded text-sm text-text-dark max-w-prose">
              {m.content}
            </span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={sendMessage} className="flex p-3 border-t border-bg-light/20 bg-bg-dark">
        <input
          type="text"
          className="flex-1 bg-bg-dark border border-bg-light/20 rounded px-3 py-2 text-text-dark"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          type="submit"
          className="ml-2 bg-primary-dark text-white px-4 py-2 rounded hover:bg-primary"
        >
          Send
        </button>
      </form>
      {status && <p className="text-sm p-2">{status}</p>}
    </div>
  );
}