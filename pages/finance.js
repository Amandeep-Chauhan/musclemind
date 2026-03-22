import React, { useState } from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  AlertTriangle,
  Search,
  Plus,
  Edit,
  Trash2,
  RefreshCw,
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
import { dummyTransactions, ACCOUNT_CATEGORIES } from '@/data/dummyData';
import { formatDate } from '@/utils/formatters';
import { ROLES } from '@/utils/constants';

// ── Helpers ───────────────────────────────────────────────────────────────────

const formatINR = (n) => `₹${Number(n).toLocaleString('en-IN')}`;

const STATUS_STYLES = {
  received: { bg: '#3da63718', color: '#236b1e', label: 'Received' },
  paid: { bg: '#3da63718', color: '#236b1e', label: 'Paid' },
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

const TypePill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  background: ${({ $type }) => ($type === 'income' ? '#3da63718' : '#f4404018')};
  color: ${({ $type }) => ($type === 'income' ? '#236b1e' : '#bc1717')};
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

const CategoryPill = styled.span`
  display: inline-flex;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  background: ${({ theme }) => theme.colors.bgSecondary};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const AmountCell = styled.span`
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ $type }) => ($type === 'income' ? '#236b1e' : '#bc1717')};
  font-variant-numeric: tabular-nums;
`;

const DescCell = styled.div``;

const DescTitle = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
  display: flex;
  align-items: center;
  gap: 5px;
`;

const DescRef = styled.div`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textTertiary};
  margin-top: 1px;
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

const CheckRow = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: pointer;

  input[type='checkbox'] {
    width: 16px;
    height: 16px;
    accent-color: ${({ theme }) => theme.colors.brandPrimary};
    cursor: pointer;
    background: ${({ theme }) => theme.colors.bgInput};
    border: 1.5px solid ${({ theme }) => theme.colors.border};
    border-radius: 3px;
    appearance: none;
    -webkit-appearance: none;
    display: grid;
    place-content: center;

    &:checked {
      background: ${({ theme }) => theme.colors.brandPrimary};
      border-color: ${({ theme }) => theme.colors.brandPrimary};
    }

    &:checked::before {
      content: '';
      width: 10px;
      height: 10px;
      clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
      background: white;
    }
  }
`;

// ── Default form values ───────────────────────────────────────────────────────

const EMPTY_FORM = {
  type: 'income',
  category: 'Membership Fees',
  description: '',
  amount: '',
  dueDate: '',
  transactionDate: '',
  paymentMode: '',
  payee: '',
  status: 'pending',
  recurring: false,
};

// ── Page ──────────────────────────────────────────────────────────────────────

