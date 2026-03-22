import React, { useState } from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import { Search, Plus, Edit, Trash2, Key } from 'lucide-react';
import { useForm } from 'react-hook-form';
import MainLayout from '@/layouts/MainLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

import Table from '@/components/common/Table';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Modal from '@/components/common/Modal';
import { dummyUsers } from '@/data/dummyData';
import { formatDate } from '@/utils/formatters';
import { ROLES } from '@/utils/constants';

// ── Helpers ───────────────────────────────────────────────────────────────────

const ROLE_STYLES = {
  superadmin: { bg: '#f4404018', color: '#bc1717', label: 'Super Admin' },
  admin: { bg: '#1aa8d418', color: '#116c8e', label: 'Admin' },
  trainer: { bg: '#3da63718', color: '#236b1e', label: 'Trainer' },
  client: { bg: '#f0be1f18', color: '#ab7f08', label: 'Client' },
};

const STATUS_STYLES = {
  active: { bg: '#3da63718', color: '#236b1e', label: 'Active' },
  inactive: { bg: '#94a3b818', color: '#475569', label: 'Inactive' },
};

// ── Styled Components ─────────────────────────────────────────────────────────

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

const UserCell = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Avatar = styled.img`
  width: 34px;
  height: 34px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
`;

const UserInfo = styled.div``;

const UserName = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const UserEmail = styled.div`
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

const PasswordNote = styled.div`
  grid-column: 1 / -1;
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textTertiary};
  display: flex;
  align-items: center;
  gap: 6px;

  svg {
    width: 13px;
    height: 13px;
    color: ${({ theme }) => theme.colors.brandPrimary};
  }
