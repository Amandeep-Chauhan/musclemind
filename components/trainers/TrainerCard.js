import React from 'react';
import styled from 'styled-components';
import { Star, Users, Calendar, Dumbbell, Edit, Trash2 } from 'lucide-react';
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';
import { useAuth } from '@/hooks/useAuth';

const Card = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: 24px;
  transition: all ${({ theme }) => theme.transitions.fast};
  display: flex;
  flex-direction: column;
  gap: 16px;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.lg};
    transform: translateY(-2px);
    border-color: ${({ theme }) => theme.colors.brandPrimary}44;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

const Avatar = styled.img`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: 3px solid ${({ theme }) => theme.colors.brandPrimary}44;
  object-fit: cover;
`;

const Info = styled.div`
  flex: 1;
`;

const Name = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0 0 4px;
`;

const Experience = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textTertiary};
  margin: 0;
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: #f59e0b;

  svg { width: 14px; height: 14px; fill: currentColor; }
`;

const Specializations = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const Bio = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.5;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Stats = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 8px;
`;

const StatItem = styled.div`
  text-align: center;
  padding: 10px;
  background: ${({ theme }) => theme.colors.bgSecondary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
`;

const StatValue = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const StatLabel = styled.div`
  font-size: 10px;
  color: ${({ theme }) => theme.colors.textTertiary};
  margin-top: 2px;
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
`;

export default function TrainerCard({ trainer, onEdit, onDelete }) {
  const { isAdmin, isSuperAdmin } = useAuth();
  const canManage = isAdmin || isSuperAdmin;

  return (
    <Card>
      <Header>
        <Avatar src={trainer.avatar} alt={trainer.name} />
        <Info>
          <Name>{trainer.name}</Name>
          <Experience>Experience: {trainer.experience}</Experience>
        </Info>
        <Rating>
          <Star />
          {trainer.rating}
        </Rating>
      </Header>

      <Specializations>
        {trainer.specializations.slice(0, 3).map((s) => (
          <Badge key={s} variant="info" size="sm">{s}</Badge>
        ))}
        {trainer.specializations.length > 3 && (
          <Badge variant="default" size="sm">+{trainer.specializations.length - 3}</Badge>
        )}
      </Specializations>

      <Bio>{trainer.bio}</Bio>

      <Stats>
        <StatItem>
          <StatValue>{trainer.activeClients}</StatValue>
          <StatLabel>Active Clients</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{trainer.sessionsThisMonth}</StatValue>
          <StatLabel>Sessions/Mo</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{trainer.totalClients}</StatValue>
          <StatLabel>Total Clients</StatLabel>
        </StatItem>
      </Stats>

      <Specializations>
        {trainer.certifications.slice(0, 2).map((c) => (
          <Badge key={c} variant="success" size="sm">{c}</Badge>
        ))}
      </Specializations>

      {canManage && (
        <Actions>
          <Button variant="outline" size="sm" icon={<Edit size={14} />} fullWidth onClick={() => onEdit?.(trainer)}>
            Edit
          </Button>
          <Button variant="ghost" size="sm" icon={<Trash2 size={14} />} onClick={() => onDelete?.(trainer)}
            style={{ color: '#ef4444' }}>
          </Button>
        </Actions>
      )}
    </Card>
  );
}
