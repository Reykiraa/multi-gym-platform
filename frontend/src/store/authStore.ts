// src/store/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthUser } from '../types/auth';

/**
 * Extended user profile used by FE1 user-facing pages (Profile, Wallet, etc.).
 * Kept for backward compatibility — FE1 components consume `user` as `UserProfile`.
 */
export interface UserProfile extends AuthUser {
  phone?: string;
  credit_balance: number;
}

interface AuthState {
  /** The authenticated user, null when logged out. */
  user: UserProfile | null;
  /** JWT or mock session token. */
  token: string | null;
  /** Derived flag — true when both user and token are present. */
  isAuthenticated: boolean;

  /** Sets the authenticated user and token */
  setAuth: (user: UserProfile, token: string) => void;

  /** Partially updates the authenticated user's mutable profile fields. */
  updateUser: (data: Partial<UserProfile>) => void;

  /** Clears all auth state (user, token, isAuthenticated). */
  logout: () => void;
}

/**
 * Global auth store using Zustand with session persistence.
 * Persists token + user to localStorage so page refreshes don't log out.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setAuth: (user, token) => set({
        user,
        token,
        isAuthenticated: true
      }),

      updateUser: (data) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        })),

      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'gymnox-auth-storage',
      // Only persist the essential fields; derive isAuthenticated on rehydration.
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
