import { act, renderHook } from '@testing-library/react';
import useTheme, {
  STORAGE_KEY,
  THEME_COLORS,
  WIPE_DURATION,
  applyTheme,
  getInitialTheme,
  wipeRadius,
} from './useTheme';
import { fireMediaQueryChange, setMediaQuery } from '../test-utils/dom';

/** Loosely typed so tests can install partial view-transition stubs. */
const doc = document as unknown as { startViewTransition?: unknown };

const html = () => document.documentElement;

const mountThemeMeta = (): HTMLMetaElement => {
  const meta = document.createElement('meta');
  meta.name = 'theme-color';
  document.head.appendChild(meta);
  return meta;
};

afterEach(() => {
  document.head.innerHTML = '';
  delete doc.startViewTransition;
});

describe('getInitialTheme', () => {
  it('reads the attribute the inline script applied', () => {
    html().setAttribute('data-theme', 'dark');
    expect(getInitialTheme()).toBe('dark');
    html().setAttribute('data-theme', 'light');
    expect(getInitialTheme()).toBe('light');
  });

  it('falls back to the system preference', () => {
    expect(getInitialTheme()).toBe('light');
    setMediaQuery('(prefers-color-scheme: dark)', true);
    expect(getInitialTheme()).toBe('dark');
  });

  it('ignores an unknown attribute value', () => {
    html().setAttribute('data-theme', 'sepia');
    expect(getInitialTheme()).toBe('light');
  });
});

describe('applyTheme', () => {
  it('sets the attribute and the browser chrome colour', () => {
    const meta = mountThemeMeta();
    applyTheme('dark');
    expect(html()).toHaveAttribute('data-theme', 'dark');
    expect(meta.content).toBe(THEME_COLORS.dark);
  });

  it('copes without a theme-color meta tag', () => {
    expect(() => applyTheme('light')).not.toThrow();
    expect(html()).toHaveAttribute('data-theme', 'light');
  });
});

describe('wipeRadius', () => {
  it('covers the farthest corner with a margin', () => {
    // From the top-left corner the farthest corner is the full diagonal.
    expect(wipeRadius(0, 0, 300, 400)).toBeCloseTo(500 * 1.05 + 24);
    // From the centre every corner is half the diagonal away.
    expect(wipeRadius(150, 200, 300, 400)).toBeCloseTo(250 * 1.05 + 24);
  });
});

describe('useTheme', () => {
  it('applies the initial theme to the document', () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('light');
    expect(html()).toHaveAttribute('data-theme', 'light');
  });

  it('toggles, persists, and applies without view transitions', () => {
    const { result } = renderHook(() => useTheme());
    act(() => result.current.toggle());
    expect(result.current.theme).toBe('dark');
    expect(html()).toHaveAttribute('data-theme', 'dark');
    expect(localStorage.getItem(STORAGE_KEY)).toBe('dark');

    act(() => result.current.toggle());
    expect(result.current.theme).toBe('light');
    expect(localStorage.getItem(STORAGE_KEY)).toBe('light');
  });

  it('skips the wipe under reduced motion even when supported', () => {
    setMediaQuery('(prefers-reduced-motion: reduce)', true);
    const start = jest.fn();
    doc.startViewTransition = start;
    const { result } = renderHook(() => useTheme());
    act(() => result.current.toggle({ x: 10, y: 10 }));
    expect(start).not.toHaveBeenCalled();
    expect(result.current.theme).toBe('dark');
  });

  it('wipes the new theme in a circle from the toggle', async () => {
    let ready: () => void = () => undefined;
    const start = jest.fn((update: () => void) => {
      update();
      return {
        ready: new Promise<void>(resolve => {
          ready = resolve;
        }),
      };
    });
    doc.startViewTransition = start;
    const { result } = renderHook(() => useTheme());

    act(() => result.current.toggle({ x: 100, y: 50 }));
    expect(start).toHaveBeenCalledTimes(1);
    expect(result.current.theme).toBe('dark');
    expect(html()).toHaveAttribute('data-theme', 'dark');

    await act(async () => {
      ready();
    });
    const radius = wipeRadius(100, 50, window.innerWidth, window.innerHeight);
    expect(html().animate).toHaveBeenCalledWith(
      { clipPath: ['circle(0px at 100px 50px)', `circle(${radius}px at 100px 50px)`] },
      expect.objectContaining({
        duration: WIPE_DURATION,
        pseudoElement: '::view-transition-new(root)',
      }),
    );
  });

  it('defaults the wipe origin to the top-right corner', async () => {
    doc.startViewTransition = (update: () => void) => {
      update();
      return { ready: Promise.resolve() };
    };
    const { result } = renderHook(() => useTheme());
    await act(async () => result.current.toggle());
    const x = window.innerWidth - 40;
    expect(html().animate).toHaveBeenCalledWith(
      expect.objectContaining({ clipPath: [`circle(0px at ${x}px 40px)`, expect.any(String)] }),
      expect.any(Object),
    );
  });

  it('survives a browser that skips the transition', async () => {
    doc.startViewTransition = (update: () => void) => {
      update();
      return { ready: Promise.reject(new Error('skipped')) };
    };
    const { result } = renderHook(() => useTheme());
    await act(async () => result.current.toggle());
    expect(result.current.theme).toBe('dark');
    expect(html().animate).not.toHaveBeenCalled();
  });

  it('follows the system while no choice is saved', () => {
    const { result } = renderHook(() => useTheme());
    act(() => fireMediaQueryChange('(prefers-color-scheme: dark)', true));
    expect(result.current.theme).toBe('dark');
    act(() => fireMediaQueryChange('(prefers-color-scheme: dark)', false));
    expect(result.current.theme).toBe('light');
  });

  it('keeps a saved choice when the system changes', () => {
    localStorage.setItem(STORAGE_KEY, 'light');
    const { result } = renderHook(() => useTheme());
    act(() => fireMediaQueryChange('(prefers-color-scheme: dark)', true));
    expect(result.current.theme).toBe('light');
  });

  it('stops listening on unmount', () => {
    const { result, unmount } = renderHook(() => useTheme());
    unmount();
    act(() => fireMediaQueryChange('(prefers-color-scheme: dark)', true));
    expect(result.current.theme).toBe('light');
  });

  it('works without matchMedia', () => {
    Object.defineProperty(window, 'matchMedia', { configurable: true, value: undefined });
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('light');
    act(() => result.current.toggle());
    expect(result.current.theme).toBe('dark');
  });
});
