import React from 'react';

interface StatusBadgeProps {
  status: string;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, variant }) => {
  // Determine variant automatically if not specified
  const normalized = status.toLowerCase().replace(/_/g, ' ');

  let computedVariant = variant;
  if (!computedVariant) {
    if (['published', 'contacted', 'consultation scheduled', 'replied', 'active'].includes(normalized)) {
      computedVariant = 'success';
    } else if (['pending', 'in review', 'unread', 'draft'].includes(normalized)) {
      computedVariant = 'warning';
    } else if (['archived', 'inactive', 'closed'].includes(normalized)) {
      computedVariant = 'neutral';
    } else {
      computedVariant = 'info';
    }
  }

  const colorMap = {
    success: { bg: '#064e3b', text: '#6ee7b7', border: '#047857' },
    warning: { bg: '#451a03', text: '#fcd34d', border: '#78350f' },
    danger: { bg: '#450a0a', text: '#fca5a5', border: '#7f1d1d' },
    info: { bg: '#082f49', text: '#7dd3fc', border: '#0369a1' },
    neutral: { bg: '#1e293b', text: '#94a3b8', border: '#334155' },
  };

  const style = colorMap[computedVariant];

  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 8px',
        borderRadius: '9999px',
        fontSize: '11px',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        backgroundColor: style.bg,
        color: style.text,
        border: `1px solid ${style.border}`,
        whiteSpace: 'nowrap',
      }}
    >
      {normalized}
    </span>
  );
};
