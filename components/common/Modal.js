import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import styled, { keyframes } from 'styled-components';
import { X } from 'lucide-react';
import Button from './Button';

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(24px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: ${({ theme }) => theme.colors.bgOverlay};
  z-index: ${({ theme }) => theme.zIndex.modal};
  display: flex;
  align-items: ${({ $position }) => $position === 'top' ? 'flex-start' : 'center'};
  justify-content: center;
  padding: ${({ $position }) => $position === 'top' ? '80px 16px 16px' : '16px'};
  animation: ${fadeIn} 0.2s ease;
  backdrop-filter: blur(4px);
`;

const sizes = {
  sm: '400px',
  md: '560px',
  lg: '720px',
  xl: '900px',
  full: 'calc(100vw - 32px)',
};

const ModalBox = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  width: 100%;
  max-width: ${({ $size }) => sizes[$size] || sizes.md};
  max-height: calc(100vh - 80px);
  display: flex;
  flex-direction: column;
  box-shadow: ${({ theme }) => theme.shadows['2xl']};
  animation: ${slideUp} 0.25s ease;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  flex-shrink: 0;
`;

const ModalTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;
`;

const ModalSubtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 4px 0 0;
`;

const CloseBtn = styled.button`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.bgHover};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  color: ${({ theme }) => theme.colors.textSecondary};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.error};
    color: white;
  }

  svg { width: 16px; height: 16px; }
`;

const ModalBody = styled.div`
  padding: 24px;
  overflow-y: auto;
  flex: 1;
`;

const ModalFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  padding: 16px 24px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  flex-shrink: 0;
`;

const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  size = 'md',
  position = 'center',
  footer,
  hideHeader = false,
  closeOnOverlay = true,
}) => {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  // Lock scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const content = (
    <Overlay $position={position} onClick={closeOnOverlay ? onClose : undefined}>
      <ModalBox $size={size} onClick={(e) => e.stopPropagation()}>
        {!hideHeader && (
          <ModalHeader>
            <div>
              <ModalTitle>{title}</ModalTitle>
              {subtitle && <ModalSubtitle>{subtitle}</ModalSubtitle>}
            </div>
            <CloseBtn onClick={onClose}>
              <X />
            </CloseBtn>
          </ModalHeader>
        )}

        <ModalBody>{children}</ModalBody>

        {footer && <ModalFooter>{footer}</ModalFooter>}
      </ModalBox>
    </Overlay>
  );

  if (typeof document === 'undefined') return null;
  return ReactDOM.createPortal(content, document.body);
};

export default Modal;
