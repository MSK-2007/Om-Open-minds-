import React from 'react';
import { SectionBadge, Squiggle } from './DecorativeStickers';

interface SectionHeadingProps {
  badgeText?: string;
  badgeIcon?: string;
  badgeVariant?: 'primary' | 'secondary' | 'tertiary' | 'quaternary';
  title: string;
  highlightText?: string;
  subtitle?: string;
  align?: 'left' | 'center';
  withSquiggle?: boolean;
  style?: React.CSSProperties;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  badgeText,
  badgeIcon,
  badgeVariant = 'tertiary',
  title,
  highlightText,
  subtitle,
  align = 'center',
  withSquiggle = false,
  style,
}) => {
  return (
    <div
      style={{
        textAlign: align,
        marginBottom: '40px',
        maxWidth: align === 'center' ? '760px' : '100%',
        margin: align === 'center' ? '0 auto 40px auto' : '0 0 40px 0',
        ...style,
      }}
    >
      {badgeText && (
        <div style={{ marginBottom: '12px' }}>
          <SectionBadge text={badgeText} icon={badgeIcon} variant={badgeVariant} />
        </div>
      )}

      <h2
        style={{
          fontSize: 'clamp(28px, 4vw, 42px)',
          fontWeight: 800,
          color: '#1E293B',
          margin: '0 0 12px 0',
          lineHeight: 1.2,
          fontFamily: 'var(--font-heading)',
        }}
      >
        {title}{' '}
        {highlightText && (
          <span
            style={{
              display: 'inline-block',
              position: 'relative',
              color: '#8B5CF6',
              whiteSpace: 'nowrap',
            }}
          >
            {highlightText}
            {withSquiggle && (
              <span
                style={{
                  position: 'absolute',
                  left: 0,
                  bottom: '-12px',
                  width: '100%',
                }}
              >
                <Squiggle color="#F472B6" width={120} height={16} />
              </span>
            )}
          </span>
        )}
      </h2>

      {subtitle && (
        <p
          style={{
            fontSize: 'clamp(15px, 2vw, 18px)',
            color: '#64748B',
            margin: '0',
            lineHeight: 1.6,
            fontWeight: 500,
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};

