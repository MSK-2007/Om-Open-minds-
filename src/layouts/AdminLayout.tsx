import React from 'react';
import { Outlet } from 'react-router-dom';
import { AdminHeader, AdminSidebar } from '@/components/layout';
import { SkipToContent, LiveRegion } from '@/components/accessibility';
import { ACCESSIBILITY } from '@/config/constants';

/**
 * Admin Layout Component.
 * Dedicated structural framework for administrative back-office.
 */
export const AdminLayout: React.FC = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: '#0f172a',
        color: '#f8fafc',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <SkipToContent targetId={ACCESSIBILITY.SKIP_CONTENT_ID} label="Skip to admin content" />
      <LiveRegion />
      <AdminHeader />
      <div style={{ display: 'flex', flex: 1 }}>
        <AdminSidebar />
        <main
          id={ACCESSIBILITY.SKIP_CONTENT_ID}
          tabIndex={-1}
          style={{
            flex: 1,
            outline: 'none',
            padding: '32px',
            backgroundColor: '#0b1120',
            overflowY: 'auto',
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

