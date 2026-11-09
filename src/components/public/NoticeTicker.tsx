import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { announcementsService } from '@/services/supabase/announcements.service';
import { Announcement } from '@/types/database.types';
import { FALLBACK_ANNOUNCEMENTS } from '@/data/curatedFallbackData';

export const NoticeTicker: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>(FALLBACK_ANNOUNCEMENTS);

  useEffect(() => {
    let isMounted = true;
    async function fetchNotices() {
      try {
        const { data, error } = await announcementsService.getActiveAnnouncements();
        if (!error && data && data.length > 0 && isMounted) {
          setAnnouncements(data);
        }
      } catch {
        // Fallback maintained
      }
    }
    fetchNotices();
    return () => {
      isMounted = false;
    };
  }, []);

  if (!announcements || announcements.length === 0) return null;

  return (
    <div
      role="region"
      aria-label="School Announcements & Notice Ticker"
      style={{
        backgroundColor: '#FBBF24',
        borderBottom: '2px solid #1E293B',
        color: '#1E293B',
        fontSize: '13px',
        fontWeight: 700,
        padding: '8px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        position: 'relative',
        zIndex: 50,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          maxWidth: '1280px',
          width: '100%',
          justifyContent: 'space-between',
          flexWrap: 'nowrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <span
            style={{
              backgroundColor: '#1E293B',
              color: '#FFFDF5',
              borderRadius: '4px',
              padding: '2px 8px',
              fontSize: '11px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Notice
          </span>
        </div>

        <div style={{ overflow: 'hidden', flex: 1, margin: '0 12px' }}>
          <div className="marquee-container">
            <div className="marquee-content" style={{ gap: '48px' }}>
              {announcements.concat(announcements).map((item, index) => (
                <span
                  key={`${item.id}-${index}`}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                >
                  <span>✦</span>
                  {item.link_url ? (
                    <Link
                      to={item.link_url}
                      style={{
                        textDecoration: 'underline',
                        color: '#1E293B',
                        transition: 'opacity 0.15s ease',
                      }}
                    >
                      {item.title}
                    </Link>
                  ) : (
                    <span>{item.title}</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>

        <Link
          to="/activities"
          style={{
            fontSize: '12px',
            textDecoration: 'underline',
            fontWeight: 800,
            flexShrink: 0,
            color: '#1E293B',
          }}
        >
          View All &rarr;
        </Link>
      </div>
    </div>
  );
};

