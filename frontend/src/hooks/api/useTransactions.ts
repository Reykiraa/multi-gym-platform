// src/hooks/api/useTransactions.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { AdminTransaction, TopUpPayload } from '../../types/admin';

/** Query key namespace for Transaction data. */
const TXN_QUERY_KEY = ['admin', 'transactions'] as const;

const mockDelay = (ms = 500): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Mock transaction dataset — mirrors GET /api/transactions response.
 */
let mockTransactions: AdminTransaction[] = [
  {
    id: 101,
    user_id: 10,
    user_name: 'Budi Santoso',
    user_email: 'budi@email.com',
    gym_name: 'Iron Works Elite',
    type: 'check-in',
    credit_amount: 8,
    status: 'completed',
    created_at: '2026-08-25T09:30:00Z',
  },
  {
    id: 102,
    user_id: 11,
    user_name: 'Siti Nurhaliza',
    user_email: 'siti@email.com',
    gym_name: 'The Foundry',
    type: 'check-in',
    credit_amount: 6,
    status: 'completed',
    created_at: '2026-08-25T10:15:00Z',
  },
  {
    id: 103,
    user_id: 12,
    user_name: 'Andi Pratama',
    user_email: 'andi@email.com',
    gym_name: 'Apex Studio',
    type: 'topup',
    credit_amount: 50,
    status: 'completed',
    created_at: '2026-08-24T14:00:00Z',
  },
  {
    id: 104,
    user_id: 10,
    user_name: 'Budi Santoso',
    user_email: 'budi@email.com',
    gym_name: 'Flex Space',
    type: 'check-in',
    credit_amount: 10,
    status: 'pending',
    created_at: '2026-08-24T16:30:00Z',
  },
  {
    id: 105,
    user_id: 13,
    user_name: 'Dewi Lestari',
    user_email: 'dewi@email.com',
    gym_name: 'Iron Works Elite',
    type: 'topup',
    credit_amount: 100,
    status: 'completed',
    created_at: '2026-08-23T11:00:00Z',
  },
  {
    id: 106,
    user_id: 14,
    user_name: 'Riko Fadilah',
    user_email: 'riko@email.com',
    gym_name: 'The Foundry',
    type: 'check-in',
    credit_amount: 6,
    status: 'failed',
    created_at: '2026-08-23T08:45:00Z',
  },
];

/**
 * Fetches all transactions for the Admin panel.
 */
export const useTransactions = () =>
  useQuery<AdminTransaction[]>({
    queryKey: TXN_QUERY_KEY,
    queryFn: async () => {
      await mockDelay();
      return [...mockTransactions];
    },
  });

/**
 * Manual top-up mutation — POST /api/users/{id}/topup.
 * On success, injects a new 'topup' transaction and invalidates the list.
 */
export const useManualTopUp = () => {
  const queryClient = useQueryClient();

  return useMutation<AdminTransaction, Error, TopUpPayload>({
    mutationFn: async (payload) => {
      await mockDelay(800);
      const newTxn: AdminTransaction = {
        id: Date.now(),
        user_id: payload.user_id,
        user_name: `User #${payload.user_id}`,
        user_email: `user${payload.user_id}@email.com`,
        gym_name: '-',
        type: 'topup',
        credit_amount: payload.amount,
        status: 'completed',
        created_at: new Date().toISOString(),
      };
      mockTransactions = [newTxn, ...mockTransactions];
      return newTxn;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TXN_QUERY_KEY });
    },
  });
};
