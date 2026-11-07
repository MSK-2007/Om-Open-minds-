import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header, Footer } from '@/components/layout';
import { SkipToContent, LiveRegion } from '@/components/accessibility';
import { ACCESSIBILITY, ROUTES } from '@/config/constants';

/**
 * Public Layout Component.
 * Wraps all public-facing school website routes.
 * Enforces semantic layout and accessibility landmarks.
 * For the Home landing page, allows the immersive ThreeUI Sketchbook presentation.
 */
export const PublicLayout: React.FC = () => {
  const location = useLocation();
  const isHome = location.pathname === ROUTES.PUBLIC.HOME;

  if (isHome) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          backgroundColor: '#f5f0e6',
          color: '#302b26',
        }}
      >
        <SkipToContent targetId={ACCESSIBILITY.SKIP_CONTENT_ID} />
        <LiveRegion />
        <main
          id={ACCESSIBILITY.SKIP_CONTENT_ID}
          tabIndex={-1}
          style={{
            flex: 1,
            outline: 'none',
            width: '100%',
            margin: 0,
            padding: 0,
            boxSizing: 'border-box',
          }}
        >
          <Outlet />
        </main>
      </div>
    );
  }

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


