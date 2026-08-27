import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import CheckInConfirmModal from '../../components/modals/CheckInConfirmModal';
import PinDisplay from '../../components/ui/PinDisplay';
import Navbar from '../../components/shared/Navbar';
import { type Gym, type Transaction } from '../../types';
import apiClient from '../../lib/axios';

const fetchGym = async (id: number): Promise<Gym> => {
  const response = await apiClient.get(`/gyms/${id}`);
  return response.data;
};

const checkIn = async (gymId: number): Promise<{ message: string, transaction: Transaction }> => {
  const response = await apiClient.post('/transactions/checkin', { gym_id: gymId });
  return response.data;
};

const GymDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transaction, setTransaction] = useState<Transaction | null>(null);

  const gymId = id ? parseInt(id, 10) : 0;

  const { data: gym, isLoading: isGymLoading } = useQuery({
    queryKey: ['gym', gymId],
    queryFn: () => fetchGym(gymId),
    enabled: !!gymId,
  });

  const mutation = useMutation({
    mutationFn: () => checkIn(gymId),
    onSuccess: (data) => {
      setIsModalOpen(false);
      setTransaction(data.transaction);
    },
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

      {transaction ? (
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex-grow flex items-center justify-center">
          <PinDisplay pinCode={transaction.pin_code} expiresAt={transaction.expires_at} />
        </div>
      ) : (
        <main className="flex-grow container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Content (Image & Details) */}
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

            {/* Right Content (Sticky Bottom on Mobile, Sidebar on Desktop) */}
            <div className="md:col-span-1">
              {/* Note: bottom-16 to avoid overlapping with bottom nav on mobile */}
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
                  onClick={() => setIsModalOpen(true)}
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
      )}
    </div>
  );
};

export default GymDetail;
