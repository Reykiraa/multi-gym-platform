import React, { useState, useMemo } from 'react';
import { useTransactions } from '../../hooks/api/useTransactions';
import { Search, X } from 'lucide-react';
import type { AdminTransaction } from '../../types/admin';
import { formatShortOrderId } from '../../utils/formatters';

const getStatusDisplay = (status: string): string => {
  if (status === 'completed' || status === 'success' || status === 'settlement') return 'Success';
  if (status === 'pending') return 'Pending';
  if (status === 'failed' || status === 'cancel') return 'Failed';
  if (status === 'expired') return 'Expired';
  return status;
};

const statusColor: Record<string, string> = {
  completed: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  success: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  settlement: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  failed: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
  cancel: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
  expired: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
};

const Transactions: React.FC = () => {
  const { data: transactionsRes = [], isLoading } = useTransactions();
  const [filterType, setFilterType] = useState<'all' | 'topup' | 'deduction'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTx, setSelectedTx] = useState<AdminTransaction | null>(null);

  const transactions: AdminTransaction[] = useMemo(() => {
    return Array.isArray(transactionsRes) ? transactionsRes : (transactionsRes as Record<string, unknown>)?.data as AdminTransaction[] || [];
  }, [transactionsRes]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((txn) => {
      if (filterType !== 'all' && txn.type !== filterType) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const userName = String(txn.user_name || '').toLowerCase();
        const userEmail = String(txn.user_email || '').toLowerCase();
        const orderId = String(txn.order_id || txn.id || '').toLowerCase();
        if (!userName.includes(query) && !userEmail.includes(query) && !orderId.includes(query)) {
          return false;
        }
      }
      return true;
    });
  }, [transactions, filterType, searchQuery]);

  const formatDate = (iso: string): string => {
    if (!iso) return '—';
    return new Date(iso).toLocaleString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatRupiah = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">Transactions Ledger</h1>
        <p className="text-zinc-400 mt-1">Master audit log for platform credit movements and gym visits.</p>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-zinc-900 p-4 border border-zinc-800 rounded-xl">
        <div className="flex gap-2 p-1 bg-zinc-950 rounded-lg border border-zinc-800">
          <button
            onClick={() => setFilterType('all')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              filterType === 'all' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            }`}
          >
            All Transactions
          </button>
          <button
            onClick={() => setFilterType('topup')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              filterType === 'topup' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            }`}
          >
            Top-Ups Only
          </button>
          <button
            onClick={() => setFilterType('deduction')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              filterType === 'deduction' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            }`}
          >
            Gym Visits Only
          </button>
        </div>

        <div className="relative w-full md:w-72">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search by user name, email, or order ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-800/50">
              <tr className="border-b border-zinc-800 text-zinc-400 uppercase text-[11px] tracking-wider">
                <th className="px-6 py-4 font-medium">Order ID</th>
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">Type & Item</th>
                <th className="px-6 py-4 font-medium text-right">Credits</th>
                <th className="px-6 py-4 font-medium text-right">Amount (IDR)</th>
                <th className="px-6 py-4 font-medium text-center">Status</th>
                <th className="px-6 py-4 font-medium text-right">Date & Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-zinc-500">
                    Loading transaction records...
                  </td>
                </tr>
              ) : filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-zinc-500">
                    No transaction records found.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((txn: AdminTransaction) => (
                  <tr 
                    key={txn.id} 
                    onClick={() => setSelectedTx(txn)}
                    className="cursor-pointer hover:bg-zinc-800/60 transition-colors"
                  >
                    <td className="px-6 py-4 font-mono text-zinc-300 font-semibold whitespace-nowrap">
                      {formatShortOrderId(String(txn.order_id || txn.id))}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-white font-medium">{txn.user_name}</p>
                        <p className="text-xs text-zinc-500">{txn.user_email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1 items-start">
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md ${
                          txn.type === 'topup'
                            ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                        }`}>
                          {txn.type === 'topup' ? 'Top-Up' : 'Check-In'}
                        </span>
                        <span className="text-xs text-zinc-400">{txn.title || (txn.type === 'topup' ? 'Top Up Balance' : 'Gym')}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap font-medium">
                      <span className={txn.type === 'topup' ? 'text-emerald-500' : 'text-rose-500'}>
                        {txn.type === 'topup' ? '+' : '-'}{txn.amount} CR
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-zinc-300 font-mono text-xs whitespace-nowrap">
                      {formatRupiah(txn.amount_idr || 0)}
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <span className={`inline-block text-[11px] font-bold uppercase px-2.5 py-1 rounded-full border ${statusColor[txn.status] ?? statusColor.pending}`}>
                        {getStatusDisplay(txn.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-zinc-400 text-xs whitespace-nowrap">
                      {formatDate(txn.created_at)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Detail Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-zinc-800">
              <h2 className="text-lg font-bold text-white">Transaction Details</h2>
              <button 
                onClick={() => setSelectedTx(null)}
                className="text-zinc-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-zinc-400">Order ID</span>
                <span className="text-sm font-mono text-white">{selectedTx.order_id || selectedTx.id}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-zinc-400">User</span>
                <div className="text-right">
                  <p className="text-sm text-white font-medium">{selectedTx.user_name}</p>
                  <p className="text-xs text-zinc-500">{selectedTx.user_email}</p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-zinc-400">Type & Item</span>
                <div className="text-right">
                  <p className="text-sm text-white">{selectedTx.type === 'topup' ? 'Top-Up' : 'Check-In'}</p>
                  <p className="text-xs text-zinc-500">{selectedTx.title}</p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-zinc-400">Amount (IDR)</span>
                <span className="text-sm font-mono text-white">{formatRupiah(selectedTx.amount_idr || 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-zinc-400">Credits</span>
                <span className={`text-sm font-bold ${selectedTx.type === 'topup' ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {selectedTx.type === 'topup' ? '+' : '-'}{selectedTx.amount} CR
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-zinc-400">Status</span>
                <span className={`inline-block text-[11px] font-bold uppercase px-2.5 py-1 rounded-full border ${statusColor[selectedTx.status] ?? statusColor.pending}`}>
                  {getStatusDisplay(selectedTx.status)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-zinc-400">Date & Time</span>
                <span className="text-sm text-white">{formatDate(selectedTx.created_at)}</span>
              </div>
            </div>
            <div className="p-5 border-t border-zinc-800 bg-zinc-950">
              <button 
                onClick={() => setSelectedTx(null)}
                className="w-full bg-zinc-800 hover:bg-zinc-700 text-white py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
