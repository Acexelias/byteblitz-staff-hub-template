import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import {
  FiHome,
  FiUsers,
  FiBook,
  FiDollarSign,
  FiHelpCircle,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX
} from 'react-icons/fi';
import { useState } from 'react';

const Layout = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', icon: FiHome, label: 'Dashboard' },
    { path: '/leads', icon: FiUsers, label: 'Leads' },
    { path: '/resources', icon: FiBook, label: 'Resources' },
    { path: '/commissions', icon: FiDollarSign, label: 'Commissions' },
    { path: '/support', icon: FiHelpCircle, label: 'Support' },
  ];

  if (isAdmin) {
    navItems.push({ path: '/admin', icon: FiSettings, label: 'Admin' });
  }

  return (
    <div className="min-h-screen bg-byteblitz-dark flex">
      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-byteblitz-gray rounded-lg"
      >
        {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: sidebarOpen ? 0 : '-100%' }}
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-byteblitz-gray border-r border-gray-800 lg:translate-x-0 transition-transform`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6">
            <h1 className="text-2xl font-bold gradient-text">ByteBlitz Hub</h1>
            <p className="text-sm text-gray-400 mt-1">{user?.name}</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`
                }
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Bottom section */}
          <div className="p-4 border-t border-gray-800">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 w-full transition-all"
            >
              <FiLogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
