import React, { useState } from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import { Dumbbell, Star, Users, Plus, Search, Edit, Trash2, Phone, Calendar } from 'lucide-react';
import MainLayout from '@/layouts/MainLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import StatsCard from '@/components/dashboard/StatsCard';
import Table from '@/components/common/Table';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Modal from '@/components/common/Modal';
import Badge from '@/components/common/Badge';
import { dummyTrainers, dummyMembers } from '@/data/dummyData';
import { formatDate } from '@/utils/formatters';
import { ROLES } from '@/utils/constants';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/hooks/useAuth';

// ── Styled Components ─────────────────────────────────────────────────────────

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;

  @media (max-width: ${({ theme }) => theme.breakpoints.xl}) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const Filters = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const StyledSelect = styled.select`
  padding: 8px 36px 8px 12px;
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  cursor: pointer;
  outline: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  transition: border-color ${({ theme }) => theme.transitions.fast};

  &:focus {
    border-color: ${({ theme }) => theme.colors.brandPrimary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.brandPrimary}22;
  }
`;

const TrainerCell = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Avatar = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  border: 2px solid ${({ theme }) => theme.colors.brandPrimary}30;
`;

const TrainerInfo = styled.div``;

const TrainerName = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.brandPrimary};
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const TrainerContact = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textTertiary};
  margin-top: 1px;
  display: flex;
  align-items: center;
  gap: 4px;

  svg {
    width: 10px;
    height: 10px;
  }
`;

const RatingCell = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: #f0be1f;

  svg {
    width: 13px;
    height: 13px;
    fill: #f0be1f;
  }
`;

const StatCell = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-variant-numeric: tabular-nums;
`;

const StatSub = styled.div`
  font-size: 10px;
  color: ${({ theme }) => theme.colors.textTertiary};
  margin-top: 1px;
`;

const Pill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  background: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
  white-space: nowrap;
`;

const PillDot = styled.span`
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: currentColor;
  flex-shrink: 0;
`;

const ActionMenu = styled.div`
  display: flex;
  gap: 4px;
`;

const ActionBtn = styled.button`
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  cursor: pointer;
  color: ${({ theme }) => theme.colors.textTertiary};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ $danger, theme }) =>
      $danger ? `${theme.colors.error}22` : theme.colors.bgHover};
    color: ${({ $danger, theme }) => ($danger ? theme.colors.error : theme.colors.textPrimary)};
  }
  svg {
    width: 14px;
    height: 14px;
  }
`;

// ── Detail Modal Styled ─────────────────────────────────────────────────────

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  margin-bottom: 20px;
`;

const ProfileAvatar = styled.img`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid ${({ theme }) => theme.colors.brandPrimary}40;
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const ProfileName = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 4px;
`;

const ProfileMeta = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textTertiary};
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;

  svg {
    width: 13px;
    height: 13px;
  }
`;

const MetaItem = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
`;

const ProfileStatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 20px;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const ProfileStatBox = styled.div`
  background: ${({ theme }) => theme.colors.bgSecondary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: 14px;
  text-align: center;
`;

const ProfileStatValue = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ $color }) => $color || 'inherit'};
`;

const ProfileStatLabel = styled.div`
  font-size: 10px;
  color: ${({ theme }) => theme.colors.textTertiary};
  margin-top: 3px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
`;

const DetailSection = styled.div`
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const DetailSectionTitle = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textTertiary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 10px;
  padding-bottom: 6px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const DetailBio = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.7;
  margin: 0;
`;

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  background: ${({ theme }) => theme.colors.bgSecondary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textPrimary};

  svg {
    width: 15px;
    height: 15px;
    color: ${({ theme }) => theme.colors.brandPrimary};
    flex-shrink: 0;
  }
`;

const TagsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const ScheduleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
  grid-column: 1 / -1;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const DayCard = styled.div`
  background: ${({ $off, theme }) => ($off ? 'transparent' : theme.colors.brandPrimary + '10')};
  border: 1px solid
    ${({ $off, theme }) => ($off ? theme.colors.border : theme.colors.brandPrimary + '30')};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: 8px;
  text-align: center;
`;

const DayName = styled.div`
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  color: ${({ $off, theme }) => ($off ? theme.colors.textTertiary : theme.colors.brandPrimary)};
  margin-bottom: 2px;
`;

const DayTime = styled.div`
  font-size: 11px;
  color: ${({ $off, theme }) => ($off ? theme.colors.textTertiary : theme.colors.textPrimary)};
`;

