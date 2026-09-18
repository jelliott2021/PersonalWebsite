import { act, renderHook } from '@testing-library/react';
import useActiveSection from './useActiveSection';
import { intersectionObservers, latestObserver } from '../test-utils/dom';

const IDS = ['home', 'about', 'contact'];

const mountSections = (ids: string[] = IDS) => {
  ids.forEach(id => {
    const section = document.createElement('section');
    section.id = id;
    document.body.appendChild(section);
  });
};

/** Pretends the page is tall enough that the viewport is not at the bottom. */
const setPageHeight = (scrollHeight: number) => {
  Object.defineProperty(document.documentElement, 'scrollHeight', {
    configurable: true,
    value: scrollHeight,
  });
};

afterEach(() => {
  document.body.innerHTML = '';
});

describe('useActiveSection', () => {
  it('starts on the first id and observes nothing when no sections exist', () => {
    const { result } = renderHook(() => useActiveSection(IDS));
    expect(result.current).toBe('home');
    expect(intersectionObservers).toHaveLength(0);
  });

  it('returns an empty id for an empty list', () => {
    const { result } = renderHook(() => useActiveSection([]));
    expect(result.current).toBe('');
  });

  it('activates the lowest section crossing the reading line', () => {
    mountSections();
    setPageHeight(5000);
    const { result } = renderHook(() => useActiveSection(IDS));
    const observer = latestObserver();
    expect(observer.elements.size).toBe(3);

    act(() => observer.trigger(true, [document.getElementById('about') as Element]));
    expect(result.current).toBe('about');

    // Two sections intersect: the later one wins.
    act(() => observer.trigger(true, [document.getElementById('contact') as Element]));
    expect(result.current).toBe('contact');

    // Nothing intersects: keep the last answer.
    act(() => observer.trigger(false));
    expect(result.current).toBe('contact');
  });

  it('activates the last section when scrolled to the bottom', () => {
    mountSections();
    setPageHeight(0);
    const { result } = renderHook(() => useActiveSection(IDS));
    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });
    expect(result.current).toBe('contact');
  });

  it('re-evaluates on scroll and cleans up on unmount', () => {
    mountSections();
    setPageHeight(5000);
    const removeSpy = jest.spyOn(window, 'removeEventListener');
    const { result, unmount } = renderHook(() => useActiveSection(IDS));
    const observer = latestObserver();

    act(() => observer.trigger(true, [document.getElementById('about') as Element]));
    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });
    expect(result.current).toBe('about');

    unmount();
    expect(observer.disconnected).toBe(true);
    expect(removeSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
  });

  it('does nothing when IntersectionObserver is unavailable', () => {
    mountSections();
    Object.defineProperty(window, 'IntersectionObserver', { configurable: true, value: undefined });
    const { result } = renderHook(() => useActiveSection(IDS));
    expect(result.current).toBe('home');
  });
});
