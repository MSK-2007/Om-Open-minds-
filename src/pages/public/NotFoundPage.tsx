import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/config/constants';
import { Starburst } from '@/components/public/DecorativeStickers';

export const NotFoundPage: React.FC = () => {
  return (
    <div
      style={{
        padding: '80px 24px',
        textAlign: 'center',
        maxWidth: '600px',
        margin: '0 auto',
      }}
    >
      <div style={{ marginBottom: '16px' }}>
        <Starburst color="#F472B6" size={54} />
      </div>

      <span className="neo-badge neo-badge-secondary" style={{ marginBottom: '16px' }}>
        404 Error
      </span>

      <h1
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(36px, 5vw, 52px)',
          fontWeight: 800,
          color: '#1E293B',
          margin: '0 0 16px 0',
        }}
      >
        Page Not Found
      </h1>

      <p style={{ fontSize: '16px', color: '#64748B', lineHeight: 1.6, margin: '0 0 32px 0' }}>
        We couldn&rsquo;t find the school page you were looking for. Let&rsquo;s guide you back safely to our homepage.
      </p>

      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link to={ROUTES.PUBLIC.HOME} className="neo-btn-primary">
          Return to Homepage &rarr;
        </Link>
        <Link to={ROUTES.PUBLIC.CONTACT} className="neo-btn-secondary">
          Contact Campus Help
        </Link>
      </div>
    </div>
  );
};
