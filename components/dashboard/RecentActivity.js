import React from 'react';
import styled from 'styled-components';
import { UserPlus, CreditCard, Dumbbell, AlertCircle, Bell } from 'lucide-react';
import Card from '@/components/common/Card';
import { SkeletonCard } from '@/components/common/Skeleton';

const iconMap = {
  UserPlus: UserPlus,
  CreditCard: CreditCard,
  Dumbbell: Dumbbell,
  AlertCircle: AlertCircle,
};

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  transition: background ${({ theme }) => theme.transitions.fast};

  &:last-child { border-bottom: none; padding-bottom: 0; }
  &:first-child { padding-top: 0; }
`;

const IconCircle = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${({ $color }) => `${$color}22`};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: ${({ $color }) => $color};

  svg { width: 16px; height: 16px; }
`;

const Content = styled.div`
  flex: 1;
  min-width: 0;
`;

const Message = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0 0 4px;
  line-height: 1.4;
`;

const Time = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textTertiary};
`;

export default function RecentActivity({ data, loading }) {
  if (loading) return <SkeletonCard />;

  return (
    <Card>
      <Card.Header>
        <Card.Title>Recent Activity</Card.Title>
        <Card.Subtitle>Latest events across your gym</Card.Subtitle>
      </Card.Header>

      <List>
        {data?.map((item) => {
          const Icon = iconMap[item.icon] || Bell;
          return (
            <ActivityItem key={item.id}>
              <IconCircle $color={item.color}>
                <Icon />
              </IconCircle>
              <Content>
                <Message>{item.message}</Message>
                <Time>{item.time}</Time>
              </Content>
            </ActivityItem>
          );
        })}
      </List>
    </Card>
  );
}
