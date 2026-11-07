import React from 'react';

/**
 * Accessibility utility functions and keyboard navigation helpers.
 * Follows WCAG 2.1 AA conventions.
 */

/**
 * Checks whether a keyboard event corresponds to an activation key (Enter or Space).
 * Useful for making custom interactive elements accessible when semantic buttons cannot be used.
 */
export function isActivationKey(event: React.KeyboardEvent): boolean {
  return event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar';
}

/**
 * Generate a unique accessible ID with a readable prefix.
 */
let counter = 0;
export function generateAccessibleId(prefix = 'a11y'): string {
  counter += 1;
  return `${prefix}-${counter}-${Date.now().toString(36)}`;
}

/**
 * Announce a message to screen readers via a dynamic ARIA live region.
 */
export function announceToScreenReader(message: string, politeness: 'polite' | 'assertive' = 'polite'): void {
  const existingAnnouncer = document.getElementById('a11y-live-announcer');
  
  if (existingAnnouncer) {
    existingAnnouncer.setAttribute('aria-live', politeness);
    existingAnnouncer.textContent = '';
    // Small timeout ensures screen readers register the text change
    setTimeout(() => {
      existingAnnouncer.textContent = message;
    }, 50);
  }
}

