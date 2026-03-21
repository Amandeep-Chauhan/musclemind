import React from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import { Users, UserCheck, UserX, Clock } from 'lucide-react';
import MainLayout from '@/layouts/MainLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import MemberList from '@/components/members/MemberList';
import StatsCard from '@/components/dashboard/StatsCard';
import { useMembers } from '@/hooks/useMembers';
import { dummyMembers } from '@/data/dummyData';
import { useDispatch } from 'react-redux';
import { setMembers } from '@/store/slices/membersSlice';
import { useEffect } from 'react';

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  margin-bottom: 24px;

  @media (max-width: ${({ theme }) => theme.breakpoints.xl}) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

export default function MembersPage() {
  const dispatch = useDispatch();
  const { members, isLoading, filters, setFilters } = useMembers();

  // Seed members from dummy data on first load
  useEffect(() => {
    dispatch(setMembers(dummyMembers));
  }, [dispatch]);

  const active = members.filter((m) => m.status === 'active').length;
  const inactive = members.filter((m) => m.status === 'inactive').length;
  const pending = members.filter((m) => m.status === 'pending').length;

  return (
    <ProtectedRoute>
      <Head>
        <title>Members – MuscleMind</title>
      </Head>

      <MainLayout title="Member Management" subtitle="View, manage and track all gym members.">
        <StatsRow>
          <StatsCard label="Total Members" value={members.length} icon={Users} color="#0078d4" />
          <StatsCard label="Active" value={active} icon={UserCheck} color="#22c55e" />
          <StatsCard label="Inactive" value={inactive} icon={UserX} color="#94a3b8" />
          <StatsCard label="Pending" value={pending} icon={Clock} color="#f59e0b" />
        </StatsRow>

        <MemberList
          members={members}
          loading={isLoading}
          filters={filters}
          onFilterChange={setFilters}
        />
      </MainLayout>
    </ProtectedRoute>
  );
}
