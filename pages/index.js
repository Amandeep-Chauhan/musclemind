import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '@/store/slices/authSlice';
import { ROUTES } from '@/utils/constants';

/**
 * Root index page — redirects to dashboard if authenticated, else to login.
 */
export default function Home() {
  const router = useRouter();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace(ROUTES.DASHBOARD);
    } else {
      router.replace(ROUTES.LOGIN);
    }
  }, [isAuthenticated, router]);

  return null;
}
