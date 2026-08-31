// src/layouts/AdminLayout.tsx
import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Dumbbell,
  ArrowLeftRight,
  LogOut,
  Menu,
  X,
  Building2,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

interface NavItem {
  label: string;
  to: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', to: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
  { label: 'Mitra Organisasi', to: '/admin/mitras', icon: <Building2 size={20} /> },
  { label: 'Gym Network', to: '/admin/gyms', icon: <Dumbbell size={20} /> },
  { label: 'Transactions', to: '/admin/transactions', icon: <ArrowLeftRight size={20} /> },
];

/**
 * Generates Tailwind class string for NavLink active/inactive states.
 * Active links receive the Gold accent color; inactive use muted zinc.
 */
const linkClass = ({ isActive }: { isActive: boolean }): string =>
  `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
    isActive
      ? 'bg-yellow-500/10 text-yellow-500'
      : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
  }`;

/**
 * Admin Layout — Desktop sidebar + responsive mobile drawer.
 * All admin child routes render inside the <Outlet />.
 */
const AdminLayout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
        <h1 className="text-xl font-black text-white tracking-widest">GYMNOX</h1>
        <p className="text-xs text-zinc-500 mt-1">Admin Panel</p>
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
          onClick={handleLogout}
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
              aria-label="Tutup menu"
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
            aria-label="Buka menu"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-lg font-black text-white tracking-widest">GYMNOX</h1>
          <div className="w-6" /> {/* Spacer for centering */}
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="w-full max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
