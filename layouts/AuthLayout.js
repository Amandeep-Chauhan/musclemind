import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { Zap } from 'lucide-react';
import { darkTheme } from '@/styles/theme';

const Wrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
`;

const VideoBg = styled.video`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.55);
  z-index: 1;
`;

const FormCard = styled.div`
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 420px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 40px 36px;
  background: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  margin: 24px;
  color: #e2e8f0;
`;

const BrandHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 32px;
`;

const LogoIcon = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #1aa8d4, #3535cc);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 20px rgba(26, 168, 212, 0.4);
`;

const BrandName = styled.h1`
  font-size: 28px;
  font-weight: 800;
  background: linear-gradient(135deg, #1aa8d4, #3535cc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
`;

export default function AuthLayout({ children }) {
  return (
    <ThemeProvider theme={darkTheme}>
      <Wrapper>
        <VideoBg autoPlay muted loop playsInline>
          <source src="/gym-bg.mp4" type="video/mp4" />
        </VideoBg>
        <Overlay />

        <FormCard>
          <BrandHeader>
            <LogoIcon>
              <Zap size={20} color="white" fill="white" />
            </LogoIcon>
            <BrandName>MuscleMind</BrandName>
          </BrandHeader>

          {children}
        </FormCard>
      </Wrapper>
    </ThemeProvider>
  );
}
