import { renderHook } from '@testing-library/react';
import useLegacyRoutes, { LEGACY_PATHS, legacyTargetFor } from './useLegacyRoutes';
import { NAV_LINKS } from '../data/navigation';

const mountSection = (id: string): HTMLElement => {
  const section = document.createElement('section');
  section.id = id;
  document.body.appendChild(section);
  return section;
};

beforeEach(() => {
  jest.spyOn(window, 'requestAnimationFrame').mockImplementation(callback => {
    callback(0);
    return 1;
  });
  window.history.replaceState(null, '', '/');
});

afterEach(() => {
  document.body.innerHTML = '';
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

describe('useLegacyRoutes', () => {
  it('rewrites a legacy path to a hash and scrolls to the section', () => {
    const section = mountSection('projects');
    window.history.replaceState(null, '', '/projects');
    renderHook(() => useLegacyRoutes());
    expect(window.location.pathname).toBe('/');
    expect(window.location.hash).toBe('#projects');
    expect(section.scrollIntoView).toHaveBeenCalledWith({ block: 'start', behavior: 'instant' });
  });

  it('repeats the native hash jump once the content exists', () => {
    const section = mountSection('contact');
    window.history.replaceState(null, '', '/#contact');
    renderHook(() => useLegacyRoutes());
    expect(section.scrollIntoView).toHaveBeenCalledWith({ block: 'start', behavior: 'instant' });
  });

  it('does nothing on the root path without a hash', () => {
    renderHook(() => useLegacyRoutes());
    expect(window.requestAnimationFrame).not.toHaveBeenCalled();
  });

  it('copes with a hash that matches no element', () => {
    window.history.replaceState(null, '', '/#nowhere');
    expect(() => renderHook(() => useLegacyRoutes())).not.toThrow();
    expect(Element.prototype.scrollIntoView).not.toHaveBeenCalled();
  });
});
