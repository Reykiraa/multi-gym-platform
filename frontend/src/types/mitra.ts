// src/types/mitra.ts

export interface MitraCheckInEntry {
  id: number;
  user_name: string;
  pin_code: string;
  credit_amount: number;
  status: 'completed' | 'failed' | 'expired';
  created_at: string;
}

export interface ValidatePinPayload {
  pin_code: string;
}

export interface ValidatePinResponse {
  message: string;
  transaction: {
    id: number;
    status: string;
  };
}

export interface MitraHistoryEntry {
  id: string;
  member_initials: string;
  member_name: string;
  member_id: string;
  pin_code: string;
  timestamp: string;
  credit_cost: number;
  settlement_status: 'Disbursed' | 'Pending';
}
