import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import { TOKEN_KEY } from '@/utils/constants';

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart(state) {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess(state, action) {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
      Cookies.set(TOKEN_KEY, action.payload.token, { expires: 7 });
    },
    loginFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      Cookies.remove(TOKEN_KEY);
    },
    updateUser(state, action) {
      state.user = { ...state.user, ...action.payload };
    },
    setToken(state, action) {
      state.token = action.payload;
      state.isAuthenticated = true;
    },
    clearError(state) {
      state.error = null;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, updateUser, setToken, clearError } =
  authSlice.actions;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.isLoading;
export const selectAuthError = (state) => state.auth.error;
export const selectUserRole = (state) => state.auth.user?.role;

export default authSlice.reducer;
