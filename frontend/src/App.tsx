import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import GymDiscovery from './pages/user/GymDiscovery';
import GymDetail from './pages/user/GymDetail';
import WalletHistory from './pages/user/WalletHistory';
import Profile from './pages/user/Profile';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <main className="min-h-screen bg-zinc-950 text-white flex flex-col relative overflow-x-hidden">
          <Routes>
            <Route path="/user/gyms" element={<GymDiscovery />} />
            <Route path="/user/gym/:id" element={<GymDetail />} />
            <Route path="/user/wallet" element={<WalletHistory />} />
            <Route path="/user/profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="/user/gyms" replace />} />
          </Routes>
        </main>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
