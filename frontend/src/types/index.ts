export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  credit_balance: number;
}

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
}
