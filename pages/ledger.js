import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import {
  Receipt, CheckCircle, Clock, AlertTriangle, Plus, Search,
  Edit, Trash2, RefreshCw,
} from 'lucide-react';
import MainLayout from '@/layouts/MainLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import StatsCard from '@/components/dashboard/StatsCard';
import Table from '@/components/common/Table';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Modal from '@/components/common/Modal';
import Badge from '@/components/common/Badge';
import { dummyExpenses, EXPENSE_CATEGORIES } from '@/data/dummyData';
import { formatDate } from '@/utils/formatters';
import { ROLES } from '@/utils/constants';
import { useForm, Controller } from 'react-hook-form';
import DatePicker from '@/components/common/DatePicker';

// ── Helpers ───────────────────────────────────────────────────────────────────

const formatINR = (n) => `₹${Number(n).toLocaleString('en-IN')}`;

const CATEGORY_STYLES = {
  Rent:        { bg: '#1aa8d418', color: '#116c8e' },
  Salaries:    { bg: '#5b5bec18', color: '#3535cc' },
  Utilities:   { bg: '#f0be1f18', color: '#ab7f08' },
  Maintenance: { bg: '#ffb74d18', color: '#c05800' },
  Equipment:   { bg: '#6CD1F018', color: '#116c8e' },
  Inventory:   { bg: '#89D38518', color: '#2e8829' },
  Marketing:   { bg: '#EFCCEA18', color: '#864086' },
  Insurance:   { bg: '#f4404018', color: '#bc1717' },
  Other:       { bg: '#94a3b818', color: '#475569' },
};

const STATUS_STYLES = {
  paid:    { bg: '#3da63718', color: '#236b1e', label: 'Paid' },
  pending: { bg: '#f0be1f18', color: '#ab7f08', label: 'Pending' },
  overdue: { bg: '#f4404018', color: '#bc1717', label: 'Overdue' },
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

const CategoryPill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  background: ${({ $style }) => $style?.bg || '#94a3b818'};
  color: ${({ $style }) => $style?.color || '#475569'};
`;

const StatusPill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  background: ${({ $style }) => $style?.bg};
  color: ${({ $style }) => $style?.color};
`;

const StatusDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
  display: inline-block;
`;

const AmountCell = styled.span`
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-variant-numeric: tabular-nums;
`;

const RecurringIcon = styled.span`
  display: inline-flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.textTertiary};
  svg { width: 13px; height: 13px; }
`;

const TitleCell = styled.div``;
const TitleText = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
  display: flex;
  align-items: center;
  gap: 6px;
`;
const PayeeText = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textTertiary};
  margin-top: 2px;
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
    background: ${({ $danger, theme }) => $danger ? `${theme.colors.error}22` : theme.colors.bgHover};
    color: ${({ $danger, theme }) => $danger ? theme.colors.error : theme.colors.textPrimary};
  }
  svg { width: 14px; height: 14px; }
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

const CheckRow = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: pointer;
  padding-top: 4px;

  input[type='checkbox'] {
    width: 16px;
    height: 16px;
    accent-color: ${({ theme }) => theme.colors.brandPrimary};
    cursor: pointer;
  }
