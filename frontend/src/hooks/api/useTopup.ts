import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../lib/axios';
import { AxiosError } from 'axios';
import { useToastStore } from '../../store/toastStore';
import { useAuthStore } from '../../store/authStore';
import { usePaymentStore } from '../../store/paymentStore';
import type { TopupPackage } from '../../types';

export const useTopupPackages = () =>
  useQuery<TopupPackage[]>({
    queryKey: ['topup-packages'],
    queryFn: async () => {
      const response = await apiClient.get('/topup-packages');
      return response.data?.data || [];
    },
  });

export const useCheckoutTopup = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();
  
  return useMutation<{ snap_token: string; order_id: string }, AxiosError<{ message?: string }>, { topup_package_id: string }>({
    mutationFn: async (payload) => {
      const response = await apiClient.post('/topups', payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions', 'history'] });
    },
    onError: (error) => {
      addToast('error', error.response?.data?.message || 'Gagal memulai top-up');
    },
  });
};

export const useCancelTopup = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();

  return useMutation<unknown, AxiosError<{ message?: string }>, { id: string; silent?: boolean }>({
    mutationFn: async ({ id }) => {
      const response = await apiClient.post(`/topups/${id}/cancel`);
      return response.data;
    },
    onSuccess: (_, variables) => {
      // Hanya tampilkan toast jika BUKAN silent cancellation
      if (!variables.silent) {
        addToast('success', 'Transaksi top-up berhasil dibatalkan.');
      }
      queryClient.invalidateQueries({ queryKey: ['transactions', 'history'] });
    },
    onError: (error, variables) => {
      if (!variables.silent) {
        addToast('error', error.response?.data?.message || 'Gagal membatalkan transaksi.');
      }
    }
  });
};

export const useDeleteTopup = () => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, { id: string }>({
    mutationFn: async ({ id }) => {
      const response = await apiClient.delete(`/topups/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions', 'history'] });
    },
  });
};

export const useVerifyTopup = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();
  const { setIsVerifying } = usePaymentStore();

  return useMutation<{ user?: import('../../types').User, data?: { status?: string } }, Error, { orderId: string; showOverlay?: boolean }>({
    mutationFn: async ({ orderId, showOverlay = true }) => {
      // Nyalakan full-screen loading secara global sebelum request
      if (showOverlay) {
        setIsVerifying(true);
      }
      const response = await apiClient.post(`/topups/${orderId}/verify`);
      return response.data;
    },
    onSuccess: (data) => {
      if (data.user) {
        useAuthStore.getState().setUser(data.user);
      }
      addToast('success', 'Top-up berhasil dan saldo telah bertambah!');
      queryClient.invalidateQueries({ queryKey: ['auth', 'user'] });
      queryClient.invalidateQueries({ queryKey: ['transactions', 'history'] });
    },
    onError: () => {
      addToast('info', 'Menunggu pembayaran diselesaikan.');
      queryClient.invalidateQueries({ queryKey: ['transactions', 'history'] });
    },
    onSettled: (_, __, variables) => {
      // Matikan full-screen loading setelah proses selesai (success maupun error)
      const shouldShowOverlay = variables.showOverlay !== undefined ? variables.showOverlay : true;
      if (shouldShowOverlay) {
        setIsVerifying(false);
      }
    },
  });
};