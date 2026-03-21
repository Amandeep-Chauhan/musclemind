import React from 'react';
import styled from 'styled-components';
import {
  Mail, Phone, Calendar, Clock, Target, Dumbbell, TrendingUp, Award, User,
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

const AttendanceSection = styled.div`
  grid-column: 1 / -1;
`;

const AttendanceBar = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 6px;
`;

const BarTrack = styled.div`
  flex: 1;
  height: 8px;
  background: ${({ theme }) => theme.colors.bgHover};
  border-radius: 4px;
  overflow: hidden;
`;

const BarFill = styled.div`
  height: 100%;
  width: ${({ $pct }) => $pct}%;
  background: ${({ $pct, theme }) =>
    $pct >= 85 ? theme.colors.success :
    $pct >= 60 ? theme.colors.warning :
    theme.colors.error};
  border-radius: 4px;
  transition: width 0.5s ease;
`;

const BarLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  min-width: 36px;
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
          <div>
            <ProfileName>{member.name}</ProfileName>
            <BadgeRow>
              <StatusBadge status={member.status} />
              <PlanBadge plan={member.plan} />
            </BadgeRow>
          </div>
        </ProfileSection>

        <SectionTitle>Contact Information</SectionTitle>

        <DetailField>
          <FieldLabel><Mail /> Email</FieldLabel>
          <FieldValue>{member.email || '—'}</FieldValue>
        </DetailField>

        <DetailField>
          <FieldLabel><Phone /> Phone</FieldLabel>
          <FieldValue>{member.phone || '—'}</FieldValue>
        </DetailField>

        <SectionTitle>Physical Details</SectionTitle>

        <DetailField>
          <FieldLabel><User /> Age / Gender</FieldLabel>
          <FieldValue>
            {member.age ? `${member.age} yrs` : '—'} · {member.gender || '—'}
          </FieldValue>
        </DetailField>

        <DetailField>
          <FieldLabel><TrendingUp /> Weight / Height</FieldLabel>
          <FieldValue>{member.weight || '—'} / {member.height || '—'}</FieldValue>
        </DetailField>

        <SectionTitle>Membership</SectionTitle>

        <DetailField>
          <FieldLabel><Calendar /> Joined</FieldLabel>
          <FieldValue>{formatDate(member.joinDate)}</FieldValue>
        </DetailField>

        <DetailField>
          <FieldLabel><Clock /> Expires</FieldLabel>
          <FieldValue>{formatDate(member.expiryDate)}</FieldValue>
        </DetailField>

        <DetailField>
          <FieldLabel><Target /> Fitness Goal</FieldLabel>
          <FieldValue>{member.goal || '—'}</FieldValue>
        </DetailField>

        <DetailField>
          <FieldLabel><Dumbbell /> Trainer</FieldLabel>
          <FieldValue>{member.trainer || '—'}</FieldValue>
        </DetailField>

        <SectionTitle>Performance</SectionTitle>

        <DetailField>
          <FieldLabel><Award /> Total Sessions</FieldLabel>
          <FieldValue>{member.totalSessions ?? '—'}</FieldValue>
        </DetailField>

        <DetailField>
          <FieldLabel><Calendar /> Next Session</FieldLabel>
          <FieldValue>{member.nextSession ? formatDate(member.nextSession) : '—'}</FieldValue>
        </DetailField>

        <AttendanceSection>
          <FieldLabel><TrendingUp /> Attendance Rate</FieldLabel>
          <AttendanceBar>
            <BarTrack>
              <BarFill $pct={member.attendanceRate ?? 0} />
            </BarTrack>
            <BarLabel>{member.attendanceRate ?? 0}%</BarLabel>
          </AttendanceBar>
        </AttendanceSection>
      </Grid>
    </Modal>
  );
}
