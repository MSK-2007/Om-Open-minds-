import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/config/constants';
import { SectionHeading } from '@/components/public/SectionHeading';
import { SectionBadge, Squiggle } from '@/components/public/DecorativeStickers';

export const OurApproachPage: React.FC = () => {
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
          <SectionBadge text="Pedagogy & Clinical Care" icon="🧩" variant="quaternary" style={{ marginBottom: '16px' }} />
          <h1
            style={{
              fontSize: 'clamp(32px, 5vw, 48px)',
              fontWeight: 800,
              color: '#1E293B',
              margin: '0 0 16px 0',
              fontFamily: 'var(--font-heading)',
            }}
          >
            Our Multidisciplinary{' '}
            <span style={{ color: '#8B5CF6', position: 'relative', display: 'inline-block' }}>
              Approach
              <span style={{ position: 'absolute', left: 0, bottom: '-8px', width: '100%' }}>
                <Squiggle color="#34D399" width={130} height={16} />
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
            How we integrate special education, sensory occupational therapy, and assistive speech communication into one seamless, compassionate school day.
          </p>
        </div>
      </section>

      {/* 5 Core Pillars of Methodology */}
      <section
        style={{
          padding: '80px 24px',
          backgroundColor: '#FFFFFF',
          borderBottom: '2px solid #1E293B',
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <SectionHeading
            badgeText="Evidence-Based Framework"
            badgeIcon="✦"
            badgeVariant="tertiary"
            title="The Five Pillars of Our"
            highlightText="Pedagogical Model"
            withSquiggle
            subtitle="Designed by licensed special educators, behavioral therapists, and occupational therapy specialists."
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {[
              {
                num: '01',
                title: 'The Individualized Education Plan (IEP) Framework',
                color: '#F5F3FF',
                tag: 'Personalized Learning',
                desc: 'Every child arrives with a distinct neurological profile. Rather than expecting conformity, we craft a quarterly Individualized Education Plan. Goals span cognitive concepts, motor coordination, emotional regulation, and communication milestones. Parents participate in quarterly collaborative review summits to ensure seamless consistency between school and home.',
                keyPoints: ['Quarterly observable milestone tracking', 'Joint parent-educator goal setting', 'Zero competitive grading'],
              },
              {
                num: '02',
                title: 'Sensory Integration & Environmental Regulation',
                color: '#ECFDF5',
                tag: 'Sensory Science',
                desc: 'A child experiencing sensory overload or under-stimulation cannot engage in executive cognitive tasks. Before demanding academic focus, our educators and occupational therapists assess vestibular, proprioceptive, and tactile needs. Sensory breaks in our calming suites are an integrated right, not a reward.',
                keyPoints: ['Calibrated dimmable lighting and acoustic dampening', 'Continuous access to vestibular movement swings', 'Deep pressure tactile tools during circle routines'],
              },
              {
                num: '03',
                title: 'Total Communication & AAC Scaffolding',
                color: '#FEF9C3',
                tag: 'Communication',
                desc: 'Every child has a voice, regardless of verbal speech. We practice Total Communication: combining spoken language, picture exchange communication systems (PECS), high-tech speech-generating devices (AAC), and functional gesture signing. Staff model AAC throughout the day to ensure non-speaking students communicate wants, thoughts, and boundaries.',
                keyPoints: ['Dedicated speech-language pathologist co-teaching', 'Visual schedule strips across all classrooms', 'Assisted AAC tablet integration'],
              },
              {
                num: '04',
                title: 'Positive Behavioral Support & Dignity First',
                color: '#FFF1F2',
                tag: 'Emotional Security',
                desc: 'We view challenging behavior as a form of communication: an indicator of an unmet sensory, physical, or emotional need. Our behavioral support protocols reject compliance-based punishments or seclusion. We teach co-regulation, emotional identification through visual emotion meters, and proactive coping mechanisms.',
                keyPoints: ['Functional behavioral analysis of underlying triggers', 'Non-punitive co-regulation techniques', 'Focus on autonomy, choices, and consent'],
              },
              {
                num: '05',
                title: 'Integrated Allied Therapy Co-Teaching',
                color: '#FFFDF5',
                tag: 'Allied Synergy',
                desc: 'Rather than isolating therapy in clinical 30-minute extraction blocks, our therapists work directly inside the classroom. Occupational therapists guide fine-motor grip during art sessions; speech pathologists facilitate peer dialogue during snack routines. Skills generalize immediately into natural life contexts.',
                keyPoints: ['Therapists co-teach with special educators daily', 'Real-world skill transfer across mealtime and play', 'Unified multidisciplinary progress documentation'],
              },
            ].map((pillar) => (
              <div
                key={pillar.num}
                className="neo-card"
                style={{
                  padding: '36px',
                  backgroundColor: pillar.color,
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '32px',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                    <span className="neo-badge neo-badge-primary">Pillar {pillar.num}</span>
                    <span className="neo-badge neo-badge-quaternary">{pillar.tag}</span>
                  </div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: 'clamp(22px, 3vw, 26px)',
                      fontWeight: 800,
                      color: '#1E293B',
                      margin: '0 0 14px 0',
                    }}
                  >
                    {pillar.title}
                  </h3>
                  <p style={{ color: '#475569', fontSize: '15px', lineHeight: 1.7, margin: 0 }}>
                    {pillar.desc}
                  </p>
                </div>

                <div
                  className="neo-card"
                  style={{
                    padding: '24px',
                    backgroundColor: '#FFFFFF',
                  }}
                >
                  <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '16px', fontWeight: 800, margin: '0 0 12px 0' }}>
                    How We Implement This:
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: '20px', color: '#475569', fontSize: '14px', lineHeight: 1.7 }}>
                    {pillar.keyPoints.map((pt, pIdx) => (
                      <li key={pIdx} style={{ marginBottom: '6px' }}>
                        <strong>{pt}</strong>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison: Traditional vs. OM OPEN MINDS */}
      <section
        style={{
          padding: '80px 24px',
          backgroundColor: '#FFFDF5',
          borderBottom: '2px solid #1E293B',
        }}
        className="bg-stripes"
      >
        <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
          <SectionHeading
            badgeText="Educational Model Comparison"
            badgeIcon="⚖️"
            badgeVariant="secondary"
            title="A Difference Built on"
            highlightText="Understanding"
            withSquiggle
            subtitle="Comparing conventional classroom setups with the OM OPEN MINDS multidisciplinary environment."
          />

          <div
            className="neo-card"
            style={{
              padding: '24px',
              backgroundColor: '#FFFFFF',
              overflowX: 'auto',
            }}
          >
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '14px',
                textAlign: 'left',
              }}
            >
              <thead>
                <tr style={{ borderBottom: '2px solid #1E293B' }}>
                  <th style={{ padding: '16px', fontFamily: 'var(--font-heading)', fontSize: '16px', fontWeight: 800 }}>Feature</th>
                  <th style={{ padding: '16px', color: '#64748B', fontFamily: 'var(--font-heading)', fontSize: '16px' }}>Conventional Classroom</th>
                  <th style={{ padding: '16px', color: '#8B5CF6', fontFamily: 'var(--font-heading)', fontSize: '16px', fontWeight: 800 }}>OM OPEN MINDS</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feat: 'Classroom Ratio', conv: '1:25 to 1:40 students per teacher', om: '1:3 to 1:5 maximum student-to-educator ratio' },
                  { feat: 'Curriculum Pacing', conv: 'Standardized rigid grade curriculum', om: 'Customized Individualized Education Plan (IEP)' },
                  { feat: 'Sensory Support', conv: 'Fluorescent lights, high noise, limited breaks', om: 'Calibrated acoustic rooms, sensory calming suites' },
                  { feat: 'Therapy Model', conv: 'Isolated clinical clinic visits after school', om: 'Integrated co-teaching with therapists in class' },
                  { feat: 'Communication', conv: 'Speech-focused expectation exclusively', om: 'Total Communication: AAC, PECS, gestures & speech' },
                  { feat: 'Behavioral Philosophy', conv: 'Punitive demerits and compliance demands', om: 'Positive behavioral support and emotional co-regulation' },
                ].map((row, rIdx) => (
                  <tr key={rIdx} style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: rIdx % 2 === 0 ? '#FFFDF5' : '#FFFFFF' }}>
                    <td style={{ padding: '16px', fontWeight: 700, color: '#1E293B' }}>{row.feat}</td>
                    <td style={{ padding: '16px', color: '#64748B' }}>{row.conv}</td>
                    <td style={{ padding: '16px', color: '#1E293B', fontWeight: 600 }}>
                      <span style={{ color: '#059669', marginRight: '6px' }}>✓</span>
                      {row.om}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section style={{ padding: '64px 24px', backgroundColor: '#FFFFFF', textAlign: 'center' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '32px', fontWeight: 800, marginBottom: '16px' }}>
            Learn How We Can Tailor an IEP for Your Child
          </h2>
          <p style={{ color: '#475569', fontSize: '16px', lineHeight: 1.6, marginBottom: '28px' }}>
            Every consultation is private and respectful. Speak directly with our special educational director and allied therapists.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to={ROUTES.PUBLIC.ADMISSIONS} className="neo-btn-primary">
              Book Developmental Walkthrough &rarr;
            </Link>
            <Link to={ROUTES.PUBLIC.FACILITIES} className="neo-btn-secondary">
              Inspect Our Sensory Facilities
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
