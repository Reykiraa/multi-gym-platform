// src/store/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthUser, Role } from '../types/auth';

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

  /**
   * Authenticates a user via mock logic (1-second simulated delay).
   * Role assignment rules:
   *  - email contains 'admin'  → role: 'admin'
   *  - email contains 'mitra'  → role: 'mitra'
   *  - otherwise               → role: 'user'
   */
  login: (email: string, password: string) => Promise<void>;

  /** Partially updates the authenticated user's mutable profile fields. */
  updateUser: (data: Partial<UserProfile>) => void;

  /** Clears all auth state (user, token, isAuthenticated). */
  logout: () => void;
}

/** Mock token issued on every successful login. */
const MOCK_TOKEN = 'mock-token-123';

/**
 * Derives the role from the email string for mock auth purposes.
 * Priority: admin > mitra > user.
 */
const deriveRoleFromEmail = (email: string): Role => {
  const lower = email.toLowerCase();
  if (lower.includes('admin')) return 'admin';
  if (lower.includes('mitra')) return 'mitra';
  return 'user';
};

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

      login: async (email: string, _password: string): Promise<void> => {
        // Simulate a 1-second network round-trip.
        await new Promise<void>((resolve) => setTimeout(resolve, 1000));

        const role = deriveRoleFromEmail(email);

        const mockUser: UserProfile = {
          id: 1,
          name: role === 'admin' ? 'Admin Gymnox' : role === 'mitra' ? 'Mitra Partner' : 'Budi Santoso',
          email,
          role,
          credit_balance: role === 'user' ? 50 : 0,
        };

        set({
          user: mockUser,
          token: MOCK_TOKEN,
          isAuthenticated: true,
        });
      },

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
