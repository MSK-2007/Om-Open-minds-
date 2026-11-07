import React, { InputHTMLAttributes, useId } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
}

/**
 * Accessible Input Component.
 * Establishes explicit label association and connects validation errors via ARIA.
 */
export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  id: customId,
  required,
  disabled,
  style,
  ...props
}) => {
  const generatedId = useId();
  const inputId = customId || generatedId;
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '16px' }}>
      <label
        htmlFor={inputId}
        style={{
          fontSize: '14px',
          fontWeight: 600,
          color: '#1e293b',
        }}
      >
        {label}
        {required && <span aria-hidden="true" style={{ color: '#b91c1c', marginLeft: '4px' }}>*</span>}
      </label>

      <input
        id={inputId}
        required={required}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : helperText ? helperId : undefined}
        style={{
          padding: '8px 12px',
          fontSize: '14px',
          borderRadius: '4px',
          border: error ? '2px solid #b91c1c' : '1px solid #cbd5e1',
          backgroundColor: disabled ? '#f1f5f9' : '#ffffff',
          color: '#0f172a',
          minHeight: '40px',
          outline: 'none',
          ...style,
        }}
        {...props}
      />

      {helperText && !error && (
        <span
          id={helperId}
          style={{ fontSize: '12px', color: '#64748b' }}
        >
          {helperText}
        </span>
      )}

      {error && (
        <span
          id={errorId}
          role="alert"
          style={{ fontSize: '12px', color: '#b91c1c', fontWeight: 500 }}
        >
          {error}
        </span>
      )}
    </div>
  );
};

