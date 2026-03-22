import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  ${({ $fullWidth }) => $fullWidth && 'width: 100%;'}
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.textSecondary};

  span.required {
    color: ${({ theme }) => theme.colors.error};
    margin-left: 3px;
  }
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: ${({ $hasLeft, $hasRight }) =>
    `9px ${$hasRight ? '40px' : '14px'} 9px ${$hasLeft ? '40px' : '14px'}`};
  background: ${({ theme }) => theme.colors.bgInput};
  border: 1.5px solid ${({ $error, theme }) => ($error ? theme.colors.error : theme.colors.border)};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-family: ${({ theme }) => theme.typography.fontFamily.sans};
  transition: all ${({ theme }) => theme.transitions.fast};
  outline: none;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textTertiary};
  }

  &:focus {
    border-color: ${({ $error, theme }) =>
      $error ? theme.colors.error : theme.colors.brandPrimary};
    box-shadow: none;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: ${({ theme }) => theme.colors.bgSecondary};
  }
`;

const StyledTextarea = styled.textarea`
  width: 100%;
  padding: 10px 14px;
  background: ${({ theme }) => theme.colors.bgInput};
  border: 1.5px solid ${({ $error, theme }) => ($error ? theme.colors.error : theme.colors.border)};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-family: ${({ theme }) => theme.typography.fontFamily.sans};
  resize: vertical;
  min-height: 100px;
  transition: all ${({ theme }) => theme.transitions.fast};
  outline: none;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textTertiary};
  }
  &:focus {
    border-color: ${({ $error, theme }) =>
      $error ? theme.colors.error : theme.colors.brandPrimary};
    box-shadow: none;
  }
`;

const IconLeft = styled.span`
  position: absolute;
  left: 12px;
  color: ${({ theme }) => theme.colors.textTertiary};
  display: flex;
  align-items: center;
  pointer-events: none;
  svg {
    width: 16px;
    height: 16px;
  }
`;

const IconRight = styled.span`
  position: absolute;
  right: 12px;
  color: ${({ theme }) => theme.colors.textTertiary};
  display: flex;
  align-items: center;
  cursor: ${({ $clickable }) => ($clickable ? 'pointer' : 'default')};
  svg {
    width: 16px;
    height: 16px;
  }

  &:hover {
    color: ${({ $clickable, theme }) => $clickable && theme.colors.textPrimary};
  }
`;

const HelperText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ $error, theme }) => ($error ? theme.colors.error : theme.colors.textTertiary)};
  margin: 0;
`;

const Input = React.forwardRef(
  (
    {
      label,
      required,
      error,
      helper,
      leftIcon,
      rightIcon,
      onRightIconClick,
      fullWidth = true,
      textarea = false,
      ...props
    },
    ref
  ) => {
    const commonProps = {
      ref,
      $error: !!error,
      $hasLeft: !!leftIcon,
      $hasRight: !!rightIcon,
      ...props,
    };

    return (
      <Wrapper $fullWidth={fullWidth}>
        {label && (
          <Label>
            {label}
            {required && <span className="required">*</span>}
          </Label>
        )}
        <InputWrapper>
          {leftIcon && <IconLeft>{leftIcon}</IconLeft>}
          {textarea ? <StyledTextarea {...commonProps} /> : <StyledInput {...commonProps} />}
          {rightIcon && (
            <IconRight $clickable={!!onRightIconClick} onClick={onRightIconClick}>
              {rightIcon}
            </IconRight>
          )}
        </InputWrapper>
        {(error || helper) && <HelperText $error={!!error}>{error || helper}</HelperText>}
      </Wrapper>
    );
  }
);

Input.displayName = 'Input';
export default Input;
