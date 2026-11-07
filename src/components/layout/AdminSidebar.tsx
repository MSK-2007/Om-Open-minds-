import React from 'react';
import { NavLink } from 'react-router-dom';
import { ROUTES } from '@/config/constants';

/**
 * Admin Sidebar Navigation Component.
 * Semantic <nav> landmark for administrative panel links.
 */
export const AdminSidebar: React.FC = () => {
  const adminLinks = [
    { label: 'Dashboard Overview', path: ROUTES.ADMIN.DASHBOARD },
  ];

  return (
    <aside
      style={{
        width: '240px',
        backgroundColor: '#1e293b',
        color: '#f8fafc',
        borderRight: '1px solid #334155',
        padding: '24px 16px',
        minHeight: 'calc(100vh - 57px)',
      }}
    >
      <nav aria-label="Admin Navigation">
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {adminLinks.map((link) => (
            <li key={link.path}>
              <NavLink
                to={link.path}
                style={({ isActive }) => ({
                  display: 'block',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: isActive ? 600 : 400,
                  backgroundColor: isActive ? '#334155' : 'transparent',
                  color: isActive ? '#38bdf8' : '#cbd5e1',
                })}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

