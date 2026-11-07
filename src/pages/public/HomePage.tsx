import React from 'react';
import { Card } from '@/components/common/Card';

/**
 * Public Home Page Placeholder.
 * Logical heading hierarchy: h1 -> h2.
 * Neutral structural placeholder for Phase 1.
 */
export const HomePage: React.FC = () => {
  return (
    <article aria-labelledby="home-heading">
      <header>
        <h1 id="home-heading" style={{ fontSize: '28px', margin: '0 0 8px 0', color: '#0f172a' }}>
          OM OPEN MINDS
        </h1>
        <p style={{ fontSize: '16px', color: '#475569', margin: '0 0 24px 0' }}>
          Specialized education and development for children with diverse learning needs and disabilities.
        </p>
      </header>

      <section aria-labelledby="overview-heading">
        <Card>
          <h2 id="overview-heading" style={{ fontSize: '18px', margin: '0 0 12px 0', color: '#1e293b' }}>
            Phase 1 Technical Architecture Notice
          </h2>
          <p style={{ margin: '0 0 12px 0', lineHeight: 1.6, color: '#334155' }}>
            This page represents the technical foundation and routing skeleton for the OM OPEN MINDS school website.
            Final visual design, branding, colour palette, and multimedia assets will be integrated in Phase 2
            following client review of reference materials and official school content.
          </p>
          <ul style={{ margin: 0, paddingLeft: '20px', color: '#475569', lineHeight: 1.6 }}>
            <li>Accessible landmark navigation</li>
            <li>React Router integration with verified endpoints</li>
            <li>Supabase client architecture with type definitions</li>
            <li>Keyboard and screen-reader accessibility baseline</li>
          </ul>
        </Card>
      </section>
    </article>
  );
};

