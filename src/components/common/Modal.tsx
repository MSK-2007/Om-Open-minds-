import React from 'react';
import { FocusTrap } from '@/components/accessibility/FocusTrap';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = '580px',
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="presentation"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(2px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '16px',
        overflowY: 'auto',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <FocusTrap isActive={isOpen} onEscape={onClose}>
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-dialog-title"
          style={{
            backgroundColor: '#1e293b',
            color: '#f8fafc',
            borderRadius: '8px',
            border: '1px solid #334155',
            width: '100%',
            maxWidth,
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '16px 20px',
              borderBottom: '1px solid #334155',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <h2
              id="modal-dialog-title"
              style={{
                fontSize: '18px',
                fontWeight: 600,
                margin: 0,
                color: '#f8fafc',
              }}
            >
              {title}
            </h2>
            <Button
              variant="outline"
              onClick={onClose}
              aria-label="Close modal dialog"
              style={{
                padding: '4px 8px',
                minHeight: '28px',
                fontSize: '13px',
                borderColor: '#475569',
                color: '#cbd5e1',
              }}
            >
              ✕
            </Button>
          </div>

          {/* Body */}
          <div
            style={{
              padding: '20px',
              overflowY: 'auto',
              flex: 1,
            }}
          >
            {children}
          </div>
        </div>
      </FocusTrap>
    </div>
  );
};
