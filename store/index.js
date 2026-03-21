import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import membersReducer from './slices/membersSlice';
import plansReducer from './slices/plansSlice';
import trainersReducer from './slices/trainersSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    members: membersReducer,
    plans: plansReducer,
    trainers: trainersReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for non-serializable values
        ignoredActions: ['auth/loginSuccess'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
