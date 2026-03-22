import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import {
  Wallet,
  CheckCircle,
  Clock,
  Users,
  Plus,
  Search,
  Edit,
  Trash2,
  History,
  Download,
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
import { dummyPayroll, PAYROLL_DEPARTMENTS } from '@/data/dummyData';
import { formatDate } from '@/utils/formatters';
import { ROLES } from '@/utils/constants';

// ── Helpers ───────────────────────────────────────────────────────────────────

const formatINR = (n) => `₹${Number(n).toLocaleString('en-IN')}`;

const STATUS_STYLES = {
  paid: { bg: '#3da63718', color: '#236b1e', label: 'Paid' },
  pending: { bg: '#f0be1f18', color: '#ab7f08', label: 'Pending' },
  processing: { bg: '#1aa8d418', color: '#116c8e', label: 'Processing' },
};

const DEPT_STYLES = {
  Training: { bg: '#5b5bec18', color: '#3535cc' },
  Management: { bg: '#1aa8d418', color: '#116c8e' },
  'Front Desk': { bg: '#f0be1f18', color: '#ab7f08' },
  Maintenance: { bg: '#89D38518', color: '#2e8829' },
  Marketing: { bg: '#EFCCEA18', color: '#864086' },
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

const EmployeeCell = styled.div`
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

const EmployeeInfo = styled.div``;

const EmployeeName = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const EmployeeRole = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
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

const AmountCell = styled.span`
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-variant-numeric: tabular-nums;
`;

const SalaryBreakdown = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-variant-numeric: tabular-nums;
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

const NetPayHighlight = styled.div`
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: ${({ theme }) => theme.colors.bgSecondary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const NetPayLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const NetPayValue = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.brandPrimary};
  font-variant-numeric: tabular-nums;
`;

// ── Payment History Styled ───────────────────────────────────────────────────

const HistoryHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: ${({ theme }) => theme.colors.bgSecondary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  margin-bottom: 20px;
`;

const HistoryEmployeeInfo = styled.div``;

const HistoryName = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const HistorySub = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textTertiary};
  margin-top: 2px;
`;

const HistorySummary = styled.div`
  display: flex;
  gap: 20px;
  text-align: right;
`;

const SummaryItem = styled.div`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textTertiary};
  text-transform: uppercase;
  letter-spacing: 0.4px;

  span {
    display: block;
    font-size: ${({ theme }) => theme.typography.fontSize.base};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    color: ${({ theme }) => theme.colors.textPrimary};
    margin-top: 2px;
  }
`;

const HistoryTable = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  overflow: hidden;
`;

const HRow = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 1fr 0.8fr 0.7fr 1fr 0.8fr 0.6fr;
  padding: 10px 16px;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ $header, theme }) => ($header ? theme.colors.bgSecondary : 'transparent')};
  color: ${({ $header, theme }) =>
    $header ? theme.colors.textTertiary : theme.colors.textPrimary};
  font-weight: ${({ $header, theme }) =>
    $header ? theme.typography.fontWeight.semibold : theme.typography.fontWeight.normal};
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

const SlipBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  font-size: 11px;
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
    width: 12px;
    height: 12px;
  }
`;

const LeaveCell = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ $high, theme }) => ($high ? theme.colors.error : theme.colors.textPrimary)};
  font-weight: ${({ $high }) => ($high ? '600' : '400')};
`;

