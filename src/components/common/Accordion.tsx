import React, { useState, useId } from 'react';

export interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  defaultOpenIds?: string[];
  className?: string;
}

/**
 * Accessible Accordion / Disclosure Component.
 * Implements WAI-ARIA Accordion Pattern (WCAG 2.2 AA).
 * - Trigger button has explicit aria-expanded and aria-controls.
 * - Panel has role="region" and aria-labelledby pointing to the trigger button.
 * - Keyboard accessible with native button Tab and Enter/Space activation.
 */
export const Accordion: React.FC<AccordionProps> = ({
  items,
  allowMultiple = false,
  defaultOpenIds = [],
}) => {
  const baseId = useId();
  const [openIds, setOpenIds] = useState<string[]>(defaultOpenIds);

  const toggleItem = (itemId: string) => {
    setOpenIds((prev) => {
      if (prev.includes(itemId)) {
        return prev.filter((id) => id !== itemId);
      }
      return allowMultiple ? [...prev, itemId] : [itemId];
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
      {items.map((item, index) => {
        const isOpen = openIds.includes(item.id);
        const headerId = `${baseId}-header-${index}`;
        const panelId = `${baseId}-panel-${index}`;

        return (
          <div
            key={item.id}
            style={{
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              backgroundColor: '#ffffff',
              overflow: 'hidden',
            }}
          >
            <h3 style={{ margin: 0, padding: 0, fontSize: 'inherit', fontWeight: 'inherit' }}>
              <button
                type="button"
                id={headerId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggleItem(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: '14px 18px',
                  backgroundColor: isOpen ? '#f8fafc' : '#ffffff',
                  border: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  fontSize: '15px',
                  fontWeight: 600,
                  color: '#0f172a',
                  transition: 'background-color 0.15s ease',
                }}
              >
                <span>{item.title}</span>
                <span
                  aria-hidden="true"
                  style={{
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: '#64748b',
                    marginLeft: '12px',
                    transform: isOpen ? 'rotate(180deg)' : 'none',
                    transition: 'transform 0.15s ease',
                  }}
                >
                  ▾
                </span>
              </button>
            </h3>

            <div
              id={panelId}
              role="region"
              aria-labelledby={headerId}
              hidden={!isOpen}
              style={{
                display: isOpen ? 'block' : 'none',
                padding: '16px 18px',
                borderTop: '1px solid #e2e8f0',
                backgroundColor: '#ffffff',
                color: '#334155',
                fontSize: '14px',
                lineHeight: 1.6,
              }}
            >
              {item.content}
            </div>
          </div>
        );
      })}
    </div>
  );
};

