import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/config/constants';
import { eventsService } from '@/services/supabase/events.service';
import { Activity, ActivityType } from '@/types/database.types';
import { FALLBACK_ACTIVITIES } from '@/data/curatedFallbackData';
import { SectionHeading } from '@/components/public/SectionHeading';
import { SectionBadge, Squiggle } from '@/components/public/DecorativeStickers';

export const ActivitiesPage: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>(FALLBACK_ACTIVITIES);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadActivities() {
      setIsLoading(true);
      try {
        const { data, error } = await eventsService.getPublishedActivities();
        if (!error && data && data.length > 0 && isMounted) {
          setActivities(data);
        }
      } catch {
        // Fallback maintained
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadActivities();
    return () => {
      isMounted = false;
    };
  }, []);

  const types: ActivityType[] = ['Regular Activity', 'Upcoming Event', 'Past Milestone'];
  const filteredActivities = activities.filter(
    (a) => selectedType === 'all' || a.activity_type === selectedType
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
          <SectionBadge text="Enrichment & Life Joy" icon="🎨" variant="secondary" style={{ marginBottom: '16px' }} />
          <h1
            style={{
              fontSize: 'clamp(32px, 5vw, 48px)',
              fontWeight: 800,
              color: '#1E293B',
              margin: '0 0 16px 0',
              fontFamily: 'var(--font-heading)',
            }}
          >
            Activities, Events &{' '}
            <span style={{ color: '#8B5CF6', position: 'relative', display: 'inline-block' }}>
              Milestones
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
            Adaptive creative arts, tactile horticulture, inclusive movement games, and campus milestones designed with sensory safety and joyful belonging.
          </p>

          {/* Filter Tabs */}
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
              onClick={() => setSelectedType('all')}
              style={{
                padding: '8px 18px',
                borderRadius: '9999px',
                fontSize: '13px',
                fontWeight: 700,
                border: '2px solid #1E293B',
                boxShadow: selectedType === 'all' ? '3px 3px 0px #1E293B' : 'none',
                backgroundColor: selectedType === 'all' ? '#8B5CF6' : '#FFFFFF',
                color: selectedType === 'all' ? '#FFFFFF' : '#1E293B',
                cursor: 'pointer',
              }}
            >
              All Activities ({activities.length})
            </button>
            {types.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setSelectedType(type)}
                style={{
                  padding: '8px 18px',
                  borderRadius: '9999px',
                  fontSize: '13px',
                  fontWeight: 700,
                  border: '2px solid #1E293B',
                  boxShadow: selectedType === type ? '3px 3px 0px #1E293B' : 'none',
                  backgroundColor: selectedType === type ? '#8B5CF6' : '#FFFFFF',
                  color: selectedType === type ? '#FFFFFF' : '#1E293B',
                  cursor: 'pointer',
                }}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Activities Grid */}
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
              Loading activities & calendar...
            </div>
          )}

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '32px',
            }}
          >
            {filteredActivities.map((act) => (
              <div
                key={act.id}
                className="neo-card neo-card-interactive"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  backgroundColor: '#FFFFFF',
                }}
              >
                {act.image_url && (
                  <div style={{ position: 'relative', height: '220px', borderBottom: '2px solid #1E293B' }}>
                    <img
                      src={act.image_url}
                      alt={act.image_alt || act.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <span
                      className="neo-badge neo-badge-secondary"
                      style={{ position: 'absolute', top: '14px', right: '14px' }}
                    >
                      {act.activity_type}
                    </span>
                  </div>
                )}

                <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                      {act.frequency && (
                        <span style={{ fontSize: '13px', fontWeight: 700, color: '#8B5CF6' }}>
                          📅 {act.frequency}
                        </span>
                      )}
                      {act.event_date && (
                        <span style={{ fontSize: '13px', fontWeight: 700, color: '#059669' }}>
                          🗓️ Event Date: {new Date(act.event_date).toLocaleDateString()}
                        </span>
                      )}
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
                      {act.title}
                    </h3>

                    <p style={{ color: '#475569', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>
                      {act.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sensory Accommodation Rules */}
      <section
        style={{
          padding: '80px 24px',
          backgroundColor: '#FFFDF5',
          borderBottom: '2px solid #1E293B',
        }}
      >
        <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
          <SectionHeading
            badgeText="Inclusion Principles"
            badgeIcon="🛡️"
            badgeVariant="quaternary"
            title="Sensory Accommodations for"
            highlightText="Every Event"
            withSquiggle
            subtitle="How we ensure school celebrations remain peaceful, joy-filled, and never overwhelming."
          />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '24px',
            }}
          >
            {[
              { title: 'Voluntary Participation', desc: 'No child is ever coerced to perform or remain on stage. Students engage according to their comfort level and sensory readiness.' },
              { title: 'Noise-Controlled Acoustics', desc: 'Loud megaphones and abrupt buzzers are prohibited. All community announcements are made at calibrated, gentle volumes.' },
              { title: 'Dedicated Chill-Out Suites', desc: 'Calming sensory rooms remain staffed and accessible during all school events for immediate quiet breaks.' },
              { title: 'Flexible Timing Windows', desc: 'Events operate with open-ended windows allowing families to arrive, participate, and depart on their child’s personal schedule.' },
            ].map((rule, idx) => (
              <div
                key={idx}
                className="neo-card"
                style={{ padding: '24px', backgroundColor: '#FFFFFF' }}
              >
                <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '16px', fontWeight: 800, margin: '0 0 8px 0' }}>
                  {rule.title}
                </h4>
                <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.6, margin: 0 }}>
                  {rule.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section style={{ padding: '64px 24px', backgroundColor: '#FFFFFF', textAlign: 'center' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '32px', fontWeight: 800, marginBottom: '16px' }}>
            Want to Inquire About Upcoming Events?
          </h2>
          <p style={{ color: '#475569', fontSize: '16px', lineHeight: 1.6, marginBottom: '28px' }}>
            Contact our student enrichment coordinator or schedule a campus walkthrough.
          </p>
          <Link to={ROUTES.PUBLIC.CONTACT} className="neo-btn-primary">
            Contact Enrichment Coordinator &rarr;
          </Link>
        </div>
      </section>
    </div>
  );
};
