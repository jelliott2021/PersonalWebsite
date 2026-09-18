import { prefersDarkScheme, prefersReducedMotion } from './motion';
import { setMediaQuery } from '../test-utils/dom';

describe('prefersReducedMotion', () => {
  it('is false by default', () => {
    expect(prefersReducedMotion()).toBe(false);
  });

  it('follows the media query', () => {
    setMediaQuery('(prefers-reduced-motion: reduce)', true);
    expect(prefersReducedMotion()).toBe(true);
  });

  it('is false when matchMedia is unavailable', () => {
    Object.defineProperty(window, 'matchMedia', { configurable: true, value: undefined });
    expect(prefersReducedMotion()).toBe(false);
  });
});

describe('prefersDarkScheme', () => {
  it('is false by default', () => {
    expect(prefersDarkScheme()).toBe(false);
  });

  it('follows the media query', () => {
    setMediaQuery('(prefers-color-scheme: dark)', true);
    expect(prefersDarkScheme()).toBe(true);
  });

  it('is false when matchMedia is unavailable', () => {
    Object.defineProperty(window, 'matchMedia', { configurable: true, value: undefined });
    expect(prefersDarkScheme()).toBe(false);
  });
});
