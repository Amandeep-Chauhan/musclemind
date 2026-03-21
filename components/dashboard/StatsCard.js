import React from 'react';
import styled from 'styled-components';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatNumber, formatPercent } from '@/utils/formatters';
import { SkeletonStat } from '@/components/common/Skeleton';

const Card = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: 20px;
  position: relative;
  overflow: hidden;
  transition: all ${({ theme }) => theme.transitions.fast};
  cursor: default;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.lg};
    transform: translateY(-2px);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${({ $color }) => $color || '#ff3511'};
  }
`;

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const Label = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0;
`;

const IconBox = styled.div`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background: ${({ $color }) => `${$color}22` || '#ff351122'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ $color }) => $color || '#ff3511'};
  flex-shrink: 0;

  svg { width: 20px; height: 20px; }
`;

const Value = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize['4xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.extrabold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0 0 8px;
  line-height: 1;
`;

const Trend = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ $positive, theme }) =>
    $positive ? theme.colors.success : theme.colors.error};

  svg { width: 14px; height: 14px; }
`;

const TrendLabel = styled.span`
  color: ${({ theme }) => theme.colors.textTertiary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.regular};
  margin-left: 2px;
`;

const SubValue = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 6px 0 0;
`;

const BgDecor = styled.div`
  position: absolute;
  bottom: -20px;
  right: -20px;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: ${({ $color }) => `${$color}10` || '#ff351110'};
  pointer-events: none;
`;

const StatsCard = ({
  label,
  value,
  growth,
  subValue,
  icon: Icon,
  color = '#ff3511',
  prefix = '',
  suffix = '',
  loading = false,
}) => {
  if (loading) return <SkeletonStat />;

  const isPositive = growth >= 0;

  return (
    <Card $color={color}>
      <BgDecor $color={color} />
      <Header>
        <Label>{label}</Label>
        {Icon && (
          <IconBox $color={color}>
            <Icon />
          </IconBox>
        )}
      </Header>

      <Value>
        {prefix}
        {typeof value === 'number' ? formatNumber(value) : value}
        {suffix}
      </Value>

      {growth !== undefined && (
        <Trend $positive={isPositive}>
          {isPositive ? <TrendingUp /> : <TrendingDown />}
          {formatPercent(Math.abs(growth))}
          <TrendLabel>vs last month</TrendLabel>
        </Trend>
      )}

      {subValue && <SubValue>{subValue}</SubValue>}
    </Card>
  );
};

export default StatsCard;
