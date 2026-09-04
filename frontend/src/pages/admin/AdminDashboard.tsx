import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Dumbbell,
  Users,
  ArrowLeftRight,
  TrendingUp,
  ChevronRight,
} from "lucide-react";
import { useGyms } from "../../hooks/api/useGyms";
import { useTransactions } from "../../hooks/api/useTransactions";
import { formatShortOrderId } from "../../utils/formatters";
import type { AdminTransaction } from "../../types/admin";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useQuery } from '@tanstack/react-query';
import apiClient from '../../lib/axios';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  accent?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  accent = "text-yellow-500",
}) => (
  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex items-center gap-4">
    <div className={`p-3 rounded-lg bg-zinc-800 ${accent}`}>{icon}</div>
    <div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-sm text-zinc-400">{label}</p>
    </div>
  </div>
);

const AdminDashboard: React.FC = () => {
  const { data: gyms = [] } = useGyms();
  const { data: transactionsRes = [] } = useTransactions();

  const totalGymsCount =
    (gyms as unknown as Record<string, unknown>)?.total ??
    (Array.isArray(gyms) ? gyms.length : ((gyms as unknown as Record<string, unknown>)?.data as unknown[])?.length ?? 0);

  const txList: AdminTransaction[] = React.useMemo(() => {
    return Array.isArray(transactionsRes)
      ? (transactionsRes as AdminTransaction[])
      : ((transactionsRes as Record<string, unknown>)?.data as AdminTransaction[]) || [];
  }, [transactionsRes]);

  const totalKreditTerjual = txList
    .filter(
      (t) =>
        t && t.type === "topup" &&
        (t.status === "success" ||
          t.status === "completed" ||
          t.status === "settlement"),
    )
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  const totalVisits = txList.filter(
    (t) => t && t.type === "deduction" && t.status === "completed",
  ).length;

  const { data: rawUsersData } = useQuery({
    queryKey: ["admin", "users"],
    queryFn: async () => {
      const res = await apiClient.get("/users");
      return res.data?.data || res.data || [];
    },
  });
  const usersList = Array.isArray(rawUsersData) ? rawUsersData : [];
  const totalRegisteredMembers = usersList.filter((u: { role?: string }) => u.role === 'user').length || usersList.length;

  const chartData = useMemo(() => {
    const days: { date: string; displayDate: string; topupVolume: number; visitVolume: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      days.push({
        date: dateStr,
        displayDate: d.toLocaleDateString("en-US", {
          day: "2-digit",
          month: "short",
        }),
        topupVolume: 0,
        visitVolume: 0,
      });
    }

    txList.forEach((t) => {
      if (!t.created_at) return;
      const tDate = t.created_at.split("T")[0];
      const dayData = days.find((d) => d.date === tDate);
      if (dayData) {
        if (
          t.type === "topup" &&
          (t.status === "success" ||
            t.status === "completed" ||
            t.status === "settlement")
        ) {
          dayData.topupVolume += Number(t.amount) || 0;
        } else if (t.type === "deduction" && t.status === "completed") {
          dayData.visitVolume += 1;
        }
      }
    });

    return days;
  }, [txList]);

  const recentTransactions = txList.slice(0, 5);

  const getStatusDisplay = (status: string): string => {
    if (
      status === "completed" ||
      status === "success" ||
      status === "settlement"
    )
      return "Success";
    if (status === "pending") return "Pending";
    if (status === "failed" || status === "cancel") return "Failed";
    if (status === "expired") return "Expired";
    return status;
  };

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          Dashboard Overview
        </h1>
        <p className="text-zinc-400 mt-1">
          Platform performance, ecosystem scale, and credit circulation metrics.
        </p>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Total Gym Partners"
          value={Number(totalGymsCount) || 0}
          icon={<Dumbbell size={22} />}
        />
        <StatCard
          label="Registered Members"
          value={totalRegisteredMembers}
          icon={<Users size={22} />}
          accent="text-emerald-500"
        />
        <StatCard
          label="Gross Credits Sold"
          value={totalKreditTerjual.toLocaleString("en-US")}
          icon={<TrendingUp size={22} />}
          accent="text-sky-500"
        />
        <StatCard
          label="Total Gym Visits"
          value={totalVisits.toLocaleString("en-US")}
          icon={<ArrowLeftRight size={22} />}
          accent="text-amber-500"
        />
      </div>

      {/* Trend Chart */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <h2 className="text-lg font-bold text-white mb-4">
          Activity Trends (Last 7 Days)
        </h2>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorTopup" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorVisit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#27272a"
                vertical={false}
              />
              <XAxis
                dataKey="displayDate"
                stroke="#a1a1aa"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#a1a1aa"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#18181b",
                  borderColor: "#27272a",
                  borderRadius: "8px",
                }}
                itemStyle={{ color: "#e4e4e7" }}
              />
              <Area
                type="monotone"
                dataKey="topupVolume"
                name="Top-Up Volume (CR)"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorTopup)"
              />
              <Area
                type="monotone"
                dataKey="visitVolume"
                name="Check-in Visits"
                stroke="#f59e0b"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorVisit)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Transactions Preview */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Recent Transactions</h2>
          <Link
            to="/admin/transactions"
            className="text-sm text-yellow-500 hover:text-yellow-400 flex items-center gap-1 transition-colors"
          >
            View Full Ledger <ChevronRight size={16} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-800/50">
              <tr className="text-zinc-400 uppercase text-xs tracking-wider">
                <th className="px-5 py-3 font-medium">Order ID</th>
                <th className="px-5 py-3 font-medium">User</th>
                <th className="px-5 py-3 font-medium">Type</th>
                <th className="px-5 py-3 font-medium text-right">Credits</th>
                <th className="px-5 py-3 font-medium text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {recentTransactions.map((tx: AdminTransaction, idx: number) => (
                <tr
                  key={String(tx.id || idx)}
                  className="hover:bg-zinc-800/30 transition-colors"
                >
                  <td className="px-5 py-3 text-zinc-300 font-mono text-xs">
                    {formatShortOrderId(String(tx.order_id || tx.id))}
                  </td>
                  <td className="px-5 py-3 text-zinc-300">{tx.user_name}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`px-2 py-1 text-[10px] uppercase font-bold rounded ${tx.type === "topup" ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"}`}
                    >
                      {tx.type === "topup" ? "Top-Up" : "Check-In"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right font-medium">
                    <span
                      className={
                        tx.type === "topup"
                          ? "text-emerald-500"
                          : "text-rose-500"
                      }
                    >
                      {tx.type === "topup" ? "+" : "-"}
                      {tx.amount} CR
                    </span>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <span
                      className={`px-2 py-1 text-[10px] uppercase font-bold rounded-full border ${tx.status === "completed" || tx.status === "success" || tx.status === "settlement" ? "border-emerald-500/30 text-emerald-500" : tx.status === "pending" ? "border-yellow-500/30 text-yellow-500" : "border-rose-500/30 text-rose-500"}`}
                    >
                      {getStatusDisplay(tx.status)}
                    </span>
                  </td>
                </tr>
              ))}
              {recentTransactions.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-8 text-center text-zinc-500"
                  >
                    No recent transactions
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
