import React from 'react';
import { Card } from '@/components/common/Card';

export const ParentResourcesPage: React.FC = () => {
  return (
    <article aria-labelledby="resources-heading">
      <header>
        <h1 id="resources-heading" style={{ fontSize: '28px', margin: '0 0 8px 0', color: '#0f172a' }}>
          Parent Resources &amp; Support
        </h1>
        <p style={{ fontSize: '16px', color: '#475569', margin: '0 0 24px 0' }}>
          Academic calendars, downloadable parent guidelines, home sensory strategies, and community support links.
        </p>
      </header>

      <section aria-labelledby="calendar-heading">
        <Card>
          <h2 id="calendar-heading" style={{ fontSize: '18px', margin: '0 0 12px 0', color: '#1e293b' }}>
            Academic Term Calendars Placeholder
          </h2>
          <p style={{ margin: 0, lineHeight: 1.6, color: '#334155' }}>
            Scheduled term opening dates, parent-educator conference days, holiday closures, and community milestone events
            will be downloadable as accessible PDF schedules managed by school administrators.
          </p>
        </Card>
      </section>

      <section aria-labelledby="guidance-heading" style={{ marginTop: '20px' }}>
        <Card>
          <h2 id="guidance-heading" style={{ fontSize: '18px', margin: '0 0 12px 0', color: '#1e293b' }}>
            Home Support &amp; Sensory Guidance Placeholder
          </h2>
          <p style={{ margin: 0, lineHeight: 1.6, color: '#334155' }}>
            Practical tips for daily routines, calm-down corner setup at home, positive communication methods,
            and vetted community resources will be made available for families.
          </p>
        </Card>
      </section>
    </article>
  );
};
