// src/store/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';

interface AuthState {
  /** The authenticated user, null when logged out. */
  user: User | null;
  /** JWT or mock session token. */
  token: string | null;
  /** Derived flag — true when both user and token are present. */
  isAuthenticated: boolean;

  /** Sets the authenticated user and token */
  setAuth: (user: User, token: string) => void;

  /** Partially updates the authenticated user's mutable profile fields. */
  updateUser: (data: Partial<User> | User) => void;

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
      name: 'auth-storage',
      // Only persist the essential fields; derive isAuthenticated on rehydration.
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
