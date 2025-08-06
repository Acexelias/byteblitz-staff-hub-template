import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('bb_token') || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Optionally decode token to get user info; assume backend returns user info
      const storedUser = localStorage.getItem('bb_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/login`, {
        email,
        password,
      });
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('bb_token', res.data.token);
      localStorage.setItem('bb_user', JSON.stringify(res.data.user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      setLoading(false);
      return { success: true };
    } catch (err) {
      setLoading(false);
      return { success: false, message: err.response?.data?.message || 'Login failed' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('bb_token');
    localStorage.removeItem('bb_user');
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);