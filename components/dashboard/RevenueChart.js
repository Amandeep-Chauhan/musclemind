import React from 'react';
import styled from 'styled-components';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import Card from '@/components/common/Card';
import { SkeletonCard } from '@/components/common/Skeleton';
import { formatCurrency } from '@/utils/formatters';

const CustomTooltipWrapper = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: 12px 16px;
  box-shadow: ${({ theme }) => theme.shadows.lg};

  p { margin: 4px 0; font-size: 13px; }
  .label { font-weight: 600; color: ${({ theme }) => theme.colors.textPrimary}; margin-bottom: 8px; }
  .revenue { color: #1aa8d4; }
  .profit { color: #22c55e; }
`;

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <CustomTooltipWrapper>
      <p className="label">{label}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey} className={entry.dataKey}>
          {entry.name}: {formatCurrency(entry.value)}
        </p>
      ))}
    </CustomTooltipWrapper>
  );
};

/**
 * Revenue = total money coming in (membership fees, PT fees, etc.)
 * Profit  = revenue minus expenses (what's actually earned after costs)
 */
export default function RevenueChart({ data, loading }) {
  if (loading) return <SkeletonCard />;

  return (
    <Card>
      <Card.Header actions={<span style={{ fontSize: 12, color: '#64748b' }}>Last 7 months</span>}>
        <Card.Title>Revenue Overview</Card.Title>
        <Card.Subtitle>Monthly revenue & profit trends</Card.Subtitle>
      </Card.Header>

      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#1aa8d4" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#1aa8d4" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="profGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" />
          <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false}
            tickFormatter={(v) => `$${v / 1000}k`} />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: 12, paddingTop: 16 }}
          />
          <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#1aa8d4"
            strokeWidth={2.5} fill="url(#revGrad)" dot={false} activeDot={{ r: 5 }} />
          <Area type="monotone" dataKey="profit" name="Profit" stroke="#22c55e"
            strokeWidth={2.5} fill="url(#profGrad)" dot={false} activeDot={{ r: 5 }} />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}
