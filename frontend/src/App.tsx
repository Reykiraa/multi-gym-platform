import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import GymDiscovery from './pages/user/GymDiscovery';
import GymDetail from './pages/user/GymDetail';
import WalletHistory from './pages/user/WalletHistory';
import Profile from './pages/user/Profile';

// Guest & Auth Pages
import LandingPage from './pages/guest/LandingPage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Profile Sub-pages
import EditProfile from './pages/user/profile/EditProfile';
import PaymentMethods from './pages/user/profile/PaymentMethods';
import Security from './pages/user/profile/Security';
import Notifications from './pages/user/profile/Notifications';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <main className="min-h-screen bg-zinc-950 text-white flex flex-col relative overflow-x-hidden">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* User Main Routes */}
            <Route path="/user/gyms" element={<GymDiscovery />} />
            <Route path="/user/gym/:id" element={<GymDetail />} />
            <Route path="/user/wallet" element={<WalletHistory />} />
            <Route path="/user/profile" element={<Profile />} />

            {/* Profile Sub Routes */}
            <Route path="/user/profile/edit" element={<EditProfile />} />
            <Route path="/user/profile/payment" element={<PaymentMethods />} />
            <Route path="/user/profile/security" element={<Security />} />
            <Route path="/user/profile/notifications" element={<Notifications />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
