import React from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import { Users, DollarSign, Activity, Dumbbell, AlertTriangle, Clock } from 'lucide-react';
import MainLayout from '@/layouts/MainLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import StatsCard from '@/components/dashboard/StatsCard';
import RevenueChart from '@/components/dashboard/RevenueChart';
import MemberGrowthChart from '@/components/dashboard/MemberGrowthChart';

import { useDashboard } from '@/hooks/useDashboard';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import Card from '@/components/common/Card';
import { dummyMembers } from '@/data/dummyData';

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

const SectionTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 12px;

  svg {
    width: 18px;
    height: 18px;
    color: ${({ $color }) => $color || 'inherit'};
  }
`;

const MiniTable = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: hidden;
`;

const MiniRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  padding: 10px 16px;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ $header, theme }) => ($header ? theme.colors.bgSecondary : 'transparent')};
  color: ${({ $header, theme }) =>
    $header ? theme.colors.textTertiary : theme.colors.textPrimary};
  font-weight: ${({ $header, theme }) =>
    $header ? theme.typography.fontWeight.semibold : theme.typography.fontWeight.normal};
  align-items: center;

  &:last-child {
    border-bottom: none;
  }
`;

const MiniCell = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const MiniAvatar = styled.img`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
`;

const MiniName = styled.div`
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const MiniSub = styled.div`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textTertiary};
  margin-top: 1px;
`;

const MiniPill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  background: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
  white-space: nowrap;
`;

const DaysLeft = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: 600;
  color: ${({ $urgent }) => ($urgent ? '#bc1717' : '#ab7f08')};
`;

const EmptyRow = styled.div`
  text-align: center;
  padding: 24px;
  color: ${({ theme }) => theme.colors.textTertiary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

export default function DashboardPage() {
  const { stats, revenue, memberGrowth, planDistribution } = useDashboard();

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
            color="#f0be1f"
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

        {/* Member Growth + Recently Joined */}
        <Grid2Equal>
          <MemberGrowthChart data={memberGrowth.data} loading={memberGrowth.isLoading} />
          <div>
            <SectionTitle $color="#3da637">
              <Users /> Recently Joined
            </SectionTitle>
            <MiniTable>
              <MiniRow $header>
                <MiniCell>Member</MiniCell>
                <MiniCell>Plan</MiniCell>
                <MiniCell>Joined</MiniCell>
                <MiniCell>Status</MiniCell>
              </MiniRow>
              {[...dummyMembers]
                .sort((a, b) => new Date(b.joinDate) - new Date(a.joinDate))
                .slice(0, 5)
                .map((m) => (
                  <MiniRow key={m.id}>
                    <MiniCell>
                      <MiniAvatar src={m.avatar} alt={m.name} />
                      <div>
                        <MiniName>{m.name}</MiniName>
                        <MiniSub>{m.phone}</MiniSub>
                      </div>
                    </MiniCell>
                    <MiniCell>
                      <MiniPill $bg="#1aa8d418" $color="#116c8e">
                        {m.plan}
                      </MiniPill>
                    </MiniCell>
                    <MiniCell>{formatDate(m.joinDate)}</MiniCell>
                    <MiniCell>
                      <MiniPill
                        $bg={
                          m.status === 'active'
                            ? '#3da63718'
                            : m.status === 'pending'
                              ? '#f0be1f18'
                              : '#94a3b818'
                        }
                        $color={
                          m.status === 'active'
                            ? '#236b1e'
                            : m.status === 'pending'
                              ? '#ab7f08'
                              : '#475569'
                        }
                      >
                        {m.status.charAt(0).toUpperCase() + m.status.slice(1)}
                      </MiniPill>
                    </MiniCell>
                  </MiniRow>
                ))}
            </MiniTable>
          </div>
        </Grid2Equal>

        {/* Upcoming Renewals + Expired Memberships */}
        <Grid2Equal style={{ marginTop: 24 }}>
          {/* Upcoming Renewals */}
          <div>
            <SectionTitle $color="#f0be1f">
              <Clock /> Upcoming Renewals
            </SectionTitle>
            <MiniTable>
              <MiniRow $header>
                <MiniCell>Member</MiniCell>
                <MiniCell>Plan</MiniCell>
                <MiniCell>Expiry</MiniCell>
                <MiniCell>Days Left</MiniCell>
              </MiniRow>
              {(() => {
                const today = new Date();
                const upcoming = dummyMembers
                  .filter((m) => {
                    if (!m.expiryDate || m.status !== 'active') return false;
                    const exp = new Date(m.expiryDate);
                    const diff = Math.ceil((exp - today) / (1000 * 60 * 60 * 24));
                    return diff > 0 && diff <= 30;
                  })
                  .sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));

                if (upcoming.length === 0) {
                  return <EmptyRow>No upcoming renewals in the next 30 days.</EmptyRow>;
                }

                return upcoming.map((m) => {
                  const diff = Math.ceil((new Date(m.expiryDate) - today) / (1000 * 60 * 60 * 24));
                  return (
                    <MiniRow key={m.id}>
                      <MiniCell>
                        <MiniAvatar src={m.avatar} alt={m.name} />
                        <div>
                          <MiniName>{m.name}</MiniName>
                          <MiniSub>{m.phone}</MiniSub>
                        </div>
                      </MiniCell>
                      <MiniCell>
                        <MiniPill $bg="#1aa8d418" $color="#116c8e">
                          {m.plan}
                        </MiniPill>
                      </MiniCell>
                      <MiniCell>{formatDate(m.expiryDate)}</MiniCell>
                      <MiniCell>
                        <DaysLeft $urgent={diff <= 14}>{diff}d</DaysLeft>
                      </MiniCell>
                    </MiniRow>
                  );
                });
              })()}
            </MiniTable>
          </div>

          {/* Expired Memberships */}
          <div>
            <SectionTitle $color="#f44040">
              <AlertTriangle /> Expired Memberships
            </SectionTitle>
            <MiniTable>
              <MiniRow $header>
                <MiniCell>Member</MiniCell>
                <MiniCell>Plan</MiniCell>
                <MiniCell>Expired On</MiniCell>
                <MiniCell>Status</MiniCell>
              </MiniRow>
              {(() => {
                const today = new Date();
                const expired = dummyMembers
                  .filter((m) => {
                    if (!m.expiryDate) return false;
                    return new Date(m.expiryDate) < today;
                  })
                  .sort((a, b) => new Date(b.expiryDate) - new Date(a.expiryDate));

                if (expired.length === 0) {
                  return <EmptyRow>No expired memberships.</EmptyRow>;
                }

                return expired.map((m) => {
                  const daysAgo = Math.ceil(
                    (today - new Date(m.expiryDate)) / (1000 * 60 * 60 * 24)
                  );
                  return (
                    <MiniRow key={m.id}>
                      <MiniCell>
                        <MiniAvatar src={m.avatar} alt={m.name} />
                        <div>
                          <MiniName>{m.name}</MiniName>
                          <MiniSub>{m.phone}</MiniSub>
                        </div>
                      </MiniCell>
                      <MiniCell>
                        <MiniPill $bg="#94a3b818" $color="#475569">
                          {m.plan}
                        </MiniPill>
                      </MiniCell>
                      <MiniCell>{formatDate(m.expiryDate)}</MiniCell>
                      <MiniCell>
                        <MiniPill $bg="#f4404018" $color="#bc1717">
                          {daysAgo}d ago
                        </MiniPill>
                      </MiniCell>
                    </MiniRow>
                  );
                });
              })()}
            </MiniTable>
          </div>
        </Grid2Equal>
      </MainLayout>
    </ProtectedRoute>
  );
}
