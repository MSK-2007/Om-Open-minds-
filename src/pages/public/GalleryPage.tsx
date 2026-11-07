import React from 'react';
import { Card } from '@/components/common/Card';

export const GalleryPage: React.FC = () => {
  return (
    <article aria-labelledby="gallery-heading">
      <header>
        <h1 id="gallery-heading" style={{ fontSize: '28px', margin: '0 0 8px 0', color: '#0f172a' }}>
          Photo &amp; Media Gallery
        </h1>
        <p style={{ fontSize: '16px', color: '#475569', margin: '0 0 24px 0' }}>
          Visual documentation of campus activities, student achievements, and learning environments.
        </p>
      </header>

      <section aria-labelledby="gallery-placeholder-heading">
        <Card>
          <h2 id="gallery-placeholder-heading" style={{ fontSize: '18px', margin: '0 0 12px 0', color: '#1e293b' }}>
            Media Gallery Placeholder
          </h2>
          <p style={{ margin: 0, lineHeight: 1.6, color: '#334155' }}>
            Approved photographs, video highlights, and accessible media albums will be populated
            via Supabase Storage. All media will mandate rigorous descriptive alternative text (alt text)
            for assistive device compliance.
          </p>
        </Card>
      </section>
    </article>
  );
};

