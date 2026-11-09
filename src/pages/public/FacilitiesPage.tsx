import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/config/constants';
import { facilitiesService } from '@/services/supabase/facilities.service';
import { Facility, FacilityCategory } from '@/types/database.types';
import { FALLBACK_FACILITIES } from '@/data/curatedFallbackData';
import { SectionHeading } from '@/components/public/SectionHeading';
import { SectionBadge, Squiggle } from '@/components/public/DecorativeStickers';

export const FacilitiesPage: React.FC = () => {
  const [facilities, setFacilities] = useState<Facility[]>(FALLBACK_FACILITIES);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadFacilities() {
      setIsLoading(true);
      try {
        const { data, error } = await facilitiesService.getPublishedFacilities();
        if (!error && data && data.length > 0 && isMounted) {
          setFacilities(data);
        }
      } catch {
        // Fallback maintained
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadFacilities();
    return () => {
      isMounted = false;
    };
  }, []);

  const categories: FacilityCategory[] = ['Sensory', 'Therapy', 'Learning', 'Recreation'];
  const filteredFacilities = facilities.filter(
    (f) => selectedCategory === 'all' || f.category === selectedCategory
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
          <SectionBadge text="Sensory-Safe Environments" icon="🏰" variant="secondary" style={{ marginBottom: '16px' }} />
          <h1
            style={{
              fontSize: 'clamp(32px, 5vw, 48px)',
              fontWeight: 800,
              color: '#1E293B',
              margin: '0 0 16px 0',
              fontFamily: 'var(--font-heading)',
            }}
          >
            Campus Facilities &{' '}
            <span style={{ color: '#8B5CF6', position: 'relative', display: 'inline-block' }}>
              Sensory Spaces
              <span style={{ position: 'absolute', left: 0, bottom: '-8px', width: '100%' }}>
                <Squiggle color="#F472B6" width={130} height={16} />
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
            Engineered from ground up with acoustic dampening, soft impact padding, and dimmable lighting to provide physical and psychological safety for children with sensory differences.
          </p>

          {/* Category Filter Tabs */}
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
              All Campus Suites ({facilities.length})
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

      {/* Facilities Grid */}
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
              Loading campus facility details...
            </div>
          )}

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
              gap: '32px',
            }}
          >
            {filteredFacilities.map((fac) => (
              <div
                key={fac.id}
                className="neo-card neo-card-interactive"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  backgroundColor: '#FFFFFF',
                }}
              >
                <div style={{ position: 'relative', height: '240px', borderBottom: '2px solid #1E293B' }}>
                  <img
                    src={fac.image_url}
                    alt={fac.image_alt || fac.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <span
                    className="neo-badge neo-badge-primary"
                    style={{ position: 'absolute', top: '14px', right: '14px' }}
                  >
                    {fac.category} Suite
                  </span>
                </div>

                <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '22px',
                        fontWeight: 800,
                        color: '#1E293B',
                        margin: '0 0 10px 0',
                      }}
                    >
                      {fac.title}
                    </h3>

                    <p style={{ color: '#475569', fontSize: '14px', lineHeight: 1.6, margin: '0 0 20px 0' }}>
                      {fac.description}
                    </p>
                  </div>

                  <div>
                    <h4
                      style={{
                        fontSize: '12px',
                        fontWeight: 800,
                        color: '#64748B',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        margin: '0 0 8px 0',
                      }}
                    >
                      Accessibility &amp; Sensory Features:
                    </h4>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {fac.accessibility_features.map((feat, fIdx) => (
                        <span
                          key={fIdx}
                          style={{
                            fontSize: '12px',
                            backgroundColor: '#F1F5F9',
                            border: '1.5px solid #1E293B',
                            borderRadius: '6px',
                            padding: '3px 8px',
                            fontWeight: 600,
                            color: '#1E293B',
                          }}
                        >
                          ✓ {feat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Universal Campus Accessibility Standards */}
      <section
        style={{
          padding: '80px 24px',
          backgroundColor: '#FFFDF5',
          borderBottom: '2px solid #1E293B',
        }}
      >
        <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
          <SectionHeading
            badgeText="Universal Campus Access"
            badgeIcon="♿"
            badgeVariant="quaternary"
            title="Built for Universal Inclusion &"
            highlightText="Physical Safety"
            withSquiggle
            subtitle="Every corridor, doorframe, threshold, and playground zone adheres to barrier-free universal design."
          />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '20px',
            }}
          >
            {[
              { title: 'Zero-Step Architecture', desc: 'Continuous gentle ramps with handrails; zero raised step thresholds across all public and classroom entries.' },
              { title: 'Acoustic Insulation', desc: 'Ceiling sound baffles and acoustic double-glazed windows protect hypersensitive ears from sudden traffic or construction spikes.' },
              { title: 'Calibrated Lighting', desc: 'Absence of flickering fluorescent tubes. Warm, dimmable indirect LED illumination with natural daylight integration.' },
              { title: 'Wide Doorways & Turning Bays', desc: 'Extra-wide corridors and turning circles designed for manual and motorized wheelchairs and adaptive walkers.' },
            ].map((item, idx) => (
              <div
                key={idx}
                className="neo-card"
                style={{
                  padding: '20px',
                  backgroundColor: '#FFFFFF',
                }}
              >
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#34D399', border: '1.5px solid #1E293B', marginBottom: '10px' }} />
                <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '16px', fontWeight: 800, margin: '0 0 8px 0' }}>
                  {item.title}
                </h4>
                <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.6, margin: 0 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Walkthrough CTA */}
      <section style={{ padding: '64px 24px', backgroundColor: '#FFFFFF', textAlign: 'center' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '32px', fontWeight: 800, marginBottom: '16px' }}>
            Book a Quiet-Hour Campus Walkthrough
          </h2>
          <p style={{ color: '#475569', fontSize: '16px', lineHeight: 1.6, marginBottom: '28px' }}>
            Experience our sensory spaces firsthand before your child arrives. Private quiet tours are arranged with zero pressure.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to={ROUTES.PUBLIC.ADMISSIONS} className="neo-btn-primary">
              Schedule Campus Visit &rarr;
            </Link>
            <Link to={ROUTES.PUBLIC.CONTACT} className="neo-btn-secondary">
              Campus Directions &amp; Transit Info
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
