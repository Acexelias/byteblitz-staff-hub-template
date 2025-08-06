import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Sidebar() {
  const { user } = useAuth();

  const navItems = [
    { to: '/', label: 'Dashboard' },
    { to: '/leads', label: 'Leads' },
    { to: '/resources', label: 'Resources' },
    { to: '/bookings', label: 'Bookings' },
    { to: '/support', label: 'Support' },
  ];
  if (user && user.role === 'admin') {
    navItems.push({ to: '/admin', label: 'Admin' });
  }

  return (
    <nav className="bg-bg-dark text-text-dark w-64 min-h-screen p-4 hidden md:block">
      <div className="text-2xl font-semibold mb-8">Staff Hub</div>
      <ul className="space-y-2">
        {navItems.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              end
              className={({ isActive }) =>
                `block px-4 py-2 rounded transition-colors duration-200 ${
                  isActive ? 'bg-primary-dark text-white' : 'hover:bg-primary-dark hover:text-white'
                }`
              }
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}