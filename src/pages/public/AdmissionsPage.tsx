import React from 'react';
import { Card } from '@/components/common/Card';

export const AdmissionsPage: React.FC = () => {
  return (
    <article aria-labelledby="admissions-heading">
      <header>
        <h1 id="admissions-heading" style={{ fontSize: '28px', margin: '0 0 8px 0', color: '#0f172a' }}>
          Admissions &amp; Enrollment
        </h1>
        <p style={{ fontSize: '16px', color: '#475569', margin: '0 0 24px 0' }}>
          Admission guidelines, assessment process, and parent consultation requests.
        </p>
      </header>

      <section aria-labelledby="process-heading">
        <Card>
          <h2 id="process-heading" style={{ fontSize: '18px', margin: '0 0 12px 0', color: '#1e293b' }}>
            Admissions Process Placeholder
          </h2>
          <p style={{ margin: '0 0 12px 0', lineHeight: 1.6, color: '#334155' }}>
            Information regarding initial consultations, developmental assessments, required documentation,
            and enrollment timelines will be integrated here.
          </p>
          <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>
            An accessible multi-step inquiry form connected to the Supabase admissions service
            will be activated following client form specification.
          </p>
        </Card>
      </section>
    </article>
  );
};

