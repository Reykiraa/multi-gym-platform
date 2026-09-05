// src/layouts/MitraLayout.tsx
import React, { useState } from 'react';
import ConfirmModal from '../components/modals/ConfirmModal';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LogOut, LayoutDashboard, Clock, Settings } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const MitraLayout: React.FC = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors border-b-2 py-5 px-1 ${
      isActive ? 'text-yellow-500 border-yellow-500' : 'text-zinc-400 border-transparent hover:text-zinc-200'
    }`;
    
  const mobileLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex flex-col items-center gap-1 p-2 w-full text-xs font-medium transition-colors ${
      isActive ? 'text-yellow-500' : 'text-zinc-400 hover:text-zinc-200'
    }`;

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col relative pb-16 md:pb-0">
      <header className="flex items-center justify-between px-4 md:px-8 bg-zinc-900 border-b border-zinc-800 shrink-0">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 py-3 md:py-0">
            <h1 className="text-2xl font-black text-yellow-500 tracking-wide">Mitra</h1>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <NavLink to="/mitra/dashboard" className={linkClass}>Dashboard</NavLink>
            <NavLink to="/mitra/history" className={linkClass}>History</NavLink>
          </nav>
        </div>
        <div className="flex items-center gap-4 py-3">
          <button onClick={() => navigate('/mitra/dashboard')} className="hidden sm:block bg-yellow-500 text-black px-4 py-1.5 rounded-md text-sm font-bold hover:bg-yellow-400 transition-colors">
            Check-in
          </button>
          <button onClick={() => navigate('/mitra/gym-profile')} className="hidden sm:block border border-yellow-500/30 text-yellow-500 px-4 py-1.5 rounded-md text-sm font-medium hover:bg-yellow-500/10 transition-colors">
            Profile Gym
          </button>
          <div className="flex items-center gap-4 border-zinc-700 pl-0 sm:pl-4 sm:border-l">
            <button onClick={() => setIsLogoutModalOpen(true)} className="flex items-center gap-2 text-rose-500 hover:text-rose-400 font-medium transition-colors" aria-label="Logout">
              <LogOut size={18} className="hidden sm:block" /> 
              <span className="text-sm sm:text-base">Logout</span>
            </button>
          </div>
        </div>
      </header>
      
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="w-full max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 flex items-center justify-around z-40 pb-safe">
        <NavLink to="/mitra/dashboard" className={mobileLinkClass}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/mitra/history" className={mobileLinkClass}>
          <Clock size={20} />
          <span>History</span>
        </NavLink>
        <NavLink to="/mitra/gym-profile" className={mobileLinkClass}>
          <Settings size={20} />
          <span>Profile</span>
        </NavLink>
      </nav>

      <ConfirmModal
        isOpen={isLogoutModalOpen}
        title="Confirm Logout"
        description="Are you sure you want to log out of the partner dashboard?"
        confirmText="Yes, Logout"
        cancelText="Cancel"
        onConfirm={handleLogout}
        onCancel={() => setIsLogoutModalOpen(false)}
      />
    </div>
  );
};

export default MitraLayout;
