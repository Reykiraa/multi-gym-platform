// src/layouts/MitraLayout.tsx
import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Bell, Package, ChevronDown, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../store/toastStore';

const MitraLayout: React.FC = () => {
  const { logout } = useAuthStore();
  const { addToast } = useToastStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors border-b-2 py-5 px-1 ${
      isActive ? 'text-yellow-500 border-yellow-500' : 'text-zinc-400 border-transparent hover:text-zinc-200'
    }`;

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      <header className="flex items-center justify-between px-4 md:px-8 bg-zinc-900 border-b border-zinc-800 shrink-0">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-yellow-500 tracking-wide">Mitra</h1>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <button onClick={() => addToast('info', 'Fitur Branches akan segera hadir.')} className="text-sm font-medium text-zinc-500 opacity-50 cursor-not-allowed hover:text-zinc-400 transition-colors">Branches</button>
            <button onClick={() => addToast('info', 'Fitur Staff akan segera hadir.')} className="text-sm font-medium text-zinc-500 opacity-50 cursor-not-allowed hover:text-zinc-400 transition-colors">Staff</button>
            <button onClick={() => addToast('info', 'Fitur Support akan segera hadir.')} className="text-sm font-medium text-zinc-500 opacity-50 cursor-not-allowed hover:text-zinc-400 transition-colors">Support</button>
            <NavLink to="/mitra/dashboard" className={linkClass}>Dashboard</NavLink>
            <NavLink to="/mitra/history" className={linkClass}>History</NavLink>
          </nav>
        </div>
        <div className="flex items-center gap-4 py-3">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-700 bg-zinc-800/50 cursor-pointer">
            <Package size={16} className="text-zinc-400" />
            <span className="text-xs font-medium text-white">Elite Fitness - Downtown</span>
            <ChevronDown size={14} className="text-zinc-400" />
          </div>
          <button onClick={() => navigate('/mitra/dashboard')} className="hidden sm:block bg-yellow-500 text-black px-4 py-1.5 rounded-md text-sm font-bold hover:bg-yellow-400 transition-colors">
            Check-in
          </button>
          <button className="hidden sm:block border border-yellow-500/30 text-yellow-500 px-4 py-1.5 rounded-md text-sm font-medium hover:bg-yellow-500/10 transition-colors">
            Profile
          </button>
          <div className="flex items-center gap-4 border-l border-zinc-700 pl-4">
            <button onClick={() => addToast('info', 'Belum ada notifikasi')} className="text-zinc-600 cursor-not-allowed transition-colors" aria-label="Notifications"><Bell size={20} /></button>
            <button onClick={handleLogout} className="flex items-center gap-2 text-rose-500 hover:text-rose-400 font-medium transition-colors" aria-label="Logout"><LogOut size={18} /> Logout</button>
          </div>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="w-full max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MitraLayout;
