// src/layouts/ProtectedLayout.tsx
import React, { useEffect, useRef } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../store/toastStore';
import type { Role } from '../types/auth';

interface ProtectedLayoutProps {
  /**
   * List of roles that are allowed to access the nested routes.
   * If the authenticated user's role is not in this list, they are
   * redirected to their own dashboard with a toast warning.
   */
  allowedRoles: Role[];
}

/**
 * Maps each role to its home dashboard path.
 * Used for zero-trust redirect: unauthorized users land on their
 * own portal instead of a generic 403 page.
 */
const ROLE_HOME_MAP: Record<Role, string> = {
  admin: '/admin/dashboard',
  mitra: '/mitra/dashboard',
  user: '/user/discovery',
};

/**
 * Zero-trust route guard layout component.
 *
 * Security model:
 *  1. Unauthenticated → redirect to /login (no toast — natural flow).
 *  2. Authenticated but wrong role → redirect to role's home dashboard
 *     WITH a toast error explaining the denial.
 *  3. Authenticated + correct role → render child routes.
 *
 * The toast fires exactly once per redirect attempt via a ref guard,
 * preventing infinite re-render loops from Zustand state updates.
 */
const ProtectedLayout: React.FC<ProtectedLayoutProps> = ({ allowedRoles }) => {
  const { isAuthenticated, user } = useAuthStore();
  const { addToast } = useToastStore();
  const location = useLocation();
  const hasShownToast = useRef(false);

  const isUnauthorized =
    isAuthenticated && user && !allowedRoles.includes(user.role as Role);

  useEffect(() => {
    if (isUnauthorized && !hasShownToast.current) {
      hasShownToast.current = true;
      addToast('error', 'Akses ditolak: Anda tidak memiliki izin untuk halaman ini.');
    }
  }, [isUnauthorized, addToast]);

  // Reset the toast guard when the user navigates to a new path
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

  return <Outlet />;
};

export default ProtectedLayout;
