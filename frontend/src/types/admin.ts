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
  mitra_id: number;
  name: string;
  location: string;
  facilities: string[];
  credit_price: number;
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
