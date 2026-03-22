import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import {
  Package,
  CheckCircle,
  AlertTriangle,
  Archive,
  Plus,
  Search,
  Edit,
  Trash2,
  MapPin,
  Tag,
  History,
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
import { dummyEquipment, EQUIPMENT_CATEGORIES } from '@/data/dummyData';
import { formatDate } from '@/utils/formatters';

// ── Helpers ───────────────────────────────────────────────────────────────────

const formatINR = (n) => `₹${Number(n).toLocaleString('en-IN')}`;

const CONDITION_STYLE = {
  good: { bg: '#3da63718', color: '#236b1e', label: 'Good' },
  fair: { bg: '#f0be1f18', color: '#ab7f08', label: 'Fair' },
  poor: { bg: '#f4404018', color: '#bc1717', label: 'Poor' },
  retired: { bg: '#94a3b818', color: '#475569', label: 'Retired' },
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

const EquipCell = styled.div``;

const EquipName = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const EquipMeta = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textTertiary};
  margin-top: 2px;
  display: flex;
  align-items: center;
  gap: 4px;

  svg {
    width: 11px;
    height: 11px;
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

const PillDot = styled.span`
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: currentColor;
  flex-shrink: 0;
`;

const DateCell = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ $overdue, theme }) => ($overdue ? theme.colors.error : theme.colors.textPrimary)};
  font-weight: ${({ $overdue }) => ($overdue ? '600' : '400')};
`;

const DateSub = styled.div`
  font-size: 10px;
  color: ${({ $overdue, theme }) => ($overdue ? theme.colors.error : theme.colors.textTertiary)};
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

// ── Service History Styled ───────────────────────────────────────────────────

const HistoryHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: ${({ theme }) => theme.colors.bgSecondary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  margin-bottom: 20px;
`;

const HistoryEquipInfo = styled.div``;

const HistoryEquipName = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const HistoryEquipSub = styled.div`
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

const Timeline = styled.div`
  position: relative;
  padding-left: 28px;

  &::before {
    content: '';
    position: absolute;
    left: 8px;
    top: 6px;
    bottom: 6px;
    width: 2px;
    background: ${({ theme }) => theme.colors.border};
    border-radius: 1px;
  }
`;

const SERVICE_TYPE_STYLE = {
  'Routine Service': { bg: '#1aa8d418', color: '#116c8e', dot: '#1aa8d4' },
  Repair: { bg: '#f4404018', color: '#bc1717', dot: '#f44040' },
  Inspection: { bg: '#f0be1f18', color: '#ab7f08', dot: '#f0be1f' },
  'Part Replacement': { bg: '#5b5bec18', color: '#3535cc', dot: '#5b5bec' },
};

const TimelineItem = styled.div`
  position: relative;
  padding: 12px 16px;
  margin-bottom: 12px;
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: border-color ${({ theme }) => theme.transitions.fast};

  &:hover {
    border-color: ${({ theme }) => theme.colors.borderHover};
  }

  &::before {
    content: '';
    position: absolute;
    left: -24px;
    top: 18px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: ${({ $dotColor }) => $dotColor || '#94a3b8'};
    border: 2px solid ${({ theme }) => theme.colors.bgPrimary};
    z-index: 1;
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

const TimelineTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
  flex-wrap: wrap;
  gap: 6px;
`;

const TimelineDate = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const TimelineRight = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TimelineCost = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const TimelineTech = styled.div`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textTertiary};
  margin-bottom: 4px;
`;

const TimelineDesc = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.5;
`;

const EmptyHistory = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: ${({ theme }) => theme.colors.textTertiary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

// ── Default form values ───────────────────────────────────────────────────────

const EMPTY_FORM = {
  name: '',
  category: 'Cardio',
  brand: '',
  model: '',
  serialNo: '',
  location: '',
  purchaseDate: '',
  purchasePrice: '',
  lastRepairDate: '',
  nextServiceDue: '',
  condition: 'good',
  inUse: true,
  notes: '',
};

// ── Page ──────────────────────────────────────────────────────────────────────

export default function InventoryPage() {
  const [equipment, setEquipment] = useState(dummyEquipment);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCondition, setFilterCondition] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [historyItem, setHistoryItem] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: EMPTY_FORM,
  });

  useEffect(() => {
    if (showForm) reset(editItem || EMPTY_FORM);
  }, [showForm, editItem, reset]);

  // ── Stats ──────────────────────────────────────────────────────────────────
  const total = equipment.length;
  const inUseCount = equipment.filter((e) => e.inUse).length;
  const needsAttention = equipment.filter(
    (e) => e.condition === 'poor' || (e.nextServiceDue && isOverdue(e.nextServiceDue))
  ).length;
  const retiredCount = equipment.filter((e) => e.condition === 'retired').length;

  // ── Filtered list ──────────────────────────────────────────────────────────
  const filtered = equipment.filter((e) => {
    const q = search.toLowerCase();
    const matchSearch =
      !search ||
      e.name.toLowerCase().includes(q) ||
      e.brand.toLowerCase().includes(q) ||
      e.serialNo.toLowerCase().includes(q) ||
      (e.location || '').toLowerCase().includes(q);
    const matchCat = filterCategory === 'all' || e.category === filterCategory;
    const matchStat =
      filterStatus === 'all' ||
      (filterStatus === 'in-use' && e.inUse) ||
      (filterStatus === 'idle' && !e.inUse);
    const matchCond = filterCondition === 'all' || e.condition === filterCondition;
    return matchSearch && matchCat && matchStat && matchCond;
  });

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleEdit = (item) => {
    setEditItem(item);
    setShowForm(true);
  };

  const handleDelete = (item) => {
    if (confirm(`Remove "${item.name}" (${item.serialNo})? This cannot be undone.`)) {
      setEquipment((prev) => prev.filter((e) => e.id !== item.id));
    }
  };

  const onSubmit = async (data) => {
    await new Promise((r) => setTimeout(r, 600));
    const payload = {
      ...data,
      purchasePrice: data.purchasePrice ? Number(data.purchasePrice) : null,
      inUse: Boolean(data.inUse),
    };
    if (editItem) {
      setEquipment((prev) => prev.map((e) => (e.id === editItem.id ? { ...e, ...payload } : e)));
    } else {
      setEquipment((prev) => [{ id: `eq${Date.now()}`, ...payload }, ...prev]);
    }
    setShowForm(false);
    setEditItem(null);
  };

  // ── Table columns ──────────────────────────────────────────────────────────
  const columns = [
    {
      key: 'name',
      label: 'Equipment',
      sortable: true,
      render: (val, row) => (
        <EquipCell>
          <EquipName>{val}</EquipName>
          <EquipMeta>
            <Tag /> {row.brand} {row.model} &nbsp;·&nbsp;
            <MapPin /> {row.location || '—'}
          </EquipMeta>
        </EquipCell>
      ),
    },
    {
      key: 'category',
      label: 'Category',
      sortable: true,
      render: (val) => (
        <Pill $bg="#1aa8d418" $color="#116c8e">
          {val}
        </Pill>
      ),
    },
    {
      key: 'purchaseDate',
      label: 'Purchased',
      sortable: true,
      render: (val, row) => (
        <DateCell>
          {val ? formatDate(val) : '—'}
          {row.purchasePrice && <DateSub>{formatINR(row.purchasePrice)}</DateSub>}
        </DateCell>
      ),
    },
    {
      key: 'lastRepairDate',
      label: 'Last Repair',
      sortable: true,
      render: (val) => (
        <DateCell>
          {val ? formatDate(val) : <span style={{ color: '#94a3b8' }}>Never</span>}
        </DateCell>
      ),
    },
    {
      key: 'nextServiceDue',
      label: 'Next Service',
      sortable: true,
      render: (val) => {
        const overdue = isOverdue(val);
        return (
          <DateCell $overdue={overdue}>
            {val ? formatDate(val) : <span style={{ color: '#94a3b8' }}>—</span>}
            {overdue && <DateSub $overdue>⚠ Overdue</DateSub>}
          </DateCell>
        );
      },
    },
    {
      key: 'condition',
      label: 'Condition',
      sortable: true,
      render: (val) => {
        const s = CONDITION_STYLE[val] || CONDITION_STYLE.good;
        return (
          <Pill $bg={s.bg} $color={s.color}>
            <PillDot />
            {s.label}
          </Pill>
        );
      },
    },
    {
      key: 'inUse',
      label: 'Status',
      sortable: true,
      render: (val) =>
        val ? (
          <Pill $bg="#3da63718" $color="#236b1e">
            <PillDot />
            In Use
          </Pill>
        ) : (
          <Pill $bg="#94a3b818" $color="#475569">
            <PillDot />
            Idle
          </Pill>
        ),
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (_, row) => (
        <ActionMenu>
          <ActionBtn onClick={() => setHistoryItem(row)} title="Service History">
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
    <ProtectedRoute>
      <Head>
        <title>Inventory – MuscleMind</title>
      </Head>

      <MainLayout
        title="Inventory"
        subtitle="Manage gym equipment, maintenance schedules, and usage."
      >
        {/* Stats */}
        <StatsRow>
          <StatsCard label="Total Equipment" value={total} icon={Package} color="#5b5bec" />
          <StatsCard label="In Use" value={inUseCount} icon={CheckCircle} color="#3da637" />
          <StatsCard
            label="Needs Attention"
            value={needsAttention}
            icon={AlertTriangle}
            color="#f44040"
          />
          <StatsCard label="Retired" value={retiredCount} icon={Archive} color="#94a3b8" />
        </StatsRow>

        {/* Toolbar */}
        <Toolbar>
          <Filters>
            <Input
              placeholder="Search equipment..."
              leftIcon={<Search />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              fullWidth={false}
              style={{ width: 220 }}
            />
            <StyledSelect
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              {EQUIPMENT_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </StyledSelect>
            <StyledSelect
              value={filterCondition}
              onChange={(e) => setFilterCondition(e.target.value)}
            >
              <option value="all">All Conditions</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
              <option value="poor">Poor</option>
              <option value="retired">Retired</option>
            </StyledSelect>
            <StyledSelect value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">All Status</option>
              <option value="in-use">In Use</option>
              <option value="idle">Idle</option>
            </StyledSelect>
          </Filters>

          <Button
            icon={<Plus />}
            onClick={() => {
              setEditItem(null);
              setShowForm(true);
            }}
          >
            Add Equipment
          </Button>
        </Toolbar>

        {/* Table */}
        <Table
          columns={columns}
          data={filtered}
          emptyText="No equipment found. Try adjusting your filters."
          emptyEmoji="🏋️"
          pageSize={8}
        />

        {/* Add / Edit Modal */}
        <Modal
          isOpen={showForm}
          onClose={() => {
            setShowForm(false);
            setEditItem(null);
          }}
          title={editItem ? 'Edit Equipment' : 'Add Equipment'}
          subtitle={
            editItem
              ? `Editing — ${editItem.name}`
              : 'Log a new piece of equipment to the inventory.'
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
                {editItem ? 'Save Changes' : 'Add Equipment'}
              </Button>
            </>
          }
        >
          <FormGrid>
            {/* ── Basic Info ── */}
            <SectionDivider>Basic Information</SectionDivider>

            <FullWidth>
              <Input
                label="Equipment Name"
                required
                placeholder="e.g. Treadmill Pro 3000"
                error={errors.name?.message}
                {...register('name', { required: 'Name is required' })}
              />
            </FullWidth>

            <FormGroup>
              <Label>
                Category <Req>*</Req>
              </Label>
              <FormSelect {...register('category', { required: true })}>
                {EQUIPMENT_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </FormSelect>
            </FormGroup>

            <Input label="Brand" placeholder="e.g. LifeFitness" {...register('brand')} />

            <Input label="Model" placeholder="e.g. T3-Pro" {...register('model')} />

            <Input label="Serial Number" placeholder="e.g. LF-T3-001" {...register('serialNo')} />

            <Input label="Location" placeholder="e.g. Cardio Zone" {...register('location')} />

            {/* ── Purchase ── */}
            <SectionDivider>Purchase Details</SectionDivider>

            <Controller
              name="purchaseDate"
              control={control}
              render={({ field }) => (
                <DatePicker label="Purchase Date" value={field.value} onChange={field.onChange} />
              )}
            />

            <Input
              label="Purchase Price (₹)"
              type="number"
              placeholder="0"
              {...register('purchasePrice', { min: { value: 0, message: 'Must be ≥ 0' } })}
            />

            {/* ── Maintenance ── */}
            <SectionDivider>Maintenance</SectionDivider>

            <Controller
              name="lastRepairDate"
              control={control}
              render={({ field }) => (
                <DatePicker
                  label="Last Repair Date"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />

            <Controller
              name="nextServiceDue"
              control={control}
              render={({ field }) => (
                <DatePicker
                  label="Next Service Due"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />

            {/* ── Status ── */}
            <SectionDivider>Status</SectionDivider>

            <FormGroup>
              <Label>Condition</Label>
              <FormSelect {...register('condition')}>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor</option>
                <option value="retired">Retired</option>
              </FormSelect>
            </FormGroup>

            <FormGroup style={{ justifyContent: 'flex-end' }}>
              <CheckRow>
                <input type="checkbox" {...register('inUse')} />
                Currently in use
              </CheckRow>
            </FormGroup>

            <FullWidth>
              <Input
                label="Notes"
                textarea
                placeholder="Any additional notes about this equipment..."
                {...register('notes')}
              />
            </FullWidth>
          </FormGrid>
        </Modal>

        {/* Service History Modal */}
        <Modal
          isOpen={!!historyItem}
          onClose={() => setHistoryItem(null)}
          title="Service History"
          subtitle={historyItem ? `${historyItem.name} — ${historyItem.serialNo}` : ''}
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
                <HistoryEquipInfo>
                  <HistoryEquipName>
                    {historyItem.brand} {historyItem.model}
                  </HistoryEquipName>
                  <HistoryEquipSub>
                    {historyItem.category} · {historyItem.location || '—'}
                  </HistoryEquipSub>
                </HistoryEquipInfo>
                <HistorySummary>
                  <SummaryItem>
                    Records
                    <span>{(historyItem.serviceHistory || []).length}</span>
                  </SummaryItem>
                  <SummaryItem>
                    Total Spent
                    <span>
                      {formatINR(
                        (historyItem.serviceHistory || []).reduce(
                          (sum, s) => sum + (s.cost || 0),
                          0
                        )
                      )}
                    </span>
                  </SummaryItem>
                </HistorySummary>
              </HistoryHeader>

              {!historyItem.serviceHistory || historyItem.serviceHistory.length === 0 ? (
                <EmptyHistory>No service records found for this equipment.</EmptyHistory>
              ) : (
                <Timeline>
                  {[...historyItem.serviceHistory].reverse().map((entry) => {
                    const style =
                      SERVICE_TYPE_STYLE[entry.type] || SERVICE_TYPE_STYLE['Routine Service'];
                    return (
                      <TimelineItem key={entry.id} $dotColor={style.dot}>
                        <TimelineTop>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <TimelineDate>{formatDate(entry.date)}</TimelineDate>
                            <Pill $bg={style.bg} $color={style.color}>
                              {entry.type}
                            </Pill>
                          </div>
                          <TimelineRight>
                            {entry.cost > 0 && <TimelineCost>{formatINR(entry.cost)}</TimelineCost>}
                          </TimelineRight>
                        </TimelineTop>
                        <TimelineTech>Technician: {entry.technician}</TimelineTech>
                        <TimelineDesc>{entry.description}</TimelineDesc>
                      </TimelineItem>
                    );
                  })}
                </Timeline>
              )}
            </>
          )}
        </Modal>
      </MainLayout>
    </ProtectedRoute>
  );
}
