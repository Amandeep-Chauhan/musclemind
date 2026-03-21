import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import Card from '@/components/common/Card';
import { SkeletonCard } from '@/components/common/Skeleton';

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
          <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{
              background: 'var(--bg-card, #1e293b)',
              border: '1px solid rgba(148,163,184,0.2)',
              borderRadius: 8,
              fontSize: 12,
            }}
          />
          <Bar dataKey="members" name="Total" radius={[4, 4, 0, 0]} fill="#0078d422">
            {data?.map((_, i) => (
              <Cell key={i} fill="#0078d4" fillOpacity={0.7} />
            ))}
          </Bar>
          <Bar dataKey="active" name="Active" radius={[4, 4, 0, 0]}>
            {data?.map((_, i) => (
              <Cell key={i} fill="#22c55e" fillOpacity={0.85} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