export default function FinancePage() {
  const [transactions, setTransactions] = useState(dummyTransactions);
  const [search, setSearch] = useState('');
  const [filterMonth, setFilterMonth] = useState('2026-03');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: EMPTY_FORM });

  const watchType = watch('type', 'income');

  React.useEffect(() => {
    if (showForm) reset(editItem || EMPTY_FORM);
  }, [showForm, editItem, reset]);

  // ── Month helpers ─────────────────────────────────────────────────────────
  const allMonths = [...new Set(transactions.map((t) => t.dueDate.slice(0, 7)))].sort().reverse();
  const monthLabel = (m) => {
    const [y, mo] = m.split('-');
    return new Date(y, mo - 1).toLocaleString('en-US', { month: 'long', year: 'numeric' });
  };

  // ── Filtered data ─────────────────────────────────────────────────────────
  const monthData = transactions.filter((t) => t.dueDate.startsWith(filterMonth));
  const filtered = monthData.filter((t) => {
    const matchType = filterType === 'all' || t.type === filterType;
    const matchSearch =
      !search ||
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      (t.payee || '').toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || t.status === filterStatus;
    return matchType && matchSearch && matchStatus;
  });

  // ── Stats ─────────────────────────────────────────────────────────────────
  const totalIncome = monthData
    .filter((t) => t.type === 'income')
    .reduce((s, t) => s + t.amount, 0);
  const totalExpense = monthData
    .filter((t) => t.type === 'expense')
    .reduce((s, t) => s + t.amount, 0);
  const netProfit = totalIncome - totalExpense;
  const outstanding = monthData
    .filter((t) => t.status === 'pending' || t.status === 'overdue')
    .reduce((s, t) => s + t.amount, 0);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleEdit = (item) => {
    setEditItem(item);
    setShowForm(true);
  };

  const handleDelete = (item) => {
    if (confirm(`Delete "${item.description}"?`)) {
      setTransactions((prev) => prev.filter((t) => t.id !== item.id));
    }
  };

  const onSubmit = async (data) => {
    await new Promise((r) => setTimeout(r, 600));
    const payload = { ...data, amount: Number(data.amount), recurring: Boolean(data.recurring) };
    if (editItem) {
      setTransactions((prev) => prev.map((t) => (t.id === editItem.id ? { ...t, ...payload } : t)));
    } else {
      setTransactions((prev) => [{ id: `txn${Date.now()}`, ...payload }, ...prev]);
    }
    setShowForm(false);
    setEditItem(null);
  };

  // ── Table columns ─────────────────────────────────────────────────────────
  const columns = [
    {
      key: 'description',
      label: 'Description',
      sortable: true,
      render: (val, row) => (
        <DescCell>
          <DescTitle>
            {val}
            {row.recurring && (
              <RefreshCw style={{ width: 12, height: 12, color: '#94a3b8', flexShrink: 0 }} />
            )}
          </DescTitle>
          {row.payee && <DescRef>{row.payee}</DescRef>}
        </DescCell>
      ),
    },
    {
      key: 'type',
      label: 'Type',
      sortable: true,
      render: (val) => <TypePill $type={val}>{val === 'income' ? 'Income' : 'Expense'}</TypePill>,
    },
    {
      key: 'category',
      label: 'Category',
      sortable: true,
      render: (val) => <CategoryPill>{val}</CategoryPill>,
    },
    {
      key: 'amount',
      label: 'Amount',
      sortable: true,
      render: (val, row) => (
        <AmountCell $type={row.type}>
          {row.type === 'income' ? '+' : '-'}
          {formatINR(val)}
        </AmountCell>
      ),
    },
    {
      key: 'dueDate',
      label: 'Due Date',
      sortable: true,
      render: (val) => (val ? formatDate(val) : <span style={{ color: '#94a3b8' }}>—</span>),
    },
    {
      key: 'transactionDate',
      label: 'Transaction Date',
      sortable: true,
      render: (val) => (val ? formatDate(val) : <span style={{ color: '#94a3b8' }}>—</span>),
    },
    {
      key: 'paymentMode',
      label: 'Mode',
      sortable: true,
      render: (val) => val || <span style={{ color: '#94a3b8' }}>—</span>,
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (val) => {
        const s = STATUS_STYLES[val] || STATUS_STYLES.pending;
        return (
          <Pill $bg={s.bg} $color={s.color}>
            <PillDot />
            {s.label}
          </Pill>
        );
      },
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
          <ActionBtn $danger onClick={() => handleDelete(row)} title="Delete">
            <Trash2 />
          </ActionBtn>
        </ActionMenu>
      ),
    },
  ];

  return (
    <ProtectedRoute requiredRole={ROLES.ADMIN}>
      <Head>
        <title>Finance – MuscleMind</title>
      </Head>

      <MainLayout title="Finance" subtitle="Track all income and expenses in one place.">
        {/* Stats */}
        <StatsRow>
          <StatsCard
            label="Income"
            value={formatINR(totalIncome)}
            icon={TrendingUp}
            color="#3da637"
          />
          <StatsCard
            label="Expenses"
            value={formatINR(totalExpense)}
            icon={TrendingDown}
            color="#f44040"
          />
          <StatsCard
            label="Net Profit"
            value={formatINR(netProfit)}
            icon={DollarSign}
            color={netProfit >= 0 ? '#1aa8d4' : '#f44040'}
          />
          <StatsCard
            label="Outstanding"
            value={formatINR(outstanding)}
            icon={AlertTriangle}
            color="#f0be1f"
          />
        </StatsRow>

        {/* Toolbar */}
        <Toolbar>
          <Filters>
            <Input
              placeholder="Search transactions..."
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
            <StyledSelect value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </StyledSelect>
            <StyledSelect value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">All Status</option>
              <option value="received">Received</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
            </StyledSelect>
          </Filters>

          <Button
            icon={<Plus />}
            onClick={() => {
              setEditItem(null);
              setShowForm(true);
            }}
          >
            Add Entry
          </Button>
        </Toolbar>

        {/* Table */}
        <Table
          columns={columns}
          data={filtered}
          emptyText="No transactions found. Try adjusting your filters."
          emptyEmoji="📊"
          pageSize={10}
        />

        {/* Add / Edit Modal */}
        <Modal
          isOpen={showForm}
          onClose={() => {
            setShowForm(false);
            setEditItem(null);
          }}
          title={editItem ? 'Edit Entry' : 'Add Entry'}
          subtitle={
            editItem ? `Editing — ${editItem.description}` : 'Record a new income or expense.'
          }
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
                {editItem ? 'Save Changes' : 'Add Entry'}
              </Button>
            </>
          }
        >
          <FormGrid>
            <SectionDivider>Details</SectionDivider>

            <FormGroup>
              <Label>
                Type <Req>*</Req>
              </Label>
              <FormSelect {...register('type', { required: true })}>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </FormSelect>
            </FormGroup>

            <FormGroup>
              <Label>
                Category <Req>*</Req>
              </Label>
              <FormSelect {...register('category', { required: true })}>
                {(ACCOUNT_CATEGORIES[watchType] || []).map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </FormSelect>
            </FormGroup>

            <FullWidth>
              <Input
                label="Description"
                required
                placeholder="e.g. Monthly membership collections"
                error={errors.description?.message}
                {...register('description', { required: 'Description is required' })}
              />
            </FullWidth>

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
              name="dueDate"
              control={control}
              rules={{ required: 'Due date is required' }}
              render={({ field }) => (
                <DatePicker
                  label="Due Date"
                  required
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.dueDate?.message}
                />
              )}
            />

            <Controller
              name="transactionDate"
              control={control}
              render={({ field }) => (
                <DatePicker
                  label="Transaction Date"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />

            <SectionDivider>Payment</SectionDivider>

            <Input label="Payee" placeholder="e.g. City Power Co" {...register('payee')} />

            <FormGroup>
              <Label>Payment Mode</Label>
              <FormSelect {...register('paymentMode')}>
                <option value="">—</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="UPI">UPI</option>
                <option value="Cash">Cash</option>
                <option value="Cheque">Cheque</option>
              </FormSelect>
            </FormGroup>

            <FormGroup>
              <Label>Status</Label>
              <FormSelect {...register('status')}>
                <option value="received">Received</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="overdue">Overdue</option>
              </FormSelect>
            </FormGroup>

            <FormGroup style={{ justifyContent: 'flex-end' }}>
              <CheckRow>
                <input type="checkbox" {...register('recurring')} />
                Recurring transaction
              </CheckRow>
            </FormGroup>
          </FormGrid>
        </Modal>
      </MainLayout>
    </ProtectedRoute>
  );
}
