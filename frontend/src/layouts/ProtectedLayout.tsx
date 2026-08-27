// src/layouts/ProtectedLayout.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import type { Role } from '../types/auth';

interface ProtectedLayoutProps {
  /**
   * List of roles that are allowed to access the nested routes.
   * If the authenticated user's role is not in this list, they are
   * redirected to the /forbidden page.
   */
  allowedRoles: Role[];
}

/**
 * Route guard layout component.
 *
 * Renders the child routes (via <Outlet />) only when:
 *  1. The user is authenticated (isAuthenticated === true).
 *  2. The user's role is included in `allowedRoles`.
 *
 * Otherwise, it redirects:
 *  - Unauthenticated users → /login
 *  - Authenticated but unauthorized users → /forbidden (403 fallback)
 */
const ProtectedLayout: React.FC<ProtectedLayoutProps> = ({ allowedRoles }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated || !user) {
    // Not logged in — redirect to login, preserving the intended URL.
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role as Role)) {
    // Logged in but lacks the required role — show 403 fallback.
    return <Navigate to="/forbidden" replace />;
  }

  // Auth + role checks passed — render the nested route.
  return <Outlet />;
};

export default ProtectedLayout;
