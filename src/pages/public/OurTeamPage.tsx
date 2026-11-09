import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/config/constants';
import { teamService } from '@/services/supabase/team.service';
import { TeamMember, TeamDepartment } from '@/types/database.types';
import { FALLBACK_TEAM } from '@/data/curatedFallbackData';
import { SectionHeading } from '@/components/public/SectionHeading';
import { SectionBadge, Squiggle } from '@/components/public/DecorativeStickers';

export const OurTeamPage: React.FC = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(FALLBACK_TEAM);
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadTeam() {
      setIsLoading(true);
      try {
        const { data, error } = await teamService.getPublishedTeamMembers();
        if (!error && data && data.length > 0 && isMounted) {
          setTeamMembers(data);
        }
      } catch {
        // Fallback maintained
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadTeam();
    return () => {
      isMounted = false;
    };
  }, []);

  const departments: TeamDepartment[] = ['Leadership', 'Special Education', 'Therapy', 'Support'];
  const filteredTeam = teamMembers.filter(
    (m) => selectedDept === 'all' || m.department === selectedDept
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
          <SectionBadge text="Multidisciplinary Faculty" icon="👩‍🏫" variant="tertiary" style={{ marginBottom: '16px' }} />
          <h1
            style={{
              fontSize: 'clamp(32px, 5vw, 48px)',
              fontWeight: 800,
              color: '#1E293B',
              margin: '0 0 16px 0',
              fontFamily: 'var(--font-heading)',
            }}
          >
            Meet Our Dedicated{' '}
            <span style={{ color: '#8B5CF6', position: 'relative', display: 'inline-block' }}>
              Specialists
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
            Special educators, pediatric occupational therapists, speech-language pathologists, and behavioral support specialists working side-by-side.
          </p>

          {/* Department Filter Tabs */}
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
              onClick={() => setSelectedDept('all')}
              style={{
                padding: '8px 18px',
                borderRadius: '9999px',
                fontSize: '13px',
                fontWeight: 700,
                border: '2px solid #1E293B',
                boxShadow: selectedDept === 'all' ? '3px 3px 0px #1E293B' : 'none',
                backgroundColor: selectedDept === 'all' ? '#8B5CF6' : '#FFFFFF',
                color: selectedDept === 'all' ? '#FFFFFF' : '#1E293B',
                cursor: 'pointer',
              }}
            >
              All Faculty ({teamMembers.length})
            </button>
            {departments.map((dept) => (
              <button
                key={dept}
                type="button"
                onClick={() => setSelectedDept(dept)}
                style={{
                  padding: '8px 18px',
                  borderRadius: '9999px',
                  fontSize: '13px',
                  fontWeight: 700,
                  border: '2px solid #1E293B',
                  boxShadow: selectedDept === dept ? '3px 3px 0px #1E293B' : 'none',
                  backgroundColor: selectedDept === dept ? '#8B5CF6' : '#FFFFFF',
                  color: selectedDept === dept ? '#FFFFFF' : '#1E293B',
                  cursor: 'pointer',
                }}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Team Roster Grid */}
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
              Loading faculty directory...
            </div>
          )}

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '32px',
            }}
          >
            {filteredTeam.map((member) => (
              <div
                key={member.id}
                className="neo-card neo-card-interactive"
                style={{
                  padding: '28px',
                  backgroundColor: '#FFFFFF',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    width: '140px',
                    height: '140px',
                    borderRadius: '50%',
                    border: '2px solid #1E293B',
                    boxShadow: '4px 4px 0px #1E293B',
                    overflow: 'hidden',
                    marginBottom: '20px',
                  }}
                >
                  <img
                    src={member.photo_url || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80'}
                    alt={member.photo_alt || member.full_name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                <span className="neo-badge neo-badge-quaternary" style={{ marginBottom: '10px' }}>
                  {member.department}
                </span>

                <h3
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '20px',
                    fontWeight: 800,
                    margin: '0 0 4px 0',
                    color: '#1E293B',
                  }}
                >
                  {member.full_name}
                </h3>

                <span style={{ fontSize: '14px', fontWeight: 700, color: '#8B5CF6', marginBottom: '8px' }}>
                  {member.role_title}
                </span>

                <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 600, marginBottom: '16px' }}>
                  {member.qualifications}
                </span>

                <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Professional Standards & Safeguarding Commitment */}
      <section
        style={{
          padding: '80px 24px',
          backgroundColor: '#FFFDF5',
          borderBottom: '2px solid #1E293B',
        }}
      >
        <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
          <SectionHeading
            badgeText="Professional Integrity"
            badgeIcon="🛡️"
            badgeVariant="primary"
            title="Our Safeguarding &"
            highlightText="Ethics Standard"
            withSquiggle
            subtitle="How we ensure the highest caliber of safety and emotional security for every student."
          />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '24px',
            }}
          >
            {[
              { title: 'Rehabilitation Council Registration', desc: 'All special educators and therapists hold active professional certifications recognized by national licensing bodies.' },
              { title: 'Background Verification', desc: '100% of staff undergo comprehensive background checks and identity verification prior to campus placement.' },
              { title: 'Neurodiversity Affirming Care', desc: 'Faculty receive continuous training in trauma-informed de-escalation, sensory regulation, and non-speaking communication methods.' },
              { title: 'Low Staff Turnover', desc: 'Our intentional low-stress, multidisciplinary team structure ensures consistent long-term educator relationships for students.' },
            ].map((std, sIdx) => (
              <div
                key={sIdx}
                className="neo-card"
                style={{
                  padding: '24px',
                  backgroundColor: '#FFFFFF',
                }}
              >
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#8B5CF6', border: '1.5px solid #1E293B', marginBottom: '12px' }} />
                <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '16px', fontWeight: 800, margin: '0 0 8px 0' }}>
                  {std.title}
                </h4>
                <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.6, margin: 0 }}>
                  {std.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Consultation Banner */}
      <section style={{ padding: '64px 24px', backgroundColor: '#FFFFFF', textAlign: 'center' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '32px', fontWeight: 800, marginBottom: '16px' }}>
            Meet With Our Specialists
          </h2>
          <p style={{ color: '#475569', fontSize: '16px', lineHeight: 1.6, marginBottom: '28px' }}>
            We welcome parents to sit down with our occupational therapists, speech pathologists, and pedagogical director during a private consultation.
          </p>
          <Link to={ROUTES.PUBLIC.ADMISSIONS} className="neo-btn-primary">
            Schedule Parent Consultation &rarr;
          </Link>
        </div>
      </section>
    </div>
  );
};
