// src/types/admin.ts

import type { Role } from './auth';

/**
 * Represents a Gym entity as returned by GET /api/gyms.
 * Fields align with API_Contract_FE2_Core.md §2.1.
 */
export interface AdminGym {
  id: number;
  mitra_id: number;
  mitra_name: string;
  name: string;
  location: string;
  facilities: string[];
  credit_price: number;
  created_at: string;
}

/**
 * Payload for creating or updating a Gym via POST/PUT /api/gyms.
 */
export interface GymFormPayload {
  mitra_name: string;
  mitra_email: string;
  mitra_password?: string;
  name: string;
  location: string;
  facilities: string[];
  credit_price: number;
}

/**
 * Payload for adding a gym branch with a new dedicated mitra account.
 * Each branch gets its own mitra login to manage their gym independently.
 * Used with POST /api/gyms/branch.
 */
export interface GymBranchPayload {
  mitra_org_id: number;
  branch_name: string;
  branch_email: string;
  branch_password?: string;
  name: string;
  location: string;
  facilities: string[];
  credit_price: number;
}

/**
 * Represents a Mitra organization returned by GET /api/mitras.
 */
export interface AdminMitra {
  id: number;
  name: string;
  contact_email: string | null;
  contact_phone: string | null;
  address: string | null;
  description: string | null;
  gyms_count: number;
  branch_accounts_count: number;
  created_at: string;
}

/**
 * Payload for creating or updating a Mitra organization via POST/PUT /api/mitras.
 */
export interface MitraFormPayload {
  name: string;
  contact_email?: string;
  contact_phone?: string;
  address?: string;
  description?: string;
}

/**
 * Minimal mitra projection used by dropdowns (e.g. the old GET /users/mitras flow
 * or any hook that needs a lightweight id/name/email tuple).
 */
export interface MitraOption {
  id: number;
  name: string;
  email: string;
}

/**
 * Represents a Transaction record as returned by GET /api/transactions.
 */
export interface AdminTransaction {
  id: number;
  user_id: number;
  user_name: string;
  user_email: string;
  gym_name: string;
  type: 'check-in' | 'topup';
  credit_amount: number;
  status: 'completed' | 'pending' | 'failed' | 'expired';
  created_at: string;
}

/**
 * Payload for the manual top-up action: POST /api/users/{id}/topup.
 */
export interface TopUpPayload {
  user_id: number;
  amount: number;
  notes?: string;
}

/**
 * Summary card data for the Admin Dashboard overview.
 */
export interface AdminStats {
  total_gyms: number;
  total_users: number;
  total_transactions: number;
  total_revenue: number;
}

/**
 * Represents a User as returned by GET /api/users.
 */
export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: Role;
  credit_balance: number;
}
