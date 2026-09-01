// /frontend/src/components/modals/TopupModal.tsx
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
            addToast('success', 'Top-up berhasil dan saldo telah bertambah!');
            // Invalidate cache secara paralel
            queryClient.invalidateQueries({ queryKey: ['auth', 'user'] });
            queryClient.invalidateQueries({ queryKey: ['transactions', 'history'] });
          } else {
            addToast('info', 'Menunggu pembayaran diselesaikan.');
            queryClient.invalidateQueries({ queryKey: ['transactions', 'history'] });
          }
          onClose();
        },
        onError: () => {
          addToast('info', 'Menunggu pembayaran diselesaikan.');
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
            window.snap.pay(data.snap_token, {
              onSuccess: () => handlePaymentSync(data.order_id),
              onPending: () => handlePaymentSync(data.order_id),
              onClose: () => handlePaymentSync(data.order_id),
              onError: () => {
                addToast("error", "Pembayaran gagal.");
                onClose();
              },
            });
          } else {
            addToast("error", "Payment gateway tidak tersedia.");
          }
        },
      },
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Beli Saldo Kredit
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Pilih paket yang sesuai dengan kebutuhan fitness-mu.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
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
                        ? "border-indigo-600 bg-indigo-50 shadow-md transform scale-[1.02]"
                        : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50"
                    }`}
                  >
                    {isBestValue && (
                      <div className="absolute -top-3 -right-3 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                        <Zap className="w-3 h-3 fill-current" />
                        BEST VALUE
                      </div>
                    )}

                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg text-gray-800">
                        {pkg.name}
                      </h3>
                      {isSelected && (
                        <CheckCircle className="w-5 h-5 text-indigo-600" />
                      )}
                    </div>

                    <div className="flex items-baseline gap-1 my-3">
                      <span className="text-3xl font-black text-indigo-700">
                        {totalCredits}
                      </span>
                      <span className="text-gray-600 font-medium">Credits</span>
                    </div>

                    {pkg.bonus_credits > 0 && (
                      <div className="text-sm font-medium text-emerald-600 mb-3 bg-emerald-50 inline-block px-2 py-1 rounded-md">
                        + {pkg.bonus_credits} Bonus Credits
                      </div>
                    )}

                    <div className="mt-4 pt-4 border-t border-gray-200/60">
                      <p className="text-gray-500 text-sm mb-1">Harga</p>
                      <p className="text-xl font-bold text-gray-900">
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
        <div className="p-6 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
          <div className="text-gray-600">
            {selectedPackage ? (
              <p>
                Total tagihan:{" "}
                <span className="font-bold text-gray-900 text-lg">
                  Rp {selectedPackage.price_idr.toLocaleString("id-ID")}
                </span>
              </p>
            ) : (
              <p>Pilih paket untuk melanjutkan</p>
            )}
          </div>
          <button
            onClick={handleCheckout}
            disabled={!selectedPackage || isPending}
            className={`px-8 py-3 rounded-lg font-bold text-white transition-all shadow-md ${
              !selectedPackage || isPending
                ? "bg-gray-300 cursor-not-allowed shadow-none"
                : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg active:scale-95"
            }`}
          >
            {isPending ? "Memproses..." : "Beli Kredit"}
          </button>
        </div>
      </div>
    </div>
  );
};
