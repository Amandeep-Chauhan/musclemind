import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import { selectSidebarCollapsed } from '@/store/slices/uiSlice';

const LayoutWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.bgSecondary};
`;

const MainContent = styled.main`
  flex: 1;
  margin-left: ${({ $collapsed }) => ($collapsed ? '72px' : '240px')};
  margin-top: 64px;
  padding: 24px;
  min-height: calc(100vh - 64px);
  transition: margin-left ${({ theme }) => theme.transitions.normal};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin-left: 0;
    padding: 16px;
  }
`;

const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  animation: fadeIn 0.3s ease;
`;

export default function MainLayout({ children, title, subtitle }) {
  const collapsed = useSelector(selectSidebarCollapsed);

  return (
    <LayoutWrapper>
      <Sidebar />
      <Navbar title={title} subtitle={subtitle} sidebarCollapsed={collapsed} />
      <MainContent $collapsed={collapsed}>
        <ContentWrapper>{children}</ContentWrapper>
      </MainContent>
    </LayoutWrapper>
  );
}
