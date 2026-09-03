import React, { useEffect } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import PinDisplay from '../ui/PinDisplay';
import apiClient from '../../lib/axios';
import { useToastStore } from '../../store/toastStore';
import { useAuthStore } from '../../store/authStore';
import { useCheckInStore } from '../../store/checkInStore';
import type { TransactionHistory } from '../../types';
import { AxiosError } from 'axios';

interface PinDisplayModalProps {
  transaction: TransactionHistory;
  onClose: () => void;
}

const cancelCheckIn = async (id: number) => {
  const response = await apiClient.post(`/transactions/${id}/cancel`);
  return response.data;
};

const PinDisplayModal: React.FC<PinDisplayModalProps> = ({ transaction, onClose }) => {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();
  const { updateUser } = useAuthStore();
  const { setIsPinModalOpen } = useCheckInStore();

  // Polling status transaksi secara agresif per 1.5 detik
  const { data: txStatus } = useQuery({
    queryKey: ['transaction-status', transaction?.id],
    queryFn: async () => {
      if (!transaction?.id) return null;
      const res = await apiClient.get(`/transactions/${transaction.id}`);
      return res.data?.data ?? res.data;
    },
    enabled: Boolean(transaction?.id),
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === 'completed' || status === 'expired' || status === 'cancelled' ? false : 1500;
    },
  });

  // Listener Deteksi Sukses Validasi Mitra
  useEffect(() => {
    if (txStatus?.status === 'completed') {
      // 1. Munculkan Toast Notifikasi
      addToast('success', 'Check-in Berhasil divalidasi! Selamat berolahraga.');
      
      // 2. Tutup Modal
      setIsPinModalOpen(false);
      
      // 3. Bersihkan Cache Query
      queryClient.setQueryData(['transactions', 'active-pending'], null);
      
      // 4. Sinkronisasi Saldo Terbaru User
      apiClient.get('/user').then((res) => updateUser(res.data));
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['auth', 'user'] });
    } else if (txStatus?.status === 'expired') {
      addToast('error', 'PIN telah kedaluwarsa.');
      setIsPinModalOpen(false);
      queryClient.setQueryData(['transactions', 'active-pending'], null);
      apiClient.get('/user').then((res) => updateUser(res.data));
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['auth', 'user'] });
    }
  }, [txStatus?.status, addToast, setIsPinModalOpen, updateUser, queryClient]);

  const cancelMutation = useMutation({
    mutationFn: () => cancelCheckIn(Number(transaction.id)),
    onSuccess: () => {
      setIsPinModalOpen(false);
      queryClient.setQueryData(['transactions', 'active-pending'], null);
      
      apiClient.get('/user').then((res) => {
        updateUser(res.data);
      });
      queryClient.invalidateQueries({ queryKey: ['auth', 'user'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      addToast('success', 'Check-in berhasil dibatalkan. Saldo telah dikembalikan.');
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      addToast('error', error.response?.data?.message || 'Gagal membatalkan check-in');
    }
  });

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl w-full max-w-sm flex flex-col overflow-hidden">
        <PinDisplay 
          pinCode={transaction.pin_code} 
          expiresAt={transaction.expires_at}
          onClose={onClose} 
          onCancel={() => cancelMutation.mutate()}
          isCanceling={cancelMutation.isPending}
        />
      </div>
    </div>
  );
};

export default PinDisplayModal;