// ── Form Styled ───────────────────────────────────────────────────────────────

// ── Client List Styled ──────────────────────────────────────────────────────

const ClientsTable = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  overflow: hidden;
`;

const ClientRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
  padding: 10px 16px;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ $header, theme }) => ($header ? theme.colors.bgSecondary : 'transparent')};
  color: ${({ $header, theme }) =>
    $header ? theme.colors.textTertiary : theme.colors.textPrimary};
  font-weight: ${({ $header, theme }) =>
    $header ? theme.typography.fontWeight.semibold : theme.typography.fontWeight.normal};
  align-items: center;

  &:last-child {
    border-bottom: none;
  }
`;

const ClientCell = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ClientInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ClientAvatar = styled.img`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
`;

const ClientName = styled.div`
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const ClientGoal = styled.div`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textTertiary};
  margin-top: 1px;
`;

const AttendanceBar = styled.div`
  width: 50px;
  height: 5px;
  background: ${({ theme }) => theme.colors.border};
  border-radius: 3px;
  overflow: hidden;
  margin-right: 6px;
`;

const AttendanceFill = styled.div`
  height: 100%;
  width: ${({ $pct }) => $pct}%;
  background: ${({ $pct }) => ($pct >= 85 ? '#3da637' : $pct >= 70 ? '#f0be1f' : '#f44040')};
  border-radius: 3px;
