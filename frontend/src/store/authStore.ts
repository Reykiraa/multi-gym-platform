import { create } from 'zustand';

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone?: string;
  credit_balance: number;
  role: string;
}

interface AuthState {
  user: UserProfile | null;
  updateUser: (data: Partial<UserProfile>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: {
    id: 1,
    name: "Budi Santoso",
    email: "budi@email.com",
    phone: "081234567890",
    credit_balance: 50,
    role: "user"
  },
  updateUser: (data) => set((state) => ({
    user: state.user ? { ...state.user, ...data } : null
  })),
  logout: () => set({ user: null })
}));
