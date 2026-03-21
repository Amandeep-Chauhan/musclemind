import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  members: [],
  selectedMember: null,
  filters: {
    search: '',
    status: 'all',
    plan: 'all',
    trainer: 'all',
  },
  pagination: {
    page: 1,
    pageSize: 10,
    total: 0,
  },
  isLoading: false,
  error: null,
};

const membersSlice = createSlice({
  name: 'members',
  initialState,
  reducers: {
    setMembers(state, action) {
      state.members = action.payload;
      state.pagination.total = action.payload.length;
    },
    addMember(state, action) {
      state.members.unshift(action.payload);
      state.pagination.total += 1;
    },
    updateMember(state, action) {
      const idx = state.members.findIndex((m) => m.id === action.payload.id);
      if (idx !== -1) state.members[idx] = { ...state.members[idx], ...action.payload };
    },
    deleteMember(state, action) {
      state.members = state.members.filter((m) => m.id !== action.payload);
      state.pagination.total -= 1;
    },
    setSelectedMember(state, action) {
      state.selectedMember = action.payload;
    },
    clearSelectedMember(state) {
      state.selectedMember = null;
    },
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.page = 1;
    },
    resetFilters(state) {
      state.filters = initialState.filters;
      state.pagination.page = 1;
    },
    setPage(state, action) {
      state.pagination.page = action.payload;
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
  setMembers,
  addMember,
  updateMember,
  deleteMember,
  setSelectedMember,
  clearSelectedMember,
  setFilters,
  resetFilters,
  setPage,
  setLoading,
  setError,
} = membersSlice.actions;

// Selectors
export const selectMembers = (state) => state.members.members;
export const selectSelectedMember = (state) => state.members.selectedMember;
export const selectMemberFilters = (state) => state.members.filters;
export const selectMemberPagination = (state) => state.members.pagination;
export const selectMembersLoading = (state) => state.members.isLoading;

export const selectFilteredMembers = (state) => {
  const { members, filters } = state.members;
  return members.filter((m) => {
    const matchSearch =
      !filters.search ||
      m.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      m.email.toLowerCase().includes(filters.search.toLowerCase());
    const matchStatus = filters.status === 'all' || m.status === filters.status;
    const matchPlan = filters.plan === 'all' || m.plan.toLowerCase() === filters.plan.toLowerCase();
    const matchTrainer = filters.trainer === 'all' || m.trainerId === filters.trainer;
    return matchSearch && matchStatus && matchPlan && matchTrainer;
  });
};

export default membersSlice.reducer;
