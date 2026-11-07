import React from 'react';
import { Card } from '@/components/common/Card';

export const OurApproachPage: React.FC = () => {
  return (
    <article aria-labelledby="approach-heading">
      <header>
        <h1 id="approach-heading" style={{ fontSize: '28px', margin: '0 0 8px 0', color: '#0f172a' }}>
          Our Pedagogical Approach
        </h1>
        <p style={{ fontSize: '16px', color: '#475569', margin: '0 0 24px 0' }}>
          Evidence-based, child-centered methodology grounded in dignity, individualized pacing, and multidisciplinary care.
        </p>
      </header>

      <section aria-labelledby="iep-framework-heading">
        <Card>
          <h2 id="iep-framework-heading" style={{ fontSize: '18px', margin: '0 0 12px 0', color: '#1e293b' }}>
            Individualized Education Plan (IEP) Framework Placeholder
          </h2>
          <p style={{ margin: '0 0 12px 0', lineHeight: 1.6, color: '#334155' }}>
            Every child at OM OPEN MINDS learns according to a tailored IEP. Goals are co-created with parents,
            regularly evaluated by special educators and allied developmental therapists, and adjusted to celebrate
            individual milestone achievements.
          </p>
          <ul style={{ margin: 0, paddingLeft: '20px', color: '#475569', lineHeight: 1.6 }}>
            <li>Co-created developmental benchmarks with family involvement</li>
            <li>Multidisciplinary collaboration (special educators, occupational and speech therapists)</li>
            <li>Sensory regulation and environmental co-regulation support</li>
            <li>Quarterly milestone reporting and transparent parent partnership</li>
          </ul>
        </Card>
      </section>

      <section aria-labelledby="sensory-support-heading" style={{ marginTop: '20px' }}>
        <Card>
          <h2 id="sensory-support-heading" style={{ fontSize: '18px', margin: '0 0 12px 0', color: '#1e293b' }}>
            Sensory &amp; Emotional Co-Regulation
          </h2>
          <p style={{ margin: 0, lineHeight: 1.6, color: '#334155' }}>
            Learning cannot occur when a child is overwhelmed or in sensory distress. Our classrooms and therapy suites
            prioritize sensory balance, quiet reset spaces, and gentle pacing to ensure emotional well-being precedes academics.
          </p>
        </Card>
      </section>
    </article>
  );
};
