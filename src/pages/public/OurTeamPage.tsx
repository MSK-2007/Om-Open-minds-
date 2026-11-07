import React from 'react';
import { Card } from '@/components/common/Card';

export const OurTeamPage: React.FC = () => {
  return (
    <article aria-labelledby="team-heading">
      <header>
        <h1 id="team-heading" style={{ fontSize: '28px', margin: '0 0 8px 0', color: '#0f172a' }}>
          Our Multidisciplinary Team
        </h1>
        <p style={{ fontSize: '16px', color: '#475569', margin: '0 0 24px 0' }}>
          Certified special educators, allied developmental therapists, and leadership dedicated to every child's growth.
        </p>
      </header>

      <section aria-labelledby="leadership-heading">
        <Card>
          <h2 id="leadership-heading" style={{ fontSize: '18px', margin: '0 0 12px 0', color: '#1e293b' }}>
            Educational Leadership Placeholder
          </h2>
          <p style={{ margin: 0, lineHeight: 1.6, color: '#334155' }}>
            Director and special education directorship profiles, qualifications, and certified specializations
            will be populated following client data submission.
          </p>
        </Card>
      </section>

      <section aria-labelledby="faculty-heading" style={{ marginTop: '20px' }}>
        <Card>
          <h2 id="faculty-heading" style={{ fontSize: '18px', margin: '0 0 12px 0', color: '#1e293b' }}>
            Faculty &amp; Allied Specialists Directory Placeholder
          </h2>
          <p style={{ margin: 0, lineHeight: 1.6, color: '#334155' }}>
            Licensed special educators, occupational therapists, speech-language pathologists, and behavioral support specialists
            collaborate daily on student IEPs. Verified roster information will be managed through the administrative panel.
          </p>
        </Card>
      </section>
    </article>
  );
};
