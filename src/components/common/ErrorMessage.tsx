import React from 'react';

export interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

/**
 * Accessible Error Alert Component.
 * Uses role="alert" to ensure screen readers immediately notify users of errors.
 */
export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onRetry,
}) => {
  return (
    <div
      role="alert"
      style={{
        padding: '12px 16px',
        backgroundColor: '#fef2f2',
        border: '1px solid #f87171',
        borderRadius: '4px',
        color: '#991b1b',
        fontSize: '14px',
        margin: '12px 0',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
        <span>{message}</span>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            style={{
              padding: '4px 8px',
              fontSize: '12px',
              backgroundColor: '#991b1b',
              color: '#ffffff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
};

