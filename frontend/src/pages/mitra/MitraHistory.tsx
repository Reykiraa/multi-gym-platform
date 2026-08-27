// src/pages/mitra/MitraHistory.tsx
import React from 'react';
import { Search, Calendar, Eye, UserCheck, Clock, CreditCard } from 'lucide-react';
import { useCheckInHistory } from '../../hooks/api/useMitraAPI';

const MitraHistory: React.FC = () => {
  const { data: entries = [], isLoading } = useCheckInHistory();

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">Check-in History & Settlement</h1>
          <p className="text-sm md:text-base text-zinc-400 mt-2">Track member access and monitor payout status for Elite Fitness - Downtown.</p>
        </div>
        <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-4 md:p-5 flex items-center justify-between gap-8 md:gap-12 shrink-0">
          <div>
            <p className="text-xs text-zinc-400 font-medium tracking-wide uppercase mb-1">Current Month Settlement</p>
            <p className="text-white text-lg font-semibold">Total Check-ins: <span className="text-yellow-500 font-bold">1,420</span></p>
          </div>
          <div className="text-right border-l border-zinc-700 pl-8">
            <p className="text-xs text-zinc-400 font-medium tracking-wide uppercase mb-1">Estimated Payout</p>
            <p className="text-yellow-500 text-xl md:text-2xl font-black tracking-tight">Rp 21.300.000</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm font-medium text-zinc-400">Today's Check-ins</p>
            <UserCheck size={40} className="text-zinc-800 absolute right-4 top-4" />
          </div>
          <div className="flex items-end gap-3 mt-4">
            <p className="text-4xl font-black text-white">42</p>
            <span className="inline-flex items-center text-xs font-bold px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 mb-1">↗ +12%</span>
          </div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm font-medium text-zinc-400">Peak Hours</p>
            <Clock size={40} className="text-zinc-800 absolute right-4 top-4" />
          </div>
          <div className="mt-4">
            <p className="text-4xl font-black text-white tracking-tight">17:00 <span className="text-zinc-500 text-3xl font-medium">-</span> 20:00</p>
          </div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm font-medium text-zinc-400">Payout Status</p>
            <CreditCard size={40} className="text-zinc-800 absolute right-4 top-4" />
          </div>
          <div className="mt-4">
            <p className="text-4xl font-black text-white">85% <span className="text-xl font-medium text-zinc-400">Disbursed</span></p>
            <div className="w-full h-1.5 bg-zinc-800 rounded-full mt-4 overflow-hidden">
              <div className="h-full bg-yellow-500 rounded-full" style={{ width: '85%' }}></div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden mt-8">
        <div className="p-4 border-b border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input type="text" placeholder="Search Member PIN or ID..." className="bg-zinc-800/50 border border-zinc-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-yellow-500 transition-colors w-full sm:w-64" />
            </div>
            <div className="relative hidden sm:block">
              <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <select className="bg-zinc-800/50 border border-zinc-700 rounded-lg pl-9 pr-8 py-2 text-sm text-white focus:outline-none focus:border-yellow-500 transition-colors appearance-none">
                <option>This Month (Oct)</option>
                <option>Last Month (Sep)</option>
              </select>
            </div>
          </div>
          <button className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-lg text-sm font-bold transition-colors">
            Download Laporan Kliring
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/50 text-zinc-400 font-mono text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-medium">Member Name / ID</th>
                <th className="px-6 py-4 font-medium">PIN Code</th>
                <th className="px-6 py-4 font-medium">Timestamp</th>
                <th className="px-6 py-4 font-medium text-center">Credit Cost</th>
                <th className="px-6 py-4 font-medium">Settlement Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {isLoading ? <tr><td colSpan={6} className="px-6 py-12 text-center text-zinc-500">Loading history...</td></tr> : entries.map((entry) => (
                <tr key={entry.id} className="hover:bg-zinc-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 font-bold text-xs shrink-0">{entry.member_initials}</div>
                      <div>
                        <p className="text-white font-bold">{entry.member_name}</p>
                        <p className="text-xs text-zinc-500">{entry.member_id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-yellow-500 font-mono font-bold tracking-widest">{entry.pin_code}</td>
                  <td className="px-6 py-4 text-zinc-400">{new Date(entry.timestamp).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false })}</td>
                  <td className="px-6 py-4 text-center text-yellow-500 font-bold">{entry.credit_cost} CR</td>
                  <td className="px-6 py-4">
                    {entry.settlement_status === 'Disbursed' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>Disbursed</span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-500/10 text-yellow-500 text-xs font-medium border border-yellow-500/20"><span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>Pending</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right"><button className="text-zinc-500 hover:text-white transition-colors"><Eye size={18} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MitraHistory;
