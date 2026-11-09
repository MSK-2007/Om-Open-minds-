import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/config/constants';
import { enquiriesService, CreateAdmissionEnquiryInput } from '@/services/supabase/enquiries.service';
import { SectionHeading } from '@/components/public/SectionHeading';
import { SectionBadge, Squiggle } from '@/components/public/DecorativeStickers';

export const AdmissionsPage: React.FC = () => {
  const [formData, setFormData] = useState<CreateAdmissionEnquiryInput>({
    parent_name: '',
    email: '',
    phone: '',
    child_name: '',
    child_age: null,
    preferred_program: 'Early Intervention Pathway (Ages 3–6)',
    notes: '',
    status: 'pending',
  });
  const [honeypot, setHoneypot] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    const result = await enquiriesService.submitAdmissionEnquiry(formData, honeypot);
    setIsSubmitting(false);

    if (result.success) {
      setFeedback({
        success: true,
        message: 'Your inquiry has been warmly received. Our educational director will personally reach out within 1-2 business days to arrange your private campus tour.',
      });
      setFormData({
        parent_name: '',
        email: '',
        phone: '',
        child_name: '',
        child_age: null,
        preferred_program: 'Early Intervention Pathway (Ages 3–6)',
        notes: '',
        status: 'pending',
      });
    } else {
      setFeedback({
        success: false,
        message: result.error?.message || 'Unable to submit your admission inquiry. Please call our campus directly at our contact desk.',
      });
    }
  };

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
          <SectionBadge text="A Welcoming Beginning" icon="🌱" variant="primary" style={{ marginBottom: '16px' }} />
          <h1
            style={{
              fontSize: 'clamp(32px, 5vw, 48px)',
              fontWeight: 800,
              color: '#1E293B',
              margin: '0 0 16px 0',
              fontFamily: 'var(--font-heading)',
            }}
          >
            Admissions &amp; Family{' '}
            <span style={{ color: '#8B5CF6', position: 'relative', display: 'inline-block' }}>
              Consultations
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
            A calm, pressure-free admissions journey designed around understanding your child’s emotional comforts, sensory rhythm, and developmental potential.
          </p>
        </div>
      </section>

      {/* 4-Step Consultation Journey */}
      <section
        style={{
          padding: '80px 24px',
          backgroundColor: '#FFFFFF',
          borderBottom: '2px solid #1E293B',
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <SectionHeading
            badgeText="Our 4-Step Journey"
            badgeIcon="✦"
            badgeVariant="tertiary"
            title="How We Welcome"
            highlightText="New Families"
            withSquiggle
            subtitle="No stressful diagnostic tests or high-pressure assessments. Just empathetic observation and mutual alignment."
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
                step: 'Step 01',
                title: 'Initial Parent Inquiry',
                badge: 'neo-badge-primary',
                desc: 'Submit the simple inquiry form below or call our admissions team. We discuss your child’s current communication style, sensory comforts, and your hopes.',
              },
              {
                step: 'Step 02',
                title: 'Private Campus Tour',
                badge: 'neo-badge-secondary',
                desc: 'Visit during calm, quiet hours. Walk through our sensory calming suites, observe educator-student interactions, and assess barrier-free accessibility.',
              },
              {
                step: 'Step 03',
                title: 'Gentle Play Observation',
                badge: 'neo-badge-tertiary',
                desc: 'Your child joins our therapists in a friendly playroom setting with toys, sensory swings, and tactile materials. We observe strengths, regulation cues, and interests.',
              },
              {
                step: 'Step 04',
                title: 'Collaborative IEP Proposal',
                badge: 'neo-badge-quaternary',
                desc: 'We draft a customized Individualized Education Plan (IEP) proposing classroom cluster placement, educator ratios, and integrated therapy schedules.',
              },
            ].map((step, sIdx) => (
              <div
                key={sIdx}
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
                  <span className={`neo-badge ${step.badge}`} style={{ marginBottom: '14px' }}>
                    {step.step}
                  </span>
                  <h3
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '20px',
                      fontWeight: 800,
                      color: '#1E293B',
                      margin: '0 0 10px 0',
                    }}
                  >
                    {step.title}
                  </h3>
                  <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Intake Form Section */}
      <section
        id="inquiry-form-section"
        style={{
          padding: '80px 24px',
          backgroundColor: '#FFFDF5',
          borderBottom: '2px solid #1E293B',
        }}
        className="bg-stripes"
      >
        <div
          style={{
            maxWidth: '1080px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '48px',
            alignItems: 'flex-start',
          }}
        >
          {/* Left Column: Reassurance & Document Guidelines */}
          <div>
            <SectionBadge text="Confidential Intake" icon="🔒" variant="primary" />
            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(26px, 3.5vw, 36px)',
                fontWeight: 800,
                color: '#1E293B',
                margin: '12px 0 16px 0',
              }}
            >
              Begin Your Child’s Consultation
            </h2>

            <p style={{ color: '#475569', fontSize: '15px', lineHeight: 1.7, margin: '0 0 24px 0' }}>
              We understand that reaching out to a specialized school can feel overwhelming. Please know that this inquiry commits you to nothing. It simply opens a gentle conversation with our experienced staff.
            </p>

            <div
              className="neo-card"
              style={{
                padding: '24px',
                backgroundColor: '#FFFFFF',
                marginBottom: '24px',
              }}
            >
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: 800, margin: '0 0 12px 0', color: '#1E293B' }}>
                📋 What to Bring for Consultation:
              </h3>
              <ul style={{ margin: 0, paddingLeft: '20px', color: '#475569', fontSize: '14px', lineHeight: 1.7 }}>
                <li>Your child’s birth certificate or age proof.</li>
                <li>Any previous school diary, art samples, or routine notes.</li>
                <li>A list of your child’s favorite comfort objects and calming sensory items.</li>
                <li><strong>No medical or psychological diagnosis documents are required</strong> for this initial consultation.</li>
              </ul>
            </div>

            <div
              style={{
                padding: '16px 20px',
                backgroundColor: '#ECFDF5',
                border: '2px solid #1E293B',
                borderRadius: '12px',
                fontSize: '13px',
                color: '#065F46',
                fontWeight: 600,
                lineHeight: 1.5,
              }}
            >
              🛡️ <strong>Child Safeguarding Guarantee:</strong> Your information is stored privately and strictly accessible only by our senior pedagogical director. Zero clinical records are processed online.
            </div>
          </div>

          {/* Right Column: Admission Inquiry Form */}
          <div>
            <div
              className="neo-card"
              style={{
                padding: '36px',
                backgroundColor: '#FFFFFF',
              }}
            >
              <h3
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '22px',
                  fontWeight: 800,
                  margin: '0 0 6px 0',
                  color: '#1E293B',
                }}
              >
                Confidential Admission Inquiry
              </h3>
              <p style={{ fontSize: '13px', color: '#64748B', margin: '0 0 24px 0' }}>
                Please fill in the basic details below. All fields marked with * are required.
              </p>

              {feedback && (
                <div
                  role="alert"
                  style={{
                    padding: '14px 18px',
                    borderRadius: '8px',
                    marginBottom: '20px',
                    border: '2px solid #1E293B',
                    backgroundColor: feedback.success ? '#ECFDF5' : '#FFF1F2',
                    color: feedback.success ? '#065F46' : '#991B1B',
                    fontSize: '14px',
                    fontWeight: 700,
                    lineHeight: 1.5,
                  }}
                >
                  {feedback.message}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Honeypot Spam Trap */}
                <div style={{ display: 'none' }} aria-hidden="true">
                  <label htmlFor="admissions-hp">Leave empty</label>
                  <input
                    id="admissions-hp"
                    type="text"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                {/* Parent / Guardian Name */}
                <div style={{ marginBottom: '16px' }}>
                  <label
                    htmlFor="parent-name"
                    style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '6px', color: '#1E293B' }}
                  >
                    Parent / Guardian Full Name *
                  </label>
                  <input
                    id="parent-name"
                    type="text"
                    required
                    placeholder="e.g. Ramesh & Sangeeta Iyer"
                    value={formData.parent_name}
                    onChange={(e) => setFormData({ ...formData, parent_name: e.target.value })}
                    className="neo-input"
                  />
                </div>

                {/* Contact Email & Phone */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label
                      htmlFor="parent-email"
                      style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '6px', color: '#1E293B' }}
                    >
                      Email Address *
                    </label>
                    <input
                      id="parent-email"
                      type="email"
                      required
                      placeholder="parent@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="neo-input"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="parent-phone"
                      style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '6px', color: '#1E293B' }}
                    >
                      Phone Number *
                    </label>
                    <input
                      id="parent-phone"
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="neo-input"
                    />
                  </div>
                </div>

                {/* Child Name & Age */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label
                      htmlFor="child-name"
                      style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '6px', color: '#1E293B' }}
                    >
                      Child's First / Preferred Name *
                    </label>
                    <input
                      id="child-name"
                      type="text"
                      required
                      placeholder="e.g. Aarav"
                      value={formData.child_name}
                      onChange={(e) => setFormData({ ...formData, child_name: e.target.value })}
                      className="neo-input"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="child-age"
                      style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '6px', color: '#1E293B' }}
                    >
                      Child's Age (Years)
                    </label>
                    <input
                      id="child-age"
                      type="number"
                      min="2"
                      max="25"
                      placeholder="e.g. 6"
                      value={formData.child_age || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          child_age: e.target.value ? parseInt(e.target.value, 10) : null,
                        })
                      }
                      className="neo-input"
                    />
                  </div>
                </div>

                {/* Preferred Programme */}
                <div style={{ marginBottom: '16px' }}>
                  <label
                    htmlFor="preferred-program"
                    style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '6px', color: '#1E293B' }}
                  >
                    Pathway of Interest
                  </label>
                  <select
                    id="preferred-program"
                    value={formData.preferred_program || ''}
                    onChange={(e) => setFormData({ ...formData, preferred_program: e.target.value })}
                    className="neo-input"
                    style={{ backgroundColor: '#FFFFFF' }}
                  >
                    <option value="Early Intervention Pathway (Ages 3–6)">Early Intervention Pathway (Ages 3–6)</option>
                    <option value="Primary Foundation Pathway (Ages 7–11)">Primary Foundation Pathway (Ages 7–11)</option>
                    <option value="Life Skills & Functional Independence (Ages 12–16)">Life Skills & Functional Independence (Ages 12–16)</option>
                    <option value="Pre-Vocational Development Pathway (Ages 16+)">Pre-Vocational Development Pathway (Ages 16+)</option>
                    <option value="Need Guidance on Placement">Need Guidance from Director on Placement</option>
                  </select>
                </div>

                {/* Parent Notes & Comforts */}
                <div style={{ marginBottom: '24px' }}>
                  <label
                    htmlFor="parent-notes"
                    style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '6px', color: '#1E293B' }}
                  >
                    Sensory Comforts, Communication Preferences or Questions
                  </label>
                  <textarea
                    id="parent-notes"
                    rows={4}
                    placeholder="Tell us about what your child loves (music, animals, trains), what sensory environments soothe them, or any questions you have for our team..."
                    value={formData.notes || ''}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="neo-input"
                    style={{ resize: 'vertical' }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="neo-btn-primary"
                  style={{ width: '100%', fontSize: '16px', padding: '14px 24px' }}
                >
                  {isSubmitting ? 'Transmitting Confidential Inquiry...' : 'Submit Admission Inquiry →'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Direct Call Desk */}
      <section style={{ padding: '64px 24px', backgroundColor: '#FFFFFF', textAlign: 'center' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '28px', fontWeight: 800, marginBottom: '14px' }}>
            Prefer to Speak With an Educator First?
          </h2>
          <p style={{ color: '#475569', fontSize: '16px', lineHeight: 1.6, marginBottom: '24px' }}>
            Our admissions line is staffed Monday to Friday, 9:00 AM – 3:30 PM.
          </p>
          <Link to={ROUTES.PUBLIC.CONTACT} className="neo-btn-secondary">
            View Campus Contact Details &amp; Address &rarr;
          </Link>
        </div>
      </section>
    </div>
  );
};
