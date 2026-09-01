import { useQuery, useMutation } from '@tanstack/react-query';
import apiClient from '../../lib/axios';
import { useToastStore } from '../../store/toastStore';
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
  const { addToast } = useToastStore();
  
  return useMutation<{ snap_token: string; order_id: string }, Error, { topup_package_id: string }>({
    mutationFn: async (payload) => {
      const response = await apiClient.post('/topups', payload);
      return response.data;
    },
    onError: (error: any) => {
      addToast('error', error.response?.data?.message || 'Gagal memulai top-up');
    },
  });
};

export const useVerifyTopup = () => {
  return useMutation<any, Error, { orderId: string }>({
    mutationFn: async ({ orderId }) => {
      const response = await apiClient.post(`/topups/${orderId}/verify`);
      return response.data;
    },
  });
};