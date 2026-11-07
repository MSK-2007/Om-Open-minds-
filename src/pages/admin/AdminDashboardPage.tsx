import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/common/Card';

export const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <article aria-labelledby="admin-dashboard-heading">
      <header style={{ marginBottom: '24px' }}>
        <h1
          id="admin-dashboard-heading"
          style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 8px 0', color: '#f8fafc' }}
        >
          Administrative Dashboard
        </h1>
        <p style={{ fontSize: '14px', color: '#94a3b8', margin: 0 }}>
          Authenticated as: <strong>{user?.email || 'Authenticated User'}</strong>
        </p>
      </header>

      <section aria-labelledby="foundation-status-heading">
        <Card style={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}>
          <h2
            id="foundation-status-heading"
            style={{ fontSize: '18px', margin: '0 0 12px 0', color: '#38bdf8' }}
          >
            Phase 1 Administrative Architecture Status
          </h2>
          <p style={{ margin: '0 0 12px 0', lineHeight: 1.6, color: '#cbd5e1' }}>
            The administrative application structure, protected routing architecture, and Supabase Auth
            integration have been established.
          </p>
          <div
            style={{
              padding: '12px 16px',
              backgroundColor: '#0f172a',
              borderRadius: '4px',
              borderLeft: '4px solid #38bdf8',
              fontSize: '13px',
              color: '#94a3b8',
              lineHeight: 1.5,
            }}
          >
            <strong>Security Notice:</strong> Production access control requires both client-side route guards
            and database-level Row Level Security (RLS) policies configured in Supabase. Fictitious credentials
            are strictly prohibited.
          </div>
        </Card>
      </section>

      <section aria-labelledby="modules-heading" style={{ marginTop: '24px' }}>
        <h2
          id="modules-heading"
          style={{ fontSize: '18px', margin: '0 0 16px 0', color: '#f8fafc' }}
        >
          Future Administrative Modules (Phase 2 &amp; 3)
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '16px',
          }}
        >
          <Card style={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}>
            <h3 style={{ fontSize: '15px', margin: '0 0 8px 0', color: '#f1f5f9' }}>
              Admissions Inquiries
            </h3>
            <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8', lineHeight: 1.5 }}>
              Review parent inquiries, manage admission statuses, and export consultation logs.
            </p>
          </Card>

          <Card style={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}>
            <h3 style={{ fontSize: '15px', margin: '0 0 8px 0', color: '#f1f5f9' }}>
              Contact Messages
            </h3>
            <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8', lineHeight: 1.5 }}>
              Manage general campus inquiries and track communication history.
            </p>
          </Card>

          <Card style={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}>
            <h3 style={{ fontSize: '15px', margin: '0 0 8px 0', color: '#f1f5f9' }}>
              Curriculum &amp; Programmes
            </h3>
            <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8', lineHeight: 1.5 }}>
              Create and publish educational programme descriptions and updates.
            </p>
          </Card>

          <Card style={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}>
            <h3 style={{ fontSize: '15px', margin: '0 0 8px 0', color: '#f1f5f9' }}>
              Accessible Media Manager
            </h3>
            <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8', lineHeight: 1.5 }}>
              Upload gallery images with enforced descriptive alt-text validation.
            </p>
          </Card>
        </div>
      </section>
    </article>
  );
};

