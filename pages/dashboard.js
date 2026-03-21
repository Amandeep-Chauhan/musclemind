import React from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import { Users, DollarSign, Activity, Dumbbell } from 'lucide-react';
import MainLayout from '@/layouts/MainLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import StatsCard from '@/components/dashboard/StatsCard';
import RevenueChart from '@/components/dashboard/RevenueChart';
import MemberGrowthChart from '@/components/dashboard/MemberGrowthChart';
import RecentActivity from '@/components/dashboard/RecentActivity';
import { useDashboard } from '@/hooks/useDashboard';
import { formatCurrency } from '@/utils/formatters';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import Card from '@/components/common/Card';

const Grid4 = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;

  @media (max-width: ${({ theme }) => theme.breakpoints.xl}) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const Grid2 = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 16px;
  margin-bottom: 24px;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
  }
`;

const Grid2Equal = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
  }
`;

const PieLabel = styled.div`
  text-align: center;
  margin-bottom: 8px;
`;

export default function DashboardPage() {
  const { stats, revenue, memberGrowth, planDistribution, activities } = useDashboard();

  const s = stats.data;

  return (
    <ProtectedRoute>
      <Head>
        <title>Dashboard – MuscleMind</title>
      </Head>

      <MainLayout title="Dashboard" subtitle="Welcome back! Here's what's happening today.">

        {/* Stats Row */}
        <Grid4>
          <StatsCard
            label="Total Members"
            value={s?.totalMembers}
            growth={s?.memberGrowthPercent}
            subValue={`${s?.activeMembers} active`}
            icon={Users}
            color="#0078d4"
            loading={stats.isLoading}
          />
          <StatsCard
            label="Monthly Revenue"
            value={s ? formatCurrency(s.totalRevenue) : 0}
            growth={s?.revenueGrowthPercent}
            icon={DollarSign}
            color="#ff3511"
            loading={stats.isLoading}
          />
          <StatsCard
            label="Attendance Rate"
            value={s?.avgAttendanceRate}
            growth={s?.attendanceGrowthPercent}
            suffix="%"
            icon={Activity}
            color="#22c55e"
            loading={stats.isLoading}
          />
          <StatsCard
            label="Active Trainers"
            value={s?.activeTrainers}
            subValue={`${s?.sessionsToday} sessions today`}
            icon={Dumbbell}
            color="#f59e0b"
            loading={stats.isLoading}
          />
        </Grid4>

        {/* Revenue Chart + Plan Distribution */}
        <Grid2>
          <RevenueChart data={revenue.data} loading={revenue.isLoading} />

          <Card>
            <Card.Header>
              <Card.Title>Plan Distribution</Card.Title>
              <Card.Subtitle>Members by subscription</Card.Subtitle>
            </Card.Header>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={planDistribution.data}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {planDistribution.data?.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v, name) => [`${v} members`, name]}
                  contentStyle={{ borderRadius: 8, fontSize: 12 }}
                />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Grid2>

        {/* Member Growth + Recent Activity */}
        <Grid2Equal>
          <MemberGrowthChart data={memberGrowth.data} loading={memberGrowth.isLoading} />
          <RecentActivity data={activities.data} loading={activities.isLoading} />
        </Grid2Equal>

      </MainLayout>
    </ProtectedRoute>
  );
}
