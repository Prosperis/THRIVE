/**
 * TanStack Pacer utilities for debouncing, throttling, and rate limiting
 * 
 * This module provides convenient wrappers around TanStack Pacer functionality
 * for use throughout the application.
 */

import { createDebounce, createThrottle } from '@tanstack/react-pacer';

/**
 * Create a debounced function that delays invoking func until after wait milliseconds
 * have elapsed since the last time the debounced function was invoked.
 * 
 * @param func - The function to debounce
 * @param wait - The number of milliseconds to delay
 * @param options - Additional options (leading, trailing)
 * @returns A debounced version of the function
 * 
 * @example
 * ```ts
 * const debouncedSave = createDebouncedFn(saveSettings, 1000);
 * debouncedSave(newSettings); // Will only execute after 1s of no more calls
 * ```
 */
// biome-ignore lint/suspicious/noExplicitAny: Generic function signature requires any for flexibility
export function createDebouncedFn<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  options?: {
    leading?: boolean;
    trailing?: boolean;
  }
): (...args: Parameters<T>) => void {
  const debounced = createDebounce(func, {
    wait,
    leading: options?.leading,
    trailing: options?.trailing,
  });

  return (...args: Parameters<T>) => {
    debounced(...args);
  };
}

/**
 * Create a throttled function that only invokes func at most once per every wait milliseconds.
 * 
 * @param func - The function to throttle
 * @param wait - The number of milliseconds to throttle invocations to
 * @param options - Additional options (leading, trailing)
 * @returns A throttled version of the function
 * 
 * @example
 * ```ts
 * const throttledScroll = createThrottledFn(handleScroll, 100);
 * window.addEventListener('scroll', throttledScroll);
 * ```
 */
// biome-ignore lint/suspicious/noExplicitAny: Generic function signature requires any for flexibility
export function createThrottledFn<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  options?: {
    leading?: boolean;
    trailing?: boolean;
  }
): (...args: Parameters<T>) => void {
  const throttled = createThrottle(func, {
    wait,
    leading: options?.leading,
    trailing: options?.trailing,
  });

  return (...args: Parameters<T>) => {
    throttled(...args);
  };
}

/**
 * Common debounce timings for consistency across the app
 */
export const DEBOUNCE_TIMINGS = {
  /** Fast debounce for immediate feedback (150ms) */
  FAST: 150,
  /** Standard debounce for search inputs (300ms) */
  STANDARD: 300,
  /** Slow debounce for auto-save operations (1000ms) */
  SLOW: 1000,
  /** Very slow debounce for expensive operations (2000ms) */
  VERY_SLOW: 2000,
} as const;

/**
 * Common throttle timings for consistency across the app
 */
export const THROTTLE_TIMINGS = {
  /** Animation frame rate (~60fps = 16.67ms) */
  ANIMATION: 16.67,
  /** Fast throttle for scroll/resize handlers (100ms) */
  FAST: 100,
  /** Standard throttle for most UI interactions (250ms) */
  STANDARD: 250,
  /** Slow throttle for rate-limited operations (1000ms) */
  SLOW: 1000,
} as const;
