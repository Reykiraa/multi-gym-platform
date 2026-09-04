// src/hooks/api/useMitraAPI.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { ValidatePinPayload, ValidatePinResponse } from '../../types/mitra';
import { type TransactionHistory } from '../../types';
import apiClient from '../../lib/axios';
import { AxiosError } from 'axios';
import { useToastStore } from '../../store/toastStore';

export const useGetTransactions = () =>
  useQuery<TransactionHistory[]>({
    queryKey: ['transactions'],
    queryFn: async () => {
      const response = await apiClient.get('/transactions');
      return response.data?.data || response.data || [];
    },
  });

export const useValidatePin = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();

  return useMutation<ValidatePinResponse, AxiosError<{ message?: string }>, ValidatePinPayload>({
    mutationFn: async (payload) => {
      const response = await apiClient.post('mitra/transactions/validate-pin', payload);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      addToast('success', data.message || 'Validation Successful');
    },
    onError: (error) => {
      addToast('error', error.response?.data?.message || 'An error occurred while validating PIN');
    }
  });
};
