import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/config/constants';
import { programmesService } from '@/services/supabase/programmes.service';
import { facilitiesService } from '@/services/supabase/facilities.service';
import { teamService } from '@/services/supabase/team.service';
import { eventsService } from '@/services/supabase/events.service';
import { galleryService } from '@/services/supabase/gallery.service';
import { resourcesService } from '@/services/supabase/resources.service';
import { enquiriesService, CreateContactEnquiryInput } from '@/services/supabase/enquiries.service';
import {
  Programme,
  Facility,
  TeamMember,
  Activity,
  GalleryItem,
  ParentResource,
  AdmissionsFaq,
} from '@/types/database.types';
import {
  FALLBACK_PILLARS,
  FALLBACK_PROGRAMMES,
  FALLBACK_FACILITIES,
  FALLBACK_TEAM,
  FALLBACK_ACTIVITIES,
  FALLBACK_GALLERY,
  FALLBACK_RESOURCES,
  FALLBACK_FAQS,
} from '@/data/curatedFallbackData';
import { SectionHeading } from '@/components/public/SectionHeading';
import { SectionBadge, Starburst, Squiggle, FloatingCircle } from '@/components/public/DecorativeStickers';

export const HomePage: React.FC = () => {
  // Dynamic State with Curated Fallbacks
  const [programmes, setProgrammes] = useState<Programme[]>(FALLBACK_PROGRAMMES);
  const [facilities, setFacilities] = useState<Facility[]>(FALLBACK_FACILITIES);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(FALLBACK_TEAM);
  const [activities, setActivities] = useState<Activity[]>(FALLBACK_ACTIVITIES);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(FALLBACK_GALLERY);
  const [resources, setResources] = useState<ParentResource[]>(FALLBACK_RESOURCES);
  const [faqs, setFaqs] = useState<AdmissionsFaq[]>(FALLBACK_FAQS);
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  // Quick Contact Form State
  const [contactForm, setContactForm] = useState<CreateContactEnquiryInput>({
    name: '',
    email: '',
    phone: '',
    subject: 'General Campus Inquiry',
    message: '',
    status: 'unread',
  });
  const [honeypot, setHoneypot] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitFeedback, setSubmitFeedback] = useState<{ success: boolean; message: string } | null>(null);

  // Load Data from Supabase Services
  useEffect(() => {
    let isMounted = true;

    async function loadSchoolData() {
      try {
        const [progRes, facRes, teamRes, actRes, galRes, resRes, faqRes] = await Promise.all([
          programmesService.getPublishedProgrammes(),
          facilitiesService.getPublishedFacilities(),
          teamService.getPublishedTeamMembers(),
          eventsService.getPublishedActivities(),
          galleryService.getPublishedGalleryItems(),
          resourcesService.getPublishedResources(),
          resourcesService.getAdmissionsFaqs(),
        ]);

        if (isMounted) {
          if (progRes.data && progRes.data.length > 0) setProgrammes(progRes.data);
          if (facRes.data && facRes.data.length > 0) setFacilities(facRes.data);
          if (teamRes.data && teamRes.data.length > 0) setTeamMembers(teamRes.data);
          if (actRes.data && actRes.data.length > 0) setActivities(actRes.data);
          if (galRes.data && galRes.data.length > 0) setGalleryItems(galRes.data);
          if (resRes.data && resRes.data.length > 0) setResources(resRes.data);
          if (faqRes.data && faqRes.data.length > 0) setFaqs(faqRes.data);
        }
      } catch {
        // Fallbacks remain active if database tables are pending migration
      }
    }

    loadSchoolData();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitFeedback(null);

    const result = await enquiriesService.submitContactEnquiry(contactForm, honeypot);
    setIsSubmitting(false);

    if (result.success) {
      setSubmitFeedback({
        success: true,
        message: 'Thank you! Your message has been received. Our administration will contact you within 1-2 business days.',
      });
      setContactForm({
        name: '',
        email: '',
        phone: '',
        subject: 'General Campus Inquiry',
        message: '',
        status: 'unread',
      });
    } else {
      setSubmitFeedback({
        success: false,
        message: result.error?.message || 'Unable to submit your inquiry at this moment. Please call our campus directly.',
      });
    }
  };

  return (
    <div style={{ width: '100%', overflowX: 'hidden' }}>
      {/* =========================================================================
          SECTION 2: HERO SECTION WITH GEOMETRIC ART & CTAS
          ========================================================================= */}
      <section
        aria-label="Welcome and Campus Introduction"
        style={{
          backgroundColor: '#FFFDF5',
          padding: '60px 24px 80px 24px',
          position: 'relative',
          borderBottom: '2px solid #1E293B',
          overflow: 'hidden',
        }}
        className="bg-dots"
      >
        {/* Floating Decorative Elements */}
        <div
          aria-hidden="true"
          style={{ position: 'absolute', top: '24px', left: '4%', opacity: 0.8 }}
        >
          <Starburst color="#FBBF24" size={42} />
        </div>
        <div
          aria-hidden="true"
          style={{ position: 'absolute', bottom: '40px', right: '6%', opacity: 0.9 }}
        >
          <FloatingCircle color="#F472B6" size={54} pattern="dots" />
        </div>

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
          {/* Left Column: Headline & Value Proposition */}
          <div>
            <div style={{ marginBottom: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <SectionBadge text="Specialized Education • Ages 3 to 18+" variant="primary" />
              <SectionBadge text="1:4 Student-Educator Ratio" variant="secondary" />
            </div>

            <h1
              style={{
                fontSize: 'clamp(36px, 5vw, 56px)',
                fontWeight: 800,
                color: '#1E293B',
                lineHeight: 1.15,
                margin: '0 0 20px 0',
                letterSpacing: '-0.02em',
                fontFamily: 'var(--font-heading)',
              }}
            >
              Every Child Learns.{' '}
              <span
                style={{
                  color: '#8B5CF6',
                  position: 'relative',
                  display: 'inline-block',
                }}
              >
                Differently.
                <span
                  style={{
                    position: 'absolute',
                    left: 0,
                    bottom: '-10px',
                    width: '100%',
                  }}
                >
                  <Squiggle color="#F472B6" width={140} height={18} />
                </span>
              </span>{' '}
              Joyfully.
            </h1>

            <p
              style={{
                fontSize: 'clamp(16px, 2vw, 20px)',
                color: '#475569',
                lineHeight: 1.6,
                margin: '0 0 32px 0',
                fontWeight: 500,
              }}
            >
              OM OPEN MINDS is a specialized sanctuary school dedicated to children with autism, developmental delays, and diverse sensory needs. With Individualized Education Plans (IEPs) and integrated occupational and speech therapies, we celebrate every milestone.
            </p>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
              <Link to={ROUTES.PUBLIC.ADMISSIONS} className="neo-btn-primary">
                <span>Book Campus Walkthrough</span>
                <span aria-hidden="true">&rarr;</span>
              </Link>
              <Link to={ROUTES.PUBLIC.PROGRAMMES} className="neo-btn-secondary">
                <span>Explore Learning Pathways</span>
              </Link>
            </div>

            {/* Quick Metrics Trust Bar */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '12px',
                marginTop: '40px',
                paddingTop: '24px',
                borderTop: '2px solid #E2E8F0',
              }}
            >
              <div>
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', fontWeight: 800, color: '#1E293B', display: 'block' }}>
                  1:4
                </span>
                <span style={{ fontSize: '13px', color: '#64748B', fontWeight: 600 }}>Max Class Ratio</span>
              </div>
              <div>
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', fontWeight: 800, color: '#8B5CF6', display: 'block' }}>
                  100%
                </span>
                <span style={{ fontSize: '13px', color: '#64748B', fontWeight: 600 }}>Customized IEPs</span>
              </div>
              <div>
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', fontWeight: 800, color: '#F472B6', display: 'block' }}>
                  Daily
                </span>
                <span style={{ fontSize: '13px', color: '#64748B', fontWeight: 600 }}>Integrated Therapy</span>
              </div>
            </div>
          </div>

          {/* Right Column: Playful Geometric Hero Showcase Card */}
          <div style={{ position: 'relative' }}>
            <div
              className="neo-card"
              style={{
                padding: '28px',
                backgroundColor: '#FFFFFF',
                position: 'relative',
                zIndex: 2,
              }}
            >
              {/* Header Sticker */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '20px',
                }}
              >
                <div style={{ display: 'flex', gap: '8px' }}>
                  <div style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: '#F472B6', border: '1.5px solid #1E293B' }} />
                  <div style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: '#FBBF24', border: '1.5px solid #1E293B' }} />
                  <div style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: '#34D399', border: '1.5px solid #1E293B' }} />
                </div>
                <span className="neo-badge neo-badge-quaternary">
                  Sensory-Safe Campus
                </span>
              </div>

              {/* Graphic Showcase Illustration */}
              <div
                style={{
                  borderRadius: '16px',
                  border: '2px solid #1E293B',
                  overflow: 'hidden',
                  position: 'relative',
                  marginBottom: '20px',
                  backgroundColor: '#F1F5F9',
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=800&q=80"
                  alt="A welcoming, calm sensory room at OM OPEN MINDS with soft fiber-optic lights and therapeutic play equipment"
                  style={{
                    width: '100%',
                    height: '280px',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: '12px',
                    left: '12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1.5px solid #1E293B',
                    borderRadius: '8px',
                    padding: '6px 12px',
                    fontSize: '12px',
                    fontWeight: 700,
                    boxShadow: '2px 2px 0px #1E293B',
                  }}
                >
                  📍 Sensory Integration Suite
                </div>
              </div>

              {/* Card Footer Quote */}
              <p
                style={{
                  fontSize: '14px',
                  color: '#334155',
                  lineHeight: 1.6,
                  fontStyle: 'italic',
                  margin: 0,
                }}
              >
                &ldquo;Our focus is not on changing who the child is, but giving them the regulation, sensory peace, and tailored pathways to blossom on their terms.&rdquo;
              </p>
              <div style={{ marginTop: '10px', fontSize: '12px', fontWeight: 700, color: '#8B5CF6' }}>
                — Leadership & Therapy Directorate
              </div>
            </div>

            {/* Background Offset Card Accent */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                top: '16px',
                left: '16px',
                width: '100%',
                height: '100%',
                backgroundColor: '#FBBF24',
                borderRadius: '24px',
                border: '2px solid #1E293B',
                zIndex: 1,
              }}
            />
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: WELCOME TO OM OPEN MINDS & CORE PILLARS
          ========================================================================= */}
      <section
        aria-labelledby="welcome-heading"
        style={{
          padding: '80px 24px',
          backgroundColor: '#FFFFFF',
          borderBottom: '2px solid #1E293B',
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <SectionHeading
            badgeText="Our Educational Philosophy"
            badgeIcon="✦"
            badgeVariant="tertiary"
            title="Why Families Choose"
            highlightText="OM OPEN MINDS"
            withSquiggle
            subtitle="Four developmental pillars designed to empower neurodivergent learners through empathy, science, and individualized attention."
          />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '24px',
            }}
          >
            {FALLBACK_PILLARS.map((pillar, idx) => {
              const bgColors = ['#F5F3FF', '#FFF1F2', '#FEF9C3', '#ECFDF5'];
              const borderBadge = ['neo-badge-primary', 'neo-badge-secondary', 'neo-badge-tertiary', 'neo-badge-quaternary'];

              return (
                <div
                  key={pillar.id}
                  className="neo-card neo-card-interactive"
                  style={{
                    padding: '28px',
                    backgroundColor: bgColors[idx % bgColors.length],
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                      <span className={`neo-badge ${borderBadge[idx % borderBadge.length]}`}>
                        Pillar 0{idx + 1}
                      </span>
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          backgroundColor: '#FFFFFF',
                          border: '1.5px solid #1E293B',
                          boxShadow: '2px 2px 0px #1E293B',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '18px',
                        }}
                      >
                        {idx === 0 ? '🎯' : idx === 1 ? '👥' : idx === 2 ? '🧩' : '🛡️'}
                      </div>
                    </div>

                    <h3
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '20px',
                        fontWeight: 800,
                        color: '#1E293B',
                        margin: '0 0 12px 0',
                      }}
                    >
                      {pillar.title}
                    </h3>

                    <p style={{ color: '#475569', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>
                      {pillar.description}
                    </p>
                  </div>

                  <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(30, 41, 59, 0.1)' }}>
                    <Link
                      to={ROUTES.PUBLIC.OUR_APPROACH}
                      style={{
                        fontSize: '13px',
                        fontWeight: 700,
                        color: '#1E293B',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      Learn more about our methodology &rarr;
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4 & 5: ABOUT THE SCHOOL, VISION & MISSION
          ========================================================================= */}
      <section
        aria-labelledby="about-overview-heading"
        style={{
          padding: '80px 24px',
          backgroundColor: '#FFFDF5',
          borderBottom: '2px solid #1E293B',
        }}
        className="bg-stripes"
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
          {/* Visual Side */}
          <div style={{ position: 'relative' }}>
            <div
              className="neo-card"
              style={{
                padding: '24px',
                backgroundColor: '#FFFFFF',
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80"
                alt="Teacher gently guiding a student in an adaptive learning environment"
                style={{
                  width: '100%',
                  height: '320px',
                  objectFit: 'cover',
                  borderRadius: '12px',
                  border: '2px solid #1E293B',
                  display: 'block',
                  marginBottom: '16px',
                }}
              />
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <SectionBadge text="Autism Spectrum" variant="primary" />
                <SectionBadge text="Down Syndrome" variant="secondary" />
                <SectionBadge text="Global Developmental Delay" variant="tertiary" />
                <SectionBadge text="Sensory Processing" variant="quaternary" />
              </div>
            </div>
          </div>

          {/* Narrative Content */}
          <div>
            <SectionBadge text="Founding Ethos" icon="★" variant="secondary" />
            <h2
              id="about-overview-heading"
              style={{
                fontSize: 'clamp(28px, 4vw, 40px)',
                fontWeight: 800,
                color: '#1E293B',
                margin: '12px 0 20px 0',
                fontFamily: 'var(--font-heading)',
              }}
            >
              Where Every Ability is Nurtured With Dignity
            </h2>

            <p style={{ color: '#475569', fontSize: '16px', lineHeight: 1.7, margin: '0 0 16px 0' }}>
              Founded with the conviction that traditional education frequently sidelines neurodivergent minds, <strong>OM OPEN MINDS</strong> provides a specialized learning ecosystem. We don’t ask children to fit a rigid curriculum; we adapt the curriculum to the unique rhythm of each child.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', margin: '24px 0' }}>
              <div
                className="neo-card"
                style={{ padding: '16px', backgroundColor: '#FEF9C3' }}
              >
                <h4 style={{ margin: '0 0 6px 0', fontSize: '16px', fontWeight: 800 }}>Our Vision</h4>
                <p style={{ margin: 0, fontSize: '13px', color: '#475569', lineHeight: 1.5 }}>
                  A society where every child with diverse developmental needs experiences unconditional belonging, independence, and personal fulfillment.
                </p>
              </div>

              <div
                className="neo-card"
                style={{ padding: '16px', backgroundColor: '#F5F3FF' }}
              >
                <h4 style={{ margin: '0 0 6px 0', fontSize: '16px', fontWeight: 800 }}>Our Mission</h4>
                <p style={{ margin: 0, fontSize: '13px', color: '#475569', lineHeight: 1.5 }}>
                  Delivering multidisciplinary special education, sensory therapy, and life skills instruction through empathetic partnership with families.
                </p>
              </div>
            </div>

            <Link to={ROUTES.PUBLIC.ABOUT} className="neo-btn-primary">
              Read Our Full Story &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: PROGRAMMES OVERVIEW
          ========================================================================= */}
      <section
        aria-labelledby="programmes-section-heading"
        style={{
          padding: '80px 24px',
          backgroundColor: '#FFFFFF',
          borderBottom: '2px solid #1E293B',
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <SectionHeading
            badgeText="Structured Learning Pathways"
            badgeIcon="📚"
            badgeVariant="primary"
            title="Developmental Programmes at"
            highlightText="OM OPEN MINDS"
            withSquiggle
            subtitle="Carefully scaffolded stages tailored to developmental readiness rather than rigid age brackets."
          />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px',
            }}
          >
            {programmes.map((prog, idx) => (
              <div
                key={prog.id}
                className="neo-card neo-card-interactive"
                style={{
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  backgroundColor: '#FFFFFF',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span className="neo-badge neo-badge-tertiary">
                      {prog.educator_ratio || 'Low Ratio'}
                    </span>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748B' }}>
                      Stage 0{idx + 1}
                    </span>
                  </div>

                  <h3
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '20px',
                      fontWeight: 800,
                      color: '#1E293B',
                      margin: '0 0 6px 0',
                    }}
                  >
                    {prog.title}
                  </h3>

                  <span
                    style={{
                      display: 'inline-block',
                      fontSize: '12px',
                      fontWeight: 700,
                      color: '#8B5CF6',
                      marginBottom: '12px',
                    }}
                  >
                    {prog.stage_description}
                  </span>

                  <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.6, margin: '0 0 16px 0' }}>
                    {prog.description}
                  </p>

                  <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#1E293B', margin: '0 0 8px 0', textTransform: 'uppercase' }}>
                    Key Focus Areas:
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', color: '#475569', lineHeight: 1.6 }}>
                    {prog.curriculum_highlights.slice(0, 3).map((highlight, hIdx) => (
                      <li key={hIdx}>{highlight}</li>
                    ))}
                  </ul>
                </div>

                <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '2px solid #F1F5F9' }}>
                  <Link
                    to={ROUTES.PUBLIC.PROGRAMMES}
                    className="neo-btn-secondary"
                    style={{ width: '100%', fontSize: '13px', padding: '8px 14px', textAlign: 'center' }}
                  >
                    View Pathway Curriculum &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link to={ROUTES.PUBLIC.PROGRAMMES} className="neo-btn-primary">
              Compare All Learning Pathways &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 7: OUR EDUCATIONAL APPROACH
          ========================================================================= */}
      <section
        aria-labelledby="approach-heading"
        style={{
          padding: '80px 24px',
          backgroundColor: '#FFFDF5',
          borderBottom: '2px solid #1E293B',
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <SectionHeading
            badgeText="How We Teach"
            badgeIcon="🧠"
            badgeVariant="quaternary"
            title="Our Multidisciplinary"
            highlightText="Approach"
            withSquiggle
            subtitle="Combining clinical rigor with gentle pedagogical care so therapy and education reinforce each other continuously."
          />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px',
            }}
          >
            {[
              {
                title: 'Sensory-First Regulation',
                badge: 'Regulation',
                color: '#ECFDF5',
                desc: 'A dysregulated child cannot access cognitive learning. We prioritize vestibular, proprioceptive, and tactile regulation before presenting academic concepts.',
              },
              {
                title: 'Collaborative IEP Design',
                badge: 'Customization',
                color: '#F5F3FF',
                desc: 'Every plan is developed with parents, special educators, occupational therapists, and speech pathologists with quarterly observable progress reviews.',
              },
              {
                title: 'Positive Reinforcement',
                badge: 'Empowerment',
                color: '#FFF1F2',
                desc: 'Zero punitive methods. We celebrate micro-milestones, build intrinsic motivation through student interests, and nurture emotional confidence.',
              },
              {
                title: 'Assistive Communication (AAC)',
                badge: 'Expression',
                color: '#FEF9C3',
                desc: 'Non-speaking does not mean non-thinking. We integrate visual PECS schedules, communication tablets, and gesture scaffolding across daily routines.',
              },
            ].map((approach, aIdx) => (
              <div
                key={aIdx}
                className="neo-card neo-card-interactive"
                style={{
                  padding: '24px',
                  backgroundColor: approach.color,
                }}
              >
                <span className="neo-badge neo-badge-quaternary" style={{ marginBottom: '12px' }}>
                  {approach.badge}
                </span>
                <h3
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '20px',
                    fontWeight: 800,
                    margin: '0 0 10px 0',
                    color: '#1E293B',
                  }}
                >
                  {approach.title}
                </h3>
                <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                  {approach.desc}
                </p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '36px' }}>
            <Link to={ROUTES.PUBLIC.OUR_APPROACH} className="neo-btn-primary">
              Discover Our Pedagogical Framework &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 8: FACILITIES HIGHLIGHTS
          ========================================================================= */}
      <section
        aria-labelledby="facilities-heading"
        style={{
          padding: '80px 24px',
          backgroundColor: '#FFFFFF',
          borderBottom: '2px solid #1E293B',
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <SectionHeading
            badgeText="Sensory-Safe Environments"
            badgeIcon="🏰"
            badgeVariant="secondary"
            title="Campus Facilities Designed for"
            highlightText="Sensory Peace"
            withSquiggle
            subtitle="Every room is acoustically calibrated, softly padded, and visually structured to provide psychological safety."
          />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px',
            }}
          >
            {facilities.slice(0, 4).map((fac) => (
              <div
                key={fac.id}
                className="neo-card neo-card-interactive"
                style={{
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div style={{ position: 'relative', height: '200px', borderBottom: '2px solid #1E293B' }}>
                  <img
                    src={fac.image_url}
                    alt={fac.image_alt || fac.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <span
                    className="neo-badge neo-badge-primary"
                    style={{ position: 'absolute', top: '12px', right: '12px' }}
                  >
                    {fac.category}
                  </span>
                </div>

                <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '18px',
                        fontWeight: 800,
                        margin: '0 0 8px 0',
                        color: '#1E293B',
                      }}
                    >
                      {fac.title}
                    </h3>
                    <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.6, margin: '0 0 12px 0' }}>
                      {fac.description}
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {fac.accessibility_features.map((feat, fIdx) => (
                      <span
                        key={fIdx}
                        style={{
                          fontSize: '11px',
                          backgroundColor: '#F1F5F9',
                          border: '1px solid #1E293B',
                          borderRadius: '4px',
                          padding: '2px 6px',
                          fontWeight: 600,
                        }}
                      >
                        ✓ {feat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '36px' }}>
            <Link to={ROUTES.PUBLIC.FACILITIES} className="neo-btn-secondary">
              View All Campus Facilities & Accessibility Details &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 9: TEAM & EDUCATORS
          ========================================================================= */}
      <section
        aria-labelledby="team-heading"
        style={{
          padding: '80px 24px',
          backgroundColor: '#FFFDF5',
          borderBottom: '2px solid #1E293B',
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <SectionHeading
            badgeText="Licensed Faculty & Therapists"
            badgeIcon="👩‍🏫"
            badgeVariant="tertiary"
            title="Guided by Experienced"
            highlightText="Specialists"
            withSquiggle
            subtitle="Special educators, occupational therapists, speech-language pathologists, and behavioral support specialists working in synchrony."
          />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '24px',
            }}
          >
            {teamMembers.slice(0, 4).map((member) => (
              <div
                key={member.id}
                className="neo-card neo-card-interactive"
                style={{
                  padding: '20px',
                  backgroundColor: '#FFFFFF',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    border: '2px solid #1E293B',
                    boxShadow: '3px 3px 0px #1E293B',
                    overflow: 'hidden',
                    marginBottom: '16px',
                  }}
                >
                  <img
                    src={member.photo_url || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80'}
                    alt={member.photo_alt || member.full_name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                <span className="neo-badge neo-badge-quaternary" style={{ marginBottom: '8px' }}>
                  {member.department}
                </span>

                <h3
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '18px',
                    fontWeight: 800,
                    margin: '0 0 4px 0',
                    color: '#1E293B',
                  }}
                >
                  {member.full_name}
                </h3>

                <span style={{ fontSize: '13px', fontWeight: 700, color: '#8B5CF6', marginBottom: '8px' }}>
                  {member.role_title}
                </span>

                <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 600, marginBottom: '12px' }}>
                  {member.qualifications}
                </span>

                <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.5, margin: 0 }}>
                  {member.bio}
                </p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '36px' }}>
            <Link to={ROUTES.PUBLIC.OUR_TEAM} className="neo-btn-primary">
              Meet Our Complete Faculty & Therapy Roster &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 10: ACTIVITIES & EVENTS
          ========================================================================= */}
      <section
        aria-labelledby="activities-heading"
        style={{
          padding: '80px 24px',
          backgroundColor: '#FFFFFF',
          borderBottom: '2px solid #1E293B',
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <SectionHeading
            badgeText="Enrichment & Joy"
            badgeIcon="🎨"
            badgeVariant="secondary"
            title="Campus Activities &"
            highlightText="Milestones"
            withSquiggle
            subtitle="Adaptive arts, sensory horticulture, gross-motor movement games, and inclusive family celebrations."
          />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '24px',
            }}
          >
            {activities.map((act) => (
              <div
                key={act.id}
                className="neo-card neo-card-interactive"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                }}
              >
                {act.image_url && (
                  <div style={{ height: '180px', borderBottom: '2px solid #1E293B' }}>
                    <img
                      src={act.image_url}
                      alt={act.image_alt || act.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                )}
                <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span className="neo-badge neo-badge-secondary">{act.activity_type}</span>
                      {act.frequency && (
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748B' }}>
                          📅 {act.frequency}
                        </span>
                      )}
                    </div>
                    <h3
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '18px',
                        fontWeight: 800,
                        margin: '0 0 8px 0',
                        color: '#1E293B',
                      }}
                    >
                      {act.title}
                    </h3>
                    <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                      {act.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '36px' }}>
            <Link to={ROUTES.PUBLIC.ACTIVITIES} className="neo-btn-secondary">
              View Calendar & Regular Activity Schedule &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 11: GALLERY PREVIEW (CHILD SAFEGUARDED)
          ========================================================================= */}
      <section
        aria-labelledby="gallery-preview-heading"
        style={{
          padding: '80px 24px',
          backgroundColor: '#FFFDF5',
          borderBottom: '2px solid #1E293B',
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <SectionHeading
            badgeText="Joyful Moments"
            badgeIcon="📸"
            badgeVariant="quaternary"
            title="Campus Moments &"
            highlightText="Sensory Spaces"
            withSquiggle
            subtitle="Parental consent verified on 100% of student imagery. Descriptive alt-text provided for full accessibility."
          />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '20px',
            }}
          >
            {galleryItems.slice(0, 4).map((item) => (
              <div
                key={item.id}
                className="neo-card neo-card-interactive"
                style={{
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                <div style={{ height: '220px' }}>
                  <img
                    src={item.image_url}
                    alt={item.alt_text}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div style={{ padding: '14px', borderTop: '2px solid #1E293B', backgroundColor: '#FFFFFF' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 800, margin: '0 0 4px 0', color: '#1E293B' }}>
                    {item.title}
                  </h4>
                  <p style={{ fontSize: '12px', color: '#64748B', margin: 0, lineHeight: 1.4 }}>
                    {item.alt_text.slice(0, 80)}...
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '36px' }}>
            <Link to={ROUTES.PUBLIC.GALLERY} className="neo-btn-primary">
              Browse Complete Consented Gallery &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 12: PARENT RESOURCES & FAQS
          ========================================================================= */}
      <section
        aria-labelledby="resources-heading"
        style={{
          padding: '80px 24px',
          backgroundColor: '#FFFFFF',
          borderBottom: '2px solid #1E293B',
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <SectionHeading
            badgeText="Parent Empowerment"
            badgeIcon="💡"
            badgeVariant="tertiary"
            title="Downloadable Guides &"
            highlightText="Admissions FAQs"
            withSquiggle
            subtitle="Transparent answers and practical guides designed to support families on their journey."
          />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '40px',
            }}
          >
            {/* Left: Downloadable Parent Guides */}
            <div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: 800, marginBottom: '20px' }}>
                Featured Parent Toolkits
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {resources.slice(0, 3).map((res) => (
                  <div
                    key={res.id}
                    className="neo-card neo-card-interactive"
                    style={{
                      padding: '18px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      backgroundColor: '#FFFDF5',
                    }}
                  >
                    <div>
                      <span className="neo-badge neo-badge-tertiary" style={{ fontSize: '11px', marginBottom: '6px' }}>
                        {res.category}
                      </span>
                      <h4 style={{ fontSize: '15px', fontWeight: 800, margin: '4px 0', color: '#1E293B' }}>
                        {res.title}
                      </h4>
                      <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>
                        Format: {res.file_format || 'PDF'} • Size: {res.file_size_kb || 800} KB
                      </p>
                    </div>
                    <Link
                      to={ROUTES.PUBLIC.PARENT_RESOURCES}
                      style={{
                        padding: '8px 12px',
                        backgroundColor: '#8B5CF6',
                        color: '#FFFFFF',
                        border: '1.5px solid #1E293B',
                        borderRadius: '8px',
                        fontWeight: 700,
                        fontSize: '12px',
                        boxShadow: '2px 2px 0px #1E293B',
                        flexShrink: 0,
                      }}
                    >
                      Download
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Interactive Admissions FAQs */}
            <div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: 800, marginBottom: '20px' }}>
                Frequently Asked Questions
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {faqs.slice(0, 4).map((faq) => {
                  const isOpen = expandedFaq === faq.id;
                  return (
                    <div
                      key={faq.id}
                      className="neo-card"
                      style={{
                        padding: '16px 20px',
                        backgroundColor: isOpen ? '#F5F3FF' : '#FFFFFF',
                        cursor: 'pointer',
                      }}
                      onClick={() => setExpandedFaq(isOpen ? null : faq.id)}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h4 style={{ fontSize: '15px', fontWeight: 800, margin: 0, color: '#1E293B' }}>
                          {faq.question}
                        </h4>
                        <span style={{ fontSize: '18px', fontWeight: 900, color: '#8B5CF6' }}>
                          {isOpen ? '−' : '+'}
                        </span>
                      </div>
                      {isOpen && (
                        <p style={{ margin: '12px 0 0 0', fontSize: '14px', color: '#475569', lineHeight: 1.6 }}>
                          {faq.answer}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 13: ADMISSIONS CALL-TO-ACTION BANNER
          ========================================================================= */}
      <section
        aria-label="Admissions Call to Action"
        style={{
          padding: '80px 24px',
          backgroundColor: '#8B5CF6',
          color: '#FFFFFF',
          borderBottom: '2px solid #1E293B',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <span
            className="neo-badge neo-badge-tertiary"
            style={{ marginBottom: '16px' }}
          >
            Admissions Open 2026–2027
          </span>

          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(32px, 5vw, 48px)',
              fontWeight: 800,
              color: '#FFFFFF',
              margin: '0 0 16px 0',
              lineHeight: 1.2,
            }}
          >
            Take the First Gentle Step Towards Your Child’s Growth
          </h2>

          <p
            style={{
              fontSize: 'clamp(16px, 2vw, 18px)',
              color: 'rgba(255, 255, 255, 0.95)',
              lineHeight: 1.6,
              margin: '0 0 32px 0',
            }}
          >
            Schedule a private, sensory-friendly walkthrough of our campus. Meet our educators, see our therapeutic spaces, and discuss your child’s needs in a supportive, pressure-free environment.
          </p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              to={ROUTES.PUBLIC.ADMISSIONS}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#FBBF24',
                color: '#1E293B',
                border: '2px solid #1E293B',
                boxShadow: '4px 4px 0px #1E293B',
                borderRadius: '9999px',
                fontFamily: 'var(--font-heading)',
                fontWeight: 800,
                fontSize: '16px',
                padding: '14px 28px',
                textDecoration: 'none',
              }}
            >
              <span>Schedule Initial Consultation</span>
              <span aria-hidden="true">&rarr;</span>
            </Link>
            <Link
              to={ROUTES.PUBLIC.CONTACT}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#FFFFFF',
                color: '#1E293B',
                border: '2px solid #1E293B',
                boxShadow: '4px 4px 0px #1E293B',
                borderRadius: '9999px',
                fontFamily: 'var(--font-heading)',
                fontWeight: 800,
                fontSize: '16px',
                padding: '14px 28px',
                textDecoration: 'none',
              }}
            >
              <span>Call Campus Desk</span>
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 14: CONTACT & REACH OUT
          ========================================================================= */}
      <section
        aria-labelledby="contact-section-heading"
        style={{
          padding: '80px 24px',
          backgroundColor: '#FFFDF5',
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <SectionHeading
            badgeText="Get in Touch"
            badgeIcon="📬"
            badgeVariant="secondary"
            title="We Are Here to"
            highlightText="Listen & Support"
            withSquiggle
            subtitle="Whether you have questions about admissions, therapy integration, or campus access, our staff is here to help."
          />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '40px',
            }}
          >
            {/* Campus Info & Accessibility Details */}
            <div>
              <div
                className="neo-card"
                style={{
                  padding: '28px',
                  backgroundColor: '#FFFFFF',
                  marginBottom: '24px',
                }}
              >
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: 800, marginBottom: '16px' }}>
                  Campus Location & Arrival
                </h3>
                <p style={{ color: '#475569', fontSize: '14px', lineHeight: 1.6, margin: '0 0 16px 0' }}>
                  <strong>OM OPEN MINDS Campus</strong><br />
                  Specialized Education & Child Development Complex<br />
                  Main Campus Avenue • Karnataka, India
                </p>

                <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '16px', marginTop: '16px' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#1E293B', marginBottom: '8px' }}>
                    Visiting Hours:
                  </h4>
                  <p style={{ fontSize: '13px', color: '#64748B', margin: '0 0 4px 0' }}>
                    Monday – Friday: 9:00 AM – 3:30 PM (School Hours)
                  </p>
                  <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
                    Saturday: 9:30 AM – 1:00 PM (Family Consultation Sessions)
                  </p>
                </div>

                <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '16px', marginTop: '16px' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#1E293B', marginBottom: '8px' }}>
                    Accessibility Arrival Guide:
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', color: '#64748B', lineHeight: 1.6 }}>
                    <li>Dedicated wheelchair accessible drop-off bay</li>
                    <li>Zero-step ramps with gentle slopes at every entry</li>
                    <li>Low-noise calm intake waiting lounge</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Quick Contact Form with Honeypot */}
            <div>
              <div
                className="neo-card"
                style={{
                  padding: '28px',
                  backgroundColor: '#FFFFFF',
                }}
              >
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: 800, marginBottom: '16px' }}>
                  Send Our Admissions Team a Message
                </h3>

                {submitFeedback && (
                  <div
                    role="alert"
                    style={{
                      padding: '12px 16px',
                      borderRadius: '8px',
                      marginBottom: '20px',
                      border: '2px solid #1E293B',
                      backgroundColor: submitFeedback.success ? '#ECFDF5' : '#FFF1F2',
                      color: submitFeedback.success ? '#065F46' : '#991B1B',
                      fontSize: '14px',
                      fontWeight: 600,
                    }}
                  >
                    {submitFeedback.message}
                  </div>
                )}

                <form onSubmit={handleContactSubmit}>
                  {/* Honeypot Spam Trap (Hidden from users) */}
                  <div style={{ display: 'none' }} aria-hidden="true">
                    <label htmlFor="website-hp">Leave this field blank</label>
                    <input
                      id="website-hp"
                      type="text"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label
                      htmlFor="contact-name"
                      style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '6px', color: '#1E293B' }}
                    >
                      Your Full Name *
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      placeholder="e.g. Priya Sharma"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      className="neo-input"
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div>
                      <label
                        htmlFor="contact-email"
                        style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '6px', color: '#1E293B' }}
                      >
                        Email Address *
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        placeholder="name@example.com"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        className="neo-input"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="contact-phone"
                        style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '6px', color: '#1E293B' }}
                      >
                        Phone Number
                      </label>
                      <input
                        id="contact-phone"
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={contactForm.phone || ''}
                        onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                        className="neo-input"
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label
                      htmlFor="contact-message"
                      style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '6px', color: '#1E293B' }}
                    >
                      How can we support you and your child? *
                    </label>
                    <textarea
                      id="contact-message"
                      required
                      rows={4}
                      placeholder="Tell us a little about your child's age, communication preferences, or any specific questions about our school..."
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      className="neo-input"
                      style={{ resize: 'vertical' }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="neo-btn-primary"
                    style={{ width: '100%' }}
                  >
                    {isSubmitting ? 'Transmitting Message...' : 'Submit Message →'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
