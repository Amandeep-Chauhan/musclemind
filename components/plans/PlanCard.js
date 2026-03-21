import React from 'react';
import styled from 'styled-components';
import { Check, X } from 'lucide-react';
import Button from '@/components/common/Button';
import { formatCurrency } from '@/utils/formatters';
import { useAuth } from '@/hooks/useAuth';
import { ROLES } from '@/utils/constants';

const Card = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 2px solid ${({ $popular, $color, theme }) =>
    $popular ? $color : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  padding: 28px;
  position: relative;
  transition: all ${({ theme }) => theme.transitions.fast};
  display: flex;
  flex-direction: column;

  &:hover {
    box-shadow: ${({ $color }) => `0 0 30px ${$color}33`};
    transform: translateY(-4px);
  }
`;

const PopularBadge = styled.div`
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: ${({ $color }) => $color};
  color: white;
  padding: 4px 16px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  white-space: nowrap;
`;

const PlanHeader = styled.div`
  text-align: center;
  margin-bottom: 24px;
`;

const PlanEmoji = styled.div`
  font-size: 40px;
  margin-bottom: 12px;
`;

const PlanName = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0 0 6px;
`;

const PlanDesc = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
`;

const PriceRow = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 4px;
  margin: 20px 0;
`;

const Price = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize['5xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.extrabold};
  color: ${({ $color }) => $color};
`;

const Cycle = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textTertiary};
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  margin: 20px 0;
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 24px;
  flex: 1;
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 7px 0;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ $excluded, theme }) =>
    $excluded ? theme.colors.textTertiary : theme.colors.textPrimary};
  text-decoration: ${({ $excluded }) => $excluded ? 'line-through' : 'none'};

  svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    color: ${({ $excluded, $color, theme }) =>
      $excluded ? theme.colors.textTertiary : $color};
  }
`;

const UsageBar = styled.div`
  margin-top: 16px;
`;

const UsageLabel = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 6px;
`;

const BarTrack = styled.div`
  height: 6px;
  background: ${({ theme }) => theme.colors.bgHover};
  border-radius: 3px;
  overflow: hidden;
`;

const BarFill = styled.div`
  height: 100%;
  width: ${({ $pct }) => $pct}%;
  background: ${({ $color }) => $color};
  border-radius: 3px;
  transition: width 0.8s ease;
`;

export default function PlanCard({ plan }) {
  const { isAdmin, isSuperAdmin } = useAuth();
  const canManage = isAdmin || isSuperAdmin;

  const usagePct = Math.round((plan.currentMembers / plan.maxMembers) * 100);

  return (
    <Card $popular={plan.popular} $color={plan.color}>
      {plan.popular && <PopularBadge $color={plan.color}>⭐ Most Popular</PopularBadge>}

      <PlanHeader>
        <PlanEmoji>{plan.icon}</PlanEmoji>
        <PlanName>{plan.name}</PlanName>
        <PlanDesc>{plan.description}</PlanDesc>
      </PlanHeader>

      <PriceRow>
        <Price $color={plan.color}>${plan.price}</Price>
        <Cycle>/month</Cycle>
      </PriceRow>

      <Button
        fullWidth
        variant={plan.popular ? 'primary' : 'outline'}
        style={plan.popular ? {} : { borderColor: plan.color, color: plan.color }}
      >
        {plan.popular ? '🔥 Get Started' : 'Choose Plan'}
      </Button>

      <Divider />

      <FeatureList>
        {plan.features.map((f) => (
          <FeatureItem key={f} $color={plan.color}>
            <Check />
            {f}
          </FeatureItem>
        ))}
        {plan.notIncluded?.map((f) => (
          <FeatureItem key={f} $excluded>
            <X />
            {f}
          </FeatureItem>
        ))}
      </FeatureList>

      {canManage && (
        <UsageBar>
          <UsageLabel>
            <span>Capacity</span>
            <span>{plan.currentMembers} / {plan.maxMembers} members</span>
          </UsageLabel>
          <BarTrack>
            <BarFill $pct={usagePct} $color={
              usagePct >= 90 ? '#ef4444' : usagePct >= 70 ? '#f59e0b' : plan.color
            } />
          </BarTrack>
        </UsageBar>
      )}
    </Card>
  );
}
