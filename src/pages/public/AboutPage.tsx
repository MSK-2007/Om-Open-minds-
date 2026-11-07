import React from 'react';
import { Card } from '@/components/common/Card';

export const AboutPage: React.FC = () => {
  return (
    <article aria-labelledby="about-heading">
      <header>
        <h1 id="about-heading" style={{ fontSize: '28px', margin: '0 0 8px 0', color: '#0f172a' }}>
          About OM OPEN MINDS
        </h1>
        <p style={{ fontSize: '16px', color: '#475569', margin: '0 0 24px 0' }}>
          Institution profile, mission, and educational approach.
        </p>
      </header>

      <section aria-labelledby="about-placeholder-heading">
        <Card>
          <h2 id="about-placeholder-heading" style={{ fontSize: '18px', margin: '0 0 12px 0', color: '#1e293b' }}>
            Mission &amp; Philosophy Placeholder
          </h2>
          <p style={{ margin: 0, lineHeight: 1.6, color: '#334155' }}>
            School history, pedagogical philosophy, faculty profiles, and mission statements will be populated
            from authenticated client source materials during subsequent phases.
          </p>
        </Card>
      </section>
    </article>
  );
};

