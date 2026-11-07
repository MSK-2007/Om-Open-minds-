import React from 'react';
import { ACCESSIBILITY } from '@/config/constants';

interface SkipToContentProps {
  targetId?: string;
  label?: string;
}

/**
 * SkipToContent Component.
 * Critical WCAG 2.1 Level A requirement.
 * Remains visually hidden until focused via keyboard Tab key, allowing
 * keyboard and screen-reader users to bypass primary navigation.
 */
export const SkipToContent: React.FC<SkipToContentProps> = ({
  targetId = ACCESSIBILITY.SKIP_CONTENT_ID,
  label = 'Skip to main content',
}) => {
  return (
    <a
      href={`#${targetId}`}
      className="skip-to-content"
      style={{
        position: 'absolute',
        top: '-9999px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        padding: '12px 20px',
        backgroundColor: '#000000',
        color: '#ffffff',
        textDecoration: 'none',
        fontWeight: 'bold',
        borderRadius: '0 0 4px 4px',
        border: '2px solid #ffffff',
        outline: '3px solid #2563eb',
      }}
      onFocus={(e) => {
        e.currentTarget.style.top = '0px';
      }}
      onBlur={(e) => {
        e.currentTarget.style.top = '-9999px';
      }}
    >
      {label}
    </a>
  );
};

