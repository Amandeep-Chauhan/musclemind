import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  trainers: [],
  selectedTrainer: null,
  filters: { search: '', status: 'all', specialization: 'all' },
  isLoading: false,
  error: null,
};

const trainersSlice = createSlice({
  name: 'trainers',
  initialState,
  reducers: {
    setTrainers(state, action) {
      state.trainers = action.payload;
    },
    addTrainer(state, action) {
      state.trainers.unshift(action.payload);
    },
    updateTrainer(state, action) {
      const idx = state.trainers.findIndex((t) => t.id === action.payload.id);
      if (idx !== -1) state.trainers[idx] = { ...state.trainers[idx], ...action.payload };
    },
    deleteTrainer(state, action) {
      state.trainers = state.trainers.filter((t) => t.id !== action.payload);
    },
    setSelectedTrainer(state, action) {
      state.selectedTrainer = action.payload;
    },
    clearSelectedTrainer(state) {
      state.selectedTrainer = null;
    },
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
    },
    setLoading(state, action) {
      state.isLoading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
});

export const {
  setTrainers,
  addTrainer,
  updateTrainer,
  deleteTrainer,
  setSelectedTrainer,
  clearSelectedTrainer,
  setFilters,
  setLoading,
  setError,
} = trainersSlice.actions;

export const selectTrainers = (state) => state.trainers.trainers;
export const selectSelectedTrainer = (state) => state.trainers.selectedTrainer;
export const selectTrainersLoading = (state) => state.trainers.isLoading;

export const selectFilteredTrainers = (state) => {
  const { trainers, filters } = state.trainers;
  return trainers.filter((t) => {
    const matchSearch =
      !filters.search || t.name.toLowerCase().includes(filters.search.toLowerCase());
    const matchStatus = filters.status === 'all' || t.status === filters.status;
    const matchSpec =
      filters.specialization === 'all' ||
      t.specializations.some((s) => s.toLowerCase().includes(filters.specialization.toLowerCase()));
    return matchSearch && matchStatus && matchSpec;
  });
};

export default trainersSlice.reducer;
