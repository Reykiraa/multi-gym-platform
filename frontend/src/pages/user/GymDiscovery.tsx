import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, SearchX, ArrowDownUp, ArrowDown, ArrowUp, ChevronDown } from 'lucide-react';
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

interface GymFilters {
  search?: string;
  max_price?: number;
  facility?: string;
  sort?: string;
}

const fetchGyms = async (filters: GymFilters, page: number = 1, perPage: number = 8): Promise<PaginatedResponse<Gym>> => {
  const response = await apiClient.get('/gyms', { 
    params: { ...filters, page, per_page: perPage } 
  });
  return response.data;
};

const GymDiscovery: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [facility, setFacility] = useState('');
  const [sortOrder, setSortOrder] = useState(''); // '' means Rekomendasi
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(8);
  const debouncedSearchTerm = useDebounce<string>(searchQuery, 300);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [facilitySearch, setFacilitySearch] = useState('');
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const FACILITIES = [
    "Cardio", "Free Weights", "Yoga", "24/7 Access", 
    "Swimming Pool", "Sauna", "Crossfit", 
    "Personal Training", "Group Classes", 
    "Locker Room", "Cafe / Nutrition Bar"
  ];

  const toggleSort = () => {
    setSortOrder(prev => {
      if (prev === '') return 'price_asc';
      if (prev === 'price_asc') return 'price_desc';
      return '';
    });
  };

  const filters: GymFilters = {
    search: debouncedSearchTerm,
    facility: facility !== '' ? facility : undefined,
    sort: sortOrder,
  };

  // Reset page to 1 when filters or perPage changes without triggering cascading renders in effect
  const filterKey = `${debouncedSearchTerm}-${facility}-${sortOrder}-${perPage}`;
  const [prevFilterKey, setPrevFilterKey] = React.useState(filterKey);
  
  if (filterKey !== prevFilterKey) {
    setPrevFilterKey(filterKey);
    setCurrentPage(1);
  }

  const { data: gymData, isLoading, isFetching } = useQuery({
    queryKey: ['gyms', filters, currentPage, perPage],
    queryFn: () => fetchGyms(filters, currentPage, perPage),
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
    <div className="flex flex-col h-full relative">
      
      <main className="grow container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-8 md:mb-10 max-w-4xl">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white uppercase tracking-tight mb-6">
            Stay <span className='text-yellow-500'>Fit</span>,<br />Anywhere.
          </h1>
          
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-grow w-full">
              <Input 
                placeholder="Search gym name or location..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="md:text-lg w-full"
              />
            </div>

            <div className="flex flex-row w-full md:w-auto gap-3 sm:gap-4 shrink-0">
              <div className="relative flex-[7] md:flex-none md:min-w-[200px]" ref={dropdownRef}>
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`w-full flex items-center justify-between bg-zinc-800 border ${isDropdownOpen ? 'border-yellow-500 ring-1 ring-yellow-500' : 'border-zinc-700 hover:border-zinc-600'} rounded-lg px-4 py-3 outline-none transition-all md:text-lg`}
              >
                <span className={facility ? "text-white" : "text-zinc-400"}>{facility || 'All Facilities'}</span>
                <ChevronDown size={20} className={`text-zinc-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isDropdownOpen && (
                <div className="absolute top-full mt-2 w-full bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl z-50 overflow-hidden">
                  <div className="p-2 border-b border-zinc-700">
                    <input 
                      type="text"
                      placeholder="Search facilities..."
                      value={facilitySearch}
                      onChange={e => setFacilitySearch(e.target.value)}
                      className="w-full bg-zinc-900 text-white px-3 py-2 rounded-md outline-none text-sm border border-zinc-700 focus:border-yellow-500 transition-colors placeholder:text-zinc-500"
                    />
                  </div>
                  <div className="max-h-64 overflow-y-auto scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    <button
                       onClick={() => { setFacility(''); setIsDropdownOpen(false); }}
                       className={`w-full text-left px-4 py-3 text-sm hover:bg-zinc-700 transition-colors ${facility === '' ? 'text-yellow-500 bg-zinc-700/50 font-semibold' : 'text-zinc-300'}`}
                    >
                      All Facilities
                    </button>
                    {FACILITIES.filter(f => f.toLowerCase().includes(facilitySearch.toLowerCase())).length > 0 ? (
                      FACILITIES.filter(f => f.toLowerCase().includes(facilitySearch.toLowerCase())).map(f => (
                        <button
                          key={f}
                          onClick={() => { setFacility(f); setIsDropdownOpen(false); }}
                          className={`w-full text-left px-4 py-3 text-sm hover:bg-zinc-700 transition-colors ${facility === f ? 'text-yellow-500 bg-zinc-700/50 font-semibold' : 'text-zinc-300'}`}
                        >
                          {f}
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-4 text-sm text-zinc-500 text-center">Fasilitas tidak ditemukan</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={toggleSort}
              className={`flex-[3] md:flex-none flex items-center gap-1 sm:gap-2 border rounded-lg px-2 sm:px-6 py-3 outline-none transition-all md:text-lg font-medium justify-center ${
                sortOrder !== '' 
                  ? 'bg-yellow-500 text-black border-yellow-500' 
                  : 'bg-zinc-800 text-white border-zinc-700 hover:border-yellow-500'
              }`}
            >
              Price
              {sortOrder === 'price_asc' ? <ArrowUp size={20} /> : sortOrder === 'price_desc' ? <ArrowDown size={20} /> : <ArrowDownUp size={20} className="text-zinc-500" />}
            </button>
          </div>
          </div>
        </div>

        {isLoading && gyms.length === 0 ? (
          <div className="text-center text-zinc-500 py-20">Loading gyms...</div>
        ) : (
          <>
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 transition-opacity duration-200 ${isFetching ? 'opacity-50' : 'opacity-100'}`}>
              {gyms.length > 0 ? (
                gyms.map((gym, index) => (
                  <motion.div
                    key={gym.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <GymCard gym={gym} />
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full py-20 flex flex-col items-center justify-center text-center bg-zinc-900/50 rounded-3xl border border-zinc-800 border-dashed">
                  <SearchX size={64} className="text-zinc-600 mb-6" />
                  <h3 className="text-xl font-bold text-white mb-2">Tidak ada hasil ditemukan</h3>
                  <p className="text-zinc-400 max-w-md mb-8">
                    Tidak ada gym yang sesuai dengan kriteria pencarian Anda. Coba kurangi filter atau ubah kata kunci pencarian.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setFacility('');
                      setSortOrder('');
                    }}
                    className="px-6 py-2.5 rounded-lg border border-yellow-500/50 text-yellow-500 hover:bg-yellow-500 hover:text-black font-semibold transition-colors"
                  >
                    Reset Filter
                  </button>
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
