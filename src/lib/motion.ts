/**
 * Whether the visitor has asked the operating system to reduce motion.
 * Every animation on the site checks this and falls back to a static
 * presentation. Returns false where `matchMedia` is unavailable.
 */
export const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Whether the operating system is set to a dark colour scheme. */
export const prefersDarkScheme = (): boolean =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-color-scheme: dark)').matches;