`;

// ── Default form values ───────────────────────────────────────────────────────

const EMPTY_FORM = {
  name: '',
  email: '',
  phone: '',
  role: 'trainer',
  status: 'active',
  password: '',
};

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AccountsPage() {
  const [users, setUsers] = useState(dummyUsers);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: EMPTY_FORM });

  React.useEffect(() => {
    if (showForm) reset(editItem ? { ...editItem, password: '' } : EMPTY_FORM);
  }, [showForm, editItem, reset]);

  // ── Filtered rows ──────────────────────────────────────────────────────────
  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    const matchSearch =
      !search || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    const matchRole = filterRole === 'all' || u.role === filterRole;
    const matchStatus = filterStatus === 'all' || u.status === filterStatus;
    return matchSearch && matchRole && matchStatus;
  });

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleEdit = (item) => {
    setEditItem(item);
    setShowForm(true);
  };

  const handleDelete = (item) => {
    if (item.role === 'superadmin') {
      alert('Cannot delete Super Admin account.');
      return;
    }
    if (confirm(`Delete account "${item.name}" (${item.email})? This cannot be undone.`)) {
      setUsers((prev) => prev.filter((u) => u.id !== item.id));
    }
  };

  const onSubmit = async (data) => {
    await new Promise((r) => setTimeout(r, 600));
    const payload = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: data.role,
      status: data.status,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=1aa8d4&color=fff`,
    };
    if (editItem) {
      setUsers((prev) => prev.map((u) => (u.id === editItem.id ? { ...u, ...payload } : u)));
    } else {
      setUsers((prev) => [
        {
          id: `u${Date.now()}`,
          ...payload,
          joinDate: new Date().toISOString().split('T')[0],
          lastLogin: null,
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
      label: 'User',
      sortable: true,
      render: (val, row) => (
        <UserCell>
          <Avatar src={row.avatar} alt={val} />
          <UserInfo>
            <UserName>{val}</UserName>
            <UserEmail>{row.email}</UserEmail>
          </UserInfo>
        </UserCell>
      ),
    },
    {
      key: 'role',
      label: 'Role',
      sortable: true,
      render: (val) => {
        const s = ROLE_STYLES[val] || ROLE_STYLES.client;
        return (
          <Pill $bg={s.bg} $color={s.color}>
            {s.label}
          </Pill>
        );
      },
    },
    {
      key: 'phone',
      label: 'Phone',
      sortable: false,
    },
    {
      key: 'joinDate',
      label: 'Created',
      sortable: true,
      render: (val) => formatDate(val),
    },
    {
      key: 'lastLogin',
      label: 'Last Login',
      sortable: true,
      render: (val) => (val ? formatDate(val) : <span style={{ color: '#94a3b8' }}>Never</span>),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (val) => {
        const s = STATUS_STYLES[val] || STATUS_STYLES.active;
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
          {row.role !== 'superadmin' && (
            <ActionBtn $danger onClick={() => handleDelete(row)} title="Delete">
              <Trash2 />
            </ActionBtn>
          )}
        </ActionMenu>
      ),
    },
  ];

  return (
    <ProtectedRoute requiredRole={ROLES.SUPER_ADMIN}>
      <Head>
        <title>Accounts – MuscleMind</title>
      </Head>

      <MainLayout title="Accounts" subtitle="Manage user accounts, roles, and access.">
        {/* Toolbar */}
        <Toolbar>
          <Filters>
            <Input
              placeholder="Search users..."
              leftIcon={<Search />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              fullWidth={false}
              style={{ width: 220 }}
            />
            <StyledSelect value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
              <option value="all">All Roles</option>
              <option value="superadmin">Super Admin</option>
              <option value="admin">Admin</option>
              <option value="trainer">Trainer</option>
            </StyledSelect>
            <StyledSelect value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </StyledSelect>
          </Filters>

          <Button
            icon={<Plus />}
            onClick={() => {
              setEditItem(null);
              setShowForm(true);
            }}
          >
            Create Account
          </Button>
        </Toolbar>

        {/* Table */}
        <Table
          columns={columns}
          data={filtered}
          emptyText="No accounts found."
          emptyEmoji="👤"
          pageSize={10}
        />

        {/* Create / Edit Modal */}
        <Modal
          isOpen={showForm}
          onClose={() => {
            setShowForm(false);
            setEditItem(null);
          }}
          title={editItem ? 'Edit Account' : 'Create Account'}
          subtitle={editItem ? `Editing — ${editItem.name}` : 'Set up a new user account.'}
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
                {editItem ? 'Save Changes' : 'Create Account'}
              </Button>
            </>
          }
        >
          <FormGrid>
            <SectionDivider>User Details</SectionDivider>

            <Input
              label="Full Name"
              required
              placeholder="e.g. Jordan Lee"
              error={errors.name?.message}
              {...register('name', { required: 'Name is required' })}
            />

            <Input
              label="Email"
              required
              placeholder="e.g. jordan@musclemind.io"
              error={errors.email?.message}
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' },
              })}
            />

            <Input label="Phone" placeholder="e.g. +1 (555) 001-0002" {...register('phone')} />

            <FormGroup>
              <Label>
                Role <Req>*</Req>
              </Label>
              <FormSelect {...register('role', { required: true })}>
                <option value="superadmin">Super Admin</option>
                <option value="admin">Admin</option>
                <option value="trainer">Trainer</option>
                <option value="client">Client</option>
              </FormSelect>
            </FormGroup>

            <SectionDivider>Access</SectionDivider>

            {!editItem && (
              <Input
                label="Password"
                type="password"
                required
                placeholder="Min 6 characters"
                error={errors.password?.message}
                {...register('password', {
                  required: editItem ? false : 'Password is required',
                  minLength: { value: 6, message: 'Min 6 characters' },
                })}
              />
            )}

            {editItem && (
              <Input
                label="New Password (leave blank to keep current)"
                type="password"
                placeholder="Enter new password"
                {...register('password')}
              />
            )}

            <FormGroup>
              <Label>Status</Label>
              <FormSelect {...register('status')}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </FormSelect>
            </FormGroup>

            <PasswordNote>
              <Key /> Passwords are encrypted and cannot be viewed after creation.
            </PasswordNote>
          </FormGrid>
        </Modal>
      </MainLayout>
    </ProtectedRoute>
  );
}
