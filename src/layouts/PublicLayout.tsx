import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header, Footer } from '@/components/layout';
import { SkipToContent, LiveRegion } from '@/components/accessibility';
import { ACCESSIBILITY } from '@/config/constants';

/**
 * Public Layout Component.
 * Wraps all public-facing school website routes.
 * Enforces semantic layout and accessibility landmarks.
 */
export const PublicLayout: React.FC = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: '#ffffff',
        color: '#0f172a',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <SkipToContent targetId={ACCESSIBILITY.SKIP_CONTENT_ID} />
      <LiveRegion />
      <Header />
      <main
        id={ACCESSIBILITY.SKIP_CONTENT_ID}
        tabIndex={-1}
        style={{
          flex: 1,
          outline: 'none',
          padding: '32px 24px',
          maxWidth: '1200px',
          width: '100%',
          margin: '0 auto',
          boxSizing: 'border-box',
        }}
      >
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

