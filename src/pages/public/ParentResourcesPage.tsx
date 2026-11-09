import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/config/constants';
import { resourcesService } from '@/services/supabase/resources.service';
import { ParentResource, AdmissionsFaq, ResourceCategory } from '@/types/database.types';
import { FALLBACK_RESOURCES, FALLBACK_FAQS } from '@/data/curatedFallbackData';
import { SectionHeading } from '@/components/public/SectionHeading';
import { SectionBadge, Squiggle } from '@/components/public/DecorativeStickers';

export const ParentResourcesPage: React.FC = () => {
  const [resources, setResources] = useState<ParentResource[]>(FALLBACK_RESOURCES);
  const [faqs, setFaqs] = useState<AdmissionsFaq[]>(FALLBACK_FAQS);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [faqSearch, setFaqSearch] = useState<string>('');
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadResources() {
      setIsLoading(true);
      try {
        const [resData, faqData] = await Promise.all([
          resourcesService.getPublishedResources(),
          resourcesService.getAdmissionsFaqs(),
        ]);

        if (isMounted) {
          if (resData.data && resData.data.length > 0) setResources(resData.data);
          if (faqData.data && faqData.data.length > 0) setFaqs(faqData.data);
        }
      } catch {
        // Fallback maintained
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadResources();
    return () => {
      isMounted = false;
    };
  }, []);

  const categories: ResourceCategory[] = ['Calendar', 'Parent Guide', 'Sensory Tip Sheet', 'Policy'];

  const filteredResources = resources.filter(
    (r) => selectedCategory === 'all' || r.category === selectedCategory
  );

  const filteredFaqs = faqs.filter(
    (f) =>
      !faqSearch ||
      f.question.toLowerCase().includes(faqSearch.toLowerCase()) ||
      f.answer.toLowerCase().includes(faqSearch.toLowerCase())
  );

  return (
    <div style={{ width: '100%', overflowX: 'hidden' }}>
      {/* Header Banner */}
      <section
        style={{
          padding: '60px 24px',
          backgroundColor: '#FFFDF5',
          borderBottom: '2px solid #1E293B',
          textAlign: 'center',
        }}
        className="bg-dots"
      >
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <SectionBadge text="Parent Toolkits & Knowledge" icon="💡" variant="tertiary" style={{ marginBottom: '16px' }} />
          <h1
            style={{
              fontSize: 'clamp(32px, 5vw, 48px)',
              fontWeight: 800,
              color: '#1E293B',
              margin: '0 0 16px 0',
              fontFamily: 'var(--font-heading)',
            }}
          >
            Parent Resources &amp;{' '}
            <span style={{ color: '#8B5CF6', position: 'relative', display: 'inline-block' }}>
              Handbooks
              <span style={{ position: 'absolute', left: 0, bottom: '-8px', width: '100%' }}>
                <Squiggle color="#FBBF24" width={130} height={16} />
              </span>
            </span>
          </h1>
          <p
            style={{
              fontSize: 'clamp(16px, 2vw, 19px)',
              color: '#475569',
              lineHeight: 1.6,
              maxWidth: '740px',
              margin: '0 auto',
            }}
          >
            Practical, therapist-authored guides, sensory calming strategies, academic calendars, and transparent answers to assist families at home and at school.
          </p>

          {/* Category Tabs */}
          <div
            style={{
              display: 'flex',
              gap: '8px',
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginTop: '32px',
            }}
          >
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              style={{
                padding: '8px 18px',
                borderRadius: '9999px',
                fontSize: '13px',
                fontWeight: 700,
                border: '2px solid #1E293B',
                boxShadow: selectedCategory === 'all' ? '3px 3px 0px #1E293B' : 'none',
                backgroundColor: selectedCategory === 'all' ? '#8B5CF6' : '#FFFFFF',
                color: selectedCategory === 'all' ? '#FFFFFF' : '#1E293B',
                cursor: 'pointer',
              }}
            >
              All Documents ({resources.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '8px 18px',
                  borderRadius: '9999px',
                  fontSize: '13px',
                  fontWeight: 700,
                  border: '2px solid #1E293B',
                  boxShadow: selectedCategory === cat ? '3px 3px 0px #1E293B' : 'none',
                  backgroundColor: selectedCategory === cat ? '#8B5CF6' : '#FFFFFF',
                  color: selectedCategory === cat ? '#FFFFFF' : '#1E293B',
                  cursor: 'pointer',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Downloadable Resources Grid */}
      <section
        style={{
          padding: '80px 24px',
          backgroundColor: '#FFFFFF',
          borderBottom: '2px solid #1E293B',
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          {isLoading && (
            <div style={{ textAlign: 'center', padding: '40px', color: '#64748B' }}>
              Loading parent resources...
            </div>
          )}

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '28px',
            }}
          >
            {filteredResources.map((res) => (
              <div
                key={res.id}
                className="neo-card neo-card-interactive"
                style={{
                  padding: '28px',
                  backgroundColor: '#FFFDF5',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <span className="neo-badge neo-badge-tertiary">{res.category}</span>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748B' }}>
                      {res.file_format || 'PDF'} • {res.file_size_kb || 800} KB
                    </span>
                  </div>

                  <h3
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '20px',
                      fontWeight: 800,
                      color: '#1E293B',
                      margin: '0 0 10px 0',
                    }}
                  >
                    {res.title}
                  </h3>

                  <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                    {res.description}
                  </p>
                </div>

                <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '2px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#059669' }}>
                    ✓ Free Parent Access
                  </span>
                  <a
                    href={res.file_url || '#'}
                    download
                    className="neo-btn-primary"
                    style={{ fontSize: '13px', padding: '8px 16px', minHeight: '38px' }}
                  >
                    <span>Download PDF</span>
                    <span aria-hidden="true">↓</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Admissions & General FAQs Section */}
      <section
        style={{
          padding: '80px 24px',
          backgroundColor: '#FFFDF5',
          borderBottom: '2px solid #1E293B',
        }}
      >
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <SectionHeading
            badgeText="Clear Answers"
            badgeIcon="❓"
            badgeVariant="quaternary"
            title="Frequently Asked"
            highlightText="Questions"
            withSquiggle
            subtitle="Transparent explanations covering our admissions, sensory rooms, therapist co-teaching, and daily campus routines."
          />

          {/* Search Input for FAQs */}
          <div style={{ marginBottom: '32px' }}>
            <input
              type="search"
              placeholder="Search questions (e.g. ratios, therapies, observation)..."
              value={faqSearch}
              onChange={(e) => setFaqSearch(e.target.value)}
              className="neo-input"
              style={{ padding: '14px 20px', fontSize: '15px' }}
              aria-label="Filter FAQs by keyword"
            />
          </div>

          {filteredFaqs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#64748B' }}>
              No questions found matching &ldquo;{faqSearch}&rdquo;. Please contact our admissions team directly!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {filteredFaqs.map((faq) => {
                const isOpen = expandedFaqId === faq.id;
                return (
                  <div
                    key={faq.id}
                    className="neo-card"
                    style={{
                      padding: '20px 24px',
                      backgroundColor: isOpen ? '#F5F3FF' : '#FFFFFF',
                      cursor: 'pointer',
                    }}
                    onClick={() => setExpandedFaqId(isOpen ? null : faq.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setExpandedFaqId(isOpen ? null : faq.id);
                      }
                    }}
                    aria-expanded={isOpen}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h3
                        style={{
                          fontFamily: 'var(--font-heading)',
                          fontSize: '17px',
                          fontWeight: 800,
                          color: '#1E293B',
                          margin: 0,
                        }}
                      >
                        {faq.question}
                      </h3>
                      <span
                        style={{
                          fontSize: '22px',
                          fontWeight: 900,
                          color: '#8B5CF6',
                          marginLeft: '16px',
                        }}
                      >
                        {isOpen ? '−' : '+'}
                      </span>
                    </div>

                    {isOpen && (
                      <p
                        style={{
                          margin: '16px 0 0 0',
                          fontSize: '15px',
                          color: '#475569',
                          lineHeight: 1.7,
                          borderTop: '1.5px solid #E2E8F0',
                          paddingTop: '14px',
                        }}
                      >
                        {faq.answer}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA Footer */}
      <section style={{ padding: '64px 24px', backgroundColor: '#FFFFFF', textAlign: 'center' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '32px', fontWeight: 800, marginBottom: '16px' }}>
            Have a Question Not Answered Here?
          </h2>
          <p style={{ color: '#475569', fontSize: '16px', lineHeight: 1.6, marginBottom: '28px' }}>
            Our admissions directors are always delighted to speak with parents and address specific family requirements.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to={ROUTES.PUBLIC.CONTACT} className="neo-btn-primary">
              Send an Inquiry &rarr;
            </Link>
            <Link to={ROUTES.PUBLIC.ADMISSIONS} className="neo-btn-secondary">
              Book Campus Consultation
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
