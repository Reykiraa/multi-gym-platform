// /frontend/src/pages/Wallet/WalletHistory.tsx
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "../../components/shared/Navbar";
import Card from "../../components/ui/Card";
import {
  ArrowDownRight,
  ArrowUpRight,
  Dumbbell,
  CreditCard,
  PlusCircle,
  X,
} from "lucide-react";
import { type TransactionHistory } from "../../types";
import apiClient from "../../lib/axios";
import { useAuthStore } from "../../store/authStore";
import { TopupModal } from "../../components/modals/TopupModal";
import {
  useCancelTopup,
  useVerifyTopup,
  useCheckoutTopup,
} from "../../hooks/api/useTopup";
import { usePaymentStore } from "../../store/paymentStore";

const fetchTransactions = async (): Promise<TransactionHistory[]> => {
  const response = await apiClient.get("/transactions");
  const rawData = response.data?.data || response.data || [];
  return Array.isArray(rawData) ? rawData : [];
};

const fetchUserProfile = async () => {
  const response = await apiClient.get("/user");
  return response.data?.data || response.data;
};

const WalletHistory: React.FC = () => {
  const [isConfirmingCancel, setIsConfirmingCancel] = useState(false);
  const { user, setUser, isAuthenticated, token } = useAuthStore();
  const [isTopupOpen, setIsTopupOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<TransactionHistory | null>(null);
  const { mutate: checkout, isPending: isCheckingOut } = useCheckoutTopup();
  const { mutate: cancelTopup, isPending: isCancelling } = useCancelTopup();
  const { mutate: verifyTopup } = useVerifyTopup();
  const isVerifying = usePaymentStore((state) => state.isVerifying);


  // 1. Sinkronisasi User Profile ke Zustand Global (Agar Navbar langsung update!)
  useQuery({
    queryKey: ["auth", "user"],
    queryFn: async () => {
      const userData = await fetchUserProfile();
      if (userData && setUser) {
        setUser(userData); // Update Navbar & Global state seketika
      }
      return userData;
    },
    enabled: isAuthenticated && !!token,
    staleTime: 30000,
    refetchOnWindowFocus: false, // Matikan reload spam saat pindah tab
  });

  // 2. Query Transaksi (Stabil & Cepat)
  const { data: rawTransactions = [], isLoading: isHistoryLoading } = useQuery({
    queryKey: ["transactions", "history"], // <-- GANTI KE "history" AGAR TIDAK BENTROK
    queryFn: fetchTransactions,
    enabled: isAuthenticated && !!token,
    staleTime: 10000,
    refetchOnWindowFocus: false,
  });

  const transactions = Array.isArray(rawTransactions) ? rawTransactions : [];

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } catch {
      return "—";
    }
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
      case "success":
        return (
          <span className="px-2 py-1 text-xs font-bold uppercase tracking-wider rounded border text-emerald-400 bg-emerald-500/10 border-emerald-500/30">
            Successful
          </span>
        );
      case "pending":
        return (
          <span className="px-2 py-1 text-xs font-bold uppercase tracking-wider rounded border text-yellow-400 bg-yellow-500/10 border-yellow-500/30">
            Awaiting Validation
          </span>
        );
      case "cancelled":
      case "failed":
        return (
          <span className="px-2 py-1 text-xs font-bold uppercase tracking-wider rounded border text-rose-400 bg-rose-500/10 border-rose-500/30">
            Cancelled / Failed
          </span>
        );
      case "expired":
        return (
          <span className="px-2 py-1 text-xs font-bold uppercase tracking-wider rounded border text-zinc-400 bg-zinc-800 border-zinc-700">
            Expired
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs font-bold uppercase tracking-wider rounded border text-zinc-400 bg-zinc-800 border-zinc-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen pb-16 md:pb-0 bg-zinc-950">
      <Navbar />

      <main className="flex-grow container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6 md:mb-10">
          <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">
            My Wallet
          </h1>
          <p className="text-zinc-400">
            Manage your credit balance and transaction history.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column: Balance Card */}
          <div className="lg:w-1/3">
            <Card className="bg-gradient-to-br from-zinc-800 to-zinc-900 border-zinc-700 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <CreditCard size={120} />
              </div>
              <div className="relative z-10 p-4">
                <h2 className="text-zinc-400 font-medium mb-1">
                  Available Balance
                </h2>
                <div className="text-5xl font-bold text-yellow-500 mb-4 flex items-baseline gap-2">
                  {user?.available_credits ?? user?.credit_balance ?? 0}{" "}
                  <span className="text-2xl text-yellow-500/70">CR</span>
                </div>

                <div className="flex justify-between items-center bg-zinc-900/50 p-3 rounded-lg border border-zinc-700/50 mb-6 text-sm">
                  <div>
                    <p className="text-zinc-500">Pending Balance</p>
                    <p className="text-white font-medium">
                      {user?.pending_credits ?? 0} CR
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-zinc-500">Total Balance</p>
                    <p className="text-white font-medium">
                      {user?.credit_balance ?? 0} CR
                    </p>
                  </div>
                </div>

                <button
                  className="w-full flex items-center justify-center gap-2 bg-yellow-500 text-black font-bold py-3.5 px-4 rounded-xl hover:bg-yellow-400 active:scale-[0.99] transition-all shadow-lg"
                  onClick={() => setIsTopupOpen(true)}
                >
                  <PlusCircle size={20} className="stroke-[2.5]" />
                  <span>Top Up Credits</span>
                </button>
              </div>
            </Card>
          </div>

          {/* Right Column: Transaction History */}
          <div className="lg:w-2/3">
            <h2 className="text-xl font-bold text-white mb-4 border-b border-zinc-800 pb-3">
              Transaction History
            </h2>

            {isHistoryLoading ? (
              <div className="text-center text-zinc-500 py-10">
                Loading history...
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-center text-zinc-500 py-10 bg-zinc-900/50 rounded-2xl border border-zinc-800 border-dashed">
                No transactions yet.
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {transactions.map((tx) => {
                  const isPending = tx.status === "pending";
                  const isTopup = tx.type === "topup";

                  return (
                    <div
                      key={tx.id}
                      onClick={() => setSelectedTx(tx)}
                      className="cursor-pointer"
                    >
                      <Card
                        noPadding
                        className={`p-4 flex flex-col md:flex-row md:items-center hover:bg-zinc-800 transition-colors ${
                          isPending
                            ? "border-yellow-500/50 border"
                            : "border-zinc-800/80"
                        }`}
                      >
                        <div className="flex items-center flex-grow mb-2 md:mb-0">
                          <div
                            className={`p-3 rounded-full mr-4 ${
                              isTopup
                                ? "bg-emerald-500/10 text-emerald-500"
                                : isPending
                                  ? "bg-yellow-500/10 text-yellow-500"
                                  : "bg-rose-500/10 text-rose-500"
                            }`}
                          >
                            {isTopup ? (
                              <ArrowDownRight size={20} />
                            ) : (
                              <ArrowUpRight size={20} />
                            )}
                          </div>
                          <div className="flex-grow">
                            <h3 className="font-bold text-white flex items-center gap-2">
                              {!isTopup && (
                                <Dumbbell size={14} className="text-zinc-400" />
                              )}
                              {isTopup ? "Credit Top-Up" : tx.gym_name || "Gym"}
                            </h3>
                            <p className="text-xs text-zinc-500">
                              {formatDate(tx.created_at)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between md:justify-end gap-4 ml-14 md:ml-0">
                          <div className="flex flex-col items-start md:items-end">
                            {renderStatusBadge(tx.status)}
                          </div>
                          <div
                            className={`font-bold text-lg ${
                              isTopup
                                ? "text-emerald-500"
                                : isPending
                                  ? "text-yellow-500"
                                  : "text-rose-500"
                            }`}
                          >
                            {isTopup ? "+" : "-"}
                            {tx.amount} CR
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

      {/* Detail Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedTx(null)}
          />
          <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-sm shadow-2xl p-6">
            <button
              onClick={() => setSelectedTx(null)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-bold text-white mb-6 text-center border-b border-zinc-800 pb-4">
              Transaction Detail
            </h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-zinc-500 text-sm">Type</span>
                <span className="text-white font-medium">
                  {selectedTx.type === "topup"
                    ? "Credit Top-Up"
                    : "Gym Check-in"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-500 text-sm">Location</span>
                <span className="text-white font-medium text-right max-w-[150px] truncate">
                  {selectedTx.gym_name || "—"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-500 text-sm">Time</span>
                <span className="text-white font-medium">
                  {formatDate(selectedTx.created_at)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-500 text-sm">Amount</span>
                <span
                  className={`font-bold ${
                    selectedTx.type === "topup"
                      ? "text-emerald-500"
                      : "text-rose-500"
                  }`}
                >
                  {selectedTx.type === "topup" ? "+" : "-"}
                  {selectedTx.amount} CR
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-500 text-sm">Status</span>
                {renderStatusBadge(selectedTx.status)}
              </div>
            </div>

            {selectedTx.status === "pending" && selectedTx.type === "topup" && (
              <div className="space-y-2.5 mt-4 pt-4 border-t border-zinc-800">
                {/* 1. Tombol Lanjutkan Pembayaran (Membuka langsung Nomor VA / QR Code yang sedang aktif) */}
                {selectedTx.snap_token && (
                  <button
                    disabled={isVerifying}
                    className="w-full py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl transition-all shadow-md text-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    onClick={() => {
                      if (window.snap && selectedTx.snap_token) {
                        window.snap.pay(selectedTx.snap_token, {
                          onSuccess: () => {
                            if (selectedTx.order_id)
                              verifyTopup({ orderId: selectedTx.order_id });
                            setSelectedTx(null);
                          },
                          onPending: () => setSelectedTx(null),
                          onClose: () => {
                            if (selectedTx.order_id)
                              verifyTopup({ orderId: selectedTx.order_id });
                            setSelectedTx(null);
                          },
                          onError: () => setSelectedTx(null),
                        });
                      }
                    }}
                  >
                    {isVerifying ? (
                      <>
                        <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                        Memverifikasi...
                      </>
                    ) : (
                      'Continue Payment (View VA / QRIS)'
                    )}
                  </button>
                )}

                {/* 2. Tombol Ganti Metode Pembayaran (Membatalkan yang lama, lalu membuka modal paket baru) */}
                <button
                  disabled={isCancelling || isCheckingOut || isVerifying}
                  className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold rounded-xl border border-zinc-700 transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  onClick={() => {
                    if (!selectedTx.topup_package_id) {
                      // Fallback jika tidak ada package id
                      setSelectedTx(null);
                      setIsTopupOpen(true);
                      return;
                    }

                    const oldTxId = selectedTx.id;
                    const packageId = selectedTx.topup_package_id;

                    // 1. Batalkan transaksi lama secara diam-diam (tanpa toast)
                    cancelTopup({ id: oldTxId.toString(), silent: true });

                    // 2. Langsung checkout paket yang sama & buka pop-up Snap (Gambar 3)
                    checkout(
                      { topup_package_id: packageId },
                      {
                        onSuccess: (data) => {
                          setSelectedTx(null);
                          if (data.snap_token && window.snap) {
                            window.snap.pay(data.snap_token, {
                              onSuccess: () => {
                                if (data.order_id)
                                  verifyTopup({ orderId: data.order_id });
                              },
                              onPending: () => {
                                if (data.order_id)
                                  verifyTopup({ orderId: data.order_id });
                              },
                              onClose: () => {
                                if (data.order_id)
                                  verifyTopup({ orderId: data.order_id });
                              },
                              onError: () => {},
                            });
                          }
                        },
                      },
                    );
                  }}
                >
                  {isCheckingOut
                    ? "Opening Payment Method..."
                    : "Change Payment Method"}
                </button>

                {/* 3. Tombol Batalkan Transaksi */}
                {!isConfirmingCancel ? (
                  <button
                    disabled={isCancelling || isCheckingOut}
                    className="w-full py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 font-medium rounded-xl transition-colors text-xs"
                    onClick={() => setIsConfirmingCancel(true)}
                  >
                    Cancel This Transaction
                  </button>
                ) : (
                  <div className="p-3 bg-rose-950/40 border border-rose-500/30 rounded-xl space-y-2.5 animate-in fade-in zoom-in-95 duration-150">
                    <p className="text-xs text-rose-300 font-medium text-center">
                      Are you sure you want to cancel this order? The active payment number will be deactivated.
                    </p>
                    <div className="flex gap-2">
                      <button
                        disabled={isCancelling}
                        className="flex-1 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold rounded-lg text-xs transition-colors"
                        onClick={() => setIsConfirmingCancel(false)}
                      >
                        No, Go Back
                      </button>
                      <button
                        disabled={isCancelling}
                        className="flex-1 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-xs transition-colors shadow-md"
                        onClick={() => {
                          cancelTopup(
                            { id: selectedTx.id },
                            {
                              onSuccess: () => {
                                setIsConfirmingCancel(false);
                                setSelectedTx(null);
                              },
                            },
                          );
                        }}
                      >
                        {isCancelling ? "Cancelling..." : "Yes, Cancel"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <button
              className="w-full mt-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl transition-colors"
              onClick={() => setSelectedTx(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Full-Screen Payment Verification Overlay */}
      {isVerifying && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative flex items-center justify-center mb-4">
            <div className="w-16 h-16 border-4 border-yellow-500/20 border-t-yellow-500 rounded-full animate-spin"></div>
          </div>
          <h3 className="text-xl font-bold text-white mb-1">Memverifikasi Pembayaran</h3>
          <p className="text-sm text-zinc-400">Sedang mencocokkan status transaksi dan memperbarui saldo RoamFit Anda...</p>
        </div>
      )}

      {/* Topup Modal */}
      <TopupModal isOpen={isTopupOpen} onClose={() => setIsTopupOpen(false)} />
    </div>
  );
};

export default WalletHistory;