`;

// ── Default values ────────────────────────────────────────────────────────────

const EMPTY_FORM = {
  title: '', category: 'Rent', amount: '', date: '', payee: '',
  status: 'pending', recurring: false, notes: '',
};

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function LedgerPage() {
  const [expenses, setExpenses] = useState(dummyExpenses);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const { register, handleSubmit, reset, control, formState: { errors, isSubmitting } } = useForm({
    defaultValues: EMPTY_FORM,
  });

  useEffect(() => {
    if (showForm) reset(editItem || EMPTY_FORM);
  }, [showForm, editItem, reset]);

  // ── Derived stats ──────────────────────────────────────────────────────────
  const total   = expenses.reduce((s, e) => s + e.amount, 0);
  const paid    = expenses.filter((e) => e.status === 'paid').reduce((s, e) => s + e.amount, 0);
  const pending = expenses.filter((e) => e.status === 'pending').reduce((s, e) => s + e.amount, 0);
  const overdue = expenses.filter((e) => e.status === 'overdue').reduce((s, e) => s + e.amount, 0);

  // ── Filtered rows ──────────────────────────────────────────────────────────
  const filtered = expenses.filter((e) => {
    const matchSearch = !search || e.title.toLowerCase().includes(search.toLowerCase()) || e.payee.toLowerCase().includes(search.toLowerCase());
    const matchCat    = filterCategory === 'all' || e.category === filterCategory;
    const matchStatus = filterStatus === 'all' || e.status === filterStatus;
    return matchSearch && matchCat && matchStatus;
  });

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleEdit = (item) => { setEditItem(item); setShowForm(true); };

  const handleDelete = (item) => {
    if (confirm(`Delete "${item.title}"? This cannot be undone.`)) {
      setExpenses((prev) => prev.filter((e) => e.id !== item.id));
    }
  };

  const onSubmit = async (data) => {
    await new Promise((r) => setTimeout(r, 600));
    if (editItem) {
      setExpenses((prev) => prev.map((e) => e.id === editItem.id ? { ...e, ...data, amount: Number(data.amount) } : e));
    } else {
      setExpenses((prev) => [
        { id: `exp${Date.now()}`, ...data, amount: Number(data.amount) },
        ...prev,
      ]);
    }
    setShowForm(false);
    setEditItem(null);
  };

  // ── Columns ────────────────────────────────────────────────────────────────
  const columns = [
    {
      key: 'date',
      label: 'Date',
      sortable: true,
      render: (val) => formatDate(val),
    },
    {
      key: 'title',
      label: 'Description',
      sortable: true,
      render: (val, row) => (
        <TitleCell>
          <TitleText>
            {val}
            {row.recurring && (
              <RecurringIcon title="Recurring"><RefreshCw /></RecurringIcon>
            )}
          </TitleText>
          <PayeeText>{row.payee}</PayeeText>
        </TitleCell>
      ),
    },
    {
      key: 'category',
      label: 'Category',
      sortable: true,
      render: (val) => (
        <CategoryPill $style={CATEGORY_STYLES[val] || CATEGORY_STYLES.Other}>
          {val}
        </CategoryPill>
      ),
    },
    {
      key: 'amount',
      label: 'Amount',
      sortable: true,
      render: (val) => <AmountCell>{formatINR(val)}</AmountCell>,
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (val) => {
        const s = STATUS_STYLES[val] || STATUS_STYLES.pending;
        return (
          <StatusPill $style={s}>
            <StatusDot />
            {s.label}
          </StatusPill>
        );
      },
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (_, row) => (
        <ActionMenu>
          <ActionBtn onClick={() => handleEdit(row)} title="Edit"><Edit /></ActionBtn>
          <ActionBtn $danger onClick={() => handleDelete(row)} title="Delete"><Trash2 /></ActionBtn>
        </ActionMenu>
      ),
    },
  ];

  return (
    <ProtectedRoute requiredRole={ROLES.ADMIN}>
      <Head>
        <title>Ledger – MuscleMind</title>
      </Head>

      <MainLayout title="Ledger" subtitle="Track and manage all gym expenses.">

        <StatsRow>
          <StatsCard label="Total Expenses" value={formatINR(total)} icon={Receipt} color="#5b5bec" />
          <StatsCard label="Paid" value={formatINR(paid)} icon={CheckCircle} color="#3da637" />
          <StatsCard label="Pending" value={formatINR(pending)} icon={Clock} color="#f0be1f" />
          <StatsCard label="Overdue" value={formatINR(overdue)} icon={AlertTriangle} color="#f44040" />
        </StatsRow>

        <Toolbar>
          <Filters>
            <Input
              placeholder="Search expenses..."
              leftIcon={<Search />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              fullWidth={false}
              style={{ width: 220 }}
            />
            <StyledSelect value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
              <option value="all">All Categories</option>
              {EXPENSE_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </StyledSelect>
            <StyledSelect value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
            </StyledSelect>
          </Filters>

          <Button icon={<Plus />} onClick={() => { setEditItem(null); setShowForm(true); }}>
            Add Expense
          </Button>
        </Toolbar>

        <Table
          columns={columns}
          data={filtered}
          emptyText="No expenses found. Try adjusting your filters."
          emptyEmoji="🧾"
          pageSize={10}
        />

        {/* Add / Edit Modal */}
        <Modal
          isOpen={showForm}
          onClose={() => { setShowForm(false); setEditItem(null); }}
          title={editItem ? 'Edit Expense' : 'Add Expense'}
          subtitle={editItem ? `Editing — ${editItem.title}` : 'Fill in the details to log a new expense.'}
          size="lg"
          footer={
            <>
              <Button variant="ghost" onClick={() => { setShowForm(false); setEditItem(null); }}>
                Cancel
              </Button>
              <Button onClick={handleSubmit(onSubmit)} loading={isSubmitting}>
                {editItem ? 'Save Changes' : 'Add Expense'}
              </Button>
            </>
          }
        >
          <FormGrid>
            <FullWidth>
              <Input
                label="Title / Description"
                required
                placeholder="e.g. Monthly Rent"
                error={errors.title?.message}
                {...register('title', { required: 'Title is required' })}
              />
            </FullWidth>

            <FormGroup>
              <Label>Category</Label>
              <FormSelect {...register('category', { required: true })}>
                {EXPENSE_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </FormSelect>
            </FormGroup>

            <Input
              label="Amount (₹)"
              type="number"
              required
              placeholder="0"
              error={errors.amount?.message}
              {...register('amount', {
                required: 'Amount is required',
                min: { value: 1, message: 'Must be > 0' },
              })}
            />

            <Controller
              name="date"
              control={control}
              rules={{ required: 'Date is required' }}
              render={({ field }) => (
                <DatePicker
                  label="Date"
                  required
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.date?.message}
                />
              )}
            />

            <Input
              label="Payee"
              placeholder="e.g. City Power Co"
              {...register('payee')}
            />

            <FormGroup>
              <Label>Status</Label>
              <FormSelect {...register('status')}>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="overdue">Overdue</option>
              </FormSelect>
            </FormGroup>

            <FullWidth>
              <Input
                label="Notes"
                textarea
                placeholder="Any additional notes..."
                {...register('notes')}
              />
            </FullWidth>

            <FullWidth>
              <CheckRow>
                <input type="checkbox" {...register('recurring')} />
                Recurring expense
              </CheckRow>
            </FullWidth>
          </FormGrid>
        </Modal>

      </MainLayout>
    </ProtectedRoute>
  );
}
