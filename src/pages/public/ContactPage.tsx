import React, { useState } from 'react';
import { enquiriesService, CreateContactEnquiryInput } from '@/services/supabase/enquiries.service';
import { SectionBadge, Squiggle } from '@/components/public/DecorativeStickers';

export const ContactPage: React.FC = () => {
  const [form, setForm] = useState<CreateContactEnquiryInput>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    status: 'unread',
  });
  const [honeypot, setHoneypot] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    const result = await enquiriesService.submitContactEnquiry(form, honeypot);
    setIsSubmitting(false);

    if (result.success) {
      setFeedback({
        success: true,
        message: 'Thank you for reaching out to OM OPEN MINDS. A member of our administration will review your message and reply promptly within 1-2 business days.',
      });
      setForm({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        status: 'unread',
      });
    } else {
      setFeedback({
        success: false,
        message: result.error?.message || 'Could not deliver your message at this time. Please call our campus directly.',
      });
    }
  };

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
          <SectionBadge text="Get in Touch" icon="📬" variant="primary" style={{ marginBottom: '16px' }} />
          <h1
            style={{
              fontSize: 'clamp(32px, 5vw, 48px)',
              fontWeight: 800,
              color: '#1E293B',
              margin: '0 0 16px 0',
              fontFamily: 'var(--font-heading)',
            }}
          >
            Contact &amp; Campus{' '}
            <span style={{ color: '#8B5CF6', position: 'relative', display: 'inline-block' }}>
              Directions
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
            Our administration desk is happy to answer inquiries from prospective families, educators, and allied developmental healthcare partners.
          </p>
        </div>
      </section>

      {/* Main Grid: Info & Form */}
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
          }}
        >
          {/* Left Column: Campus Info & Accessibility Arrival Guide */}
          <div>
            <div
              className="neo-card"
              style={{
                padding: '32px',
                backgroundColor: '#FFFDF5',
                marginBottom: '28px',
              }}
            >
              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '24px',
                  fontWeight: 800,
                  color: '#1E293B',
                  margin: '0 0 16px 0',
                }}
              >
                Campus Location
              </h2>

              <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.7, margin: '0 0 20px 0' }}>
                <strong>OM OPEN MINDS Specialized School</strong><br />
                Child Development &amp; Learning Complex<br />
                Main Campus Boulevard • Karnataka, India
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderTop: '2px solid #E2E8F0', paddingTop: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '18px' }}>📞</span>
                  <div>
                    <span style={{ fontSize: '12px', color: '#64748B', display: 'block' }}>Admissions &amp; Reception Desk</span>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#1E293B' }}>+91 98765 43210 / +91 80 2345 6789</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '18px' }}>✉️</span>
                  <div>
                    <span style={{ fontSize: '12px', color: '#64748B', display: 'block' }}>Official Email</span>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#1E293B' }}>admissions@omopenminds.edu</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Accessibility Arrival Guide Card */}
            <div
              className="neo-card"
              style={{
                padding: '32px',
                backgroundColor: '#F5F3FF',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span className="neo-badge neo-badge-primary">Universal Access</span>
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
                Accessibility Arrival Guide
              </h3>

              <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.6, margin: '0 0 16px 0' }}>
                Visiting a new school can cause anticipation anxiety for neurodivergent children. Here is what to expect upon arrival:
              </p>

              <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: '#475569', lineHeight: 1.7 }}>
                <li><strong>Dedicated Drop-Off Bay:</strong> Wide, curb-free vehicle drop-off right at our main entrance.</li>
                <li><strong>Zero-Step Entrance:</strong> Gentle ramps with tactile guide paths at all doors.</li>
                <li><strong>Sensory-Friendly Intake Lounge:</strong> Dimmable lights, quiet waiting pod, tactile squeeze toys, and calm ambient background.</li>
                <li><strong>Quiet Hours:</strong> Parent walk-ins during observation hours (10:00 AM – 12:00 PM) are kept low-noise.</li>
              </ul>
            </div>
          </div>

          {/* Right Column: Contact Message Form */}
          <div>
            <div
              className="neo-card"
              style={{
                padding: '36px',
                backgroundColor: '#FFFFFF',
              }}
            >
              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '24px',
                  fontWeight: 800,
                  color: '#1E293B',
                  margin: '0 0 8px 0',
                }}
              >
                Send Us a Message
              </h2>
              <p style={{ fontSize: '14px', color: '#64748B', margin: '0 0 24px 0' }}>
                Fill out the form below and our staff will respond directly to your email or telephone.
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
                  <label htmlFor="contact-hp">Leave empty</label>
                  <input
                    id="contact-hp"
                    type="text"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label
                    htmlFor="general-name"
                    style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '6px', color: '#1E293B' }}
                  >
                    Your Name *
                  </label>
                  <input
                    id="general-name"
                    type="text"
                    required
                    placeholder="e.g. Ananya Roy"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="neo-input"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label
                      htmlFor="general-email"
                      style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '6px', color: '#1E293B' }}
                    >
                      Email Address *
                    </label>
                    <input
                      id="general-email"
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="neo-input"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="general-phone"
                      style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '6px', color: '#1E293B' }}
                    >
                      Phone Number (Optional)
                    </label>
                    <input
                      id="general-phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={form.phone || ''}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="neo-input"
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label
                    htmlFor="general-subject"
                    style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '6px', color: '#1E293B' }}
                  >
                    Subject *
                  </label>
                  <input
                    id="general-subject"
                    type="text"
                    required
                    placeholder="e.g. Question regarding therapy co-teaching / Campus visit"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="neo-input"
                  />
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label
                    htmlFor="general-message"
                    style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '6px', color: '#1E293B' }}
                  >
                    Message *
                  </label>
                  <textarea
                    id="general-message"
                    required
                    rows={5}
                    placeholder="Please write your inquiry here..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
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
                  {isSubmitting ? 'Transmitting Message...' : 'Send Message →'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
