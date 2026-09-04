import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { X, CheckCircle, Zap } from "lucide-react";
import { useTopupPackages, useCheckoutTopup, useVerifyTopup } from "../../hooks/api/useTopup";
import { useToastStore } from "../../store/toastStore";
import type { TopupPackage } from "../../types";

interface TopupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TopupModal: React.FC<TopupModalProps> = ({ isOpen, onClose }) => {
  const { data: packages, isLoading } = useTopupPackages();
  const { mutate: checkout, isPending } = useCheckoutTopup();
  const { mutate: verifyTopup } = useVerifyTopup();
  const [selectedPackage, setSelectedPackage] = useState<TopupPackage | null>(
    null,
  );

  const queryClient = useQueryClient();
  const { addToast } = useToastStore();

  if (!isOpen) return null;

  const handlePaymentSync = (orderId: string) => {
    verifyTopup(
      { orderId },
      {
        onSuccess: (res) => {
          if (res.data?.status === 'success' || res.user) {
            addToast('success', 'Top-up successful! Your balance has been updated.');
            queryClient.invalidateQueries({ queryKey: ['auth', 'user'] });
            queryClient.invalidateQueries({ queryKey: ['transactions', 'history'] });
          } else {
            addToast('info', 'Waiting for payment to be completed.');
            queryClient.invalidateQueries({ queryKey: ['transactions', 'history'] });
          }
          onClose();
        },
        onError: () => {
          addToast('info', 'Waiting for payment to be completed.');
          queryClient.invalidateQueries({ queryKey: ['transactions', 'history'] });
          onClose();
        }
      }
    );
  };

  const handleCheckout = () => {
    if (!selectedPackage) return;

    checkout(
      { topup_package_id: selectedPackage.id },
      {
        onSuccess: (data) => {
          if (data.snap_token && window.snap) {
            // 1. TUTUP MODAL KITA DULU AGAR TIDAK MENUTUPI POP-UP MIDTRANS
            onClose();

            // 2. MUNCULKAN POP-UP MIDTRANS SNAP SECARA BERSIH
            window.snap.pay(data.snap_token, {
              onSuccess: () => handlePaymentSync(data.order_id),
              onPending: () => handlePaymentSync(data.order_id),
              onClose: () => handlePaymentSync(data.order_id),
              onError: () => {
                addToast('error', 'Payment failed.');
              },
            });
          } else {
            addToast("error", "Payment gateway is unavailable.");
          }
        },
      },
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-zinc-900 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] border border-zinc-800">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Buy Credit Balance
            </h2>
            <p className="text-sm text-zinc-400 mt-1">
              Choose a package that suits your fitness needs.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {packages?.map((pkg) => {
                const totalCredits = pkg.credits + pkg.bonus_credits;
                const isBestValue = pkg.bonus_credits > 10;
                const isSelected = selectedPackage?.id === pkg.id;

                return (
                  <div
                    key={pkg.id}
                    onClick={() => setSelectedPackage(pkg)}
                    className={`relative p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? "border-yellow-500 bg-yellow-500/10 shadow-[0_0_15px_rgba(234,179,8,0.15)] transform scale-[1.02]"
                        : "border-zinc-800 hover:border-yellow-500/50 hover:bg-zinc-800/50"
                    }`}
                  >
                    {isBestValue && (
                      <div className="absolute -top-3 -right-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                        <Zap className="w-3 h-3 fill-current" />
                        BEST VALUE
                      </div>
                    )}

                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg text-zinc-100">
                        {pkg.name}
                      </h3>
                      {isSelected && (
                        <CheckCircle className="w-5 h-5 text-yellow-500" />
                      )}
                    </div>

                    <div className="flex items-baseline gap-1 my-3">
                      <span className="text-3xl font-black text-yellow-500">
                        {totalCredits}
                      </span>
                      <span className="text-zinc-400 font-medium">Credits</span>
                    </div>

                    {pkg.bonus_credits > 0 && (
                      <div className="text-sm font-medium text-emerald-400 mb-3 bg-emerald-400/10 inline-block px-2 py-1 rounded-md">
                        + {pkg.bonus_credits} Bonus Credits
                      </div>
                    )}

                    <div className="mt-4 pt-4 border-t border-zinc-800">
                      <p className="text-zinc-400 text-sm mb-1">Price</p>
                      <p className="text-xl font-bold text-white">
                        Rp {pkg.price_idr.toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
          <div className="text-zinc-400">
            {selectedPackage ? (
              <p>
                Total bill:{" "}
                <span className="font-bold text-white text-lg">
                  Rp {selectedPackage.price_idr.toLocaleString("id-ID")}
                </span>
              </p>
            ) : (
              <p>Select a package to continue</p>
            )}
          </div>
          <button
            onClick={handleCheckout}
            disabled={!selectedPackage || isPending}
            className={`px-8 py-3 rounded-lg font-bold transition-all shadow-md ${
              !selectedPackage || isPending
                ? "bg-zinc-800 text-zinc-500 cursor-not-allowed shadow-none"
                : "bg-yellow-500 text-zinc-900 hover:bg-yellow-400 hover:shadow-lg hover:shadow-yellow-500/20 active:scale-95"
            }`}
          >
            {isPending ? "Processing..." : "Buy Credits"}
          </button>
        </div>
      </div>
    </div>
  );
};
