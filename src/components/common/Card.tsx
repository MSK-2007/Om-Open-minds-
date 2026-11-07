import React, { HTMLAttributes } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
}

/**
 * Structural Card Component.
 * Minimal neutral placeholder for section content and panels.
 */
export const Card: React.FC<CardProps> = ({
  children,
  as: Component = 'div',
  style,
  ...props
}) => {
  return (
    <Component
      style={{
        border: '1px solid #e2e8f0',
        borderRadius: '6px',
        backgroundColor: '#ffffff',
        padding: '20px',
        margin: '12px 0',
        ...style,
      }}
      {...props}
    >
      {children}
    </Component>
  );
};

