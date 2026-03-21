import React from 'react';
import styled from 'styled-components';

const StyledCard = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  padding: ${({ $padding, theme }) => {
    const map = { none: '0', sm: theme.spacing.sm, md: theme.spacing.md, lg: theme.spacing.lg };
    return map[$padding] || theme.spacing.lg;
  }};
  transition: box-shadow ${({ theme }) => theme.transitions.fast},
              transform ${({ theme }) => theme.transitions.fast};
  position: relative;
  overflow: ${({ $overflow }) => $overflow || 'hidden'};

  ${({ $hoverable, theme }) =>
    $hoverable &&
    `
    cursor: pointer;
    &:hover {
      box-shadow: ${theme.shadows.lg};
      transform: translateY(-2px);
    }
  `}

  ${({ $glow, theme }) =>
    $glow &&
    `
    border-color: ${theme.colors.brandPrimary}44;
    box-shadow: ${theme.shadows.glow};
  `}
`;

const CardHeader = styled.div`
  display: flex;
  align-items: ${({ $align }) => $align || 'center'};
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  gap: 12px;
`;

const CardTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;
`;

const CardSubtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 4px 0 0;
`;

const CardBody = styled.div``;

const CardFooter = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  margin-top: ${({ theme }) => theme.spacing.md};
  padding-top: ${({ theme }) => theme.spacing.md};
  display: flex;
  align-items: center;
  justify-content: ${({ $justify }) => $justify || 'flex-end'};
  gap: 8px;
`;

// Main Card Component
const Card = ({
  children,
  padding = 'lg',
  hoverable = false,
  glow = false,
  overflow,
  className,
  onClick,
}) => (
  <StyledCard
    $padding={padding}
    $hoverable={hoverable}
    $glow={glow}
    $overflow={overflow}
    className={className}
    onClick={onClick}
  >
    {children}
  </StyledCard>
);

// Named exports for Card sub-components
Card.Header = ({ children, align, actions }) => (
  <CardHeader $align={align}>
    <div>{children}</div>
    {actions && <div style={{ display: 'flex', gap: 8 }}>{actions}</div>}
  </CardHeader>
);

Card.Title = ({ children }) => <CardTitle>{children}</CardTitle>;
Card.Subtitle = ({ children }) => <CardSubtitle>{children}</CardSubtitle>;
Card.Body = ({ children }) => <CardBody>{children}</CardBody>;
Card.Footer = ({ children, justify }) => <CardFooter $justify={justify}>{children}</CardFooter>;

export default Card;
