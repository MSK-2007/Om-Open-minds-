import React from 'react';
import { NavLink } from 'react-router-dom';
import { ROUTES } from '@/config/constants';

interface NavGroup {
  label: string;
  items: { label: string; path: string; icon?: string }[];
}

export const AdminSidebar: React.FC = () => {
  const navGroups: NavGroup[] = [
    {
      label: 'Overview',
      items: [
        { label: 'Dashboard', path: ROUTES.ADMIN.DASHBOARD },
      ],
    },
    {
      label: 'Family & Enquiries',
      items: [
        { label: 'Admissions Intake', path: ROUTES.ADMIN.ADMISSIONS },
        { label: 'Contact Messages', path: ROUTES.ADMIN.CONTACT },
      ],
    },
    {
      label: 'Educational Content',
      items: [
        { label: 'Programmes', path: ROUTES.ADMIN.PROGRAMMES },
        { label: 'Campus Facilities', path: ROUTES.ADMIN.FACILITIES },
        { label: 'Faculty & Team', path: ROUTES.ADMIN.TEAM },
        { label: 'Activities & Events', path: ROUTES.ADMIN.ACTIVITIES },
      ],
    },
    {
      label: 'Updates & Media',
      items: [
        { label: 'Announcements', path: ROUTES.ADMIN.ANNOUNCEMENTS },
        { label: 'Gallery & Media', path: ROUTES.ADMIN.GALLERY },
        { label: 'Parent Resources', path: ROUTES.ADMIN.RESOURCES },
      ],
    },
    {
      label: 'Administration',
      items: [
        { label: 'Website Settings', path: ROUTES.ADMIN.SETTINGS },
      ],
    },
  ];

  return (
    <aside
      style={{
        width: '260px',
        backgroundColor: '#0f172a',
        color: '#f8fafc',
        borderRight: '1px solid #1e293b',
        padding: '20px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        flexShrink: 0,
      }}
    >
      <nav aria-label="Admin Navigation">
        {navGroups.map((group) => (
          <div key={group.label} style={{ marginBottom: '16px' }}>
            <div
              style={{
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: '#64748b',
                padding: '0 12px 6px 12px',
              }}
            >
              {group.label}
            </div>
            <ul
              style={{
                listStyle: 'none',
                margin: 0,
                padding: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
              }}
            >
              {group.items.map((link) => (
                <li key={link.path}>
                  <NavLink
                    to={link.path}
                    style={({ isActive }) => ({
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      textDecoration: 'none',
                      fontSize: '13px',
                      fontWeight: isActive ? 600 : 400,
                      backgroundColor: isActive ? '#1e293b' : 'transparent',
                      color: isActive ? '#38bdf8' : '#94a3b8',
                      borderLeft: isActive ? '3px solid #38bdf8' : '3px solid transparent',
                      transition: 'background-color 0.15s, color 0.15s',
                    })}
                  >
                    <span>{link.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
};
