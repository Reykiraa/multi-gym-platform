import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ActiveCheckIn {
  id: number;
  gym_id: number;
  gym_name: string;
  pin_code: string;
  amount: number;
  expires_at: string;
  status: string;
}

interface CheckInState {
  activeCheckIn: ActiveCheckIn | null;
  isPinModalOpen: boolean;
  setActiveCheckIn: (data: ActiveCheckIn) => void;
  clearActiveCheckIn: () => void;
  setIsPinModalOpen: (isOpen: boolean) => void;
}

export const useCheckInStore = create<CheckInState>()(
  persist(
    (set) => ({
      activeCheckIn: null,
      isPinModalOpen: false,
      setActiveCheckIn: (data) => set({ activeCheckIn: data }),
      clearActiveCheckIn: () => set({ activeCheckIn: null, isPinModalOpen: false }),
      setIsPinModalOpen: (isOpen) => set({ isPinModalOpen: isOpen }),
    }),
    {
      name: 'active-checkin',
    }
  )
);
