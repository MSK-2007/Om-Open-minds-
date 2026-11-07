import React from 'react';
import { Card } from '@/components/common/Card';

export const ProgrammesPage: React.FC = () => {
  return (
    <article aria-labelledby="programmes-heading">
      <header>
        <h1 id="programmes-heading" style={{ fontSize: '28px', margin: '0 0 8px 0', color: '#0f172a' }}>
          Educational Programmes
        </h1>
        <p style={{ fontSize: '16px', color: '#475569', margin: '0 0 24px 0' }}>
          Tailored learning curricula and developmental interventions.
        </p>
      </header>

      <section aria-labelledby="curricula-placeholder-heading">
        <Card>
          <h2 id="curricula-placeholder-heading" style={{ fontSize: '18px', margin: '0 0 12px 0', color: '#1e293b' }}>
            Programmes Catalog Placeholder
          </h2>
          <p style={{ margin: 0, lineHeight: 1.6, color: '#334155' }}>
            Structured programmes, age-group groupings, individual learning plans (IEP), and therapy offerings
            will be retrieved dynamically from Supabase database tables or client-verified specifications.
          </p>
        </Card>
      </section>
    </article>
  );
};

