import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { useMutation } from '@tanstack/react-query';
import {
  loginStart,
  loginSuccess,
  loginFailure,
  logout as logoutAction,
  selectCurrentUser,
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
  selectUserRole,
} from '@/store/slices/authSlice';
import { authService } from '@/services/authService';
import { ROUTES, ROLES } from '@/utils/constants';
import { hasRole, hasAnyRole } from '@/utils/helpers';

export const useAuth = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const role = useSelector(selectUserRole);

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: authService.login,
    onMutate: () => dispatch(loginStart()),
    onSuccess: (data) => {
      dispatch(loginSuccess(data));
      router.push(ROUTES.DASHBOARD);
    },
    onError: (err) => dispatch(loginFailure(err.message)),
  });

  // Signup mutation
  const signupMutation = useMutation({
    mutationFn: authService.signup,
    onMutate: () => dispatch(loginStart()),
    onSuccess: (data) => {
      dispatch(loginSuccess(data));
      router.push(ROUTES.DASHBOARD);
    },
    onError: (err) => dispatch(loginFailure(err.message)),
  });

  // Logout
  const logout = async () => {
    await authService.logout();
    dispatch(logoutAction());
    router.push(ROUTES.LOGIN);
  };

  return {
    user,
    role,
    isAuthenticated,
    isLoading,
    error,
    login: loginMutation.mutate,
    signup: signupMutation.mutate,
    logout,
    // Role helpers
    isSuperAdmin: role === ROLES.SUPER_ADMIN,
    isAdmin: hasRole(role, ROLES.ADMIN),
    isTrainer: role === ROLES.TRAINER,
    isClient: role === ROLES.CLIENT,
    can: (requiredRole) => hasRole(role, requiredRole),
    hasAnyRole: (roles) => hasAnyRole(role, roles),
  };
};
