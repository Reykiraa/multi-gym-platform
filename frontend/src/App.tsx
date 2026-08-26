// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// --- Layouts ---
import ProtectedLayout from './layouts/ProtectedLayout';

// --- Guest / Public Pages ---
import LandingPage from './pages/guest/LandingPage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// --- User Pages ---
import GymDiscovery from './pages/user/GymDiscovery';
import GymDetail from './pages/user/GymDetail';
import WalletHistory from './pages/user/WalletHistory';
import Profile from './pages/user/Profile';
import EditProfile from './pages/user/profile/EditProfile';
import PaymentMethods from './pages/user/profile/PaymentMethods';
import Security from './pages/user/profile/Security';
import Notifications from './pages/user/profile/Notifications';

// --- Admin Pages (Placeholder — FE2 Core Phase 2+) ---
import AdminDashboard from './pages/admin/AdminDashboard';

// --- Mitra Pages (Placeholder — FE2 Core Phase 2+) ---
import MitraDashboard from './pages/mitra/MitraDashboard';

// --- Error Pages ---
import ForbiddenPage from './pages/error/ForbiddenPage';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <main className="min-h-screen bg-zinc-950 text-white flex flex-col relative overflow-x-hidden">
          <Routes>
            {/* ------------------------------------------------------------------ */}
            {/* PUBLIC ROUTES                                                       */}
            {/* ------------------------------------------------------------------ */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forbidden" element={<ForbiddenPage />} />

            {/* ------------------------------------------------------------------ */}
            {/* USER PROTECTED ROUTES (role: user)                                 */}
            {/* ------------------------------------------------------------------ */}
            <Route element={<ProtectedLayout allowedRoles={['user']} />}>
              <Route path="/user/discovery" element={<GymDiscovery />} />
              <Route path="/user/gyms" element={<GymDiscovery />} />
              <Route path="/user/gym/:id" element={<GymDetail />} />
              <Route path="/user/wallet" element={<WalletHistory />} />
              <Route path="/user/profile" element={<Profile />} />
              <Route path="/user/profile/edit" element={<EditProfile />} />
              <Route path="/user/profile/payment" element={<PaymentMethods />} />
              <Route path="/user/profile/security" element={<Security />} />
              <Route path="/user/profile/notifications" element={<Notifications />} />
            </Route>

            {/* ------------------------------------------------------------------ */}
            {/* ADMIN PROTECTED ROUTES (role: admin)                               */}
            {/* ------------------------------------------------------------------ */}
            <Route element={<ProtectedLayout allowedRoles={['admin']} />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
            </Route>

            {/* ------------------------------------------------------------------ */}
            {/* MITRA PROTECTED ROUTES (role: mitra)                               */}
            {/* ------------------------------------------------------------------ */}
            <Route element={<ProtectedLayout allowedRoles={['mitra']} />}>
              <Route path="/mitra/dashboard" element={<MitraDashboard />} />
            </Route>

            {/* ------------------------------------------------------------------ */}
            {/* FALLBACK                                                            */}
            {/* ------------------------------------------------------------------ */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
