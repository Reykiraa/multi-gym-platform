import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import Navbar from '../../components/shared/Navbar';
import Input from '../../components/ui/Input';
import GymCard from '../../components/cards/GymCard';
import { type Gym } from '../../types';
import apiClient from '../../lib/axios';
import { useDebounce } from '../../hooks/useDebounce';

interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  total: number;
}

const fetchGyms = async (search: string = '', page: number = 1, perPage: number = 8): Promise<PaginatedResponse<Gym>> => {
  const response = await apiClient.get('/gyms', { params: { search, page, per_page: perPage } });
  return response.data;
};

const GymDiscovery: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(8);
  const debouncedSearchTerm = useDebounce<string>(searchQuery, 300);

  // Reset page to 1 when search or perPage changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, perPage]);

  const { data: gymData, isLoading, isFetching } = useQuery({
    queryKey: ['gyms', debouncedSearchTerm, currentPage, perPage],
    queryFn: () => fetchGyms(debouncedSearchTerm, currentPage, perPage),
    placeholderData: (prev) => prev, // keeps previous data while fetching new page
  });

  const gyms = gymData?.data || [];
  const totalPages = gymData?.last_page || 1;
  const hasNextPage = gymData ? currentPage < totalPages : false;
  const hasPrevPage = currentPage > 1;

  // Pagination Logic
  const getPageNumbers = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 4) return [1, 2, 3, 4, 5, '...', totalPages];
    if (currentPage >= totalPages - 3) return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };

  return (
    <div className="flex flex-col min-h-screen pb-16 md:pb-0"> {/* padding bottom for mobile nav */}
      <Navbar />
      
      <main className="grow container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-8 md:mb-10 max-w-2xl">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white uppercase tracking-tight mb-6">
            Stay <span className='text-yellow-500'>Fit</span>,<br />Anywhere.
          </h1>
          <Input 
            placeholder="Cari nama gym atau lokasi..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="md:text-lg"
          />
        </div>

        {isLoading && gyms.length === 0 ? (
          <div className="text-center text-zinc-500 py-20">Memuat data gym...</div>
        ) : (
          <>
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 transition-opacity duration-200 ${isFetching ? 'opacity-50' : 'opacity-100'}`}>
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

            {/* Pagination Controls */}
            {gymData && gyms.length > 0 && (
              <div className="mt-12 bg-[#121212] border border-zinc-800 rounded-2xl p-4 px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-medium text-zinc-400">
                <div className="hidden md:block">
                  Showing page {currentPage} of {totalPages}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setCurrentPage(1)}
                    disabled={!hasPrevPage}
                    className="p-1.5 rounded-lg border border-transparent hover:border-zinc-800 hover:bg-zinc-800 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:border-transparent transition-colors"
                  >
                    <ChevronsLeft size={16} />
                  </button>
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={!hasPrevPage}
                    className="p-1.5 rounded-lg border border-zinc-800 hover:bg-zinc-800 disabled:opacity-30 transition-colors mr-2"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  {getPageNumbers().map((num, i) => (
                    <button
                      key={i}
                      disabled={num === '...'}
                      onClick={() => typeof num === 'number' && setCurrentPage(num)}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
                        num === currentPage
                          ? 'text-yellow-500'
                          : num === '...'
                          ? 'cursor-default text-zinc-500'
                          : 'hover:text-yellow-500 hover:bg-zinc-800'
                      }`}
                    >
                      {num}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={!hasNextPage}
                    className="p-1.5 rounded-lg border border-zinc-800 hover:bg-zinc-800 disabled:opacity-30 transition-colors ml-2"
                  >
                    <ChevronRight size={16} />
                  </button>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={!hasNextPage}
                    className="p-1.5 rounded-lg border border-transparent hover:border-zinc-800 hover:bg-zinc-800 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:border-transparent transition-colors"
                  >
                    <ChevronsRight size={16} />
                  </button>
                </div>

                <div className="hidden sm:flex items-center gap-3">
                  <span className="hidden sm:inline">Rows per page</span>
                  <select
                    value={perPage}
                    onChange={(e) => setPerPage(Number(e.target.value))}
                    className="bg-transparent border border-zinc-800 rounded-lg p-1.5 px-3 text-white focus:outline-none focus:ring-2 focus:ring-zinc-700 cursor-pointer"
                  >
                    <option value={4} className="bg-zinc-900">4</option>
                    <option value={8} className="bg-zinc-900">8</option>
                    <option value={12} className="bg-zinc-900">12</option>
                    <option value={16} className="bg-zinc-900">16</option>
                  </select>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default GymDiscovery;
