import React from 'react';
import { Card } from '@/components/common/Card';

export const FacilitiesPage: React.FC = () => {
  return (
    <article aria-labelledby="facilities-heading">
      <header>
        <h1 id="facilities-heading" style={{ fontSize: '28px', margin: '0 0 8px 0', color: '#0f172a' }}>
          Campus &amp; Learning Facilities
        </h1>
        <p style={{ fontSize: '16px', color: '#475569', margin: '0 0 24px 0' }}>
          Accessible infrastructure, sensory rooms, and developmental spaces.
        </p>
      </header>

      <section aria-labelledby="facilities-placeholder-heading">
        <Card>
          <h2 id="facilities-placeholder-heading" style={{ fontSize: '18px', margin: '0 0 12px 0', color: '#1e293b' }}>
            Infrastructure Directory Placeholder
          </h2>
          <p style={{ margin: 0, lineHeight: 1.6, color: '#334155' }}>
            Detailed documentation of sensory integration rooms, speech and occupational therapy units,
            wheelchair-accessible infrastructure, and safe outdoor play zones will be structured here.
          </p>
        </Card>
      </section>
    </article>
  );
};

