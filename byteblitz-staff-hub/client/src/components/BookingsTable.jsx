import React from 'react';
import api from '../utils/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function BookingsTable({ bookings, commissions, refresh }) {
  const { user } = useAuth();
  const commissionsMap = {};
  commissions.forEach((c) => {
    commissionsMap[c.booking_id] = c;
  });

  const markPaid = async (commissionId) => {
    try {
      await api.put(`/bookings/commissions/${commissionId}/pay`);
      if (refresh) refresh();
    } catch (err) {
      console.error('Failed to mark commission as paid', err);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left text-xs uppercase tracking-wider text-text-dark/50">
            <th className="px-4 py-2">Client</th>
            <th className="px-4 py-2">Date</th>
            <th className="px-4 py-2">Sale (£)</th>
            <th className="px-4 py-2">Commission (£)</th>
            <th className="px-4 py-2">Paid</th>
            {user.role === 'admin' && <th className="px-4 py-2">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => {
            const commission = commissionsMap[booking.id];
            return (
              <tr key={booking.id} className="border-b border-bg-light/10">
                <td className="px-4 py-2">{booking.client_name}</td>
                <td className="px-4 py-2">{new Date(booking.meeting_date).toLocaleDateString()}</td>
                <td className="px-4 py-2">{Number(booking.sale_amount).toFixed(2)}</td>
                <td className="px-4 py-2">{commission ? Number(commission.commission_amount).toFixed(2) : '-'}</td>
                <td className="px-4 py-2">{commission ? (commission.is_paid ? 'Yes' : 'No') : '-'}</td>
                {user.role === 'admin' && (
                  <td className="px-4 py-2">
                    {commission && !commission.is_paid ? (
                      <button
                        onClick={() => markPaid(commission.id)}
                        className="text-sm text-white bg-primary-dark px-3 py-1 rounded hover:bg-primary"
                      >
                        Mark Paid
                      </button>
                    ) : (
                      <span className="text-xs text-text-dark/50">-</span>
                    )}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}