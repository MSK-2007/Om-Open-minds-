import React from 'react';
import { Card } from '@/components/common/Card';

export const ActivitiesPage: React.FC = () => {
  return (
    <article aria-labelledby="activities-heading">
      <header>
        <h1 id="activities-heading" style={{ fontSize: '28px', margin: '0 0 8px 0', color: '#0f172a' }}>
          Extracurricular &amp; Developmental Activities
        </h1>
        <p style={{ fontSize: '16px', color: '#475569', margin: '0 0 24px 0' }}>
          Socialization, arts, sensory enrichment, and sports initiatives.
        </p>
      </header>

      <section aria-labelledby="activities-placeholder-heading">
        <Card>
          <h2 id="activities-placeholder-heading" style={{ fontSize: '18px', margin: '0 0 12px 0', color: '#1e293b' }}>
            Activities Schedule Placeholder
          </h2>
          <p style={{ margin: 0, lineHeight: 1.6, color: '#334155' }}>
            Scheduled activities, seasonal workshops, music therapy, and adaptive physical education schedules
            will be configured here upon receiving verified curriculum materials.
          </p>
        </Card>
      </section>
    </article>
  );
};

