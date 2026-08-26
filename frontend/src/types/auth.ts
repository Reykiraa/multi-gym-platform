// src/types/auth.ts

/**
 * Defines the allowed user roles in the system.
 * This union type enforces type-safety for role-based access control.
 */
export type Role = 'admin' | 'mitra' | 'user';

/**
 * Represents an authenticated user returned from the login process.
 */
export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: Role;
}

/**
 * Payload used for the Zod-validated login form submission.
 */
export interface LoginPayload {
  email: string;
  password: string;
}
