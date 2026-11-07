import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/common/Card';
import { ROUTES } from '@/config/constants';

export const NotFoundPage: React.FC = () => {
  return (
    <article aria-labelledby="not-found-heading" style={{ textAlign: 'center', padding: '40px 0' }}>
      <header>
        <h1 id="not-found-heading" style={{ fontSize: '32px', margin: '0 0 12px 0', color: '#0f172a' }}>
          404 — Page Not Found
        </h1>
        <p style={{ fontSize: '16px', color: '#475569', margin: '0 0 24px 0' }}>
          The requested page does not exist or may have been moved.
        </p>
      </header>

      <section>
        <Card style={{ display: 'inline-block', maxWidth: '400px', textAlign: 'left' }}>
          <p style={{ margin: '0 0 16px 0', color: '#334155' }}>
            Please return to the main navigation or visit the home page.
          </p>
          <Link
            to={ROUTES.PUBLIC.HOME}
            style={{
              display: 'inline-block',
              padding: '8px 16px',
              backgroundColor: '#1e293b',
              color: '#ffffff',
              borderRadius: '4px',
              textDecoration: 'none',
              fontWeight: 500,
            }}
          >
            Return to Home Page
          </Link>
        </Card>
      </section>
    </article>
  );
};

