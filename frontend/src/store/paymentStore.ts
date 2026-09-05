// /frontend/src/store/paymentStore.ts
import { create } from 'zustand';

interface PaymentState {
  isVerifying: boolean;
  setIsVerifying: (isVerifying: boolean) => void;
}

export const usePaymentStore = create<PaymentState>((set) => ({
  isVerifying: false,
  setIsVerifying: (isVerifying) => set({ isVerifying }),
}));
