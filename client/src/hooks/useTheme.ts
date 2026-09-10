import { useCallback, useEffect, useState } from 'react';
import { flushSync } from 'react-dom';

export type Theme = 'light' | 'dark';

/** Viewport point the theme wipe grows out of, usually the toggle button. */
export interface ToggleOrigin {
  x: number;
  y: number;
}

const STORAGE_KEY = 'theme';

/** Browser chrome colours, matching --bg in tokens.css for each theme. */
const themeColors: Record<Theme, string> = {
  light: '#f7f4ec',
  dark: '#0a1424',
};

type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void) => { ready: Promise<void> };
};

/**
 * Reads the theme that the inline script in index.html already applied to
 * <html>. Light is the default; dark is only used when the visitor chose it.
 */
const getInitialTheme = (): Theme => {
  if (typeof document !== 'undefined') {
    const attr = document.documentElement.getAttribute('data-theme');
    if (attr === 'dark' || attr === 'light') {
      return attr;
    }
  }
  return 'light';
};

/** Writes the theme to the document straight away, outside React's schedule. */
const applyTheme = (theme: Theme) => {
  document.documentElement.setAttribute('data-theme', theme);
  const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (meta) {
    meta.content = themeColors[theme];
  }
};

/**
 * Light/dark theme with persistence. The site opens in light mode and only
 * switches to dark when the visitor toggles it; that choice is remembered.
 * Where the browser supports view transitions, the new theme wipes across
 * the page in a circle that grows out of the toggle.
 */
const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const toggle = useCallback(
    (origin?: ToggleOrigin) => {
      const next: Theme = theme === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // Ignore: the toggle still works for this page view.
      }

      const doc = document as ViewTransitionDocument;
      const reduceMotion =
        typeof window.matchMedia === 'function' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (!doc.startViewTransition || reduceMotion) {
        setTheme(next);
        return;
      }

      const x = origin?.x ?? window.innerWidth - 40;
      const y = origin?.y ?? 40;
      // Distance to the farthest corner, plus a margin so the circle clears the
      // corner while it is still moving instead of stalling on the last pixels.
      const radius =
        Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y)) * 1.05 +
        24;

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
              duration: 750,
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
