import React from 'react';
import { NavLink } from 'react-router-dom';
import { ROUTES, APP_CONFIG } from '@/config/constants';

/**
 * Public Header Component.
 * Semantic <header> containing accessible navigation landmark.
 * Full navigation taxonomy matching finalized Phase 2 sitemap.
 */
export const Header: React.FC = () => {
  const navItems = [
    { label: 'Home', path: ROUTES.PUBLIC.HOME },
    { label: 'About Us', path: ROUTES.PUBLIC.ABOUT },
    { label: 'Programmes', path: ROUTES.PUBLIC.PROGRAMMES },
    { label: 'Our Approach', path: ROUTES.PUBLIC.OUR_APPROACH },
    { label: 'Facilities', path: ROUTES.PUBLIC.FACILITIES },
    { label: 'Our Team', path: ROUTES.PUBLIC.OUR_TEAM },
    { label: 'Activities & Events', path: ROUTES.PUBLIC.ACTIVITIES },
    { label: 'Gallery', path: ROUTES.PUBLIC.GALLERY },
    { label: 'Admissions', path: ROUTES.PUBLIC.ADMISSIONS },
    { label: 'Parent Resources', path: ROUTES.PUBLIC.PARENT_RESOURCES },
    { label: 'Contact Us', path: ROUTES.PUBLIC.CONTACT },
  ];

  return (
    <header
      style={{
        borderBottom: '1px solid #e2e8f0',
        backgroundColor: '#ffffff',
        padding: '16px 24px',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}
      >
        <div>
          <NavLink
            to={ROUTES.PUBLIC.HOME}
            style={{
              textDecoration: 'none',
              color: '#0f172a',
              fontSize: '20px',
              fontWeight: 700,
              display: 'block',
            }}
          >
            {APP_CONFIG.name}
          </NavLink>
          <span style={{ fontSize: '12px', color: '#64748b' }}>
            {APP_CONFIG.tagline}
          </span>
        </div>

        <nav aria-label="Main Navigation">
          <ul
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              listStyle: 'none',
              gap: '12px',
              margin: 0,
              padding: 0,
              alignItems: 'center',
            }}
          >
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  style={({ isActive }) => ({
                    textDecoration: 'none',
                    fontSize: '13px',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? '#0284c7' : '#334155',
                    borderBottom: isActive ? '2px solid #0284c7' : '2px solid transparent',
                    paddingBottom: '2px',
                  })}
                  end={item.path === ROUTES.PUBLIC.HOME}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
            <li>
              <NavLink
                to={ROUTES.ADMIN.LOGIN}
                style={{
                  textDecoration: 'none',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#475569',
                  padding: '4px 10px',
                  border: '1px solid #cbd5e1',
                  borderRadius: '4px',
                  backgroundColor: '#f8fafc',
                }}
              >
                Staff Portal
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};
