import { useEffect, useRef } from 'react';

interface LiveRegionProps {
  message: string;
  politeness?: 'polite' | 'assertive';
  clearOnUnmount?: boolean;
}

/**
 * Live Region for Screen Reader Announcements
 * Announces dynamic content changes to screen readers
 * Use for status updates, notifications, etc.
 */
export function LiveRegion({ 
  message, 
  politeness = 'polite',
  clearOnUnmount = true 
}: LiveRegionProps) {
  const regionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (regionRef.current && message) {
      // Clear and reset to trigger announcement
      regionRef.current.textContent = '';
      setTimeout(() => {
        if (regionRef.current) {
          regionRef.current.textContent = message;
        }
      }, 100);
    }

    return () => {
      if (clearOnUnmount && regionRef.current) {
        regionRef.current.textContent = '';
      }
    };
  }, [message, clearOnUnmount]);

  return (
    <div
      ref={regionRef}
      role="status"
      aria-live={politeness}
      aria-atomic="true"
      className="sr-only"
    />
  );
}

/**
 * Global Announcer Hook
 * Use this to announce messages from anywhere in the app
 */
export function useAnnouncer() {
  const announce = (message: string, politeness: 'polite' | 'assertive' = 'polite') => {
    const region = document.getElementById('global-announcer');
    if (region) {
      region.textContent = '';
      setTimeout(() => {
        region.textContent = message;
      }, 100);
      if (politeness) {
        region.setAttribute('aria-live', politeness);
      }
    }
  };

  return { announce };
}

/**
 * Global Announcer Component
 * Place this once in your root layout
 */
export function GlobalAnnouncer() {
  return (
    <div
      id="global-announcer"
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    />
  );
}
