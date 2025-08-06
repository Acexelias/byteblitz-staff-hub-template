import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { motion } from 'framer-motion';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';

export default function Login() {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const result = await login(email, password);
    if (!result.success) {
      setError(result.message);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-bg-dark via-[#1e293b] to-[#0f172a] text-text-dark p-4">
      {/* Ambient particles background */}
      <Particles
        id="tsparticles"
        className="absolute inset-0 -z-10"
        init={loadFull}
        options={{
          fullScreen: { enable: false },
          fpsLimit: 60,
          particles: {
            number: { value: 25, density: { enable: true, area: 800 } },
            color: { value: ['#8B5CF6', '#7C3AED', '#A855F7'] },
            shape: { type: 'circle' },
            opacity: { value: 0.3 },
            size: { value: { min: 1, max: 3 } },
            move: { enable: true, speed: 0.2, direction: 'none', outModes: 'out' },
          },
        }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md bg-bg-dark/80 backdrop-blur-md border border-bg-light/20 rounded-xl p-8 shadow-xl"
      >
        <h1 className="text-2xl font-semibold mb-6 text-center">Sign in to Staff Hub</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-bg-dark border border-bg-light/20 rounded px-3 py-2 text-text-dark focus:border-primary-dark focus:outline-none"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-bg-dark border border-bg-light/20 rounded px-3 py-2 text-text-dark focus:border-primary-dark focus:outline-none"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-dark text-white py-2 rounded hover:bg-primary transition-colors duration-200"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}