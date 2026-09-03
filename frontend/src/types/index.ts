export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
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
  photos?: string[];
  maps_url?: string;
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
  id: string;
  topup_package_id?: string | null;
  type: "deduction" | "topup";
  gym_name: string;
  amount: number;
  created_at: string;
  expires_at: Transaction['expires_at'];
  user: User;
  status: string;
  pin_code: string;
  order_id?: string;
  snap_token?: string;
}

export interface TopupPackage {
  id: string;
  name: string;
  price_idr: number;
  credits: number;
  bonus_credits: number;
  is_active: boolean;
}

// Global declaration for Midtrans Snap
declare global {
  interface Window {
    snap: {
      pay: (
        snapToken: string,
        callbacks: {
          onSuccess?: (result: unknown) => void;
          onPending?: (result: unknown) => void;
          onError?: (result: unknown) => void;
          onClose?: () => void;
        }
      ) => void;
    };
  }
}
