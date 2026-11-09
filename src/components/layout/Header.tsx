import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { ROUTES, APP_CONFIG } from '@/config/constants';
import { NoticeTicker } from '@/components/public/NoticeTicker';

export const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu whenever location changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navItems = [
    { label: 'Home', path: ROUTES.PUBLIC.HOME },
    { label: 'About', path: ROUTES.PUBLIC.ABOUT },
    { label: 'Programmes', path: ROUTES.PUBLIC.PROGRAMMES },
    { label: 'Our Approach', path: ROUTES.PUBLIC.OUR_APPROACH },
    { label: 'Facilities', path: ROUTES.PUBLIC.FACILITIES },
    { label: 'Our Team', path: ROUTES.PUBLIC.OUR_TEAM },
    { label: 'Activities', path: ROUTES.PUBLIC.ACTIVITIES },
    { label: 'Gallery', path: ROUTES.PUBLIC.GALLERY },
    { label: 'Admissions', path: ROUTES.PUBLIC.ADMISSIONS },
    { label: 'Parent Resources', path: ROUTES.PUBLIC.PARENT_RESOURCES },
    { label: 'Contact', path: ROUTES.PUBLIC.CONTACT },
  ];

  return (
    <>
      {/* Top Announcement Bar */}
      <NoticeTicker />

      {/* Main Navigation Header */}
      <header
        style={{
          backgroundColor: '#FFFDF5',
          borderBottom: '2px solid #1E293B',
          position: 'sticky',
          top: 0,
          zIndex: 40,
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '12px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
          }}
        >
          {/* Logo & School Name */}
          <Link
            to={ROUTES.PUBLIC.HOME}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              textDecoration: 'none',
              color: '#1E293B',
            }}
            aria-label={`${APP_CONFIG.name} Homepage`}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                backgroundColor: '#8B5CF6',
                border: '2px solid #1E293B',
                boxShadow: '2px 2px 0px #1E293B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                fontWeight: 900,
                fontSize: '20px',
                fontFamily: 'var(--font-heading)',
              }}
              aria-hidden="true"
            >
              OM
            </div>
            <div>
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '20px',
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  display: 'block',
                  lineHeight: 1.1,
                  color: '#1E293B',
                }}
              >
                OM OPEN MINDS
              </span>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#64748B',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                }}
              >
                Specialized Education
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            aria-label="Primary Navigation"
            style={{
              display: 'none',
            }}
            className="desktop-nav"
          >
            <ul
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                listStyle: 'none',
                margin: 0,
                padding: 0,
              }}
            >
              {navItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    end={item.path === ROUTES.PUBLIC.HOME}
                    style={({ isActive }) => ({
                      display: 'inline-block',
                      padding: '6px 12px',
                      borderRadius: '9999px',
                      fontSize: '13px',
                      fontWeight: 700,
                      fontFamily: 'var(--font-heading)',
                      color: isActive ? '#FFFFFF' : '#1E293B',
                      backgroundColor: isActive ? '#8B5CF6' : 'transparent',
                      border: isActive ? '1.5px solid #1E293B' : '1.5px solid transparent',
                      boxShadow: isActive ? '2px 2px 0px #1E293B' : 'none',
                      transition: 'all 0.15s ease',
                      textDecoration: 'none',
                    })}
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Header Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link
              to={ROUTES.PUBLIC.ADMISSIONS}
              className="neo-btn-primary"
              style={{
                padding: '8px 18px',
                fontSize: '13px',
                minHeight: '40px',
                display: 'none',
              }}
              id="desktop-cta"
            >
              <span>Book Consultation</span>
              <span aria-hidden="true">&rarr;</span>
            </Link>

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-nav-menu"
              aria-label={isMobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                backgroundColor: isMobileMenuOpen ? '#F472B6' : '#FFFFFF',
                border: '2px solid #1E293B',
                boxShadow: '2px 2px 0px #1E293B',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
                cursor: 'pointer',
              }}
            >
              <span
                style={{
                  width: '20px',
                  height: '2px',
                  backgroundColor: '#1E293B',
                  transform: isMobileMenuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none',
                  transition: 'transform 0.2s ease',
                }}
              />
              <span
                style={{
                  width: '20px',
                  height: '2px',
                  backgroundColor: '#1E293B',
                  opacity: isMobileMenuOpen ? 0 : 1,
                  transition: 'opacity 0.2s ease',
                }}
              />
              <span
                style={{
                  width: '20px',
                  height: '2px',
                  backgroundColor: '#1E293B',
                  transform: isMobileMenuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none',
                  transition: 'transform 0.2s ease',
                }}
              />
            </button>
          </div>
        </div>

        {/* Mobile Slide-down Drawer */}
        {isMobileMenuOpen && (
          <nav
            id="mobile-nav-menu"
            aria-label="Mobile Navigation Drawer"
            style={{
              backgroundColor: '#FFFDF5',
              borderTop: '2px solid #1E293B',
              padding: '20px 24px 28px 24px',
              boxShadow: '0px 10px 0px rgba(30, 41, 59, 0.1)',
            }}
          >
            <ul
              style={{
                listStyle: 'none',
                margin: '0 0 20px 0',
                padding: 0,
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                gap: '10px',
              }}
            >
              {navItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    end={item.path === ROUTES.PUBLIC.HOME}
                    style={({ isActive }) => ({
                      display: 'block',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      fontSize: '14px',
                      fontWeight: 700,
                      fontFamily: 'var(--font-heading)',
                      color: isActive ? '#FFFFFF' : '#1E293B',
                      backgroundColor: isActive ? '#8B5CF6' : '#FFFFFF',
                      border: '2px solid #1E293B',
                      boxShadow: isActive ? '3px 3px 0px #1E293B' : '2px 2px 0px #1E293B',
                      textAlign: 'center',
                    })}
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Link
                to={ROUTES.PUBLIC.ADMISSIONS}
                className="neo-btn-primary"
                style={{ flex: 1, textAlign: 'center' }}
              >
                Inquire for Admission &rarr;
              </Link>
              <Link
                to={ROUTES.ADMIN.LOGIN}
                className="neo-btn-secondary"
                style={{ fontSize: '13px', padding: '10px 16px' }}
              >
                Staff Portal
              </Link>
            </div>
          </nav>
        )}
      </header>

      {/* Responsive Header CSS */}
      <style>{`
        @media (min-width: 1080px) {
          .desktop-nav {
            display: block !important;
          }
          #desktop-cta {
            display: inline-flex !important;
          }
        }
      `}</style>
    </>
  );
};
