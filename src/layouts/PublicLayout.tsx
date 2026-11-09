import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header, Footer } from '@/components/layout';
import { SkipToContent, LiveRegion } from '@/components/accessibility';
import { ACCESSIBILITY } from '@/config/constants';

/**
 * Public Layout Component.
 * Wraps all public-facing school website routes.
 * Enforces semantic layout, accessibility landmarks, and playful neo-brutalist styling.
 */
export const PublicLayout: React.FC = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: '#FFFDF5',
        color: '#1E293B',
        fontFamily: 'var(--font-body)',
      }}
    >
      <SkipToContent targetId={ACCESSIBILITY.SKIP_CONTENT_ID} label="Skip to school website content" />
      <LiveRegion />
      <Header />
      <main
        id={ACCESSIBILITY.SKIP_CONTENT_ID}
        tabIndex={-1}
        style={{
          flex: 1,
          outline: 'none',
          width: '100%',
          margin: 0,
          padding: 0,
        }}
      >
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
