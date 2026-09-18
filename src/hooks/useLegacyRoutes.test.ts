import { renderHook } from '@testing-library/react';
import useLegacyRoutes, {
  LEGACY_PATHS,
  SETTLE_MS,
  keepInView,
  legacyTargetFor,
} from './useLegacyRoutes';
import { NAV_LINKS } from '../data/navigation';
import { latestResizeObserver, resizeObservers } from '../test-utils/dom';

const SCROLL = { block: 'start', behavior: 'instant' };

const mountSection = (id: string): HTMLElement => {
  const section = document.createElement('section');
  section.id = id;
  document.body.appendChild(section);
  return section;
};

beforeEach(() => {
  jest.useFakeTimers();
  jest.spyOn(window, 'requestAnimationFrame').mockImplementation(callback => {
    callback(0);
    return 1;
  });
  window.history.replaceState(null, '', '/');
});

afterEach(() => {
  document.body.innerHTML = '';
  jest.useRealTimers();
});

describe('legacyTargetFor', () => {
  it('has one entry per navigation link', () => {
    expect(Object.keys(LEGACY_PATHS)).toHaveLength(NAV_LINKS.length);
  });

  it('matches old paths regardless of case and trailing slashes', () => {
    expect(legacyTargetFor('/projects')).toBe('projects');
    expect(legacyTargetFor('/Projects/')).toBe('projects');
    expect(legacyTargetFor('/SKILLS///')).toBe('skills');
  });

  it('ignores unknown paths', () => {
    expect(legacyTargetFor('/')).toBeUndefined();
    expect(legacyTargetFor('/blog')).toBeUndefined();
  });
});

describe('keepInView', () => {
  it('scrolls now and again whenever the page height changes', () => {
    const section = mountSection('skills');
    keepInView('skills');
    expect(section.scrollIntoView).toHaveBeenCalledTimes(1);
    expect(section.scrollIntoView).toHaveBeenCalledWith(SCROLL);

    const observer = latestResizeObserver();
    expect(observer.elements.has(document.body)).toBe(true);
    observer.trigger();
    observer.trigger();
    expect(section.scrollIntoView).toHaveBeenCalledTimes(3);
  });

  it('stops re-aligning once the settle window ends', () => {
    const section = mountSection('skills');
    keepInView('skills');
    const observer = latestResizeObserver();
    jest.advanceTimersByTime(SETTLE_MS);
    expect(observer.disconnected).toBe(true);
    observer.trigger();
    expect(section.scrollIntoView).toHaveBeenCalledTimes(1);
  });

  it('stops as soon as the visitor scrolls', () => {
    const section = mountSection('skills');
    keepInView('skills');
    window.dispatchEvent(new Event('wheel'));
    expect(latestResizeObserver().disconnected).toBe(true);
    latestResizeObserver().trigger();
    expect(section.scrollIntoView).toHaveBeenCalledTimes(1);
  });

  it('can be stopped by the caller', () => {
    mountSection('skills');
    const stop = keepInView('skills');
    stop();
    expect(latestResizeObserver().disconnected).toBe(true);
  });

  it('copes with a target that does not exist and no ResizeObserver', () => {
    Object.defineProperty(window, 'ResizeObserver', { configurable: true, value: undefined });
    expect(() => keepInView('nowhere')()).not.toThrow();
    expect(resizeObservers).toHaveLength(0);
  });
});

describe('useLegacyRoutes', () => {
  it('rewrites a legacy path to a hash and scrolls to the section', () => {
    const section = mountSection('projects');
    window.history.replaceState(null, '', '/projects');
    renderHook(() => useLegacyRoutes());
    expect(window.location.pathname).toBe('/');
    expect(window.location.hash).toBe('#projects');
    expect(section.scrollIntoView).toHaveBeenCalledWith(SCROLL);
  });

  it('repeats the native hash jump once the content exists', () => {
    const section = mountSection('contact');
    window.history.replaceState(null, '', '/#contact');
    renderHook(() => useLegacyRoutes());
    expect(section.scrollIntoView).toHaveBeenCalledWith(SCROLL);
  });

  it('does nothing on the root path without a hash', () => {
    renderHook(() => useLegacyRoutes());
    expect(window.requestAnimationFrame).not.toHaveBeenCalled();
  });

  it('stops watching on unmount', () => {
    mountSection('skills');
    window.history.replaceState(null, '', '/skills');
    const { unmount } = renderHook(() => useLegacyRoutes());
    const observer = latestResizeObserver();
    unmount();
    expect(observer.disconnected).toBe(true);
  });

  it('cancels a pending frame if unmounted before it fires', () => {
    (window.requestAnimationFrame as jest.Mock).mockImplementation(() => 7);
    const cancel = jest.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => undefined);
    window.history.replaceState(null, '', '/skills');
    const { unmount } = renderHook(() => useLegacyRoutes());
    unmount();
    expect(cancel).toHaveBeenCalledWith(7);
    expect(resizeObservers).toHaveLength(0);
  });
});
