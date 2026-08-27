// src/pages/mitra/MitraDashboard.tsx
import React from 'react';
import { useAuthStore } from '../../store/authStore';

/**
 * Placeholder Mitra Dashboard — will be replaced by FE2 Core Phase 2 implementation.
 */
const MitraDashboard: React.FC = () => {
  const { user, logout } = useAuthStore();

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-black text-white mb-2">Mitra Dashboard</h1>
        <p className="text-zinc-400 mb-6">Selamat datang, {user?.name} ({user?.role})</p>
        <button
          onClick={logout}
          className="bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default MitraDashboard;
