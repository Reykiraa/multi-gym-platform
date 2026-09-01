import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '../../components/shared/Navbar';
import Card from '../../components/ui/Card';
import { ArrowDownRight, ArrowUpRight, Dumbbell, CreditCard, X } from 'lucide-react';
import { type TransactionHistory } from '../../types';
import apiClient from '../../lib/axios';
import { useAuthStore } from '../../store/authStore';

const fetchTransactions = async (): Promise<TransactionHistory[]> => {
  const response = await apiClient.get('/transactions');
  return response.data?.data || response.data || [];
};

const WalletHistory: React.FC = () => {
  const { user, isAuthenticated, token } = useAuthStore();
  const [selectedTx, setSelectedTx] = useState<TransactionHistory | null>(null);

  /**
   * Share the same cache entry as ProtectedLayout by using the identical queryKey.
   * staleTime prevents this from re-fetching on every tab switch / component remount.
   * The 8s staleTime is intentionally aligned with the 10s refetchInterval in
   * ProtectedLayout so both consumers stay in sync without double-fetching.
   */
  const { data: transactions = [], isLoading: isHistoryLoading } = useQuery({
    queryKey: ['transactions', 'active'],
    queryFn: fetchTransactions,
    enabled: isAuthenticated && !!token,
    staleTime: 8000,
  });

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="px-2 py-1 text-xs font-bold uppercase tracking-wider rounded border text-emerald-400 bg-emerald-500/10 border-emerald-500/30">Berhasil</span>;
      case 'pending':
        return <span className="px-2 py-1 text-xs font-bold uppercase tracking-wider rounded border text-yellow-400 bg-yellow-500/10 border-yellow-500/30">Menunggu Validasi</span>;
      case 'cancelled':
        return <span className="px-2 py-1 text-xs font-bold uppercase tracking-wider rounded border text-rose-400 bg-rose-500/10 border-rose-500/30">Dibatalkan</span>;
      case 'expired':
        return <span className="px-2 py-1 text-xs font-bold uppercase tracking-wider rounded border text-zinc-400 bg-zinc-800 border-zinc-700">Kedaluwarsa</span>;
      default:
        return <span className="px-2 py-1 text-xs font-bold uppercase tracking-wider rounded border text-zinc-400 bg-zinc-800 border-zinc-700">{status}</span>;
    }
  };

  return (
    <div className="flex flex-col min-h-screen pb-16 md:pb-0">
      <Navbar />
      
      <main className="flex-grow container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6 md:mb-10">
          <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">Dompet Saya</h1>
          <p className="text-zinc-400">Kelola saldo kredit dan riwayat transaksi Anda.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column: Balance Card */}
          <div className="lg:w-1/3">
            <Card className="bg-gradient-to-br from-zinc-800 to-zinc-900 border-zinc-700 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <CreditCard size={120} />
              </div>
              <div className="relative z-10 p-4">
                <h2 className="text-zinc-400 font-medium mb-1">Saldo Tersedia</h2>
                <div className="text-5xl font-bold text-yellow-500 mb-4 flex items-baseline gap-2">
                  {user?.available_credits ?? user?.credit_balance ?? 0} <span className="text-2xl text-yellow-500/70">CR</span>
                </div>
                
                <div className="flex justify-between items-center bg-zinc-900/50 p-3 rounded-lg border border-zinc-700/50 mb-6 text-sm">
                  <div>
                    <p className="text-zinc-500">Saldo Ditahan</p>
                    <p className="text-white font-medium">{user?.pending_credits ?? 0} CR</p>
                  </div>
                  <div className="text-right">
                    <p className="text-zinc-500">Total Saldo</p>
                    <p className="text-white font-medium">{user?.credit_balance ?? 0} CR</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button 
                    className="flex-1 bg-yellow-500 text-black font-bold py-3 rounded-xl hover:bg-yellow-400 transition-colors"
                    onClick={() => window.alert("Fitur segera hadir. Untuk MVP, silakan hubungi Admin Gymnox untuk pengisian saldo.")}
                  >
                    Top Up Credits
                  </button>
                  <button 
                    className="flex-1 bg-zinc-800 text-white font-bold py-3 rounded-xl hover:bg-zinc-700 transition-colors border border-zinc-700"
                    onClick={() => window.alert("Fitur segera hadir. Untuk MVP, silakan hubungi Admin Gymnox untuk pengisian saldo.")}
                  >
                    Transfer Credits
                  </button>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column: Transaction History */}
          <div className="lg:w-2/3">
            <h2 className="text-xl font-bold text-white mb-4 border-b border-zinc-800 pb-3">Riwayat Transaksi</h2>
            
            {isHistoryLoading ? (
              <div className="text-center text-zinc-500 py-10">Memuat riwayat...</div>
            ) : transactions.length === 0 ? (
              <div className="text-center text-zinc-500 py-10 bg-zinc-900/50 rounded-2xl border border-zinc-800 border-dashed">
                Belum ada transaksi.
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {transactions.map((tx) => {
                  const isPending = tx.status === 'pending';
                  return (
                    <div 
                      key={tx.id} 
                      onClick={() => setSelectedTx(tx)}
                      className="cursor-pointer"
                    >
                      <Card noPadding className={`p-4 flex flex-col md:flex-row md:items-center hover:bg-zinc-800 transition-colors ${isPending ? 'border-yellow-500/50 border' : ''}`}>
                        <div className="flex items-center flex-grow mb-2 md:mb-0">
                          <div className={`p-3 rounded-full mr-4 ${tx.type === 'topup' ? 'bg-emerald-500/10 text-emerald-500' : isPending ? 'bg-yellow-500/10 text-yellow-500' : 'bg-rose-500/10 text-rose-500'}`}>
                            {tx.type === 'topup' ? <ArrowDownRight size={20} /> : <ArrowUpRight size={20} />}
                          </div>
                          <div className="flex-grow">
                            <h3 className="font-bold text-white flex items-center gap-2">
                              {tx.type === 'deduction' && <Dumbbell size={14} className="text-zinc-400" />}
                              {tx.type === 'topup' ? 'Top Up Saldo' : (tx.gym_name || 'Gym')}
                            </h3>
                            <p className="text-xs text-zinc-500">{formatDate(tx.created_at)}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between md:justify-end gap-4 ml-14 md:ml-0">
                          <div className="flex flex-col items-start md:items-end">
                            {renderStatusBadge(tx.status)}
                          </div>
                          <div className={`font-bold text-lg ${tx.type === 'topup' ? 'text-emerald-500' : isPending ? 'text-yellow-500' : 'text-rose-500'}`}>
                            {tx.type === 'topup' ? '+' : '-'}{tx.amount}
                          </div>
                        </div>
                      </Card>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Transaction Detail Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedTx(null)} />
          <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-sm shadow-2xl p-6">
            <button 
              onClick={() => setSelectedTx(null)} 
              className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
            
            <h2 className="text-xl font-bold text-white mb-6 text-center border-b border-zinc-800 pb-4">Detail Transaksi</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-zinc-500 text-sm">Jenis</span>
                <span className="text-white font-medium">{selectedTx.type === 'topup' ? 'Top Up Saldo' : 'Check-in Gym'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-500 text-sm">Lokasi</span>
                <span className="text-white font-medium text-right max-w-[150px] truncate">{selectedTx.gym_name || '—'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-500 text-sm">Waktu</span>
                <span className="text-white font-medium">{formatDate(selectedTx.created_at)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-500 text-sm">Jumlah</span>
                <span className={`font-bold ${selectedTx.type === 'topup' ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {selectedTx.type === 'topup' ? '+' : '-'}{selectedTx.amount} CR
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-500 text-sm">Status</span>
                {renderStatusBadge(selectedTx.status)}
              </div>
            </div>

            {selectedTx.status === 'pending' && selectedTx.pin_code && (
              <div className="bg-zinc-800 rounded-xl p-4 text-center border border-yellow-500/30">
                <p className="text-xs text-yellow-500 uppercase tracking-wider font-bold mb-2">Tunjukkan PIN ini ke Resepsionis</p>
                <div className="text-4xl font-mono tracking-widest text-yellow-500 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]">
                  {selectedTx.pin_code}
                </div>
              </div>
            )}
            
            <button 
              className="w-full mt-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl transition-colors"
              onClick={() => setSelectedTx(null)}
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletHistory;
