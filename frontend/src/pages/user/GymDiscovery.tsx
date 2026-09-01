import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '../../components/shared/Navbar';
import Input from '../../components/ui/Input';
import GymCard from '../../components/cards/GymCard';
import { type Gym } from '../../types';
import apiClient from '../../lib/axios';
import { useDebounce } from '../../hooks/useDebounce';

const fetchGyms = async (search: string = ''): Promise<Gym[]> => {
  const response = await apiClient.get('/gyms', { params: { search } });
  return response.data;
};

const GymDiscovery: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchTerm = useDebounce<string>(searchQuery, 300);

  const { data: gyms = [], isLoading } = useQuery({
    queryKey: ['gyms', debouncedSearchTerm],
    queryFn: () => fetchGyms(debouncedSearchTerm),
  });

  return (
    <div className="flex flex-col min-h-screen pb-16 md:pb-0"> {/* padding bottom for mobile nav */}
      <Navbar />
      
      <main className="flex-grow container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-8 md:mb-10 max-w-2xl">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white uppercase tracking-tight mb-6">
            Stay Fit,<br />Anywhere.
          </h1>
          <Input 
            placeholder="Cari nama gym atau lokasi..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="md:text-lg"
          />
        </div>

        {isLoading ? (
          <div className="text-center text-zinc-500 py-20">Memuat data gym...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {gyms.length > 0 ? (
              gyms.map(gym => (
                <GymCard key={gym.id} gym={gym} />
              ))
            ) : (
              <div className="col-span-full text-center text-zinc-500 py-20 bg-zinc-900/50 rounded-2xl border border-zinc-800 border-dashed">
                Gym tidak ditemukan.
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default GymDiscovery;
