export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'mitra' | 'user';
  credit_balance: number;
  pending_credits?: number;
  available_credits?: number;
  mitra_org_id?: number | null;
  tier?: string;
  total_visits?: number;
  member_since?: string;
  created_at?: string;
  updated_at?: string;
}

export type UserProfile = User;

export interface Gym {
  id: number;
  name: string;
  location: string;
  facilities: string[];
  credit_price: number;
}

export interface Transaction {
  id: number;
  amount: number;
  pin_code: string;
  status: string;
  expires_at: string;
}

export interface TransactionHistory {
  id: number;
  type: "deduction" | "topup";
  gym_name: string;
  amount: number;
  created_at: string;
  expires_at: Transaction['expires_at'];
  user: User;
  status: string;
  pin_code: string;
}
