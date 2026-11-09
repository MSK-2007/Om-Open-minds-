import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/config/constants';
import { galleryService } from '@/services/supabase/gallery.service';
import { GalleryItem, GalleryCategory } from '@/types/database.types';
import { FALLBACK_GALLERY } from '@/data/curatedFallbackData';
import { SectionBadge, Squiggle } from '@/components/public/DecorativeStickers';
import { Modal } from '@/components/common/Modal';

export const GalleryPage: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>(FALLBACK_GALLERY);
  const [categories, setCategories] = useState<GalleryCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeModalItem, setActiveModalItem] = useState<GalleryItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadGallery() {
      setIsLoading(true);
      try {
        const [itemsRes, catsRes] = await Promise.all([
          galleryService.getPublishedGalleryItems(),
          galleryService.getGalleryCategories(),
        ]);

        if (isMounted) {
          if (itemsRes.data && itemsRes.data.length > 0) setItems(itemsRes.data);
          if (catsRes.data && catsRes.data.length > 0) setCategories(catsRes.data);
        }
      } catch {
        // Fallback maintained
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadGallery();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredItems = items.filter(
    (item) => selectedCategory === 'all' || item.category_id === selectedCategory
  );

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
          <SectionBadge text="Joyful Moments" icon="📸" variant="quaternary" style={{ marginBottom: '16px' }} />
          <h1
            style={{
              fontSize: 'clamp(32px, 5vw, 48px)',
              fontWeight: 800,
              color: '#1E293B',
              margin: '0 0 16px 0',
              fontFamily: 'var(--font-heading)',
            }}
          >
            Campus Moments &amp;{' '}
            <span style={{ color: '#8B5CF6', position: 'relative', display: 'inline-block' }}>
              Sensory Spaces
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
            A visual reflection of our sensory rooms, collaborative learning tables, outdoor horticulture gardens, and joyful student celebrations.
          </p>

          {/* Child Safeguarding Banner */}
          <div
            style={{
              marginTop: '28px',
              padding: '12px 20px',
              backgroundColor: '#ECFDF5',
              border: '2px solid #1E293B',
              borderRadius: '9999px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13px',
              fontWeight: 700,
              color: '#065F46',
              boxShadow: '3px 3px 0px #1E293B',
            }}
          >
            <span>🛡️ Child Privacy Protection:</span>
            <span>100% Documented Parental Consent Verified</span>
          </div>

          {/* Category Filter Tabs */}
          {categories.length > 0 && (
            <div
              style={{
                display: 'flex',
                gap: '8px',
                justifyContent: 'center',
                flexWrap: 'wrap',
                marginTop: '32px',
              }}
            >
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                style={{
                  padding: '8px 18px',
                  borderRadius: '9999px',
                  fontSize: '13px',
                  fontWeight: 700,
                  border: '2px solid #1E293B',
                  boxShadow: selectedCategory === 'all' ? '3px 3px 0px #1E293B' : 'none',
                  backgroundColor: selectedCategory === 'all' ? '#8B5CF6' : '#FFFFFF',
                  color: selectedCategory === 'all' ? '#FFFFFF' : '#1E293B',
                  cursor: 'pointer',
                }}
              >
                All Albums ({items.length})
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '9999px',
                    fontSize: '13px',
                    fontWeight: 700,
                    border: '2px solid #1E293B',
                    boxShadow: selectedCategory === cat.id ? '3px 3px 0px #1E293B' : 'none',
                    backgroundColor: selectedCategory === cat.id ? '#8B5CF6' : '#FFFFFF',
                    color: selectedCategory === cat.id ? '#FFFFFF' : '#1E293B',
                    cursor: 'pointer',
                  }}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Gallery Items Grid */}
      <section
        style={{
          padding: '80px 24px',
          backgroundColor: '#FFFFFF',
          borderBottom: '2px solid #1E293B',
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          {isLoading && (
            <div style={{ textAlign: 'center', padding: '40px', color: '#64748B' }}>
              Loading media gallery...
            </div>
          )}

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '28px',
            }}
          >
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="neo-card neo-card-interactive"
                style={{
                  overflow: 'hidden',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: '#FFFFFF',
                }}
                onClick={() => setActiveModalItem(item)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActiveModalItem(item);
                  }
                }}
                aria-label={`View photo: ${item.title}`}
              >
                <div style={{ position: 'relative', height: '260px' }}>
                  <img
                    src={item.image_url}
                    alt={item.alt_text}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <span
                    className="neo-badge neo-badge-tertiary"
                    style={{
                      position: 'absolute',
                      bottom: '12px',
                      right: '12px',
                      fontSize: '11px',
                    }}
                  >
                    Click to Inspect 🔍
                  </span>
                </div>

                <div style={{ padding: '20px', borderTop: '2px solid #1E293B' }}>
                  <h3
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '18px',
                      fontWeight: 800,
                      color: '#1E293B',
                      margin: '0 0 6px 0',
                    }}
                  >
                    {item.title}
                  </h3>
                  <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.5, margin: 0 }}>
                    {item.alt_text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Accessible Photo Inspection Modal */}
      {activeModalItem && (
        <Modal
          isOpen={Boolean(activeModalItem)}
          onClose={() => setActiveModalItem(null)}
          title={activeModalItem.title}
          maxWidth="720px"
        >
          <div>
            <div
              style={{
                borderRadius: '12px',
                border: '2px solid #1E293B',
                overflow: 'hidden',
                marginBottom: '20px',
                backgroundColor: '#F1F5F9',
              }}
            >
              <img
                src={activeModalItem.image_url}
                alt={activeModalItem.alt_text}
                style={{ width: '100%', maxHeight: '460px', objectFit: 'contain', display: 'block' }}
              />
            </div>

            <div style={{ padding: '12px 16px', backgroundColor: '#FFFDF5', borderRadius: '8px', border: '1.5px solid #1E293B', marginBottom: '16px' }}>
              <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#1E293B', margin: '0 0 4px 0', textTransform: 'uppercase' }}>
                WCAG Descriptive Alt Text:
              </h4>
              <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                {activeModalItem.alt_text}
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <span className="neo-badge neo-badge-quaternary">
                ✓ Documented Parental Release on File
              </span>
              <button
                type="button"
                onClick={() => setActiveModalItem(null)}
                className="neo-btn-secondary"
                style={{ fontSize: '13px', padding: '6px 14px' }}
              >
                Close View
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* CTA Footer */}
      <section style={{ padding: '64px 24px', backgroundColor: '#FFFDF5', textAlign: 'center' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '32px', fontWeight: 800, marginBottom: '16px' }}>
            Would You Like to See Our Campus in Person?
          </h2>
          <p style={{ color: '#475569', fontSize: '16px', lineHeight: 1.6, marginBottom: '28px' }}>
            Nothing replaces the feeling of walking through our calm suites and seeing children thriving in real time.
          </p>
          <Link to={ROUTES.PUBLIC.ADMISSIONS} className="neo-btn-primary">
            Schedule a Private Walkthrough &rarr;
          </Link>
        </div>
      </section>
    </div>
  );
};
