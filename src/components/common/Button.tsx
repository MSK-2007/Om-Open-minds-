import React, { ButtonHTMLAttributes } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  isLoading?: boolean;
}

/**
 * Accessible Button Component.
 * Uses native <button> tag to preserve natural keyboard focus and screen reader semantics.
 * Neutral structural styling for Phase 1.
 */
export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  isLoading = false,
  disabled,
  style,
  ...props
}) => {
  const getBackgroundColor = () => {
    if (disabled || isLoading) return '#94a3b8';
    switch (variant) {
      case 'secondary':
        return '#475569';
      case 'outline':
        return 'transparent';
      case 'danger':
        return '#b91c1c';
      case 'primary':
      default:
        return '#1e293b';
    }
  };

  const getTextColor = () => {
    if (variant === 'outline') return '#1e293b';
    return '#ffffff';
  };

  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '8px 16px',
        fontSize: '14px',
        fontWeight: 500,
        fontFamily: 'inherit',
        color: getTextColor(),
        backgroundColor: getBackgroundColor(),
        border: variant === 'outline' ? '1px solid #cbd5e1' : 'none',
        borderRadius: '4px',
        cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
        minHeight: '40px',
        minWidth: '40px',
        transition: 'none',
        ...style,
      }}
    >
      {isLoading ? (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <span aria-hidden="true">⏳</span>
          <span>Loading...</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
};

