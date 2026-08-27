// src/hooks/api/useMitraAPI.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { MitraCheckInEntry, ValidatePinPayload, ValidatePinResponse, MitraHistoryEntry } from '../../types/mitra';

const ENTRIES_QUERY_KEY = ['mitra', 'recent-entries'] as const;
const HISTORY_QUERY_KEY = ['mitra', 'check-in-history'] as const;

const mockDelay = (ms = 500): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

let mockEntries: MitraCheckInEntry[] = [
  { id: 201, user_name: 'Budi Santoso', pin_code: '4829', credit_amount: 8, status: 'completed', created_at: new Date().toISOString() },
  { id: 202, user_name: 'Siti Nurhaliza', pin_code: '7153', credit_amount: 8, status: 'completed', created_at: new Date(Date.now() - 30 * 60_000).toISOString() },
  { id: 203, user_name: 'Andi Pratama', pin_code: '9461', credit_amount: 8, status: 'completed', created_at: new Date(Date.now() - 75 * 60_000).toISOString() },
  { id: 204, user_name: 'Dewi Lestari', pin_code: '0000', credit_amount: 8, status: 'failed', created_at: new Date(Date.now() - 120 * 60_000).toISOString() },
];

export const useRecentEntries = () =>
  useQuery<MitraCheckInEntry[]>({
    queryKey: ENTRIES_QUERY_KEY,
    queryFn: async () => {
      await mockDelay();
      return [...mockEntries];
    },
  });

export const useValidatePin = () => {
  const queryClient = useQueryClient();

  return useMutation<ValidatePinResponse, Error, ValidatePinPayload>({
    mutationFn: async (payload) => {
      await mockDelay(1000);
      if (payload.pin_code === '0000') throw new Error('PIN tidak valid atau sudah kedaluwarsa');
      const newEntry: MitraCheckInEntry = {
        id: Date.now(),
        user_name: `Member #${Math.floor(Math.random() * 900 + 100)}`,
        pin_code: payload.pin_code,
        credit_amount: 8,
        status: 'completed',
        created_at: new Date().toISOString(),
      };
      mockEntries = [newEntry, ...mockEntries];
      return { message: 'Validation successful', transaction: { id: newEntry.id, status: 'completed' } };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ENTRIES_QUERY_KEY });
    },
  });
};

const mockHistoryEntries: MitraHistoryEntry[] = [
  { id: '1', member_initials: 'JD', member_name: 'J. Doe', member_id: 'ID: 8291', pin_code: '8492', timestamp: '2023-10-24T18:30:00Z', credit_cost: 5, settlement_status: 'Disbursed' },
  { id: '2', member_initials: 'AS', member_name: 'A. Smith', member_id: 'ID: 7432', pin_code: '1042', timestamp: '2023-10-24T17:45:00Z', credit_cost: 8, settlement_status: 'Pending' },
  { id: '3', member_initials: 'MR', member_name: 'M. Rossi', member_id: 'ID: 9921', pin_code: '5531', timestamp: '2023-10-24T16:20:00Z', credit_cost: 5, settlement_status: 'Disbursed' },
  { id: '4', member_initials: 'LK', member_name: 'L. Kim', member_id: 'ID: 4102', pin_code: '9920', timestamp: '2023-10-24T15:10:00Z', credit_cost: 12, settlement_status: 'Pending' },
];

export const useCheckInHistory = () =>
  useQuery<MitraHistoryEntry[]>({
    queryKey: HISTORY_QUERY_KEY,
    queryFn: async () => {
      await mockDelay(600);
      return [...mockHistoryEntries];
    },
  });
