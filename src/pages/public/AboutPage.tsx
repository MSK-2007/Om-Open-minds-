import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/config/constants';
import { SectionHeading } from '@/components/public/SectionHeading';
import { SectionBadge, Starburst, Squiggle, FloatingCircle } from '@/components/public/DecorativeStickers';

export const AboutPage: React.FC = () => {
  return (
    <div style={{ width: '100%', overflowX: 'hidden' }}>
      {/* Hero Banner */}
      <section
        style={{
          padding: '60px 24px',
          backgroundColor: '#FFFDF5',
          borderBottom: '2px solid #1E293B',
          position: 'relative',
        }}
        className="bg-dots"
      >
        <div style={{ maxWidth: '1080px', margin: '0 auto', textAlign: 'center' }}>
          <SectionBadge text="About OM OPEN MINDS" icon="🏫" variant="primary" style={{ marginBottom: '16px' }} />
          <h1
            style={{
              fontSize: 'clamp(32px, 5vw, 48px)',
              fontWeight: 800,
              color: '#1E293B',
              margin: '0 0 16px 0',
              fontFamily: 'var(--font-heading)',
            }}
          >
            A Sanctuary School for{' '}
            <span style={{ color: '#8B5CF6', position: 'relative', display: 'inline-block' }}>
              Neurodivergent Growth
              <span style={{ position: 'absolute', left: 0, bottom: '-8px', width: '100%' }}>
                <Squiggle color="#F472B6" width={140} height={16} />
              </span>
            </span>
          </h1>
          <p
            style={{
              fontSize: 'clamp(16px, 2vw, 19px)',
              color: '#475569',
              lineHeight: 1.6,
              maxWidth: '800px',
              margin: '0 auto 28px auto',
            }}
          >
            OM OPEN MINDS was founded to create an environment where children with autism, global developmental delays, Down syndrome, and sensory processing differences are understood, cherished, and empowered.
          </p>
        </div>
      </section>

      {/* Narrative Section: Our Ethos & Story */}
      <section
        style={{
          padding: '80px 24px',
          backgroundColor: '#FFFFFF',
          borderBottom: '2px solid #1E293B',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '48px',
            alignItems: 'center',
          }}
        >
          <div>
            <SectionBadge text="Our Founding Philosophy" icon="💡" variant="secondary" />
            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(26px, 3.5vw, 36px)',
                fontWeight: 800,
                color: '#1E293B',
                margin: '12px 0 20px 0',
              }}
            >
              Rethinking Education for Unique Developmental Trajectories
            </h2>

            <p style={{ color: '#475569', fontSize: '15px', lineHeight: 1.7, margin: '0 0 16px 0' }}>
              In standard academic institutions, rigid benchmarks and hyper-stimulating sensory environments frequently induce anxiety and behavioral distress in neurodivergent children. At <strong>OM OPEN MINDS</strong>, we begin by redesigning the physical space, instructional pacing, and educator-to-child ratios.
            </p>

            <p style={{ color: '#475569', fontSize: '15px', lineHeight: 1.7, margin: '0 0 24px 0' }}>
              Every classroom is an intentional calm zone. Therapy is not an isolated weekly extraction; speech pathologists, occupational therapists, and special educators collaborate side-by-side throughout the child’s school day.
            </p>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <div className="neo-card" style={{ padding: '14px 20px', backgroundColor: '#F5F3FF' }}>
                <span style={{ fontSize: '18px', fontWeight: 800, color: '#8B5CF6', display: 'block' }}>1:4 Max Ratio</span>
                <span style={{ fontSize: '12px', color: '#64748B' }}>Personalized Regulation</span>
              </div>
              <div className="neo-card" style={{ padding: '14px 20px', backgroundColor: '#ECFDF5' }}>
                <span style={{ fontSize: '18px', fontWeight: 800, color: '#059669', display: 'block' }}>Allied Team</span>
                <span style={{ fontSize: '12px', color: '#64748B' }}>Co-Teaching Specialists</span>
              </div>
            </div>
          </div>

          <div>
            <div
              className="neo-card"
              style={{
                padding: '24px',
                backgroundColor: '#FFFDF5',
                position: 'relative',
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=800&q=80"
                alt="Calm learning corner designed for neurodivergent focus"
                style={{ width: '100%', height: '320px', objectFit: 'cover', borderRadius: '12px', border: '2px solid #1E293B', display: 'block' }}
              />
              <div style={{ marginTop: '16px', fontSize: '13px', color: '#64748B', fontStyle: 'italic' }}>
                &ldquo;When a flower doesn't bloom, you fix the environment in which it grows, not the flower.&rdquo;
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Anchored Section */}
      <section
        id="vision-mission"
        style={{
          padding: '80px 24px',
          backgroundColor: '#FFFDF5',
          borderBottom: '2px solid #1E293B',
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <SectionHeading
            badgeText="Vision & Mission"
            badgeIcon="🎯"
            badgeVariant="tertiary"
            title="Guiding Principles of"
            highlightText="Our Institution"
            withSquiggle
            subtitle="The fundamental compass guiding every lesson, interaction, and family partnership."
          />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '32px',
            }}
          >
            {/* Vision Card */}
            <div
              className="neo-card neo-card-interactive"
              style={{
                padding: '36px',
                backgroundColor: '#FEF9C3',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <span className="neo-badge neo-badge-tertiary">Our Vision</span>
                <Starburst color="#F59E0B" size={36} />
              </div>

              <h3
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '24px',
                  fontWeight: 800,
                  color: '#1E293B',
                  margin: '0 0 16px 0',
                }}
              >
                A World of Joyful Belonging & Independence
              </h3>

              <p style={{ color: '#475569', fontSize: '15px', lineHeight: 1.7, margin: 0 }}>
                We envision a society where every child with diverse developmental learning needs is celebrated for their authentic self. We strive for a future where neurodivergent individuals navigate the world with self-advocacy, dignity, practical independence, and genuine community inclusion.
              </p>
            </div>

            {/* Mission Card */}
            <div
              className="neo-card neo-card-interactive"
              style={{
                padding: '36px',
                backgroundColor: '#F5F3FF',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <span className="neo-badge neo-badge-primary">Our Mission</span>
                <FloatingCircle color="#8B5CF6" size={36} />
              </div>

              <h3
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '24px',
                  fontWeight: 800,
                  color: '#1E293B',
                  margin: '0 0 16px 0',
                }}
              >
                Empowering Through Evidence-Based Empathy
              </h3>

              <p style={{ color: '#475569', fontSize: '15px', lineHeight: 1.7, margin: 0 }}>
                Our daily mission is to provide individualized multidisciplinary education that unlocks communication, motor coordination, cognitive potential, and emotional regulation. We stand as devoted partners to families, equipping parents with sensory guidance and advocacy tools.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Institutional Values */}
      <section
        style={{
          padding: '80px 24px',
          backgroundColor: '#FFFFFF',
          borderBottom: '2px solid #1E293B',
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <SectionHeading
            badgeText="Our Core Values"
            badgeIcon="✦"
            badgeVariant="quaternary"
            title="What We Stand For"
            highlightText="Every Day"
            withSquiggle
            subtitle="The non-negotiable commitments embedded into our school culture."
          />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '24px',
            }}
          >
            {[
              {
                title: 'Radical Dignity',
                color: '#FFF1F2',
                badge: 'neo-badge-secondary',
                desc: 'Every child is treated with complete respect. We reject punitive behavior modification, focusing instead on underlying sensory needs and emotional co-regulation.',
              },
              {
                title: 'Empathetic Partnership',
                color: '#FEF9C3',
                badge: 'neo-badge-tertiary',
                desc: 'Parents are the primary experts on their children. We maintain open communication diaries, quarterly collaborative IEP reviews, and dedicated parent support groups.',
              },
              {
                title: 'Clinical Co-Teaching',
                color: '#ECFDF5',
                badge: 'neo-badge-quaternary',
                desc: 'Therapies do not exist in isolation. Speech, occupational, and sensory therapies are woven directly into daily classroom arts, snacks, and circle routines.',
              },
              {
                title: 'Joy & Celebration',
                color: '#F5F3FF',
                badge: 'neo-badge-primary',
                desc: 'Progress in special education is measured in personal victories: an untethered step, a new vocal sound, or a calm transition. Every micro-milestone is honored.',
              },
            ].map((val, idx) => (
              <div
                key={idx}
                className="neo-card neo-card-interactive"
                style={{
                  padding: '28px',
                  backgroundColor: val.color,
                }}
              >
                <span className={`neo-badge ${val.badge}`} style={{ marginBottom: '14px' }}>
                  Value 0{idx + 1}
                </span>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: 800, margin: '0 0 10px 0' }}>
                  {val.title}
                </h3>
                <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                  {val.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section
        style={{
          padding: '64px 24px',
          backgroundColor: '#FFFDF5',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '32px', fontWeight: 800, marginBottom: '16px' }}>
            Experience Our Community in Person
          </h2>
          <p style={{ color: '#475569', fontSize: '16px', lineHeight: 1.6, marginBottom: '28px' }}>
            We invite prospective parents to tour our sensory suites, observe our gentle classroom routines, and speak with our directors.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to={ROUTES.PUBLIC.ADMISSIONS} className="neo-btn-primary">
              Book Campus Tour &rarr;
            </Link>
            <Link to={ROUTES.PUBLIC.PROGRAMMES} className="neo-btn-secondary">
              View Programmes Catalog
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
