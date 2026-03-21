import React from 'react';
import styled, { css, keyframes } from 'styled-components';

const spin = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;

const variantStyles = {
  primary: css`
    background: linear-gradient(135deg, ${({ theme }) => theme.colors.brandPrimary}, #1aa8d4);
    color: white;
    border: none;
    box-shadow: ${({ theme }) => theme.shadows.md};
    &:hover:not(:disabled) {
      box-shadow: ${({ theme }) => theme.shadows.glow};
      transform: translateY(-1px);
    }
    &:active:not(:disabled) {
      transform: translateY(0);
    }
  `,
  secondary: css`
    background: ${({ theme }) => theme.colors.bgSecondary};
    color: ${({ theme }) => theme.colors.textPrimary};
    border: 1px solid ${({ theme }) => theme.colors.border};
    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.bgHover};
      border-color: ${({ theme }) => theme.colors.borderHover};
    }
  `,
  outline: css`
    background: transparent;
    color: ${({ theme }) => theme.colors.brandPrimary};
    border: 1px solid ${({ theme }) => theme.colors.brandPrimary};
    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.brandPrimary}11;
    }
  `,
  ghost: css`
    background: transparent;
    color: ${({ theme }) => theme.colors.textSecondary};
    border: none;
    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.bgHover};
      color: ${({ theme }) => theme.colors.textPrimary};
    }
  `,
  danger: css`
    background: ${({ theme }) => theme.colors.error};
    color: white;
    border: none;
    &:hover:not(:disabled) {
      background: #dc2626;
      box-shadow: 0 0 20px rgba(239, 68, 68, 0.4);
    }
  `,
  success: css`
    background: ${({ theme }) => theme.colors.success};
    color: white;
    border: none;
    &:hover:not(:disabled) {
      background: #16a34a;
    }
  `,
};

const sizeStyles = {
  xs: css`
    padding: 4px 10px;
    font-size: ${({ theme }) => theme.typography.fontSize.xs};
    border-radius: ${({ theme }) => theme.borderRadius.sm};
    height: 28px;
  `,
  sm: css`
    padding: 6px 14px;
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    border-radius: ${({ theme }) => theme.borderRadius.sm};
    height: 32px;
  `,
  md: css`
    padding: 8px 18px;
    font-size: ${({ theme }) => theme.typography.fontSize.base};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    height: 38px;
  `,
  lg: css`
    padding: 12px 24px;
    font-size: ${({ theme }) => theme.typography.fontSize.md};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    height: 46px;
  `,
  xl: css`
    padding: 14px 32px;
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    height: 54px;
  `,
};

const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  white-space: nowrap;
  user-select: none;
  outline: none;
  position: relative;
  overflow: hidden;

  ${({ $variant }) => variantStyles[$variant] || variantStyles.primary}
  ${({ $size }) => sizeStyles[$size] || sizeStyles.md}

  ${({ $fullWidth }) => $fullWidth && 'width: 100%;'}
  ${({ $rounded }) => $rounded && 'border-radius: 9999px;'}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.brandPrimary};
    outline-offset: 2px;
  }

  svg {
    width: ${({ $size }) => ($size === 'xs' || $size === 'sm' ? '14px' : '16px')};
    height: ${({ $size }) => ($size === 'xs' || $size === 'sm' ? '14px' : '16px')};
    flex-shrink: 0;
  }
`;

const Spinner = styled.span`
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-top-color: white;
  border-radius: 50%;
  animation: ${spin} 0.7s linear infinite;
  display: inline-block;
`;

const Button = React.forwardRef(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      rounded = false,
      loading = false,
      icon,
      iconRight,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <StyledButton
        ref={ref}
        $variant={variant}
        $size={size}
        $fullWidth={fullWidth}
        $rounded={rounded}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <Spinner />
        ) : (
          <>
            {icon && icon}
            {children}
            {iconRight && iconRight}
          </>
        )}
      </StyledButton>
    );
  }
);

Button.displayName = 'Button';
export default Button;
