import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  plans: [],
  selectedPlan: null,
  isLoading: false,
  error: null,
};

const plansSlice = createSlice({
  name: 'plans',
  initialState,
  reducers: {
    setPlans(state, action) {
      state.plans = action.payload;
    },
    addPlan(state, action) {
      state.plans.push(action.payload);
    },
    updatePlan(state, action) {
      const idx = state.plans.findIndex((p) => p.id === action.payload.id);
      if (idx !== -1) state.plans[idx] = { ...state.plans[idx], ...action.payload };
    },
    deletePlan(state, action) {
      state.plans = state.plans.filter((p) => p.id !== action.payload);
    },
    setSelectedPlan(state, action) {
      state.selectedPlan = action.payload;
    },
    clearSelectedPlan(state) {
      state.selectedPlan = null;
    },
    setLoading(state, action) {
      state.isLoading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
});

export const { setPlans, addPlan, updatePlan, deletePlan, setSelectedPlan, clearSelectedPlan, setLoading, setError } =
  plansSlice.actions;

export const selectPlans = (state) => state.plans.plans;
export const selectSelectedPlan = (state) => state.plans.selectedPlan;
export const selectPlansLoading = (state) => state.plans.isLoading;

export default plansSlice.reducer;
