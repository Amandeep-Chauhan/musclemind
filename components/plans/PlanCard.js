import React from 'react';
import styled from 'styled-components';
import { Check, X, Users, Edit } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const Card = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 20px;
  overflow: hidden;
  position: relative;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;
  display: flex;
  flex-direction: column;
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.08),
    0 1px 2px rgba(0, 0, 0, 0.05);

  &:hover {
    transform: translateY(-3px);
    box-shadow:
      0 6px 16px rgba(0, 0, 0, 0.1),
      0 2px 4px rgba(0, 0, 0, 0.06);
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

const EditPlanBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  padding: 10px;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ $color }) => $color};
  background: ${({ $color }) => `${$color}10`};
  border: 1.5px solid ${({ $color }) => `${$color}30`};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${({ $color }) => `${$color}20`};
    border-color: ${({ $color }) => `${$color}50`};
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

const MemberCount = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  margin-top: 10px;
  position: relative;
  z-index: 1;

  svg {
    width: 14px;
    height: 14px;
  }
`;

const PlanName = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.extrabold};
  color: white;
  margin: 0 0 6px;
  position: relative;
  z-index: 1;
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

const SavingsRibbon = styled.div`
  position: absolute;
  top: 18px;
  right: -35px;
  width: 140px;
  padding: 5px 0;
  background: linear-gradient(135deg, #ff6b35, #e84118);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  text-align: center;
  transform: rotate(45deg);
  z-index: 3;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  letter-spacing: 0.3px;
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
    color: ${({ $excluded, $color, theme }) => ($excluded ? theme.colors.textTertiary : $color)};
  }
`;

const FeatureText = styled.span`
  text-decoration: ${({ $excluded }) => ($excluded ? 'line-through' : 'none')};
`;

export default function PlanCard({ plan, onEdit }) {
  const { isAdmin, isSuperAdmin } = useAuth();
  const canManage = isAdmin || isSuperAdmin;

  return (
    <Card $color={plan.color}>
      {(() => {
        const monthlyRate = 600;
        const months = parseInt(plan.billingCycle) || 1;
        const savings = monthlyRate * months - plan.price;
        if (savings <= 0) return null;
        return <SavingsRibbon>Save ₹{savings.toLocaleString('en-IN')}</SavingsRibbon>;
      })()}
      <CardHeader $color={plan.color}>
        <PlanName>{plan.name}</PlanName>
        <MemberCount>
          <Users /> {plan.currentMembers} members enrolled
        </MemberCount>
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

        {canManage && onEdit && (
          <EditPlanBtn onClick={() => onEdit(plan)} $color={plan.color}>
            <Edit /> Edit Plan
          </EditPlanBtn>
        )}
      </CardBody>
    </Card>
  );
}
