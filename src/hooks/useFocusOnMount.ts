import { useEffect, useRef } from 'react';

/**
 * Hook to focus an element when the component mounts.
 * Ensures screen readers and keyboard users land on critical heading or container.
 */
export function useFocusOnMount<T extends HTMLElement>() {
  const elementRef = useRef<T>(null);

  useEffect(() => {
    if (elementRef.current) {
      elementRef.current.focus();
    }
  }, []);

  return elementRef;
}

