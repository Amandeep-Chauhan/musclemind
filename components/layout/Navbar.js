import React, { useState } from 'react';
import styled from 'styled-components';
import { Sun, Moon, Bell, Menu, Search, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import {
  toggleSidebar,
  selectNotifications,
  selectUnreadCount,
  markAllNotificationsRead,
} from '@/store/slices/uiSlice';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import { ROLE_LABELS } from '@/utils/constants';

const NavbarWrapper = styled.header`
  position: fixed;
  top: 0;
  right: 0;
  left: ${({ $sidebarWidth }) => $sidebarWidth};
  height: 64px;
  background: ${({ theme }) => theme.colors.bgNavbar};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  padding: 0 24px;
  gap: 16px;
  z-index: ${({ theme }) => theme.zIndex.sticky};
  transition: left ${({ theme }) => theme.transitions.normal};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const MobileMenuBtn = styled.button`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.textSecondary};
  padding: 6px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};

  &:hover { background: ${({ theme }) => theme.colors.bgHover}; }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: flex;
    align-items: center;
  }
`;

const PageTitle = styled.div`
  flex: 1;

  h1 {
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    color: ${({ theme }) => theme.colors.textPrimary};
    margin: 0;
  }

  p {
    font-size: ${({ theme }) => theme.typography.fontSize.xs};
    color: ${({ theme }) => theme.colors.textSecondary};
    margin: 0;
  }
`;

const SearchBar = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    display: none;
  }
`;

const SearchInput = styled.input`
  background: ${({ theme }) => theme.colors.bgSecondary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  padding: 8px 16px 8px 38px;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textPrimary};
  width: 220px;
  transition: all ${({ theme }) => theme.transitions.fast};
  outline: none;

  &::placeholder { color: ${({ theme }) => theme.colors.textTertiary}; }

  &:focus {
    border-color: ${({ theme }) => theme.colors.brandPrimary};
    background: ${({ theme }) => theme.colors.bgCard};
    width: 280px;
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.brandPrimary}22;
  }
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: 12px;
  color: ${({ theme }) => theme.colors.textTertiary};
  width: 15px;
  height: 15px;
`;

const NavActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const IconBtn = styled.button`
  position: relative;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.bgSecondary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  color: ${({ theme }) => theme.colors.textSecondary};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.bgHover};
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  svg { width: 16px; height: 16px; }
`;

const Badge = styled.span`
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 16px;
  height: 16px;
  background: ${({ theme }) => theme.colors.brandPrimary};
  color: white;
  font-size: 9px;
  font-weight: 700;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
`;

const NotificationPanel = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 320px;
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.xl};
  z-index: ${({ theme }) => theme.zIndex.dropdown};
  overflow: hidden;
`;

const NotificationHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  h4 {
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    color: ${({ theme }) => theme.colors.textPrimary};
    margin: 0;
  }

  button {
    background: none;
    border: none;
    cursor: pointer;
    font-size: ${({ theme }) => theme.typography.fontSize.xs};
    color: ${({ theme }) => theme.colors.brandPrimary};
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  }
`;

const NotificationItem = styled.div`
  display: flex;
  gap: 12px;
  padding: 12px 16px;
  transition: background ${({ theme }) => theme.transitions.fast};
  background: ${({ $unread, theme }) => ($unread ? `${theme.colors.brandPrimary}08` : 'transparent')};
  cursor: pointer;

  &:hover { background: ${({ theme }) => theme.colors.bgHover}; }

  &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  }
`;

const NotifDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ $type, theme }) => {
    const map = { info: theme.colors.info, warning: theme.colors.warning, success: theme.colors.success, error: theme.colors.error };
    return map[$type] || theme.colors.info;
  }};
  margin-top: 4px;
  flex-shrink: 0;
`;

const NotifContent = styled.div``;
const NotifTitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0 0 2px;
`;
const NotifMessage = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0 0 2px;
`;
const NotifTime = styled.p`
  font-size: 10px;
  color: ${({ theme }) => theme.colors.textTertiary};
  margin: 0;
`;

const UserArea = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 10px;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  cursor: pointer;
  transition: background ${({ theme }) => theme.transitions.fast};
  border: 1px solid ${({ theme }) => theme.colors.border};

  &:hover { background: ${({ theme }) => theme.colors.bgHover}; }
`;

const UserAvatar = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 2px solid ${({ theme }) => theme.colors.brandPrimary}44;
`;

const UserMeta = styled.div`
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) { display: none; }
`;

const UserName = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;
`;

const UserRole = styled.p`
  font-size: 10px;
  color: ${({ theme }) => theme.colors.textTertiary};
  margin: 0;
  text-transform: capitalize;
`;

const RelativeWrapper = styled.div`
  position: relative;
`;

export default function Navbar({ title, subtitle, sidebarCollapsed }) {
  const dispatch = useDispatch();
  const { isDark, toggle } = useTheme();
  const { user } = useAuth();
  const notifications = useSelector(selectNotifications);
  const unreadCount = useSelector(selectUnreadCount);
  const [showNotifs, setShowNotifs] = useState(false);

  const sidebarWidth = sidebarCollapsed ? '72px' : '240px';

  return (
    <NavbarWrapper $sidebarWidth={sidebarWidth}>
      <MobileMenuBtn onClick={() => dispatch(toggleSidebar())}>
        <Menu size={20} />
      </MobileMenuBtn>

      <PageTitle>
        <h1>{title || 'Dashboard'}</h1>
        {subtitle && <p>{subtitle}</p>}
      </PageTitle>

      <SearchBar>
        <SearchIcon />
        <SearchInput placeholder="Search anything..." />
      </SearchBar>

      <NavActions>
        {/* Theme Toggle */}
        <IconBtn onClick={toggle} title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
          {isDark ? <Sun /> : <Moon />}
        </IconBtn>

        {/* Notifications */}
        <RelativeWrapper>
          <IconBtn onClick={() => setShowNotifs((v) => !v)} title="Notifications">
            <Bell />
            {unreadCount > 0 && <Badge>{unreadCount}</Badge>}
          </IconBtn>

          {showNotifs && (
            <NotificationPanel>
              <NotificationHeader>
                <h4>Notifications {unreadCount > 0 && `(${unreadCount})`}</h4>
                <button onClick={() => { dispatch(markAllNotificationsRead()); }}>
                  Mark all read
                </button>
              </NotificationHeader>
              {notifications.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
                  No notifications
                </div>
              ) : (
                notifications.map((n) => (
                  <NotificationItem key={n.id} $unread={!n.read}>
                    <NotifDot $type={n.type} />
                    <NotifContent>
                      <NotifTitle>{n.title}</NotifTitle>
                      <NotifMessage>{n.message}</NotifMessage>
                      <NotifTime>{n.time}</NotifTime>
                    </NotifContent>
                  </NotificationItem>
                ))
              )}
            </NotificationPanel>
          )}
        </RelativeWrapper>

        {/* User */}
        <UserArea>
          <UserAvatar
            src={user?.avatar || `https://ui-avatars.com/api/?name=User&background=ff3511&color=fff`}
            alt={user?.name}
          />
          <UserMeta>
            <UserName>{user?.name || 'User'}</UserName>
            <UserRole>{ROLE_LABELS[user?.role] || 'Member'}</UserRole>
          </UserMeta>
        </UserArea>
      </NavActions>
    </NavbarWrapper>
  );
}
