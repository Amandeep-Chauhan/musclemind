import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Dumbbell,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Zap,
  BookOpen,
  Package,
  Wallet,
  UserPlus,
  User,
  ClipboardCheck,
  Calculator,
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSidebarCollapse, selectSidebarCollapsed } from '@/store/slices/uiSlice';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES, ROLES } from '@/utils/constants';

const NAV_ITEMS = [
  { label: 'Dashboard', href: ROUTES.DASHBOARD, icon: LayoutDashboard, roles: null },
  { label: 'Members', href: ROUTES.MEMBERS, icon: Users, roles: null },
  { label: 'Plans', href: ROUTES.PLANS, icon: CreditCard, roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN] },
  {
    label: 'Trainers',
    href: ROUTES.TRAINERS,
    icon: Dumbbell,
    roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
  },
  { label: 'My Profile', href: ROUTES.PROFILE, icon: User, exactRoles: [ROLES.TRAINER] },
  {
    label: 'Finance',
    href: ROUTES.FINANCE,
    icon: BookOpen,
    roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
  },
  { label: 'Inventory', href: ROUTES.INVENTORY, icon: Package, roles: null },
  { label: 'Payroll', href: ROUTES.PAYROLL, icon: Wallet, roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN] },
  { label: 'Leads', href: ROUTES.LEADS, icon: UserPlus, roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN] },
  {
    label: 'Attendance',
    href: ROUTES.ATTENDANCE,
    icon: ClipboardCheck,
    roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
  },
  {
    label: 'Accounts',
    href: ROUTES.ACCOUNTS,
    icon: Calculator,
    roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
  },
];

const SidebarWrapper = styled.aside`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: ${({ $collapsed }) => ($collapsed ? '72px' : '240px')};
  background: ${({ theme }) => theme.colors.sidebarBg};
  border-right: 1px solid ${({ theme }) => theme.colors.sidebarBorder};
  display: flex;
  flex-direction: column;
  transition: width ${({ theme }) => theme.transitions.normal};
  z-index: ${({ theme }) => theme.zIndex.sticky};
  overflow: visible;
`;

const LogoArea = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: ${({ $collapsed }) => ($collapsed ? '20px 16px' : '20px 20px')};
  min-height: 64px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.sidebarBorder};
`;

const LogoIcon = styled.div`
  width: 36px;
  height: 36px;
  background: ${({ theme }) => theme.colors.brandPrimary};
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: ${({ theme }) => theme.shadows.glow};
`;

const LogoText = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.extrabold};
  color: ${({ theme }) => theme.colors.textInverse};
  white-space: nowrap;
  background: linear-gradient(135deg, #1aa8d4, #3535cc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Nav = styled.nav`
  flex: 1;
  padding: 12px 0;
  overflow-y: auto;
  overflow-x: hidden;
  min-width: 0;
`;

const NavItem = styled.div`
  margin: 2px 8px;
`;

const NavLink = styled.a`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: ${({ $collapsed }) => ($collapsed ? '10px 18px' : '10px 14px')};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  text-decoration: none;
  transition: all ${({ theme }) => theme.transitions.fast};
  position: relative;
  color: ${({ $active, theme }) =>
    $active ? theme.colors.sidebarActiveText : theme.colors.sidebarText};
  background: ${({ $active, theme }) =>
    $active ? `${theme.colors.sidebarActive}22` : 'transparent'};

  ${({ $active, theme }) =>
    $active &&
    `
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 4px;
      bottom: 4px;
      width: 3px;
      background: ${theme.colors.sidebarActive};
      border-radius: 0 3px 3px 0;
    }
  `}

  &:hover {
    background: ${({ $active, theme }) =>
      $active ? `${theme.colors.sidebarActive}22` : theme.colors.sidebarHover};
    color: ${({ theme }) => theme.colors.sidebarActiveText};
    text-decoration: none;
  }

  svg {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
    color: ${({ $active, theme }) =>
      $active ? theme.colors.sidebarActive : theme.colors.sidebarIcon};
    transition: color ${({ theme }) => theme.transitions.fast};
  }

  &:hover svg {
    color: ${({ theme }) => theme.colors.sidebarActive};
  }
