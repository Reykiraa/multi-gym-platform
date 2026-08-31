// frontend/src/pages/user/GymDetail.tsx

import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import CheckInConfirmModal from '../../components/modals/CheckInConfirmModal';
import Navbar from '../../components/shared/Navbar';
import { type Gym } from '../../types';
import apiClient from '../../lib/axios';
import { useToastStore } from '../../store/toastStore';
import { useAuthStore } from '../../store/authStore';
import { useCheckInStore } from '../../store/checkInStore';

const fetchGym = async (id: number): Promise<Gym> => {
  const response = await apiClient.get(`/gyms/${id}`);
  return response.data;
};

const GymDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { setIsPinModalOpen } = useCheckInStore();
  const { addToast } = useToastStore();
  const { updateUser } = useAuthStore();
  const queryClient = useQueryClient();

  const gymId = id ? parseInt(id, 10) : 0;

  const { data: gym, isLoading: isGymLoading } = useQuery({
    queryKey: ['gym', gymId],
    queryFn: () => fetchGym(gymId),
    enabled: !!gymId,
  });

  // Cek apakah user sudah punya sesi pending aktif
  const activeTx: any = queryClient.getQueryData(['transactions', 'active-pending']);

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await apiClient.post('/transactions/checkin', { gym_id: gymId });
      return res.data;
    },
    onSuccess: async (res: any) => {
      setIsModalOpen(false);

      const payload = res?.data ?? res;
      const normalizedTx = {
        id: Number(payload.id || payload.transaction_id),
        gym_id: Number(payload.gym_id || gymId),
        gym_name: String(payload.gym_name || gym?.name || 'Gym Access'),
        pin_code: String(payload.pin_code),
        amount: Number(payload.amount || gym?.credit_price || 0),
        expires_at: String(payload.expires_at),
        status: 'pending',
      };

      // 1. Suntikkan langsung ke TanStack Cache secara instan
      queryClient.setQueryData(['transactions', 'active-pending'], normalizedTx);

      // 2. Buka Modal PIN seketika
      setIsPinModalOpen(true);

      // 3. Sync Saldo User
      try {
        const userRes = await apiClient.get('/user');
        updateUser(userRes.data);
      } catch (e) {
        console.error('Failed to sync user', e);
      }

      queryClient.invalidateQueries({ queryKey: ['auth', 'user'] });
    },
    onError: (error: any) => {
      addToast('error', error.response?.data?.message || 'Gagal melakukan check-in');
      setIsModalOpen(false);
    }
  });

  if (isGymLoading) {
    return <div className="text-white text-center py-20 min-h-screen flex items-center justify-center">Memuat detail gym...</div>;
  }

  if (!gym) {
    return <div className="text-white text-center py-20 min-h-screen flex items-center justify-center">Gym tidak ditemukan.</div>;
  }

  return (
    <div className="flex flex-col min-h-screen pb-24 md:pb-0 relative">
      <Navbar />

      <main className="flex-grow container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="h-64 md:h-96 bg-gradient-to-br from-zinc-800 to-zinc-900 w-full mb-8 rounded-2xl shadow-xl" />
            
            <div className="px-2 md:px-0">
              <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-3">{gym.name}</h1>
              <p className="text-zinc-400 text-lg mb-8">{gym.location}</p>

              <h2 className="text-xl font-bold text-white mb-4 border-b border-zinc-800 pb-2">Fasilitas</h2>
              <div className="flex flex-wrap gap-3 mb-8">
                {gym.facilities.map((facility, index) => (
                  <Badge key={index} variant="info" className="px-4 py-2 text-sm">
                    {facility}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="md:col-span-1">
            <div className="fixed bottom-14 md:bottom-auto md:static left-0 right-0 w-full md:w-auto p-4 md:p-6 bg-zinc-950/90 backdrop-blur-md md:bg-zinc-900/50 md:backdrop-blur-none border-t border-zinc-800 md:border md:border-zinc-800 z-40 md:rounded-2xl md:sticky md:top-24">
              <div className="hidden md:block mb-4">
                <h3 className="text-zinc-300 font-medium mb-1">Akses Masuk</h3>
                <p className="text-sm text-zinc-500">Tukarkan kredit Anda untuk mendapatkan PIN masuk ke gym ini.</p>
              </div>
              
              <div className="flex justify-between items-center mb-4 md:mb-6">
                <span className="text-zinc-400 font-medium hidden md:inline">Harga:</span>
                <span className="text-yellow-500 font-bold text-xl md:text-2xl">{gym.credit_price} KREDIT</span>
              </div>

              <Button
                variant="primary"
                className="w-full text-lg py-4 shadow-lg shadow-yellow-500/20"
                onClick={() => {
                  if (activeTx && activeTx.status === 'pending') {
                    addToast('error', 'Anda sudah memiliki 1 check-in pending');
                    return;
                  }
                  setIsModalOpen(true);
                }}
              >
                CHECK-IN SEKARANG
              </Button>
            </div>
          </div>
        </div>

        <CheckInConfirmModal
          isOpen={isModalOpen}
          gymName={gym.name}
          creditPrice={gym.credit_price}
          isLoading={mutation.isPending}
          onConfirm={() => mutation.mutate()}
          onCancel={() => setIsModalOpen(false)}
        />
      </main>
    </div>
  );
};

export default GymDetail;