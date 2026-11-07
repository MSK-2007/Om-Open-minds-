import React from 'react';
import { Card } from '@/components/common/Card';

export const ContactPage: React.FC = () => {
  return (
    <article aria-labelledby="contact-heading">
      <header>
        <h1 id="contact-heading" style={{ fontSize: '28px', margin: '0 0 8px 0', color: '#0f172a' }}>
          Contact Us
        </h1>
        <p style={{ fontSize: '16px', color: '#475569', margin: '0 0 24px 0' }}>
          Reach out to our administrative office, schedule a campus visit, or submit inquiries.
        </p>
      </header>

      <section aria-labelledby="contact-details-heading">
        <Card>
          <h2 id="contact-details-heading" style={{ fontSize: '18px', margin: '0 0 12px 0', color: '#1e293b' }}>
            Campus Contact Details Placeholder
          </h2>
          <p style={{ margin: '0 0 12px 0', lineHeight: 1.6, color: '#334155' }}>
            Official telephone numbers, verified email contacts, campus physical address, visiting hours,
            and an accessible message submission form linked to the Supabase backend will be deployed here.
          </p>
          <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>
            No fictitious phone numbers or addresses are generated in Phase 1.
          </p>
        </Card>
      </section>
    </article>
  );
};

