import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Zap } from 'lucide-react';

const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(-20px) rotate(5deg); }
  66% { transform: translateY(10px) rotate(-3deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.1); }
`;

const Wrapper = styled.div`
  min-height: 100vh;
  display: flex;
  background: ${({ theme }) => theme.colors.bgPrimary};
  position: relative;
  overflow: hidden;
`;

const LeftPanel = styled.div`
  flex: 1;
  background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px;
  position: relative;
  overflow: hidden;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

const BlobBg = styled.div`
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  animation: ${pulse} 4s ease-in-out infinite;
`;

const BlobRed = styled(BlobBg)`
  width: 400px;
  height: 400px;
  background: #ff351122;
  top: -100px;
  left: -100px;
  animation-delay: 0s;
`;

const BlobBlue = styled(BlobBg)`
  width: 300px;
  height: 300px;
  background: #0078d422;
  bottom: -50px;
  right: -50px;
  animation-delay: 2s;
`;

const FloatingEmoji = styled.div`
  font-size: 48px;
  animation: ${float} 6s ease-in-out infinite;
  animation-delay: ${({ $delay }) => $delay || '0s'};
  position: absolute;
  opacity: 0.3;
`;

const BrandContent = styled.div`
  position: relative;
  z-index: 1;
  text-align: center;
  color: white;
`;

const BrandLogo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 32px;
`;

const LogoIcon = styled.div`
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #ff3511, #ff6b35);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 30px rgba(255, 53, 17, 0.5);
`;

const BrandName = styled.h1`
  font-size: 42px;
  font-weight: 800;
  background: linear-gradient(135deg, #ff3511, #ff6b35);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
`;

const BrandTagline = styled.p`
  font-size: 18px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0 0 48px;
  max-width: 320px;
`;

const FeatureList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 360px;
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 20px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  backdrop-filter: blur(10px);
`;

const FeatureEmoji = styled.span`
  font-size: 24px;
  flex-shrink: 0;
`;

const FeatureText = styled.div`
  h4 {
    font-size: 14px;
    font-weight: 600;
    color: white;
    margin: 0 0 2px;
  }
  p {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.5);
    margin: 0;
  }
`;

const RightPanel = styled.div`
  width: 480px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px;
  background: ${({ theme }) => theme.colors.bgCard};
  position: relative;
  z-index: 1;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 100%;
  }
`;

const MobileBrand = styled.div`
  display: none;
  align-items: center;
  gap: 10px;
  margin-bottom: 32px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: flex;
  }
`;

const FormContainer = styled.div`
  width: 100%;
  max-width: 360px;
`;

const features = [
  { emoji: '🏋️', title: 'Member Management', desc: 'Track all your gym members effortlessly' },
  { emoji: '📊', title: 'Real-time Analytics', desc: 'Revenue, attendance & growth insights' },
  { emoji: '💪', title: 'Trainer Scheduling', desc: 'Manage trainers and workout sessions' },
  { emoji: '💳', title: 'Plan & Billing', desc: 'Flexible subscription management' },
];

export default function AuthLayout({ children }) {
  return (
    <Wrapper>
      {/* Left branding panel */}
      <LeftPanel>
        <BlobRed />
        <BlobBlue />

        <FloatingEmoji style={{ top: '15%', left: '10%' }} $delay="0s">🏋️</FloatingEmoji>
        <FloatingEmoji style={{ top: '70%', left: '8%' }} $delay="2s">💪</FloatingEmoji>
        <FloatingEmoji style={{ top: '20%', right: '12%' }} $delay="1s">⚡</FloatingEmoji>
        <FloatingEmoji style={{ bottom: '15%', right: '8%' }} $delay="3s">🔥</FloatingEmoji>

        <BrandContent>
          <BrandLogo>
            <LogoIcon>
              <Zap size={28} color="white" fill="white" />
            </LogoIcon>
            <BrandName>MuscleMind</BrandName>
          </BrandLogo>

          <BrandTagline>The all-in-one gym management platform built for peak performance.</BrandTagline>

          <FeatureList>
            {features.map((f) => (
              <FeatureItem key={f.title}>
                <FeatureEmoji>{f.emoji}</FeatureEmoji>
                <FeatureText>
                  <h4>{f.title}</h4>
                  <p>{f.desc}</p>
                </FeatureText>
              </FeatureItem>
            ))}
          </FeatureList>
        </BrandContent>
      </LeftPanel>

      {/* Right form panel */}
      <RightPanel>
        <MobileBrand>
          <LogoIcon style={{ width: 40, height: 40 }}>
            <Zap size={20} color="white" fill="white" />
          </LogoIcon>
          <BrandName style={{ fontSize: 28 }}>MuscleMind</BrandName>
        </MobileBrand>

        <FormContainer>{children}</FormContainer>
      </RightPanel>
    </Wrapper>
  );
}
