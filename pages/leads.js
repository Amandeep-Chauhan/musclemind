import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import {
  UserPlus,
  PhoneCall,
  CheckCircle,
  XCircle,
  Plus,
  Search,
  Edit,
  Trash2,
  Phone,
} from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import MainLayout from '@/layouts/MainLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import StatsCard from '@/components/dashboard/StatsCard';
import Table from '@/components/common/Table';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Modal from '@/components/common/Modal';
import DatePicker from '@/components/common/DatePicker';
import { dummyLeads, LEAD_SOURCES, LEAD_STATUSES } from '@/data/dummyData';
import { formatDate } from '@/utils/formatters';
import { ROLES } from '@/utils/constants';

// ── Helpers ───────────────────────────────────────────────────────────────────

const STATUS_STYLES = {
  new: { bg: '#1aa8d418', color: '#116c8e', label: 'New' },
  contacted: { bg: '#5b5bec18', color: '#3535cc', label: 'Contacted' },
  interested: { bg: '#f0be1f18', color: '#ab7f08', label: 'Interested' },
  trial: { bg: '#89D38518', color: '#2e8829', label: 'Trial' },
  converted: { bg: '#3da63718', color: '#236b1e', label: 'Converted' },
  lost: { bg: '#f4404018', color: '#bc1717', label: 'Lost' },
};

const SOURCE_STYLES = {
  'Walk-in': { bg: '#3da63718', color: '#236b1e' },
  Website: { bg: '#1aa8d418', color: '#116c8e' },
  Instagram: { bg: '#EFCCEA18', color: '#864086' },
  'Google Ads': { bg: '#f0be1f18', color: '#ab7f08' },
  Referral: { bg: '#5b5bec18', color: '#3535cc' },
  Facebook: { bg: '#1aa8d418', color: '#116c8e' },
  'Phone Call': { bg: '#89D38518', color: '#2e8829' },
  Other: { bg: '#94a3b818', color: '#475569' },
};

const isOverdue = (dateStr) => {
  if (!dateStr) return false;
  return new Date(dateStr) < new Date();
};

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

const LeadCell = styled.div``;

const LeadName = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const LeadContact = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textTertiary};
  margin-top: 2px;
  display: flex;
  align-items: center;
  gap: 4px;

  svg {
    width: 10px;
    height: 10px;
  }
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

const DateCell = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ $overdue, theme }) => ($overdue ? theme.colors.error : theme.colors.textPrimary)};
  font-weight: ${({ $overdue }) => ($overdue ? '600' : '400')};
`;

const DateSub = styled.div`
  font-size: 10px;
  color: ${({ theme }) => theme.colors.error};
  margin-top: 1px;
