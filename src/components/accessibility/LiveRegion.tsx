import React from 'react';

interface LiveRegionProps {
  id?: string;
  politeness?: 'polite' | 'assertive';
}

/**
 * LiveRegion Component.
 * An ARIA live region that screen readers listen to for dynamic page announcements,
 * route transitions, and asynchronous completion states.
 */
export const LiveRegion: React.FC<LiveRegionProps> = ({
  id = 'a11y-live-announcer',
  politeness = 'polite',
}) => {
  return (
    <div
      id={id}
      role="status"
      aria-live={politeness}
      aria-atomic="true"
      style={{
        position: 'absolute',
        width: '1px',
        height: '1px',
        margin: '-1px',
        padding: '0',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        border: '0',
      }}
    />
  );
};

