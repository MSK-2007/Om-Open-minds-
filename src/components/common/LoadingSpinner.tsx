import React from 'react';

export interface LoadingSpinnerProps {
  label?: string;
}

/**
 * Accessible Loading Indicator.
 * Communicates loading status to screen readers via role="status".
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  label = 'Loading content, please wait...',
}) => {
  return (
    <div
      role="status"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '12px',
        color: '#475569',
        fontSize: '14px',
      }}
    >
      <span aria-hidden="true" style={{ fontSize: '18px' }}>
        ⏳
      </span>
      <span>{label}</span>
    </div>
  );
};

