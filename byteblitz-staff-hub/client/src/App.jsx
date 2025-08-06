import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import Sidebar from './components/Sidebar.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Leads from './pages/Leads.jsx';
import Resources from './pages/Resources.jsx';
import Bookings from './pages/Bookings.jsx';
import Support from './pages/Support.jsx';
import Admin from './pages/Admin.jsx';
import Login from './pages/Login.jsx';

export default function App() {
  const { user } = useAuth();

  if (!user) {
    return <Login />;
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-4 md:p-8 bg-bg-dark min-h-screen text-text-dark">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/support" element={<Support />} />
          {user.role === 'admin' && <Route path="/admin" element={<Admin />} />}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}