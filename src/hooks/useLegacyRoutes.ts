import { useEffect } from 'react';
import { NAV_LINKS } from '../data/navigation';

/**
 * The previous version of this site had separate pages. Old links such as
 * /projects should still land on the right section of the single page.
 * Maps a lower-case path like "/projects" to the section id "projects".
 */
export const LEGACY_PATHS: Readonly<Record<string, string>> = Object.fromEntries(
  NAV_LINKS.map(link => [`/${link.id}`, link.id]),
);

/**
 * How long after mount the page keeps re-aligning the target section while
 * late content (images, the GitHub calendar) is still changing the layout
 * above it. After this the visitor is left alone.
 */
export const SETTLE_MS = 4000;

/** Section id an old-style path points at, or undefined for any other path. */
export const legacyTargetFor = (pathname: string): string | undefined =>
  LEGACY_PATHS[pathname.replace(/\/+$/, '').toLowerCase()];

const scrollToId = (id: string) => {
  const target = document.getElementById(id);
  if (target) {
    target.scrollIntoView({ block: 'start', behavior: 'instant' });
  }
};

/**
 * Scrolls to the section now, then again whenever the page's height changes
 * during the settle window, so content that arrives after the first scroll
 * cannot push the section out of view. Stops early the moment the visitor
 * scrolls, so it never fights them. Returns a cleanup function.
 */
export const keepInView = (id: string): (() => void) => {
  scrollToId(id);

  if (typeof ResizeObserver === 'undefined') {
    return () => undefined;
  }

  const interactions = ['wheel', 'touchstart', 'keydown', 'pointerdown'] as const;
  const observer = new ResizeObserver(() => scrollToId(id));
  let timer = 0;
  const stop = () => {
    observer.disconnect();
    window.clearTimeout(timer);
    interactions.forEach(event => window.removeEventListener(event, stop));
  };
  timer = window.setTimeout(stop, SETTLE_MS);

  observer.observe(document.body);
  interactions.forEach(event => window.addEventListener(event, stop, { passive: true }));
  return stop;
};

/**
 * On load, rewrites a legacy path to the matching hash and scrolls there.
 * Also repeats the native hash jump, because the content renders after the
 * browser has already tried it.
 */
const useLegacyRoutes = (): void => {
  useEffect(() => {
    const legacyTarget = legacyTargetFor(window.location.pathname);
    const hash = window.location.hash.slice(1);
    const target = legacyTarget ?? hash;
    if (!target) {
      return undefined;
    }

    if (legacyTarget) {
      window.history.replaceState(null, '', `/#${legacyTarget}`);
    }

    let stop: (() => void) | undefined;
    const frame = window.requestAnimationFrame(() => {
      stop = keepInView(target);
    });
    return () => {
      window.cancelAnimationFrame(frame);
      stop?.();
    };
  }, []);
};

export default useLegacyRoutes;
