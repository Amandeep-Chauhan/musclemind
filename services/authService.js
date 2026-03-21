import api from './api';
import { dummyUsers } from '@/data/dummyData';

// Mock delay to simulate network request
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export const authService = {
  /**
   * Login with email and password.
   * Replace mock implementation with real API call.
   */
  async login({ email, password }) {
    await delay(800);

    // Mock authentication – find user by email
    const user = dummyUsers.find((u) => u.email === email);
    if (!user || password !== 'password123') {
      throw { message: 'Invalid email or password.' };
    }

    const token = `mock-jwt-token-${user.id}-${Date.now()}`;
    return { user, token };

    // Real implementation:
    // return api.post('/auth/login', { email, password });
  },

  /**
   * Register a new user.
   */
  async signup({ name, email, password, role = 'client' }) {
    await delay(1000);

    if (dummyUsers.find((u) => u.email === email)) {
      throw { message: 'An account with this email already exists.' };
    }

    const newUser = {
      id: `u${Date.now()}`,
      name,
      email,
      role,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=ff3511&color=fff`,
      joinDate: new Date().toISOString().split('T')[0],
      status: 'active',
    };

    const token = `mock-jwt-token-${newUser.id}`;
    return { user: newUser, token };

    // Real implementation:
    // return api.post('/auth/signup', { name, email, password, role });
  },

  /**
   * Logout the current user.
   */
  async logout() {
    await delay(300);
    return { success: true };
    // return api.post('/auth/logout');
  },

  /**
   * Get the currently authenticated user from server.
   */
  async getMe() {
    await delay(500);
    return dummyUsers[0];
    // return api.get('/auth/me');
  },

  /**
   * Request a password reset email.
   */
  async forgotPassword(email) {
    await delay(600);
    return { message: 'Password reset link sent to ' + email };
    // return api.post('/auth/forgot-password', { email });
  },

  /**
   * Reset password with token.
   */
  async resetPassword({ token, password }) {
    await delay(800);
    return { message: 'Password reset successful.' };
    // return api.post('/auth/reset-password', { token, password });
  },
};
