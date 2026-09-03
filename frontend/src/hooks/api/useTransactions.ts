// src/hooks/api/useTransactions.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { AdminTransaction, TopUpPayload } from '../../types/admin';
import apiClient from '../../lib/axios';
import { AxiosError } from 'axios';
import { useToastStore } from '../../store/toastStore';

/** Query key namespace for Transaction data. */
const TXN_QUERY_KEY = ['admin', 'transactions'] as const;

/**
 * Fetches all transactions for the Admin panel.
 */
export const useTransactions = () =>
  useQuery<AdminTransaction[]>({
    queryKey: TXN_QUERY_KEY,
    queryFn: async () => {
      const response = await apiClient.get('/transactions');
      return response.data?.data || response.data || [];
    },
  });

/**
 * Manual top-up mutation — POST /api/users/{id}/topup.
 * On success, injects a new 'topup' transaction and invalidates the list.
 */
export const useManualTopUp = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();

  return useMutation<AdminTransaction, AxiosError<{ message?: string }>, TopUpPayload>({
    mutationFn: async (payload) => {
      const response = await apiClient.post(`/users/${payload.user_id}/topup`, {
        amount: payload.amount,
        notes: payload.notes,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TXN_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      addToast('success', 'Top-Up berhasil!');
    },
    onError: (error) => {
      addToast('error', error.response?.data?.message || 'Gagal melakukan top-up');
    }
  });
};
