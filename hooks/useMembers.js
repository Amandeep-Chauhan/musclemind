import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { membersService } from '@/services/membersService';
import {
  setMembers,
  addMember,
  updateMember,
  deleteMember,
  setSelectedMember,
  clearSelectedMember,
  selectFilteredMembers,
  selectMemberFilters,
  selectMemberPagination,
  setFilters,
  resetFilters,
  setPage,
} from '@/store/slices/membersSlice';
import { QUERY_KEYS } from '@/utils/constants';

export const useMembers = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const filters = useSelector(selectMemberFilters);
  const pagination = useSelector(selectMemberPagination);
  const filteredMembers = useSelector(selectFilteredMembers);

  // Fetch all members
  const { isLoading, isError, error, refetch } = useQuery({
    queryKey: [QUERY_KEYS.MEMBERS, filters],
    queryFn: () => membersService.getAll(filters),
    onSuccess: (data) => dispatch(setMembers(data.data)),
    staleTime: 1000 * 60 * 2,
  });

  // Create member
  const createMutation = useMutation({
    mutationFn: membersService.create,
    onSuccess: (newMember) => {
      dispatch(addMember(newMember));
      queryClient.invalidateQueries([QUERY_KEYS.MEMBERS]);
    },
  });

  // Update member
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => membersService.update(id, data),
    onSuccess: (updated) => {
      dispatch(updateMember(updated));
      queryClient.invalidateQueries([QUERY_KEYS.MEMBERS]);
    },
  });

  // Delete member
  const deleteMutation = useMutation({
    mutationFn: membersService.delete,
    onSuccess: (_, id) => {
      dispatch(deleteMember(id));
      queryClient.invalidateQueries([QUERY_KEYS.MEMBERS]);
    },
  });

  return {
    members: filteredMembers,
    isLoading,
    isError,
    error,
    filters,
    pagination,
    refetch,
    setFilters: (f) => dispatch(setFilters(f)),
    resetFilters: () => dispatch(resetFilters()),
    setPage: (p) => dispatch(setPage(p)),
    selectMember: (m) => dispatch(setSelectedMember(m)),
    clearSelected: () => dispatch(clearSelectedMember()),
    createMember: createMutation.mutate,
    updateMember: updateMutation.mutate,
    deleteMember: deleteMutation.mutate,
    isCreating: createMutation.isLoading,
    isUpdating: updateMutation.isLoading,
    isDeleting: deleteMutation.isLoading,
  };
};

// Fetch single member by ID
export const useMemberById = (id) =>
  useQuery({
    queryKey: [QUERY_KEYS.MEMBER_BY_ID, id],
    queryFn: () => membersService.getById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
