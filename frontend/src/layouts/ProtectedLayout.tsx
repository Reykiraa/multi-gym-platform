import React, { useEffect, useRef, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../store/toastStore';
import { useCheckInStore } from '../store/checkInStore';
import { useQuery } from '@tanstack/react-query';
import { Ticket } from 'lucide-react';
import type { Role } from '../types/auth';
import apiClient from '../lib/axios';
import PinDisplayModal from '../components/modals/PinDisplayModal';

interface ProtectedLayoutProps {
  allowedRoles: Role[];
}

const ROLE_HOME_MAP: Record<Role, string> = {
  admin: '/admin/dashboard',
  mitra: '/mitra/dashboard',
  user: '/user/discovery',
};

const ProtectedLayout: React.FC<ProtectedLayoutProps> = ({ allowedRoles }) => {
  const { isAuthenticated, user, token } = useAuthStore();
  const { addToast } = useToastStore();
  const { isPinModalOpen, setIsPinModalOpen } = useCheckInStore();
  const location = useLocation();
  const hasShownToast = useRef(false);
  const [cachedTx, setCachedTx] = useState<any>(null);

  const isUnauthorized =
    isAuthenticated && user && !allowedRoles.includes(user.role as Role);

  // Sumber kebenaran data transaksi aktif dari server
  const { data: activeTx } = useQuery({
    queryKey: ['transactions', 'active-pending'],
    queryFn: async () => {
      const response = await apiClient.get('/transactions/active-pending');
      return response.data?.data ?? null;
    },
    enabled: isAuthenticated && !!token && user?.role === 'user',
    refetchInterval: 10000,
    staleTime: 1000 * 10,
  });

  // Simpan data transaksi aktif untuk modal agar tidak hilang saat transisi unmount
  useEffect(() => {
    if (activeTx) {
      setCachedTx(activeTx);
    }
  }, [activeTx]);

  const hasActiveSession = Boolean(activeTx && activeTx.status === 'pending');
  const shouldShowFab = hasActiveSession && !isPinModalOpen;

  useEffect(() => {
    if (isUnauthorized && !hasShownToast.current) {
      hasShownToast.current = true;
      addToast('error', 'Access denied: You do not have permission for this page.');
    }
  }, [isUnauthorized, addToast]);

  useEffect(() => {
    hasShownToast.current = false;
  }, [location.pathname]);

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (isUnauthorized) {
    const homePath = ROLE_HOME_MAP[user.role as Role] ?? '/';
    return <Navigate to={homePath} replace />;
  }

  const currentTransaction = activeTx || cachedTx;

  return (
    <>
      <Outlet />

      {/* Contextual FAB */}
      {shouldShowFab && user?.role === 'user' && (
        <button
          onClick={() => setIsPinModalOpen(true)}
          className="fixed bottom-24 right-6 md:bottom-10 md:right-10 z-[100] flex h-14 w-14 items-center justify-center rounded-full shadow-[0_0_20px_rgba(234,179,8,0.4)] hover:scale-110 transition-all duration-300 group bg-yellow-500 text-black hover:bg-yellow-400"
          title="View Check-in PIN"
        >
          <Ticket size={28} className="animate-pulse" />
          <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-red-500 animate-bounce" />
        </button>
      )}

      {/* PIN Display Modal: Tetap di-render selama isPinModalOpen true agar listener notifikasi sempat berjalan */}
      {isPinModalOpen && currentTransaction && (
        <PinDisplayModal 
          transaction={currentTransaction} 
          onClose={() => setIsPinModalOpen(false)} 
        />
      )}
    </>
  );
};

export default ProtectedLayout;