import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import { Plus, Search } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import MainLayout from '@/layouts/MainLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import TrainerCard from '@/components/trainers/TrainerCard';
import StatsCard from '@/components/dashboard/StatsCard';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { Dumbbell, Star, Users } from 'lucide-react';
import {
  setTrainers,
  selectFilteredTrainers,
  setFilters,
} from '@/store/slices/trainersSlice';
import { dummyTrainers } from '@/data/dummyData';
import { useAuth } from '@/hooks/useAuth';

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  margin-bottom: 24px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;

  @media (max-width: ${({ theme }) => theme.breakpoints.xl}) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const EmptyState = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 64px 24px;
  color: ${({ theme }) => theme.colors.textTertiary};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
`;

export default function TrainersPage() {
  const dispatch = useDispatch();
  const trainers = useSelector(selectFilteredTrainers);
  const { isAdmin, isSuperAdmin } = useAuth();
  const canManage = isAdmin || isSuperAdmin;
  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(setTrainers(dummyTrainers));
  }, [dispatch]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    dispatch(setFilters({ search: e.target.value }));
  };

  const avgRating = trainers.length
    ? (trainers.reduce((s, t) => s + t.rating, 0) / trainers.length).toFixed(1)
    : 0;

  const totalClients = trainers.reduce((s, t) => s + t.activeClients, 0);

  return (
    <ProtectedRoute>
      <Head>
        <title>Trainers – MuscleMind</title>
      </Head>

      <MainLayout title="Trainer Management" subtitle="Manage your expert trainer team.">
        <StatsRow>
          <StatsCard label="Total Trainers" value={trainers.length} icon={Dumbbell} color="#ff3511" />
          <StatsCard label="Avg. Rating" value={avgRating} icon={Star} color="#f59e0b" />
          <StatsCard label="Active Clients" value={totalClients} icon={Users} color="#22c55e" />
        </StatsRow>

        <Header>
          <Input
            placeholder="Search trainers..."
            leftIcon={<Search size={16} />}
            value={search}
            onChange={handleSearch}
            fullWidth={false}
            style={{ width: 260 }}
          />
          {canManage && (
            <Button icon={<Plus size={16} />}>Add Trainer</Button>
          )}
        </Header>

        <Grid>
          {trainers.length === 0 ? (
            <EmptyState>💪 No trainers found.</EmptyState>
          ) : (
            trainers.map((trainer) => (
              <TrainerCard
                key={trainer.id}
                trainer={trainer}
                onEdit={(t) => console.warn('Edit:', t.name)}
                onDelete={(t) => confirm(`Remove ${t.name}?`)}
              />
            ))
          )}
        </Grid>
      </MainLayout>
    </ProtectedRoute>
  );
}