`;

const NotesCell = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textTertiary};
  max-width: 180px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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

// ── Default form values ───────────────────────────────────────────────────────

const EMPTY_FORM = {
  name: '',
  phone: '',
  email: '',
  source: 'Walk-in',
  status: 'new',
  interestedPlan: '1 Month',
  notes: '',
  nextFollowUp: '',
};

// ── Page ──────────────────────────────────────────────────────────────────────

export default function LeadsPage() {
  const [leads, setLeads] = useState(dummyLeads);
  const [search, setSearch] = useState('');
  const [filterSource, setFilterSource] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: EMPTY_FORM });

  useEffect(() => {
    if (showForm) reset(editItem || EMPTY_FORM);
  }, [showForm, editItem, reset]);

  // ── Stats ──────────────────────────────────────────────────────────────────
  const totalLeads = leads.length;
  const activeLeads = leads.filter((l) => !['converted', 'lost'].includes(l.status)).length;
  const convertedLeads = leads.filter((l) => l.status === 'converted').length;
  const lostLeads = leads.filter((l) => l.status === 'lost').length;

  // ── Filtered rows ──────────────────────────────────────────────────────────
  const filtered = leads.filter((l) => {
    const q = search.toLowerCase();
    const matchSearch =
      !search ||
      l.name.toLowerCase().includes(q) ||
      l.phone.includes(q) ||
      (l.email || '').toLowerCase().includes(q);
    const matchSource = filterSource === 'all' || l.source === filterSource;
    const matchStatus = filterStatus === 'all' || l.status === filterStatus;
    return matchSearch && matchSource && matchStatus;
  });

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleEdit = (item) => {
    setEditItem(item);
    setShowForm(true);
  };

  const handleDelete = (item) => {
    if (confirm(`Remove lead "${item.name}"? This cannot be undone.`)) {
      setLeads((prev) => prev.filter((l) => l.id !== item.id));
    }
  };

  const onSubmit = async (data) => {
    await new Promise((r) => setTimeout(r, 600));
    if (editItem) {
      setLeads((prev) => prev.map((l) => (l.id === editItem.id ? { ...l, ...data } : l)));
    } else {
      setLeads((prev) => [
        {
          id: `lead${Date.now()}`,
          ...data,
          createdAt: new Date().toISOString().split('T')[0],
          lastFollowUp: null,
        },
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
      label: 'Lead',
      sortable: true,
      render: (val, row) => (
        <LeadCell>
          <LeadName>{val}</LeadName>
          <LeadContact>
            <Phone /> {row.phone}
          </LeadContact>
        </LeadCell>
      ),
    },
    {
      key: 'source',
      label: 'Source',
      sortable: true,
      render: (val) => {
        const s = SOURCE_STYLES[val] || SOURCE_STYLES.Other;
        return (
          <Pill $bg={s.bg} $color={s.color}>
            {val}
          </Pill>
        );
      },
    },
    {
      key: 'createdAt',
      label: 'Created',
      sortable: true,
      render: (val) => formatDate(val),
    },
    {
      key: 'interestedPlan',
      label: 'Plan',
      sortable: true,
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (val) => {
        const s = STATUS_STYLES[val] || STATUS_STYLES.new;
        return (
          <Pill $bg={s.bg} $color={s.color}>
            {s.label}
          </Pill>
        );
      },
    },
    {
      key: 'nextFollowUp',
      label: 'Next Follow-up',
      sortable: true,
      render: (val, row) => {
        if (!val) return <span style={{ color: '#94a3b8' }}>—</span>;
        const overdue = isOverdue(val) && !['converted', 'lost'].includes(row.status);
        return (
          <DateCell $overdue={overdue}>
            {formatDate(val)}
            {overdue && <DateSub>Overdue</DateSub>}
          </DateCell>
        );
      },
    },
    {
      key: 'notes',
      label: 'Notes',
      sortable: false,
      render: (val) => <NotesCell title={val}>{val || '—'}</NotesCell>,
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (_, row) => (
        <ActionMenu>
          <ActionBtn onClick={() => handleEdit(row)} title="Edit">
            <Edit />
          </ActionBtn>
          <ActionBtn $danger onClick={() => handleDelete(row)} title="Remove">
            <Trash2 />
          </ActionBtn>
        </ActionMenu>
      ),
    },
  ];

  return (
    <ProtectedRoute requiredRole={ROLES.ADMIN}>
      <Head>
        <title>Leads – MuscleMind</title>
      </Head>

      <MainLayout title="Leads" subtitle="Track prospects, follow-ups, and conversions.">
        {/* Stats */}
        <StatsRow>
          <StatsCard label="Total Leads" value={totalLeads} icon={UserPlus} color="#5b5bec" />
          <StatsCard label="Active" value={activeLeads} icon={PhoneCall} color="#1aa8d4" />
          <StatsCard label="Converted" value={convertedLeads} icon={CheckCircle} color="#3da637" />
          <StatsCard label="Lost" value={lostLeads} icon={XCircle} color="#f44040" />
        </StatsRow>

        {/* Toolbar */}
        <Toolbar>
          <Filters>
            <Input
              placeholder="Search leads..."
              leftIcon={<Search />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              fullWidth={false}
              style={{ width: 220 }}
            />
            <StyledSelect value={filterSource} onChange={(e) => setFilterSource(e.target.value)}>
              <option value="all">All Sources</option>
              {LEAD_SOURCES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </StyledSelect>
            <StyledSelect value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">All Status</option>
              {LEAD_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {STATUS_STYLES[s]?.label || s}
                </option>
              ))}
            </StyledSelect>
          </Filters>

          <Button
            icon={<Plus />}
            onClick={() => {
              setEditItem(null);
              setShowForm(true);
            }}
          >
            Add Lead
          </Button>
        </Toolbar>

        {/* Table */}
        <Table
          columns={columns}
          data={filtered}
          emptyText="No leads found. Try adjusting your filters."
          emptyEmoji="📋"
          pageSize={10}
        />

        {/* Add / Edit Modal */}
        <Modal
          isOpen={showForm}
          onClose={() => {
            setShowForm(false);
            setEditItem(null);
          }}
          title={editItem ? 'Edit Lead' : 'Add Lead'}
          subtitle={editItem ? `Editing — ${editItem.name}` : 'Enter details for a new prospect.'}
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
                {editItem ? 'Save Changes' : 'Add Lead'}
              </Button>
            </>
          }
        >
          <FormGrid>
            {/* ── Contact Info ── */}
            <SectionDivider>Contact Information</SectionDivider>

            <Input
              label="Full Name"
              required
              placeholder="e.g. Rohit Verma"
              error={errors.name?.message}
              {...register('name', { required: 'Name is required' })}
            />

            <Input
              label="Phone Number"
              required
              placeholder="e.g. +91 98765 43210"
              error={errors.phone?.message}
              {...register('phone', { required: 'Phone is required' })}
            />

            <Input label="Email" placeholder="e.g. rohit@email.com" {...register('email')} />

            <FormGroup>
              <Label>
                Source <Req>*</Req>
              </Label>
              <FormSelect {...register('source', { required: true })}>
                {LEAD_SOURCES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </FormSelect>
            </FormGroup>

            {/* ── Lead Details ── */}
            <SectionDivider>Lead Details</SectionDivider>

            <FormGroup>
              <Label>Interested Plan</Label>
              <FormSelect {...register('interestedPlan')}>
                <option value="1 Month">1 Month</option>
                <option value="3 Months">3 Months</option>
                <option value="6 Months">6 Months</option>
                <option value="12 Months">12 Months</option>
              </FormSelect>
            </FormGroup>

            <FormGroup>
              <Label>Status</Label>
              <FormSelect {...register('status')}>
                {LEAD_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_STYLES[s]?.label || s}
                  </option>
                ))}
              </FormSelect>
            </FormGroup>

            <Controller
              name="nextFollowUp"
              control={control}
              render={({ field }) => (
                <DatePicker label="Next Follow-up" value={field.value} onChange={field.onChange} />
              )}
            />

            <FullWidth>
              <Input
                label="Notes"
                textarea
                placeholder="Any details about the lead..."
                {...register('notes')}
              />
            </FullWidth>
          </FormGrid>
        </Modal>
      </MainLayout>
    </ProtectedRoute>
  );
}
