import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../lib/axios';
import { useToastStore } from '../../store/toastStore';
import { useAuthStore } from '../../store/authStore';
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
  
  return useMutation<{ snap_token: string; order_id: string }, Error, { topup_package_id: string }>({
    mutationFn: async (payload) => {
      const response = await apiClient.post('/topups', payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions', 'history'] });
    },
    onError: (error: any) => {
      addToast('error', error.response?.data?.message || 'Gagal memulai top-up');
    },
  });
};

export const useCancelTopup = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();

  return useMutation<any, Error, { id: string; silent?: boolean }>({
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
    onError: (error: any, variables) => {
      if (!variables.silent) {
        addToast('error', error.response?.data?.message || 'Gagal membatalkan transaksi.');
      }
    }
  });
};

export const useVerifyTopup = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();
  const { setUser } = useAuthStore.getState();

  return useMutation<any, Error, { orderId: string }>({
    mutationFn: async ({ orderId }) => {
      const response = await apiClient.post(`/topups/${orderId}/verify`);
      return response.data;
    },
    onSuccess: (data) => {
      if (data.user && setUser) {
        setUser(data.user);
      }
      queryClient.invalidateQueries({ queryKey: ['auth', 'user'] });
      queryClient.invalidateQueries({ queryKey: ['transactions', 'history'] });
    }
  });
};