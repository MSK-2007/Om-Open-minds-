import { useCallback } from 'react';
import { announceToScreenReader } from '@/utils/accessibility';

/**
 * Custom hook to trigger screen reader announcements.
 */
export function useAnnounce() {
  const announce = useCallback(
    (message: string, politeness: 'polite' | 'assertive' = 'polite') => {
      announceToScreenReader(message, politeness);
    },
    []
  );

  return { announce };
}