`;

const NavLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  white-space: nowrap;
`;

const Tooltip = styled.div`
  position: absolute;
  left: calc(100% + 12px);
  top: 50%;
  transform: translateY(-50%);
  background: ${({ theme }) => theme.colors.bgCard};
  color: ${({ theme }) => theme.colors.textPrimary};
  padding: 6px 10px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  white-space: nowrap;
  box-shadow: ${({ theme }) => theme.shadows.lg};
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s;
  z-index: 999;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const NavLinkWrapper = styled.div`
  position: relative;
  &:hover ${Tooltip} {
    opacity: 1;
  }
`;

const CollapseBtn = styled.button`
  position: absolute;
  right: -12px;
  top: 76px;
  width: 24px;
  height: 24px;
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.textSecondary};
  transition: all ${({ theme }) => theme.transitions.fast};
  z-index: 10;

  &:hover {
    background: ${({ theme }) => theme.colors.brandPrimary};
    color: white;
    border-color: ${({ theme }) => theme.colors.brandPrimary};
  }

  svg {
    width: 12px;
    height: 12px;
  }
`;

const SidebarBottom = styled.div`
  padding: 12px 8px;
  border-top: 1px solid ${({ theme }) => theme.colors.sidebarBorder};
`;

const UserCard = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  transition: background ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.sidebarHover};
  }
`;

const UserAvatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid ${({ theme }) => theme.colors.sidebarBorder};
  flex-shrink: 0;
`;

const UserInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const UserName = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.sidebarActiveText};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const UserRole = styled.div`
  font-size: 10px;
  color: ${({ theme }) => theme.colors.sidebarText};
  text-transform: capitalize;
`;

const LogoutBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.sidebarIcon};
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  transition: color ${({ theme }) => theme.transitions.fast};
  flex-shrink: 0;

  &:hover {
    color: ${({ theme }) => theme.colors.error};
  }
  svg {
    width: 16px;
    height: 16px;
  }
`;

export default function Sidebar() {
  const router = useRouter();
  const dispatch = useDispatch();
  const collapsed = useSelector(selectSidebarCollapsed);
  const { user, logout, can } = useAuth();

  const isActive = (href) => router.pathname === href || router.pathname.startsWith(href + '/');

  const visibleItems = NAV_ITEMS.filter((item) => {
    if (item.exactRoles) return item.exactRoles.includes(user?.role);
    return !item.roles || item.roles.some((r) => can(r));
  });

  return (
    <SidebarWrapper $collapsed={collapsed}>
      {/* Logo */}
      <LogoArea $collapsed={collapsed}>
        <LogoIcon>
          <Zap size={20} color="white" fill="white" />
        </LogoIcon>
        {!collapsed && <LogoText>MuscleMind</LogoText>}
      </LogoArea>

      {/* Collapse toggle */}
      <CollapseBtn onClick={() => dispatch(toggleSidebarCollapse())}>
        {collapsed ? <ChevronRight /> : <ChevronLeft />}
      </CollapseBtn>

      {/* Navigation */}
      <Nav>
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <NavItem key={item.href}>
              <NavLinkWrapper>
                <Link href={item.href} passHref legacyBehavior>
                  <NavLink $active={active} $collapsed={collapsed}>
                    <Icon />
                    {!collapsed && <NavLabel>{item.label}</NavLabel>}
                  </NavLink>
                </Link>
                {collapsed && <Tooltip>{item.label}</Tooltip>}
              </NavLinkWrapper>
            </NavItem>
          );
        })}
      </Nav>

      {/* User + Logout */}
      <SidebarBottom>
        <UserCard>
          <UserAvatar
            src={
              user?.avatar ||
              `https://ui-avatars.com/api/?name=${user?.name || 'U'}&background=ff3511&color=fff`
            }
            alt={user?.name}
          />
          {!collapsed && (
            <UserInfo>
              <UserName>{user?.name || 'User'}</UserName>
              <UserRole>{user?.role || 'member'}</UserRole>
            </UserInfo>
          )}
          {!collapsed && (
            <LogoutBtn onClick={logout} title="Logout">
              <LogOut />
            </LogoutBtn>
          )}
        </UserCard>
      </SidebarBottom>
    </SidebarWrapper>
  );
}
