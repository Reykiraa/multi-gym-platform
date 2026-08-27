// src/pages/admin/Transactions.tsx
import React, { useState } from 'react';
import { CreditCard } from 'lucide-react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import TopUpForm from '../../components/forms/TopUpForm';
import { useTransactions, useManualTopUp } from '../../hooks/api/useTransactions';
import type { TopUpPayload } from '../../types/admin';

/** Maps transaction status to Badge color variants. */
const statusColor: Record<string, string> = {
  completed: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  failed: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
  expired: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
};

/** Maps transaction type to a readable label. */
const typeLabel: Record<string, string> = {
  'check-in': 'Check-in',
  topup: 'Top-Up',
};

/**
 * Admin Transaction & Top-Up page.
 * Displays all platform transactions and provides a manual top-up action.
 */
const Transactions: React.FC = () => {
  const { data: transactions = [], isLoading } = useTransactions();
  const topUpMutation = useManualTopUp();
  const [showTopUp, setShowTopUp] = useState(false);

  const handleTopUp = (payload: TopUpPayload) => {
    topUpMutation.mutate(payload, {
      onSuccess: () => setShowTopUp(false),
    });
  };

  /** Formats ISO timestamp into a human-readable locale string. */
  const formatDate = (iso: string): string =>
    new Date(iso).toLocaleString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <div>
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Transactions</h1>
          <p className="text-zinc-400 mt-1">Riwayat transaksi check-in & top-up kredit</p>
        </div>
        <Button
          id="btn-manual-topup"
          variant="primary"
          onClick={() => setShowTopUp(true)}
        >
          <CreditCard size={18} className="mr-2" />
          Manual Top-Up
        </Button>
      </div>

      {/* Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 uppercase text-xs tracking-wider">
                <th className="px-6 py-4 font-medium">ID</th>
                <th className="px-6 py-4 font-medium">Waktu</th>
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">Gym</th>
                <th className="px-6 py-4 font-medium">Tipe</th>
                <th className="px-6 py-4 font-medium text-right">Kredit</th>
                <th className="px-6 py-4 font-medium text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-zinc-500">
                    Memuat data transaksi...
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-zinc-500">
                    Belum ada transaksi.
                  </td>
                </tr>
              ) : (
                transactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-zinc-800/50 transition-colors">
                    <td className="px-6 py-4 text-zinc-400 font-mono text-xs whitespace-nowrap">
                      #{txn.id}
                    </td>
                    <td className="px-6 py-4 text-zinc-300 whitespace-nowrap">
                      {formatDate(txn.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-white font-medium">{txn.user_name}</p>
                        <p className="text-xs text-zinc-500">{txn.user_email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-zinc-300 whitespace-nowrap">
                      {txn.gym_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-xs font-medium px-2 py-1 rounded-md ${
                        txn.type === 'topup'
                          ? 'bg-sky-500/10 text-sky-400'
                          : 'bg-amber-500/10 text-amber-400'
                      }`}>
                        {typeLabel[txn.type]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-yellow-500 font-semibold whitespace-nowrap">
                      {txn.type === 'topup' ? '+' : '-'}{txn.credit_amount}
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full border ${statusColor[txn.status] ?? ''}`}>
                        {txn.status.charAt(0).toUpperCase() + txn.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top-Up Modal */}
      {showTopUp && (
        <TopUpForm
          onSubmit={handleTopUp}
          onClose={() => setShowTopUp(false)}
          isLoading={topUpMutation.isPending}
        />
      )}
    </div>
  );
};

export default Transactions;
