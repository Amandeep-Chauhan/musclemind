import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  theme: 'dark',           // 'light' | 'dark'
  sidebarOpen: true,
  sidebarCollapsed: false,
  activeModal: null,
  notifications: [],
  toasts: [],
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme(state) {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    setTheme(state, action) {
      state.theme = action.payload;
    },
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen(state, action) {
      state.sidebarOpen = action.payload;
    },
    toggleSidebarCollapse(state) {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    openModal(state, action) {
      state.activeModal = action.payload;
    },
    closeModal(state) {
      state.activeModal = null;
    },
    addToast(state, action) {
      state.toasts.push({ id: Date.now(), ...action.payload });
    },
    removeToast(state, action) {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
    setNotifications(state, action) {
      state.notifications = action.payload;
    },
    markNotificationRead(state, action) {
      const n = state.notifications.find((n) => n.id === action.payload);
      if (n) n.read = true;
    },
    markAllNotificationsRead(state) {
      state.notifications.forEach((n) => (n.read = true));
    },
  },
});

export const {
  toggleTheme,
  setTheme,
  toggleSidebar,
  setSidebarOpen,
  toggleSidebarCollapse,
  openModal,
  closeModal,
  addToast,
  removeToast,
  setNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} = uiSlice.actions;

// Selectors
export const selectTheme = (state) => state.ui.theme;
export const selectSidebarOpen = (state) => state.ui.sidebarOpen;
export const selectSidebarCollapsed = (state) => state.ui.sidebarCollapsed;
export const selectActiveModal = (state) => state.ui.activeModal;
export const selectToasts = (state) => state.ui.toasts;
export const selectNotifications = (state) => state.ui.notifications;
export const selectUnreadCount = (state) => state.ui.notifications.filter((n) => !n.read).length;

export default uiSlice.reducer;
