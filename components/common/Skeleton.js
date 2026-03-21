import React from 'react';
import styled, { keyframes } from 'styled-components';

const shimmer = keyframes`
  0%   { background-position: -400px 0; }
  100% { background-position: 400px 0; }
`;

const SkeletonBase = styled.div`
  background: ${({ theme }) =>
    theme.mode === 'dark'
      ? 'linear-gradient(90deg, #1e293b 25%, #334155 50%, #1e293b 75%)'
      : 'linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)'};
  background-size: 800px 100%;
  animation: ${shimmer} 1.5s infinite linear;
  border-radius: ${({ $radius, theme }) => $radius || theme.borderRadius.sm};
  width: ${({ $width }) => $width || '100%'};
  height: ${({ $height }) => $height || '16px'};
`;

export const Skeleton = ({ width, height, radius, className }) => (
  <SkeletonBase $width={width} $height={height} $radius={radius} className={className} />
);

// Pre-built skeleton patterns
export const SkeletonText = ({ lines = 3, lastLineWidth = '60%' }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        height="14px"
        width={i === lines - 1 ? lastLineWidth : '100%'}
      />
    ))}
  </div>
);

export const SkeletonCard = () => (
  <div style={{ padding: 20, border: '1px solid #e2e8f0', borderRadius: 12 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
      <Skeleton width="40px" height="40px" radius="50%" />
      <div style={{ flex: 1 }}>
        <Skeleton height="14px" width="60%" />
        <div style={{ marginTop: 6 }}>
          <Skeleton height="12px" width="40%" />
        </div>
      </div>
    </div>
    <SkeletonText lines={2} />
  </div>
);

export const SkeletonTable = ({ rows = 5, cols = 5 }) => (
  <div>
    {/* Header */}
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 16, padding: '12px 16px', marginBottom: 4 }}>
      {Array.from({ length: cols }).map((_, i) => (
        <Skeleton key={i} height="12px" width="80%" />
      ))}
    </div>
    {/* Rows */}
    {Array.from({ length: rows }).map((_, r) => (
      <div
        key={r}
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gap: 16,
          padding: '14px 16px',
          borderTop: '1px solid rgba(0,0,0,0.06)',
          alignItems: 'center',
        }}
      >
        {Array.from({ length: cols }).map((_, c) => (
          <Skeleton key={c} height="14px" width={c === 0 ? '80%' : '60%'} />
        ))}
      </div>
    ))}
  </div>
);

export const SkeletonStat = () => (
  <div style={{ padding: 20, border: '1px solid #e2e8f0', borderRadius: 16 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
      <Skeleton height="12px" width="40%" />
      <Skeleton width="36px" height="36px" radius="8px" />
    </div>
    <Skeleton height="32px" width="50%" />
    <div style={{ marginTop: 8 }}>
      <Skeleton height="12px" width="70%" />
    </div>
  </div>
);

export default Skeleton;
