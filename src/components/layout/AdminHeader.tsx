import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/common/Button';
import { ROUTES } from '@/config/constants';

export const AdminHeader: React.FC = () => {
  const { user, profile, signOut, isLoading } = useAuth();

  const roleLabel = profile?.role === 'super_admin' ? 'Super Admin' : 'Staff Admin';

  return (
    <header
      style={{
        borderBottom: '1px solid #1e293b',
        backgroundColor: '#0f172a',
        color: '#f8fafc',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <h1 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: '#f8fafc' }}>
          OM OPEN MINDS
        </h1>
        <span
          style={{
            fontSize: '11px',
            backgroundColor: '#1e293b',
            color: '#38bdf8',
            padding: '2px 8px',
            borderRadius: '4px',
            fontWeight: 600,
            border: '1px solid #334155',
          }}
        >
          Admin Console
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <Link
          to={ROUTES.PUBLIC.HOME}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: '#94a3b8',
            fontSize: '13px',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <span>View Public Site</span>
          <span aria-hidden="true">&nearr;</span>
        </Link>

        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#f8fafc' }}>
                {profile?.full_name || user.email?.split('@')[0] || 'Administrator'}
              </span>
              <span style={{ fontSize: '11px', color: '#64748b' }}>
                {roleLabel} &bull; {user.email}
              </span>
            </div>

            <Button
              variant="outline"
              onClick={signOut}
              isLoading={isLoading}
              style={{
                borderColor: '#334155',
                color: '#cbd5e1',
                padding: '6px 12px',
                minHeight: '32px',
                fontSize: '12px',
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
