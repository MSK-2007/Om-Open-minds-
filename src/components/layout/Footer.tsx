import React from 'react';
import { APP_CONFIG } from '@/config/constants';

/**
 * Public Footer Component.
 * Semantic <footer> landmark providing structural layout.
 */
export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        borderTop: '1px solid #e2e8f0',
        backgroundColor: '#f8fafc',
        padding: '32px 24px',
        marginTop: 'auto',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
          fontSize: '13px',
          color: '#64748b',
        }}
      >
        <div>
          <p style={{ margin: 0, fontWeight: 600, color: '#334155' }}>
            {APP_CONFIG.name}
          </p>
          <p style={{ margin: '4px 0 0 0' }}>
            Specialized educational institution dedicated to children with disabilities.
          </p>
        </div>
        <div>
          <p style={{ margin: 0 }}>
            &copy; {currentYear} {APP_CONFIG.name}. All rights reserved.
          </p>
          <p style={{ margin: '4px 0 0 0', fontSize: '12px' }}>
            Accessibility First • Phase 1 Technical Foundation
          </p>
        </div>
      </div>
    </footer>
  );
};

