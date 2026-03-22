import React from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import { Mail, Phone, Calendar, Award, Users, Clock, Dumbbell } from 'lucide-react';
import MainLayout from '@/layouts/MainLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import { dummyTrainers } from '@/data/dummyData';
import { formatDate } from '@/utils/formatters';
import { ROLES } from '@/utils/constants';

// ── Styled Components ─────────────────────────────────────────────────────────

const ProfileWrapper = styled.div`
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 24px;

  @media (max-width: ${({ theme }) => theme.breakpoints.xl}) {
    grid-template-columns: 1fr;
  }
`;

const Sidebar = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: 32px 24px;
  text-align: center;
`;

const AvatarLarge = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin: 0 auto 16px;
  border: 3px solid ${({ theme }) => theme.colors.brandPrimary};
`;

const ProfileName = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 4px;
`;

const ProfileRole = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textTertiary};
  margin-bottom: 20px;
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 14px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  background: #3da63718;
  color: #236b1e;
  margin-bottom: 24px;
`;

const StatusDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
`;

const ContactList = styled.div`
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 20px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};

  svg {
    width: 16px;
    height: 16px;
    color: ${({ theme }) => theme.colors.textTertiary};
    flex-shrink: 0;
  }
`;

const RightCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: 24px;
`;

const CardTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;

  svg {
    width: 18px;
    height: 18px;
    color: ${({ theme }) => theme.colors.brandPrimary};
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const StatBox = styled.div`
  background: ${({ theme }) => theme.colors.bgSecondary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: 16px;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ $color }) => $color || 'inherit'};
`;

const StatLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textTertiary};
  margin-top: 4px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
`;

const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 5px 14px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 500;
  background: ${({ $bg }) => $bg || '#1aa8d412'};
  color: ${({ $color }) => $color || '#116c8e'};
`;

const ScheduleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(4, 1fr);
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const DayCard = styled.div`
  background: ${({ $off, theme }) =>
    $off ? theme.colors.bgSecondary : theme.colors.brandPrimary + '10'};
  border: 1px solid
    ${({ $off, theme }) => ($off ? theme.colors.border : theme.colors.brandPrimary + '30')};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: 12px;
  text-align: center;
`;

const DayName = styled.div`
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: ${({ $off, theme }) => ($off ? theme.colors.textTertiary : theme.colors.brandPrimary)};
  margin-bottom: 4px;
`;

const DayTime = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ $off, theme }) => ($off ? theme.colors.textTertiary : theme.colors.textPrimary)};
  font-weight: ${({ $off }) => ($off ? '400' : '500')};
`;

const Bio = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.7;
`;

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const { user } = useAuth();

  const trainer = dummyTrainers.find((t) => t.email === user?.email || t.name === user?.name);

  if (!trainer) {
    return (
      <ProtectedRoute requiredRole={ROLES.TRAINER}>
        <Head>
          <title>My Profile – MuscleMind</title>
        </Head>
        <MainLayout title="My Profile" subtitle="Your trainer profile.">
          <Card>
            <Bio style={{ textAlign: 'center', padding: '40px' }}>
              No trainer profile found for your account.
            </Bio>
          </Card>
        </MainLayout>
      </ProtectedRoute>
    );
  }

  const DAY_LABELS = {
    mon: 'Mon',
    tue: 'Tue',
    wed: 'Wed',
    thu: 'Thu',
    fri: 'Fri',
    sat: 'Sat',
    sun: 'Sun',
  };

  return (
    <ProtectedRoute requiredRole={ROLES.TRAINER}>
      <Head>
        <title>My Profile – MuscleMind</title>
      </Head>

      <MainLayout title="My Profile" subtitle="Your trainer profile and schedule.">
        <ProfileWrapper>
          {/* Left Sidebar */}
          <Sidebar>
            <AvatarLarge src={trainer.avatar} alt={trainer.name} />
            <ProfileName>{trainer.name}</ProfileName>
            <ProfileRole>{trainer.experience} Experience</ProfileRole>
            <StatusBadge>
              <StatusDot /> Active
            </StatusBadge>

            <ContactList>
              <ContactItem>
                <Mail /> {trainer.email}
              </ContactItem>
              <ContactItem>
                <Phone /> {trainer.phone}
              </ContactItem>
              <ContactItem>
                <Calendar /> Joined {formatDate(trainer.joinDate)}
              </ContactItem>
            </ContactList>
          </Sidebar>

          {/* Right Content */}
          <RightCol>
            {/* Stats */}
            <Card>
              <CardTitle>
                <Dumbbell /> Performance
              </CardTitle>
              <StatsGrid>
                <StatBox>
                  <StatValue $color="#1aa8d4">{trainer.totalClients}</StatValue>
                  <StatLabel>Total Clients</StatLabel>
                </StatBox>
                <StatBox>
                  <StatValue $color="#3da637">{trainer.activeClients}</StatValue>
                  <StatLabel>Active Clients</StatLabel>
                </StatBox>
                <StatBox>
                  <StatValue $color="#5b5bec">{trainer.sessionsThisMonth}</StatValue>
                  <StatLabel>Sessions / Month</StatLabel>
                </StatBox>
                <StatBox>
                  <StatValue $color="#f0be1f">{trainer.rating}</StatValue>
                  <StatLabel>Rating</StatLabel>
                </StatBox>
              </StatsGrid>
            </Card>

            {/* Bio */}
            <Card>
              <CardTitle>
                <Users /> About
              </CardTitle>
              <Bio>{trainer.bio}</Bio>
            </Card>

            {/* Specializations & Certifications */}
            <Card>
              <CardTitle>
                <Award /> Specializations & Certifications
              </CardTitle>
              <TagList style={{ marginBottom: 16 }}>
                {trainer.specializations.map((s) => (
                  <Tag key={s} $bg="#5b5bec12" $color="#3535cc">
                    {s}
                  </Tag>
                ))}
              </TagList>
              <TagList>
                {trainer.certifications.map((c) => (
                  <Tag key={c} $bg="#3da63712" $color="#236b1e">
                    {c}
                  </Tag>
                ))}
              </TagList>
            </Card>

            {/* Schedule */}
            <Card>
              <CardTitle>
                <Clock /> Weekly Schedule
              </CardTitle>
              <ScheduleGrid>
                {Object.entries(trainer.schedule).map(([day, time]) => {
                  const isOff = time === 'Off';
                  return (
                    <DayCard key={day} $off={isOff}>
                      <DayName $off={isOff}>{DAY_LABELS[day]}</DayName>
                      <DayTime $off={isOff}>{time}</DayTime>
                    </DayCard>
                  );
                })}
              </ScheduleGrid>
            </Card>
          </RightCol>
        </ProfileWrapper>
      </MainLayout>
    </ProtectedRoute>
  );
}
