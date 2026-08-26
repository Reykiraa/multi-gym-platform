import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import GymDiscovery from './pages/user/GymDiscovery';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <main className="max-w-md mx-auto shadow-2xl min-h-screen bg-zinc-950 text-white relative overflow-x-hidden p-6 flex flex-col">
          <Routes>
            <Route path="/user/gyms" element={<GymDiscovery />} />
            <Route path="*" element={<Navigate to="/user/gyms" replace />} />
          </Routes>
        </main>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
