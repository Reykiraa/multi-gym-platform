// src/pages/admin/AdminDashboard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import {
  Dumbbell,
  Users,
  ArrowLeftRight,
  TrendingUp,
  Building2,
} from 'lucide-react';
import { useGyms } from '../../hooks/api/useGyms';
import { useTransactions } from '../../hooks/api/useTransactions';
import type { AdminStats } from '../../types/admin';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  accent?: string;
}

/** Single KPI card for the dashboard grid. */
const StatCard: React.FC<StatCardProps> = ({ label, value, icon, accent = 'text-yellow-500' }) => (
  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex items-center gap-4">
    <div className={`p-3 rounded-lg bg-zinc-800 ${accent}`}>{icon}</div>
    <div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-sm text-zinc-400">{label}</p>
    </div>
  </div>
);

/**
 * Admin Dashboard — Overview page with summary statistics and quick links.
 */
const AdminDashboard: React.FC = () => {
  const { data: gyms = [] } = useGyms();
  const { data: transactions = [] } = useTransactions();

  const stats: AdminStats = {
    total_gyms: gyms.length,
    total_users: new Set(transactions.map((t) => t.user_id)).size,
    total_transactions: transactions.length,
    total_revenue: transactions
      .filter((t) => t.type === 'topup' && t.status === 'completed')
      .reduce((sum, t) => sum + t.credit_amount, 0),
  };

  return (
    <div>
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-zinc-400 mt-1">Ringkasan data platform GYMNOX</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Total Gym"
          value={stats.total_gyms}
          icon={<Dumbbell size={22} />}
        />
        <StatCard
          label="Total User"
          value={stats.total_users}
          icon={<Users size={22} />}
          accent="text-emerald-500"
        />
        <StatCard
          label="Total Transaksi"
          value={stats.total_transactions}
          icon={<ArrowLeftRight size={22} />}
          accent="text-sky-500"
        />
        <StatCard
          label="Revenue (Credits)"
          value={stats.total_revenue}
          icon={<TrendingUp size={22} />}
          accent="text-amber-500"
        />
      </div>

      {/* Quick-access cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/admin/mitras"
          className="group bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-yellow-500/50 transition-colors"
        >
          <div className="flex items-center gap-3 mb-3">
            <Building2 size={20} className="text-yellow-500" />
            <h3 className="text-lg font-semibold text-white">Mitra Organisasi</h3>
          </div>
          <p className="text-sm text-zinc-400">
            Daftarkan & kelola brand gym partner (PT FTL, Gold's Gym, dll).
          </p>
        </Link>

        <Link
          to="/admin/gyms"
          className="group bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-yellow-500/50 transition-colors"
        >
          <div className="flex items-center gap-3 mb-3">
            <Dumbbell size={20} className="text-yellow-500" />
            <h3 className="text-lg font-semibold text-white">Gym Network</h3>
          </div>
          <p className="text-sm text-zinc-400">
            Kelola data gym partner, tambah lokasi baru, dan atur tarif kredit.
          </p>
        </Link>

        <Link
          to="/admin/transactions"
          className="group bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-yellow-500/50 transition-colors"
        >
          <div className="flex items-center gap-3 mb-3">
            <ArrowLeftRight size={20} className="text-yellow-500" />
            <h3 className="text-lg font-semibold text-white">Transactions</h3>
          </div>
          <p className="text-sm text-zinc-400">
            Pantau seluruh transaksi check-in dan top-up kredit.
          </p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
