import React from 'react';
import styled from 'styled-components';
import {
  Mail,
  Phone,
  Calendar,
  Clock,
  Target,
  Dumbbell,
  TrendingUp,
  Award,
  User,
} from 'lucide-react';
import Modal from '@/components/common/Modal';
import { StatusBadge, PlanBadge } from '@/components/common/Badge';
import { formatDate } from '@/utils/formatters';

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const ProfileSection = styled.div`
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  gap: 16px;
  padding-bottom: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Avatar = styled.img`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: 3px solid ${({ theme }) => theme.colors.brandPrimary}44;
  object-fit: cover;
  flex-shrink: 0;
`;

const ProfileName = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0 0 8px;
`;

const BadgeRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
`;

const SectionTitle = styled.div`
  grid-column: 1 / -1;
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textTertiary};
  text-transform: uppercase;
  letter-spacing: 0.8px;
  padding-bottom: 8px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  margin-top: 4px;
`;

const DetailField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const FieldLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textTertiary};
  text-transform: uppercase;
  letter-spacing: 0.5px;

  svg {
    width: 12px;
    height: 12px;
  }
`;

const FieldValue = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const HistoryTable = styled.div`
  grid-column: 1 / -1;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  overflow: hidden;
  margin-top: 4px;
`;

const HRow = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 1fr 1fr 0.8fr;
  padding: 10px 16px;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ $header, theme }) => ($header ? theme.colors.bgSecondary : 'transparent')};
  color: ${({ $header, theme }) =>
    $header ? theme.colors.textTertiary : theme.colors.textPrimary};
  font-weight: ${({ $header, theme }) =>
    $header ? theme.typography.fontWeight.semibold : theme.typography.fontWeight.normal};
  align-items: center;
  font-variant-numeric: tabular-nums;

  &:last-child {
    border-bottom: none;
  }
`;

const HCell = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const PlanPill = styled.span`
  display: inline-flex;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  background: #1aa8d418;
  color: #116c8e;
`;

const AmountCell = styled.span`
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const CircularProgress = styled.div`
  position: relative;
  width: 56px;
  height: 56px;
  flex-shrink: 0;
`;

const CircleLabel = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 12px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export default function MemberDetailModal({ isOpen, onClose, member }) {
  if (!member) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Member Details"
      subtitle="Full profile information"
      size="lg"
    >
      <Grid>
        <ProfileSection>
          <Avatar src={member.avatar} alt={member.name} />
          <div style={{ flex: 1 }}>
            <ProfileName>{member.name}</ProfileName>
            <BadgeRow>
              <StatusBadge status={member.status} />
              <PlanBadge plan={member.plan} />
            </BadgeRow>
          </div>
          <CircularProgress>
            <svg width="56" height="56" viewBox="0 0 56 56">
              <circle
                cx="28"
                cy="28"
                r="24"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="5"
                opacity="0.2"
              />
              <circle
                cx="28"
                cy="28"
                r="24"
                fill="none"
                stroke={(() => {
                  const pct = member.attendanceRate ?? 0;
                  return pct >= 85 ? '#3da637' : pct >= 60 ? '#f0be1f' : '#f44040';
                })()}
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={`${((member.attendanceRate ?? 0) / 100) * 150.8} 150.8`}
                transform="rotate(-90 28 28)"
              />
            </svg>
            <CircleLabel>{member.attendanceRate ?? 0}%</CircleLabel>
          </CircularProgress>
        </ProfileSection>

        <SectionTitle>Contact Information</SectionTitle>

        <DetailField>
          <FieldLabel>
            <Mail /> Email
          </FieldLabel>
          <FieldValue>{member.email || '—'}</FieldValue>
        </DetailField>

        <DetailField>
          <FieldLabel>
            <Phone /> Phone
          </FieldLabel>
          <FieldValue>{member.phone || '—'}</FieldValue>
        </DetailField>

        <SectionTitle>Physical Details</SectionTitle>

        <DetailField>
          <FieldLabel>
            <User /> Age / Gender
          </FieldLabel>
          <FieldValue>
            {member.age ? `${member.age} yrs` : '—'} · {member.gender || '—'}
          </FieldValue>
        </DetailField>

        <DetailField>
          <FieldLabel>
            <TrendingUp /> Weight / Height
          </FieldLabel>
          <FieldValue>
            {member.weight || '—'} / {member.height || '—'}
          </FieldValue>
        </DetailField>

        <SectionTitle>Membership</SectionTitle>

        <DetailField>
          <FieldLabel>
            <Calendar /> Joined
          </FieldLabel>
          <FieldValue>{formatDate(member.joinDate)}</FieldValue>
        </DetailField>

        <DetailField>
          <FieldLabel>
            <Clock /> Expires
          </FieldLabel>
          <FieldValue>{formatDate(member.expiryDate)}</FieldValue>
        </DetailField>

        <DetailField>
          <FieldLabel>
            <Target /> Fitness Goal
          </FieldLabel>
          <FieldValue>{member.goal || '—'}</FieldValue>
        </DetailField>

        <DetailField>
          <FieldLabel>
            <Dumbbell /> Trainer
          </FieldLabel>
          <FieldValue>{member.trainer || '—'}</FieldValue>
        </DetailField>

        <SectionTitle>Performance</SectionTitle>

        <DetailField>
          <FieldLabel>
            <Award /> Total Sessions
          </FieldLabel>
          <FieldValue>{member.totalSessions ?? '—'}</FieldValue>
        </DetailField>

        <DetailField>
          <FieldLabel>
            <Calendar /> Next Session
          </FieldLabel>
          <FieldValue>{member.nextSession ? formatDate(member.nextSession) : '—'}</FieldValue>
        </DetailField>

        <SectionTitle>Subscription History</SectionTitle>

        {member.subscriptionHistory && member.subscriptionHistory.length > 0 ? (
          <HistoryTable>
            <HRow $header>
              <HCell>Plan</HCell>
              <HCell>Start Date</HCell>
              <HCell>End Date</HCell>
              <HCell>Amount</HCell>
            </HRow>
            {[...member.subscriptionHistory].reverse().map((sub, i) => (
              <HRow key={i}>
                <HCell>
                  <PlanPill>{sub.plan}</PlanPill>
                </HCell>
                <HCell>{formatDate(sub.startDate)}</HCell>
                <HCell>{formatDate(sub.endDate)}</HCell>
                <HCell>
                  <AmountCell>₹{Number(sub.amount).toLocaleString('en-IN')}</AmountCell>
                </HCell>
              </HRow>
            ))}
          </HistoryTable>
        ) : (
          <DetailField style={{ gridColumn: '1 / -1' }}>
            <FieldValue style={{ color: '#94a3b8' }}>No subscription history available.</FieldValue>
          </DetailField>
        )}
      </Grid>
    </Modal>
  );
}
