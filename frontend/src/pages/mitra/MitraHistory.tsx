// src/pages/mitra/MitraHistory.tsx
import React from "react";
import {
  Search,
  UserCheck,
  Clock,
  CreditCard,
} from "lucide-react";
import { useGetTransactions } from "../../hooks/api/useMitraAPI";
/**
 * Mitra History page — displays all check-in transactions for this mitra's gyms.
 * Data is fetched from GET /api/transactions, scoped by auth:sanctum to the mitra.
 */
const MitraHistory: React.FC = () => {
  const { data: entries = [], isLoading } = useGetTransactions();

  const completedToday = entries.filter(
    (tx) =>
      (tx as any).status === "completed" &&
      new Date(tx.created_at).toDateString() === new Date().toDateString(),
  ).length;

  const totalCredits = entries
    .filter((tx) => (tx as any).status === "completed")
    .reduce((sum, tx) => sum + tx.amount, 0);

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
            Check-in History
          </h1>
          <p className="text-sm md:text-base text-zinc-400 mt-2">
            Monitor member visit history to your gym.
          </p>
        </div>
        <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-4 md:p-5 flex items-center justify-between gap-8 md:gap-12 shrink-0">
          <div>
            <p className="text-xs text-zinc-400 font-medium tracking-wide uppercase mb-1">
              Total Transactions
            </p>
            <p className="text-white text-lg font-semibold">
              Check-ins:{" "}
              <span className="text-yellow-500 font-bold">
                {entries.length}
              </span>
            </p>
          </div>
          <div className="text-right border-l border-zinc-700 pl-8">
            <p className="text-xs text-zinc-400 font-medium tracking-wide uppercase mb-1">
              Total Credit
            </p>
            <p className="text-yellow-500 text-xl md:text-2xl font-black tracking-tight">
              {totalCredits} CR
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm font-medium text-zinc-400">
              Today's Check-ins
            </p>
            <UserCheck
              size={40}
              className="text-zinc-800 absolute right-4 top-4"
            />
          </div>
          <div className="flex items-end gap-3 mt-4">
            <p className="text-4xl font-black text-white">{completedToday}</p>
          </div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm font-medium text-zinc-400">Total Completed</p>
            <Clock size={40} className="text-zinc-800 absolute right-4 top-4" />
          </div>
          <div className="mt-4">
            <p className="text-4xl font-black text-white tracking-tight">
              {
                entries.filter((tx) => (tx as any).status === "completed")
                  .length
              }
            </p>
          </div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm font-medium text-zinc-400">
              Total Credit Collected
            </p>
            <CreditCard
              size={40}
              className="text-zinc-800 absolute right-4 top-4"
            />
          </div>
          <div className="mt-4">
            <p className="text-4xl font-black text-white">
              {totalCredits}{" "}
              <span className="text-xl font-medium text-zinc-400">CR</span>
            </p>
          </div>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden mt-8">
        <div className="p-4 border-b border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
              />
              <input
                type="text"
                placeholder="Search Member Name..."
                className="bg-zinc-800/50 border border-zinc-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-yellow-500 transition-colors w-full sm:w-64"
              />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/50 text-zinc-400 font-mono text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-medium">Member Name</th>
                <th className="px-6 py-4 font-medium">Check-in Time</th>
                <th className="px-6 py-4 font-medium text-center">Credit</th>
                <th className="px-6 py-4 font-medium text-center">Status</th>
                <th className="px-6 py-4 font-medium">
                  Expired Time
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-zinc-500"
                  >
                    Loading history...
                  </td>
                </tr>
              ) : entries.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-zinc-500"
                  >
                    No transaction data yet.
                  </td>
                </tr>
              ) : (
                entries.map((entry) => {
                  const status = (entry as any).status as string;
                  const isCompleted = status === "completed";
                  return (
                    <tr
                      key={entry.id}
                      className="hover:bg-zinc-800/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <p className="text-white font-bold">
                          {entry.user.name || "Member"}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-zinc-400">
                        {new Date(entry.created_at).toLocaleString("id-ID", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-6 py-4 text-center text-yellow-500 font-bold">
                        {entry.amount} CR
                      </td>
                      <td className="px-6 py-4 text-center">
                        {isCompleted ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20">
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-500/10 text-yellow-500 text-xs font-medium border border-yellow-500/20">  
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-zinc-400">
                        {new Date(entry.expires_at).toLocaleString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MitraHistory;
