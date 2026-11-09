import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/config/constants';
import { programmesService } from '@/services/supabase/programmes.service';
import { Programme } from '@/types/database.types';
import { FALLBACK_PROGRAMMES } from '@/data/curatedFallbackData';
import { SectionBadge, Squiggle } from '@/components/public/DecorativeStickers';

export const ProgrammesPage: React.FC = () => {
  const [programmes, setProgrammes] = useState<Programme[]>(FALLBACK_PROGRAMMES);
  const [selectedSlug, setSelectedSlug] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadProgrammes() {
      setIsLoading(true);
      try {
        const { data, error } = await programmesService.getPublishedProgrammes();
        if (!error && data && data.length > 0 && isMounted) {
          setProgrammes(data);
        }
      } catch {
        // Fallback maintained
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadProgrammes();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredProgrammes = programmes.filter(
    (p) => selectedSlug === 'all' || p.slug === selectedSlug
  );

  return (
    <div style={{ width: '100%', overflowX: 'hidden' }}>
      {/* Page Header */}
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
          <SectionBadge text="Developmental Pathways" icon="📚" variant="primary" style={{ marginBottom: '16px' }} />
          <h1
            style={{
              fontSize: 'clamp(32px, 5vw, 48px)',
              fontWeight: 800,
              color: '#1E293B',
              margin: '0 0 16px 0',
              fontFamily: 'var(--font-heading)',
            }}
          >
            Specialized Learning{' '}
            <span style={{ color: '#8B5CF6', position: 'relative', display: 'inline-block' }}>
              Programmes
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
            Our pathways are structured around developmental readiness, sensory regulation, and functional independence rather than rigid age brackets.
          </p>

          {/* Pathway Filter Tabs */}
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
              onClick={() => setSelectedSlug('all')}
              style={{
                padding: '8px 16px',
                borderRadius: '9999px',
                fontSize: '13px',
                fontWeight: 700,
                border: '2px solid #1E293B',
                boxShadow: selectedSlug === 'all' ? '3px 3px 0px #1E293B' : 'none',
                backgroundColor: selectedSlug === 'all' ? '#8B5CF6' : '#FFFFFF',
                color: selectedSlug === 'all' ? '#FFFFFF' : '#1E293B',
                cursor: 'pointer',
              }}
            >
              All Pathways ({programmes.length})
            </button>
            {programmes.map((prog) => (
              <button
                key={prog.id}
                type="button"
                onClick={() => setSelectedSlug(prog.slug)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '9999px',
                  fontSize: '13px',
                  fontWeight: 700,
                  border: '2px solid #1E293B',
                  boxShadow: selectedSlug === prog.slug ? '3px 3px 0px #1E293B' : 'none',
                  backgroundColor: selectedSlug === prog.slug ? '#8B5CF6' : '#FFFFFF',
                  color: selectedSlug === prog.slug ? '#FFFFFF' : '#1E293B',
                  cursor: 'pointer',
                }}
              >
                {prog.title.replace(' Pathway', '')}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Programmes List */}
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
              Loading pathway details...
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
            {filteredProgrammes.map((prog, idx) => {
              const bgTints = ['#F5F3FF', '#FFF1F2', '#FEF9C3', '#ECFDF5'];
              const badgeColors = ['neo-badge-primary', 'neo-badge-secondary', 'neo-badge-tertiary', 'neo-badge-quaternary'];

              return (
                <div
                  key={prog.id}
                  id={prog.slug}
                  className="neo-card"
                  style={{
                    padding: '36px',
                    backgroundColor: bgTints[idx % bgTints.length],
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                    gap: '36px',
                    alignItems: 'center',
                  }}
                >
                  {/* Left Column: Details */}
                  <div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap' }}>
                      <span className={`neo-badge ${badgeColors[idx % badgeColors.length]}`}>
                        Pathway 0{idx + 1}
                      </span>
                      <span className="neo-badge neo-badge-quaternary">
                        {prog.educator_ratio || 'Low Student Ratio'}
                      </span>
                    </div>

                    <h2
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: 'clamp(24px, 3.5vw, 32px)',
                        fontWeight: 800,
                        color: '#1E293B',
                        margin: '0 0 6px 0',
                      }}
                    >
                      {prog.title}
                    </h2>

                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#8B5CF6', marginBottom: '16px' }}>
                      {prog.stage_description}
                    </div>

                    <p style={{ color: '#475569', fontSize: '15px', lineHeight: 1.7, margin: '0 0 24px 0' }}>
                      {prog.description}
                    </p>

                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                      <Link
                        to={ROUTES.PUBLIC.ADMISSIONS}
                        className="neo-btn-primary"
                        style={{ fontSize: '14px', padding: '10px 20px' }}
                      >
                        Inquire for this Pathway &rarr;
                      </Link>
                      <Link
                        to={ROUTES.PUBLIC.OUR_APPROACH}
                        className="neo-btn-secondary"
                        style={{ fontSize: '14px', padding: '10px 20px' }}
                      >
                        Therapy Integration
                      </Link>
                    </div>
                  </div>

                  {/* Right Column: Curriculum Highlights & Co-Teaching */}
                  <div
                    className="neo-card"
                    style={{
                      padding: '24px',
                      backgroundColor: '#FFFFFF',
                    }}
                  >
                    <h3
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '18px',
                        fontWeight: 800,
                        color: '#1E293B',
                        margin: '0 0 16px 0',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                      }}
                    >
                      Curriculum &amp; Skill Domains
                    </h3>

                    <ul style={{ margin: 0, paddingLeft: '20px', color: '#475569', fontSize: '14px', lineHeight: 1.8 }}>
                      {prog.curriculum_highlights.map((item, hIdx) => (
                        <li key={hIdx} style={{ marginBottom: '8px' }}>
                          <strong>{item}</strong>
                        </li>
                      ))}
                    </ul>

                    <div
                      style={{
                        marginTop: '20px',
                        padding: '12px 16px',
                        backgroundColor: '#FFFDF5',
                        border: '1.5px solid #1E293B',
                        borderRadius: '8px',
                        fontSize: '12px',
                        color: '#64748B',
                      }}
                    >
                      💡 <strong>Collaborative Allied Support:</strong> Speech and occupational therapists co-teach during active sessions for this pathway.
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Admissions Journey Callout */}
      <section
        style={{
          padding: '64px 24px',
          backgroundColor: '#FFFDF5',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '28px', fontWeight: 800, marginBottom: '14px' }}>
            Unsure Which Pathway Fits Your Child?
          </h2>
          <p style={{ color: '#475569', fontSize: '15px', lineHeight: 1.6, marginBottom: '24px' }}>
            We do not require pre-existing clinical test scores to guide you. Book a non-intimidating play observation with our educational director.
          </p>
          <Link to={ROUTES.PUBLIC.ADMISSIONS} className="neo-btn-primary">
            Schedule an Exploratory Consultation &rarr;
          </Link>
        </div>
      </section>
    </div>
  );
};
