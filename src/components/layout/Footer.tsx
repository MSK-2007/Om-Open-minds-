import React from 'react';
import { Link } from 'react-router-dom';
import { APP_CONFIG, ROUTES } from '@/config/constants';
import { SectionBadge, Starburst } from '@/components/public/DecorativeStickers';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      role="contentinfo"
      aria-label="School Institutional Footer"
      style={{
        backgroundColor: '#FFFFFF',
        borderTop: '2px solid #1E293B',
        padding: '64px 24px 32px 24px',
        marginTop: 'auto',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative Background Elements */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '-20px',
          right: '5%',
          transform: 'rotate(12deg)',
          pointerEvents: 'none',
        }}
      >
        <Starburst color="#F472B6" size={54} />
      </div>

      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
        }}
      >
        {/* Top Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '40px',
            marginBottom: '48px',
          }}
        >
          {/* Column 1: School Identity */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: '#8B5CF6',
                  border: '2px solid #1E293B',
                  boxShadow: '2px 2px 0px #1E293B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  fontWeight: 900,
                  fontSize: '18px',
                  fontFamily: 'var(--font-heading)',
                }}
              >
                OM
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '22px',
                  fontWeight: 800,
                  color: '#1E293B',
                }}
              >
                {APP_CONFIG.name}
              </span>
            </div>

            <p style={{ color: '#475569', fontSize: '14px', lineHeight: 1.6, marginBottom: '20px' }}>
              Specialized education, developmental therapy, and joyful community for children with autism, developmental delays, and diverse learning needs.
            </p>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <SectionBadge text="Ages 3–18+" variant="primary" />
              <SectionBadge text="1:4 Max Ratio" variant="secondary" />
              <SectionBadge text="Sensory-Safe" variant="quaternary" />
            </div>
          </div>

          {/* Column 2: Educational Pathways */}
          <div>
            <h3
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '16px',
                fontWeight: 800,
                color: '#1E293B',
                marginBottom: '16px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Development Pathways
            </h3>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li>
                <Link to={ROUTES.PUBLIC.PROGRAMMES} style={{ color: '#475569', fontSize: '14px', textDecoration: 'none' }}>
                  Early Intervention (Ages 3–6)
                </Link>
              </li>
              <li>
                <Link to={ROUTES.PUBLIC.PROGRAMMES} style={{ color: '#475569', fontSize: '14px', textDecoration: 'none' }}>
                  Primary Foundation (Ages 7–11)
                </Link>
              </li>
              <li>
                <Link to={ROUTES.PUBLIC.PROGRAMMES} style={{ color: '#475569', fontSize: '14px', textDecoration: 'none' }}>
                  Life Skills & Independence (Ages 12–16)
                </Link>
              </li>
              <li>
                <Link to={ROUTES.PUBLIC.PROGRAMMES} style={{ color: '#475569', fontSize: '14px', textDecoration: 'none' }}>
                  Pre-Vocational Development (Ages 16+)
                </Link>
              </li>
              <li>
                <Link to={ROUTES.PUBLIC.OUR_APPROACH} style={{ color: '#8B5CF6', fontSize: '14px', fontWeight: 700 }}>
                  Our Multidisciplinary Approach &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Quick Navigation */}
          <div>
            <h3
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '16px',
                fontWeight: 800,
                color: '#1E293B',
                marginBottom: '16px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              School Navigation
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <Link to={ROUTES.PUBLIC.ABOUT} style={{ color: '#475569', fontSize: '14px' }}>About Us</Link>
              <Link to={ROUTES.PUBLIC.FACILITIES} style={{ color: '#475569', fontSize: '14px' }}>Facilities</Link>
              <Link to={ROUTES.PUBLIC.OUR_TEAM} style={{ color: '#475569', fontSize: '14px' }}>Our Team</Link>
              <Link to={ROUTES.PUBLIC.ACTIVITIES} style={{ color: '#475569', fontSize: '14px' }}>Activities</Link>
              <Link to={ROUTES.PUBLIC.GALLERY} style={{ color: '#475569', fontSize: '14px' }}>Gallery</Link>
              <Link to={ROUTES.PUBLIC.ADMISSIONS} style={{ color: '#475569', fontSize: '14px' }}>Admissions</Link>
              <Link to={ROUTES.PUBLIC.PARENT_RESOURCES} style={{ color: '#475569', fontSize: '14px' }}>Resources</Link>
              <Link to={ROUTES.PUBLIC.CONTACT} style={{ color: '#475569', fontSize: '14px' }}>Contact</Link>
            </div>
          </div>

          {/* Column 4: Visiting Hours & Intake */}
          <div>
            <div
              className="neo-card"
              style={{
                padding: '20px',
                backgroundColor: '#FFFDF5',
              }}
            >
              <span className="neo-badge neo-badge-quaternary" style={{ marginBottom: '10px' }}>
                Visit Campus
              </span>
              <p style={{ margin: '0 0 6px 0', fontWeight: 700, fontSize: '14px', color: '#1E293B' }}>
                Quiet Hour Walkthroughs
              </p>
              <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: '#64748B', lineHeight: 1.5 }}>
                Mon – Fri: 9:00 AM – 3:30 PM<br />
                Sat: By appointment only
              </p>
              <Link
                to={ROUTES.PUBLIC.ADMISSIONS}
                className="neo-btn-primary"
                style={{ width: '100%', fontSize: '13px', padding: '10px 16px', textAlign: 'center' }}
              >
                Book Intake Consultation
              </Link>
            </div>
          </div>
        </div>

        {/* Safeguarding & Privacy Pledge Banner */}
        <div
          style={{
            border: '2px solid #1E293B',
            borderRadius: '16px',
            backgroundColor: '#F1F5F9',
            padding: '16px 20px',
            marginBottom: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            fontSize: '13px',
            color: '#475569',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '20px' }}>🛡️</span>
            <span>
              <strong>Child Safeguarding & Dignity First:</strong> Documented parental release consent is required for all student imagery. Zero medical diagnostics or psychological evaluations are stored or processed on the public web.
            </span>
          </div>
          <Link
            to={ROUTES.ADMIN.LOGIN}
            style={{
              fontWeight: 700,
              color: '#1E293B',
              textDecoration: 'underline',
              flexShrink: 0,
            }}
          >
            Staff Portal Login &rarr;
          </Link>
        </div>

        {/* Bottom Strip */}
        <div
          style={{
            borderTop: '1px solid #E2E8F0',
            paddingTop: '24px',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px',
            fontSize: '13px',
            color: '#64748B',
          }}
        >
          <p style={{ margin: 0 }}>
            &copy; {currentYear} {APP_CONFIG.name}. Dedicated to inclusive special education and lifelong dignity.
          </p>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#34D399' }} />
              <span>WCAG 2.2 AA Verified</span>
            </span>
            <span>•</span>
            <Link to={ROUTES.PUBLIC.CONTACT} style={{ textDecoration: 'underline' }}>
              Accessibility Arrival Guide
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
