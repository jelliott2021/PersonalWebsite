import { useCallback, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';

/** Browser chrome colours, matching --bg in tokens.css for each theme. */
const themeColors: Record<Theme, string> = {
  light: '#f7f4ec',
  dark: '#0a1424',
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

/**
 * Light/dark theme with persistence. The site opens in light mode and only
 * switches to dark when the visitor toggles it; that choice is remembered.
 */
const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (meta) {
      meta.content = themeColors[theme];
    }
  }, [theme]);

  const toggle = useCallback(() => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Ignore: the toggle still works for this page view.
    }
  }, [theme]);

  return { theme, toggle };
};

export default useTheme;
