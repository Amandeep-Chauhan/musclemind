import React, { useState } from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import { Search, Plus, Eye } from 'lucide-react';
import MainLayout from '@/layouts/MainLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

import Table from '@/components/common/Table';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import { dummyAttendance } from '@/data/dummyData';
import { ROLES } from '@/utils/constants';
import { formatDate } from '@/utils/formatters';
import { useForm } from 'react-hook-form';

// ── Helpers ───────────────────────────────────────────────────────────────────

const STATUS_STYLES = {
  present: { bg: '#3da63718', color: '#236b1e', label: 'Present' },
  absent: { bg: '#f4404018', color: '#bc1717', label: 'Absent' },
  'half-day': { bg: '#f0be1f18', color: '#ab7f08', label: 'Half Day' },
  late: { bg: '#5b5bec18', color: '#3535cc', label: 'Late' },
};

const todayStr = '2026-03-22';

// ── Styled Components ─────────────────────────────────────────────────────────

const TabBar = styled.div`
  display: flex;
  gap: 0;
  margin-bottom: 20px;
  border-bottom: 2px solid ${({ theme }) => theme.colors.border};
`;

const Tab = styled.button`
  padding: 10px 24px;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.brandPrimary : theme.colors.textTertiary};
  background: none;
  border: none;
  border-bottom: 2px solid
    ${({ $active, theme }) => ($active ? theme.colors.brandPrimary : 'transparent')};
  margin-bottom: -2px;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};
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

const PersonCell = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Avatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
`;

const PersonInfo = styled.div``;

const PersonName = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const PersonSub = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textTertiary};
  margin-top: 1px;
`;

const CountCell = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ $color }) => $color || 'inherit'};
  font-variant-numeric: tabular-nums;
`;

const DetailBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 14px;
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.brandPrimary};
  background: ${({ theme }) => theme.colors.brandPrimary}12;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.brandPrimary}22;
  }

  svg {
    width: 13px;
    height: 13px;
  }
`;

// ── Detail Modal Styled ─────────────────────────────────────────────────────

const DetailHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: ${({ theme }) => theme.colors.bgSecondary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  margin-bottom: 16px;
`;

const DetailPersonInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const DetailAvatar = styled.img`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
`;

const DetailName = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const DetailRole = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textTertiary};
  margin-top: 2px;
`;

const DetailStats = styled.div`
  display: flex;
  gap: 20px;
  text-align: right;
`;

const DetailStatItem = styled.div`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textTertiary};
  text-transform: uppercase;
  letter-spacing: 0.4px;

  span {
    display: block;
    font-size: ${({ theme }) => theme.typography.fontSize.base};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    color: ${({ $color }) => $color || 'inherit'};
    margin-top: 2px;
  }
`;

const DetailFilterRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
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

const DetailTable = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  overflow: hidden;
`;

const DRow = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 0.8fr 0.8fr 0.8fr 1fr;
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

const DCell = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
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

const EmptyDetail = styled.div`
  text-align: center;
  padding: 32px;
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

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Req = styled.span`
  color: ${({ theme }) => theme.colors.error};
  margin-left: 2px;
