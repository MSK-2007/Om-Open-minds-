import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/common/Button';
import { ROUTES } from '@/config/constants';

/**
 * Admin Header Component.
 * Semantic header landmark for the administrative back-office.
 */
export const AdminHeader: React.FC = () => {
  const { user, signOut, isLoading } = useAuth();

  return (
    <header
      style={{
        borderBottom: '1px solid #334155',
        backgroundColor: '#0f172a',
        color: '#f8fafc',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <h1 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: '#f8fafc' }}>
          OM OPEN MINDS — Admin
        </h1>
        <span
          style={{
            fontSize: '11px',
            backgroundColor: '#334155',
            color: '#94a3b8',
            padding: '2px 8px',
            borderRadius: '4px',
            fontWeight: 500,
          }}
        >
          Phase 1 Foundation
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Link
          to={ROUTES.PUBLIC.HOME}
          style={{
            color: '#94a3b8',
            fontSize: '13px',
            textDecoration: 'none',
          }}
        >
          &larr; View Public Site
        </Link>

        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '13px', color: '#cbd5e1' }}>
              {user.email}
            </span>
            <Button
              variant="outline"
              onClick={signOut}
              isLoading={isLoading}
              style={{
                borderColor: '#475569',
                color: '#f8fafc',
                padding: '6px 12px',
                minHeight: '32px',
              }}
            >
              Sign Out
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

