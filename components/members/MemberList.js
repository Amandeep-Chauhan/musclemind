import React, { useState } from 'react';
import styled from 'styled-components';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import Table from '@/components/common/Table';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { StatusBadge, PlanBadge } from '@/components/common/Badge';
import { formatDate } from '@/utils/formatters';
import MemberForm from './MemberForm';
import MemberDetailModal from './MemberDetailModal';

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const Filters = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const Select = styled.select`
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
  transition: border-color ${({ theme }) => theme.transitions.fast},
              box-shadow ${({ theme }) => theme.transitions.fast};

  &:focus {
    border-color: ${({ theme }) => theme.colors.brandPrimary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.brandPrimary}22;
  }

  &:hover:not(:focus) {
    border-color: ${({ theme }) => theme.colors.borderHover};
  }
`;

const AvatarCell = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Avatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid ${({ theme }) => theme.colors.border};
  object-fit: cover;
`;

const MemberName = styled.div`
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.brandPrimary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const MemberEmail = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textTertiary};
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

const AttendanceBar = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Bar = styled.div`
  flex: 1;
  height: 6px;
  background: ${({ theme }) => theme.colors.bgHover};
  border-radius: 3px;
  overflow: hidden;
  max-width: 80px;
`;

const Fill = styled.div`
  height: 100%;
  width: ${({ $pct }) => $pct}%;
  background: ${({ $pct, theme }) =>
    $pct >= 85 ? theme.colors.success :
    $pct >= 60 ? theme.colors.warning :
    theme.colors.error};
  border-radius: 3px;
  transition: width 0.5s ease;
`;

const columns = (onEdit, onDelete, onView) => [
  {
    key: 'name',
    label: 'Member',
    sortable: true,
    render: (_, row) => (
      <AvatarCell>
        <Avatar src={row.avatar} alt={row.name} />
        <div>
          <MemberName onClick={() => onView(row)}>{row.name}</MemberName>
          <MemberEmail>{row.email}</MemberEmail>
        </div>
      </AvatarCell>
    ),
  },
  {
    key: 'plan',
    label: 'Plan',
    sortable: true,
    render: (val) => <PlanBadge plan={val} />,
  },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    render: (val) => <StatusBadge status={val} />,
  },
  {
    key: 'joinDate',
    label: 'Joined',
    sortable: true,
    render: (val) => formatDate(val),
  },
  {
    key: 'expiryDate',
    label: 'Expires',
    sortable: true,
    render: (val) => formatDate(val),
  },
  {
    key: 'attendanceRate',
    label: 'Attendance',
    sortable: true,
    render: (val) => (
      <AttendanceBar>
        <Bar>
          <Fill $pct={val} />
        </Bar>
        <span style={{ fontSize: 12, color: '#64748b', minWidth: 32 }}>{val}%</span>
      </AttendanceBar>
    ),
  },
  {
    key: 'actions',
    label: 'Actions',
    sortable: false,
    render: (_, row) => (
      <ActionMenu>
        <ActionBtn onClick={() => onEdit(row)} title="Edit"><Edit /></ActionBtn>
        <ActionBtn $danger onClick={() => onDelete(row)} title="Delete"><Trash2 /></ActionBtn>
      </ActionMenu>
    ),
  },
];

export default function MemberList({ members, loading, filters, onFilterChange }) {
  const [showForm, setShowForm] = useState(false);
  const [editMember, setEditMember] = useState(null);
  const [viewMember, setViewMember] = useState(null);

  const handleEdit = (member) => {
    setEditMember(member);
    setShowForm(true);
  };

  const handleDelete = (member) => {
    if (confirm(`Delete ${member.name}? This action cannot be undone.`)) {
      // dispatch deleteMember
    }
  };

  const handleView = (member) => {
    setViewMember(member);
  };

  return (
    <div>
      <Header>
        <Filters>
          <Input
            placeholder="Search members..."
            leftIcon={<Search />}
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            fullWidth={false}
            style={{ width: 220 }}
          />
          <Select value={filters.status} onChange={(e) => onFilterChange({ status: e.target.value })}>
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
          </Select>
          <Select value={filters.plan} onChange={(e) => onFilterChange({ plan: e.target.value })}>
            <option value="all">All Plans</option>
            <option value="starter">Starter</option>
            <option value="pro">Pro</option>
            <option value="elite">Elite</option>
          </Select>
        </Filters>

        <Button icon={<Plus />} onClick={() => { setEditMember(null); setShowForm(true); }}>
          Add Member
        </Button>
      </Header>

      <Table
        columns={columns(handleEdit, handleDelete, handleView)}
        data={members}
        loading={loading}
        emptyText="No members found. Try adjusting your filters."
        emptyEmoji="👥"
        pageSize={10}
      />

      <MemberForm
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditMember(null); }}
        member={editMember}
      />

      <MemberDetailModal
        isOpen={!!viewMember}
        onClose={() => setViewMember(null)}
        member={viewMember}
      />
    </div>
  );
}
