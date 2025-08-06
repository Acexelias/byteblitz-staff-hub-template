import React, { useEffect, useState } from 'react';
import api from '../utils/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import BookingsTable from '../components/BookingsTable.jsx';

export default function Bookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [commissions, setCommissions] = useState([]);
  const [newBooking, setNewBooking] = useState({ client_name: '', meeting_date: '', sale_amount: '' });
  const [status, setStatus] = useState(null);

  const fetchData = async () => {
    try {
      const [bookingsRes, commissionsRes] = await Promise.all([
        api.get('/bookings'),
        api.get('/bookings/commissions'),
      ]);
      setBookings(bookingsRes.data);
      setCommissions(commissionsRes.data);
    } catch (err) {
      console.error('Failed to fetch bookings data', err);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const addBooking = async (e) => {
    e.preventDefault();
    setStatus(null);
    try {
      const payload = { ...newBooking };
      if (user.role === 'admin' && newBooking.user_id) {
        payload.user_id = newBooking.user_id;
      }
      await api.post('/bookings', payload);
      setNewBooking({ client_name: '', meeting_date: '', sale_amount: '', user_id: '' });
      setStatus('Booking added');
      fetchData();
    } catch (err) {
      console.error('Failed to add booking', err);
      setStatus('Failed');
    }
  };

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-lg font-semibold mb-3">Add Booking</h2>
        <form onSubmit={addBooking} className="grid grid-cols-1 md:grid-cols-5 gap-4 max-w-full md:max-w-none">
          <input
            type="text"
            placeholder="Client Name"
            className="bg-bg-dark border border-bg-light/20 rounded px-3 py-2"
            value={newBooking.client_name}
            onChange={(e) => setNewBooking({ ...newBooking, client_name: e.target.value })}
            required
          />
          <input
            type="date"
            className="bg-bg-dark border border-bg-light/20 rounded px-3 py-2"
            value={newBooking.meeting_date}
            onChange={(e) => setNewBooking({ ...newBooking, meeting_date: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Sale Amount (£)"
            className="bg-bg-dark border border-bg-light/20 rounded px-3 py-2"
            value={newBooking.sale_amount}
            onChange={(e) => setNewBooking({ ...newBooking, sale_amount: e.target.value })}
            required
          />
          {user.role === 'admin' && (
            <input
              type="text"
              placeholder="Rep ID (optional)"
              className="bg-bg-dark border border-bg-light/20 rounded px-3 py-2"
              value={newBooking.user_id || ''}
              onChange={(e) => setNewBooking({ ...newBooking, user_id: e.target.value })}
            />
          )}
          <button
            type="submit"
            className="bg-primary-dark text-white px-4 py-2 rounded hover:bg-primary"
          >
            Add
          </button>
        </form>
        {status && <p className="text-sm mt-2">{status}</p>}
      </section>
      <section>
        <h2 className="text-lg font-semibold mb-3">Bookings & Commissions</h2>
        <BookingsTable bookings={bookings} commissions={commissions} refresh={fetchData} />
      </section>
    </div>
  );
}