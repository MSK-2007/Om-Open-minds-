import { ReactNode } from 'react';

/**
 * Standard status indicator for async data operations.
 */
export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';

/**
 * Standard operation state container.
 */
export interface AsyncState<T> {
  data: T | null;
  status: AsyncStatus;
  error: Error | null;
}

/**
 * Base props for presentational components accepting children and CSS classes.
 */
export interface BaseComponentProps {
  children?: ReactNode;
  className?: string;
}

/**
 * Accessible announcement message specification.
 */
export interface AccessibilityAnnouncement {
  message: string;
  politeness?: 'polite' | 'assertive';
}