const EmptyHistory = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: ${({ theme }) => theme.colors.textTertiary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

// ── Default form values ───────────────────────────────────────────────────────

const EMPTY_FORM = {
  employeeName: '',
  role: '',
  department: 'Training',
  baseSalary: '',
  ptFees: 0,
  payDate: '',
  status: 'pending',
  paymentMethod: 'Bank Transfer',
  accountNo: '',
};

// ── Page ──────────────────────────────────────────────────────────────────────

export default function PayrollPage() {
  const [payroll, setPayroll] = useState(dummyPayroll);
  const [search, setSearch] = useState('');
  const [filterDept, setFilterDept] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [historyItem, setHistoryItem] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: EMPTY_FORM });

  const watchBase = watch('baseSalary');
  const watchPtFees = watch('ptFees');
  const computedNet = (Number(watchBase) || 0) + (Number(watchPtFees) || 0);

  useEffect(() => {
    if (showForm) reset(editItem || EMPTY_FORM);
  }, [showForm, editItem, reset]);

  // ── Stats ──────────────────────────────────────────────────────────────────
  const totalPayroll = payroll.reduce((s, e) => s + e.netPay, 0);
  const paidTotal = payroll.filter((e) => e.status === 'paid').reduce((s, e) => s + e.netPay, 0);
  const pendingTotal = payroll
    .filter((e) => e.status === 'pending' || e.status === 'processing')
    .reduce((s, e) => s + e.netPay, 0);
  const employeeCount = payroll.length;

  // ── Filtered rows ──────────────────────────────────────────────────────────
  const filtered = payroll.filter((e) => {
    const q = search.toLowerCase();
    const matchSearch =
      !search || e.employeeName.toLowerCase().includes(q) || e.role.toLowerCase().includes(q);
    const matchDept = filterDept === 'all' || e.department === filterDept;
    const matchStatus = filterStatus === 'all' || e.status === filterStatus;
    return matchSearch && matchDept && matchStatus;
  });

  // ── Salary Slip Generator ──────────────────────────────────────────────────
  const generateSalarySlip = (employee, entry) => {
    const slipWindow = window.open('', '_blank', 'width=700,height=800');
    if (!slipWindow) return;
    const html = `<!DOCTYPE html>
<html><head><title>Salary Slip — ${employee.employeeName} — ${entry.month}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 40px; color: #1e293b; background: #fff; }
  .header { text-align: center; margin-bottom: 32px; border-bottom: 2px solid #1aa8d4; padding-bottom: 20px; }
  .header h1 { font-size: 22px; color: #1aa8d4; margin-bottom: 4px; }
  .header p { font-size: 12px; color: #64748b; }
  .title { font-size: 16px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #475569; margin-bottom: 24px; text-align: center; }
  .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px 40px; margin-bottom: 28px; padding: 16px; background: #f8fafc; border-radius: 8px; }
  .info-item { display: flex; justify-content: space-between; font-size: 13px; }
  .info-label { color: #64748b; }
  .info-value { font-weight: 600; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
  th, td { padding: 10px 16px; text-align: left; font-size: 13px; border-bottom: 1px solid #e2e8f0; }
  th { background: #f1f5f9; color: #475569; font-weight: 600; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px; }
  .amount { text-align: right; font-variant-numeric: tabular-nums; }
  .total-row td { font-weight: 700; font-size: 14px; border-top: 2px solid #1aa8d4; background: #f0f9ff; }
  .footer { margin-top: 48px; display: flex; justify-content: space-between; font-size: 12px; color: #94a3b8; }
  .signature { margin-top: 60px; display: flex; justify-content: space-between; }
  .sig-box { text-align: center; }
  .sig-line { width: 160px; border-top: 1px solid #cbd5e1; margin-bottom: 6px; }
  .sig-label { font-size: 11px; color: #64748b; }
  @media print { body { padding: 20px; } }
</style></head><body>
  <div class="header">
    <h1>MuscleMind</h1>
    <p>Gym Management System</p>
  </div>
  <div class="title">Salary Slip — ${entry.month}</div>
  <div class="info-grid">
    <div class="info-item"><span class="info-label">Employee Name</span><span class="info-value">${employee.employeeName}</span></div>
    <div class="info-item"><span class="info-label">Pay Date</span><span class="info-value">${entry.payDate}</span></div>
    <div class="info-item"><span class="info-label">Designation</span><span class="info-value">${employee.role}</span></div>
    <div class="info-item"><span class="info-label">Department</span><span class="info-value">${employee.department}</span></div>
    <div class="info-item"><span class="info-label">Account No</span><span class="info-value">${employee.accountNo || '—'}</span></div>
    <div class="info-item"><span class="info-label">Payment Method</span><span class="info-value">${entry.method}</span></div>
    <div class="info-item"><span class="info-label">Leave Days</span><span class="info-value">${entry.leaveDays || 0}</span></div>
    <div class="info-item"><span class="info-label">Status</span><span class="info-value">${entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}</span></div>
  </div>
  <table>
    <thead><tr><th>Description</th><th class="amount">Amount (₹)</th></tr></thead>
    <tbody>
      <tr><td>Base Salary</td><td class="amount">${Number(entry.baseSalary).toLocaleString('en-IN')}</td></tr>
      <tr><td>Personal Training Fees</td><td class="amount">${Number(entry.ptFees).toLocaleString('en-IN')}</td></tr>
      <tr class="total-row"><td>Net Pay</td><td class="amount">₹${Number(entry.netPay).toLocaleString('en-IN')}</td></tr>
    </tbody>
  </table>
  <div class="signature">
    <div class="sig-box"><div class="sig-line"></div><div class="sig-label">Employee Signature</div></div>
    <div class="sig-box"><div class="sig-line"></div><div class="sig-label">Authorized Signatory</div></div>
  </div>
  <div class="footer">
    <span>Generated on ${new Date().toLocaleDateString('en-IN')}</span>
    <span>This is a system-generated document</span>
  </div>
  <script>window.onload = function() { window.print(); }</script>
</body></html>`;
    slipWindow.document.write(html);
    slipWindow.document.close();
  };

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleEdit = (item) => {
    setEditItem(item);
    setShowForm(true);
  };

  const handleDelete = (item) => {
    if (confirm(`Remove payroll entry for "${item.employeeName}"? This cannot be undone.`)) {
      setPayroll((prev) => prev.filter((e) => e.id !== item.id));
    }
  };

  const onSubmit = async (data) => {
    await new Promise((r) => setTimeout(r, 600));
    const base = Number(data.baseSalary) || 0;
    const ptFees = Number(data.ptFees) || 0;
    const payload = {
      ...data,
      baseSalary: base,
      ptFees,
      netPay: base + ptFees,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.employeeName)}&background=1aa8d4&color=fff`,
    };
    if (editItem) {
      setPayroll((prev) => prev.map((e) => (e.id === editItem.id ? { ...e, ...payload } : e)));
    } else {
      setPayroll((prev) => [
        { id: `pay${Date.now()}`, employeeId: `e${Date.now()}`, ...payload },
        ...prev,
      ]);
    }
    setShowForm(false);
    setEditItem(null);
  };

  // ── Table columns ──────────────────────────────────────────────────────────
  const columns = [
    {
      key: 'employeeName',
      label: 'Employee',
      sortable: true,
      render: (val, row) => (
        <EmployeeCell>
          <Avatar src={row.avatar} alt={val} />
          <EmployeeInfo>
            <EmployeeName>{val}</EmployeeName>
            <EmployeeRole>{row.role}</EmployeeRole>
          </EmployeeInfo>
        </EmployeeCell>
      ),
    },
    {
      key: 'department',
      label: 'Department',
      sortable: true,
      render: (val) => {
        const s = DEPT_STYLES[val] || { bg: '#94a3b818', color: '#475569' };
        return (
          <Pill $bg={s.bg} $color={s.color}>
            {val}
          </Pill>
        );
      },
    },
    {
      key: 'baseSalary',
      label: 'Base Salary',
      sortable: true,
      render: (val) => <SalaryBreakdown>{formatINR(val)}</SalaryBreakdown>,
    },
    {
      key: 'ptFees',
      label: 'PT Fees',
      sortable: true,
      render: (val) => (
        <SalaryBreakdown style={{ color: val > 0 ? '#236b1e' : undefined }}>
          {val > 0 ? `+${formatINR(val)}` : '—'}
        </SalaryBreakdown>
      ),
    },
    {
      key: 'netPay',
      label: 'Net Pay',
      sortable: true,
      render: (val) => <AmountCell>{formatINR(val)}</AmountCell>,
    },
    {
      key: 'payDate',
      label: 'Pay Date',
      sortable: true,
      render: (val) => formatDate(val),
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
          <ActionBtn onClick={() => setHistoryItem(row)} title="Payment History">
            <History />
          </ActionBtn>
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
        <title>Payroll – MuscleMind</title>
      </Head>

      <MainLayout
        title="Payroll"
        subtitle="Manage employee salaries, bonuses, and payment records."
      >
        {/* Stats */}
        <StatsRow>
          <StatsCard
            label="Total Payroll"
            value={formatINR(totalPayroll)}
            icon={Wallet}
            color="#5b5bec"
          />
          <StatsCard label="Paid" value={formatINR(paidTotal)} icon={CheckCircle} color="#3da637" />
          <StatsCard label="Pending" value={formatINR(pendingTotal)} icon={Clock} color="#f0be1f" />
          <StatsCard label="Employees" value={employeeCount} icon={Users} color="#1aa8d4" />
        </StatsRow>

        {/* Toolbar */}
        <Toolbar>
          <Filters>
            <Input
              placeholder="Search employees..."
              leftIcon={<Search />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              fullWidth={false}
              style={{ width: 220 }}
            />
            <StyledSelect value={filterDept} onChange={(e) => setFilterDept(e.target.value)}>
              <option value="all">All Departments</option>
              {PAYROLL_DEPARTMENTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </StyledSelect>
            <StyledSelect value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
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
          emptyText="No payroll records found. Try adjusting your filters."
          emptyEmoji="💰"
          pageSize={10}
        />

        {/* Add / Edit Modal */}
        <Modal
          isOpen={showForm}
          onClose={() => {
            setShowForm(false);
            setEditItem(null);
          }}
          title={editItem ? 'Edit Payroll Entry' : 'Add Payroll Entry'}
          subtitle={
            editItem
              ? `Editing — ${editItem.employeeName}`
              : 'Enter salary details for an employee.'
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
            {/* ── Employee Info ── */}
            <SectionDivider>Employee Details</SectionDivider>

            <Input
              label="Employee Name"
              required
              placeholder="e.g. Sam Rivera"
              error={errors.employeeName?.message}
              {...register('employeeName', { required: 'Name is required' })}
            />

            <Input
              label="Role / Designation"
              required
              placeholder="e.g. Senior Trainer"
              error={errors.role?.message}
              {...register('role', { required: 'Role is required' })}
            />

            <FormGroup>
              <Label>
                Department <Req>*</Req>
              </Label>
              <FormSelect {...register('department', { required: true })}>
                {PAYROLL_DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </FormSelect>
            </FormGroup>

            <Input label="Account No" placeholder="e.g. XXXX-4521" {...register('accountNo')} />

            {/* ── Salary ── */}
            <SectionDivider>Salary Breakdown</SectionDivider>

            <Input
              label="Base Salary (₹)"
              type="number"
              required
              placeholder="0"
              error={errors.baseSalary?.message}
              {...register('baseSalary', {
                required: 'Base salary is required',
                min: { value: 1, message: 'Must be > 0' },
              })}
            />

            <Input
              label="Personal Training Fees (₹)"
              type="number"
              placeholder="0"
              {...register('ptFees', { min: { value: 0, message: 'Must be ≥ 0' } })}
            />

            <FormGroup>
              <Label>Payment Method</Label>
              <FormSelect {...register('paymentMethod')}>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="UPI">UPI</option>
                <option value="Cash">Cash</option>
                <option value="Cheque">Cheque</option>
              </FormSelect>
            </FormGroup>

            <NetPayHighlight>
              <NetPayLabel>Calculated Net Pay</NetPayLabel>
              <NetPayValue>{formatINR(Math.max(0, computedNet))}</NetPayValue>
            </NetPayHighlight>

            {/* ── Payment ── */}
            <SectionDivider>Payment Info</SectionDivider>

            <Controller
              name="payDate"
              control={control}
              rules={{ required: 'Pay date is required' }}
              render={({ field }) => (
                <DatePicker
                  label="Pay Date"
                  required
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.payDate?.message}
                />
              )}
            />

            <FormGroup>
              <Label>Status</Label>
              <FormSelect {...register('status')}>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
              </FormSelect>
            </FormGroup>
          </FormGrid>
        </Modal>
        {/* Payment History Modal */}
        <Modal
          isOpen={!!historyItem}
          onClose={() => setHistoryItem(null)}
          title="Payment History"
          subtitle={historyItem ? `${historyItem.employeeName} — ${historyItem.role}` : ''}
          size="lg"
          footer={
            <Button variant="ghost" onClick={() => setHistoryItem(null)}>
              Close
            </Button>
          }
        >
          {historyItem && (
            <>
              <HistoryHeader>
                <HistoryEmployeeInfo>
                  <HistoryName>{historyItem.employeeName}</HistoryName>
                  <HistorySub>
                    {historyItem.department} · {historyItem.paymentMethod} · A/c{' '}
                    {historyItem.accountNo}
                  </HistorySub>
                </HistoryEmployeeInfo>
                <HistorySummary>
                  <SummaryItem>
                    Records
                    <span>{(historyItem.paymentHistory || []).length}</span>
                  </SummaryItem>
                  <SummaryItem>
                    Total Paid
                    <span>
                      {formatINR(
                        (historyItem.paymentHistory || [])
                          .filter((p) => p.status === 'paid')
                          .reduce((s, p) => s + p.netPay, 0)
                      )}
                    </span>
                  </SummaryItem>
                </HistorySummary>
              </HistoryHeader>

              {!historyItem.paymentHistory || historyItem.paymentHistory.length === 0 ? (
                <EmptyHistory>No payment records found for this employee.</EmptyHistory>
              ) : (
                <HistoryTable>
                  <HRow $header>
                    <HCell>Month</HCell>
                    <HCell>Base Salary</HCell>
                    <HCell>PT Fees</HCell>
                    <HCell>Leaves</HCell>
                    <HCell>Net Pay</HCell>
                    <HCell>Status</HCell>
                    <HCell>Slip</HCell>
                  </HRow>
                  {[...historyItem.paymentHistory].reverse().map((entry) => {
                    const s = STATUS_STYLES[entry.status] || STATUS_STYLES.pending;
                    return (
                      <HRow key={entry.id}>
                        <HCell>{entry.month}</HCell>
                        <HCell>{formatINR(entry.baseSalary)}</HCell>
                        <HCell style={{ color: entry.ptFees > 0 ? '#236b1e' : undefined }}>
                          {entry.ptFees > 0 ? `+${formatINR(entry.ptFees)}` : '—'}
                        </HCell>
                        <HCell>
                          <LeaveCell $high={entry.leaveDays >= 3}>{entry.leaveDays || 0}</LeaveCell>
                        </HCell>
                        <HCell style={{ fontWeight: 600 }}>{formatINR(entry.netPay)}</HCell>
                        <HCell>
                          <Pill $bg={s.bg} $color={s.color}>
                            <PillDot />
                            {s.label}
                          </Pill>
                        </HCell>
                        <HCell>
                          <SlipBtn
                            onClick={() => generateSalarySlip(historyItem, entry)}
                            title="Download Salary Slip"
                          >
                            <Download /> Slip
                          </SlipBtn>
                        </HCell>
                      </HRow>
                    );
                  })}
                </HistoryTable>
              )}
            </>
          )}
        </Modal>
      </MainLayout>
    </ProtectedRoute>
  );
}
