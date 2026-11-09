import React from 'react';

/**
 * Playful geometric decorative stickers, squiggles, and badges
 * conforming to the authoritative design system.
 */

export const Squiggle: React.FC<{ color?: string; width?: number; height?: number; style?: React.CSSProperties }> = ({
  color = '#8B5CF6',
  width = 80,
  height = 20,
  style,
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 100 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    style={{ display: 'inline-block', ...style }}
  >
    <path
      d="M4 12C12 4 20 20 28 12C36 4 44 20 52 12C60 4 68 20 76 12C84 4 92 20 96 12"
      stroke={color}
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const Starburst: React.FC<{ color?: string; size?: number; style?: React.CSSProperties }> = ({
  color = '#FBBF24',
  size = 32,
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    style={{ display: 'inline-block', ...style }}
  >
    <path
      d="M20 0L24.5 15.5L40 20L24.5 24.5L20 40L15.5 24.5L0 20L15.5 15.5L20 0Z"
      fill={color}
      stroke="#1E293B"
      strokeWidth="2"
      strokeLinejoin="round"
    />
  </svg>
);

export const FloatingCircle: React.FC<{
  color?: string;
  size?: number;
  pattern?: 'dots' | 'solid';
  style?: React.CSSProperties;
}> = ({ color = '#34D399', size = 48, pattern = 'solid', style }) => (
  <div
    aria-hidden="true"
    style={{
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: '50%',
      backgroundColor: pattern === 'solid' ? color : 'transparent',
      backgroundImage:
        pattern === 'dots'
          ? `radial-gradient(${color} 2px, transparent 2px)`
          : undefined,
      backgroundSize: pattern === 'dots' ? '8px 8px' : undefined,
      border: '2px solid #1E293B',
      boxShadow: '3px 3px 0px #1E293B',
      display: 'inline-block',
      ...style,
    }}
  />
);

export const SectionBadge: React.FC<{
  text: string;
  icon?: string;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'quaternary';
  style?: React.CSSProperties;
}> = ({ text, icon = '✦', variant = 'tertiary', style }) => {
  const getColors = () => {
    switch (variant) {
      case 'primary':
        return { bg: '#8B5CF6', text: '#FFFFFF' };
      case 'secondary':
        return { bg: '#F472B6', text: '#1E293B' };
      case 'quaternary':
        return { bg: '#34D399', text: '#1E293B' };
      case 'tertiary':
      default:
        return { bg: '#FBBF24', text: '#1E293B' };
    }
  };

  const { bg, text: textColor } = getColors();

  return (
    <span
      className="neo-badge"
      style={{
        backgroundColor: bg,
        color: textColor,
        ...style,
      }}
    >
      <span aria-hidden="true">{icon}</span>
      <span>{text}</span>
    </span>
  );
};

