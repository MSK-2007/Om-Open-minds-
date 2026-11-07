import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ROUTES } from '@/config/constants';

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

/**
 * ProtectedRoute Component.
 * Enforces client-side authentication guard for administrative views.
 * Unauthenticated users are redirected to /admin/login with location state preserved.
 * Note: Client-side routing guards MUST always be paired with Supabase Row Level Security (RLS)
 * for true server-side data security.
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
        }}
      >
        <LoadingSpinner label="Verifying administrator credentials..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.ADMIN.LOGIN} state={{ from: location }} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