`;

const FormSelect = styled.select`
  width: 100%;
  padding: 9px 36px 9px 14px;
  background: ${({ theme }) => theme.colors.bgInput};
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  outline: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  cursor: pointer;
  transition: border-color ${({ theme }) => theme.transitions.fast};

  &:focus {
    border-color: ${({ theme }) => theme.colors.brandPrimary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.brandPrimary}22;
  }
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

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AttendancePage() {
  const [attendance, setAttendance] = useState(dummyAttendance);
  const [activeTab, setActiveTab] = useState('staff');
  const [search, setSearch] = useState('');
  const [filterMonth, setFilterMonth] = useState('2026-03');
  const [showForm, setShowForm] = useState(false);
  const [detailPerson, setDetailPerson] = useState(null);
  const [detailMonthFilter, setDetailMonthFilter] = useState('2026-03');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  React.useEffect(() => {
    if (showForm)
      reset({
        name: '',
        type: activeTab,
        role: '',
        plan: '',
        checkIn: '',
        checkOut: '',
        status: 'present',
        date: todayStr,
      });
  }, [showForm, activeTab, reset]);

  // ── Available months ────────────────────────────────────────────────────────
  const allMonths = [
    ...new Set(attendance.filter((a) => a.type === activeTab).map((a) => a.date.slice(0, 7))),
  ]
    .sort()
    .reverse();
  const monthLabel = (m) => {
    const [y, mo] = m.split('-');
    return new Date(y, mo - 1).toLocaleString('en-US', { month: 'long', year: 'numeric' });
  };

  // ── Build summary per person (filtered by month) ──────────────────────────
  const tabRecords = attendance.filter(
    (a) => a.type === activeTab && a.date.startsWith(filterMonth)
  );
  const personMap = {};
  tabRecords.forEach((a) => {
    if (!personMap[a.personId]) {
      personMap[a.personId] = {
        personId: a.personId,
        name: a.name,
        avatar: a.avatar,
        role: a.role,
        plan: a.plan,
        present: 0,
        absent: 0,
        halfDay: 0,
        totalHours: 0,
        records: [],
      };
    }
    const p = personMap[a.personId];
    if (a.status === 'present' || a.status === 'late') p.present++;
    else if (a.status === 'absent') p.absent++;
    else if (a.status === 'half-day') p.halfDay++;
    p.totalHours += a.hours || 0;
    p.records.push(a);
  });

  const summaryList = Object.values(personMap);

  const filtered = summaryList.filter((p) => {
    const q = search.toLowerCase();
    return !search || p.name.toLowerCase().includes(q);
  });

  // ── Detail modal data (all records for person, not just current month) ────
  const allPersonRecords = detailPerson
    ? attendance.filter((a) => a.personId === detailPerson.personId && a.type === activeTab)
    : [];
  const detailMonths = [...new Set(allPersonRecords.map((r) => r.date.slice(0, 7)))]
    .sort()
    .reverse();
  const detailRecords = allPersonRecords
    .filter((r) => detailMonthFilter === 'all' || r.date.startsWith(detailMonthFilter))
    .sort((a, b) => b.date.localeCompare(a.date));

  // ── Handler ────────────────────────────────────────────────────────────────
  const onSubmit = async (data) => {
    await new Promise((r) => setTimeout(r, 400));
    const hours =
      data.checkIn && data.checkOut
        ? Math.round(
            ((new Date(`2026-01-01T${data.checkOut}`) - new Date(`2026-01-01T${data.checkIn}`)) /
              3600000) *
              10
          ) / 10
        : null;
    setAttendance((prev) => [
      {
        id: `att${Date.now()}`,
        personId: `new${Date.now()}`,
        name: data.name,
        type: data.type,
        role: data.role || undefined,
        plan: data.plan || undefined,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=1aa8d4&color=fff`,
        date: data.date,
        checkIn: data.checkIn || null,
        checkOut: data.checkOut || null,
        status: data.status,
        hours,
      },
      ...prev,
    ]);
    setShowForm(false);
  };

  // ── Summary table columns ─────────────────────────────────────────────────
  const columns = [
    {
      key: 'name',
      label: activeTab === 'staff' ? 'Staff' : 'Member',
      sortable: true,
      render: (val, row) => (
        <PersonCell>
          <Avatar src={row.avatar} alt={val} />
          <PersonInfo>
            <PersonName>{val}</PersonName>
            <PersonSub>{row.role || row.plan || ''}</PersonSub>
          </PersonInfo>
        </PersonCell>
      ),
    },
    {
      key: 'present',
      label: 'Present',
      sortable: true,
      render: (val) => <CountCell $color="#236b1e">{val}</CountCell>,
    },
    {
      key: 'absent',
      label: 'Absent',
      sortable: true,
      render: (val) => <CountCell $color={val > 0 ? '#bc1717' : undefined}>{val}</CountCell>,
    },
    {
      key: 'halfDay',
      label: 'Half Days',
      sortable: true,
      render: (val) => <CountCell $color={val > 0 ? '#ab7f08' : undefined}>{val}</CountCell>,
    },
    {
      key: 'avgHours',
      label: 'Avg Working Hours',
      sortable: true,
      render: (_, row) => {
        const daysWorked = row.present + row.halfDay;
        const avg = daysWorked > 0 ? (row.totalHours / daysWorked).toFixed(1) : 0;
        return <CountCell>{avg}h</CountCell>;
      },
    },
    {
      key: 'actions',
      label: '',
      sortable: false,
      render: (_, row) => (
        <DetailBtn
          onClick={() => {
            setDetailPerson(row);
            setDetailMonthFilter(filterMonth);
          }}
        >
          <Eye /> Details
        </DetailBtn>
      ),
    },
  ];

  return (
    <ProtectedRoute requiredRole={ROLES.ADMIN}>
      <Head>
        <title>Attendance – MuscleMind</title>
      </Head>

      <MainLayout title="Attendance" subtitle="Track daily check-ins for staff and members.">
        {/* Tabs */}
        <TabBar>
          <Tab
            $active={activeTab === 'staff'}
            onClick={() => {
              setActiveTab('staff');
              setSearch('');
            }}
          >
            Staff
          </Tab>
          <Tab
            $active={activeTab === 'member'}
            onClick={() => {
              setActiveTab('member');
              setSearch('');
            }}
          >
            Members
          </Tab>
        </TabBar>

        {/* Toolbar */}
        <Toolbar>
          <Filters>
            <Input
              placeholder={`Search ${activeTab}...`}
              leftIcon={<Search />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              fullWidth={false}
              style={{ width: 220 }}
            />
            <StyledSelect value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)}>
              {allMonths.map((m) => (
                <option key={m} value={m}>
                  {monthLabel(m)}
                </option>
              ))}
            </StyledSelect>
          </Filters>

          <Button icon={<Plus />} onClick={() => setShowForm(true)}>
            Log Entry
          </Button>
        </Toolbar>

        {/* Summary Table */}
        <Table
          columns={columns}
          data={filtered}
          emptyText={`No ${activeTab} attendance records found.`}
          emptyEmoji="📋"
          pageSize={10}
        />

        {/* Detail Modal */}
        <Modal
          isOpen={!!detailPerson}
          onClose={() => setDetailPerson(null)}
          title="Attendance Details"
          subtitle=""
          size="lg"
          footer={
            <Button variant="ghost" onClick={() => setDetailPerson(null)}>
              Close
            </Button>
          }
        >
          {detailPerson && (
            <>
              <DetailHeader>
                <DetailPersonInfo>
                  <DetailAvatar src={detailPerson.avatar} alt={detailPerson.name} />
                  <div>
                    <DetailName>{detailPerson.name}</DetailName>
                    <DetailRole>{detailPerson.role || detailPerson.plan || ''}</DetailRole>
                  </div>
                </DetailPersonInfo>
                <DetailStats>
                  <DetailStatItem $color="#236b1e">
                    Present
                    <span>{detailPerson.present}</span>
                  </DetailStatItem>
                  <DetailStatItem $color="#bc1717">
                    Absent
                    <span>{detailPerson.absent}</span>
                  </DetailStatItem>
                  <DetailStatItem $color="#ab7f08">
                    Half Days
                    <span>{detailPerson.halfDay}</span>
                  </DetailStatItem>
                  <DetailStatItem $color="#1aa8d4">
                    Avg Hours
                    <span>
                      {(detailPerson.present + detailPerson.halfDay > 0
                        ? detailPerson.totalHours / (detailPerson.present + detailPerson.halfDay)
                        : 0
                      ).toFixed(1)}
                    </span>
                  </DetailStatItem>
                </DetailStats>
              </DetailHeader>

              <DetailFilterRow>
                <StyledSelect
                  value={detailMonthFilter}
                  onChange={(e) => setDetailMonthFilter(e.target.value)}
                >
                  <option value="all">All Months</option>
                  {detailMonths.map((m) => (
                    <option key={m} value={m}>
                      {monthLabel(m)}
                    </option>
                  ))}
                </StyledSelect>
              </DetailFilterRow>

              {detailRecords.length === 0 ? (
                <EmptyDetail>No records for the selected date.</EmptyDetail>
              ) : (
                <DetailTable>
                  <DRow $header>
                    <DCell>Date</DCell>
                    <DCell>Check In</DCell>
                    <DCell>Check Out</DCell>
                    <DCell>Hours</DCell>
                    <DCell>Status</DCell>
                  </DRow>
                  {detailRecords.map((r) => {
                    const s = STATUS_STYLES[r.status] || STATUS_STYLES.present;
                    return (
                      <DRow key={r.id}>
                        <DCell>{formatDate(r.date)}</DCell>
                        <DCell>{r.checkIn || '—'}</DCell>
                        <DCell>{r.checkOut || '—'}</DCell>
                        <DCell>{r.hours !== null ? `${r.hours}h` : '—'}</DCell>
                        <DCell>
                          <Pill $bg={s.bg} $color={s.color}>
                            <PillDot />
                            {s.label}
                          </Pill>
                        </DCell>
                      </DRow>
                    );
                  })}
                </DetailTable>
              )}
            </>
          )}
        </Modal>

        {/* Add Entry Modal */}
        <Modal
          isOpen={showForm}
          onClose={() => setShowForm(false)}
          title="Log Attendance"
          subtitle={`Add a ${activeTab} check-in record.`}
          size="lg"
          footer={
            <>
              <Button variant="ghost" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit(onSubmit)} loading={isSubmitting}>
                Log Entry
              </Button>
            </>
          }
        >
          <FormGrid>
            <SectionDivider>Person</SectionDivider>

            <Input
              label="Name"
              required
              placeholder="e.g. Sam Rivera"
              error={errors.name?.message}
              {...register('name', { required: 'Name is required' })}
            />

            <FormGroup>
              <Label>
                Type <Req>*</Req>
              </Label>
              <FormSelect {...register('type')}>
                <option value="staff">Staff</option>
                <option value="member">Member</option>
              </FormSelect>
            </FormGroup>

            <Input
              label={activeTab === 'staff' ? 'Role' : 'Plan'}
              placeholder={activeTab === 'staff' ? 'e.g. Senior Trainer' : 'e.g. Elite'}
              {...register(activeTab === 'staff' ? 'role' : 'plan')}
            />

            <Input label="Date" type="date" {...register('date')} />

            <SectionDivider>Time</SectionDivider>

            <Input label="Check In" type="time" {...register('checkIn')} />
            <Input label="Check Out" type="time" {...register('checkOut')} />

            <FormGroup>
              <Label>Status</Label>
              <FormSelect {...register('status')}>
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="half-day">Half Day</option>
                <option value="late">Late</option>
              </FormSelect>
            </FormGroup>
          </FormGrid>
        </Modal>
      </MainLayout>
    </ProtectedRoute>
  );
}
