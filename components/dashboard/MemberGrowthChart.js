import React from 'react';
import styled from 'styled-components';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import Card from '@/components/common/Card';
import { SkeletonCard } from '@/components/common/Skeleton';

const TooltipWrapper = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: 12px 16px;
  box-shadow: ${({ theme }) => theme.shadows.lg};
  min-width: 140px;
`;

const TooltipLabel = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 8px;
`;

const TooltipRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
  padding: 3px 0;
`;

const TooltipDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  flex-shrink: 0;
`;

const TooltipName = styled.span`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const TooltipValue = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-variant-numeric: tabular-nums;
`;

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <TooltipWrapper>
      <TooltipLabel>{label}</TooltipLabel>
      {payload.map((entry) => (
        <TooltipRow key={entry.dataKey}>
          <TooltipName>
            <TooltipDot $color={entry.color || entry.fill} />
            {entry.name}
          </TooltipName>
          <TooltipValue>{entry.value}</TooltipValue>
        </TooltipRow>
      ))}
    </TooltipWrapper>
  );
};

export default function MemberGrowthChart({ data, loading }) {
  if (loading) return <SkeletonCard />;

  return (
    <Card>
      <Card.Header>
        <Card.Title>Member Growth</Card.Title>
        <Card.Subtitle>Total vs active members per month</Card.Subtitle>
      </Card.Header>

      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12, fill: '#64748b' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(148,163,184,0.08)' }} />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
          <Bar
            dataKey="members"
            name="Total"
            radius={[4, 4, 0, 0]}
            fill="#1aa8d4"
            fillOpacity={0.7}
          />
          <Bar
            dataKey="active"
            name="Active"
            radius={[4, 4, 0, 0]}
            fill="#3da637"
            fillOpacity={0.85}
          />
          <Bar
            dataKey="newJoined"
            name="New Joined"
            radius={[4, 4, 0, 0]}
            fill="#5b5bec"
            fillOpacity={0.8}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
