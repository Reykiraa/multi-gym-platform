// src/layouts/MitraLayout.tsx
import React, { useState } from 'react';
import ConfirmModal from '../components/modals/ConfirmModal';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Clock,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import Logo from '../components/shared/Logo';

interface NavItem {
  label: string;
  to: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', to: '/mitra/dashboard', icon: <LayoutDashboard size={20} /> },
  { label: 'History', to: '/mitra/history', icon: <Clock size={20} /> },
  { label: 'Profile Gym', to: '/mitra/gym-profile', icon: <Settings size={20} /> },
];

/**
 * Generates Tailwind class string for NavLink active/inactive states.
 */
const linkClass = ({ isActive }: { isActive: boolean }): string =>
  `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
    isActive
      ? 'bg-yellow-500/10 text-yellow-500'
      : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
  }`;

const MitraLayout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const sidebarContent = (
    <>
      {/* Brand */}
      <div className="px-6 py-6 border-b border-zinc-800">
        <Logo size="md" />
        <p className="text-xs text-zinc-500 mt-1">Mitra Panel</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={linkClass}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* User info & Logout */}
      <div className="px-4 py-4 border-t border-zinc-800">
        <div className="px-4 py-2 mb-2">
          <p className="text-sm font-medium text-white truncate">{user?.name}</p>
          <p className="text-xs text-zinc-500 truncate">{user?.email}</p>
        </div>
        <button
          onClick={() => setIsLogoutModalOpen(true)}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-950">
      {/* ------------------------------------------------------------------ */}
      {/* DESKTOP SIDEBAR (hidden on mobile, visible md+)                     */}
      {/* ------------------------------------------------------------------ */}
      <aside className="hidden md:flex md:flex-col md:w-64 bg-zinc-950 border-r border-zinc-800 shrink-0">
        {sidebarContent}
      </aside>

      {/* ------------------------------------------------------------------ */}
      {/* MOBILE OVERLAY DRAWER                                               */}
      {/* ------------------------------------------------------------------ */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          {/* Drawer */}
          <aside className="relative flex flex-col w-64 h-full bg-zinc-950 border-r border-zinc-800 shadow-2xl animate-slide-in-left">
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-5 right-4 text-zinc-400 hover:text-white"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* MAIN CONTENT AREA                                                   */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile top bar */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-zinc-950 border-b border-zinc-800">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="text-zinc-400 hover:text-white"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
          <Logo size="sm" />
          <div className="w-6" /> {/* Spacer for centering */}
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="w-full max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

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
