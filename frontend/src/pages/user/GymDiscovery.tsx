import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '../../components/shared/Navbar';
import Input from '../../components/ui/Input';
import GymCard from '../../components/cards/GymCard';
import { type Gym } from '../../types';

const fetchGyms = async (): Promise<Gym[]> => {
  // Mock API call
  return [
    {
      id: 1,
      name: "Iron Works Elite",
      location: "Jakarta Selatan",
      facilities: ["Free Weights", "Cardio", "Sauna"],
      credit_price: 8
    },
    {
      id: 2,
      name: "The Foundry",
      location: "Bandung",
      facilities: ["Crossfit", "Locker Room", "Cafe"],
      credit_price: 6
    },
    {
      id: 3,
      name: "Apex Studio",
      location: "Surabaya",
      facilities: ["Yoga", "Pilates", "Shower"],
      credit_price: 4
    }
  ];
};

const GymDiscovery: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: gyms = [], isLoading } = useQuery({
    queryKey: ['gyms'],
    queryFn: fetchGyms,
  });

  const filteredGyms = gyms.filter(gym => 
    gym.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    gym.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold text-white uppercase tracking-tight mb-4">
            Stay Fit,<br />Anywhere.
          </h1>
          <Input 
            placeholder="Cari nama gym atau lokasi..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {isLoading ? (
          <div className="text-center text-zinc-500 py-10">Memuat data gym...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-8">
            {filteredGyms.length > 0 ? (
              filteredGyms.map(gym => (
                <GymCard key={gym.id} gym={gym} />
              ))
            ) : (
              <div className="col-span-full text-center text-zinc-500 py-10">
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
