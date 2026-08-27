import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '../../components/shared/Navbar';
import Card from '../../components/ui/Card';
import { ArrowDownRight, ArrowUpRight, Dumbbell, CreditCard } from 'lucide-react';
import { type TransactionHistory } from '../../types';
import apiClient from '../../lib/axios';
import { useAuthStore } from '../../store/authStore';

const fetchTransactions = async (): Promise<TransactionHistory[]> => {
  const response = await apiClient.get('/transactions');
  return response.data?.data || response.data || [];
};

const WalletHistory: React.FC = () => {
  const { user } = useAuthStore();

  const { data: transactions = [], isLoading: isHistoryLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: fetchTransactions,
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
                <h2 className="text-zinc-400 font-medium mb-2">Total Saldo Kredit</h2>
                <div className="text-5xl font-bold text-yellow-500 mb-6 flex items-baseline gap-2">
                  {user?.credit_balance ?? 0} <span className="text-2xl text-yellow-500/70">CR</span>
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
                {transactions.map((tx) => (
                  <Card key={tx.id} noPadding className="p-4 flex items-center hover:bg-zinc-800/50 transition-colors cursor-default">
                    <div className={`p-3 rounded-full mr-4 ${tx.type === 'topup' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                      {tx.type === 'topup' ? <ArrowDownRight size={20} /> : <ArrowUpRight size={20} />}
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-bold text-white flex items-center gap-2">
                        {tx.type === 'deduction' && <Dumbbell size={14} className="text-zinc-400" />}
                        {tx.type === 'topup' ? 'Top Up Saldo' : (tx.gym_name || 'Gym')}
                      </h3>
                      <p className="text-xs text-zinc-500">{formatDate(tx.created_at)}</p>
                    </div>
                    <div className={`font-bold text-lg ${tx.type === 'topup' ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {tx.type === 'topup' ? '+' : '-'}{tx.amount}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default WalletHistory;
