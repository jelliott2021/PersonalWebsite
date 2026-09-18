import { useCallback, useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { prefersDarkScheme, prefersReducedMotion } from '../lib/motion';
import { readLocal, writeLocal } from '../lib/storage';

export type Theme = 'light' | 'dark';

/** Viewport point the theme wipe grows out of, usually the toggle button. */
export interface ToggleOrigin {
  x: number;
  y: number;
}

export const STORAGE_KEY = 'theme';

/** Browser chrome colours, matching --bg in tokens.css for each theme. */
export const THEME_COLORS: Record<Theme, string> = {
  light: '#f7f4ec',
  dark: '#0a1424',
};

/** Length of the circular wipe, in milliseconds. */
export const WIPE_DURATION = 750;

type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void) => { ready: Promise<void> };
};

/**
 * Reads the theme that the inline script in index.html already applied to
 * <html>, falling back to the system preference.
 */
export const getInitialTheme = (): Theme => {
  const attr = document.documentElement.getAttribute('data-theme');
  if (attr === 'dark' || attr === 'light') {
    return attr;
  }
  return prefersDarkScheme() ? 'dark' : 'light';
};

/** Writes the theme to the document straight away, outside React's schedule. */
export const applyTheme = (theme: Theme): void => {
  document.documentElement.setAttribute('data-theme', theme);
  const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (meta) {
    meta.content = THEME_COLORS[theme];
  }
};

/**
 * Radius of a circle centred on (x, y) that covers the whole viewport, plus
 * a margin so the wipe clears the last corner while still moving.
 */
export const wipeRadius = (x: number, y: number, width: number, height: number): number =>
  Math.hypot(Math.max(x, width - x), Math.max(y, height - y)) * 1.05 + 24;

/**
 * Light/dark theme with persistence. A saved choice wins; otherwise the site
 * follows the operating system and keeps following it if it changes. Where
 * the browser supports view transitions, a toggled theme wipes across the
 * page in a circle that grows out of the toggle.
 */
const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') {
      return undefined;
    }
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (event: MediaQueryListEvent) => {
      if (!readLocal(STORAGE_KEY)) {
        setTheme(event.matches ? 'dark' : 'light');
      }
    };
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  const toggle = useCallback(
    (origin?: ToggleOrigin) => {
      const next: Theme = theme === 'dark' ? 'light' : 'dark';
      writeLocal(STORAGE_KEY, next);

      const doc = document as ViewTransitionDocument;
      if (!doc.startViewTransition || prefersReducedMotion()) {
        setTheme(next);
        return;
      }

      const x = origin?.x ?? window.innerWidth - 40;
      const y = origin?.y ?? 40;
      const radius = wipeRadius(x, y, window.innerWidth, window.innerHeight);

      const transition = doc.startViewTransition(() => {
        flushSync(() => setTheme(next));
        applyTheme(next);
      });

      transition.ready
        .then(() => {
          document.documentElement.animate(
            {
              clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`],
            },
            {
              duration: WIPE_DURATION,
              easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
              fill: 'forwards',
              pseudoElement: '::view-transition-new(root)',
            },
          );
        })
        .catch(() => {
          // The browser skipped the transition; the theme is already applied.
        });
    },
    [theme],
  );

  return { theme, toggle };
};

export default useTheme;
