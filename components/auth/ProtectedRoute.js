import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '@/store/slices/authSlice';
import { ROUTES } from '@/utils/constants';
import { hasRole } from '@/utils/helpers';
import { selectUserRole } from '@/store/slices/authSlice';

/**
 * ProtectedRoute – wraps pages that require authentication.
 * Optionally accepts a `requiredRole` to enforce role-based access.
 */
const ProtectedRoute = ({ children, requiredRole = null }) => {
  const router = useRouter();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userRole = useSelector(selectUserRole);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace(ROUTES.LOGIN);
      return;
    }

    if (requiredRole && !hasRole(userRole, requiredRole)) {
      router.replace(ROUTES.DASHBOARD); // Redirect to dashboard if insufficient role
    }
  }, [isAuthenticated, userRole, requiredRole, router]);

  // Not authenticated – show nothing while redirecting
  if (!isAuthenticated) return null;

  // Insufficient role
  if (requiredRole && !hasRole(userRole, requiredRole)) return null;

  return children;
};

export default ProtectedRoute;
