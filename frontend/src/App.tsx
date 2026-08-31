// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// --- Layouts ---
import ProtectedLayout from './layouts/ProtectedLayout';
import AdminLayout from './layouts/AdminLayout';
import MitraLayout from './layouts/MitraLayout';

// --- Global UI ---
import ToastContainer from './components/ui/ToastContainer';

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

// --- Admin Pages ---
import AdminDashboard from './pages/admin/AdminDashboard';
import GymManager from './pages/admin/GymManager';
import MitraManager from './pages/admin/MitraManager';
import Transactions from './pages/admin/Transactions';

// --- Mitra Pages ---
import MitraDashboard from './pages/mitra/MitraDashboard';
import MitraHistory from './pages/mitra/MitraHistory';

// --- Error Pages ---
import ForbiddenPage from './pages/error/ForbiddenPage';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* ------------------------------------------------------------------ */}
          {/* PUBLIC ROUTES                                                       */}
          {/* ------------------------------------------------------------------ */}
          <Route
            path="/"
            element={
              <main className="min-h-screen bg-zinc-950 text-white flex flex-col relative overflow-x-hidden">
                <LandingPage />
              </main>
            }
          />
          <Route
            path="/login"
            element={
              <main className="min-h-screen bg-zinc-950 text-white flex flex-col relative overflow-x-hidden">
                <Login />
              </main>
            }
          />
          <Route
            path="/register"
            element={
              <main className="min-h-screen bg-zinc-950 text-white flex flex-col relative overflow-x-hidden">
                <Register />
              </main>
            }
          />
          <Route
            path="/forbidden"
            element={
              <main className="min-h-screen bg-zinc-950 text-white flex flex-col relative overflow-x-hidden">
                <ForbiddenPage />
              </main>
            }
          />

          {/* ------------------------------------------------------------------ */}
          {/* USER PROTECTED ROUTES (role: user)                                 */}
          {/* ------------------------------------------------------------------ */}
          <Route
            element={
              <main className="min-h-screen bg-zinc-950 text-white flex flex-col relative overflow-x-hidden">
                <ProtectedLayout allowedRoles={['user']} />
              </main>
            }
          >
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
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/gyms" element={<GymManager />} />
              <Route path="/admin/mitras" element={<MitraManager />} />
              <Route path="/admin/transactions" element={<Transactions />} />
            </Route>
          </Route>

          {/* ------------------------------------------------------------------ */}
          {/* MITRA PROTECTED ROUTES (role: mitra)                               */}
          {/* ------------------------------------------------------------------ */}
          <Route element={<ProtectedLayout allowedRoles={['mitra']} />}>
            <Route element={<MitraLayout />}>
              <Route path="/mitra/dashboard" element={<MitraDashboard />} />
              <Route path="/mitra/history" element={<MitraHistory />} />
            </Route>
          </Route>

          {/* ------------------------------------------------------------------ */}
          {/* FALLBACK                                                            */}
          {/* ------------------------------------------------------------------ */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        
        <ToastContainer />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