`;

const EmptyClients = styled.div`
  text-align: center;
  padding: 24px;
  color: ${({ theme }) => theme.colors.textTertiary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

// ── Form Styled ───────────────────────────────────────────────────────────────

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const FullWidth = styled.div`
  grid-column: 1 / -1;
`;

const SectionDivider = styled.div`
  grid-column: 1 / -1;
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textTertiary};
  text-transform: uppercase;
  letter-spacing: 0.7px;
  padding-bottom: 6px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  margin-top: 4px;
`;

// ── Constants ─────────────────────────────────────────────────────────────────

const EMPTY_FORM = {
  name: '',
  email: '',
  phone: '',
  experience: '',
  bio: '',
  specializations: '',
  certifications: '',
};

const DAY_LABELS = {
  mon: 'Mon',
  tue: 'Tue',
  wed: 'Wed',
  thu: 'Thu',
  fri: 'Fri',
  sat: 'Sat',
  sun: 'Sun',
};

// ── Page ──────────────────────────────────────────────────────────────────────

export default function TrainersPage() {
  const [trainers, setTrainers] = useState(dummyTrainers);
  const [search, setSearch] = useState('');
  const [filterSpec, setFilterSpec] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [viewTrainer, setViewTrainer] = useState(null);
  const { isAdmin, isSuperAdmin } = useAuth();
  const canManage = isAdmin || isSuperAdmin;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: EMPTY_FORM });

  React.useEffect(() => {
    if (showForm)
      reset(
        editItem
          ? {
              ...editItem,
              specializations: (editItem.specializations || []).join(', '),
              certifications: (editItem.certifications || []).join(', '),
            }
          : EMPTY_FORM
      );
  }, [showForm, editItem, reset]);

  // ── Stats ──────────────────────────────────────────────────────────────────
  const totalTrainers = trainers.length;
  const activeTrainers = trainers.filter((t) => t.status === 'active').length;
  const avgRating = trainers.length
    ? (trainers.reduce((s, t) => s + t.rating, 0) / trainers.length).toFixed(1)
    : 0;
  const totalClients = trainers.reduce((s, t) => s + t.activeClients, 0);

  // ── Filtered rows ──────────────────────────────────────────────────────────
  const filtered = trainers.filter((t) => {
    const q = search.toLowerCase();
    const matchSearch =
      !search ||
      t.name.toLowerCase().includes(q) ||
      t.email.toLowerCase().includes(q) ||
      t.specializations.some((s) => s.toLowerCase().includes(q));
    const matchSpec = filterSpec === 'all' || t.specializations.includes(filterSpec);
    const matchStatus = filterStatus === 'all' || t.status === filterStatus;
    return matchSearch && matchSpec && matchStatus;
  });

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleEdit = (item) => {
    setEditItem(item);
    setShowForm(true);
  };

  const handleDelete = (item) => {
    if (confirm(`Remove trainer "${item.name}"? This cannot be undone.`)) {
      setTrainers((prev) => prev.filter((t) => t.id !== item.id));
    }
  };

  const onSubmit = async (data) => {
    await new Promise((r) => setTimeout(r, 600));
    const payload = {
      ...data,
      specializations: data.specializations
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      certifications: data.certifications
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=1aa8d4&color=fff`,
      status: 'active',
      rating: editItem?.rating || 0,
      totalClients: editItem?.totalClients || 0,
      activeClients: editItem?.activeClients || 0,
      sessionsThisMonth: editItem?.sessionsThisMonth || 0,
      schedule: editItem?.schedule || {
        mon: '9:00 - 17:00',
        tue: '9:00 - 17:00',
        wed: '9:00 - 17:00',
        thu: '9:00 - 17:00',
        fri: '9:00 - 17:00',
        sat: 'Off',
        sun: 'Off',
      },
    };
    if (editItem) {
      setTrainers((prev) => prev.map((t) => (t.id === editItem.id ? { ...t, ...payload } : t)));
    } else {
      setTrainers((prev) => [
        { id: `t${Date.now()}`, joinDate: new Date().toISOString().split('T')[0], ...payload },
        ...prev,
      ]);
    }
    setShowForm(false);
    setEditItem(null);
  };

  // ── Table columns ──────────────────────────────────────────────────────────
  const columns = [
    {
      key: 'name',
      label: 'Trainer',
      sortable: true,
      render: (val, row) => (
        <TrainerCell>
          <Avatar src={row.avatar} alt={val} />
          <TrainerInfo>
            <TrainerName onClick={() => setViewTrainer(row)}>{val}</TrainerName>
            <TrainerContact>
              <Phone /> {row.phone}
            </TrainerContact>
          </TrainerInfo>
        </TrainerCell>
      ),
    },
    {
      key: 'joinDate',
      label: 'Joined',
      sortable: true,
      render: (val) => formatDate(val),
    },
    {
      key: 'experience',
      label: 'Experience',
      sortable: true,
    },
    {
      key: 'activeClients',
      label: 'Clients',
      sortable: true,
      render: (val, row) => (
        <StatCell>
          {val}
          <StatSub>{row.totalClients} total</StatSub>
        </StatCell>
      ),
    },
    {
      key: 'sessionsThisMonth',
      label: 'Sessions/Mo',
      sortable: true,
      render: (val) => <StatCell>{val}</StatCell>,
    },
    {
      key: 'rating',
      label: 'Rating',
      sortable: true,
      render: (val) => (
        <RatingCell>
          <Star /> {val}
        </RatingCell>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (val) =>
        val === 'active' ? (
          <Pill $bg="#3da63718" $color="#236b1e">
            <PillDot /> Active
          </Pill>
        ) : (
          <Pill $bg="#94a3b818" $color="#475569">
            <PillDot /> Inactive
          </Pill>
        ),
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (_, row) =>
        canManage ? (
          <ActionMenu>
            <ActionBtn onClick={() => handleEdit(row)} title="Edit">
              <Edit />
            </ActionBtn>
            <ActionBtn $danger onClick={() => handleDelete(row)} title="Remove">
              <Trash2 />
            </ActionBtn>
          </ActionMenu>
        ) : null,
    },
  ];

  // ── All unique specializations for filter ──────────────────────────────────
  const allSpecs = [...new Set(trainers.flatMap((t) => t.specializations))].sort();

  return (
    <ProtectedRoute requiredRole={ROLES.ADMIN}>
      <Head>
        <title>Trainers – MuscleMind</title>
      </Head>

      <MainLayout title="Trainers" subtitle="Manage your expert trainer team.">
        {/* Stats */}
        <StatsRow>
          <StatsCard label="Total Trainers" value={totalTrainers} icon={Dumbbell} color="#5b5bec" />
          <StatsCard label="Active" value={activeTrainers} icon={Users} color="#3da637" />
          <StatsCard label="Avg. Rating" value={avgRating} icon={Star} color="#f0be1f" />
          <StatsCard label="Active Clients" value={totalClients} icon={Users} color="#1aa8d4" />
        </StatsRow>

        {/* Toolbar */}
        <Toolbar>
          <Filters>
            <Input
              placeholder="Search trainers..."
              leftIcon={<Search />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              fullWidth={false}
              style={{ width: 220 }}
            />
            <StyledSelect value={filterSpec} onChange={(e) => setFilterSpec(e.target.value)}>
              <option value="all">All Specializations</option>
              {allSpecs.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </StyledSelect>
            <StyledSelect value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </StyledSelect>
          </Filters>

          {canManage && (
            <Button
              icon={<Plus />}
              onClick={() => {
                setEditItem(null);
                setShowForm(true);
              }}
            >
              Add Trainer
            </Button>
          )}
        </Toolbar>

        {/* Table */}
        <Table
          columns={columns}
          data={filtered}
          emptyText="No trainers found. Try adjusting your filters."
          emptyEmoji="💪"
          pageSize={10}
        />

        {/* Trainer Detail Modal */}
        <Modal
          isOpen={!!viewTrainer}
          onClose={() => setViewTrainer(null)}
          title="Trainer Profile"
          subtitle=""
          size="lg"
          footer={
            <Button variant="ghost" onClick={() => setViewTrainer(null)}>
              Close
            </Button>
          }
        >
          {viewTrainer && (
            <>
              {/* Header */}
              <ProfileHeader>
                <ProfileAvatar src={viewTrainer.avatar} alt={viewTrainer.name} />
                <ProfileInfo>
                  <ProfileName>{viewTrainer.name}</ProfileName>
                  <ProfileMeta>
                    <MetaItem>
                      <Dumbbell /> {viewTrainer.experience}
                    </MetaItem>
                    <MetaItem>
                      <Calendar /> Joined {formatDate(viewTrainer.joinDate)}
                    </MetaItem>
                    <MetaItem>
                      <Phone /> {viewTrainer.phone}
                    </MetaItem>
                  </ProfileMeta>
                  <ProfileMeta style={{ marginTop: 4 }}>
                    <MetaItem>{viewTrainer.email}</MetaItem>
                  </ProfileMeta>
                </ProfileInfo>
                <RatingCell style={{ fontSize: 18 }}>
                  <Star style={{ width: 18, height: 18 }} /> {viewTrainer.rating}
                </RatingCell>
              </ProfileHeader>

              {/* Stats */}
              <ProfileStatsRow>
                <ProfileStatBox>
                  <ProfileStatValue $color="#1aa8d4">{viewTrainer.activeClients}</ProfileStatValue>
                  <ProfileStatLabel>Active Clients</ProfileStatLabel>
                </ProfileStatBox>
                <ProfileStatBox>
                  <ProfileStatValue $color="#5b5bec">{viewTrainer.totalClients}</ProfileStatValue>
                  <ProfileStatLabel>Total Clients</ProfileStatLabel>
                </ProfileStatBox>
                <ProfileStatBox>
                  <ProfileStatValue $color="#3da637">
                    {viewTrainer.sessionsThisMonth}
                  </ProfileStatValue>
                  <ProfileStatLabel>Sessions / Month</ProfileStatLabel>
                </ProfileStatBox>
                <ProfileStatBox>
                  <ProfileStatValue $color="#f0be1f">{viewTrainer.rating}</ProfileStatValue>
                  <ProfileStatLabel>Rating</ProfileStatLabel>
                </ProfileStatBox>
              </ProfileStatsRow>

              {/* Bio */}
              <DetailSection>
                <DetailSectionTitle>About</DetailSectionTitle>
                <DetailBio>{viewTrainer.bio}</DetailBio>
              </DetailSection>

              {/* Contact */}
              <DetailSection>
                <DetailSectionTitle>Contact Information</DetailSectionTitle>
                <ContactGrid>
                  <ContactItem>
                    <Phone /> {viewTrainer.phone}
                  </ContactItem>
                  <ContactItem>
                    <Star style={{ width: 15, height: 15 }} /> {viewTrainer.email}
                  </ContactItem>
                </ContactGrid>
              </DetailSection>

              {/* Specializations */}
              <DetailSection>
                <DetailSectionTitle>Specializations</DetailSectionTitle>
                <TagsRow>
                  {viewTrainer.specializations.map((s) => (
                    <Badge key={s} variant="info" size="sm">
                      {s}
                    </Badge>
                  ))}
                </TagsRow>
              </DetailSection>

              {/* Certifications */}
              <DetailSection>
                <DetailSectionTitle>Certifications</DetailSectionTitle>
                <TagsRow>
                  {viewTrainer.certifications.map((c) => (
                    <Badge key={c} variant="success" size="sm">
                      {c}
                    </Badge>
                  ))}
                </TagsRow>
              </DetailSection>

              {/* Schedule */}
              <DetailSection>
                <DetailSectionTitle>Weekly Schedule</DetailSectionTitle>
                <ScheduleGrid>
                  {Object.entries(viewTrainer.schedule).map(([day, time]) => {
                    const isOff = time === 'Off';
                    return (
                      <DayCard key={day} $off={isOff}>
                        <DayName $off={isOff}>{DAY_LABELS[day]}</DayName>
                        <DayTime $off={isOff}>{time}</DayTime>
                      </DayCard>
                    );
                  })}
                </ScheduleGrid>
              </DetailSection>

              {/* Clients */}
              <DetailSection>
                <DetailSectionTitle>
                  Clients ({dummyMembers.filter((m) => m.trainerId === viewTrainer.id).length})
                </DetailSectionTitle>
                {(() => {
                  const clients = dummyMembers.filter((m) => m.trainerId === viewTrainer.id);
                  if (clients.length === 0) {
                    return <EmptyClients>No clients assigned to this trainer.</EmptyClients>;
                  }
                  return (
                    <ClientsTable>
                      <ClientRow $header>
                        <ClientCell>Member</ClientCell>
                        <ClientCell>Plan</ClientCell>
                        <ClientCell>Goal</ClientCell>
                        <ClientCell>Sessions</ClientCell>
                        <ClientCell>Attendance</ClientCell>
                      </ClientRow>
                      {clients.map((client) => (
                        <ClientRow key={client.id}>
                          <ClientCell>
                            <ClientInfo>
                              <ClientAvatar src={client.avatar} alt={client.name} />
                              <div>
                                <ClientName>{client.name}</ClientName>
                                <ClientGoal>{client.status}</ClientGoal>
                              </div>
                            </ClientInfo>
                          </ClientCell>
                          <ClientCell>{client.plan}</ClientCell>
                          <ClientCell>{client.goal}</ClientCell>
                          <ClientCell>{client.totalSessions}</ClientCell>
                          <ClientCell>
                            <AttendanceBar>
                              <AttendanceFill $pct={client.attendanceRate} />
                            </AttendanceBar>
                            {client.attendanceRate}%
                          </ClientCell>
                        </ClientRow>
                      ))}
                    </ClientsTable>
                  );
                })()}
              </DetailSection>
            </>
          )}
        </Modal>

        {/* Add / Edit Modal */}
        {canManage && (
          <Modal
            isOpen={showForm}
            onClose={() => {
              setShowForm(false);
              setEditItem(null);
            }}
            title={editItem ? 'Edit Trainer' : 'Add Trainer'}
            subtitle={editItem ? `Editing — ${editItem.name}` : 'Add a new trainer to the team.'}
            size="lg"
            footer={
              <>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowForm(false);
                    setEditItem(null);
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleSubmit(onSubmit)} loading={isSubmitting}>
                  {editItem ? 'Save Changes' : 'Add Trainer'}
                </Button>
              </>
            }
          >
            <FormGrid>
              <SectionDivider>Personal Info</SectionDivider>

              <Input
                label="Full Name"
                required
                placeholder="e.g. Sam Rivera"
                error={errors.name?.message}
                {...register('name', { required: 'Name is required' })}
              />
              <Input
                label="Email"
                required
                placeholder="e.g. sam@musclemind.io"
                error={errors.email?.message}
                {...register('email', { required: 'Email is required' })}
              />
              <Input label="Phone" placeholder="e.g. +1 (555) 200-0001" {...register('phone')} />
              <Input label="Experience" placeholder="e.g. 7 years" {...register('experience')} />

              <SectionDivider>Expertise</SectionDivider>

              <FullWidth>
                <Input
                  label="Specializations (comma-separated)"
                  placeholder="e.g. Strength Training, HIIT, Boxing"
                  {...register('specializations')}
                />
              </FullWidth>
              <FullWidth>
                <Input
                  label="Certifications (comma-separated)"
                  placeholder="e.g. NASM-CPT, CrossFit L2"
                  {...register('certifications')}
                />
              </FullWidth>

              <SectionDivider>Bio</SectionDivider>

              <FullWidth>
                <Input
                  label="Bio"
                  textarea
                  placeholder="A short bio about the trainer..."
                  {...register('bio')}
                />
              </FullWidth>
            </FormGrid>
          </Modal>
        )}
      </MainLayout>
    </ProtectedRoute>
  );
}
