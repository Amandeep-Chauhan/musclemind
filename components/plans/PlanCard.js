import React from 'react';
import styled from 'styled-components';
import { Check, X, Users } from 'lucide-react';
import Button from '@/components/common/Button';
import { useAuth } from '@/hooks/useAuth';

const Card = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ $popular, $color, theme }) => $popular ? `${$color}55` : theme.colors.border};
  border-radius: 20px;
  overflow: hidden;
  position: relative;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
  display: flex;
  flex-direction: column;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.05);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06);
    border-color: ${({ $color }) => `${$color}66`};
  }
`;

const CardHeader = styled.div`
  background: ${({ $color }) => `linear-gradient(135deg, ${$color}dd 0%, ${$color}88 100%)`};
  padding: 28px 24px 24px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -30px;
    right: -30px;
    width: 120px;
    height: 120px;
    background: rgba(255, 255, 255, 0.12);
    border-radius: 50%;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -20px;
    left: 20px;
    width: 80px;
    height: 80px;
    background: rgba(255, 255, 255, 0.08);
    border-radius: 50%;
  }
`;

const PopularBadge = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  background: white;
  color: ${({ $color }) => $color};
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
  z-index: 1;
`;

const PlanEmoji = styled.div`
  font-size: 38px;
  margin-bottom: 10px;
  position: relative;
  z-index: 1;
`;

const PlanName = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.extrabold};
  color: white;
  margin: 0 0 6px;
  position: relative;
  z-index: 1;
`;

const PlanDesc = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: rgba(255, 255, 255, 0.85);
  margin: 0;
  position: relative;
  z-index: 1;
  line-height: 1.5;
`;

const CardBody = styled.div`
  padding: 24px;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const PriceRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Currency = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 4px;
`;

const Price = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize['5xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.extrabold};
  color: ${({ theme }) => theme.colors.textPrimary};
  line-height: 1;
`;

const Cycle = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textTertiary};
  margin-left: 2px;
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 24px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 0;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ $excluded, theme }) =>
    $excluded ? theme.colors.textTertiary : theme.colors.textPrimary};

  svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    color: ${({ $excluded, $color, theme }) =>
      $excluded ? theme.colors.textTertiary : $color};
  }
`;

const FeatureText = styled.span`
  text-decoration: ${({ $excluded }) => $excluded ? 'line-through' : 'none'};
`;

const UsageBar = styled.div`
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const UsageLabel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const UsageTitle = styled.span`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textSecondary};

  svg { width: 13px; height: 13px; }
`;

const UsageCount = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textTertiary};
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
  background: ${({ $color, $pct }) =>
    $pct >= 90 ? '#f44040' : $pct >= 70 ? '#f0be1f' : $color};
  border-radius: 3px;
  transition: width 0.8s ease;
`;

export default function PlanCard({ plan }) {
  const { isAdmin, isSuperAdmin } = useAuth();
  const canManage = isAdmin || isSuperAdmin;
  const usagePct = Math.round((plan.currentMembers / plan.maxMembers) * 100);

  return (
    <Card $popular={plan.popular} $color={plan.color}>
      <CardHeader $color={plan.color}>
        {plan.popular && <PopularBadge $color={plan.color}>⭐ Most Popular</PopularBadge>}
        <PlanEmoji>{plan.icon}</PlanEmoji>
        <PlanName>{plan.name}</PlanName>
        <PlanDesc>{plan.description}</PlanDesc>
      </CardHeader>

      <CardBody>
        <PriceRow>
          <Currency>₹</Currency>
          <Price>{plan.price.toLocaleString()}</Price>
          <Cycle>/ {plan.billingCycle}</Cycle>
        </PriceRow>

        <FeatureList>
          {plan.features.map((f) => (
            <FeatureItem key={f} $color={plan.color}>
              <Check />
              <FeatureText>{f}</FeatureText>
            </FeatureItem>
          ))}
          {plan.notIncluded?.map((f) => (
            <FeatureItem key={f} $excluded>
              <X />
              <FeatureText $excluded>{f}</FeatureText>
            </FeatureItem>
          ))}
        </FeatureList>

        <Button
          fullWidth
          variant={plan.popular ? 'primary' : 'outline'}
          style={plan.popular ? {} : { borderColor: plan.color, color: plan.color }}
        >
          {plan.popular ? '🔥 Get Started' : 'Choose Plan'}
        </Button>

        {canManage && (
          <UsageBar>
            <UsageLabel>
              <UsageTitle><Users /> Capacity</UsageTitle>
              <UsageCount>{plan.currentMembers} / {plan.maxMembers}</UsageCount>
            </UsageLabel>
            <BarTrack>
              <BarFill $pct={usagePct} $color={plan.color} />
            </BarTrack>
          </UsageBar>
        )}
      </CardBody>
    </Card>
  );
}
