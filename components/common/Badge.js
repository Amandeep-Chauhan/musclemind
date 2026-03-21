import React from 'react';
import styled from 'styled-components';

const variantMap = {
  success:  { bg: '#22c55e22', color: '#22c55e', border: '#22c55e44' },
  warning:  { bg: '#f59e0b22', color: '#f59e0b', border: '#f59e0b44' },
  error:    { bg: '#ef444422', color: '#ef4444', border: '#ef444444' },
  info:     { bg: '#3b82f622', color: '#3b82f6', border: '#3b82f644' },
  primary:  { bg: '#ff351122', color: '#ff3511', border: '#ff351144' },
  default:  { bg: '#64748b22', color: '#64748b', border: '#64748b44' },
  active:   { bg: '#22c55e22', color: '#22c55e', border: '#22c55e44' },
  inactive: { bg: '#64748b22', color: '#64748b', border: '#64748b44' },
  pending:  { bg: '#f59e0b22', color: '#f59e0b', border: '#f59e0b44' },
  elite:    { bg: '#f59e0b22', color: '#f59e0b', border: '#f59e0b44' },
  pro:      { bg: '#0078d422', color: '#0078d4', border: '#0078d444' },
  starter:  { bg: '#22c55e22', color: '#22c55e', border: '#22c55e44' },
};

const Dot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
  display: inline-block;
  flex-shrink: 0;
`;

const StyledBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: ${({ $size }) => ($size === 'sm' ? '2px 8px' : '4px 10px')};
  font-size: ${({ $size, theme }) =>
    $size === 'sm' ? theme.typography.fontSize.xs : '11px'};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  border: 1px solid ${({ $colors }) => $colors.border};
  background: ${({ $colors }) => $colors.bg};
  color: ${({ $colors }) => $colors.color};
  white-space: nowrap;
  letter-spacing: 0.3px;
  text-transform: ${({ $upper }) => $upper ? 'uppercase' : 'none'};
`;

const Badge = ({ variant = 'default', children, dot = false, size = 'md', uppercase = false }) => {
  const colors = variantMap[variant?.toLowerCase()] || variantMap.default;

  return (
    <StyledBadge $colors={colors} $size={size} $upper={uppercase}>
      {dot && <Dot />}
      {children}
    </StyledBadge>
  );
};

export default Badge;

// Status badge shorthand
export const StatusBadge = ({ status }) => {
  const variantMap = {
    active: 'active',
    inactive: 'inactive',
    pending: 'pending',
    suspended: 'error',
    expired: 'error',
  };
  return (
    <Badge variant={variantMap[status] || 'default'} dot>
      {status}
    </Badge>
  );
};

// Plan badge
export const PlanBadge = ({ plan }) => {
  const v = { elite: 'elite', pro: 'pro', starter: 'starter' };
  return <Badge variant={v[plan?.toLowerCase()] || 'default'}>{plan}</Badge>;
};
